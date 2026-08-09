import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';

// Brand palette — mirrors src/styles/global.css (--color-forest / --color-sand / --color-ink)
// and the admin panel's gold accent (#C8964A), so the brochure reads as the same brand as the site.
const COLORS = {
  forest: '#2F5233',
  forestDark: '#223D26',
  gold: '#C8964A',
  clay: '#B95C36',
  sand: '#F5F0E8',
  ink: '#2B2B2B',
  inkSoft: '#5B5650',
  border: '#E5DFD2',
};

const TYPE_LABELS_ES: Record<string, string> = {
  casa: 'Casa',
  habitacion: 'Habitación',
  apto: 'Apartamento',
};

const AMEN_LABELS_ES: Record<string, string> = {
  wifi: 'WiFi',
  kitchen: 'Cocina equipada',
  view: 'Vista panorámica',
  parking: 'Parqueo',
  fireplace: 'Chimenea',
  pool: 'Piscina',
  pets: 'Acepta mascotas',
  furnished: 'Amueblado',
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10.5,
    color: COLORS.ink,
    paddingBottom: 56,
  },
  header: {
    backgroundColor: COLORS.forest,
    color: COLORS.sand,
    paddingHorizontal: 40,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: { fontFamily: 'Helvetica-Bold', fontSize: 15, letterSpacing: 0.5 },
  brandSub: { fontSize: 8.5, color: COLORS.sand, opacity: 0.8, marginTop: 2 },
  headerDate: { fontSize: 8.5, color: COLORS.sand, opacity: 0.85 },
  hero: { width: '100%', height: 240, objectFit: 'cover' },
  priceBadge: {
    position: 'absolute',
    right: 40,
    top: 200,
    backgroundColor: COLORS.gold,
    color: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  priceBadgeAmount: { fontFamily: 'Helvetica-Bold', fontSize: 15 },
  priceBadgeUnit: { fontSize: 8, marginTop: 1 },
  body: { paddingHorizontal: 40, paddingTop: 22 },
  title: { fontFamily: 'Helvetica-Bold', fontSize: 21, color: COLORS.ink },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
  location: { fontSize: 10.5, color: COLORS.inkSoft },
  ratingDot: { fontSize: 10.5, color: COLORS.inkSoft, marginHorizontal: 4 },
  rating: { fontSize: 10.5, color: COLORS.gold, fontFamily: 'Helvetica-Bold' },
  typeBadge: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.sand,
    color: COLORS.forestDark,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  factsGrid: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 14,
  },
  factItem: { width: '25%', marginBottom: 10 },
  factLabel: { fontSize: 7.5, color: COLORS.inkSoft, textTransform: 'uppercase', letterSpacing: 0.5 },
  factValue: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: COLORS.ink, marginTop: 2 },
  section: { marginTop: 20 },
  sectionTitle: { fontFamily: 'Helvetica-Bold', fontSize: 12.5, color: COLORS.forestDark, marginBottom: 8 },
  paragraph: { fontSize: 10, lineHeight: 1.6, color: COLORS.inkSoft },
  noteBox: {
    marginTop: 20,
    backgroundColor: COLORS.sand,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.gold,
    borderRadius: 6,
    padding: 14,
  },
  noteLabel: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: COLORS.forestDark, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  noteText: { fontSize: 10, lineHeight: 1.6, color: COLORS.ink },
  amenGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  amenItem: { width: '50%', flexDirection: 'row', alignItems: 'center', marginBottom: 7 },
  amenBullet: { color: COLORS.gold, fontSize: 10, marginRight: 6 },
  amenText: { fontSize: 10, color: COLORS.ink },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.ink,
    color: COLORS.sand,
    paddingHorizontal: 40,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerHost: { fontSize: 9.5, fontFamily: 'Helvetica-Bold' },
  footerContact: { fontSize: 8.5, color: COLORS.sand, opacity: 0.8, marginTop: 2 },
  footerSite: { fontSize: 8.5, color: COLORS.gold },
});

export interface BrochureRental {
  id: string;
  type: string;
  price: number;
  guests: number;
  beds: number;
  baths: number;
  parking: number;
  sqmBuilt: number;
  sqmLot: number;
  minMonths: number;
  rating: number;
  reviews: number;
  name: { es: string; en: string };
  loc: { es: string; en: string };
  desc: { es: string; en: string };
  amen: string[];
  host?: { name?: string; phone?: string; email?: string };
  img: string;
}

interface Props {
  rental: BrochureRental;
  leadName: string;
  note?: string;
}

export function PropertyBrochure({ rental, leadName, note }: Props) {
  const today = new Date().toLocaleDateString('es-PA', { day: 'numeric', month: 'long', year: 'numeric' });
  const host = rental.host || {};

  return (
    <Document title={`${rental.name.es} · MIKA Homes`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <View>
            <Text style={styles.brand}>MIKA HOMES</Text>
            <Text style={styles.brandSub}>Alquileres mensuales en Boquete, Panamá</Text>
          </View>
          <Text style={styles.headerDate}>Preparado para {leadName} · {today}</Text>
        </View>

        <Image src={rental.img} style={styles.hero} />
        <View style={styles.priceBadge}>
          <Text style={styles.priceBadgeAmount}>${rental.price}</Text>
          <Text style={styles.priceBadgeUnit}>por mes</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>{rental.name.es}</Text>
          <View style={styles.locationRow}>
            <Text style={styles.location}>{rental.loc.es}</Text>
            <Text style={styles.ratingDot}>·</Text>
            <Text style={styles.rating}>★ {rental.rating.toFixed(1)}</Text>
            <Text style={styles.location}>({rental.reviews} reseñas)</Text>
          </View>
          <Text style={styles.typeBadge}>{TYPE_LABELS_ES[rental.type] || rental.type}</Text>

          <View style={styles.factsGrid}>
            <View style={styles.factItem}>
              <Text style={styles.factLabel}>Huéspedes</Text>
              <Text style={styles.factValue}>{rental.guests}</Text>
            </View>
            <View style={styles.factItem}>
              <Text style={styles.factLabel}>Habitaciones</Text>
              <Text style={styles.factValue}>{rental.beds}</Text>
            </View>
            <View style={styles.factItem}>
              <Text style={styles.factLabel}>Baños</Text>
              <Text style={styles.factValue}>{rental.baths}</Text>
            </View>
            <View style={styles.factItem}>
              <Text style={styles.factLabel}>Parqueos</Text>
              <Text style={styles.factValue}>{rental.parking}</Text>
            </View>
            <View style={styles.factItem}>
              <Text style={styles.factLabel}>M² construidos</Text>
              <Text style={styles.factValue}>{rental.sqmBuilt || '--'}</Text>
            </View>
            <View style={styles.factItem}>
              <Text style={styles.factLabel}>M² de terreno</Text>
              <Text style={styles.factValue}>{rental.sqmLot || '--'}</Text>
            </View>
            <View style={styles.factItem}>
              <Text style={styles.factLabel}>Estadía mínima</Text>
              <Text style={styles.factValue}>{rental.minMonths} {rental.minMonths === 1 ? 'mes' : 'meses'}</Text>
            </View>
          </View>

          {note && (
            <View style={styles.noteBox}>
              <Text style={styles.noteLabel}>Nota de nuestro equipo</Text>
              <Text style={styles.noteText}>{note}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.paragraph}>{rental.desc.es}</Text>
          </View>

          {rental.amen?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amenidades</Text>
              <View style={styles.amenGrid}>
                {rental.amen.map((key) => (
                  <View key={key} style={styles.amenItem}>
                    <Text style={styles.amenBullet}>•</Text>
                    <Text style={styles.amenText}>{AMEN_LABELS_ES[key] || key}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={styles.footer} fixed>
          <View>
            <Text style={styles.footerHost}>{host.name || 'Equipo MIKA Homes'}</Text>
            <Text style={styles.footerContact}>
              {[host.phone, host.email].filter(Boolean).join('  ·  ')}
            </Text>
          </View>
          <Text style={styles.footerSite}>mikahomes.com</Text>
        </View>
      </Page>
    </Document>
  );
}
