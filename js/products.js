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
    id: "sephora-collection-retractable-eyebrow-pencil-waterproof",
    nombre: "SEPHORA COLLECTION  Retractable EyeBrow Pencil - Waterproof",
    categoria: "Cejas",
    tipo: "labial",
    precio: 80000,
    etiqueta: "Nuevo",
    imagen: "assets/img/productos/producto-mvk40bqp.jpg",
    muestras: "assets/img/productos/sephora-collection-retractable-eyebrow-pencil-waterproof-tonos-piel-mvk411p2.jpg",
    tonos: [
      { nombre: "Medium Brow", hex: "#977d7f", stock: 1, imagen: "assets/img/productos/sephora-collection-retractable-eyebrow-pencil-waterproof-medium-brow-mvk40wx9.jpg" }
    ]
  },
  {
    id: "makeup-by-mario-f4-dual-ended-foundation-and-face-brush",
    nombre: "MAKEUP BY MARIO  F4 Dual-Ended Foundation and Face Brush",
    categoria: "Rostro",
    tipo: "labial",
    precio: 180000,
    etiqueta: "Nuevo",
    descripcion: "Brocha de doble punta diseñada para aplicar, difuminar y modular bases de maquillaje y otros productos para el rostro",
    imagen: "assets/img/productos/producto-mvk3wfw0.jpg",
    tonos: [
      { nombre: "F4", hex: "#ffffff", stock: 1, imagen: "assets/img/productos/makeup-by-mario-f4-dual-ended-foundation-and-face-brush-f4-mvk3wwa2.jpg" }
    ]
  },
  {
    id: "lys-beauty-no-limits-cream-bronzer-and-contour-stick",
    nombre: "LYS Beauty  No Limits Cream Bronzer and Contour Stick",
    categoria: "Rostro",
    tipo: "labial",
    precio: 120000,
    etiqueta: "Nuevo",
    descripcion: "El LYS Beauty No Limits Cream Bronzer and Contour Stick es un",
    imagen: "assets/img/productos/producto-mvk3u8ss.jpg",
    muestras: "assets/img/productos/lys-beauty-no-limits-cream-bronzer-and-contour-stick-tonos-piel-mvk3v3eh.jpg",
    tonos: [
      { nombre: "Harmony", hex: "#77422b", stock: 1, imagen: "assets/img/productos/lys-beauty-no-limits-cream-bronzer-and-contour-stick-harmony-mvk3v0hl.jpg" }
    ]
  },
  {
    id: "rhode-peptide-lip-tint-nourishing-glaze",
    nombre: "rhode  Peptide Lip Tint Nourishing Glaze",
    categoria: "Labios",
    tipo: "labial",
    precio: 110000,
    etiqueta: "Nuevo",
    descripcion: "Tratamiento restaurador y humectante que repara los labios secos mientras ofrece un acabado gloss de alto brillo, sin sensación pegajosa",
    imagen: "assets/img/productos/producto-mvk3qwox.jpg",
    muestras: "assets/img/productos/rhode-peptide-lip-tint-nourishing-glaze-tonos-piel-mvk3sges.jpg",
    tonos: [
      { nombre: "raspberry jelly", hex: "#992950", stock: 1, imagen: "assets/img/productos/rhode-peptide-lip-tint-nourishing-glaze-tono-1-mvk3rxrk.jpg" }
    ]
  },
  {
    id: "rhode-pocket-blush-buildable-hydrating-cream-blush",
    nombre: "rhode  Pocket Blush Buildable Hydrating Cream Blush",
    categoria: "Rostro",
    tipo: "labial",
    precio: 120000,
    etiqueta: "Nuevo",
    descripcion: "El Rhode Pocket Blush es un rubor en crema multifuncional en formato stick creado por Hailey Bieber, diseñado para dar a las mejillas y a los labios un toque de color satinado, difuminado y natural",
    imagen: "assets/img/productos/producto-mvk3onze.jpg",
    muestras: "assets/img/productos/rhode-pocket-blush-buildable-hydrating-cream-blush-tonos-piel-mvk3ptaw.jpg",
    tonos: [
      { nombre: "Sprinkle", hex: "#c85252", stock: 1, imagen: "assets/img/productos/rhode-pocket-blush-buildable-hydrating-cream-blush-sprinkle-mvk4686f.jpg" }
    ]
  },
  {
    id: "huda-beauty-easy-bake-blurring-loose-baking-setting-powder-m",
    nombre: "HUDA BEAUTY  Easy Bake Blurring Loose Baking & Setting Powder MINI",
    categoria: "Rostro",
    tipo: "labial",
    precio: 120000,
    etiqueta: "Nuevo",
    descripcion: "Los polvos Huda Beauty Easy Bake (sueltos o compactos) son polvos fijadores y de maquillaje diseñados para proporcionar un acabado mate con efecto aerógrafo (airbrush), difuminar poros y líneas de expresión, y controlar el brillo durante horas",
    imagen: "assets/img/productos/producto-mvk3jhsl.jpg",
    muestras: "assets/img/productos/producto-tonos-piel-mvk3jdmw.jpg",
    tonos: [
      { nombre: "Pound Cake", hex: "#f0d6b8", stock: 1, imagen: "assets/img/productos/huda-beauty-easy-bake-blurring-loose-baking-setting-powder-m-pound-cake-mvk3ktr6.jpg" },
      { nombre: "UBE Birthday Cake", hex: "#e49ec0", stock: 1, imagen: "assets/img/productos/huda-beauty-easy-bake-blurring-loose-baking-setting-powder-m-ube-birthday-cake-mvk3ldgh.jpg" }
    ]
  },
  {
    id: "soft-pinch-liquid-blush-rare-beauty-by-selena-gomez",
    nombre: "Soft Pinch Liquid Blush Rare Beauty by Selena Gomez",
    categoria: "Rostro",
    tipo: "labial",
    precio: 130000,
    etiqueta: "Nuevo",
    descripcion: "Rubor líquido ligero, de larga duración y alta pigmentación que se funde en la piel para dar un aspecto natural y saludable",
    imagen: "assets/img/productos/producto-mvk3fdvx.jpg",
    muestras: "assets/img/productos/producto-tonos-piel-mvk3fgb5.jpg",
    tonos: [
      { nombre: "Happy", hex: "#f582a1", stock: 2, imagen: "assets/img/productos/soft-pinch-liquid-blush-rare-beauty-by-selena-gomez-happy-mvk3hlf6.jpg" },
      { nombre: "Bliss", hex: "#f39a94", stock: 1, imagen: "assets/img/productos/soft-pinch-liquid-blush-rare-beauty-by-selena-gomez-bliss-mvk3hx0a.jpg" }
    ]
  },
  {
    id: "rubor-major-headlines-double-patrick-ta-original",
    nombre: "Rubor Major Headlines Double- Patrick Ta Original",
    categoria: "Rostro",
    tipo: "labial",
    precio: 140000,
    etiqueta: "Nuevo",
    descripcion: "El Major Headlines Double-Take Crème & Powder Blush Duo de Patrick Ta es un rubor compacto viral que combina dos fórmulas complementarias (en polvo y en crema) para dar color, dimensión y un brillo radiante",
    imagen: "assets/img/productos/rubor-major-headlines-double-patrick-ta-original-mvk3cr66.jpg",
    muestras: "assets/img/productos/rubor-major-headlines-double-patrick-ta-original-tonos-piel-mvk3bers.jpg",
    tonos: [
      { nombre: "She´s Blushing", hex: "#b96155", stock: 1, imagen: "assets/img/productos/rubor-major-headlines-double-patrick-ta-original-she-s-blushing-mvk3bo5j.jpg" },
      { nombre: "She´s That Girl", hex: "#fdaab6", stock: 1, imagen: "assets/img/productos/rubor-major-headlines-double-patrick-ta-original-she-s-that-girl-mvk3buyd.jpg" }
    ]
  },
  {
    id: "fijador-de-maquillaje-naba",
    nombre: "Fijador de Maquillaje NABA",
    categoria: "Rostro",
    tipo: "labial",
    precio: 25000,
    etiqueta: "Nuevo",
    descripcion: "Fijador de maquillaje que mantiene tu look impecable todo el día, mientras cuida tu piel. Su fórmula ligera prolonga la duración del maquillaje sin sensación pesada y deja un acabado fresco, natural y ligeramente luminoso.",
    imagen: "assets/img/productos/fijador-de-maquillaje-naba-mvk2yj61.jpg",
    muestras: "assets/img/productos/fijador-de-maquillaje-naba-tonos-piel-mvk2z04q.jpg",
    tonos: [
      { nombre: "30 ML", hex: "#C98A8E", stock: 1, imagen: "assets/img/productos/fijador-de-maquillaje-naba-30-ml-mvk2yend.jpg" }
    ]
  },
  {
    id: "brocha-mini-iconi-k-x-juanito",
    nombre: "Brocha Mini Iconi-K x Juanito",
    categoria: "Rostro",
    tipo: "labial",
    precio: 20000,
    etiqueta: "Nuevo",
    descripcion: "Iconi-k Brush ¡Colaboración entre Ani-K Makeup y Juanito! Esta brocha versátil está diseñada para ofrecerte la máxima precisión y comodidad en tu rutina de maquillaje.\n\nTe permite aplicar productos en crema, líquidos y en polvo con facilidad y precisión. Las cerdas aseguran una distribución uniforme del producto mientras sin absorber mucho producto, lo que te permite lograr el acabado perfecto y e",
    imagen: "assets/img/productos/brocha-mini-iconi-k-x-juanito-mvk2pq6x.jpg",
    tonos: [
      { nombre: "MINI", hex: "#C98A8E", stock: 1, imagen: "assets/img/productos/brocha-mini-iconi-k-x-juanito-tono-1-mvk2qk9t.jpg" }
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
