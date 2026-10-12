# Chroma · Catálogo y toma de pedidos

Web estática (HTML + CSS + JavaScript puro, sin frameworks ni build). Carga rápido y se puede subir a cualquier hosting estático: Netlify, Vercel, GitHub Pages, Cloudflare Pages, Hostinger, etc.

## Estructura

```
chroma/
├── index.html          Página única
├── css/styles.css      Estilos (paleta basada en el logo #AF6AAE), responsive
├── js/config.js        ⚙️  Datos de la tienda: WhatsApp, envío, métodos de pago
├── js/products.js      🛍️  Inventario: productos, precios, tonos y stock
├── js/app.js           Lógica (catálogo, carrito, checkout, orden)
└── assets/img/         Logo, favicon y (opcional) fotos de productos
```

## Probarla en tu computador

Abre `index.html` con doble clic, o mejor, sirve la carpeta:

```bash
cd chroma
python -m http.server 8000
# abre http://localhost:8000
```

## Configuración rápida (`js/config.js`)

| Campo | Qué hace |
|---|---|
| `whatsapp` | Número que recibe las órdenes, ej. `"573001234567"`. Si está vacío, el botón "Enviar por WhatsApp" se oculta y solo queda "Copiar orden". |
| `instagram` | Usuario sin @, aparece en el pie de página. |
| `envio.costo` / `envio.gratisDesde` | Costo de envío y monto para envío gratis (`0` = nunca gratis). |
| `metodosPago` | Lista de métodos que ve el cliente (puedes agregar, quitar o renombrar). |

## Agregar o editar productos (`js/products.js`)

Copia un bloque existente y cambia sus datos:

```js
{
  id: "labial-satin",            // único, sin espacios
  nombre: "Labial Satín",
  categoria: "Labios",           // las categorías del menú salen solas de aquí
  tipo: "labial",                // ilustración si no hay foto
  precio: 30000,
  precioAntes: 35000,            // opcional → muestra % de descuento
  etiqueta: "Nuevo",             // opcional
  descripcion: "…",
  imagen: "assets/img/productos/labial-satin.jpg", // opcional
  tonos: [
    { nombre: "Nude", hex: "#C98A8E", stock: 10 },
    { nombre: "Rojo", hex: "#B3122E", stock: 0, imagen: "assets/img/productos/labial-rojo.jpg" }
  ]
}
```

- **Tonos:** cada tono tiene su color (`hex`) que se usa para la muestra circular y para pintar la ilustración del producto. Si le pones `imagen` a un tono, al seleccionarlo se muestra esa foto.
- **Stock:** con `stock: 0` el tono aparece tachado como "Agotado". El carrito no deja pedir más unidades de las disponibles.
- **Tipos de ilustración:** `labial`, `gloss`, `base`, `rubor`, `polvo`, `sombras`, `mascara`, `delineador`, `esmalte`.
- **Fotos:** recomendadas cuadradas (1:1), ~800×800 px, en `.jpg` o `.webp`.

## Flujo del cliente

1. Navega el catálogo (filtros por categoría, búsqueda por nombre o tono, orden por precio).
2. Elige tono en la tarjeta o en el detalle y agrega al carrito (se guarda en el navegador).
3. Llena datos de envío y método de pago (se validan y se recuerdan para la próxima compra).
4. Se genera la **orden de compra** con número (`CHR-AAMMDD-XXXX`), productos, tonos, totales y datos de envío, lista para enviar por WhatsApp o copiar.

Ejemplo de orden:

```
🛍️ *ORDEN DE COMPRA · CHROMA*
N.º CHR-261012-A9C2
Fecha: 12/10/26, 2:19 p. m.

*Productos*
1. Labial Mate Velvet — Tono: Rojo Clásico
   1 × $ 32.000 = $ 32.000

Subtotal: $ 32.000
Envío: $ 12.000
*Total: $ 44.000*

*Datos de envío*
Nombre: María Pérez
Celular: 300 123 4567
Ciudad: Armenia, Quindío
Dirección: Calle 10 # 20-30 apto 501
Método de pago: Nequi
```

## Para integraciones (n8n, etc.)

Cada vez que se genera una orden, la página emite el evento `chroma:order` con la orden en formato JSON (`event.detail`). Puedes enviarla a un webhook agregando, por ejemplo, al final de `app.js` o en un `<script>` aparte:

```js
document.addEventListener("chroma:order", (e) => {
  fetch("https://TU-N8N/webhook/chroma-orden", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(e.detail)
  });
});
```

## Notas

- El stock vive en `products.js`: descuéntalo a mano cuando confirmes ventas (o conéctalo después a una hoja/BD).
- Las fuentes (Cormorant Garamond y DM Sans) se cargan de Google Fonts; sin internet se usan fuentes del sistema.
- Probado en Chrome de escritorio (1366 px) y móvil (390 px): catálogo, filtros, búsqueda, tonos, stock, carrito persistente, validación del formulario y generación de la orden.
