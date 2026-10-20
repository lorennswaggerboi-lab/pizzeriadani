/*
 * ============================================================
 *  DATOS DEL NEGOCIO Y MENÚ — ESTE ES EL ÚNICO ARCHIVO A EDITAR
 * ============================================================
 *  - Cambiar un precio: buscá el producto y cambiá el número.
 *    Los productos con tamaños tienen  precios: { Simple: ..., Doble: ..., Triple: ... }
 *    Los que tienen un solo precio usan  precio: ...
 *  - Subir TODO el menú un %: cambiá "aumentoGeneral" (ej: 10 = +10%).
 *  - Poner una foto: guardala en /img y poné el nombre en "img" (ej: img: "american.jpg").
 *  - Ocultar un producto sin borrarlo: agregale  disponible: false
 *  - Fotos de la galería: guardalas en /img y agregalas a GALERIA (abajo de todo).
 *
 *  Horarios: 0 = domingo, 1 = lunes ... 6 = sábado.
 *  Si cierra después de medianoche, poné la hora igual (ej "00:30").
 */

const NEGOCIO = {
  nombre: "Paprika Burger",
  slogan: "La espera vale cada mordida",
  direccion: {
    calle: "9 de Julio 219",
    barrio: "Moreno Centro",
    localidad: "Moreno",
    provincia: "Buenos Aires",
    cp: "B1744",
    pais: "AR",
  },
  telefonoVisible: "11 2548-3069",
  whatsapp: "5491125483069", // formato internacional, sin + ni espacios
  instagram: "paprikaburger_",
  url: "https://paprikaburger.com.ar", // dominio a contratar
  rangoPrecios: "$$",

  horarios: {
    0: [["11:00", "00:30"]],
    1: [["11:00", "00:30"]],
    2: [["11:00", "00:30"]],
    3: [["11:00", "00:30"]],
    4: [["11:00", "00:30"]],
    5: [["11:00", "00:30"]],
    6: [["11:00", "00:30"]],
  },

  envio: {
    costo: null, // null = "a confirmar por WhatsApp"; o un número, ej 1500
    gratisDesde: null, // ej 40000; null para no ofrecer envío gratis
    demora: "30 a 45 min",
    zonas: ["Moreno Centro", "Moreno Norte", "Moreno Sur", "Paso del Rey", "La Reja"],
  },

  pagos: ["Efectivo", "Transferencia", "Mercado Pago"],
  descuentoEfectivo: 10, // % de descuento pagando en efectivo; 0 para desactivar

  aumentoGeneral: 0, // % que se suma a todos los precios
};

const MENU = [
  {
    categoria: "Burgers",
    nota: "Todos nuestros combos incluyen papas fritas · Todas tienen opción veggie con medallón NotCo",
    items: [
      { id: "cheese", nombre: "Cheese", desc: "Pan, carne y cheddar.", img: "cheese.jpg", precios: { Simple: 12500, Doble: 15500, Triple: 18500 } },
      { id: "cheese-bacon", nombre: "Cheese Bacon", desc: "Pan, carne, extra cheddar, extra bacon.", precios: { Simple: 14000, Doble: 17000, Triple: 20000 } },
      { id: "american", nombre: "American", desc: "Pan, carne, cheddar, bacon, lechuga, tomate, cebolla, pepinillos agridulces y salsa Paprika.", img: "american.jpg", precios: { Simple: 13500, Doble: 16500, Triple: 19500 }, destacado: true },
      { id: "stacker", nombre: "Stacker", desc: "Pan, carne, cheddar, bacon, cebolla y salsa Paprika.", img: "stacker.jpg", precios: { Simple: 13500, Doble: 16500, Triple: 19500 } },
      { id: "quarter", nombre: "Quarter", desc: "Pan, carne, cheddar, cebolla, pepinillos agridulces y salsa Quarter.", img: "quarter.jpg", precios: { Simple: 13500, Doble: 16500, Triple: 19500 } },
      { id: "crispy-onion", nombre: "Crispy Onion", desc: "Pan, carne, cheddar, bacon, cebolla crispy y salsa alioli.", img: "crispy-onion.jpg", precios: { Simple: 13500, Doble: 16500, Triple: 19500 } },
      { id: "crispy-deluxe", nombre: "Crispy Deluxe", desc: "Pan, carne, provolone, cheddar, dambo, bacon, cebolla crispy y salsa Paprika.", precios: { Simple: 14500, Doble: 17800, Triple: 20800 } },
      { id: "egg-bacon", nombre: "Egg Bacon", desc: "Pan, carne, cheddar, bacon y huevo.", precios: { Simple: 14000, Doble: 17000, Triple: 20000 } },
      { id: "spicy", nombre: "Spicy", desc: "Pan, carne, queso dambo, bacon, morrones asados, cebolla grillada y mayo picante.", precios: { Simple: 14500, Doble: 17800, Triple: 20800 } },
      { id: "royal-blue", nombre: "Royal Blue", desc: "Pan, carne, queso dambo, queso azul, tomates secos, nueces, rúcula y mayo de pesto.", precios: { Simple: 14500, Doble: 17800, Triple: 20800 } },
      { id: "pomodoro", nombre: "Pomodoro", desc: "Pan, carne, queso provolone, tomate, albahaca y mayo de pesto.", precios: { Simple: 14500, Doble: 17800, Triple: 20800 } },
      { id: "ranch", nombre: "Ranch", desc: "Pan, carne, queso cheddar, bacon, pepinillos, cebolla morada y salsa Ranch.", precios: { Simple: 14000, Doble: 17000, Triple: 20000 } },
      { id: "fried-onion", nombre: "Fried Onion", desc: "Pan, carne smasheada con cheddar y cebolla.", precios: { Simple: 13500, Doble: 16500, Triple: 19500 } },
      { id: "caramel-bbq", nombre: "Caramel BBQ", desc: "Pan, carne, cheddar, bacon, cebolla caramelizada y salsa barbacoa.", precios: { Simple: 13500, Doble: 16500, Triple: 19500 } },
      { id: "onion-bbq", nombre: "Onion BBQ", desc: "Pan, carne, cheddar, bacon, aros de cebolla y salsa barbacoa.", precios: { Simple: 14500, Doble: 17800, Triple: 20800 } },
    ],
  },
  {
    categoria: "Burger Chicken",
    script: true,
    items: [
      { id: "chicken-paprika", nombre: "Chicken Paprika", desc: "Pan, pieza de pollo frito, cheddar, lechuga, tomate, pepinillos agridulces y salsa Paprika.", precio: 16500 },
      { id: "chicken-bbq", nombre: "Chicken BBQ", desc: "Pan, pieza de pollo frito, cheddar, bacon, cebolla morada y salsa barbacoa.", precio: 17000 },
    ],
  },
  {
    categoria: "Hot Dogs",
    items: [
      { id: "american-hot-dog", nombre: "American Hot Dog", desc: "Salchicha ahumada, cheddar y bacon.", precio: 6500 },
      { id: "clasic-hot-dog", nombre: "Clasic Hot Dog", desc: "Salchicha ahumada, queso dambo, tomate, albahaca y mayo de pesto.", precio: 6500 },
      { id: "paprika-hot-dog", nombre: "Paprika Hot Dog", desc: "Salchicha ahumada, queso provolone, cebolla grillada, morrón grillado y mayo picante.", precio: 6500 },
      { id: "blue-hot-dog", nombre: "Blue Hot Dog", desc: "Salchicha ahumada, queso provolone, dambo, queso azul y mayo de pesto.", precio: 6500 },
    ],
  },
  {
    categoria: "Sándwiches",
    nota: "Los precios incluyen 3 ingredientes y 1 aderezo: indicalos en «Aclaraciones» al pedir",
    info: [
      { titulo: "Ingredientes", texto: "Queso dambo · Cheddar · Provolone · Roquefort · Lechuga · Rúcula · Albahaca · Tomate · Huevo · Cebolla grillada, morada o cruda · Morrones asados" },
      { titulo: "Aderezos", texto: "Paprika · Mayo de pesto · Quarter · Alioli · Barbacoa · Mayonesa · Mostaza · Ketchup" },
    ],
    items: [
      { id: "suprema", nombre: "Suprema", desc: "", precio: 12000 },
      { id: "milanesa", nombre: "Milanesa", desc: "", precio: 14500 },
      { id: "bondiola", nombre: "Bondiola", desc: "", precio: 14500 },
      { id: "lomito", nombre: "Lomito", desc: "", precio: 17000 },
      { id: "guarnicion-papas", nombre: "Agregá guarnición de papas", desc: "", precio: 4000 },
    ],
  },
  {
    categoria: "Ensalada",
    script: true,
    items: [
      { id: "caesar", nombre: "Ensalada Caesar", desc: "Con pollo frito o a la plancha.", precios: { "Pollo frito": 14000, "A la plancha": 14000 } },
    ],
  },
  {
    categoria: "Para picar",
    nota: "Incluye dip de salsa alioli o barbacoa",
    items: [
      { id: "nuggets", nombre: "Nuggets x6", desc: "", precio: 6000 },
      { id: "aros", nombre: "Aros de cebolla x6", desc: "", precio: 6000 },
      { id: "bastones-muzza", nombre: "Bastones de muzza x6", desc: "", precio: 7500 },
      { id: "tequenos", nombre: "Tequeños x4", desc: "", precio: 7000 },
    ],
  },
  {
    categoria: "Papas fritas",
    items: [
      { id: "papas", nombre: "Porción de papas fritas", desc: "", precio: 9000 },
      { id: "papas-cheddar", nombre: "Porción con cheddar", desc: "", precio: 9500 },
      { id: "papas-cheddar-bacon", nombre: "Porción con cheddar, bacon y verdeo", desc: "", precio: 12000 },
      { id: "agregar-cheddar-bacon", nombre: "Agregar cheddar y bacon a tus papas", desc: "", precio: 4000 },
    ],
  },
  {
    categoria: "Postres",
    items: [
      { id: "chocotorta", nombre: "Chocotorta", desc: "", precios: { Grande: 7500, Individual: 3500 } },
      { id: "tiramisu", nombre: "Tiramisú", desc: "", precios: { Grande: 7500, Individual: 3500 } },
      { id: "oreo", nombre: "Oreo", desc: "", precios: { Grande: 7500, Individual: 3500 } },
      { id: "frambuesas", nombre: "Frambuesas bañadas en chocolate", desc: "", precio: 8000 },
    ],
  },
  {
    categoria: "Bebidas",
    items: [
      { id: "linea-coca", nombre: "Línea Coca-Cola", desc: "", precio: 3000 },
      { id: "aquarius", nombre: "Aquarius", desc: "", precio: 3000 },
      { id: "agua", nombre: "Agua", desc: "", precio: 2500 },
      { id: "coca-225", nombre: "Coca 2,25 L", desc: "", precio: 6500 },
      { id: "coca-175", nombre: "Coca 1,75 L", desc: "", precio: 5900 },
    ],
  },
  {
    categoria: "Cervezas",
    items: [
      { id: "andes", nombre: "Andes lata", desc: "", precios: { IPA: 4000, Roja: 4000, Rubia: 4000, Negra: 4000 } },
      { id: "corona", nombre: "Corona 330 cc", desc: "", precio: 4500 },
    ],
  },
];

// Combo del día (incluye papas y gaseosa chica).
// "dias" usa los mismos números que los horarios y el id de una burger de la carta.
const COMBO_DIA = {
  nota: "Los combos incluyen papas y gaseosa chica",
  precios: { Simple: 13500, Doble: 16500 },
  dias: { 3: "american", 4: "stacker", 5: "cheese", 6: "crispy-onion", 0: "quarter" },
};

// Fotos para la galería (guardalas en /img). Si queda vacía, la sección no se muestra.
// Ej: { img: "local.jpg", alt: "Nuestro local de noche" }
const GALERIA = [
  { img: "stacker.jpg", alt: "Stacker triple con papas y dip de cheddar" },
  { img: "crispy-onion.jpg", alt: "Crispy Onion doble con bacon y cebolla crispy" },
  { img: "american.jpg", alt: "American con lechuga, tomate y bacon" },
  { img: "cheese.jpg", alt: "Cheese doble recién mordida" },
];
