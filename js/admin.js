/* =========================================================
   CHROMA · Panel de administración del catálogo
   ---------------------------------------------------------
   Lee y publica js/products.js directamente en el repositorio
   de GitHub. Solo quien tenga un token con permiso de escritura
   sobre el repo puede entrar y publicar cambios.
   ========================================================= */
(function () {
  "use strict";

  const CFG = window.CHROMA_CONFIG || {};
  const ADMIN = Object.assign({ repo: "", rama: "main" }, CFG.admin);
  const PRODUCTS_PATH = "js/products.js";
  const SALES_PATH = "data/ventas.json";
  const IMG_DIR = "assets/img/productos/";
  const TOKEN_KEY = "chroma-admin-token";
  const DRAFT_KEY = "chroma-admin-draft-v1";
  const SHEETS_KEY = "chroma-admin-sheets-key";     // clave secreta del Apps Script de Sheets (solo en este dispositivo)
  const SHEETS_QUEUE = "chroma-admin-sheets-queue"; // pedidos pendientes de enviar a Google Sheets
  const API = "https://api.github.com";

  /* ---------------- Utilidades ---------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const slug = (s) => norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "producto";
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const toInt = (v) => parseInt(String(v).replace(/[^\d]/g, ""), 10);
  const isHex = (v) => /^#[0-9a-f]{6}$/i.test(v);

  const money = new Intl.NumberFormat(CFG.locale || "es-CO", { style: "currency", currency: CFG.moneda || "COP", maximumFractionDigits: 0 });
  const fmt = (n) => money.format(n).replace(/ /g, " ");

  const store = {
    get(area, key) { try { return window[area].getItem(key); } catch (e) { return null; } },
    set(area, key, v) { try { window[area].setItem(key, v); return true; } catch (e) { return false; } },
    remove(key) { try { localStorage.removeItem(key); sessionStorage.removeItem(key); } catch (e) { /* noop */ } }
  };

  const utf8ToB64 = (str) => {
    const bytes = new TextEncoder().encode(str);
    let bin = "";
    bytes.forEach((b) => { bin += String.fromCharCode(b); });
    return btoa(bin);
  };
  const b64ToUtf8 = (b64) => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\s/g, "")), (c) => c.charCodeAt(0)));

  let toastTimer = null;
  function toast(msg, ms = 2800) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), ms);
  }

  /* ---------------- Estado ---------------- */
  const state = {
    token: "",
    original: [],     // catálogo tal como está publicado
    products: [],     // catálogo con los cambios locales
    images: {},       // { "assets/img/productos/x.jpg": "data:image/jpeg;base64,…" } pendientes de subir
    published: {},    // fotos ya subidas: se muestran desde memoria mientras el hosting despliega
    sha: null,        // sha del products.js cargado (para detectar cambios de otra persona)
    header: "",       // comentario de cabecera de products.js
    query: "",
    editing: null,    // { index, draft }
    sales: [],        // ventas registradas (data/ventas.json), la más reciente primero
    sale: null        // orden en revisión: { numero, fecha, cliente, totales, lines }
  };

  /* ---------------- GitHub ---------------- */
  async function gh(path, opts = {}) {
    const res = await fetch(API + path, {
      ...opts,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: "Bearer " + state.token,
        "X-GitHub-Api-Version": "2022-11-28",
        ...(opts.body ? { "Content-Type": "application/json" } : {})
      }
    });
    if (!res.ok) {
      const msg = (await res.json().catch(() => ({}))).message || res.statusText;
      const err = new Error(res.status === 403 && /not accessible/i.test(msg) ? NO_WRITE : msg);
      err.status = res.status;
      throw err;
    }
    return res.status === 204 ? null : res.json();
  }

  const NO_WRITE = "Tu clave de acceso solo permite leer. En GitHub, edita el token y pon «Contents» en «Read and write».";

  async function checkAccess() {
    const repo = await gh(`/repos/${ADMIN.repo}`);
    if (!repo.permissions || !repo.permissions.push) {
      const e = new Error("Esta clave no tiene permiso para editar la tienda.");
      e.status = 403;
      throw e;
    }
    // El rol de la cuenta no dice nada del permiso del token: probamos una escritura inofensiva
    // (un blob suelto, que no cambia ningún archivo ni crea commits).
    await gh(`/repos/${ADMIN.repo}/git/blobs`, { method: "POST", body: JSON.stringify({ content: "", encoding: "utf-8" }) });
  }

  function parseProducts(src) {
    const header = (src.match(/^\s*\/\*[\s\S]*?\*\//) || [""])[0].trim();
    // products.js solo asigna window.CHROMA_PRODUCTS; lo evaluamos con un "window" falso
    const list = new Function("window", src + "\n;return window.CHROMA_PRODUCTS;")({});
    if (!Array.isArray(list)) throw new Error("products.js no tiene un catálogo válido.");
    return { header, list };
  }

  async function loadCatalog() {
    const file = await gh(`/repos/${ADMIN.repo}/contents/${PRODUCTS_PATH}?ref=${encodeURIComponent(ADMIN.rama)}`);
    const { header, list } = parseProducts(b64ToUtf8(file.content));
    state.sha = file.sha;
    state.header = header;
    state.original = list;
    state.products = clone(list);
    state.images = {};
    restoreDraft();
  }

  async function loadSales() {
    try {
      const file = await gh(`/repos/${ADMIN.repo}/contents/${SALES_PATH}?ref=${encodeURIComponent(ADMIN.rama)}`);
      const data = JSON.parse(b64ToUtf8(file.content));
      return Array.isArray(data.ventas) ? data.ventas : [];
    } catch (e) {
      if (e.status === 404) return []; // aún no hay ventas registradas
      throw e;
    }
  }

  async function ensureLatestCatalog() {
    const current = await gh(`/repos/${ADMIN.repo}/contents/${PRODUCTS_PATH}?ref=${encodeURIComponent(ADMIN.rama)}`);
    if (current.sha !== state.sha) {
      throw new Error("El catálogo cambió desde otro lugar. Recarga la página para ver la última versión (tus cambios sin publicar se conservan).");
    }
  }

  // Un solo commit con varios archivos (Git Data API). tree: [{ path, content } | { path, sha }]
  async function commitFiles(files, message) {
    const r = `/repos/${ADMIN.repo}`;
    const tree = files.map((f) => Object.assign({ path: f.path, mode: "100644", type: "blob" }, f.sha ? { sha: f.sha } : { content: f.content }));
    const ref = await gh(`${r}/git/ref/heads/${encodeURIComponent(ADMIN.rama)}`);
    const head = await gh(`${r}/git/commits/${ref.object.sha}`);
    const newTree = await gh(`${r}/git/trees`, { method: "POST", body: JSON.stringify({ base_tree: head.tree.sha, tree }) });
    const commit = await gh(`${r}/git/commits`, { method: "POST", body: JSON.stringify({ message, tree: newTree.sha, parents: [head.sha] }) });
    await gh(`${r}/git/refs/heads/${encodeURIComponent(ADMIN.rama)}`, { method: "PATCH", body: JSON.stringify({ sha: commit.sha }) });
    const updated = await gh(`${r}/contents/${PRODUCTS_PATH}?ref=${encodeURIComponent(ADMIN.rama)}`);
    state.sha = updated.sha;
  }

  // Publica products.js + fotos nuevas
  async function publish() {
    await ensureLatestCatalog();
    const used = usedImagePaths();
    const files = [{ path: PRODUCTS_PATH, content: serialize(state.products) }];
    for (const [path, dataUrl] of Object.entries(state.images)) {
      if (!used.has(path)) continue;
      const blob = await gh(`/repos/${ADMIN.repo}/git/blobs`, { method: "POST", body: JSON.stringify({ content: dataUrl.split(",")[1], encoding: "base64" }) });
      files.push({ path, sha: blob.sha });
    }
    await commitFiles(files, "Catálogo: " + changeSummary().join(", "));
    state.original = clone(state.products);
    Object.assign(state.published, state.images);
    state.images = {};
    clearDraft();
  }

  /* ---------------- Serializar products.js ---------------- */
  const KEY_ORDER = ["id", "nombre", "categoria", "tipo", "precio", "precioAntes", "etiqueta", "descripcion", "imagen", "tonos"];
  const lit = (v) => JSON.stringify(v);

  function serialize(list) {
    const body = list.map((p) => {
      const lines = KEY_ORDER.filter((k) => p[k] !== undefined && p[k] !== "" && k !== "tonos").map((k) => `    ${k}: ${lit(p[k])}`);
      const tones = p.tonos.map((t) => {
        const parts = [`nombre: ${lit(t.nombre)}`, `hex: ${lit(t.hex)}`, `stock: ${t.stock}`];
        if (t.imagen) parts.push(`imagen: ${lit(t.imagen)}`);
        return `      { ${parts.join(", ")} }`;
      });
      lines.push(`    tonos: [\n${tones.join(",\n")}\n    ]`);
      return `  {\n${lines.join(",\n")}\n  }`;
    });
    return `${state.header ? state.header + "\n" : ""}window.CHROMA_PRODUCTS = [\n${body.join(",\n")}\n];\n`;
  }

  /* ---------------- Borrador local ---------------- */
  const dirty = () => JSON.stringify(state.products) !== JSON.stringify(state.original);

  function changeSummary() {
    const before = new Map(state.original.map((p) => [p.id, JSON.stringify(p)]));
    const after = new Set(state.products.map((p) => p.id));
    const out = [];
    const added = state.products.filter((p) => !before.has(p.id));
    const edited = state.products.filter((p) => before.has(p.id) && before.get(p.id) !== JSON.stringify(p));
    const removed = state.original.filter((p) => !after.has(p.id));
    if (added.length) out.push(`${added.length} nuevo${added.length > 1 ? "s" : ""} (${added.map((p) => p.nombre).join(", ")})`);
    if (edited.length) out.push(`${edited.length} editado${edited.length > 1 ? "s" : ""}`);
    if (removed.length) out.push(`${removed.length} eliminado${removed.length > 1 ? "s" : ""}`);
    if (!out.length && dirty()) out.push("orden actualizado");
    return out;
  }

  function usedImagePaths() {
    const set = new Set();
    state.products.forEach((p) => {
      if (p.imagen) set.add(p.imagen);
      p.tonos.forEach((t) => t.imagen && set.add(t.imagen));
    });
    return set;
  }

  function saveDraft() {
    if (!dirty()) { clearDraft(); return; }
    const draft = JSON.stringify({ sha: state.sha, products: state.products, images: state.images });
    if (!store.set("localStorage", DRAFT_KEY, draft)) {
      // Sin espacio para las fotos: al menos guarda los datos
      store.set("localStorage", DRAFT_KEY, JSON.stringify({ sha: state.sha, products: state.products, images: {} }));
    }
  }
  const clearDraft = () => { try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* noop */ } };

  function restoreDraft() {
    let d = null;
    try { d = JSON.parse(store.get("localStorage", DRAFT_KEY) || "null"); } catch (e) { d = null; }
    if (!d || !Array.isArray(d.products)) return;
    state.products = d.products;
    state.images = d.images || {};
    toast(d.sha === state.sha ? "Recuperamos tus cambios sin publicar" : "Recuperamos cambios sin publicar. Revísalos: el catálogo publicado cambió desde entonces.", 5000);
  }

  /* ---------------- Fotos ---------------- */
  // Redimensiona a máx. 1000 px y comprime a JPG para que la tienda cargue rápido
  function readImage(file) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith("image/")) { reject(new Error("El archivo no es una imagen.")); return; }
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const max = 1000, scale = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        const ctx = c.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        resolve(c.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("No pudimos leer la imagen.")); };
      img.src = url;
    });
  }
  const imgSrc = (path) => state.images[path] || state.published[path] || path;
  const newImagePath = (base) => `${IMG_DIR}${base}-${Date.now().toString(36)}.jpg`;

  /* ---------------- Lista ---------------- */
  function thumb(p) {
    const src = p.imagen || (p.tonos.find((t) => t.imagen) || {}).imagen;
    if (src) return `<img src="${esc(imgSrc(src))}" alt="" loading="lazy">`;
    const c = (p.tonos[0] || {}).hex || "#AF6AAE";
    return `<span class="plist__dot" style="--c:${esc(c)}"></span>`;
  }

  function status(p) {
    const orig = state.original.find((o) => o.id === p.id);
    if (!orig) return `<span class="pill pill--new">Nuevo · sin publicar</span>`;
    if (JSON.stringify(orig) !== JSON.stringify(p)) return `<span class="pill pill--edit">Editado · sin publicar</span>`;
    return "";
  }

  function renderList() {
    const q = norm(state.query);
    const items = state.products
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => !q || norm(`${p.nombre} ${p.categoria} ${p.tonos.map((t) => t.nombre).join(" ")}`).includes(q));

    $("#plist").innerHTML = items.map(({ p, i }) => {
      const stock = p.tonos.reduce((a, t) => a + (t.stock || 0), 0);
      const out = p.tonos.filter((t) => t.stock <= 0).length;
      return `<li class="plist__item">
        <button class="plist__main" data-edit="${i}" aria-label="Editar ${esc(p.nombre)}">
          <span class="plist__thumb">${thumb(p)}</span>
          <span class="plist__info">
            <span class="plist__name">${esc(p.nombre)} ${status(p)}</span>
            <span class="plist__meta">${esc(p.categoria)} · ${fmt(p.precio)}${p.precioAntes ? ` <s>${fmt(p.precioAntes)}</s>` : ""}</span>
            <span class="plist__meta">
              <span class="swatches swatches--sm">${p.tonos.map((t) => `<span class="swatch${t.stock <= 0 ? " is-out" : ""}" style="--c:${esc(t.hex)}" title="${esc(t.nombre)}: ${t.stock}"></span>`).join("")}</span>
              ${stock} en stock${out ? ` · <span class="warn">${out} agotado${out > 1 ? "s" : ""}</span>` : ""}
            </span>
          </span>
        </button>
        <span class="plist__order">
          <button class="icon-btn" data-move="${i}" data-dir="-1" aria-label="Subir ${esc(p.nombre)}" ${i === 0 ? "disabled" : ""}>↑</button>
          <button class="icon-btn" data-move="${i}" data-dir="1" aria-label="Bajar ${esc(p.nombre)}" ${i === state.products.length - 1 ? "disabled" : ""}>↓</button>
        </span>
      </li>`;
    }).join("") || `<li class="muted plist__empty">No hay productos${q ? " con esa búsqueda" : ""}.</li>`;

    const removed = state.original.filter((o) => !state.products.some((p) => p.id === o.id)).length;
    $("#panel-summary").textContent = `${state.products.length} productos en el catálogo${removed ? ` · ${removed} por eliminar` : ""}`;

    const changes = changeSummary();
    $("#publish-bar").hidden = !dirty();
    $("#pending-count").textContent = "Sin publicar: " + (changes.join(", ") || "cambios") + ".";
  }

  /* ---------------- Editor ---------------- */
  const editor = $("#editor");
  const form = $("#product-form");

  function categories() {
    return [...new Set(state.products.map((p) => p.categoria).filter(Boolean))];
  }

  function openEditor(index) {
    const isNew = index == null;
    const p = isNew
      ? { id: "", nombre: "", categoria: "", tipo: "labial", precio: "", descripcion: "", etiqueta: "Nuevo", tonos: [{ nombre: "", hex: "#C98A8E", stock: 1 }] }
      : clone(state.products[index]);
    state.editing = { index, draft: p };

    $("#editor-title").textContent = isNew ? "Nuevo producto" : "Editar producto";
    $("#delete-product").hidden = isNew;
    $("#cat-list").innerHTML = categories().map((c) => `<option value="${esc(c)}">`).join("");
    $("#p-nombre").value = p.nombre;
    $("#p-categoria").value = p.categoria;
    $("#p-tipo").value = p.tipo || "labial";
    $("#p-precio").value = p.precio || "";
    $("#p-precio-antes").value = p.precioAntes || "";
    $("#p-etiqueta").value = p.etiqueta || "";
    $("#p-descripcion").value = p.descripcion || "";
    $$(".field.has-error", form).forEach((f) => f.classList.remove("has-error"));
    $$(".error", form).forEach((e) => { e.textContent = ""; });
    renderPhoto();
    renderTones();
    editor.showModal();
    editor.querySelector(".editor__body").scrollTop = 0;
    if (isNew) $("#p-nombre").focus();
  }

  function renderPhoto() {
    const p = state.editing.draft;
    const hex = (p.tonos[0] || {}).hex || "#AF6AAE";
    $("#photo-preview").innerHTML = p.imagen
      ? `<img src="${esc(imgSrc(p.imagen))}" alt="Foto del producto">`
      : `<span class="plist__dot" style="--c:${esc(hex)}"></span>`;
    $("#photo-remove").hidden = !p.imagen;
  }

  function renderTones() {
    const tones = state.editing.draft.tonos;
    $("#tones").innerHTML = tones.map((t, i) => `<li class="tone-row" data-i="${i}">
        <input type="color" value="${esc(isHex(t.hex) ? t.hex : "#C98A8E")}" data-f="hex" aria-label="Color del tono ${i + 1}">
        <input type="text" value="${esc(t.nombre)}" data-f="nombre" placeholder="Ej: Rosa Nude" aria-label="Nombre del tono ${i + 1}" maxlength="40">
        <input type="number" value="${esc(t.stock)}" data-f="stock" min="0" step="1" inputmode="numeric" aria-label="Stock del tono ${i + 1}">
        <span class="tone-row__actions">
          <label class="icon-btn tone-row__photo${t.imagen ? " has-photo" : ""}" title="${t.imagen ? "Cambiar foto del tono" : "Foto del tono (opcional)"}">
            ${t.imagen ? `<img src="${esc(imgSrc(t.imagen))}" alt="">` : "📷"}
            <input type="file" accept="image/*" data-f="imagen" hidden>
          </label>
          <button type="button" class="icon-btn" data-remove-tone aria-label="Quitar tono ${i + 1}" ${tones.length === 1 ? "disabled" : ""}>✕</button>
        </span>
      </li>`).join("");
  }

  function readForm() {
    const p = state.editing.draft;
    p.nombre = $("#p-nombre").value.trim();
    p.categoria = $("#p-categoria").value.trim();
    p.categoria = p.categoria && p.categoria[0].toUpperCase() + p.categoria.slice(1);
    p.tipo = $("#p-tipo").value;
    p.precio = toInt($("#p-precio").value);
    const antes = toInt($("#p-precio-antes").value);
    if (antes) p.precioAntes = antes; else delete p.precioAntes;
    const etiqueta = $("#p-etiqueta").value.trim();
    if (etiqueta) p.etiqueta = etiqueta; else delete p.etiqueta;
    p.descripcion = $("#p-descripcion").value.trim();
    p.tonos.forEach((t) => { t.nombre = t.nombre.trim(); });
    return p;
  }

  function setError(input, msg) {
    const field = input.closest(".field");
    field.classList.toggle("has-error", !!msg);
    field.querySelector(".error").textContent = msg || "";
    return !msg;
  }

  function validate(p) {
    let ok = true;
    ok = setError($("#p-nombre"), p.nombre.length < 2 ? "Escribe el nombre del producto." : "") && ok;
    ok = setError($("#p-categoria"), !p.categoria ? "Elige o escribe una categoría." : "") && ok;
    ok = setError($("#p-precio"), !(p.precio > 0) ? "Escribe el precio (solo números)." : "") && ok;
    ok = setError($("#p-precio-antes"), p.precioAntes && p.precioAntes <= p.precio ? "Debe ser mayor que el precio actual." : "") && ok;
    let toneMsg = "";
    if (p.tonos.some((t) => !t.nombre)) toneMsg = "Cada tono necesita un nombre.";
    else if (new Set(p.tonos.map((t) => norm(t.nombre))).size !== p.tonos.length) toneMsg = "Hay tonos con el mismo nombre.";
    else if (p.tonos.some((t) => !(t.stock >= 0))) toneMsg = "El stock debe ser 0 o más.";
    $("#tones-error").textContent = toneMsg;
    ok = !toneMsg && ok;
    if (!ok) {
      const first = $(".field.has-error input", form) || $("#tones input", form);
      if (first) first.focus();
    }
    return ok;
  }

  function saveProduct() {
    const p = readForm();
    if (!validate(p)) return;
    const { index } = state.editing;
    if (index == null) {
      let id = slug(p.nombre), n = 2;
      while (state.products.some((x) => x.id === id) || state.original.some((x) => x.id === id)) id = `${slug(p.nombre)}-${n++}`;
      p.id = id;
      state.products.unshift(p); // los nuevos aparecen primero en la tienda
    } else {
      state.products[index] = p;
    }
    editor.close();
    saveDraft();
    renderList();
    toast(index == null ? `"${p.nombre}" agregado. Recuerda publicar.` : "Cambios guardados. Recuerda publicar.");
  }

  /* ---------------- Eventos del editor ---------------- */
  $("#tones").addEventListener("input", (e) => {
    const row = e.target.closest(".tone-row");
    const f = e.target.dataset.f;
    if (!row || !f || f === "imagen") return;
    const t = state.editing.draft.tonos[+row.dataset.i];
    t[f] = f === "stock" ? Math.max(0, parseInt(e.target.value, 10) || 0) : e.target.value;
    if (f === "hex" && +row.dataset.i === 0) renderPhoto();
  });

  $("#tones").addEventListener("change", async (e) => {
    if (e.target.dataset.f !== "imagen" || !e.target.files[0]) return;
    const i = +e.target.closest(".tone-row").dataset.i;
    const p = readForm();
    try {
      const data = await readImage(e.target.files[0]);
      const path = newImagePath(`${slug(p.nombre)}-${slug(p.tonos[i].nombre || "tono-" + (i + 1))}`);
      state.images[path] = data;
      p.tonos[i].imagen = path;
      renderTones();
    } catch (err) { toast(err.message); }
  });

  $("#tones").addEventListener("click", (e) => {
    if (!e.target.closest("[data-remove-tone]")) return;
    readForm();
    state.editing.draft.tonos.splice(+e.target.closest(".tone-row").dataset.i, 1);
    renderTones();
    renderPhoto();
  });

  $("#add-tone").addEventListener("click", () => {
    readForm();
    const tones = state.editing.draft.tonos;
    tones.push({ nombre: "", hex: (tones[tones.length - 1] || {}).hex || "#C98A8E", stock: 1 });
    renderTones();
    $$("#tones .tone-row:last-child input[data-f=nombre]")[0].focus();
  });

  $("#photo-input").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    const p = readForm();
    try {
      const data = await readImage(file);
      const path = newImagePath(slug(p.nombre || "producto"));
      state.images[path] = data;
      p.imagen = path;
      renderPhoto();
    } catch (err) { toast(err.message); }
  });

  $("#photo-remove").addEventListener("click", () => {
    delete state.editing.draft.imagen;
    renderPhoto();
  });

  form.addEventListener("input", (e) => {
    const field = e.target.closest(".field.has-error");
    if (field) setError(e.target, "");
    if (e.target.closest("#tones")) $("#tones-error").textContent = "";
  });
  form.addEventListener("submit", (e) => { e.preventDefault(); saveProduct(); });
  $$("[data-cancel]", form).forEach((b) => b.addEventListener("click", () => editor.close()));
  editor.addEventListener("click", (e) => { if (e.target === editor) editor.close(); });

  $("#delete-product").addEventListener("click", () => {
    const { index } = state.editing;
    const p = state.products[index];
    if (!confirm(`¿Eliminar "${p.nombre}" del catálogo?\nNo se borra de la tienda hasta que publiques.`)) return;
    state.products.splice(index, 1);
    editor.close();
    saveDraft();
    renderList();
    toast(`"${p.nombre}" eliminado. Recuerda publicar.`);
  });

  /* ---------------- Eventos del panel ---------------- */
  $("#add-product").addEventListener("click", () => openEditor(null));

  $("#plist").addEventListener("click", (e) => {
    const edit = e.target.closest("[data-edit]");
    if (edit) { openEditor(+edit.dataset.edit); return; }
    const mv = e.target.closest("[data-move]");
    if (mv) {
      const i = +mv.dataset.move, j = i + +mv.dataset.dir;
      [state.products[i], state.products[j]] = [state.products[j], state.products[i]];
      saveDraft();
      renderList();
      const again = $(`[data-move="${j}"][data-dir="${mv.dataset.dir}"]`);
      if (again && !again.disabled) again.focus();
    }
  });

  $("#admin-search").addEventListener("input", (e) => { state.query = e.target.value; renderList(); });

  $("#discard").addEventListener("click", () => {
    if (!confirm("¿Descartar todos los cambios sin publicar?")) return;
    state.products = clone(state.original);
    state.images = {};
    clearDraft();
    renderList();
    toast("Cambios descartados");
  });

  $("#publish").addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    btn.disabled = true;
    btn.textContent = "Publicando…";
    try {
      await publish();
      renderList();
      toast("¡Publicado! La tienda se actualiza en 1–2 minutos.", 4500);
    } catch (err) {
      toast(err.status === 401 ? "Tu clave expiró. Vuelve a entrar." : "No se pudo publicar: " + err.message, 6000);
      if (err.status === 401) logout();
    } finally {
      btn.disabled = false;
      btn.textContent = "Publicar cambios";
    }
  });

  $("#download").addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([serialize(state.products)], { type: "text/javascript" }));
    a.download = "products.js";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    if (Object.keys(state.images).length) toast("Ojo: las fotos nuevas solo se suben con “Publicar cambios”.", 4500);
  });

  window.addEventListener("beforeunload", (e) => {
    if (dirty()) { saveDraft(); e.preventDefault(); e.returnValue = ""; }
  });

  /* ---------------- Registrar venta ---------------- */
  // Lee el mensaje que genera la tienda (ver orderMessage en app.js). Tolera los "*" de WhatsApp
  // y el encabezado "[fecha] Nombre:" que se agrega al copiar mensajes del chat.
  function parseOrder(text) {
    const clean = String(text || "").replace(/\*/g, "").replace(/\r/g, "");
    const lines = clean.split("\n");
    const field = (label) => {
      const m = clean.match(new RegExp(`^\\s*${label}:\\s*(.+)$`, "im"));
      return m ? m[1].trim() : "";
    };
    const money = (label) => { const v = field(label); return /gratis/i.test(v) ? 0 : toInt(v) || 0; };
    const numero = (clean.match(/CHR-\d{6}-[A-Z0-9]{4}/i) || [""])[0].toUpperCase();

    const items = [];
    lines.forEach((line, i) => {
      const m = line.match(/^\s*\d+\.\s+(.+?)\s+[—–-]+\s+Tono:\s*(.+?)\s*$/i);
      if (!m) return;
      // "   2 × $ 32.000 = $ 64.000"
      const q = (lines[i + 1] || "").match(/^\s*(\d+)\s*[×xX]\s*([^=]*)/);
      items.push({ producto: m[1].trim(), tono: m[2].trim(), cantidad: q ? +q[1] : 1, precio: (q && toInt(q[2])) || 0 });
    });

    return {
      numero,
      fecha: field("Fecha"),
      cliente: {
        nombre: field("Nombre"), telefono: field("Celular"), ciudad: field("Ciudad"), direccion: field("Dirección"),
        barrio: field("Barrio / indicaciones"), metodoPago: field("Método de pago"), notas: field("Notas")
      },
      subtotal: money("Subtotal"), envio: money("Envío"), total: money("Total"),
      items
    };
  }

  // Relaciona cada línea de la orden con el producto y tono del catálogo publicado
  function matchItems(items) {
    return items.map((it) => {
      const pi = state.original.findIndex((p) => norm(p.nombre) === norm(it.producto));
      const p = state.original[pi];
      const ti = p ? p.tonos.findIndex((t) => norm(t.nombre) === norm(it.tono)) : -1;
      return Object.assign({}, it, {
        id: p ? p.id : null,
        toneIdx: ti,
        stock: ti >= 0 ? p.tonos[ti].stock : null,
        problema: !p ? "Producto no encontrado en el catálogo" : ti < 0 ? "Tono no encontrado" : ""
      });
    });
  }

  const saleDialog = $("#sale");
  const saleUnits = () => (state.sale ? state.sale.lines.filter((l) => !l.problema).reduce((a, l) => a + l.cantidad, 0) : 0);

  function openSale() {
    state.sale = null;
    $("#sale-text").value = "";
    $("#sale-error").textContent = "";
    showSaleStep(1);
    saleDialog.showModal();
    $("#sale-text").focus();
  }

  function showSaleStep(n) {
    $("#sale-step-1").hidden = n !== 1;
    $("#sale-step-2").hidden = n !== 2;
    $("#sale-review").hidden = n !== 1;
    $("#sale-back").hidden = n !== 2;
    $("#sale-confirm").hidden = n !== 2;
  }

  function reviewSale() {
    const err = $("#sale-error");
    const order = parseOrder($("#sale-text").value);
    if (!order.numero) { err.textContent = "No encontramos el número de orden (CHR-…). Pega el mensaje completo de la orden."; return; }
    if (!order.items.length) { err.textContent = "No encontramos productos en el mensaje. Pega el mensaje completo, desde “ORDEN DE COMPRA”."; return; }
    const dup = state.sales.find((v) => v.numero === order.numero);
    if (dup) { err.textContent = `La orden ${order.numero} ya fue registrada (${new Date(dup.registrada).toLocaleString(CFG.locale || "es-CO", { dateStyle: "short", timeStyle: "short" })}). No se descuenta dos veces.`; return; }
    err.textContent = "";
    state.sale = Object.assign(order, { lines: matchItems(order.items) });
    renderSale();
    showSaleStep(2);
  }

  function renderSale() {
    const s = state.sale;
    $("#sale-summary").innerHTML = `<strong>${esc(s.numero)}</strong>${s.cliente.nombre ? ` · ${esc(s.cliente.nombre)}` : ""}${s.total ? ` · ${fmt(s.total)}` : ""}`;
    $("#sale-lines").innerHTML = s.lines.map((l, i) => {
      const p = l.id && state.original.find((x) => x.id === l.id);
      const hex = p && l.toneIdx >= 0 ? p.tonos[l.toneIdx].hex : "#ccc";
      if (l.problema) {
        return `<li class="sale-line is-bad"><span class="swatch" style="--c:#ddd"></span>
          <span class="sale-line__name">${esc(l.producto)}<small>Tono: ${esc(l.tono)}</small><small class="warn">${esc(l.problema)}. No se descontará.</small></span></li>`;
      }
      const left = l.stock - l.cantidad;
      return `<li class="sale-line"><span class="swatch" style="--c:${esc(hex)}"></span>
        <span class="sale-line__name">${esc(l.producto)}<small>Tono: ${esc(l.tono)}</small>
          ${left < 0 ? `<small class="warn">Solo había ${l.stock} en stock: quedará en 0.</small>` : ""}</span>
        <label class="sale-line__qty"><span class="visually-hidden">Cantidad a descontar</span>
          <input type="number" min="0" step="1" inputmode="numeric" value="${l.cantidad}" data-line="${i}"></label>
        <span class="sale-line__stock">${l.stock} → <strong class="${left <= 0 ? "warn" : ""}">${Math.max(0, left)}</strong></span></li>`;
    }).join("");
    const units = saleUnits();
    const btn = $("#sale-confirm");
    btn.disabled = units === 0;
    btn.textContent = units ? `Descontar ${units} unidad${units > 1 ? "es" : ""}` : "Nada que descontar";
    $("#sale-pending").hidden = !dirty();
    $("#sale-confirm-error").textContent = "";
  }

  // Resta el stock en una lista de productos (no baja de 0)
  function applySale(list, lines) {
    lines.forEach((l) => {
      if (l.problema || !l.cantidad) return;
      const p = list.find((x) => x.id === l.id);
      const t = p && p.tonos.find((x) => norm(x.nombre) === norm(l.tono));
      if (t) t.stock = Math.max(0, t.stock - l.cantidad);
    });
    return list;
  }

  async function confirmSale() {
    const s = state.sale;
    const lines = s.lines.filter((l) => !l.problema && l.cantidad > 0);
    await ensureLatestCatalog();
    const sales = await loadSales(); // versión más reciente, por si se registró desde otro dispositivo
    if (sales.some((v) => v.numero === s.numero)) throw new Error(`La orden ${s.numero} ya estaba registrada.`);

    const record = {
      numero: s.numero,
      fechaOrden: s.fecha,
      registrada: new Date().toISOString(),
      items: lines.map((l) => ({ id: l.id, producto: l.producto, tono: l.tono, cantidad: l.cantidad }))
    };
    const nextSales = [record].concat(sales);
    // Solo se publica el catálogo ya publicado con el stock descontado; los cambios pendientes siguen pendientes
    const nextCatalog = applySale(clone(state.original), lines);
    await commitFiles([
      { path: PRODUCTS_PATH, content: serialize(nextCatalog) },
      { path: SALES_PATH, content: JSON.stringify({ ventas: nextSales }, null, 2) + "\n" }
    ], `Venta ${s.numero}: ${lines.map((l) => `${l.cantidad}× ${l.producto} (${l.tono})`).join(", ")}`);

    state.original = nextCatalog;
    applySale(state.products, lines);
    state.sales = nextSales;
    saveDraft();

    const payload = sheetPayload(s, record.registrada);
    document.dispatchEvent(new CustomEvent("chroma:venta", { detail: payload }));
    if (sheetsEnabled()) { queueSet(queueGet().concat([payload])); flushSheets(); }
  }

  /* ---------------- Google Sheets (vía Apps Script) ---------------- */
  // Pedido completo para la hoja: una línea por producto. Incluye datos de la clienta,
  // por eso NUNCA se guarda en el repo, solo se envía al Apps Script privado de la hoja.
  function sheetPayload(s, registrada) {
    const items = s.lines.filter((l) => l.cantidad > 0).map((l, i) => ({
      idLinea: `${s.numero}-${i + 1}`,
      producto: l.producto,
      tono: l.tono,
      cantidad: l.cantidad,
      precio: l.precio,
      total: l.precio * l.cantidad,
      stockDescontado: !l.problema
    }));
    return {
      numero: s.numero,
      fechaOrden: s.fecha,
      registrada,
      cliente: s.cliente,
      subtotal: s.subtotal,
      envio: s.envio,
      total: s.total,
      items
    };
  }

  const sheetsEnabled = () => !!ADMIN.sheetsWebhook;
  const queueGet = () => { try { return JSON.parse(store.get("localStorage", SHEETS_QUEUE) || "[]"); } catch (e) { return []; } };
  const queueSet = (q) => { if (q.length) store.set("localStorage", SHEETS_QUEUE, JSON.stringify(q)); else try { localStorage.removeItem(SHEETS_QUEUE); } catch (e) { /* noop */ } };
  let sheetsState = { sending: false, error: "" };

  // Apps Script no acepta peticiones con cabeceras propias (CORS), así que se envía como texto
  // plano y la clave va dentro del cuerpo. Siempre responde 200: el resultado viene en { ok, error }.
  async function sendToSheets(payload) {
    const res = await fetch(ADMIN.sheetsWebhook, {
      method: "POST",
      body: JSON.stringify(Object.assign({ clave: store.get("localStorage", SHEETS_KEY) || "" }, payload))
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data || !data.ok) {
      const err = new Error(
        data && data.error === "clave" ? "La clave de Sheets es incorrecta."
          : data && data.mensaje ? "Google Sheets: " + data.mensaje
          : "Google Sheets no respondió bien (" + res.status + ")."
      );
      err.status = res.status || 500;
      throw err;
    }
  }

  // Envía en orden los pedidos pendientes; los que fallan quedan para el siguiente intento
  async function flushSheets() {
    if (!sheetsEnabled() || sheetsState.sending) return;
    let queue = queueGet();
    if (!queue.length) { sheetsState.error = ""; renderSheets(); return; }
    if (!store.get("localStorage", SHEETS_KEY)) { sheetsState.error = "Falta configurar la clave de Sheets."; renderSheets(); return; }
    sheetsState = { sending: true, error: "" };
    renderSheets();
    while (queue.length) {
      try {
        await sendToSheets(queue[0]);
        queue = queue.slice(1);
        queueSet(queue);
      } catch (err) {
        sheetsState.error = err.status ? err.message : "Sin conexión a internet; se reintentará.";
        break;
      }
    }
    sheetsState.sending = false;
    renderSheets();
  }

  function renderSheets() {
    const box = $("#sheets-status");
    if (!sheetsEnabled()) { box.hidden = true; return; }
    box.hidden = false;
    const pending = queueGet().length;
    const hasKey = !!store.get("localStorage", SHEETS_KEY);
    let text;
    if (sheetsState.sending) text = "Enviando pedidos a Google Sheets…";
    else if (!hasKey) text = "Google Sheets: falta configurar la clave en este dispositivo.";
    else if (pending) text = `${pending} pedido${pending > 1 ? "s" : ""} pendiente${pending > 1 ? "s" : ""} de enviar a Google Sheets. ${sheetsState.error}`;
    else text = "Google Sheets: todos los pedidos están enviados ✓";
    $("#sheets-text").textContent = text;
    box.classList.toggle("is-warn", !sheetsState.sending && (!hasKey || pending > 0));
    $("#sheets-retry").hidden = !pending || sheetsState.sending || !hasKey;
  }

  $("#sheets-retry").addEventListener("click", flushSheets);
  $("#sheets-key").addEventListener("click", () => {
    const current = store.get("localStorage", SHEETS_KEY) || "";
    const key = prompt("Clave secreta de Google Sheets (la misma que pusiste en el Apps Script):", current);
    if (key == null) return;
    if (key.trim()) store.set("localStorage", SHEETS_KEY, key.trim());
    else try { localStorage.removeItem(SHEETS_KEY); } catch (e) { /* noop */ }
    renderSheets();
    flushSheets();
  });

  function renderSales() {
    const list = state.sales.slice(0, 20);
    $("#sales-count").textContent = state.sales.length;
    $("#sales-list").innerHTML = list.map((v) => `<li>
        <span><strong>${esc(v.numero)}</strong>
          <small class="muted">${new Date(v.registrada).toLocaleString(CFG.locale || "es-CO", { dateStyle: "medium", timeStyle: "short" })}</small></span>
        <span class="small">${v.items.map((it) => `${it.cantidad}× ${esc(it.producto)} <span class="muted">(${esc(it.tono)})</span>`).join("<br>")}</span>
      </li>`).join("") || `<li class="muted">Aún no hay ventas registradas.</li>`;
  }

  $("#register-sale").addEventListener("click", openSale);
  $("#sale-review").addEventListener("click", reviewSale);
  $("#sale-text").addEventListener("input", () => { $("#sale-error").textContent = ""; });
  $("#sale-back").addEventListener("click", () => showSaleStep(1));
  $$("[data-sale-cancel]").forEach((b) => b.addEventListener("click", () => saleDialog.close()));
  saleDialog.addEventListener("click", (e) => { if (e.target === saleDialog) saleDialog.close(); });

  $("#sale-lines").addEventListener("change", (e) => {
    const i = e.target.dataset.line;
    if (i == null) return;
    state.sale.lines[+i].cantidad = Math.max(0, parseInt(e.target.value, 10) || 0);
    renderSale();
  });

  $("#sale-confirm").addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    const label = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Descontando…";
    try {
      await confirmSale();
      saleDialog.close();
      renderList();
      renderSales();
      toast(`Venta ${state.sale.numero} registrada. Stock actualizado${sheetsEnabled() ? " y enviando a Sheets" : ""}.`, 4500);
    } catch (err) {
      const msg = err.status === 401 ? "Tu clave expiró. Vuelve a entrar." : "No se pudo registrar la venta: " + err.message;
      $("#sale-confirm-error").textContent = msg; // queda visible en el diálogo
      toast(msg, 6000);
      btn.disabled = false;
      btn.textContent = label;
      if (err.status === 401) { saleDialog.close(); logout(); }
    }
  });

  /* ---------------- Sesión ---------------- */
  function showPanel(on) {
    $("#login-view").hidden = on;
    $("#panel-view").hidden = !on;
    $("#logout").hidden = !on;
  }

  async function enter(token) {
    state.token = token;
    await checkAccess();
    await loadCatalog();
    state.sales = await loadSales();
    showPanel(true);
    renderList();
    renderSales();
    renderSheets();
    flushSheets();
  }

  function logout() {
    store.remove(TOKEN_KEY);
    state.token = "";
    showPanel(false);
    $("#token").value = "";
  }

  $("#logout").addEventListener("click", () => {
    if (dirty() && !confirm("Tienes cambios sin publicar. Se guardan en este dispositivo para la próxima vez. ¿Cerrar sesión?")) return;
    saveDraft();
    logout();
  });

  $("#login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = $("#token").value.trim();
    const err = $("#login-error");
    err.textContent = "";
    if (!token) { err.textContent = "Escribe tu clave de acceso."; return; }
    const btn = $("#login-btn");
    btn.disabled = true;
    btn.textContent = "Verificando…";
    try {
      await enter(token);
      store.set($("#remember").checked ? "localStorage" : "sessionStorage", TOKEN_KEY, token);
    } catch (ex) {
      state.token = "";
      err.textContent = ex.status === 401 ? "Clave incorrecta o vencida."
        : ex.status === 404 ? "Esta clave no tiene acceso a la tienda."
        : ex.message;
    } finally {
      btn.disabled = false;
      btn.textContent = "Entrar";
    }
  });

  (async function init() {
    if (!ADMIN.repo) {
      $("#login-error").textContent = "Falta configurar admin.repo en js/config.js.";
      $("#login-btn").disabled = true;
      return;
    }
    const saved = store.get("localStorage", TOKEN_KEY) || store.get("sessionStorage", TOKEN_KEY);
    if (!saved) return;
    try { await enter(saved); } catch (ex) {
      if (ex.status === 401 || ex.status === 403 || ex.status === 404) logout();
      $("#login-error").textContent = ex.status === 401 ? "Tu sesión expiró. Vuelve a entrar." : ex.message;
    }
  })();
})();
