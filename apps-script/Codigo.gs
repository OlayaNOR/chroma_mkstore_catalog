/* =========================================================
   CHROMA · Pedidos a Google Sheets (Apps Script)
   ---------------------------------------------------------
   Recibe cada venta registrada en el panel (admin.html) y la
   guarda en la pestaña "Pedidos": una fila por producto.
   Instalación: ver apps-script/README.md
   ========================================================= */

// ⚠️ Cambia esta clave por una tuya (larga, sin espacios). Es la misma que se pone
// en el panel en "Clave de Sheets". No la compartas.
const CLAVE = "CAMBIA-ESTA-CLAVE";

// true = te llega un correo con el resumen de cada venta (pide un permiso extra al implementar)
const AVISAR_POR_CORREO = false;

const PESTANA = "Pedidos";
const ENCABEZADOS = [
  "ID línea", "Registrada", "N.º orden", "Fecha orden", "Cliente", "Celular", "Ciudad", "Dirección",
  "Barrio", "Método de pago", "Notas", "Producto", "Tono", "Cantidad", "Precio unitario", "Total línea",
  "Subtotal pedido", "Envío", "Total pedido", "Stock descontado"
];

// Abre la URL en el navegador para comprobar que está activa
function doGet() {
  return responder({ ok: true, mensaje: "Chroma · Pedidos activo" });
}

function doPost(e) {
  let pedido;
  try {
    pedido = JSON.parse((e && e.postData && e.postData.contents) || "{}");
  } catch (err) {
    return responder({ ok: false, error: "json", mensaje: "Pedido ilegible" });
  }
  if (!pedido.clave || pedido.clave !== CLAVE) {
    return responder({ ok: false, error: "clave", mensaje: "Clave incorrecta" });
  }
  if (!pedido.numero || !Array.isArray(pedido.items) || !pedido.items.length) {
    return responder({ ok: false, error: "datos", mensaje: "Faltan número de orden o productos" });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(20000); // evita que dos ventas simultáneas se pisen
  try {
    const filas = guardar(pedido);
    if (AVISAR_POR_CORREO) avisar(pedido);
    return responder({ ok: true, filas: filas });
  } catch (err) {
    return responder({ ok: false, error: "hoja", mensaje: String(err && err.message || err) });
  } finally {
    lock.releaseLock();
  }
}

function guardar(o) {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  const hoja = libro.getSheetByName(PESTANA) || libro.insertSheet(PESTANA);
  if (hoja.getLastRow() === 0) {
    hoja.appendRow(ENCABEZADOS);
    hoja.getRange(1, 1, 1, ENCABEZADOS.length).setFontWeight("bold").setBackground("#F7E9F5");
    hoja.setFrozenRows(1);
  }

  // ID línea → número de fila, para actualizar en vez de duplicar si un pedido llega dos veces
  const ultima = hoja.getLastRow();
  const ids = ultima > 1 ? hoja.getRange(2, 1, ultima - 1, 1).getValues().map(function (r) { return String(r[0]); }) : [];

  const c = o.cliente || {};
  const zona = libro.getSpreadsheetTimeZone() || "America/Bogota";
  const registrada = o.registrada ? Utilities.formatDate(new Date(o.registrada), zona, "dd/MM/yyyy HH:mm") : "";

  o.items.forEach(function (it) {
    const fila = [
      it.idLinea, registrada, o.numero, o.fechaOrden || "", c.nombre || "", c.telefono || "", c.ciudad || "",
      c.direccion || "", c.barrio || "", c.metodoPago || "", c.notas || "", it.producto, it.tono,
      Number(it.cantidad) || 0, Number(it.precio) || 0, Number(it.total) || 0,
      Number(o.subtotal) || 0, Number(o.envio) || 0, Number(o.total) || 0, it.stockDescontado ? "Sí" : "No"
    ];
    const i = ids.indexOf(String(it.idLinea));
    if (i >= 0) {
      hoja.getRange(i + 2, 1, 1, fila.length).setValues([fila]);
    } else {
      hoja.appendRow(fila);
      ids.push(String(it.idLinea));
    }
  });

  // Formato de pesos en precio y totales (columnas O a S)
  hoja.getRange(2, 15, Math.max(1, hoja.getLastRow() - 1), 5).setNumberFormat("$ #,##0");
  return o.items.length;
}

function avisar(o) {
  const correo = Session.getEffectiveUser().getEmail();
  if (!correo) return;
  const c = o.cliente || {};
  const lineas = o.items.map(function (it) { return "• " + it.cantidad + "× " + it.producto + " (" + it.tono + ")"; });
  const total = "$ " + Number(o.total || 0).toLocaleString("es-CO");
  MailApp.sendEmail(correo, "Venta " + o.numero + " · " + (c.nombre || "") + " · " + total,
    [
      "Venta registrada en Chroma", "",
      "Orden: " + o.numero,
      "Cliente: " + (c.nombre || "") + " · " + (c.telefono || ""),
      "Envío a: " + (c.direccion || "") + ", " + (c.ciudad || ""),
      "Pago: " + (c.metodoPago || ""), "",
      lineas.join("\n"), "",
      "Total: " + total
    ].join("\n"));
}

function responder(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
