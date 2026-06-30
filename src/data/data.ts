export type Bilingual = { es: string; en: string };

export interface Place {
  id: string;
  cat: Bilingual;
  name: Bilingual;
  short: Bilingual;
  long: Bilingual;
  hours: Bilingual;
  cost: Bilingual;
  tips: { es: string[]; en: string[] };
  img: string;
}

export interface Event {
  id: string;
  d: string;
  m: Bilingual;
  range: Bilingual;
  name: Bilingual;
  cat: Bilingual;
  time: Bilingual;
  place: Bilingual;
  desc: Bilingual;
  img: string;
}

export interface Post {
  id: string;
  author: string;
  date: Bilingual;
  cat: Bilingual;
  title: Bilingual;
  excerpt: Bilingual;
  body: { es: string[]; en: string[] };
  img: string;
}

export interface Rental {
  id: string;
  type: 'casa' | 'bnb' | 'apto';
  price: number;
  guests: number;
  beds: number;
  baths: number;
  rating: number;
  reviews: number;
  name: Bilingual;
  loc: Bilingual;
  short: Bilingual;
  desc: Bilingual;
  host: { name: string; line: Bilingual };
  amen: string[];
  reviewsList: { name: string; rating: number; date: Bilingual; text: Bilingual }[];
  img: string;
  lat: number;
  lng: number;
}

export interface GalleryItem {
  id: string;
  cat: string;
  label: Bilingual;
  img: string;
}

// --- IMAGES (Picsum deterministic seeds) ---
const img = (seed: string, w = 800, h = 600) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

// --- PLACES ---
export const PLACES: Place[] = [
  {
    id: 'volcan-baru',
    cat: { es: 'Senderismo', en: 'Hiking' },
    name: { es: 'Volcán Barú', en: 'Barú Volcano' },
    short: {
      es: 'El punto más alto de Panamá, a 3.475 m. Sube de madrugada para ver el amanecer entre dos océanos.',
      en: 'Panama\'s highest point at 3,475 m. Climb before dawn to watch the sun rise between two oceans.',
    },
    long: {
      es: 'A 3.475 metros, el Barú es la cumbre de Panamá y, en los días despejados, el único punto del país desde donde se divisan el Pacífico y el Caribe a la vez. El ascenso clásico parte de Boquete de madrugada por un sendero exigente de unas 6 horas. La recompensa es un amanecer sobre un mar de nubes que no se olvida.',
      en: 'At 3,475 metres, Barú is the summit of Panama and, on clear days, the only place in the country where you can see both the Pacific and the Caribbean at once. The classic ascent leaves Boquete before dawn on a demanding 6-hour trail. The reward is a sunrise over a sea of clouds you will never forget.',
    },
    hours: { es: 'Acceso 24 h · ascenso nocturno recomendado', en: '24h access · night ascent recommended' },
    cost: { es: 'Entrada al parque $5 · guía desde $60', en: 'Park fee $5 · guide from $60' },
    tips: {
      es: ['Lleva capas térmicas, guantes y linterna frontal', 'Reserva un guía certificado del parque', 'Sal cerca de medianoche para llegar al amanecer'],
      en: ['Bring thermal layers, gloves and a headlamp', 'Book a certified park guide', 'Leave near midnight to reach the summit by sunrise'],
    },
    img: img('baru-volcano', 800, 600),
  },
  {
    id: 'quetzales',
    cat: { es: 'Naturaleza', en: 'Nature' },
    name: { es: 'Sendero Los Quetzales', en: 'Los Quetzales Trail' },
    short: {
      es: 'Bosque nuboso entre Boquete y Cerro Punta, hogar del esquivo quetzal resplandeciente.',
      en: 'Cloud forest between Boquete and Cerro Punta, home to the elusive resplendent quetzal.',
    },
    long: {
      es: 'Uno de los senderos más bellos de Centroamérica cruza el bosque nuboso del Parque Internacional La Amistad. Entre helechos gigantes, robles y orquídeas vive el quetzal resplandeciente, símbolo de las tierras altas. El recorrido completo enlaza Boquete con Cerro Punta siguiendo el río Caldera.',
      en: 'One of Central America\'s most beautiful trails crosses the cloud forest of La Amistad International Park. Among giant ferns, oaks and orchids lives the resplendent quetzal, emblem of the highlands. The full route links Boquete with Cerro Punta along the Caldera river.',
    },
    hours: { es: 'Recomendado 6:00 – 14:00', en: 'Recommended 6:00 – 14:00' },
    cost: { es: 'Entrada $5 · transporte de retorno desde $25', en: 'Entry $5 · return transport from $25' },
    tips: {
      es: ['La mejor época de avistamiento es de marzo a junio', 'Lleva binoculares y poncho impermeable', 'Contrata guía local para la fauna'],
      en: ['Best sightings are from March to June', 'Bring binoculars and a rain poncho', 'Hire a local guide for wildlife'],
    },
    img: img('cloud-forest', 800, 600),
  },
  {
    id: 'cascadas',
    cat: { es: 'Senderismo', en: 'Hiking' },
    name: { es: 'Las Tres Cascadas', en: 'The Lost Waterfalls' },
    short: {
      es: 'Una caminata corta por la selva hasta tres saltos de agua escondidos en la montaña.',
      en: 'A short jungle hike to three waterfalls hidden in the mountain.',
    },
    long: {
      es: 'En el corregimiento de Bajo Mono, un sendero de unas dos horas se interna en la selva húmeda hasta descubrir tres cascadas escalonadas. La última, de más de 60 metros, forma una poza donde es posible darse un baño frío y revitalizante rodeado de naturaleza.',
      en: 'In Bajo Mono, a two-hour trail winds into the rainforest to reveal three stepped waterfalls. The last, over 60 metres tall, forms a pool where you can take a cold, refreshing dip surrounded by nature.',
    },
    hours: { es: '8:00 – 16:00 (último ingreso 14:00)', en: '8:00 – 16:00 (last entry 14:00)' },
    cost: { es: 'Entrada $10 por persona', en: 'Entry $10 per person' },
    tips: {
      es: ['Usa calzado con buen agarre, el terreno es resbaladizo', 'Lleva traje de baño', 'Evita los días de lluvia intensa'],
      en: ['Wear shoes with good grip, the ground is slippery', 'Bring a swimsuit', 'Avoid days of heavy rain'],
    },
    img: img('waterfalls-jungle', 800, 600),
  },
  {
    id: 'termales',
    cat: { es: 'Bienestar', en: 'Wellness' },
    name: { es: 'Aguas Termales de Caldera', en: 'Caldera Hot Springs' },
    short: {
      es: 'Pozas naturales de agua mineral caliente a la orilla del río, ideales tras un día de montaña.',
      en: 'Natural hot mineral pools by the river, perfect after a day in the mountains.',
    },
    long: {
      es: 'A orillas del río Caldera brotan pozas de agua termal rica en minerales, conocidas por sus propiedades relajantes. Tras una breve caminata desde el pueblo de Caldera, podrás alternar el calor de las pozas con el frescor del río en un entorno completamente natural.',
      en: 'Along the Caldera river, mineral-rich thermal pools bubble up, known for their relaxing properties. After a short walk from Caldera village, you can alternate the warmth of the pools with the cool river in a fully natural setting.',
    },
    hours: { es: '7:00 – 18:00', en: '7:00 – 18:00' },
    cost: { es: 'Entrada $3 · parqueo $2', en: 'Entry $3 · parking $2' },
    tips: {
      es: ['Lleva agua y protector solar', 'Combínalo con una visita a los petroglifos cercanos', 'Mejor temprano para evitar grupos'],
      en: ['Bring water and sunscreen', 'Combine it with the nearby petroglyphs', 'Go early to avoid crowds'],
    },
    img: img('hot-springs-river', 800, 600),
  },
  {
    id: 'cafe',
    cat: { es: 'Cultura', en: 'Culture' },
    name: { es: 'Ruta del café de altura', en: 'Highland Coffee Route' },
    short: {
      es: 'Recorre las fincas que producen el legendario café Geisha, uno de los más cotizados del mundo.',
      en: 'Tour the farms behind the legendary Geisha coffee, one of the most prized in the world.',
    },
    long: {
      es: 'El microclima de Boquete dio origen al café Geisha, que rompe récords de precio en subastas internacionales. Las fincas familiares abren sus puertas para mostrar el viaje del grano: de la semilla a la taza, pasando por la recolección a mano, el secado al sol y una cata guiada por baristas locales.',
      en: 'Boquete\'s microclimate gave rise to Geisha coffee, which breaks price records at international auctions. Family farms open their doors to show the journey of the bean: from seed to cup, through hand-picking, sun drying and a tasting led by local baristas.',
    },
    hours: { es: 'Tours 8:00 y 14:00 · 2–3 horas', en: 'Tours at 8:00 and 14:00 · 2–3 hours' },
    cost: { es: 'Desde $30 por persona', en: 'From $30 per person' },
    tips: {
      es: ['Reserva con un día de antelación', 'La cosecha va de noviembre a marzo', 'Pregunta por los lotes de Geisha natural'],
      en: ['Book a day in advance', 'Harvest runs November to March', 'Ask for the natural Geisha lots'],
    },
    img: img('coffee-farm', 800, 600),
  },
  {
    id: 'canopy',
    cat: { es: 'Aventura', en: 'Adventure' },
    name: { es: 'Canopy & Tree Trek', en: 'Canopy & Tree Trek' },
    short: {
      es: 'Vuela sobre el bosque nuboso por una red de tirolesas y puentes colgantes.',
      en: 'Fly over the cloud forest on a network of zip-lines and hanging bridges.',
    },
    long: {
      es: 'Una serie de tirolesas conecta plataformas suspendidas entre los árboles de la reserva, permitiéndote planear sobre cañones, ríos y la copa del bosque nuboso. La experiencia incluye puentes colgantes y miradores, una forma adrenalínica de entender la magnitud de la selva de altura.',
      en: 'A series of zip-lines connects platforms suspended among the trees of the reserve, letting you glide over canyons, rivers and the cloud-forest canopy. The experience includes hanging bridges and lookouts — an adrenaline-filled way to grasp the scale of the highland jungle.',
    },
    hours: { es: 'Salidas 8:00, 11:00 y 14:00', en: 'Departures 8:00, 11:00 and 14:00' },
    cost: { es: 'Desde $65 por persona', en: 'From $65 per person' },
    tips: {
      es: ['Ropa cómoda y zapatos cerrados', 'No apto para menores de 5 años', 'Peso máximo 120 kg'],
      en: ['Comfortable clothes and closed shoes', 'Not suitable for under 5s', 'Maximum weight 120 kg'],
    },
    img: img('zipline-forest', 800, 600),
  },
];

// --- EVENTS ---
export const EVENTS: Event[] = [
  {
    id: 'feria-flores',
    d: '10', m: { es: 'ENE', en: 'JAN' },
    range: { es: '10 – 21 Enero 2027', en: 'Jan 10 – 21, 2027' },
    name: { es: 'Feria de las Flores y del Café', en: 'Flower & Coffee Festival' },
    cat: { es: 'Festival', en: 'Festival' },
    time: { es: '9:00 – 22:00', en: '9:00 – 22:00' },
    place: { es: 'Recinto Ferial, Boquete', en: 'Fairgrounds, Boquete' },
    desc: {
      es: 'El evento insignia de Boquete: jardines monumentales, catas de café, artesanías y música en vivo durante doce días.',
      en: 'Boquete\'s flagship event: monumental gardens, coffee tastings, crafts and live music across twelve days.',
    },
    img: img('flower-festival', 800, 600),
  },
  {
    id: 'jazz-blues',
    d: '27', m: { es: 'FEB', en: 'FEB' },
    range: { es: '27 Feb – 1 Mar 2027', en: 'Feb 27 – Mar 1, 2027' },
    name: { es: 'Boquete Jazz & Blues Festival', en: 'Boquete Jazz & Blues Festival' },
    cat: { es: 'Música', en: 'Music' },
    time: { es: '16:00 – 23:00', en: '16:00 – 23:00' },
    place: { es: 'Parque Central', en: 'Central Park' },
    desc: {
      es: 'Tres días de jazz y blues con artistas internacionales al aire libre, entre montañas y café de altura.',
      en: 'Three open-air days of jazz and blues with international artists, among mountains and highland coffee.',
    },
    img: img('jazz-concert', 800, 600),
  },
  {
    id: 'orquideas',
    d: '18', m: { es: 'ABR', en: 'APR' },
    range: { es: '18 – 20 Abril 2027', en: 'Apr 18 – 20, 2027' },
    name: { es: 'Expo Orquídeas de Chiriquí', en: 'Chiriquí Orchid Expo' },
    cat: { es: 'Naturaleza', en: 'Nature' },
    time: { es: '10:00 – 18:00', en: '10:00 – 18:00' },
    place: { es: 'Casa de la Cultura', en: 'Culture House' },
    desc: {
      es: 'Cientos de especies de orquídeas de las tierras altas, exhibiciones de cultivadores y talleres de jardinería.',
      en: 'Hundreds of highland orchid species, grower exhibitions and gardening workshops.',
    },
    img: img('orchid-expo', 800, 600),
  },
  {
    id: 'carrera-baru',
    d: '08', m: { es: 'NOV', en: 'NOV' },
    range: { es: '8 Noviembre 2026', en: 'Nov 8, 2026' },
    name: { es: 'Carrera al Volcán Barú', en: 'Barú Volcano Race' },
    cat: { es: 'Deporte', en: 'Sport' },
    time: { es: '4:00 – 12:00', en: '4:00 – 12:00' },
    place: { es: 'Salida: Parque Central', en: 'Start: Central Park' },
    desc: {
      es: 'Una de las carreras de montaña más duras del continente: ascenso y descenso al techo de Panamá.',
      en: 'One of the continent\'s toughest mountain races: up and down the roof of Panama.',
    },
    img: img('mountain-race', 800, 600),
  },
];

// --- POSTS ---
export const POSTS: Post[] = [
  {
    id: 'senderos',
    author: 'Marta Quirós',
    date: { es: '12 Jun 2026', en: 'Jun 12, 2026' },
    cat: { es: 'Recomendaciones', en: 'Tips' },
    title: { es: 'Cinco senderos imperdibles en Boquete', en: 'Five must-do trails in Boquete' },
    excerpt: {
      es: 'De caminatas suaves entre cafetales a la exigente cumbre del Barú, esta es nuestra guía para elegir tu próxima aventura.',
      en: 'From gentle walks through coffee farms to the demanding Barú summit, here is our guide to choosing your next adventure.',
    },
    body: {
      es: [
        'Boquete es, ante todo, un pueblo para caminar. Su geografía de cañones, ríos y bosque nuboso ofrece senderos para todos los niveles, casi siempre con la montaña como telón de fondo.',
        'El Sendero Los Quetzales es el más célebre: un cruce por el bosque nuboso donde, con suerte y paciencia, aparece el quetzal resplandeciente. Para algo más corto, Las Tres Cascadas premia con pozas de agua fría tras dos horas de selva.',
        'Quien busque exigencia encontrará en el Volcán Barú el reto definitivo. Y si prefieres la calma, el sendero de Bajo Mono entre fincas de café es perfecto para el atardecer.',
      ],
      en: [
        'Boquete is, above all, a town for walking. Its geography of canyons, rivers and cloud forest offers trails for every level, almost always with the mountains as a backdrop.',
        'The Los Quetzales Trail is the most famous: a crossing through the cloud forest where, with luck and patience, the resplendent quetzal appears. For something shorter, the Lost Waterfalls rewards you with cold pools after two hours of jungle.',
        'Those seeking a challenge will find the ultimate test on Barú Volcano. And if you prefer calm, the Bajo Mono trail among coffee farms is perfect at sunset.',
      ],
    },
    img: img('hiking-trail-boquete', 800, 500),
  },
  {
    id: 'cafe-altura',
    author: 'Diego Pittí',
    date: { es: '3 Jun 2026', en: 'Jun 3, 2026' },
    cat: { es: 'Cultura', en: 'Culture' },
    title: { es: 'El viaje del grano: café de altura', en: 'The journey of the bean: highland coffee' },
    excerpt: {
      es: 'Cómo el microclima de Boquete convirtió a un pueblo de montaña en la cuna del café más caro del mundo.',
      en: 'How Boquete\'s microclimate turned a mountain town into the home of the world\'s most expensive coffee.',
    },
    body: {
      es: [
        'La niebla constante, la altitud y los suelos volcánicos crean en Boquete un microclima irrepetible. Aquí maduró la variedad Geisha, que en subastas internacionales ha superado los mil dólares por libra.',
        'Visitar una finca es entender ese viaje: la recolección manual cereza a cereza, el secado lento al sol y el tueste cuidadoso. Cada taza cuenta la historia de varias generaciones de familias caficultoras.',
        'La cosecha, de noviembre a marzo, es la mejor época para vivir el proceso completo y participar en una cata guiada.',
      ],
      en: [
        'Constant mist, altitude and volcanic soils create a one-of-a-kind microclimate in Boquete. Here the Geisha variety ripened, fetching over a thousand dollars per pound at international auctions.',
        'Visiting a farm means understanding that journey: hand-picking cherry by cherry, slow sun drying and careful roasting. Every cup tells the story of several generations of coffee-growing families.',
        'The harvest, from November to March, is the best time to experience the full process and join a guided tasting.',
      ],
    },
    img: img('coffee-highland', 800, 500),
  },
  {
    id: 'quetzal',
    author: 'Lucía Samudio',
    date: { es: '24 May 2026', en: 'May 24, 2026' },
    cat: { es: 'Naturaleza', en: 'Nature' },
    title: { es: 'Avistar el quetzal: temporada y consejos', en: 'Spotting the quetzal: season and tips' },
    excerpt: {
      es: 'El ave más buscada de las tierras altas tiene sus reglas. Te contamos cuándo, dónde y cómo verla.',
      en: 'The most sought-after bird of the highlands has its rules. Here is when, where and how to see it.',
    },
    body: {
      es: [
        'El quetzal resplandeciente anida en el bosque nuboso entre marzo y junio, cuando los machos lucen sus largas plumas verdes. Es la mejor ventana para verlo.',
        'El Sendero Los Quetzales y las fincas cercanas a Bajo Mono son los puntos clásicos. Conviene salir al amanecer, moverse en silencio y llevar binoculares.',
        'Un guía local marca la diferencia: conocen los árboles de aguacatillo donde el ave se alimenta y saben interpretar su canto.',
      ],
      en: [
        'The resplendent quetzal nests in the cloud forest between March and June, when males display their long green plumes. It is the best window to see it.',
        'The Los Quetzales Trail and the farms near Bajo Mono are the classic spots. It pays to set out at dawn, move quietly and carry binoculars.',
        'A local guide makes the difference: they know the wild avocado trees where the bird feeds and can read its call.',
      ],
    },
    img: img('quetzal-bird', 800, 500),
  },
  {
    id: 'empacar',
    author: 'Equipo Boquete',
    date: { es: '15 May 2026', en: 'May 15, 2026' },
    cat: { es: 'Recomendaciones', en: 'Tips' },
    title: { es: '¿Qué llevar a Boquete? La lista definitiva', en: 'What to pack for Boquete? The definitive list' },
    excerpt: {
      es: 'Desde capas térmicas hasta poncho impermeable: todo lo que necesitas para aprovechar al máximo las tierras altas.',
      en: 'From thermal layers to a rain poncho: everything you need to make the most of the highlands.',
    },
    body: {
      es: [
        'El clima de Boquete sorprende: días cálidos de 22 °C y noches frescas que bajan de 14 °C. La ropa por capas es esencial.',
        'Para los senderos, calzado de trekking con buen agarre y un poncho impermeable son imprescindibles. En el bosque nuboso, la lluvia aparece sin previo aviso.',
        'No olvides protector solar (la altitud intensifica la radiación), binoculares para los quetzales y una buena botella de agua reutilizable.',
      ],
      en: [
        'Boquete\'s weather surprises: warm days of 22 °C and cool nights dropping below 14 °C. Layered clothing is essential.',
        'For trails, trekking shoes with good grip and a waterproof poncho are a must. In the cloud forest, rain arrives without warning.',
        'Don\'t forget sunscreen (altitude intensifies radiation), binoculars for quetzals and a good reusable water bottle.',
      ],
    },
    img: img('packing-travel', 800, 500),
  },
];

// --- RENTALS ---
export const RENTALS: Rental[] = [
  {
    id: 'cafetal',
    type: 'casa',
    price: 120, guests: 6, beds: 3, baths: 2, rating: 4.9, reviews: 128,
    name: { es: 'Cabaña El Cafetal', en: 'El Cafetal Cabin' },
    loc: { es: 'Bajo Mono, Boquete', en: 'Bajo Mono, Boquete' },
    short: { es: 'Cabaña de madera rodeada de cafetales, con chimenea y vistas al bosque nuboso.', en: 'Wooden cabin surrounded by coffee farms, with a fireplace and cloud-forest views.' },
    desc: {
      es: 'A diez minutos del pueblo, esta cabaña de madera se levanta en medio de una finca de café en producción. Las mañanas empiezan con niebla entre los cafetos y el canto de los pájaros; las noches, frente a la chimenea. Cuenta con cocina completa, tres habitaciones y una terraza amplia para contemplar el bosque nuboso.',
      en: 'Ten minutes from town, this wooden cabin sits in the middle of a working coffee farm. Mornings begin with mist among the coffee plants and birdsong; evenings, by the fireplace. It has a full kitchen, three bedrooms and a wide deck to take in the cloud forest.',
    },
    host: { name: 'Roberto Achú', line: { es: 'Caficultor y anfitrión desde 2018', en: 'Coffee grower and host since 2018' } },
    amen: ['wifi', 'kitchen', 'view', 'parking', 'fireplace'],
    reviewsList: [
      { name: 'James Carter', rating: 5, date: { es: 'Junio 2026', en: 'June 2026' }, text: { es: 'Despertar entre cafetales no tiene precio. Roberto nos preparó un café de su propia cosecha.', en: 'Waking up among coffee plants is priceless. Roberto made us coffee from his own harvest.' } },
      { name: 'Sophie Müller', rating: 5, date: { es: 'Mayo 2026', en: 'May 2026' }, text: { es: 'La cabaña es acogedora y la chimenea, perfecta para las noches frescas de montaña.', en: 'The cabin is cosy and the fireplace is perfect for cool mountain nights.' } },
    ],
    img: img('cabin-coffee-farm', 800, 560),
    lat: 8.7942, lng: -82.4467,
  },
  {
    id: 'niebla',
    type: 'bnb',
    price: 65, guests: 2, beds: 1, baths: 1, rating: 4.8, reviews: 94,
    name: { es: 'B&B Jardín de Niebla', en: 'Jardín de Niebla B&B' },
    loc: { es: 'Alto Boquete', en: 'Alto Boquete' },
    short: { es: 'Habitación privada con desayuno casero y un jardín de orquídeas con vista al valle.', en: 'Private room with homemade breakfast and an orchid garden overlooking the valley.' },
    desc: {
      es: 'Un bed & breakfast familiar en una casa rodeada de jardines de orquídeas. La habitación privada tiene baño propio y un balcón con vista al valle de Boquete. Cada mañana se sirve un desayuno casero con frutas de altura, hojaldres y café recién molido.',
      en: 'A family-run bed & breakfast in a house surrounded by orchid gardens. The private room has its own bathroom and a balcony overlooking the Boquete valley. Each morning a homemade breakfast is served with highland fruit, hojaldres and freshly ground coffee.',
    },
    host: { name: 'Elena Caballero', line: { es: 'Anfitriona y jardinera', en: 'Host and gardener' } },
    amen: ['wifi', 'breakfast', 'view', 'parking'],
    reviewsList: [
      { name: 'Ana Lucía Rivas', rating: 5, date: { es: 'Junio 2026', en: 'June 2026' }, text: { es: 'El desayuno es espectacular y Elena conoce todos los rincones de Boquete.', en: 'Breakfast is spectacular and Elena knows every corner of Boquete.' } },
      { name: 'Liam O\'Brien', rating: 4, date: { es: 'Abril 2026', en: 'April 2026' }, text: { es: 'Habitación impecable y un jardín de ensueño. Volvería sin dudarlo.', en: 'Spotless room and a dreamy garden. I would return without hesitation.' } },
    ],
    img: img('bnb-orchid-valley', 800, 560),
    lat: 8.7835, lng: -82.4389,
  },
  {
    id: 'caldera',
    type: 'apto',
    price: 90, guests: 4, beds: 2, baths: 1, rating: 4.7, reviews: 76,
    name: { es: 'Apartamento Río Caldera', en: 'Río Caldera Apartment' },
    loc: { es: 'Centro de Boquete', en: 'Downtown Boquete' },
    short: { es: 'Apartamento moderno junto al río, a pasos del parque y las cafeterías del pueblo.', en: 'Modern apartment by the river, steps from the park and the town cafés.' },
    desc: {
      es: 'Un apartamento luminoso y moderno a orillas del río Caldera, en pleno centro de Boquete. Tiene dos habitaciones, cocina equipada y acceso a una piscina compartida. Perfecto para quienes quieren explorar el pueblo a pie y volver a relajarse junto al agua.',
      en: 'A bright, modern apartment on the banks of the Caldera river, right in the centre of Boquete. It has two bedrooms, an equipped kitchen and access to a shared pool. Perfect for those who want to explore the town on foot and unwind by the water.',
    },
    host: { name: 'Lucía Samudio', line: { es: 'Anfitriona Superhost', en: 'Superhost' } },
    amen: ['wifi', 'kitchen', 'parking', 'pool'],
    reviewsList: [
      { name: 'Carlos Méndez', rating: 5, date: { es: 'Junio 2026', en: 'June 2026' }, text: { es: 'Ubicación inmejorable, caminamos a todas partes. El sonido del río de fondo es relajante.', en: 'Unbeatable location, we walked everywhere. The river in the background is so relaxing.' } },
      { name: 'Valentina Cruz', rating: 4, date: { es: 'Marzo 2026', en: 'March 2026' }, text: { es: 'Apartamento muy completo y limpio. La piscina fue un plus para los niños.', en: 'Very complete and clean apartment. The pool was a plus for the kids.' } },
    ],
    img: img('apartment-river', 800, 560),
    lat: 8.7761, lng: -82.4312,
  },
  {
    id: 'mirador',
    type: 'casa',
    price: 180, guests: 8, beds: 4, baths: 3, rating: 5.0, reviews: 61,
    name: { es: 'Casa Mirador del Barú', en: 'Mirador del Barú House' },
    loc: { es: 'Volcancito, Boquete', en: 'Volcancito, Boquete' },
    short: { es: 'Casa amplia con vista directa al Volcán Barú, piscina y terraza para grupos.', en: 'Spacious house with direct views of Barú Volcano, a pool and a terrace for groups.' },
    desc: {
      es: 'Una casa amplia diseñada para grupos y familias, con vista frontal al Volcán Barú. Cuatro habitaciones, piscina privada, chimenea y una gran terraza donde ver el atardecer sobre la montaña. La cocina equipada invita a cocinar en casa con productos del mercado local.',
      en: 'A spacious house designed for groups and families, with a front view of Barú Volcano. Four bedrooms, a private pool, a fireplace and a large terrace to watch the sunset over the mountain. The equipped kitchen invites you to cook at home with produce from the local market.',
    },
    host: { name: 'Diego Pittí', line: { es: 'Anfitrión local', en: 'Local host' } },
    amen: ['wifi', 'kitchen', 'view', 'parking', 'pool', 'fireplace'],
    reviewsList: [
      { name: 'Thomas Dubois', rating: 5, date: { es: 'Mayo 2026', en: 'May 2026' }, text: { es: 'La vista al volcán desde la terraza es de otro mundo. Casa enorme y bien equipada.', en: 'The volcano view from the terrace is out of this world. Huge, well-equipped house.' } },
      { name: 'Marta Quirós', rating: 5, date: { es: 'Abril 2026', en: 'April 2026' }, text: { es: 'Ideal para nuestro grupo de ocho. La piscina y la chimenea fueron lo mejor.', en: 'Ideal for our group of eight. The pool and fireplace were the best part.' } },
    ],
    img: img('volcano-view-house', 800, 560),
    lat: 8.8015, lng: -82.4521,
  },
];

// --- GALLERY ---
export const GALLERY: GalleryItem[] = [
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

// --- GALLERY CATEGORIES ---
export const GALLERY_CATS = [
  { id: 'all', label: { es: 'Todas', en: 'All' } },
  { id: 'naturaleza', label: { es: 'Naturaleza', en: 'Nature' } },
  { id: 'cafe', label: { es: 'Café', en: 'Coffee' } },
  { id: 'cultura', label: { es: 'Cultura', en: 'Culture' } },
  { id: 'aventura', label: { es: 'Aventura', en: 'Adventure' } },
];

// --- AMENITY LABELS ---
export const AMEN_LABELS: Record<string, { icon: string; es: string; en: string }> = {
  wifi:      { icon: '📶', es: 'WiFi', en: 'WiFi' },
  kitchen:   { icon: '🍳', es: 'Cocina equipada', en: 'Full kitchen' },
  view:      { icon: '🏔️', es: 'Vista panorámica', en: 'Panoramic view' },
  parking:   { icon: '🚗', es: 'Parqueo', en: 'Parking' },
  fireplace: { icon: '🔥', es: 'Chimenea', en: 'Fireplace' },
  breakfast: { icon: '☕', es: 'Desayuno incluido', en: 'Breakfast included' },
  pool:      { icon: '🏊', es: 'Piscina', en: 'Pool' },
  pets:      { icon: '🐾', es: 'Acepta mascotas', en: 'Pet friendly' },
};

// --- TYPE LABELS ---
export const TYPE_LABELS: Record<string, Bilingual> = {
  casa: { es: 'Casa', en: 'House' },
  bnb:  { es: 'B&B', en: 'B&B' },
  apto: { es: 'Apartamento', en: 'Apartment' },
};

// --- NAV ---
export const NAV = [
  { key: 'home',   href: '/',          label: { es: 'Inicio',   en: 'Home' } },
  { key: 'blog',   href: '/blog',      label: { es: 'Blog',     en: 'Blog' } },
  { key: 'stays',  href: '/alquiler',  label: { es: 'Alquiler', en: 'Stays' } },
];
