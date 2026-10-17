/* =========================================================
   CHROMA · Inventario de productos
   ---------------------------------------------------------
   Cada producto:
     id          texto único (sin espacios)
     nombre      nombre visible
     categoria   "Labios" | "Ojos" | "Rostro" | "Uñas" (puedes crear otras)
     tipo        ilustración por defecto si no hay foto:
                 labial | gloss | base | rubor | polvo | sombras | mascara | delineador | esmalte
     precio      número sin puntos (en la moneda de config.js)
     precioAntes (opcional) precio tachado para mostrar descuento
     etiqueta    (opcional) "Nuevo", "Más vendido", etc.
     descripcion texto corto
     imagen      (opcional) ruta de foto, ej: "assets/img/productos/labial-mate.jpg"
     tonos       lista de tonos: { nombre, hex, stock, imagen (opcional) }
                 stock = 0 muestra el tono como "Agotado".
   ========================================================= */
window.CHROMA_PRODUCTS = [
  {
    id: "fijador-de-maquillaje-naba",
    nombre: "Fijador de Maquillaje NABA",
    categoria: "Rostro",
    tipo: "labial",
    precio: 26000,
    etiqueta: "Nuevo",
    descripcion: "Excelente fijador",
    muestras: "assets/img/productos/fijador-de-maquillaje-naba-tonos-piel-mvcxgrr4.jpg",
    tonos: [
      { nombre: "N/A", hex: "#c888b7", stock: 0, imagen: "assets/img/productos/fijador-de-maquillaje-naba-n-a-mvcxgj31.jpg" }
    ]
  },
  {
    id: "pesta-prosa",
    nombre: "pesta prosa",
    categoria: "Ojos",
    tipo: "labial",
    precio: 20000,
    precioAntes: 22000,
    etiqueta: "Nuevo",
    descripcion: "Pestas muy coolch para verse mas bella",
    muestras: "assets/img/productos/pesta-prosa-tonos-piel-mvcwgeon.jpg",
    tonos: [
      { nombre: "Cafe", hex: "#aa7942", stock: 1, imagen: "assets/img/productos/pesta-prosa-cafe-mvcweroc.jpg" },
      { nombre: "Morado", hex: "#942192", stock: 4, imagen: "assets/img/productos/pesta-prosa-morado-mvcwl89s.jpg" },
      { nombre: "Gris Claro", hex: "#c0c0c0", stock: 1, imagen: "assets/img/productos/pesta-prosa-gris-claro-mvcwlhjy.jpg" }
    ]
  }
];
