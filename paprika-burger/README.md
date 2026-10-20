# Paprika Burger · Web

Web de una sola página para Paprika Burger (Moreno). Incluye la carta completa, un carrito que manda el pedido por WhatsApp, un cartel de "Abierto ahora / Cerrado", envíos, medios de pago, mapa y datos estructurados para Google.

No necesita instalar nada: son archivos estáticos (HTML, CSS y JS).

## Ver la web en tu compu

```bash
cd paprika-burger
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Archivos

| Archivo | Qué es |
|---|---|
| `data.js` | **Datos del negocio y carta. Es lo único que hay que tocar para el mantenimiento.** |
| `plantilla-carta.csv` | Carta completa para importar en Google Sheets |
| `index.html` | Estructura de la página y etiquetas SEO |
| `styles.css` | Estilo (colores y tipografías de la marca) |
| `app.js` | Carrito, horario, mensaje de WhatsApp y datos para Google |
| `img/` | Mascota y fotos |
| `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` | Ícono de la pestaña y del acceso directo en el celular |
| `robots.txt`, `sitemap.xml` | Para que Google indexe la página |

## Mantenimiento (actualizar precios)

Todo se hace en `data.js`:

- **Cambiar un precio:** buscá el producto y cambiá el número. Los que tienen tamaños usan `precios: { Simple: 12500, Doble: 15500, Triple: 18500 }`.
- **Aumentar toda la carta de una vez:** cambiá `aumentoGeneral: 0` por el porcentaje, por ejemplo `aumentoGeneral: 8`. Redondea a $100.
- **Sacar un producto sin borrarlo:** agregale `disponible: false`.
- **Agregar una foto a un producto:** guardala en `img/` y poné `img: "american.jpg"` en ese producto.
- **Galería:** agregá fotos a `GALERIA`, al final del archivo.
- **Combo del día:** en `COMBO_DIA` se cambian los días, las burgers y los precios.
- **Promo de efectivo:** `descuentoEfectivo: 10` (en `0` se desactiva).
- **Horarios, zonas y costo de envío:** están en `NEGOCIO`.

El mensaje de WhatsApp, los precios que ve Google y el cartel de abierto/cerrado se actualizan solos a partir de `data.js`.

## Panel para el local (Google Sheets)

El personal del local puede cargar, cambiar o pausar productos desde una planilla de Google, en la compu o en la app de Google Sheets del celular. La web lee la planilla cada vez que alguien la abre.

### Configuración (una sola vez)

1. Entrar a [sheets.new](https://sheets.new) con la cuenta de Google del local.
2. *Archivo → Importar → Subir* → elegir `plantilla-carta.csv` → "Reemplazar hoja de cálculo". Así la planilla arranca con la carta completa.
3. *Archivo → Compartir → Publicar en la Web* → elegir la hoja → formato **Valores separados por comas (.csv)** → *Publicar*. Copiar el link.
4. Pegar ese link en `data.js`, en `cartaCSV: "..."`, y volver a publicar la web.

Para que otros empleados también la editen: *Compartir* → agregar sus mails como **Editor**.

### Cómo se usa

| Columna | Qué poner |
|---|---|
| Categoría | Ej: `Burgers`. Si se escribe una categoría nueva, aparece como pestaña nueva. |
| Nombre / Descripción | Lo que se ve en la tarjeta. |
| Foto | Link de Google Drive (compartido como "Cualquier persona con el enlace"), un link directo a una imagen, o el nombre de un archivo de `img/`. Vacío = muñequito. |
| Disponible | `NO` lo oculta (por ejemplo, si se acabó). Cualquier otra cosa lo muestra. |
| Destacado | `SI` le pone la etiqueta TOP. |
| Opción 1…4 / Precio 1…4 | Para tamaños: `Simple` 13500, `Doble` 16500… Para precio único: dejar *Opción 1* vacía y poner solo *Precio 1*. Se aceptan `13500`, `13.500` o `$13.500`. |

- Los cambios tardan unos **5 minutos** en verse, porque Google actualiza la versión publicada cada pocos minutos.
- El orden de la planilla es el orden de la web.
- Las notas de cada categoría (por ejemplo, "incluyen papas fritas") y los ingredientes de los sándwiches se siguen tomando de `data.js` cuando la categoría tiene el mismo nombre.
- El **combo del día** busca las burgers por nombre (`American`, `Stacker`, `Cheese`, `Crispy Onion`, `Quarter`). Si cambia el nombre en la planilla, hay que actualizar `COMBO_DIA` en `data.js`.
- Si la planilla no responde, la web muestra la carta de `data.js`, así nunca queda vacía.

## Datos a confirmar con el dueño antes de publicar

Se tomaron de internet y de las historias destacadas de Instagram. Puede haber datos desactualizados:

- [ ] **Dirección:** Google Maps dice 9 de Julio 219; un posteo de enero de 2025 dice Alem 2891.
- [ ] **Horarios:** se usó "todos los días de 11 a 00:30", de un posteo de enero de 2025.
- [ ] **WhatsApp:** 11 2548-3069, de las historias. Otro posteo dice 11 6807-3250.
- [ ] **Zonas y costo de envío:** las zonas son una propuesta. El costo figura como "a confirmar".
- [ ] **Precios:** se usó la carta de WhatsApp. Las historias de Instagram tienen algunos precios distintos (Spicy, Pomodoro, Crispy Onion) y la burger "Campeona", que no está en la carta de WhatsApp.
- [ ] **Mascota:** `img/mascota.svg` está redibujada en vector a partir de una captura de la marca. Si el local tiene el archivo original, conviene usarlo.
- [ ] **Fotos de los productos:** ya están las de Cheese, American, Stacker y Crispy Onion. La del Quarter está recortada del flyer de combos. Faltan las del resto de la carta.
- [ ] **Combo del día:** miércoles a domingo, según el flyer. Lunes y martes no hay combo.

## Publicar

1. Subir la carpeta a **Netlify**, **Vercel** o **GitHub Pages** (todos tienen plan gratis).
2. Comprar el dominio `.com.ar` en [NIC Argentina](https://nic.ar) y conectarlo.
3. Si el dominio no es `paprikaburger.com.ar`, reemplazarlo en `index.html` (canonical y og), en `data.js` (`url`), en `robots.txt` y en `sitemap.xml`.

## SEO local ("hamburguesería Moreno")

- Título, descripción, Open Graph y meta geo ya configurados.
- Los datos estructurados de schema.org (`Restaurant` con horario, dirección, carta y precios) se generan desde `data.js`. Se pueden verificar en <https://search.google.com/test/rich-results>.
- **Lo más importante:** cargar la URL de la web en el **Perfil de Empresa de Google** del local (el botón "Sitio web" de Maps).
- Dar de alta el sitio en **Google Search Console** y enviar `sitemap.xml`.
- Poner el link de la web en la bio de Instagram.
