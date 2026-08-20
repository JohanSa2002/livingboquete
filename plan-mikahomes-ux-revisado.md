# Plan de arreglos y mejoras — MIKA Homes (revisado)
**Enfoque:** UX/UI · **Alcance:** `mikahomes.com` (Home + `/alquiler`) · **Fecha:** agosto 2026
**Nota:** esta es una revisión del plan original (`planuxuimikahomes.md`), corregida contra el código real del repo `livingboquete` y una consulta en vivo a la base de datos. El plan original describía una auditoría técnica que no corresponde al estado actual del sitio — varias cosas que marcaba como "no existen" ya están construidas, y los ejemplos de código estaban en React + Tailwind, que este proyecto no usa. Ver sección 0.1 para el detalle de qué cambió.

---

## 0. Contexto técnico real

Auditoría directa del repo (no del DOM en producción):

| Aspecto | Estado real |
|---|---|
| Stack | **Astro 7, `output: 'server'` (SSR real)**, adapter Vercel en prod / Node en local y Docker. React solo para islas puntuales, GSAP para motion, Leaflet para mapas |
| Estilos | CSS propio con **sistema de tokens ya existente** (`src/styles/global.css`): colores, radios, sombras, fuentes y easings como custom properties. No hay Tailwind |
| Backend | Supabase Postgres, service role solo en servidor, RLS sin políticas públicas (`src/lib/supabase.ts`) |
| i18n | Por clases CSS: ambos idiomas viven en el DOM, `.lang-en` se oculta con `hidden` (confirmado — coincide con el plan original) |
| `/alquiler` | **Ya es un motor de búsqueda real**, no una landing estática: filtros de tipo/precio/huéspedes/3 amenidades funcionando en cliente, grid de resultados, sección de destacados, marquee de reseñas |
| `/alquiler/[id]` | **La ficha de propiedad (PDP) ya existe** y está bastante completa: galería con lightbox, video, mapa Leaflet, disponibilidad calculada, contacto directo por WhatsApp/tel/email, reseñas |
| Header | El problema de header transparente/ilegible **ya está resuelto**: capa `::before` con blur permanente + fix específico para el bug de iOS (sticky + backdrop-filter renderizando negro) |
| SEO técnico | Confirmado — **sí faltan** `og:*`, `canonical`, `hreflang` y JSON-LD. Solo hay `<title>` y `<meta name="description">` |
| A11y | Ya existe una regla global `:focus-visible` (usa `--shadow-focus`) más 9 reglas específicas repartidas en el código. El `input[type=range]` y el `select` de filtros **sí carecen de label accesible** |
| Catálogo | **`rentals` = 0 filas en Supabase (confirmado por consulta directa).** `places` = 9, `events` = 2, `posts` = 21 — el resto del contenido del sitio sí tiene datos reales, solo el catálogo de alquiler está vacío |

**Lectura corregida:** el riesgo de negocio del plan original (catálogo vacío) es real y está confirmado con datos, no es una suposición. Pero la solución no es "construir la interfaz de búsqueda y la ficha de propiedad desde cero" — **ya existen y están bien hechas**. El trabajo real es más angosto de lo que planteaba el documento original: llenar el catálogo, exponer como filtros datos que el modelo *ya tiene* (zona aproximada, `minMonths`, `availableFrom`, `beds`, `baths`), cerrar SEO/i18n, y diseñar los estados vacíos que hoy no existen.

### 0.1 Qué decía el plan original que no corresponde al código actual

| Claim del plan original | Realidad verificada |
|---|---|
| "SPA client-side, sin Astro" | Es Astro con SSR (`output: 'server'`) |
| P3-2: "Ficha de propiedad — no existe hoy" | Existe en `src/pages/alquiler/[id].astro`, con galería, video, mapa, host, reseñas y contacto |
| P0-5: "Header transparente se solapa con contenido" | Ya resuelto — capa de blur permanente + fix de iOS ya implementado |
| P5-2: "Solo 2 reglas `:focus-visible`" | Hay una regla global más 9 usos específicos en el código |
| P1-1: "Centralizar colores en tokens" (implica que no existen) | El sistema de tokens ya existe en `global.css` |
| Snippets de código (React + `useSearchParams`, JSX, clases Tailwind) | El proyecto no usa React Router ni Tailwind — nada de eso compila tal cual |

Estos puntos se retiran o se reformulan abajo. El resto del documento mantiene la estructura del plan original pero con contenido corregido.

---

## 1. Priorización (impacto × esfuerzo) — corregida

| ID | Item | Impacto | Esfuerzo | Fase | Estado |
|---|---|:---:|:---:|:---:|---|
| P0-1 | Catálogo vacío + métricas contradictorias | 🔴 Crítico | M | 0 | ✅ **Implementado** |
| P0-2 | Empty state del catálogo (0 resultados totales) | 🔴 Crítico | S | 0 | ✅ **Implementado** |
| P0-3 | Lifestyle cards con 0 opciones, clickeables sin aviso | 🟠 Alto | XS | 0 | ✅ **Implementado** |
| P0-4 | Scroll-reveal agresivo | 🟡 Medio | S | 0 | No reverificado — confirmar en navegador antes de tratarlo como bloqueante |
| ~~P0-5~~ | ~~Header transparente~~ | — | — | — | **Ya resuelto, retirado** |
| P1-1 | Auditoría de contraste sobre tokens existentes | 🟠 Alto | S | 1 | Reformulado (los tokens ya existen) |
| P1-2 | Emoji vs. iconos de trazo en amenidades | 🟡 Medio | S | 1 | ✅ **Implementado** — la sección "Lo que incluye" de la PDP ahora usa `Icon.astro`, igual que el resto del sitio |
| P2-1 | Filtros con estado en la URL | 🟠 Alto | M | 2 | ✅ **Implementado** — SSR-nativo (`Astro.url.searchParams`), no React Router |
| P2-2 | Filtros faltantes: fecha, duración, habitaciones/baños | 🔴 Crítico | S–M | 2 | ✅ **Implementado** (duración, habitaciones, baños, fecha de mudanza). Zona e "incluye servicios" siguen pendientes — requieren normalizar/agregar campos al esquema, ver nota abajo |
| P2-3 | Chips de filtros activos + limpiar | 🟠 Alto | S | 2 | ✅ **Implementado** |
| P2-4 | Orden + skeletons | 🟡 Medio | S | 2 | Orden ✅ **implementado** (relevancia/precio/recientes/rating). Skeletons **descartados por ahora** — la página es SSR completa, no hay carga asíncrona que un skeleton tenga que cubrir hoy |
| P2-5 | Mobile: convertir el drawer actual en bottom sheet con conteo en vivo | 🟠 Alto | S | 2 | ✅ **Implementado** — se mantuvo el drawer lateral existente (no se cambió a bottom sheet, cambio de layout no justificado) y se agregó el botón sticky "Ver N resultados" con conteo en vivo |
| P2-6 | Mapa de resultados | 🟠 Alto | M | 2 | **Diferido** — implica reestructurar el layout de 2 columnas de `/alquiler`; se deja como su propio sprint en vez de apurarlo junto con el resto |
| P3-1 | Anatomía de card | 🟡 Medio | S | 3 | ✅ **Implementado** — `aria-label` descriptivo en el `<a>` y `fetchpriority="high"` en las primeras 4 imágenes del grid |
| ~~P3-2~~ | ~~Ficha de propiedad (PDP)~~ | — | — | — | **Ya existe, retirado.** Ver P3-2b abajo por mejoras puntuales |
| P3-2b | Mejoras puntuales a la PDP existente | 🟡 Medio | S | 3 | ✅ **Implementado**: desglose de costos (depósito/servicios, campos nuevos y opcionales en el admin), reglas de la casa, propiedades similares. Distribución de reseñas por criterio queda pendiente — requiere ampliar el esquema de reseñas, no solo la UI |
| P3-3 | Formulario de solicitud estructurado (hoy solo hay WhatsApp/tel/email) | 🟠 Alto | M | 3 | ✅ **Implementado** — modal de 3 pasos en la PDP, integrado con `/admin/leads` (migración nueva). No probado en navegador real |
| P4-1 | Señales de confianza: tooltip de verificación, página "Cómo funciona" | 🟠 Alto | S | 4 | ✅ **Implementado** |
| P4-2 | Transparencia de costos en la PDP | 🟠 Alto | S | 4 | Confirmado real |
| P4-3 | Formulario de lead — revisar cuál | 🟡 Medio | XS | 4 | El de "publicar propiedad" ya es corto (6 campos); si el problema es otro formulario (guía de retiro en home), verificar por separado |
| P5-1 | i18n por ruta + hreflang | 🟠 Alto | L | 5 | ✅ **Implementado** — el cambio de mayor riesgo de todo el plan, ejecutado tras confirmar el alcance con el usuario |
| P5-2 | A11y: labels en range/select de filtros, targets táctiles | 🟡 Medio | XS | 5 | Pendiente — no se tocó en esta sesión |
| P5-3 | SEO: OG, canonical, JSON-LD | 🟠 Alto | S | 5 | ✅ **Implementado** (adelantado al sprint 1, `hreflang` sumado en sprint 5) |
| P5-4 | Performance (LCP, imágenes) | 🟢 Bajo-Medio | S | 5 | Parcialmente ya resuelto — el hero usa `astro:assets` con `widths`/`sizes`/`fetchpriority="high"`, `inlineStylesheets: 'always'` ya configurado. Revisar solo lo que falte |

Esfuerzo: XS ≤2h · S ≤1d · M 2–4d · L 1–2sem

---

## FASE 0 — Bloqueantes reales (Sprint 1)

### P0-1 · Coherencia entre promesa y realidad — **confirmado**

`src/pages/index.astro` tiene hardcodeado:

```astro
<div class="hero-stat-num">120+</div>
<span class="lang-es">propiedades</span>

<div class="hero-stat-num">500+</div>
<span class="lang-es">residentes felices</span>
```

Y `rentals` tiene **0 filas** en Supabase ahora mismo. Esto no es una hipótesis — se verificó con una consulta directa a la base. Cualquier visitante que llegue del hero a `/alquiler` encuentra el catálogo vacío quince segundos después de leer "120+ propiedades".

**Solución**, adaptada a que la página ya es SSR (no hace falta un hook de cliente, se resuelve en el frontmatter):

```astro
---
// src/pages/index.astro
const { count: rentalCount } = await getSupabase()
  .from('rentals')
  .select('*', { count: 'exact', head: true });
---

{rentalCount && rentalCount > 0 ? (
  <>
    <div class="hero-stat-num">{rentalCount}+</div>
    <span class="lang-es">propiedades</span><span class="lang-en" hidden>properties</span>
  </>
) : (
  <>
    <div class="hero-stat-num">Boquete</div>
    <span class="lang-es">nuestra única zona, de verdad</span>
    <span class="lang-en" hidden>our one and only zone, for real</span>
  </>
)}
```

Mismo tratamiento para "4.9 ★" y "500+ residentes felices" — derivarlos de `AVG(rating)` y de reseñas reales cuando existan, o retirarlos del hero mientras el catálogo esté en cero.

**Criterio de aceptación:** ninguna cifra de la home puede diferir del conteo real. Como es SSR, esto se verifica trivialmente comparando el HTML servido contra `SELECT count(*) FROM rentals`.

---

### P0-2 · Empty state del catálogo — **confirmado, no existe**

Se revisó el flujo completo: si `RENTALS.length === 0` al cargar `/alquiler`, la sección de destacados se oculta correctamente (`{spotlightItems.length > 0 && ...}`), pero la grilla de resultados **no**. Queda el texto `0 alquileres disponibles` seguido de un `<div id="rentals-grid">` vacío. El `<div id="no-results">` que sí existe en el HTML solo se activa desde el script de filtrado client-side (`applyFilters()`), que nunca corre en la carga inicial — así que ni siquiera se ve ese mensaje. Es, literalmente, un vacío sin texto.

**Solución** — resolver en el frontmatter, no en JS de cliente, porque ya se sabe en el servidor si hay 0 propiedades en total:

```astro
---
const hasAnyRentals = RENTALS.length > 0;
---

{hasAnyRentals ? (
  <div id="rentals-grid" class="cols-2">
    {/* ...cards existentes... */}
  </div>
) : (
  <div class="empty-state" role="status" aria-live="polite">
    <Icon name="search" size={32} />
    <h3><span class="lang-es">Estamos incorporando las primeras propiedades de Boquete.</span>
        <span class="lang-en" hidden>We're adding the first Boquete listings.</span></h3>
    <p><span class="lang-es">Déjanos tu correo y te avisamos apenas publiquemos la primera.</span>
       <span class="lang-en" hidden>Leave your email and we'll notify you as soon as the first one is live.</span></p>
    <div class="empty-state-ctas">
      <a href="/#contacto" class="btn btn-primary">
        <span class="lang-es">Avísame cuando haya</span><span class="lang-en" hidden>Notify me</span>
      </a>
      <a href="/publicar-propiedad" class="btn btn-ghost">
        <span class="lang-es">Publica tu propiedad</span><span class="lang-en" hidden>List your property</span>
      </a>
    </div>
  </div>
)}
```

El caso de "filtros sin resultados" (`#no-results`) ya existe y no necesita este trabajo — solo el caso "catálogo totalmente vacío" falta.

**Criterio de aceptación:** con `rentals` en 0 filas, `/alquiler` nunca muestra un contenedor vacío sin mensaje.

---

### P0-3 · Lifestyle cards con 0 opciones — **confirmado**

En `src/pages/index.astro` / `alquiler/index.astro`, `lifestyleData` ya calcula `count` por tarjeta (`RENTALS.filter(...)`), pero el markup no usa ese número para deshabilitar nada — el botón sigue siendo clickeable y visualmente idéntico con 0 o con 5 opciones.

```astro
{lifestyleData.map((ls, i) => (
  <button
    class="stays-life-card rv"
    data-shortcut={ls.key}
    data-shortcut-kind={ls.kind}
    aria-disabled={ls.count === 0}
    disabled={ls.count === 0}
    style={`animation-delay:${i * 0.06}s`}
  >
    {/* ... */}
    {ls.count === 0 ? (
      <div class="stays-life-count">
        <span class="lang-es">Próximamente</span><span class="lang-en" hidden>Coming soon</span>
      </div>
    ) : (
      <div class="stays-life-count">{ls.count} ...</div>
    )}
  </button>
))}
```

```css
.stays-life-card[disabled] {
  cursor: not-allowed;
  opacity: .55;
  filter: saturate(.5);
  pointer-events: none;
}
```

---

### P0-4 · Scroll-reveal — sin reverificar

El plan original describe secciones que quedan en blanco durante el scroll. No se confirmó esto contra el código de esta sesión (el sistema de `[data-reveal]`/`rv`/`rv-once` existe y usa IntersectionObserver + `prefers-reduced-motion`, visible en varios componentes). **Antes de tratar esto como bloqueante**, hacer el mismo scroll continuo descrito en el plan original y confirmar si el problema persiste con la implementación actual.

---

## FASE 1 — Sistema de diseño (Sprint 1–2)

### P1-1 · Los tokens ya existen — auditar, no crear

`src/styles/global.css` ya define:

```css
--color-forest: #2F5233;   --color-forest-dark: #223D26;
--color-leaf: #5D8A5A;     --color-sand: #F5F0E8;
--color-sand-deep: #EDE5D4; --color-coffee: #8B5E3C;
--color-wood: #915F3B;     --color-ink: #2B2B2B;
--color-ink-soft: #5B5650; --color-ink-faint: #6C6659;
--font-display: 'Manrope'; --font-body: 'Inter'; --font-accent: 'Spectral';
--radius-sm/md/lg/pill; --shadow-sm/md/lg/focus; --ease-out; --ease-drawer;
```

El trabajo real de P1-1 no es "centralizar" (ya está centralizado) sino **auditar contraste** de las combinaciones que efectivamente se usan — en particular:
- `--color-ink-faint` (`#6C6659`) sobre `--color-sand-deep` (`#EDE5D4`): calcular ratio real, es el par más sospechoso.
- Texto blanco sobre imagen en los `stays-hero-veil` / `stays-life-veil`: ya usan overlay con gradiente, pero verificar el punto más claro de cada foto de fondo, no asumir.

### P1-2 · Emoji vs. iconos de trazo — confirmado

`AMEN_LABELS` en `src/data/data.ts` mezcla emoji (`📶 🍳 🏔️ 🚗 🔥 🏊 🐾 🛋️`) que se usan en la ficha de propiedad, mientras que el resto del sitio (`Icon.astro`) usa un set de trazo consistente (`sliders`, `chevron-right`, `check`, etc.) que **ya se usa para las mismas amenidades en la card de listado** (`AMEN_ICON` en `alquiler/index.astro` mapea `wifi`→`wifi`, `pool`→`waves`, etc. usando `Icon.astro`). El emoji solo aparece en la sección "Lo que incluye" de la PDP. Es una inconsistencia real pero acotada a un solo bloque — reemplazar esos 8 emoji por `<Icon name={AMEN_ICON[key]} />` reutilizando el mapeo que ya existe.

---

## FASE 2 — Motor de búsqueda (Sprint 2–3)

El motor ya existe; esta fase es sobre **exponer datos que ya están en el modelo** y **cerrar el estado en la URL**, no construir desde cero.

### P2-1 · Filtros con estado en la URL — enfoque SSR, no React

El plan original proponía `useSearchParams` de React Router — no aplica aquí. Pero justo porque `/alquiler` **ya es SSR** (`output: 'server'`), el estado en la URL es más simple de lo que el plan original asumía: se lee `Astro.url.searchParams` en el frontmatter, se filtra `RENTALS` en el servidor para el render inicial, y el script de cliente existente (`applyFilters()`) solo necesita sincronizar `history.replaceState` cuando el usuario cambia un filtro — sin librería nueva.

```astro
---
// src/pages/alquiler/index.astro
const params = Astro.url.searchParams;
const initialType = params.get('tipo') ?? 'all';
const initialMaxPrice = Number(params.get('precio_max') ?? 1500);
const initialGuests = Number(params.get('personas') ?? 1);
const initialAmenities = params.get('amenidades')?.split(',').filter(Boolean) ?? [];
---
```

Pasar esos valores iniciales como `data-*` a los controles (chip activo, valor del range, opción seleccionada del select) y, en el script existente, reemplazar las variables locales (`activeType`, `maxPrice`, etc.) por lectura de esos `data-*` al iniciar. Al cambiar un filtro:

```js
function syncUrl() {
  const url = new URL(location.href);
  activeType === 'all' ? url.searchParams.delete('tipo') : url.searchParams.set('tipo', activeType);
  maxPrice === 1500 ? url.searchParams.delete('precio_max') : url.searchParams.set('precio_max', String(maxPrice));
  history.replaceState(null, '', url);
}
```

Esto habilita rutas como `/alquiler?tipo=casa&precio_max=800` compartibles, con botón atrás funcional, **y** rastreables por buscadores porque el HTML inicial ya viene filtrado del servidor — mejor que el enfoque 100% client-side del plan original.

### P2-2 · Filtros faltantes — más barato de lo que parecía

El modelo `Rental` (`src/data/data.ts`) **ya tiene** varios de los campos que el plan original pedía "agregar":

| Filtro pedido | Campo ya existente | Falta |
|---|---|---|
| Duración | `minMonths: number` | Solo exponerlo como chip (1-3 / 3-6 / 6-12 / 12+) |
| Fecha de mudanza | `availableFrom: string` (ya se usa en la PDP para calcular "Disponible en X días") | Solo exponerlo como filtro |
| Habitaciones / baños | `beds`, `baths` | Solo exponerlos como stepper |
| Zona | `loc: Bilingual` (texto libre, ej. "Alto Boquete", "Volcancito, Boquete") | **Sí falta de verdad**: no es un enum, es texto libre — no filtra de forma confiable. Normalizar a una zona fija (`'bajo-boquete' \| 'alto-boquete' \| 'jaramillo' \| 'volcancito' \| 'palmira' \| 'los-naranjos'`) antes de poder filtrar por ella |
| Incluye (agua, luz, internet) | No existe | Campo nuevo real, requiere migración |
| Precio como rango (no solo máximo) | Solo hay `price-range` de máximo | Cambiar a slider doble o dos inputs numéricos |

Priorizar en este orden: duración → habitaciones/baños → fecha (todo dato ya existente, solo UI) antes que zona/incluye (requieren tocar esquema/datos).

### P2-3, P2-4 · Chips activos, orden, skeletons

Sin cambios respecto al plan original — siguen sin existir y siguen siendo válidos tal cual estaban planteados, solo que el conteo (`results-count`) ya existe y puede reusarse.

### P2-5 · Mobile — ya hay un drawer, falta el patrón de conteo en vivo

Ya existe `#filters-sidebar` con `.is-open` deslizando desde la derecha, backdrop, botón de cierre — no es un bottom sheet pero cumple la función de "filtros fuera del flujo en mobile". Lo que falta es el patrón "Aplicar (N resultados)" fijo abajo, actualizándose en vivo — hoy los filtros aplican de inmediato sin ese botón de confirmación. Ajuste menor sobre lo existente, no una reconstrucción.

### P2-6 · Mapa de resultados — Leaflet ya es dependencia

El plan original lo marcaba como esfuerzo L asumiendo que había que integrar una librería de mapas nueva. `leaflet` ya está instalado y ya se usa en la PDP (`alquiler/[id].astro`) con carga diferida por `IntersectionObserver` — el patrón para el mapa de resultados es el mismo, solo con múltiples marcadores usando `lat`/`lng` que cada `Rental` ya tiene. Baja el esfuerzo real a M.

---

## FASE 3 — Card y ficha de propiedad (Sprint 3–4)

### P3-1 · Card — ya cumple la mayoría de la anatomía pedida

La card en `alquiler/index.astro` ya tiene: imagen con `aspect-ratio`, badges de tipo/verificado/rating, precio destacado (`$750 / mes`), specs (huéspedes/camas/baños/parqueo), chips de amenidades, `loading="lazy"` en el grid. Ajustes menores: confirmar `fetchpriority="high"` en las primeras 4 (hoy todas usan `loading="lazy"` sin excepción), y que el `<a>` envolvente tenga `aria-label` descriptivo (hoy no lo tiene explícito, se apoya en el texto interno).

### ~~P3-2~~ · PDP — ya existe

Retirado del plan. Lo que existe hoy en `alquiler/[id].astro`: galería con lightbox, video (`YouTubeFacade`), encabezado con rating/zona/badges, panel sticky de precio+disponibilidad+contacto, descripción, comodidades, mapa Leaflet, host, reseñas reales por propiedad.

### P3-2b · Mejoras puntuales sobre la PDP existente

Lo que sí falta de la lista original del plan:
- **Desglose de costos** (`<CostBreakdown>`, ver P4-2) — no existe, la PDP solo muestra el precio mensual.
- **Reglas de la casa** (mascotas, fumadores, duración mínima) — `minMonths` ya se muestra, pero no hay sección de reglas generales.
- **Propiedades similares** — no existe, se podría resolver con `RENTALS.filter(r => r.loc === stay.loc || overlap de amenidades).slice(0,4)`.
- **Distribución de reseñas por criterio** (limpieza, comunicación, etc.) — el modelo de reseña actual (`{ name, rating, date, text }`) no tiene sub-criterios; requiere ampliar el esquema si se quiere ese desglose.

### P3-3 · Flujo de solicitud estructurado — ✅ implementado

Antes: contacto directo únicamente (WhatsApp con mensaje prellenado, `tel:`, `mailto:`) — funcionaba, pero no quedaba nada capturado en `/admin/leads`. Se agregó un modal de 3 pasos en la PDP (`#request-open`) que no reemplaza el contacto directo, lo complementa como CTA primario:

1. **Tu mudanza** — fecha de entrada, duración (chips), personas, mascotas. Todo selectores, sin escritura.
2. **Sobre ti** — nombre, correo o WhatsApp (uno basta), mensaje opcional auto-compuesto a partir de las respuestas del paso 1. Validación en `blur`, errores específicos con `aria-describedby`/`aria-invalid`, foco salta al primer campo con error.
3. **Confirmación** — resumen + "responde en menos de 24h", botón con `aria-busy` mientras envía.

El envío pega a `/api/leads` con `type: 'alquiler'`, `rental_id` y `rental_name` — mismo pipeline de leads existente, no uno paralelo. Requirió una migración (`0003_rental_request_leads.sql`, aplicada vía MCP de Supabase): columnas nuevas (`rental_id`, `rental_name`, `move_in`, `duracion`, `personas`, `mascotas`) y `email` pasó a nullable para permitir "solo WhatsApp". `/admin/leads` se actualizó con un tercer tipo, tab, stat card, y el modal de "Enviar PDF" ahora precarga la propiedad consultada.

**Límite de esta verificación:** se confirmó que la página renderiza sin errores server-side (con una propiedad de prueba temporal) y que las variables se serializan bien. **No se probó la interacción real en navegador** (transición entre pasos, validación, envío) — no hay herramienta de automatización de navegador disponible en esta sesión. Recomiendo un click-through manual antes de darlo por cerrado del todo.

---

## FASE 4 — Confianza y conversión (Sprint 4)

### P4-1 · Señales de confianza — ✅ implementado (parcial, por diseño)

Se agregó un tooltip real (hover/focus, con `role="tooltip"`) al badge "Verificada" de la PDP explicando qué significa, más un campo opcional `verifiedDate` — si está cargado, el tooltip muestra la fecha real de la visita; si no, muestra el mensaje genérico sin inventar una fecha. Se creó `/como-funciona.astro` respondiendo honestamente las preguntas del plan original (contrato, depósito, qué pasa si la propiedad no es como en las fotos) — sin fabricar servicios que la plataforma no presta: el contrato y el depósito se acuerdan directo entre inquilino y anfitrión, MIKA Homes no los gestiona. Enlazada desde el footer y desde la PDP.

Reseñas reales por propiedad ya existían — no se tocó.

### P4-2 · Transparencia de costos — ✅ implementado (junto con P3-2b)

`deposit`, `utilitiesMin` y `utilitiesMax` se agregaron como campos **opcionales** al modelo `Rental` y al formulario de admin. La PDP solo muestra el desglose (renta + depósito + servicios estimados + primer pago) cuando esos campos están cargados — si una propiedad no los tiene, no se inventa una cifra, simplemente no aparece esa sección. Verificado en runtime con un registro de prueba temporal en Supabase (insertado y borrado en la misma sesión).

### P4-3 · Formulario de lead — identificado, sin tocar por decisión del usuario

Se encontró el formulario de 7 campos que describía el plan original: no es el de "publicar propiedad" (ese ya es corto), es el de **"Recibe la guía gratis"** en la home (`#contacto`), destino histórico del CTA principal del header. Al revisarlo apareció un problema más grave: el mensaje de éxito promete *"Revisa tu correo — la guía va en camino"*, pero `api/leads.ts` solo guarda el lead en Supabase — **no envía ningún correo**, no hay integración de email para este formulario ni contenido de guía en el repo. Consultado con el usuario: decidió dejarlo así por ahora (lo maneja aparte). No se tocó ni el formulario ni el envío de correo — queda documentado para cuando se retome.

### P4-4 · Jerarquía de CTAs — ✅ implementado

Confirmado y corregido: el CTA principal del header (`Empieza aquí` → `/#contacto`) apuntaba al formulario de la guía de retiro, no a los alquileres. Por decisión del usuario, se cambió a **"Ver alquileres" → `/alquiler`** (desktop y mobile), coherente con que el sitio hoy es MIKA Homes. El CTA del footer ("Suscribirme" al boletín) se dejó apuntando a `/#contacto` — es un CTA secundario explícitamente de newsletter, no el principal.

### P4-5 · Carrusel duplicado — ya estaba resuelto, sin cambios

Revisado el código de `attractions-carousel` en el home: el set clonado para el loop infinito ya tiene `aria-hidden="true"` y `tabindex={-1}`, exactamente la mitigación que pedía el plan original. Falso positivo del plan — no había nada que arreglar.

---

## FASE 5 — A11y, i18n, SEO, Performance (Sprint 5)

### P5-1 · i18n por ruta — ✅ implementado

Confirmado el diagnóstico original: `<html lang>` no cambiaba server-side, ambos idiomas vivían en el mismo DOM, sin `hreflang` posible. Corrección importante hecha en el momento: **el `lang` del `<html>` ya se corregía solo en cliente** al togglear idioma (`applyLang()` en `Layout.astro` ya hacía `html.setAttribute('lang', lang)`), así que el problema real no era tan grave como "el lector de pantalla lee inglés con fonética española" — solo había una ventana de milisegundos antes de que cargara el JS, y para crawlers (que no ejecutan JS) el problema real era otro: una sola URL indexable con los dos idiomas mezclados, sin señal de idioma alternativo posible.

**Decisión de alcance, consultada y confirmada con el usuario antes de empezar:** implementar rutas completas `/es/` y `/en/` (no un parche intermedio), pero **sin reescribir cada string bilingüe individual** de las 7 páginas públicas — el mecanismo `.lang-es`/`.lang-en[hidden]` + toggle CSS por `[data-lang]` se mantuvo intacto (funciona, está probado, reescribir cientos de pares de spans en todo el sitio habría sido un riesgo desproporcionado). Lo que cambió es la **capa de ruteo alrededor de ese contenido**:

- Las 7 páginas públicas (`index`, `alquiler/index`, `alquiler/[id]`, `blog/index`, `blog/[id]`, `publicar-propiedad`, `como-funciona`) se movieron a `src/pages/[lang]/...`. Cada una valida el segmento de idioma (`isLocale()`) y redirige a `/es/...` si es inválido.
- Las rutas viejas sin prefijo (`/`, `/alquiler`, `/blog`, etc.) quedaron como stubs de una línea que redirigen — `/` detecta idioma por header `Accept-Language` (`src/lib/i18n.ts`), el resto redirige al equivalente en español preservando el resto del path y la query string.
- `Layout.astro` ahora recibe `lang` como prop obligatoria: `<html lang={lang} data-lang={lang}>` server-side (sin depender de JS), `<title>`/`<meta description>` en el idioma correcto de la ruta (ya no ambos con JS intercambiándolos), y `hreflang` real (`es`, `en`, `x-default`) apuntando a URLs que existen de verdad.
- El toggle ES/EN del header dejó de ser un cambio de CSS en cliente — ahora son links reales a la ruta equivalente en el otro idioma (`swapLocale()` en `src/lib/i18n.ts`), preservando la página exacta en la que estás (una ficha de propiedad, una búsqueda filtrada con query string, un artículo del blog). Se eliminó el `localStorage`/`applyLang()` que ya no hacía falta.
- `Header`/`Footer` reciben `lang` y localizan todos sus links (nav, CTA, logo, "Cómo funciona", `#contacto`).
- **Hallazgo no planeado en el camino:** `@astrojs/sitemap` nunca generó nada — "No pages found!" en cada build, porque no puede descubrir rutas dinámicas en un sitio 100% SSR sin páginas prerenderizadas. Esto **ya estaba roto antes** de esta sesión, no es algo que haya causado el cambio de rutas. Se reemplazó por `src/pages/sitemap.xml.ts`, un endpoint real que consulta Supabase en cada request y arma el XML con las 5 rutas estáticas + cada propiedad + cada post, en ambos idiomas con `xhtml:link` alternates. `robots.txt` actualizado a `/sitemap.xml`.

**Trade-off explícito, no es la versión "pura":** ambos idiomas se siguen enviando en el HTML de cada request (uno oculto vía CSS) — no se logró el beneficio de "la mitad del peso de HTML" que tendría una implementación que solo renderiza el idioma activo. Lo que sí se logró: `<html lang>` correcto sin depender de JS, `hreflang` real entre URLs que existen, y contenido visualmente correcto por idioma en cada ruta — que es lo que un crawler evalúa. Contenido oculto vía `display:none` no cuenta como contenido indexable para Google, así que esto no es un problema de "cloaking", es una limitación de peso de página, no de SEO.

**Verificación:** build de producción limpio (`npm run build`, sin warnings), y en dev server: `/` redirige por `Accept-Language` (confirmado con headers `en-US` y `es-PA`), todas las rutas `/es/*` y `/en/*` responden 200, las rutas viejas sin prefijo redirigen preservando query string, un locale inválido (`/fr`) redirige a `/es`, `<html lang>` y `hreflang` correctos en el HTML real, el toggle ES/EN apunta a la URL equivalente correcta (probado en `/es/alquiler` → `/en/alquiler`), el modal de solicitud de 3 pasos y los filtros de `/alquiler` siguen funcionando dentro de la nueva estructura, y `/sitemap.xml` genera XML válido con datos reales (probado insertando y borrando una propiedad de prueba). `/admin/*` no se tocó — queda fuera del árbol de idiomas a propósito.

### P5-2 · Accesibilidad — acotado

Lo que sí falta, confirmado:
- `input[type=range]` de precio y `<select>` de huéspedes en el sidebar de filtros: sin `aria-label`/`<label>` visible.
- Targets táctiles de los dots del carrusel de destacados (`.stays-spot-dot`, 8px visual) — confirmar si el área clickeable real ya cumple 44×44px o si es necesario ampliarla con padding invisible.

Lo que **ya está mejor** de lo que el plan asumía: existe una regla `:focus-visible` global usando `--shadow-focus`, más 9 reglas específicas adicionales repartidas en componentes (incluyendo un cuidado explícito en `.whatsapp-contact:focus-visible` de la PDP). No es un vacío total como describía el plan original — es una auditoría de cobertura, no una implementación desde cero.

### P5-3 · SEO técnico — ✅ implementado (sprint 1, ampliado en sprint 5)

`og:*`, `canonical`, `twitter:card` y JSON-LD `Accommodation` por propiedad se agregaron en el sprint 1. En el sprint 5 se sumó `hreflang` real (posible recién ahora que existen URLs separadas por idioma) y un `sitemap.xml` funcional que antes no generaba nada — ver el detalle en P5-1.

### P5-4 · Performance — parcialmente ya resuelto

Confirmado en `astro.config.mjs`: `build: { inlineStylesheets: 'always' }` ya evita el problema de CSS render-blocking que el plan original señalaba como pendiente. El hero de `/alquiler` ya usa `astro:assets` con `widths`, `sizes`, `quality`, `loading="eager"` y `fetchpriority="high"`. Lo que sí falta: confirmar que las primeras 4 cards del grid de resultados usen `fetchpriority="high"` (hoy no se distingue, todas usan `loading="lazy"` parejo) y medir LCP/CLS real con Lighthouse antes de invertir más aquí — es probable que ya esté cerca del objetivo.

---

## 6. Definition of Done (por PR)

Igual al plan original, sin cambios — sigue siendo un buen checklist:

- [ ] Sin regresiones de contraste (verificado con axe o Stark)
- [ ] Navegable solo con teclado; foco visible en todo control
- [ ] Estados cubiertos: `loading` · `empty` · `error` · `success` · `disabled`
- [ ] Responsive verificado en 360 / 768 / 1024 / 1440
- [ ] `prefers-reduced-motion` respetado
- [ ] Sin CLS nuevo (imágenes con `aspect-ratio` o `width`/`height`)
- [ ] Copy revisado en ES **y** EN
- [ ] Ningún string hardcodeado fuera de `src/data/data.ts` o del contenido de Supabase
- [ ] Ninguna cifra de marketing sin origen de datos real (verificable con una query directa, como se hizo en esta revisión)

---

## 7. Métricas de éxito

| Métrica | Base actual (confirmada) | Objetivo 90 días |
|---|---|---|
| Propiedades publicadas (`rentals` en Supabase) | **0** | ≥ 25 |
| Lugares/eventos/posts con contenido | 9 / 2 / 21 (ya con datos reales) | — |
| Rebote en `/alquiler` | Sin medir | < 50% |
| Búsquedas con ≥1 filtro aplicado | Sin medir (no hay analítica de filtros) | > 60% |
| Vista de ficha → solicitud enviada | Sin medir | > 8% |
| Lighthouse a11y | Sin medir en esta sesión | ≥ 95 |
| LCP móvil | Sin medir en esta sesión — pero la config base (inlined CSS, `fetchpriority`) ya apunta bien | < 2.5 s |

---

## 8. Roadmap ajustado

| Sprint | Contenido | Resultado |
|---|---|---|
| **1** ✅ | Fase 0 (P0-1, P0-2, P0-3) + P5-3 (SEO, es barato y no depende de nada más) | El sitio deja de contradecirse y queda indexable/compartible correctamente — **implementado** el 2026-08-19: stats del home derivadas de Supabase, empty state del catálogo, lifestyle cards deshabilitadas, canonical/OG/Twitter card en `Layout.astro`, JSON-LD `Accommodation` en la PDP |
| **2** ✅ | P2-1, P2-2 (sin zona/incluye), P2-3, P2-4 (orden), P2-5 | Búsqueda real, compartible e indexable — **implementado** el 2026-08-19: filtrado server-side vía `Astro.url.searchParams`, filtros de duración/habitaciones/baños/fecha de mudanza, chips de filtros activos + limpiar, orden (relevancia/precio/recientes/rating), botón sticky "Ver N resultados" en mobile |
| **3** ✅ | P3-2b, P1-2, P3-1 | **Implementado** el 2026-08-19: desglose de costos condicional (P4-2), reglas de la casa, propiedades similares, iconos de trazo en vez de emoji, `aria-label` + `fetchpriority` en las cards. **P2-6 (mapa) sigue diferido** — no se tocó, queda para su propio sprint por el impacto en el layout de 2 columnas |
| **4** ✅ | P3-3, Fase 4 (P4-1, P4-4, P4-5 — P4-3 identificado y documentado, no tocado por decisión del usuario) | **Implementado** el 2026-08-19: modal de solicitud de 3 pasos integrado a leads (migración `0003`), tooltip de verificación + página "Cómo funciona", CTA del header corregido a `/alquiler`, carrusel confirmado ya resuelto |
| **5** ✅ | P5-1 (i18n por ruta) + `sitemap.xml` real | **Implementado** el 2026-08-19: rutas `/es/` y `/en/` completas, `hreflang`, toggle de idioma como navegación real, sitemap dinámico. P5-2 (labels de a11y) y P5-4 (medición de performance) quedaron pendientes — no se tocaron |
| **6** | Iteración sobre métricas reales una vez el catálogo tenga contenido | — |

La diferencia clave con el roadmap original: **P5-3 (SEO) se adelanta al sprint 1** porque es esfuerzo S, no depende de tener propiedades cargadas, y es puro upside sin riesgo — no tiene sentido esperar 5 sprints para algo tan barato.

---

## 9. Riesgo principal — confirmado, sin cambios

La consulta directa a Supabase confirma que `rentals` tiene 0 filas mientras el resto del contenido del sitio (`places`, `events`, `posts`) sí está poblado. Esto significa que **el equipo ya sabe cómo cargar contenido real** (lo hizo para lugares, eventos y blog) pero no lo ha hecho para el catálogo de alquiler — no es un problema de la plataforma, es un problema de proceso u operación. Ninguna mejora de interfaz compensa esto. El orden correcto sigue siendo: conseguir 8–12 propiedades reales con fotos propias → Sprint 1 → tráfico. La diferencia respecto al plan original es que la interfaz que va a mostrar esas propiedades **ya está construida y es razonablemente buena** — el cuello de botella es puramente de contenido, no de desarrollo.
