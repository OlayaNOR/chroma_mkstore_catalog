/* =========================================================
   CHROMA · Lógica de la tienda (vanilla JS, sin dependencias)
   ========================================================= */
(function () {
  "use strict";

  const CFG = window.CHROMA_CONFIG || {};
  const PRODUCTS = window.CHROMA_PRODUCTS || [];
  const CART_KEY = "chroma-cart-v1";
  const CUSTOMER_KEY = "chroma-customer-v1";

  /* ---------------- Utilidades ---------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const money = new Intl.NumberFormat(CFG.locale || "es-CO", {
    style: "currency", currency: CFG.moneda || "COP", maximumFractionDigits: 0
  });
  const fmt = (n) => money.format(n).replace(/ /g, " ");

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  const storage = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* sin almacenamiento */ }
    },
    remove(key) { try { localStorage.removeItem(key); } catch (e) { /* noop */ } }
  };

  function hexToRgb(hex) {
    let h = String(hex).replace("#", "");
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const n = parseInt(h, 16) || 0;
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
  }
  // amt > 0 aclara hacia blanco, amt < 0 oscurece hacia negro (rango -1..1)
  function shade(hex, amt) {
    const [r, g, b] = hexToRgb(hex);
    const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
    return rgbToHex(r + (t - r) * p, g + (t - g) * p, b + (t - b) * p);
  }

  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const firstAvailableTone = (p) => Math.max(0, p.tonos.findIndex((t) => t.stock > 0));
  const isSoldOut = (p) => p.tonos.every((t) => t.stock <= 0);

  /* ---------------- Ilustraciones SVG por tono ---------------- */
  let svgSeq = 0;
  function illus(type, hex) {
    const id = "g" + (++svgSeq);
    const bg = shade(hex, 0.86), bg2 = shade(hex, 0.74);
    const c = hex, cl = shade(hex, 0.3), cd = shade(hex, -0.3);
    const defs = `<defs>
      <linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${cd}"/><stop offset=".45" stop-color="${cl}"/><stop offset="1" stop-color="${c}"/></linearGradient>
      <linearGradient id="${id}m" x1="0" x2="1"><stop offset="0" stop-color="#2a2228"/><stop offset=".5" stop-color="#5b4f58"/><stop offset="1" stop-color="#2a2228"/></linearGradient>
      <linearGradient id="${id}s" x1="0" x2="1"><stop offset="0" stop-color="#cfa9cd"/><stop offset=".5" stop-color="#f6e7f5"/><stop offset="1" stop-color="#b98cb7"/></linearGradient>
      <radialGradient id="${id}r" cx=".35" cy=".35" r=".8"><stop offset="0" stop-color="${cl}"/><stop offset="1" stop-color="${cd}"/></radialGradient>
    </defs>`;
    const back = `<rect x="-600" y="-600" width="1600" height="1600" fill="${bg}"/><circle cx="200" cy="215" r="150" fill="${bg2}"/><ellipse cx="200" cy="350" rx="110" ry="12" fill="#000" opacity=".08"/>`;
    let art = "";
    switch (type) {
      case "labial":
        art = `<rect x="160" y="200" width="80" height="148" rx="8" fill="url(#${id}m)"/>
          <rect x="166" y="160" width="68" height="46" rx="4" fill="url(#${id}s)"/>
          <path d="M174 162 V88 Q174 70 200 58 L226 74 V162 Z" fill="url(#${id})"/>
          <rect x="160" y="262" width="80" height="6" fill="url(#${id}s)" opacity=".8"/>`;
        break;
      case "gloss":
        art = `<rect x="174" y="58" width="52" height="96" rx="10" fill="url(#${id}m)"/>
          <rect x="168" y="150" width="64" height="200" rx="18" fill="#fff" opacity=".75"/>
          <rect x="176" y="166" width="48" height="176" rx="12" fill="url(#${id})"/>
          <rect x="186" y="176" width="8" height="150" rx="4" fill="#fff" opacity=".55"/>`;
        break;
      case "base":
        art = `<rect x="182" y="70" width="36" height="34" rx="4" fill="url(#${id}m)"/>
          <rect x="190" y="56" width="40" height="14" rx="4" fill="url(#${id}m)"/>
          <rect x="170" y="102" width="60" height="22" rx="4" fill="url(#${id}s)"/>
          <rect x="136" y="122" width="128" height="226" rx="22" fill="#fff" opacity=".8"/>
          <rect x="146" y="160" width="108" height="178" rx="16" fill="url(#${id})"/>
          <rect x="158" y="172" width="10" height="150" rx="5" fill="#fff" opacity=".45"/>`;
        break;
      case "rubor":
        art = `<ellipse cx="200" cy="150" rx="118" ry="44" fill="url(#${id}s)"/>
          <ellipse cx="200" cy="150" rx="104" ry="36" fill="#fff" opacity=".6"/>
          <ellipse cx="200" cy="262" rx="124" ry="62" fill="url(#${id}m)"/>
          <ellipse cx="200" cy="252" rx="124" ry="58" fill="url(#${id}s)"/>
          <ellipse cx="200" cy="250" rx="100" ry="44" fill="url(#${id}r)"/>
          <path d="M150 238 q50 -26 100 0" stroke="#fff" stroke-width="5" fill="none" opacity=".35" stroke-linecap="round"/>`;
        break;
      case "polvo":
        art = `<ellipse cx="200" cy="120" rx="96" ry="30" fill="url(#${id}m)"/>
          <path d="M104 240 V296 Q200 340 296 296 V240 Z" fill="url(#${id}m)"/>
          <ellipse cx="200" cy="240" rx="96" ry="34" fill="#fff" opacity=".85"/>
          <ellipse cx="200" cy="242" rx="82" ry="26" fill="url(#${id}r)"/>
          <circle cx="182" cy="236" r="3" fill="#fff" opacity=".6"/><circle cx="220" cy="246" r="2" fill="#fff" opacity=".6"/>`;
        break;
      case "sombras": {
        const tones = [0.55, 0.3, 0.1, 0.4, 0, -0.2, 0.15, -0.35, -0.55];
        let pans = "";
        tones.forEach((t, i) => {
          const x = 116 + (i % 3) * 58, y = 120 + Math.floor(i / 3) * 58;
          pans += `<rect x="${x}" y="${y}" width="48" height="48" rx="8" fill="${shade(hex, t)}"/>`;
          if (i % 2 === 0) pans += `<rect x="${x + 6}" y="${y + 6}" width="14" height="5" rx="2" fill="#fff" opacity=".45"/>`;
        });
        art = `<rect x="96" y="100" width="208" height="214" rx="20" fill="url(#${id}m)"/>${pans}`;
        break;
      }
      case "mascara":
        art = `<g transform="rotate(-24 200 210)">
          <rect x="178" y="40" width="44" height="120" rx="12" fill="url(#${id}m)"/>
          <rect x="174" y="156" width="52" height="16" rx="3" fill="url(#${id}s)"/>
          <rect x="180" y="172" width="40" height="176" rx="16" fill="url(#${id})"/>
          <rect x="188" y="182" width="6" height="150" rx="3" fill="#fff" opacity=".3"/></g>`;
        break;
      case "delineador":
        art = `<g transform="rotate(-30 200 210)">
          <rect x="186" y="40" width="28" height="110" rx="8" fill="url(#${id}m)"/>
          <rect x="184" y="148" width="32" height="10" rx="2" fill="url(#${id}s)"/>
          <rect x="186" y="158" width="28" height="160" rx="6" fill="url(#${id})"/>
          <path d="M190 318 L200 358 L210 318 Z" fill="${cd}"/></g>`;
        break;
      case "esmalte":
        art = `<rect x="178" y="56" width="44" height="110" rx="8" fill="url(#${id}m)"/>
          <rect x="172" y="160" width="56" height="18" rx="4" fill="#fff" opacity=".85"/>
          <path d="M132 210 Q132 178 168 176 H232 Q268 178 268 210 V320 Q268 350 236 350 H164 Q132 350 132 320 Z" fill="#fff" opacity=".8"/>
          <path d="M142 214 Q142 188 170 188 H230 Q258 188 258 214 V318 Q258 340 234 340 H166 Q142 340 142 318 Z" fill="url(#${id})"/>
          <rect x="154" y="200" width="12" height="120" rx="6" fill="#fff" opacity=".4"/>`;
        break;
      default:
        art = `<circle cx="200" cy="210" r="96" fill="url(#${id}r)"/>`;
    }
    return `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid meet">${defs}${back}${art}</svg>`;
  }

  function mediaHTML(p, toneIdx, alt) {
    const tone = p.tonos[toneIdx] || p.tonos[0];
    const src = tone.imagen || p.imagen;
    if (src) return `<img src="${esc(src)}" alt="${esc(alt || p.nombre + " tono " + tone.nombre)}" loading="lazy" decoding="async">`;
    return illus(p.tipo, tone.hex);
  }

  function swatchesHTML(p, selected, size) {
    return p.tonos.map((t, i) => `<button type="button" class="swatch${t.stock <= 0 ? " is-out" : ""}" role="radio"
        aria-checked="${i === selected}" data-tone="${i}" style="--c:${esc(t.hex)}"
        title="${esc(t.nombre)}${t.stock <= 0 ? " (agotado)" : ""}" aria-label="${esc(t.nombre)}${t.stock <= 0 ? ", agotado" : ""}"></button>`).join("");
  }

  function priceHTML(p) {
    return `${fmt(p.precio)}${p.precioAntes ? `<s>${fmt(p.precioAntes)}</s>` : ""}`;
  }

  /* ---------------- Estado ---------------- */
  const state = {
    category: "Todos",
    query: "",
    sort: "destacados",
    tones: Object.fromEntries(PRODUCTS.map((p) => [p.id, firstAvailableTone(p)])),
    cart: [],
    step: 1,
    modal: null, // { id, tone, qty }
    lastOrder: null
  };

  /* ---------------- Carrito ---------------- */
  function loadCart() {
    const raw = storage.get(CART_KEY, []);
    state.cart = (Array.isArray(raw) ? raw : []).filter((it) => {
      const p = byId(it.id);
      const t = p && p.tonos[it.tone];
      if (!t || t.stock <= 0) return false;
      it.qty = Math.max(1, Math.min(t.stock, parseInt(it.qty, 10) || 1));
      return true;
    });
  }
  const saveCart = () => storage.set(CART_KEY, state.cart);
  const cartCount = () => state.cart.reduce((a, it) => a + it.qty, 0);
  const subtotal = () => state.cart.reduce((a, it) => a + byId(it.id).precio * it.qty, 0);
  function shippingCost(sub) {
    const e = CFG.envio || {};
    if (!sub) return 0;
    if (e.gratisDesde && sub >= e.gratisDesde) return 0;
    return e.costo || 0;
  }

  function addToCart(id, tone, qty) {
    const p = byId(id);
    const t = p && p.tonos[tone];
    if (!t || t.stock <= 0) { toast("Ese tono está agotado"); return false; }
    const line = state.cart.find((it) => it.id === id && it.tone === tone);
    const current = line ? line.qty : 0;
    const allowed = Math.min(qty, t.stock - current);
    if (allowed <= 0) { toast(`Solo hay ${t.stock} unidades de ${t.nombre}`); return false; }
    if (line) line.qty += allowed; else state.cart.push({ id, tone, qty: allowed });
    saveCart();
    updateCartUI(true);
    toast(allowed < qty
      ? `Agregamos ${allowed} (stock máximo de ${t.nombre})`
      : `${p.nombre} · ${t.nombre} agregado al carrito`);
    return true;
  }

  function setQty(index, qty) {
    const it = state.cart[index];
    if (!it) return;
    const t = byId(it.id).tonos[it.tone];
    if (qty <= 0) state.cart.splice(index, 1);
    else it.qty = Math.min(qty, t.stock);
    saveCart();
    updateCartUI(false);
  }

  /* ---------------- Render catálogo ---------------- */
  const grid = $("#grid");

  function categories() {
    return ["Todos", ...new Set(PRODUCTS.map((p) => p.categoria))];
  }

  function renderCategories() {
    $("#categories").innerHTML = categories().map((c) =>
      `<button type="button" class="chip" role="tab" aria-selected="${c === state.category}" data-cat="${esc(c)}">${esc(c)}</button>`
    ).join("");
  }

  function filtered() {
    const q = norm(state.query).trim();
    let list = PRODUCTS.filter((p) => state.category === "Todos" || p.categoria === state.category);
    if (q) {
      const terms = q.split(/\s+/);
      list = list.filter((p) => {
        const hay = norm([p.nombre, p.categoria, p.descripcion, p.etiqueta, ...p.tonos.map((t) => t.nombre)].join(" "));
        return terms.every((t) => hay.includes(t));
      });
    }
    const sorted = list.slice();
    if (state.sort === "precio-asc") sorted.sort((a, b) => a.precio - b.precio);
    if (state.sort === "precio-desc") sorted.sort((a, b) => b.precio - a.precio);
    if (state.sort === "nombre") sorted.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    // los agotados al final
    sorted.sort((a, b) => isSoldOut(a) - isSoldOut(b));
    return sorted;
  }

  function toneLabel(p, ti) {
    const t = p.tonos[ti];
    return t.stock <= 0 ? `${esc(t.nombre)} · <span class="out">Agotado</span>` : esc(t.nombre);
  }

  function cardHTML(p, i) {
    const ti = state.tones[p.id];
    const t = p.tonos[ti];
    const soldOut = isSoldOut(p);
    const off = p.precioAntes ? Math.round((1 - p.precio / p.precioAntes) * 100) : 0;
    return `<article class="card" data-id="${esc(p.id)}" style="animation-delay:${Math.min(i, 12) * 40}ms">
      ${p.etiqueta ? `<span class="tag">${esc(p.etiqueta)}</span>` : ""}
      ${off ? `<span class="tag tag--sale">-${off}%</span>` : ""}
      <button type="button" class="card__media" data-open aria-label="Ver ${esc(p.nombre)}">${mediaHTML(p, ti)}</button>
      <div class="card__body">
        <div>
          <span class="card__cat">${esc(p.categoria)}</span>
          <h3 class="card__title"><button type="button" data-open>${esc(p.nombre)}</button></h3>
        </div>
        <div class="swatches swatches--sm" role="radiogroup" aria-label="Tonos de ${esc(p.nombre)}">${swatchesHTML(p, ti)}</div>
        <span class="tone-name">${toneLabel(p, ti)}</span>
        <div class="card__foot">
          <p class="price">${priceHTML(p)}</p>
          <button type="button" class="add-btn" data-add ${t.stock <= 0 ? "disabled" : ""}>${soldOut ? "Agotado" : t.stock <= 0 ? "Tono agotado" : "Agregar"}</button>
        </div>
      </div>
    </article>`;
  }

  function renderGrid() {
    const list = filtered();
    grid.innerHTML = list.map(cardHTML).join("");
    $("#empty").hidden = list.length > 0;
    // Catálogo vacío (p. ej. mientras se cargan los productos) vs. búsqueda sin resultados
    $("#empty").textContent = PRODUCTS.length
      ? "No encontramos productos con esa búsqueda."
      : "Estamos preparando el catálogo. ¡Muy pronto verás aquí nuestros productos!";
    $("#result-count").textContent = PRODUCTS.length ? `${list.length} producto${list.length === 1 ? "" : "s"}` : "";
  }

  function refreshCard(id) {
    const card = grid.querySelector(`.card[data-id="${CSS.escape(id)}"]`);
    if (!card) return;
    const p = byId(id), ti = state.tones[id], t = p.tonos[ti];
    $(".card__media", card).innerHTML = mediaHTML(p, ti);
    $$(".swatch", card).forEach((s) => s.setAttribute("aria-checked", String(+s.dataset.tone === ti)));
    $(".tone-name", card).innerHTML = toneLabel(p, ti);
    const btn = $("[data-add]", card);
    btn.disabled = t.stock <= 0;
    btn.textContent = isSoldOut(p) ? "Agotado" : t.stock <= 0 ? "Tono agotado" : "Agregar";
  }

  /* ---------------- Overlays (modal / drawer) ---------------- */
  const overlay = $("#overlay");
  const modal = $("#product-modal");
  const drawer = $("#cart-drawer");
  let lastFocus = null;

  function openLayer(el) {
    lastFocus = document.activeElement;
    overlay.hidden = false;
    el.hidden = false;
    document.body.classList.add("no-scroll");
    const focusable = el.querySelector("[data-close]");
    if (focusable) focusable.focus({ preventScroll: true });
  }
  function closeLayers() {
    if (modal.hidden && drawer.hidden) return;
    modal.hidden = true;
    drawer.hidden = true;
    overlay.hidden = true;
    document.body.classList.remove("no-scroll");
    state.modal = null;
    if (state.step === 3) resetAfterOrder();
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }

  /* ---------------- Modal de producto ---------------- */
  function openProduct(id) {
    const p = byId(id);
    if (!p) return;
    state.modal = { id, tone: state.tones[id], qty: 1 };
    $("#pm-category").textContent = p.categoria;
    $("#pm-title").textContent = p.nombre;
    $("#pm-price").innerHTML = priceHTML(p);
    $("#pm-desc").textContent = p.descripcion || "";
    $("#pm-swatches").innerHTML = swatchesHTML(p, state.modal.tone);
    renderModal();
    openLayer(modal);
    modal.scrollTop = 0;
  }

  function renderModal() {
    const m = state.modal;
    if (!m) return;
    const p = byId(m.id), t = p.tonos[m.tone];
    const inCart = (state.cart.find((it) => it.id === m.id && it.tone === m.tone) || {}).qty || 0;
    const available = Math.max(0, t.stock - inCart);
    if (m.qty > available) m.qty = Math.max(1, available);

    $("#pm-media").innerHTML = mediaHTML(p, m.tone);
    $("#pm-tone-name").textContent = t.nombre;
    const st = $("#pm-stock");
    st.className = "stock";
    if (t.stock <= 0) { st.textContent = "Agotado"; st.classList.add("is-out"); }
    else if (available <= 0) { st.textContent = "Ya tienes todo el stock en el carrito"; st.classList.add("is-low"); }
    else if (t.stock <= 3) { st.textContent = `¡Últimas ${t.stock} unidades!`; st.classList.add("is-low"); }
    else st.textContent = "Disponible";

    $$("#pm-swatches .swatch").forEach((s) => s.setAttribute("aria-checked", String(+s.dataset.tone === m.tone)));
    $("#pm-qty").textContent = m.qty;
    $("#pm-minus").disabled = m.qty <= 1 || available <= 0;
    $("#pm-plus").disabled = m.qty >= available;
    const add = $("#pm-add");
    add.disabled = available <= 0;
    add.textContent = t.stock <= 0 ? "Tono agotado" : available <= 0 ? "Sin stock disponible" : `Agregar · ${fmt(p.precio * m.qty)}`;
  }

  /* ---------------- Drawer: carrito → envío → orden ---------------- */
  function cartItemHTML(it, i) {
    const p = byId(it.id), t = p.tonos[it.tone];
    return `<li class="cart-item" data-index="${i}">
      <div class="cart-item__img">${mediaHTML(p, it.tone)}</div>
      <div>
        <p class="cart-item__name">${esc(p.nombre)}</p>
        <p class="cart-item__tone"><i style="--c:${esc(t.hex)}"></i>${esc(t.nombre)}</p>
        <div class="qty qty--sm">
          <button type="button" data-qty="-1" aria-label="Restar">−</button>
          <span>${it.qty}</span>
          <button type="button" data-qty="1" aria-label="Sumar" ${it.qty >= t.stock ? "disabled" : ""}>+</button>
        </div>
      </div>
      <div class="cart-item__right">
        <span class="cart-item__price">${fmt(p.precio * it.qty)}</span>
        <button type="button" class="remove" data-remove>Quitar</button>
      </div>
    </li>`;
  }

  function totalsHTML() {
    const sub = subtotal(), ship = shippingCost(sub), e = CFG.envio || {};
    let hint = "";
    if (sub && e.gratisDesde && sub < e.gratisDesde) {
      hint = `<span class="hint">Te faltan ${fmt(e.gratisDesde - sub)} para envío gratis ✨</span>`;
    } else if (sub && e.gratisDesde) {
      hint = `<span class="hint">¡Tienes envío gratis! ✨</span>`;
    }
    return `${hint}
      <div><span>Subtotal (${cartCount()})</span><span>${fmt(sub)}</span></div>
      <div><span>Envío</span><span>${ship ? fmt(ship) : "Gratis"}</span></div>
      <div class="grand"><span>Total</span><span>${fmt(sub + ship)}</span></div>`;
  }

  function renderDrawer() {
    const s = state.step;
    $("#step-cart").hidden = s !== 1;
    $("#step-checkout").hidden = s !== 2;
    $("#step-order").hidden = s !== 3;
    $("#back-to-cart").hidden = s !== 2;
    $("#drawer-title").textContent = s === 1 ? "Tu carrito" : s === 2 ? "Datos de envío" : "Orden de compra";
    $$(".steps .step").forEach((el) => {
      const n = +el.dataset.step;
      el.classList.toggle("is-active", n === s);
      el.classList.toggle("is-done", n < s);
    });

    const primary = $("#drawer-primary");
    $("#order-actions").hidden = s !== 3;
    primary.hidden = s === 3;
    $("#totals").hidden = s === 3;

    if (s === 1) {
      const empty = state.cart.length === 0;
      $("#cart-list").innerHTML = state.cart.map(cartItemHTML).join("");
      $("#cart-empty").hidden = !empty;
      $("#drawer-foot").hidden = empty;
      primary.textContent = "Continuar con el envío";
    } else if (s === 2) {
      $("#drawer-foot").hidden = false;
      primary.textContent = "Generar orden de compra";
    } else {
      $("#drawer-foot").hidden = false;
    }
    $("#totals").innerHTML = totalsHTML();
  }

  function updateCartUI(bump) {
    const n = cartCount();
    const badge = $("#cart-count");
    badge.textContent = n;
    badge.hidden = n === 0;
    if (bump) { badge.classList.remove("bump"); void badge.offsetWidth; badge.classList.add("bump"); }
    $("#mobile-cart").hidden = n === 0 || state.step === 3;
    $("#mobile-cart-count").textContent = n;
    $("#mobile-cart-total").textContent = fmt(subtotal());
    if (!drawer.hidden && state.step !== 3) renderDrawer();
    if (state.step === 2 && state.cart.length === 0) { state.step = 1; renderDrawer(); }
    if (state.modal) renderModal();
  }

  function openCart() {
    if (state.step !== 3) state.step = 1;
    renderDrawer();
    openLayer(drawer);
  }

  /* ---------------- Checkout ---------------- */
  const form = $("#checkout-form");

  function renderPayOptions() {
    $("#pay-options").innerHTML = (CFG.metodosPago || []).map((m, i) => `
      <label class="pay">
        <input type="radio" name="pago" value="${esc(m.id)}">
        <span><strong>${esc(m.nombre)}</strong><span>${esc(m.detalle || "")}</span></span>
      </label>`).join("");
  }

  function fillSavedCustomer() {
    const c = storage.get(CUSTOMER_KEY, null);
    if (!c) return;
    ["nombre", "telefono", "ciudad", "departamento", "direccion", "barrio"].forEach((k) => {
      if (c[k] && form.elements[k]) form.elements[k].value = c[k];
    });
    if (c.pago) {
      const r = form.querySelector(`input[name="pago"][value="${CSS.escape(c.pago)}"]`);
      if (r) r.checked = true;
    }
  }

  function setError(input, msg) {
    const field = input.closest(".field");
    field.classList.toggle("has-error", !!msg);
    const e = $(".error", field);
    if (e) e.textContent = msg || "";
  }

  function validate() {
    const f = form.elements;
    const v = (k) => (f[k].value || "").trim();
    let firstBad = null;
    const check = (k, ok, msg) => {
      setError(f[k], ok ? "" : msg);
      if (!ok && !firstBad) firstBad = f[k];
    };
    check("nombre", v("nombre").length >= 3, "Escribe tu nombre completo");
    const digits = v("telefono").replace(/\D/g, "");
    check("telefono", digits.length >= 7 && digits.length <= 15, "Escribe un número de celular válido");
    check("ciudad", v("ciudad").length >= 2, "Escribe tu ciudad");
    check("direccion", v("direccion").length >= 5, "Escribe la dirección de entrega");
    const pago = form.querySelector('input[name="pago"]:checked');
    $("#pay-error").textContent = pago ? "" : "Elige un método de pago";
    if (!pago && !firstBad) firstBad = form.querySelector('input[name="pago"]');
    if (firstBad) { firstBad.focus(); firstBad.scrollIntoView({ block: "center", behavior: "smooth" }); return null; }
    return {
      nombre: v("nombre"), telefono: v("telefono"), ciudad: v("ciudad"), departamento: v("departamento"),
      direccion: v("direccion"), barrio: v("barrio"), notas: v("notas"), pago: pago.value
    };
  }

  function orderNumber(d) {
    const p = (n) => String(n).padStart(2, "0");
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `CHR-${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}-${rand}`;
  }

  function buildOrder(customer) {
    const now = new Date();
    const items = state.cart.map((it) => {
      const p = byId(it.id), t = p.tonos[it.tone];
      return { nombre: p.nombre, tono: t.nombre, cantidad: it.qty, precio: p.precio, total: p.precio * it.qty };
    });
    const sub = items.reduce((a, it) => a + it.total, 0);
    const ship = shippingCost(sub);
    const pago = (CFG.metodosPago || []).find((m) => m.id === customer.pago);
    return {
      numero: orderNumber(now),
      fecha: now.toLocaleString(CFG.locale || "es-CO", { dateStyle: "short", timeStyle: "short" }),
      items, subtotal: sub, envio: ship, total: sub + ship,
      cliente: customer, metodoPago: pago ? pago.nombre : customer.pago
    };
  }

  function orderMessage(o) {
    const c = o.cliente;
    const lines = [
      `🛍️ *ORDEN DE COMPRA · ${(CFG.nombreTienda || "Chroma").toUpperCase()}*`,
      `N.º ${o.numero}`,
      `Fecha: ${o.fecha}`,
      "",
      "*Productos*"
    ];
    o.items.forEach((it, i) => {
      lines.push(`${i + 1}. ${it.nombre} — Tono: ${it.tono}`);
      lines.push(`   ${it.cantidad} × ${fmt(it.precio)} = ${fmt(it.total)}`);
    });
    lines.push(
      "",
      `Subtotal: ${fmt(o.subtotal)}`,
      `Envío: ${o.envio ? fmt(o.envio) : "Gratis"}`,
      `*Total: ${fmt(o.total)}*`,
      "",
      "*Datos de envío*",
      `Nombre: ${c.nombre}`,
      `Celular: ${c.telefono}`,
      `Ciudad: ${c.ciudad}${c.departamento ? ", " + c.departamento : ""}`,
      `Dirección: ${c.direccion}`
    );
    if (c.barrio) lines.push(`Barrio / indicaciones: ${c.barrio}`);
    lines.push(`Método de pago: ${o.metodoPago}`);
    if (c.notas) lines.push(`Notas: ${c.notas}`);
    return lines.join("\n");
  }

  function submitCheckout() {
    if (!state.cart.length) { state.step = 1; renderDrawer(); return; }
    const customer = validate();
    if (!customer) return;
    storage.set(CUSTOMER_KEY, Object.assign({}, customer, { notas: "" }));
    const order = buildOrder(customer);
    const text = orderMessage(order);
    state.lastOrder = { order, text };

    $("#order-msg").textContent = text;
    const wa = $("#send-wa");
    const num = String(CFG.whatsapp || "").replace(/\D/g, "");
    if (num) {
      wa.hidden = false;
      wa.href = `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
    } else {
      wa.hidden = true;
    }

    // la orden queda generada: se vacía el carrito
    state.cart = [];
    saveCart();
    state.step = 3;
    renderDrawer();
    updateCartUI(false);
    $("#step-order").scrollTop = 0;
    document.dispatchEvent(new CustomEvent("chroma:order", { detail: order }));
  }

  function resetAfterOrder() {
    state.step = 1;
    state.lastOrder = null;
    form.elements.notas.value = "";
    updateCartUI(false);
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) { /* usa respaldo */ }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:-1000px;opacity:0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }

  /* ---------------- Toast ---------------- */
  let toastTimer = null;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2400);
  }

  /* ---------------- Eventos ---------------- */
  function bindEvents() {
    // Catálogo (delegación)
    grid.addEventListener("click", (e) => {
      const card = e.target.closest(".card");
      if (!card) return;
      const id = card.dataset.id;
      const sw = e.target.closest(".swatch");
      if (sw) { state.tones[id] = +sw.dataset.tone; refreshCard(id); return; }
      if (e.target.closest("[data-add]")) { addToCart(id, state.tones[id], 1); return; }
      if (e.target.closest("[data-open]")) openProduct(id);
    });

    $("#categories").addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      state.category = chip.dataset.cat;
      renderCategories();
      renderGrid();
    });

    const searches = [$("#search-desktop"), $("#search-mobile")];
    let searchTimer = null;
    searches.forEach((input) => input.addEventListener("input", () => {
      searches.forEach((o) => { if (o !== input) o.value = input.value; });
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        state.query = input.value;
        renderGrid();
      }, 120);
    }));
    $("#search-desktop").addEventListener("keydown", (e) => {
      if (e.key === "Enter") $("#catalogo").scrollIntoView({ behavior: "smooth" });
    });

    $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; renderGrid(); });

    // Modal producto
    $("#pm-swatches").addEventListener("click", (e) => {
      const sw = e.target.closest(".swatch");
      if (!sw || !state.modal) return;
      state.modal.tone = +sw.dataset.tone;
      state.modal.qty = 1;
      state.tones[state.modal.id] = state.modal.tone;
      refreshCard(state.modal.id);
      renderModal();
    });
    $("#pm-minus").addEventListener("click", () => { state.modal.qty = Math.max(1, state.modal.qty - 1); renderModal(); });
    $("#pm-plus").addEventListener("click", () => { state.modal.qty += 1; renderModal(); });
    $("#pm-add").addEventListener("click", () => {
      const m = state.modal;
      if (addToCart(m.id, m.tone, m.qty)) closeLayers();
    });

    // Abrir / cerrar
    $("#open-cart").addEventListener("click", openCart);
    $("#mobile-cart").addEventListener("click", openCart);
    overlay.addEventListener("click", closeLayers);
    $$("[data-close]").forEach((b) => b.addEventListener("click", closeLayers));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLayers(); });

    // Carrito
    $("#cart-list").addEventListener("click", (e) => {
      const li = e.target.closest(".cart-item");
      if (!li) return;
      const i = +li.dataset.index;
      const q = e.target.closest("[data-qty]");
      if (q) setQty(i, state.cart[i].qty + (+q.dataset.qty));
      if (e.target.closest("[data-remove]")) setQty(i, 0);
    });

    $("#drawer-primary").addEventListener("click", () => {
      if (state.step === 1) {
        if (!state.cart.length) return;
        state.step = 2;
        renderDrawer();
        $("#step-checkout").scrollTop = 0;
        setTimeout(() => { if (!form.elements.nombre.value) form.elements.nombre.focus({ preventScroll: true }); }, 50);
      } else if (state.step === 2) {
        submitCheckout();
      }
    });
    $("#back-to-cart").addEventListener("click", () => { state.step = 1; renderDrawer(); });
    form.addEventListener("submit", (e) => { e.preventDefault(); submitCheckout(); });
    form.addEventListener("input", (e) => {
      if (e.target.closest(".field.has-error")) setError(e.target, "");
      if (e.target.name === "pago") $("#pay-error").textContent = "";
    });
    form.addEventListener("change", (e) => { if (e.target.name === "pago") $("#pay-error").textContent = ""; });

    // Orden
    $("#copy-order").addEventListener("click", async () => {
      if (!state.lastOrder) return;
      const ok = await copyText(state.lastOrder.text);
      toast(ok ? "Orden copiada. ¡Pégala en el chat!" : "No se pudo copiar, selecciona el texto manualmente");
    });
    $("#new-order").addEventListener("click", () => { closeLayers(); });
  }

  /* ---------------- Inicio ---------------- */
  function renderFooter() {
    const links = [];
    if (CFG.instagram) links.push(`<a href="https://instagram.com/${encodeURIComponent(CFG.instagram)}" target="_blank" rel="noopener">Instagram @${esc(CFG.instagram)}</a>`);
    const num = String(CFG.whatsapp || "").replace(/\D/g, "");
    if (num) links.push(`<a href="https://wa.me/${num}" target="_blank" rel="noopener">WhatsApp</a>`);
    $("#footer-links").innerHTML = links.join("");
    $("#year").textContent = new Date().getFullYear();
  }

  function init() {
    loadCart();
    renderCategories();
    renderGrid();
    renderPayOptions();
    fillSavedCustomer();
    renderFooter();
    bindEvents();
    updateCartUI(false);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
