import Database from 'better-sqlite3';
import { mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'data', 'livingboquete.db');
mkdirSync(dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  DROP TABLE IF EXISTS places;
  DROP TABLE IF EXISTS events;
  DROP TABLE IF EXISTS posts;
  DROP TABLE IF EXISTS rentals;
  DROP TABLE IF EXISTS gallery;
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    celular TEXT,
    pais TEXT,
    retiro TEXT,
    timeline TEXT,
    interes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE places (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE events (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE posts (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE rentals (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE gallery (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
`);

const img = (seed: string, w = 800, h = 600) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

// --- SEED PLACES ---
const places = [
  {
    id: 'volcan-baru',
    cat: { es: 'Senderismo', en: 'Hiking' },
    name: { es: 'Volcán Barú', en: 'Barú Volcano' },
    short: { es: 'El punto más alto de Panamá, a 3.475 m. Sube de madrugada para ver el amanecer entre dos océanos.', en: "Panama's highest point at 3,475 m. Climb before dawn to watch the sun rise between two oceans." },
    long: { es: 'A 3.475 metros, el Barú es la cumbre de Panamá y, en los días despejados, el único punto del país desde donde se divisan el Pacífico y el Caribe a la vez.', en: "At 3,475 metres, Barú is the summit of Panama and, on clear days, the only place in the country where you can see both the Pacific and the Caribbean at once." },
    hours: { es: 'Acceso 24 h · ascenso nocturno recomendado', en: '24h access · night ascent recommended' },
    cost: { es: 'Entrada al parque $5 · guía desde $60', en: 'Park fee $5 · guide from $60' },
    tips: { es: ['Lleva capas térmicas, guantes y linterna frontal', 'Reserva un guía certificado del parque', 'Sal cerca de medianoche para llegar al amanecer'], en: ['Bring thermal layers, gloves and a headlamp', 'Book a certified park guide', 'Leave near midnight to reach the summit by sunrise'] },
    img: img('baru-volcano', 800, 600),
  },
  {
    id: 'quetzales',
    cat: { es: 'Naturaleza', en: 'Nature' },
    name: { es: 'Sendero Los Quetzales', en: 'Los Quetzales Trail' },
    short: { es: 'Bosque nuboso entre Boquete y Cerro Punta, hogar del esquivo quetzal resplandeciente.', en: 'Cloud forest between Boquete and Cerro Punta, home to the elusive resplendent quetzal.' },
    long: { es: 'Uno de los senderos más bellos de Centroamérica cruza el bosque nuboso del Parque Internacional La Amistad.', en: "One of Central America's most beautiful trails crosses the cloud forest of La Amistad International Park." },
    hours: { es: 'Recomendado 6:00 – 14:00', en: 'Recommended 6:00 – 14:00' },
    cost: { es: 'Entrada $5 · transporte de retorno desde $25', en: 'Entry $5 · return transport from $25' },
    tips: { es: ['La mejor época de avistamiento es de marzo a junio', 'Lleva binoculares y poncho impermeable', 'Contrata guía local para la fauna'], en: ['Best sightings are from March to June', 'Bring binoculars and a rain poncho', 'Hire a local guide for wildlife'] },
    img: img('cloud-forest', 800, 600),
  },
  {
    id: 'cascadas',
    cat: { es: 'Senderismo', en: 'Hiking' },
    name: { es: 'Las Tres Cascadas', en: 'The Lost Waterfalls' },
    short: { es: 'Una caminata corta por la selva hasta tres saltos de agua escondidos en la montaña.', en: 'A short jungle hike to three waterfalls hidden in the mountain.' },
    long: { es: 'En el corregimiento de Bajo Mono, un sendero de unas dos horas se interna en la selva húmeda hasta descubrir tres cascadas escalonadas.', en: 'In Bajo Mono, a two-hour trail winds into the rainforest to reveal three stepped waterfalls.' },
    hours: { es: '8:00 – 16:00 (último ingreso 14:00)', en: '8:00 – 16:00 (last entry 14:00)' },
    cost: { es: 'Entrada $10 por persona', en: 'Entry $10 per person' },
    tips: { es: ['Usa calzado con buen agarre', 'Lleva traje de baño', 'Evita los días de lluvia intensa'], en: ['Wear shoes with good grip', 'Bring a swimsuit', 'Avoid days of heavy rain'] },
    img: img('waterfalls-jungle', 800, 600),
  },
  {
    id: 'termales',
    cat: { es: 'Bienestar', en: 'Wellness' },
    name: { es: 'Aguas Termales de Caldera', en: 'Caldera Hot Springs' },
    short: { es: 'Pozas naturales de agua mineral caliente a la orilla del río.', en: 'Natural hot mineral pools by the river.' },
    long: { es: 'A orillas del río Caldera brotan pozas de agua termal rica en minerales.', en: 'Along the Caldera river, mineral-rich thermal pools bubble up.' },
    hours: { es: '7:00 – 18:00', en: '7:00 – 18:00' },
    cost: { es: 'Entrada $3 · parqueo $2', en: 'Entry $3 · parking $2' },
    tips: { es: ['Lleva agua y protector solar', 'Combínalo con los petroglifos cercanos', 'Mejor temprano'], en: ['Bring water and sunscreen', 'Combine with the nearby petroglyphs', 'Go early to avoid crowds'] },
    img: img('hot-springs-river', 800, 600),
  },
  {
    id: 'cafe',
    cat: { es: 'Cultura', en: 'Culture' },
    name: { es: 'Ruta del café de altura', en: 'Highland Coffee Route' },
    short: { es: 'Recorre las fincas que producen el legendario café Geisha.', en: 'Tour the farms behind the legendary Geisha coffee.' },
    long: { es: 'El microclima de Boquete dio origen al café Geisha, que rompe récords de precio en subastas internacionales.', en: "Boquete's microclimate gave rise to Geisha coffee, which breaks price records at international auctions." },
    hours: { es: 'Tours 8:00 y 14:00 · 2–3 horas', en: 'Tours at 8:00 and 14:00 · 2–3 hours' },
    cost: { es: 'Desde $30 por persona', en: 'From $30 per person' },
    tips: { es: ['Reserva con un día de antelación', 'La cosecha va de noviembre a marzo', 'Pregunta por los lotes de Geisha natural'], en: ['Book a day in advance', 'Harvest runs November to March', 'Ask for the natural Geisha lots'] },
    img: img('coffee-farm', 800, 600),
  },
  {
    id: 'canopy',
    cat: { es: 'Aventura', en: 'Adventure' },
    name: { es: 'Canopy & Tree Trek', en: 'Canopy & Tree Trek' },
    short: { es: 'Vuela sobre el bosque nuboso por una red de tirolesas y puentes colgantes.', en: 'Fly over the cloud forest on a network of zip-lines and hanging bridges.' },
    long: { es: 'Una serie de tirolesas conecta plataformas suspendidas entre los árboles de la reserva.', en: 'A series of zip-lines connects platforms suspended among the trees of the reserve.' },
    hours: { es: 'Salidas 8:00, 11:00 y 14:00', en: 'Departures 8:00, 11:00 and 14:00' },
    cost: { es: 'Desde $65 por persona', en: 'From $65 per person' },
    tips: { es: ['Ropa cómoda y zapatos cerrados', 'No apto para menores de 5 años', 'Peso máximo 120 kg'], en: ['Comfortable clothes and closed shoes', 'Not suitable for under 5s', 'Maximum weight 120 kg'] },
    img: img('zipline-forest', 800, 600),
  },
];

const events = [
  { id: 'feria-flores', d: '10', m: { es: 'ENE', en: 'JAN' }, range: { es: '10 – 21 Enero 2027', en: 'Jan 10 – 21, 2027' }, name: { es: 'Feria de las Flores y del Café', en: 'Flower & Coffee Festival' }, cat: { es: 'Festival', en: 'Festival' }, time: { es: '9:00 – 22:00', en: '9:00 – 22:00' }, place: { es: 'Recinto Ferial, Boquete', en: 'Fairgrounds, Boquete' }, desc: { es: 'El evento insignia de Boquete: jardines, catas de café, artesanías y música en vivo.', en: "Boquete's flagship event: gardens, coffee tastings, crafts and live music." }, img: img('flower-festival', 800, 600) },
  { id: 'jazz-blues', d: '27', m: { es: 'FEB', en: 'FEB' }, range: { es: '27 Feb – 1 Mar 2027', en: 'Feb 27 – Mar 1, 2027' }, name: { es: 'Boquete Jazz & Blues Festival', en: 'Boquete Jazz & Blues Festival' }, cat: { es: 'Música', en: 'Music' }, time: { es: '16:00 – 23:00', en: '16:00 – 23:00' }, place: { es: 'Parque Central', en: 'Central Park' }, desc: { es: 'Tres días de jazz y blues con artistas internacionales al aire libre.', en: 'Three open-air days of jazz and blues with international artists.' }, img: img('jazz-concert', 800, 600) },
  { id: 'orquideas', d: '18', m: { es: 'ABR', en: 'APR' }, range: { es: '18 – 20 Abril 2027', en: 'Apr 18 – 20, 2027' }, name: { es: 'Expo Orquídeas de Chiriquí', en: 'Chiriquí Orchid Expo' }, cat: { es: 'Naturaleza', en: 'Nature' }, time: { es: '10:00 – 18:00', en: '10:00 – 18:00' }, place: { es: 'Casa de la Cultura', en: 'Culture House' }, desc: { es: 'Cientos de especies de orquídeas, exhibiciones de cultivadores y talleres.', en: 'Hundreds of orchid species, grower exhibitions and workshops.' }, img: img('orchid-expo', 800, 600) },
  { id: 'carrera-baru', d: '08', m: { es: 'NOV', en: 'NOV' }, range: { es: '8 Noviembre 2026', en: 'Nov 8, 2026' }, name: { es: 'Carrera al Volcán Barú', en: 'Barú Volcano Race' }, cat: { es: 'Deporte', en: 'Sport' }, time: { es: '4:00 – 12:00', en: '4:00 – 12:00' }, place: { es: 'Salida: Parque Central', en: 'Start: Central Park' }, desc: { es: 'Una de las carreras de montaña más duras del continente.', en: "One of the continent's toughest mountain races." }, img: img('mountain-race', 800, 600) },
];

const posts = [
  { id: 'senderos', author: 'Marta Quirós', date: { es: '12 Jun 2026', en: 'Jun 12, 2026' }, cat: { es: 'Recomendaciones', en: 'Tips' }, title: { es: 'Cinco senderos imperdibles en Boquete', en: 'Five must-do trails in Boquete' }, excerpt: { es: 'De caminatas suaves entre cafetales a la exigente cumbre del Barú.', en: 'From gentle walks through coffee farms to the demanding Barú summit.' }, body: { es: ['Boquete es, ante todo, un pueblo para caminar.', 'El Sendero Los Quetzales es el más célebre.', 'Quien busque exigencia encontrará en el Volcán Barú el reto definitivo.'], en: ['Boquete is, above all, a town for walking.', 'The Los Quetzales Trail is the most famous.', 'Those seeking a challenge will find the ultimate test on Barú Volcano.'] }, img: img('hiking-trail-boquete', 800, 500) },
  { id: 'cafe-altura', author: 'Diego Pittí', date: { es: '3 Jun 2026', en: 'Jun 3, 2026' }, cat: { es: 'Cultura', en: 'Culture' }, title: { es: 'El viaje del grano: café de altura', en: 'The journey of the bean: highland coffee' }, excerpt: { es: 'Cómo el microclima de Boquete convirtió a un pueblo en la cuna del café más caro del mundo.', en: "How Boquete's microclimate turned a mountain town into the home of the world's most expensive coffee." }, body: { es: ['La niebla constante, la altitud y los suelos volcánicos crean un microclima irrepetible.', 'Visitar una finca es entender ese viaje.', 'La cosecha, de noviembre a marzo, es la mejor época.'], en: ['Constant mist, altitude and volcanic soils create a one-of-a-kind microclimate.', 'Visiting a farm means understanding that journey.', 'The harvest, from November to March, is the best time.'] }, img: img('coffee-highland', 800, 500) },
  { id: 'quetzal', author: 'Lucía Samudio', date: { es: '24 May 2026', en: 'May 24, 2026' }, cat: { es: 'Naturaleza', en: 'Nature' }, title: { es: 'Avistar el quetzal: temporada y consejos', en: 'Spotting the quetzal: season and tips' }, excerpt: { es: 'El ave más buscada de las tierras altas tiene sus reglas.', en: 'The most sought-after bird of the highlands has its rules.' }, body: { es: ['El quetzal resplandeciente anida en el bosque nuboso entre marzo y junio.', 'El Sendero Los Quetzales y las fincas cercanas a Bajo Mono son los puntos clásicos.', 'Un guía local marca la diferencia.'], en: ['The resplendent quetzal nests in the cloud forest between March and June.', 'The Los Quetzales Trail and the farms near Bajo Mono are the classic spots.', 'A local guide makes the difference.'] }, img: img('quetzal-bird', 800, 500) },
  { id: 'empacar', author: 'Equipo Boquete', date: { es: '15 May 2026', en: 'May 15, 2026' }, cat: { es: 'Recomendaciones', en: 'Tips' }, title: { es: '¿Qué llevar a Boquete? La lista definitiva', en: 'What to pack for Boquete? The definitive list' }, excerpt: { es: 'Desde capas térmicas hasta poncho impermeable.', en: 'From thermal layers to a rain poncho.' }, body: { es: ['El clima de Boquete sorprende: días cálidos y noches frescas.', 'Para los senderos, calzado de trekking y un poncho impermeable son imprescindibles.', 'No olvides protector solar, binoculares y una botella de agua.'], en: ["Boquete's weather surprises: warm days and cool nights.", 'For trails, trekking shoes and a waterproof poncho are a must.', "Don't forget sunscreen, binoculars and a reusable water bottle."] }, img: img('packing-travel', 800, 500) },
];

const rentals = [
  { id: 'cafetal', type: 'casa', price: 120, guests: 6, beds: 3, baths: 2, rating: 4.9, reviews: 128, name: { es: 'Cabaña El Cafetal', en: 'El Cafetal Cabin' }, loc: { es: 'Bajo Mono, Boquete', en: 'Bajo Mono, Boquete' }, short: { es: 'Cabaña de madera rodeada de cafetales, con chimenea y vistas al bosque nuboso.', en: 'Wooden cabin surrounded by coffee farms, with a fireplace and cloud-forest views.' }, desc: { es: 'A diez minutos del pueblo, esta cabaña de madera se levanta en medio de una finca de café.', en: 'Ten minutes from town, this wooden cabin sits in the middle of a working coffee farm.' }, host: { name: 'Roberto Achú', line: { es: 'Caficultor y anfitrión desde 2018', en: 'Coffee grower and host since 2018' } }, amen: ['wifi', 'kitchen', 'view', 'parking', 'fireplace'], reviewsList: [{ name: 'James Carter', rating: 5, date: { es: 'Junio 2026', en: 'June 2026' }, text: { es: 'Despertar entre cafetales no tiene precio.', en: 'Waking up among coffee plants is priceless.' } }], img: img('cabin-coffee-farm', 800, 560), lat: 8.7942, lng: -82.4467 },
  { id: 'niebla', type: 'bnb', price: 65, guests: 2, beds: 1, baths: 1, rating: 4.8, reviews: 94, name: { es: 'B&B Jardín de Niebla', en: 'Jardín de Niebla B&B' }, loc: { es: 'Alto Boquete', en: 'Alto Boquete' }, short: { es: 'Habitación privada con desayuno casero y jardín de orquídeas.', en: 'Private room with homemade breakfast and an orchid garden.' }, desc: { es: 'Un bed & breakfast familiar en una casa rodeada de jardines de orquídeas.', en: 'A family-run bed & breakfast in a house surrounded by orchid gardens.' }, host: { name: 'Elena Caballero', line: { es: 'Anfitriona y jardinera', en: 'Host and gardener' } }, amen: ['wifi', 'breakfast', 'view', 'parking'], reviewsList: [{ name: 'Ana Lucía Rivas', rating: 5, date: { es: 'Junio 2026', en: 'June 2026' }, text: { es: 'El desayuno es espectacular.', en: 'Breakfast is spectacular.' } }], img: img('bnb-orchid-valley', 800, 560), lat: 8.7835, lng: -82.4389 },
  { id: 'caldera', type: 'apto', price: 90, guests: 4, beds: 2, baths: 1, rating: 4.7, reviews: 76, name: { es: 'Apartamento Río Caldera', en: 'Río Caldera Apartment' }, loc: { es: 'Centro de Boquete', en: 'Downtown Boquete' }, short: { es: 'Apartamento moderno junto al río.', en: 'Modern apartment by the river.' }, desc: { es: 'Un apartamento luminoso y moderno a orillas del río Caldera.', en: 'A bright, modern apartment on the banks of the Caldera river.' }, host: { name: 'Lucía Samudio', line: { es: 'Anfitriona Superhost', en: 'Superhost' } }, amen: ['wifi', 'kitchen', 'parking', 'pool'], reviewsList: [{ name: 'Carlos Méndez', rating: 5, date: { es: 'Junio 2026', en: 'June 2026' }, text: { es: 'Ubicación inmejorable.', en: 'Unbeatable location.' } }], img: img('apartment-river', 800, 560), lat: 8.7761, lng: -82.4312 },
  { id: 'mirador', type: 'casa', price: 180, guests: 8, beds: 4, baths: 3, rating: 5.0, reviews: 61, name: { es: 'Casa Mirador del Barú', en: 'Mirador del Barú House' }, loc: { es: 'Volcancito, Boquete', en: 'Volcancito, Boquete' }, short: { es: 'Casa amplia con vista directa al Volcán Barú.', en: 'Spacious house with direct views of Barú Volcano.' }, desc: { es: 'Una casa amplia diseñada para grupos y familias, con vista frontal al Volcán Barú.', en: 'A spacious house designed for groups and families, with a front view of Barú Volcano.' }, host: { name: 'Diego Pittí', line: { es: 'Anfitrión local', en: 'Local host' } }, amen: ['wifi', 'kitchen', 'view', 'parking', 'pool', 'fireplace'], reviewsList: [{ name: 'Thomas Dubois', rating: 5, date: { es: 'Mayo 2026', en: 'May 2026' }, text: { es: 'La vista al volcán es de otro mundo.', en: 'The volcano view is out of this world.' } }], img: img('volcano-view-house', 800, 560), lat: 8.8015, lng: -82.4521 },
];

const gallery = [
  { id: 'g-baru', cat: 'naturaleza', label: { es: 'Volcán Barú al amanecer', en: 'Barú Volcano at dawn' }, img: img('baru-dawn', 600, 600) },
  { id: 'g-cafe1', cat: 'cafe', label: { es: 'Recolección de café', en: 'Coffee harvest' }, img: img('coffee-harvest', 600, 600) },
  { id: 'g-quetzal', cat: 'naturaleza', label: { es: 'Quetzal resplandeciente', en: 'Resplendent quetzal' }, img: img('quetzal-close', 600, 600) },
  { id: 'g-flores', cat: 'cultura', label: { es: 'Feria de las Flores', en: 'Flower Festival' }, img: img('flower-festival-2', 600, 600) },
  { id: 'g-cascada', cat: 'naturaleza', label: { es: 'Las Tres Cascadas', en: 'The Lost Waterfalls' }, img: img('cascade-jungle', 600, 600) },
  { id: 'g-termales', cat: 'aventura', label: { es: 'Aguas termales', en: 'Hot springs' }, img: img('thermal-pools', 600, 600) },
  { id: 'g-pueblo', cat: 'cultura', label: { es: 'Pueblo de Boquete', en: 'Boquete town' }, img: img('boquete-town', 600, 600) },
  { id: 'g-cafe2', cat: 'cafe', label: { es: 'Taza de café Geisha', en: 'Cup of Geisha coffee' }, img: img('geisha-coffee-cup', 600, 600) },
  { id: 'g-canopy', cat: 'aventura', label: { es: 'Canopy en el bosque', en: 'Forest canopy' }, img: img('canopy-zipline', 600, 600) },
  { id: 'g-orquideas', cat: 'naturaleza', label: { es: 'Orquídeas silvestres', en: 'Wild orchids' }, img: img('wild-orchids', 600, 600) },
  { id: 'g-mercado', cat: 'cultura', label: { es: 'Mercado local', en: 'Local market' }, img: img('local-market', 600, 600) },
  { id: 'g-rio', cat: 'naturaleza', label: { es: 'Río Caldera', en: 'Caldera river' }, img: img('caldera-river', 600, 600) },
];

// Insert data
const insertPlace = db.prepare('INSERT OR REPLACE INTO places (id, data) VALUES (?, ?)');
const insertEvent = db.prepare('INSERT OR REPLACE INTO events (id, data) VALUES (?, ?)');
const insertPost = db.prepare('INSERT OR REPLACE INTO posts (id, data) VALUES (?, ?)');
const insertRental = db.prepare('INSERT OR REPLACE INTO rentals (id, data) VALUES (?, ?)');
const insertGallery = db.prepare('INSERT OR REPLACE INTO gallery (id, data) VALUES (?, ?)');

const seedAll = db.transaction(() => {
  for (const p of places) insertPlace.run(p.id, JSON.stringify(p));
  for (const e of events) insertEvent.run(e.id, JSON.stringify(e));
  for (const p of posts) insertPost.run(p.id, JSON.stringify(p));
  for (const r of rentals) insertRental.run(r.id, JSON.stringify(r));
  for (const g of gallery) insertGallery.run(g.id, JSON.stringify(g));
});

seedAll();
db.close();

console.log('✓ Database seeded successfully at', DB_PATH);
console.log(`  Places: ${places.length}, Events: ${events.length}, Posts: ${posts.length}, Rentals: ${rentals.length}, Gallery: ${gallery.length}`);
