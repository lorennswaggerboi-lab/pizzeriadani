(() => {
  const N = NEGOCIO;
  const TZ = "America/Argentina/Buenos_Aires";
  const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const SCHEMA_DIAS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const $ = (s) => document.querySelector(s);
  const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
  const fmt = (n) => money.format(n);

  // Aplica el aumento general y redondea a $100
  const ajustar = (p) => Math.round((p * (1 + (N.aumentoGeneral || 0) / 100)) / 100) * 100;
  // Lista de [tamaño, precio]; los productos de precio único tienen tamaño ""
  const opciones = (it) => (it.precios ? Object.entries(it.precios) : [["", it.precio]]).map(([t, p]) => [t, ajustar(p)]);

  const ITEMS = {};
  MENU.forEach((cat) => cat.items.forEach((it) => { ITEMS[it.id] = it; }));
  const disponibles = (cat) => cat.items.filter((it) => it.disponible !== false);

  // Cada combo del día se carga como un producto más, para que el carrito lo trate igual
  const comboId = (id) => `combo-${id}`;
  Object.values(COMBO_DIA.dias).forEach((id) => {
    ITEMS[comboId(id)] = { id: comboId(id), nombre: `Combo del día ${ITEMS[id].nombre}`, img: ITEMS[id].img, precios: COMBO_DIA.precios };
  });

  const dirCompleta = `${N.direccion.calle}, ${N.direccion.localidad}, ${N.direccion.provincia}`;
  const igUrl = `https://www.instagram.com/${N.instagram}/`;
  const waUrl = (texto) => `https://wa.me/${N.whatsapp}${texto ? `?text=${encodeURIComponent(texto)}` : ""}`;

  /* ---------------- Horarios / Abierto ahora ---------------- */
  const aMin = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };

  function ahoraArgentina() {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: TZ, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    const dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    return { dia, min: Number(get("hour")) * 60 + Number(get("minute")) };
  }

  // Tramos de un día en minutos; si cierra después de medianoche, el cierre pasa de 1440
  const tramos = (dia) => (N.horarios[dia] || []).map(([a, c]) => {
    const ini = aMin(a); let fin = aMin(c);
    if (fin <= ini) fin += 1440;
    return { a, c, ini, fin };
  });

  function estado() {
    const { dia, min } = ahoraArgentina();
    for (const t of tramos(dia)) if (min >= t.ini && min < t.fin) return { abierto: true, cierra: t.c };
    for (const t of tramos((dia + 6) % 7)) if (min + 1440 >= t.ini && min + 1440 < t.fin) return { abierto: true, cierra: t.c };

    for (let i = 0; i < 7; i++) {
      const d = (dia + i) % 7;
      const prox = tramos(d).find((t) => i > 0 || t.ini > min);
      if (prox) {
        const cuando = i === 0 ? "hoy" : i === 1 ? "mañana" : `el ${DIAS[d].toLowerCase()}`;
        return { abierto: false, abre: `${cuando} a las ${prox.a}` };
      }
    }
    return { abierto: false, abre: null };
  }

  const horarioTexto = (dia) => {
    const t = N.horarios[dia] || [];
    return t.length ? t.map(([a, c]) => `${a} a ${c}`).join(" y ") : "Cerrado";
  };

  function pintarEstado() {
    const e = estado();
    const hoy = ahoraArgentina().dia;
    const el = $("#status-top");
    el.className = `status ${e.abierto ? "open" : ""}`;
    const extra = e.abierto ? `cierra ${e.cierra}` : e.abre ? `abre ${e.abre}` : "";
    el.innerHTML = `${e.abierto ? "Abierto ahora" : "Cerrado"}${extra ? `<span class="status-extra"> · ${extra}</span>` : ""}`;
    $("#closed-warn").hidden = e.abierto;
    document.querySelectorAll("#horarios tr").forEach((tr) => tr.classList.toggle("today", Number(tr.dataset.dia) === hoy));
  }

  /* ---------------- Contenido general ---------------- */
  function pintarInfo() {
    $("#ig-hero").href = igUrl;
    $("#ig-footer").href = igUrl; $("#ig-footer").textContent = `@${N.instagram}`;
    $("#wa-footer").href = waUrl();
    $("#tel-hero").href = waUrl(); $("#tel-hero").textContent = N.telefonoVisible;
    $("#llamar").href = `tel:+${N.whatsapp}`; $("#llamar").textContent = `Llamar ${N.telefonoVisible}`;
    $("#direccion-texto").textContent = `${N.direccion.calle}, ${N.direccion.barrio} · ${N.direccion.localidad}, ${N.direccion.provincia}`;
    $("#footer-dir").textContent = `${N.direccion.calle} · ${N.direccion.localidad}, ${N.direccion.provincia}`;
    $("#mapa").src = `https://www.google.com/maps?q=${encodeURIComponent(`${N.nombre}, ${dirCompleta}`)}&output=embed`;
    $("#como-llegar").href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dirCompleta)}`;

    $("#promo").hidden = !N.descuentoEfectivo;
    $("#promo-pct").textContent = `${N.descuentoEfectivo}%`;

    $("#zonas").innerHTML = N.envio.zonas.map((z) => `<li>${z}</li>`).join("");
    $("#envio-costo").innerHTML = (N.envio.costo == null
      ? "Costo de envío: <strong>según la zona</strong>, te lo confirmamos por WhatsApp."
      : `Costo de envío: <strong>${fmt(N.envio.costo)}</strong>`) +
      (N.envio.gratisDesde ? ` · <strong>Gratis</strong> desde ${fmt(N.envio.gratisDesde)}` : "") +
      `<br>Demora estimada: <strong>${N.envio.demora}</strong>.`;
    $("#pagos").innerHTML = N.pagos.map((p) =>
      `<li>${p}${p === "Efectivo" && N.descuentoEfectivo ? ` <em>${N.descuentoEfectivo}% OFF</em>` : ""}</li>`).join("");

    $("#horarios").innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d) => `<tr data-dia="${d}"><td>${DIAS[d]}</td><td>${horarioTexto(d)}</td></tr>`).join("");

    $("#barrio").innerHTML = N.envio.zonas.map((z) => `<option>${z}</option>`).join("") + "<option>Otro (consultar)</option>";
    $("#pago").innerHTML = N.pagos.map((p) => `<option>${p}</option>`).join("");

    if (GALERIA.length) {
      $("#galeria").hidden = false;
      $("#gallery").innerHTML = GALERIA.map((g) => `<img src="img/${g.img}" alt="${g.alt || N.nombre}" loading="lazy">`).join("");
    }
  }

  /* ---------------- Combo del día ---------------- */
  function pintarCombos() {
    const hoy = ahoraArgentina().dia;
    const orden = [1, 2, 3, 4, 5, 6, 0].filter((d) => COMBO_DIA.dias[d]);
    $("#combo-grid").innerHTML = orden.map((d) => {
      const it = ITEMS[COMBO_DIA.dias[d]];
      const esHoy = d === hoy;
      return `
        <article class="combo ${esHoy ? "hoy" : ""}">
          ${esHoy ? '<span class="hoy-tag">HOY</span>' : ""}
          <img src="img/${it.img || "mascota.svg"}" alt="${it.nombre}" loading="lazy">
          <h3>${DIAS[d]}</h3>
          <p>${it.nombre}</p>
          ${esHoy ? `<div class="combo-btns">${opciones(ITEMS[comboId(it.id)]).map(([t]) =>
            `<button class="btn price-combo" data-key="${comboId(it.id)}::${t}">+ ${t}</button>`).join("")}</div>` : ""}
        </article>`;
    }).join("");

    const proximo = orden.find((d) => d > hoy) ?? orden[0];
    $("#combo-foot").innerHTML = `
      <p class="cat-note">★ ${COMBO_DIA.nota} ★</p>
      <div class="precios">${opciones({ precios: COMBO_DIA.precios }).map(([t, p]) => `<span>${t}<strong>${fmt(p)}</strong></span>`).join("")}</div>
      ${COMBO_DIA.dias[hoy] ? "" : `<p class="muted">Hoy ${DIAS[hoy].toLowerCase()} no hay combo del día: ¡te esperamos el ${DIAS[proximo].toLowerCase()}!</p>`}`;
  }

  /* ---------------- Carta ---------------- */
  const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\W+/g, "-");

  function pintarMenu() {
    const cats = MENU.filter((c) => disponibles(c).length);
    $("#tabs").innerHTML = cats.map((c, i) =>
      `<button class="tab" role="tab" aria-selected="${i === 0}" data-target="cat-${slug(c.categoria)}">${c.categoria}</button>`).join("");

    $("#menu-list").innerHTML = cats.map((c, i) => `
      <div class="cat ${c.script ? "script" : ""}" id="cat-${slug(c.categoria)}">
        <div class="cat-head">
          <h3>${c.categoria}</h3>
          ${!c.script && i === 0 ? '<img src="img/mascota.svg" alt="" width="84" height="91">' : ""}
        </div>
        <div class="rule"></div>
        ${c.nota ? `<p class="cat-note">★ ${c.nota} ★</p>` : ""}
        ${disponibles(c).map((it) => `
          <div class="row ${it.img ? "has-photo" : ""}">
            ${it.img ? `<img class="row-photo" src="img/${it.img}" alt="${it.nombre}" loading="lazy">` : ""}
            <div>
              <h4>${it.nombre}${it.destacado ? '<span class="tag">TOP</span>' : ""}</h4>
              ${it.desc ? `<p>${it.desc}</p>` : ""}
            </div>
            <div class="prices">
              ${opciones(it).map(([t, p]) => `
                <button class="price" data-key="${it.id}::${t}" aria-label="Agregar ${it.nombre} ${t}">
                  ${t ? `<small>${t}</small>` : ""}
                  <strong>${fmt(p)}</strong>
                  <span class="add">+ Agregar</span>
                </button>`).join("")}
            </div>
          </div>`).join("")}
        ${c.info ? `<div class="cat-info">${c.info.map((x) => `<div><b>${x.titulo}</b><span>${x.texto}</span></div>`).join("")}</div>` : ""}
      </div>`).join("");

    $("#tabs").addEventListener("click", (e) => {
      const b = e.target.closest(".tab"); if (!b) return;
      document.getElementById(b.dataset.target).scrollIntoView({ behavior: "smooth" });
    });

    // Marca la pestaña de la categoría visible
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        document.querySelectorAll(".tab").forEach((t) => {
          const activa = t.dataset.target === en.target.id;
          t.setAttribute("aria-selected", activa);
          if (activa) t.scrollIntoView({ block: "nearest", inline: "center" });
        });
      });
    }, { rootMargin: "-35% 0px -60% 0px" });
    document.querySelectorAll(".cat").forEach((c) => obs.observe(c));

    $("#menu-list").addEventListener("click", (e) => {
      const b = e.target.closest(".price"); if (b) cambiar(b.dataset.key, 1);
    });
  }

  /* ---------------- Carrito ---------------- */
  const KEY = "paprika-carrito";
  const valida = (key) => {
    const [id, t] = key.split("::");
    if (id.startsWith("combo-") && id !== comboId(COMBO_DIA.dias[ahoraArgentina().dia])) return false;
    return ITEMS[id] && ITEMS[id].disponible !== false && opciones(ITEMS[id]).some(([x]) => x === t);
  };
  let carrito = {};
  try { carrito = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { carrito = {}; }
  Object.keys(carrito).forEach((k) => { if (!valida(k)) delete carrito[k]; });

  const guardar = () => { try { localStorage.setItem(KEY, JSON.stringify(carrito)); } catch { /* sin storage */ } };

  function cambiar(key, delta) {
    carrito[key] = (carrito[key] || 0) + delta;
    if (carrito[key] <= 0) delete carrito[key];
    guardar(); pintarCarrito();
  }

  function calcular() {
    const lineas = Object.entries(carrito).map(([key, q]) => {
      const [id, t] = key.split("::");
      const unit = opciones(ITEMS[id]).find(([x]) => x === t)[1];
      return { key, nombre: ITEMS[id].nombre + (t ? ` (${t})` : ""), q, unit, sub: unit * q };
    });
    const subtotal = lineas.reduce((s, l) => s + l.sub, 0);
    const esEnvio = document.querySelector('input[name="entrega"]:checked').value === "envio";
    const descuento = $("#pago").value === "Efectivo" ? Math.round((subtotal * (N.descuentoEfectivo || 0)) / 100) : 0;
    const gratis = N.envio.gratisDesde && subtotal >= N.envio.gratisDesde;
    const envio = !esEnvio || !subtotal ? 0 : gratis ? 0 : N.envio.costo; // null = a confirmar
    return { lineas, subtotal, descuento, envio, esEnvio, total: subtotal - descuento + (envio || 0), unidades: lineas.reduce((s, l) => s + l.q, 0) };
  }

  const envioTexto = (c) => (c.envio == null ? "A confirmar" : c.envio === 0 ? "Gratis" : fmt(c.envio));

  function pintarCarrito() {
    const c = calcular();

    document.querySelectorAll(".price, .price-combo").forEach((b) => {
      const q = carrito[b.dataset.key];
      let badge = b.querySelector(".in");
      if (q && !badge) { badge = document.createElement("span"); badge.className = "in"; b.appendChild(badge); }
      if (badge) q ? (badge.textContent = q) : badge.remove();
    });

    $("#cart-items").innerHTML = c.lineas.map((l) => `
      <li data-key="${l.key}">
        <span class="ci-name">${l.nombre}<small>${fmt(l.unit)} c/u</small></span>
        <span class="qty">
          <button data-act="-1" aria-label="Quitar uno">−</button><span>${l.q}</span><button class="plus" data-act="1" aria-label="Agregar uno">+</button>
        </span>
      </li>`).join("");
    $("#cart-empty").hidden = c.unidades > 0;

    $("#totals").innerHTML = `
      <div><span>Subtotal</span><span>${fmt(c.subtotal)}</span></div>
      ${c.descuento ? `<div class="desc"><span>${N.descuentoEfectivo}% OFF efectivo</span><span>−${fmt(c.descuento)}</span></div>` : ""}
      ${c.esEnvio ? `<div><span>Envío</span><span>${envioTexto(c)}</span></div>` : ""}
      <div class="total"><span>Total${c.esEnvio && c.envio == null ? " + envío" : ""}</span><span>${fmt(c.total)}</span></div>`;

    $("#cart-fab").hidden = c.unidades === 0;
    $("#cart-count").textContent = c.unidades;
    $("#cart-fab-total").textContent = fmt(c.total);
    $("#send").disabled = c.unidades === 0;

    document.querySelectorAll(".only-envio").forEach((el) => { el.hidden = !c.esEnvio; });
    document.querySelectorAll(".only-efectivo").forEach((el) => { el.hidden = $("#pago").value !== "Efectivo"; });
  }

  function abrirCarrito(abrir) {
    $("#cart").classList.toggle("open", abrir);
    $("#cart").setAttribute("aria-hidden", !abrir);
    $("#overlay").hidden = !abrir;
    $("#cart-fab").setAttribute("aria-expanded", abrir);
    document.body.style.overflow = abrir ? "hidden" : "";
  }

  function armarMensaje(f, c) {
    const L = [`¡Hola ${N.nombre}! Quiero hacer un pedido:`, ""];
    c.lineas.forEach((l) => L.push(`• ${l.q} x ${l.nombre} — ${fmt(l.sub)}`));
    L.push("", `Subtotal: ${fmt(c.subtotal)}`);
    if (c.descuento) L.push(`Descuento ${N.descuentoEfectivo}% efectivo: −${fmt(c.descuento)}`);
    if (c.esEnvio) L.push(`Envío: ${envioTexto(c)}`);
    L.push(`*Total: ${fmt(c.total)}${c.esEnvio && c.envio == null ? " + envío" : ""}*`, "");
    L.push(`Nombre: ${f.nombre.value.trim()}`);
    L.push(c.esEnvio ? `Entrega: Envío a ${f.direccion.value.trim()} (${f.barrio.value})` : "Entrega: Retiro en el local");
    L.push(`Pago: ${f.pago.value}`);
    if (f.pago.value === "Efectivo" && f.vuelto.value.trim()) L.push(`Abono con: $${f.vuelto.value.trim()}`);
    if (f.notas.value.trim()) L.push(`Aclaraciones: ${f.notas.value.trim()}`);
    return L.join("\n");
  }

  function enviar(e) {
    e.preventDefault();
    const f = e.target;
    const c = calcular();
    let ok = true;
    [f.nombre, ...(c.esEnvio ? [f.direccion] : [])].forEach((i) => {
      const vacio = !i.value.trim();
      i.classList.toggle("invalid", vacio);
      if (vacio && ok) { i.focus(); ok = false; }
    });
    if (!ok || !c.unidades) return;
    window.open(waUrl(armarMensaje(f, c)), "_blank", "noopener");
  }

  /* ---------------- Datos estructurados (Google) ---------------- */
  function schema() {
    const data = {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      name: N.nombre,
      slogan: N.slogan,
      url: N.url,
      logo: `${N.url}/favicon.svg`,
      image: `${N.url}/img/mascota.svg`,
      telephone: `+${N.whatsapp}`,
      servesCuisine: ["Hamburguesas", "Hot dogs", "Sándwiches", "Comida rápida"],
      priceRange: N.rangoPrecios,
      acceptsReservations: false,
      paymentAccepted: N.pagos.join(", "),
      currenciesAccepted: "ARS",
      sameAs: [igUrl],
      address: {
        "@type": "PostalAddress",
        streetAddress: N.direccion.calle,
        addressLocality: N.direccion.localidad,
        addressRegion: N.direccion.provincia,
        postalCode: N.direccion.cp,
        addressCountry: N.direccion.pais,
      },
      areaServed: N.envio.zonas.map((z) => ({ "@type": "Place", name: z })),
      openingHoursSpecification: Object.entries(N.horarios).flatMap(([d, ts]) =>
        ts.map(([a, c]) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: SCHEMA_DIAS[d], opens: a, closes: c }))),
      hasMenu: {
        "@type": "Menu",
        name: `Carta ${N.nombre}`,
        url: `${N.url}/#menu`,
        hasMenuSection: MENU.map((c) => ({
          "@type": "MenuSection",
          name: c.categoria,
          hasMenuItem: disponibles(c).map((it) => ({
            "@type": "MenuItem",
            name: it.nombre,
            ...(it.desc && { description: it.desc }),
            offers: opciones(it).map(([t, p]) => ({ "@type": "Offer", ...(t && { name: t }), price: p, priceCurrency: "ARS" })),
          })),
        })),
      },
    };
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }

  /* ---------------- Inicio ---------------- */
  pintarInfo();
  pintarCombos();
  pintarMenu();
  pintarEstado();
  pintarCarrito();
  schema();

  let diaActual = ahoraArgentina().dia;
  setInterval(() => {
    pintarEstado();
    if (ahoraArgentina().dia === diaActual) return;
    // Cambió el día: se actualiza el combo y se descarta el de ayer del carrito
    diaActual = ahoraArgentina().dia;
    Object.keys(carrito).forEach((k) => { if (!valida(k)) delete carrito[k]; });
    guardar(); pintarCombos(); pintarCarrito();
  }, 60 * 1000);

  $("#combo-grid").addEventListener("click", (e) => {
    const b = e.target.closest(".price-combo"); if (b) cambiar(b.dataset.key, 1);
  });

  $("#cart-fab").addEventListener("click", () => abrirCarrito(true));
  $("#cart-close").addEventListener("click", () => abrirCarrito(false));
  $("#overlay").addEventListener("click", () => abrirCarrito(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") abrirCarrito(false); });
  $("#cart-items").addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]"); if (b) cambiar(b.closest("[data-key]").dataset.key, Number(b.dataset.act));
  });
  $("#checkout").addEventListener("change", pintarCarrito);
  $("#checkout").addEventListener("submit", enviar);
})();
