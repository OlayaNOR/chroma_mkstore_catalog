/* =========================================================
   CHROMA · Configuración de la tienda
   Edita estos valores sin tocar el resto del código.
   ========================================================= */
window.CHROMA_CONFIG = {
  nombreTienda: "Chroma",
  eslogan: "Maquillaje que habla tu color",

  // Número de WhatsApp que recibe las órdenes (código de país + número, sin "+" ni espacios).
  // Ejemplo Colombia: "573001234567". Si lo dejas vacío, el botón de WhatsApp se oculta
  // y el cliente solo podrá copiar la orden.
  whatsapp: "573113267531",

  // Usuario de Instagram (sin @). Se usa en el pie de página y como alternativa para enviar la orden.
  instagram: "chroma_mkstore",

  moneda: "COP",
  locale: "es-CO",

  envio: {
    costo: 6000,        // costo fijo de envío
    gratisDesde: 200000  // subtotal a partir del cual el envío es gratis (0 = nunca gratis)
  },

  metodosPago: [
    { id: "nequi", nombre: "Nequi", detalle: "Te enviamos el número para transferir." },
    { id: "Llave", nombre: "Llave", detalle: "Te enviamos la llave para transferir." },
    { id: "bancolombia", nombre: "Transferencia Bancolombia", detalle: "Te enviamos los datos de la cuenta." },
    { id: "contraentrega", nombre: "Pago contra entrega", detalle: "Pagas en efectivo al recibir." }
  ],

  // Panel de administración (admin.html). Publica los cambios del catálogo en este
  // repositorio de GitHub y rama; el hosting debe desplegar desde esa misma rama.
  admin: {
    repo: "OlayaNOR/chroma_mkstore_catalog",
    rama: "main"
  }
};
