# Pedidos a Google Sheets (Apps Script)

Cada vez que la dueña registra una venta en el panel, el pedido completo (clienta, dirección, productos y totales) se guarda en una hoja de Google: **una fila por producto**. El script vive dentro de la hoja y corre en los servidores de Google, así que funciona siempre, sin computadores encendidos ni programas instalados.

```
Panel (admin.html) → Registrar venta → Apps Script de la hoja → pestaña "Pedidos"
```

- Si el celular no tiene internet en ese momento, el pedido queda en cola en el dispositivo y se reenvía después.
- Cada fila tiene un `ID línea` único (`CHR-…-1`): si un pedido llega dos veces, se actualiza en vez de duplicarse.
- La clave secreta evita que alguien que encuentre la URL meta pedidos falsos.
- Los datos de las clientas solo quedan en la hoja de la dueña, nunca en el repositorio público.

---

## Paso a paso (unos 10 minutos, todo desde el navegador)

Hazlo **con la cuenta de Google de la dueña**, porque la hoja y el script quedan a su nombre.

### 1. Crear la hoja
1. Entra a <https://sheets.new> (crea una hoja en blanco).
2. Arriba a la izquierda, cambia el nombre "Hoja de cálculo sin título" por **Chroma · Pedidos**.
3. No hace falta crear columnas: el script crea la pestaña **Pedidos** con sus encabezados la primera vez.

### 2. Pegar el script
1. En la hoja: menú **Extensiones → Apps Script**. Se abre una pestaña nueva con un editor.
2. Arriba a la izquierda, cambia "Proyecto sin título" por **Chroma Pedidos**.
3. Borra todo el contenido del archivo `Código.gs` y pega **completo** el contenido de [`Codigo.gs`](Codigo.gs).
4. Busca esta línea casi al inicio:
   ```js
   const CLAVE = "CAMBIA-ESTA-CLAVE";
   ```
   Reemplaza `CAMBIA-ESTA-CLAVE` por una clave tuya, larga y sin espacios, por ejemplo `chroma-7Kq2xW9mPz4R`. **Anótala**: la necesitarás en el paso 4.
5. *(Opcional)* Si quieres que a la dueña le llegue un **correo por cada venta**, cambia `const AVISAR_POR_CORREO = false;` por `true`.
6. Guarda con el ícono 💾 o con **Cmd + S**.

### 3. Implementar (publicar) el script
1. Arriba a la derecha: **Implementar → Nueva implementación**.
2. En el engranaje ⚙️ junto a "Seleccionar tipo", elige **Aplicación web**.
3. Llena:
   - **Descripción:** `Pedidos Chroma`
   - **Ejecutar como:** **Yo** (el correo de la dueña)
   - **Quién tiene acceso:** **Cualquier usuario**. Es necesario para que el panel pueda enviar; la clave secreta es la que protege.
4. Pulsa **Implementar**.
5. Google pide permisos: **Autorizar acceso** → elige la cuenta de la dueña. Aparecerá *"Google no ha verificado esta aplicación"*, que es normal porque el script es suyo. Pulsa **Configuración avanzada** → **Ir a Chroma Pedidos (no seguro)** → **Permitir**.
6. Copia la **URL de la aplicación web**: empieza por `https://script.google.com/macros/s/…` y termina en `/exec`.
7. Para comprobarla, ábrela en una pestaña nueva. Debe mostrar:
   ```
   {"ok":true,"mensaje":"Chroma · Pedidos activo"}
   ```

### 4. Conectar el panel
1. Pon la URL en `js/config.js` → `admin.sheetsWebhook` y publica (commit a `main`). Si me la pasas, lo hago yo.
2. Cuando esté publicado, en el panel (`admin.html`), al final de la página: **Clave de Sheets** → pega la clave del paso 2.4. Hay que hacerlo **una vez en cada dispositivo** donde la dueña use el panel.
3. Registra una venta y revisa la hoja: deben aparecer las filas, y el panel debe decir *"Google Sheets: todos los pedidos están enviados ✓"*.

---

## Si cambias el script después

Al editar el código (por ejemplo para activar el correo), guarda y luego **Implementar → Gestionar implementaciones → ✏️ Editar → Versión: Nueva versión → Implementar**. Así la URL **no cambia**. Si haces "Nueva implementación", se crea una URL distinta y habría que actualizar `config.js`.

## Problemas comunes

| Mensaje en el panel | Qué hacer |
|---|---|
| *La clave de Sheets es incorrecta* | La clave del panel (botón **Clave de Sheets**) no coincide con `CLAVE` en el script. |
| *Falta configurar la clave en este dispositivo* | Pulsa **Clave de Sheets** y pégala. |
| *Google Sheets no respondió bien* | Revisa que la implementación tenga acceso **Cualquier usuario** y que la URL termine en `/exec`. |
| *Sin conexión a internet; se reintentará* | El pedido está en cola; se envía solo al volver a abrir el panel o con **Reintentar envío**. |

Para ver errores del lado de Google: en el editor de Apps Script → **Ejecuciones** (ícono ☰ a la izquierda).
