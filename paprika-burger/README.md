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
| `index.html` | Estructura de la página y etiquetas SEO |
| `styles.css` | Estilo (colores y tipografías de la marca) |
| `app.js` | Carrito, horario, mensaje de WhatsApp y datos para Google |
| `img/` | Mascota y fotos |
| `robots.txt`, `sitemap.xml` | Para que Google indexe la página |

## Mantenimiento (actualizar precios)

Todo se hace en `data.js`:

- **Cambiar un precio:** buscá el producto y cambiá el número. Los que tienen tamaños usan `precios: { Simple: 12500, Doble: 15500, Triple: 18500 }`.
- **Aumentar toda la carta de una vez:** cambiá `aumentoGeneral: 0` por el porcentaje, por ejemplo `aumentoGeneral: 8`. Redondea a $100.
- **Sacar un producto sin borrarlo:** agregale `disponible: false`.
- **Agregar una foto a un producto:** guardala en `img/` y poné `img: "american.jpg"` en ese producto.
- **Galería:** agregá fotos a `GALERIA`, al final del archivo.
- **Promo de efectivo:** `descuentoEfectivo: 10` (en `0` se desactiva).
- **Horarios, zonas y costo de envío:** están en `NEGOCIO`.

El mensaje de WhatsApp, los precios que ve Google y el cartel de abierto/cerrado se actualizan solos a partir de `data.js`.

## Datos a confirmar con el dueño antes de publicar

Se tomaron de internet y de las historias destacadas de Instagram. Puede haber datos desactualizados:

- [ ] **Dirección:** Google Maps dice 9 de Julio 219; un posteo de enero de 2025 dice Alem 2891.
- [ ] **Horarios:** se usó "todos los días de 11 a 00:30", de un posteo de enero de 2025.
- [ ] **WhatsApp:** 11 2548-3069, de las historias. Otro posteo dice 11 6807-3250.
- [ ] **Zonas y costo de envío:** las zonas son una propuesta. El costo figura como "a confirmar".
- [ ] **Precios:** se usó la carta de WhatsApp. Las historias de Instagram tienen algunos precios distintos (Spicy, Pomodoro, Crispy Onion) y la burger "Campeona", que no está en la carta de WhatsApp.
- [ ] **Logo y mascota:** `img/mascota.svg` es un dibujo aproximado. Reemplazarlo por el archivo original de la marca.
- [ ] **Fotos de los productos:** pedirlas o bajarlas del Instagram del local.

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
