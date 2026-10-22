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
    id: "corrector-liquido-1st-scene-travel-size",
    nombre: "CORRECTOR LÍQUIDO 1ST SCENE TRAVEL SIZE",
    categoria: "Ojos",
    tipo: "labial",
    precio: 20000,
    etiqueta: "Nuevo",
    descripcion: "Consigue una piel con apariencia uniforme. Su textura cremosa se difumina fácilmente sobre la piel, ayudando a cubrir ojeras, manchas, rojeces e imperfecciones sin dejar una sensación pesada.\n\nEnriquecido con cafeína y vitamina E, aportando una mejorar apariencia a la zona de la ojera",
    imagen: "assets/img/productos/corrector-liquido-1st-scene-travel-size-mvfh3gas.jpg",
    muestras: "assets/img/productos/corrector-liquido-1st-scene-travel-size-tonos-piel-mvfh33b0.jpg",
    tonos: [
      { nombre: "CUT CREASE", hex: "#fdf1e7", stock: 1, imagen: "assets/img/productos/corrector-liquido-1st-scene-travel-size-cut-crease-mvfh37iw.jpg" },
      { nombre: "NEUTALIZER", hex: "#fee8d4", stock: 1 },
      { nombre: "NUDE", hex: "#fad9c5", stock: 1 },
      { nombre: "VAINILLA", hex: "#fadcc2", stock: 1 },
      { nombre: "BEIGE", hex: "#f7caaa", stock: 1 },
      { nombre: "CINNAMON", hex: "#f1cfb6", stock: 1 }
    ]
  },
  {
    id: "pestanina-prosa",
    nombre: "PESTAÑINA PROSA",
    categoria: "Ojos",
    tipo: "labial",
    precio: 23500,
    etiqueta: "Nuevo",
    descripcion: "Tus pestañas lucirán naturales, mucho más definidas y extra largas.",
    imagen: "assets/img/productos/pestanina-prosa-mvk2hcee.jpg",
    muestras: "assets/img/productos/pestanina-prosa-tonos-piel-mvk2h6ph.jpg",
    tonos: [
      { nombre: "Profesional Silicon Café", hex: "#6d3b3e", stock: 1, imagen: "assets/img/productos/pestanina-prosa-profesional-silicon-cafe-mvk2g701.jpg" },
      { nombre: "Maxi-Volumen Morada", hex: "#843ba5", stock: 1, imagen: "assets/img/productos/pestanina-prosa-maxi-volumen-morada-mvk2gkyi.jpg" },
      { nombre: "Micro Fibras Gris Clara", hex: "#9e96a2", stock: 1, imagen: "assets/img/productos/pestanina-prosa-micro-fibras-gris-clara-mvk2gws7.jpg" }
    ]
  },
  {
    id: "got2b-glued-schwarzkopf",
    nombre: "got2b Glued  Schwarzkopf",
    categoria: "Cejas",
    tipo: "labial",
    precio: 36000,
    etiqueta: "Nuevo",
    descripcion: "got2b Glued de Schwarzkopf es un producto 2 en 1 diseñado para fijar tanto las cejas como los bordes del cabello (baby hairs), logrando un efecto tipo laminado de larga duración.",
    imagen: "assets/img/productos/producto-mvk2k1hb.jpg",
    muestras: "assets/img/productos/got2b-glued-schwarzkopf-tonos-piel-mvk2mquf.jpg",
    tonos: [
      { nombre: "Amarillo", hex: "#ffd500", stock: 1 }
    ]
  },
  {
    id: "corrector-pure-cover-tamano-regular-6-gr",
    nombre: "Corrector Pure Cover - Tamaño Regular - 6 Gr",
    categoria: "Rostro",
    tipo: "labial",
    precio: 32500,
    etiqueta: "Nuevo",
    descripcion: "Corrector profesional multiusos de textura cremosa, ligera y de excelente cobertura.",
    imagen: "assets/img/productos/producto-mvk22h6a.jpg",
    muestras: "assets/img/productos/corrector-pure-cover-tamano-regular-6-gr-tonos-piel-mvk24u8l.jpg",
    tonos: [
      { nombre: "00. Winter", hex: "#e1bba6", stock: 1 },
      { nombre: "01. Snow", hex: "#e2b595", stock: 1 },
      { nombre: "05. Caramel", hex: "#a0663c", stock: 1 }
    ]
  },
  {
    id: "bronzer-allure-crema-y-compacto",
    nombre: "BRONZER ALLURE CREMA Y COMPACTO",
    categoria: "Rostro",
    tipo: "labial",
    precio: 50000,
    etiqueta: "Nuevo",
    descripcion: "Su innovadora fórmula combina una textura cremosa de alta adherencia con un polvo compacto de acabado suave, logrando un color uniforme, de larga duración y fácil de construir. Gracias a su textura sedosa y acabado Soft Focus, se funde perfectamente con la piel para un resultado natural y definido.",
    imagen: "assets/img/productos/bronzer-allure-crema-y-compacto-mvfimkgv.jpg",
    muestras: "assets/img/productos/bronzer-allure-crema-y-compacto-tonos-piel-mvfhan3q.jpg",
    tonos: [
      { nombre: "SANDSTORM", hex: "#9d695b", stock: 1, imagen: "assets/img/productos/bronzer-allure-crema-y-compacto-sandstorm-mvfh8v72.jpg" },
      { nombre: "THAR", hex: "#5c3429", stock: 0, imagen: "assets/img/productos/bronzer-allure-crema-y-compacto-thar-mvfh96dn.jpg" }
    ]
  }
];
