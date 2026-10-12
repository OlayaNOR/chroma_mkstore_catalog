# Chroma · Catálogo y toma de pedidos

Web estática (HTML + CSS + JavaScript puro, sin frameworks ni build). Carga rápido y se puede subir a cualquier hosting estático: Netlify, Vercel, GitHub Pages, Cloudflare Pages, Hostinger, etc.

## Estructura

```
chroma/
├── index.html          Tienda
├── admin.html          🔒 Panel para actualizar el catálogo
├── css/styles.css      Estilos (paleta basada en el logo #AF6AAE), responsive
├── js/config.js        ⚙️  Datos de la tienda: WhatsApp, envío, métodos de pago
├── js/products.js      🛍️  Inventario: productos, precios, tonos y stock
├── js/app.js           Lógica (catálogo, carrito, checkout, orden)
├── js/admin.js         Lógica del panel (publica en GitHub)
├── data/ventas.json    Registro de ventas (lo escribe el panel)
├── apps-script/        Script de Google Sheets que guarda los pedidos
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

## Panel de administración (`admin.html`)

La dueña de la tienda puede agregar, editar, eliminar y reordenar productos (con fotos, tonos y stock) desde `tusitio.com/admin.html`, sin tocar código. La página no está enlazada desde la tienda y no se indexa en Google.

**Cómo funciona:** al pulsar **Publicar cambios**, el panel guarda `js/products.js` y las fotos nuevas directamente en el repositorio de GitHub (`admin.repo` / `admin.rama` en `config.js`), en un solo commit. El hosting detecta el commit y actualiza la tienda en 1–2 minutos. Los cambios sin publicar se guardan en el navegador por si se cierra la página.

**Acceso (solo la dueña):** se entra con un *token* personal de GitHub. Sin él no se puede ver ni modificar el catálogo. Para crearlo:

1. En GitHub: **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. *Repository access*: **Only select repositories** → `chroma_mkstore_catalog`.
3. *Permissions → Repository permissions → Contents*: **Read and write**.
4. Elige una fecha de vencimiento, genera el token y pégalo en el panel (marca "Recordar en este dispositivo" solo en el celular o computador de la dueña).

Si el token se pierde o se filtra, revócalo en esa misma pantalla y crea otro.

### Registrar una venta (descontar stock)

1. En WhatsApp, copia el mensaje de la orden que envió la clienta.
2. En el panel: **Registrar venta** → pega el mensaje → **Revisar orden**.
3. Verás cada producto con su stock actual → stock final. Puedes ajustar cantidades (0 = no descontar). Los productos o tonos que ya no existen se marcan y no se descuentan.
4. **Descontar** publica el nuevo stock al instante.

Cada venta queda en `data/ventas.json` (número de orden, fecha y productos, **sin datos personales**, porque el archivo es público) y una misma orden no se puede descontar dos veces. Si tienes otros cambios sin publicar en el panel, siguen pendientes: la venta solo descuenta sobre el catálogo publicado. Si `admin.sheetsWebhook` está configurado, el pedido completo (clienta, dirección, productos y totales) se guarda en **Google Sheets** (Apps Script en la hoja de la dueña), una fila por producto. Si no hay conexión, queda en cola en el dispositivo y se reenvía después. Instalación paso a paso: [`apps-script/README.md`](apps-script/README.md).

> El hosting debe desplegar desde la rama configurada en `admin.rama` (por defecto `main`). Si editas `products.js` a mano en otra rama, haz *pull* antes para no pisar los cambios hechos desde el panel.

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
