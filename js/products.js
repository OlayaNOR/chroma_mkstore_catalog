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
    id: "vibrant-blush-duo",
    nombre: "VIBRANT BLUSH DUO ENCHANTE",
    categoria: "Rostro",
    tipo: "labial",
    precio: 38000,
    etiqueta: "Nuevo",
    descripcion: "Su formula cremosa se desliza fácilmente sobre la piel, proporcionando un acabado suave y húmedo que realza tu belleza natural.",
    tonos: [
      { nombre: "Rose Rush", hex: "#fe757b", stock: 0, imagen: "assets/img/productos/vibrant-blush-duo-rose-rush-mvlkd1tw.jpg" },
      { nombre: "Peach Glow", hex: "#d95942", stock: 1, imagen: "assets/img/productos/vibrant-blush-duo-peach-glow-mvlkdizu.jpg" },
      { nombre: "Glowing Glam", hex: "#eb726e", stock: 1, imagen: "assets/img/productos/vibrant-blush-duo-glowing-glam-mvlkdzc5.jpg" }
    ]
  },
  {
    id: "lip-gloss-1st-scene",
    nombre: "LIP GLOSS 1ST SCENE",
    categoria: "Labios",
    tipo: "labial",
    precio: 42000,
    etiqueta: "Nuevo",
    descripcion: "El Lip Gloss es un brillo labial que contiene aloe, aceite de jojoba y rosa mosqueta. Brinda un acabado ultra brillante, realzando tus labios con un toque luminoso, perfecto para cualquier look. Este gloss hidrata y suaviza tus labios, previene la sequedad y es de larga duración.",
    tonos: [
      { nombre: "Shell Coral", hex: "#aa594a", stock: 0, imagen: "assets/img/productos/lip-gloss-1st-scene-shell-coral-mvlk81ta.jpg" }
    ]
  },
  {
    id: "pincel-doble-cejas-b44",
    nombre: "Pincel Doble Cejas B44",
    categoria: "Brochas",
    tipo: "labial",
    precio: 12000,
    etiqueta: "Nuevo",
    descripcion: "Este pincel delgadito es de cerdas sintéticas y rígidas, diseñado especialmente para trazar mis cejas de una forma precisa y perfecta. Además, su punta otra punta es el complemento que necesito para dar los últimos toques. Así, mi mirada cobra mucha más fuerza sin dejar de verse natural. Por fin puedo explorar nuevas mezclas y estilos. Es hora de crear.",
    tonos: [
      { nombre: "B44", hex: "#000000", stock: 1, imagen: "assets/img/productos/pincel-doble-cejas-b44-b44-mvlk5zeo.jpg" }
    ]
  },
  {
    id: "paleta-light-set-montoc",
    nombre: "Paleta Light Set Montoc",
    categoria: "Rostro",
    tipo: "labial",
    precio: 56000,
    etiqueta: "Nuevo",
    descripcion: "La paleta Light Set, reúne en un estuche compacto tres productos muy útiles para definir el rostro: bronceador, rubor e iluminador. viene en tres tonos versátiles: carlota, leticia y aurora,  que se adaptan fácilmente a diversos tonos de piel.",
    tonos: [
      { nombre: "Aurora", hex: "#ffffff", stock: 1, imagen: "assets/img/productos/paleta-light-set-montoc-tono-1-mvlk3i56.jpg" }
    ]
  },
  {
    id: "iluminador-light-set",
    nombre: "Iluminador Light Set",
    categoria: "Rostro",
    tipo: "labial",
    precio: 44000,
    etiqueta: "Nuevo",
    descripcion: "El Light Set, es un iluminador compacto que le dará a tu maquillaje un toque de luminosidad inigualable.",
    muestras: "assets/img/productos/iluminador-light-set-tonos-piel-mvlk1n8s.jpg",
    tonos: [
      { nombre: "Champagne", hex: "#f6ccba", stock: 1, imagen: "assets/img/productos/iluminador-light-set-tono-1-mvlk1k2d.jpg" }
    ]
  },
  {
    id: "polvo-suelto-traslucido-soft-powder-10g",
    nombre: "Polvo Suelto Traslucido Soft Powder 10G",
    categoria: "Rostro",
    tipo: "labial",
    precio: 37000,
    etiqueta: "Nuevo",
    descripcion: "¿Acabado perfecto durante todo el día? Powder Mini te encantará. Su fórmula micro-pulverizada se adhiere suavemente a la piel, matificando sin resecar y logrando un efecto aterciopelado que controla el brillo sin alterar el color de tu maquillaje.",
    tonos: [
      { nombre: "Traslucido", hex: "#fefcdd", stock: 1, imagen: "assets/img/productos/polvo-suelto-traslucido-soft-powder-10g-traslucido-mvlk03jp.jpg" }
    ]
  },
  {
    id: "pestanina-flash-lash",
    nombre: "Pestañina Flash Lash",
    categoria: "Ojos",
    tipo: "labial",
    precio: 24000,
    etiqueta: "Nuevo",
    descripcion: "Flash Lash está creada para ser resistente al agua con tecnología peel off, le dará a tu pestañas el largo perfecto.",
    tonos: [
      { nombre: "Flash-Lash", hex: "#f2d1d8", stock: 2, imagen: "assets/img/productos/pestanina-flash-lash-flash-lash-mvljv6q6.jpg" }
    ]
  },
  {
    id: "gel-fijador-de-cejas-freeze-babes",
    nombre: "Gel Fijador De Cejas Freeze Babes",
    categoria: "Cejas",
    tipo: "labial",
    precio: 22000,
    etiqueta: "Nuevo",
    descripcion: "El fijador de cejas perfecto para unas cejas congeladas. Con aceite de ricino y ácido hialurónico. Peina, define y mantiene cada vello en su lugar",
    tonos: [
      { nombre: "Sin color", hex: "#ffecd5", stock: 2, imagen: "assets/img/productos/gel-fijador-de-cejas-freeze-babes-sin-color-mvljtz33.jpg" }
    ]
  },
  {
    id: "hair-wax-stick-cera-anti-frizz",
    nombre: "Hair Wax Stick (Cera Anti Frizz)",
    categoria: "Capilar",
    tipo: "labial",
    precio: 39500,
    etiqueta: "Nuevo",
    descripcion: "Diseñada especialmente para llevar tu cabello con un estilo impecable, además de ayudar a controlar el frizz, nutrir, reparar y mejorar su textura, gracias a sus ingredientes de alto desempeño. Espectacular fragancia que perdura. Innovadora presentación en stick para facilitar la aplicación sin desperdiciar producto ni dejar residuos en tu cabello.",
    tonos: [
      { nombre: "Sin color", hex: "#ffaa00", stock: 1, imagen: "assets/img/productos/hair-wax-stick-cera-anti-frizz-tono-1-mvljp8gw.jpg" }
    ]
  },
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
    categoria: "Brochas",
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
      { nombre: "Sprinkle", hex: "#c85252", stock: 1, imagen: "assets/img/productos/rhode-pocket-blush-buildable-hydrating-cream-blush-sprinkle-mvk4eg3x.jpg" }
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
      { nombre: "30 ML", hex: "#C98A8E", stock: 0, imagen: "assets/img/productos/fijador-de-maquillaje-naba-30-ml-mvk2yend.jpg" }
    ]
  },
  {
    id: "brocha-mini-iconi-k-x-juanito",
    nombre: "Brocha Mini Iconi-K x Juanito",
    categoria: "Brochas",
    tipo: "labial",
    precio: 20000,
    etiqueta: "Nuevo",
    descripcion: "Iconi-k Brush ¡Colaboración entre Ani-K Makeup y Juanito! Esta brocha versátil está diseñada para ofrecerte la máxima precisión y comodidad en tu rutina de maquillaje.\n\nTe permite aplicar productos en crema, líquidos y en polvo con facilidad y precisión. Las cerdas aseguran una distribución uniforme del producto mientras sin absorber mucho producto, lo que te permite lograr el acabado perfecto y e",
    imagen: "assets/img/productos/brocha-mini-iconi-k-x-juanito-mvk4g9fq.jpg",
    tonos: [
      { nombre: "MINI", hex: "#C98A8E", stock: 1, imagen: "assets/img/productos/brocha-mini-iconi-k-x-juanito-mini-mvk4iaam.jpg" }
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
    muestras: "assets/img/productos/corrector-liquido-1st-scene-travel-size-tonos-piel-mvfh33b0.jpg",
    tonos: [
      { nombre: "CUT CREASE", hex: "#fdf1e7", stock: 1, imagen: "assets/img/productos/corrector-liquido-1st-scene-travel-size-cut-crease-mvk95gpl.jpg" },
      { nombre: "NEUTRALIZER", hex: "#f3d0aa", stock: 1, imagen: "assets/img/productos/corrector-liquido-1st-scene-travel-size-neutralizer-mvk95jis.jpg" },
      { nombre: "NUDE", hex: "#e8b691", stock: 1, imagen: "assets/img/productos/corrector-liquido-1st-scene-travel-size-nude-mvk95m5m.jpg" },
      { nombre: "VAINILLA", hex: "#f4c99e", stock: 1, imagen: "assets/img/productos/corrector-liquido-1st-scene-travel-size-vainilla-mvk95oud.jpg" },
      { nombre: "BEIGE", hex: "#f1c391", stock: 1, imagen: "assets/img/productos/corrector-liquido-1st-scene-travel-size-beige-mvk95ru5.jpg" },
      { nombre: "CINNAMON", hex: "#ecbd8d", stock: 1, imagen: "assets/img/productos/corrector-liquido-1st-scene-travel-size-cinnamon-mvk95ugh.jpg" }
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
      { nombre: "Micro Fibras Gris Clara", hex: "#9e96a2", stock: 1, imagen: "assets/img/productos/pestanina-prosa-micro-fibras-gris-clara-mvk2gws7.jpg" },
      { nombre: "Maxi-Volumen Silicon", hex: "#ff40ff", stock: 3, imagen: "assets/img/productos/pestanina-prosa-maxi-volumen-silicon-mvljr13t.jpg" },
      { nombre: "Maxi-Volumen Borgoña", hex: "#831100", stock: 0 }
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
      { nombre: "SANDSTORM", hex: "#9d695b", stock: 1, imagen: "assets/img/productos/bronzer-allure-crema-y-compacto-sandstorm-mvk4afzu.jpg" },
      { nombre: "THAR", hex: "#5c3429", stock: 0, imagen: "assets/img/productos/bronzer-allure-crema-y-compacto-thar-mvfh96dn.jpg" }
    ]
  }
];
