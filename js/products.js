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
    id: "bronzer-allure-crema-y-compacto",
    nombre: "BRONZER ALLURE CREMA Y COMPACTO",
    categoria: "Rostro",
    tipo: "labial",
    precio: 50000,
    etiqueta: "Nuevo",
    descripcion: "Su innovadora fórmula combina una textura cremosa de alta adherencia con un polvo compacto de acabado suave, logrando un color uniforme, de larga duración y fácil de construir. Gracias a su textura sedosa y acabado Soft Focus, se funde perfectamente con la piel para un resultado natural y definido.",
    imagen: "assets/img/productos/producto-mvfh6kse.jpg",
    muestras: "assets/img/productos/bronzer-allure-crema-y-compacto-tonos-piel-mvfhan3q.jpg",
    tonos: [
      { nombre: "GOBI", hex: "#9a5c46", stock: 0, imagen: "assets/img/productos/bronzer-allure-crema-y-compacto-gobi-mvfh8jpw.jpg" },
      { nombre: "SANDSTORM", hex: "#9d695b", stock: 1, imagen: "assets/img/productos/bronzer-allure-crema-y-compacto-sandstorm-mvfh8v72.jpg" },
      { nombre: "THAR", hex: "#5c3429", stock: 0, imagen: "assets/img/productos/bronzer-allure-crema-y-compacto-thar-mvfh96dn.jpg" }
    ]
  },
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
  }
];
