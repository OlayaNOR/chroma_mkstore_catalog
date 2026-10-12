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
    id: "labial-mate-velvet",
    nombre: "Labial Mate Velvet",
    categoria: "Labios",
    tipo: "labial",
    precio: 32000,
    etiqueta: "Más vendido",
    descripcion: "Acabado mate aterciopelado de larga duración. No reseca y se desliza en una sola pasada.",
    tonos: [
      { nombre: "Rosa Nude", hex: "#C98A8E", stock: 12 },
      { nombre: "Malva", hex: "#9E5A78", stock: 8 },
      { nombre: "Rojo Clásico", hex: "#B3122E", stock: 2 },
      { nombre: "Ciruela", hex: "#5E1F3D", stock: 0 },
      { nombre: "Terracota", hex: "#A94F3B", stock: 6 }
    ]
  },
  {
    id: "gloss-cristal",
    nombre: "Gloss Cristal",
    categoria: "Labios",
    tipo: "gloss",
    precio: 24000,
    etiqueta: "Nuevo",
    descripcion: "Brillo jugoso con efecto volumen. Fórmula no pegajosa con aroma a vainilla.",
    tonos: [
      { nombre: "Transparente", hex: "#F3D9E2", stock: 15 },
      { nombre: "Rosa Chicle", hex: "#E37BA6", stock: 10 },
      { nombre: "Durazno", hex: "#F0A07E", stock: 7 },
      { nombre: "Lila Glow", hex: "#B887C9", stock: 4 }
    ]
  },
  {
    id: "tinta-labios-mejillas",
    nombre: "Tinta Labios & Mejillas",
    categoria: "Labios",
    tipo: "gloss",
    precio: 21000,
    precioAntes: 26000,
    descripcion: "Tinta ligera 2 en 1 para un rubor natural en labios y mejillas.",
    tonos: [
      { nombre: "Fresa", hex: "#D2384F", stock: 9 },
      { nombre: "Cereza", hex: "#8E1B32", stock: 6 },
      { nombre: "Coral", hex: "#EE6F5A", stock: 11 }
    ]
  },
  {
    id: "base-skin-perfect",
    nombre: "Base Skin Perfect",
    categoria: "Rostro",
    tipo: "base",
    precio: 58000,
    etiqueta: "Más vendido",
    descripcion: "Cobertura media construible, acabado satinado y 24 h de duración. Con ácido hialurónico.",
    tonos: [
      { nombre: "110 Porcelana", hex: "#F4D9C6", stock: 4 },
      { nombre: "120 Marfil", hex: "#EDCBB1", stock: 7 },
      { nombre: "220 Beige", hex: "#D9AE8C", stock: 10 },
      { nombre: "250 Arena", hex: "#C99A73", stock: 9 },
      { nombre: "320 Miel", hex: "#B07D55", stock: 5 },
      { nombre: "410 Canela", hex: "#8C5A39", stock: 3 },
      { nombre: "450 Cacao", hex: "#5E3A25", stock: 0 }
    ]
  },
  {
    id: "rubor-compacto",
    nombre: "Rubor Compacto Bloom",
    categoria: "Rostro",
    tipo: "rubor",
    precio: 34000,
    descripcion: "Pigmento sedoso que se difumina fácil. Da un toque de color fresco y luminoso.",
    tonos: [
      { nombre: "Rosa Pétalo", hex: "#E89AAE", stock: 8 },
      { nombre: "Melocotón", hex: "#F2A285", stock: 6 },
      { nombre: "Orquídea", hex: "#C76FA8", stock: 5 }
    ]
  },
  {
    id: "polvo-sellador",
    nombre: "Polvo Sellador Matte",
    categoria: "Rostro",
    tipo: "polvo",
    precio: 39000,
    descripcion: "Polvo translúcido que controla el brillo y sella el maquillaje sin dejar efecto blanco.",
    tonos: [
      { nombre: "Translúcido", hex: "#F1E3D6", stock: 14 },
      { nombre: "Medio", hex: "#D6AE8B", stock: 8 },
      { nombre: "Profundo", hex: "#9A6A48", stock: 4 }
    ]
  },
  {
    id: "paleta-sombras",
    nombre: "Paleta de Sombras Aurora",
    categoria: "Ojos",
    tipo: "sombras",
    precio: 69000,
    precioAntes: 79000,
    etiqueta: "Nuevo",
    descripcion: "9 sombras entre mates y metalizadas, altamente pigmentadas y fáciles de difuminar.",
    tonos: [
      { nombre: "Rose Gold", hex: "#C98B7B", stock: 6 },
      { nombre: "Purple Dream", hex: "#8A4F9E", stock: 5 },
      { nombre: "Smoky Night", hex: "#4A3B45", stock: 2 }
    ]
  },
  {
    id: "mascara-volumen",
    nombre: "Máscara Volumen XL",
    categoria: "Ojos",
    tipo: "mascara",
    precio: 36000,
    descripcion: "Pestañas más largas y con volumen desde la primera capa. A prueba de agua.",
    tonos: [
      { nombre: "Negro Intenso", hex: "#151215", stock: 20 },
      { nombre: "Marrón", hex: "#4B2E22", stock: 7 }
    ]
  },
  {
    id: "delineador-liquido",
    nombre: "Delineador Líquido Precision",
    categoria: "Ojos",
    tipo: "delineador",
    precio: 27000,
    descripcion: "Punta de fieltro ultrafina para trazos precisos. Secado rápido y larga duración.",
    tonos: [
      { nombre: "Negro", hex: "#111111", stock: 18 },
      { nombre: "Violeta", hex: "#6B3A8C", stock: 6 },
      { nombre: "Azul Noche", hex: "#1F2C5C", stock: 0 }
    ]
  },
  {
    id: "esmalte-gel-shine",
    nombre: "Esmalte Gel Shine",
    categoria: "Uñas",
    tipo: "esmalte",
    precio: 15000,
    descripcion: "Efecto gel sin lámpara. Brillo intenso que dura hasta 7 días.",
    tonos: [
      { nombre: "Blanco Nube", hex: "#F5F1F2", stock: 10 },
      { nombre: "Rosa Ballet", hex: "#F0BFCB", stock: 12 },
      { nombre: "Lavanda", hex: "#B9A0D6", stock: 8 },
      { nombre: "Fucsia", hex: "#D02E7D", stock: 6 },
      { nombre: "Vino", hex: "#6A1730", stock: 9 },
      { nombre: "Negro", hex: "#1A1A1A", stock: 5 }
    ]
  }
];
