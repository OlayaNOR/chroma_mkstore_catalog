# Pedidos a Google Sheets con n8n

Cuando la dueña registra una venta en el panel, el pedido completo (clienta, dirección, productos, totales) se envía a n8n, que lo guarda en Google Sheets: **una fila por producto**.

```
Panel (admin.html) ──POST + clave──▶ ngrok (URL pública fija) ──▶ n8n en Docker ──▶ Google Sheets
```

- Si el computador con n8n está apagado, el pedido **queda en cola en el dispositivo de la dueña** y se reenvía solo la próxima vez que abra el panel (o con el botón *Reintentar envío*).
- Cada fila tiene un `ID línea` único (`CHR-…-1`, `CHR-…-2`): si un pedido se envía dos veces, se actualiza en vez de duplicarse.
- Los datos de las clientas **solo** viajan a tu n8n y a la hoja; nunca se guardan en el repositorio (que es público).

---

## 1. Crear la hoja

1. Con la cuenta de Google de la dueña, crea una hoja nueva, por ejemplo **"Chroma · Pedidos"**.
2. Renombra la pestaña de abajo a **`Pedidos`**.
3. En la fila 1 pega estos encabezados (cópialos tal cual, se reparten en columnas solos):

```
ID línea	Registrada	N.º orden	Fecha orden	Cliente	Celular	Ciudad	Dirección	Barrio	Método de pago	Notas	Producto	Tono	Cantidad	Precio unitario	Total línea	Subtotal pedido	Envío	Total pedido	Stock descontado
```

> Para sumar ventas usa **Total línea** (Subtotal / Envío / Total pedido se repiten en cada producto del mismo pedido).

## 2. Dar acceso a n8n (cuenta de servicio de Google)

Se usa una *cuenta de servicio* porque no vence (las credenciales OAuth en modo prueba caducan cada 7 días).

1. Entra a <https://console.cloud.google.com/> → crea un proyecto (ej. `chroma-n8n`).
2. **APIs y servicios → Biblioteca**: habilita **Google Sheets API** y **Google Drive API**.
3. **APIs y servicios → Credenciales → Crear credenciales → Cuenta de servicio**. Nombre: `n8n-chroma`. Crear y listo (no necesita roles).
4. Abre la cuenta creada → pestaña **Claves → Agregar clave → JSON**. Se descarga un archivo `.json` (guárdalo bien, es una contraseña).
5. Copia el correo de la cuenta de servicio (`n8n-chroma@….iam.gserviceaccount.com`) y **comparte la hoja con ese correo como Editor** (botón Compartir de la hoja).

## 3. Exponer n8n con una URL pública fija (ngrok)

La dueña usa el panel desde su celular, que no puede ver el `localhost` de tu PC. ngrok le da a tu n8n una dirección HTTPS fija y gratis.

1. Crea una cuenta en <https://ngrok.com>, instala ngrok (`brew install ngrok`) y conecta tu cuenta:
   ```bash
   ngrok config add-authtoken TU_AUTHTOKEN
   ```
2. En el panel de ngrok → **Domains**, reclama tu dominio gratuito (ej. `chroma-pedidos.ngrok-free.app`).
3. Arranca n8n indicándole su URL pública (ajusta a cómo lo levantas hoy; lo importante es `WEBHOOK_URL`):
   ```bash
   docker run -d --name n8n -p 5678:5678 \
     -e WEBHOOK_URL=https://chroma-pedidos.ngrok-free.app/ \
     -e GENERIC_TIMEZONE=America/Bogota \
     -v n8n_data:/home/node/.n8n \
     docker.n8n.io/n8nio/n8n
   ```
4. Abre el túnel (déjalo corriendo):
   ```bash
   ngrok http --url=chroma-pedidos.ngrok-free.app 5678
   ```

## 4. Importar el flujo en n8n

1. En n8n: **Workflows → Import from file** → `n8n/chroma-ventas-sheets.json`.
2. Nodo **Webhook venta**:
   - *Credential for Header Auth* → **Create new**: Name = `X-Chroma-Key`, Value = una clave larga inventada (ej. genera una con `openssl rand -hex 24`). Esa es la **clave de Sheets** que pondrá la dueña en el panel.
   - En *Options → Allowed Origins (CORS)* debe estar `https://olayanor.github.io` (ya viene así; si usas dominio propio, cámbialo).
3. Nodo **Guardar en Google Sheets**:
   - *Credential* → **Create new → Google Service Account API**: pega el `client_email` y el `private_key` del JSON descargado.
   - *Document* → pega la URL de la hoja. *Sheet* → `Pedidos`.
4. Guarda y **activa** el flujo (interruptor *Active* arriba a la derecha). La URL de producción será:
   ```
   https://chroma-pedidos.ngrok-free.app/webhook/chroma-venta
   ```

## 5. Conectar el panel

1. En `js/config.js` pon esa URL en `admin.sheetsWebhook` y publica (commit a `main`).
2. En el panel, al final: **Clave de Sheets** → pega la clave del paso 4.2 (se guarda solo en ese dispositivo; hay que ponerla una vez en cada celular/computador donde se use el panel).
3. Registra una venta de prueba: debe aparecer *"Google Sheets: todos los pedidos están enviados ✓"* y las filas en la hoja.

## Problemas comunes

| Mensaje en el panel | Causa |
|---|---|
| *No hay conexión con n8n (¿el computador está encendido?)* | PC apagado, Docker detenido, ngrok cerrado o flujo sin activar. El pedido queda en cola; se reenvía al abrir el panel. |
| *La clave de Sheets es incorrecta* | La clave del panel no coincide con la credencial Header Auth del webhook. |
| *n8n respondió 500* | Error dentro del flujo (revisa **Executions** en n8n): hoja no compartida con la cuenta de servicio, pestaña con otro nombre, etc. |
