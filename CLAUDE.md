# CalcFit — Contexto del Proyecto

## Qué es este proyecto

CalcFit (calcfit.com) es un sitio de calculadoras de salud gratuitas, validadas científicamente, sin registro ni cookies de rastreo. Todo el cálculo ocurre en el navegador del usuario — no hay backend.

Este es el proyecto **Astro** (migración desde Next.js). El proyecto Next.js original vive en `c:\Users\Jose\calculadora-imc-js` y se mantiene como respaldo sin modificaciones.

---

## Repositorio Git

- **URL:** `https://github.com/codezun-star/calcfit`
- **Rama principal:** `main`
- **Email de contacto del proyecto:** `codezun@gmail.com`

---

## Stack tecnológico

| Elemento | Tecnología |
|---|---|
| Framework | Astro 6 con `output: 'static'` |
| UI interactiva | React 19 (solo donde hay estado) |
| Tipos | TypeScript estricto — cero `any` |
| Estilos | CSS puro con custom properties — sin Tailwind, sin CSS-in-JS |
| Compresión | astro-compress (automática en build) |
| Sitemap | @astrojs/sitemap |
| Deploy | Output estático — compatible con Vercel, Netlify, Cloudflare Pages |

**Sin librerías de animación** — solo CSS `@keyframes`.
**Sin librerías de íconos** — solo SVG inline simples con `currentColor`.
**Sin librerías de gráficos** — solo SVG/CSS puro.

---

## Estructura de carpetas

```
calcfit-astro/
├── public/
│   ├── favicon.svg                    ← cruz "+" acid sobre fondo ink
│   ├── favicon.ico
│   ├── robots.txt
│   ├── og/                            ← imágenes OG estáticas (generadas, scripts/generate-og.mjs)
│   └── apple-touch-icon.png           ← icono iOS 180×180
├── src/
│   ├── styles/
│   │   ├── tokens.css                 ← variables CSS (colores, tipografías)
│   │   └── global.css                 ← reset + animaciones base
│   ├── layouts/
│   │   ├── Base.astro                 ← HTML base con meta tags y JSON-LD
│   │   └── CalculatorLayout.astro     ← layout de cada calculadora (navbar + breadcrumb + slots)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.astro
│   │   │   └── Footer.astro           ← 3 columnas: Herramientas, CalcFit, Legal
│   │   ├── ui/                        ← componentes React reutilizables
│   │   │   ├── Toggle.tsx             ← "kg · cm" / "lb · pies"
│   │   │   ├── Input.tsx
│   │   │   ├── Button.tsx             ← variantes: primary | ghost | dark
│   │   │   ├── ResultCard.tsx
│   │   │   ├── HistoryTable.tsx
│   │   │   ├── ShareButtons.tsx
│   │   │   └── Badge.tsx              ← popular | new | essential
│   │   └── calculators/               ← 99 componentes React (ver CALCULADORAS.md)
│   │       ├── [NombreCalculator].tsx ← un archivo por calculadora
│   │       ├── GaugeIMC.tsx           ← gauge SVG semicircular animado
│   │       ├── ZonasCardiaca.tsx      ← barras horizontales de zonas cardíacas
│   │       └── BarrasCaloria.tsx      ← barras verticales déficit/mant/superávit
│   ├── lib/
│   │   ├── calculators.ts             ← TODA la lógica de cálculo (funciones puras)
│   │   ├── units.ts                   ← conversiones métrico ↔ imperial
│   │   ├── useValidation.ts           ← hook de validación de campos
│   │   └── useHistory.ts              ← hook de historial en localStorage
│   ├── content.config.ts              ← schema Zod del blog (Content Layer API, Astro 6)
│   ├── content/
│   │   └── blog/                      ← artículos .md (nombre del archivo = slug de URL)
│   └── pages/
│       ├── index.astro                ← homepage con las 99 calculadoras (importa de lib/calcData.ts)
│       ├── [slug].astro               ← 99 páginas calculadora (ver CALCULADORAS.md)
│       ├── fitness|embarazo|fechas|nutricion/[...page].astro ← páginas de categoría paginadas
│       ├── blog/
│       │   ├── [...page].astro        ← lista paginada (20 art/pág) — /blog, /blog/2, /blog/3...
│       │   └── [slug].astro           ← artículo individual con JSON-LD Article
│       ├── sobre-nosotros.astro       ← página estática
│       ├── contacto.astro             ← solo email, sin formulario
│       ├── aviso-legal.astro          ← LSSI-CE
│       ├── politica-privacidad.astro  ← RGPD/LOPDGDD
│       └── politica-cookies.astro     ← explica uso de localStorage
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

---

## Sistema de diseño

### Paleta de colores (tokens.css)

| Variable | Valor | Uso |
|---|---|---|
| `--ink` | `#0F0E0D` | Fondo oscuro principal, texto sobre cream |
| `--ink-2` | `#161514` | Fondo oscuro secundario (hero columna derecha) |
| `--ink-3` | `#222220` | Bordes en zonas oscuras |
| `--cream` | `#F5F1E8` | Fondo claro principal |
| `--acid` | `#CAFF00` | Color de acento — valores de resultado, CTAs, logo |
| `--muted` | `#6B6760` | Texto secundario, labels |
| `--border` | `#E2DDD4` | Bordes en zonas claras |

### Tipografía

| Variable | Fuente | Uso |
|---|---|---|
| `--font-display` | Bebas Neue | Valores de resultado, H1/H2, logo, números grandes |
| `--font-mono` | DM Mono | Labels, badges, metadatos, separadores |
| `--font-body` | Plus Jakarta Sans | Texto general, botones, descripciones |

### Reglas de diseño que NUNCA se rompen

- **Cero gradientes** en todo el proyecto
- **Cero box-shadows** en todo el proyecto
- **border-radius máximo 2px** en todo — diseño cuadrado, no redondeado
- Todos los valores numéricos de resultado van en **Bebas Neue**
- El color acid (`#CAFF00`) es el único color de acento — no agregar otros sin consultar
- **Todas las URLs sin trailing slash.** Nunca crear rutas ni enlaces con `/` al final. El sitio usa `trailingSlash: 'never'` en `astro.config.mjs` y `build.format: 'file'` (genera `page.html`, no `page/index.html`). Cloudflare Pages redirige `/page/` → `/page` (301) vía `public/_redirects`. Cualquier enlace interno con slash final rompe el canonical y genera un redirect innecesario.

### Contraste de texto en fondos oscuros

En fondos `var(--ink)` (#0F0E0D) y similares, usar mínimo `#888` para texto secundario. Escala aprobada:

| Uso | Color mínimo |
|---|---|
| Labels / encabezados de columna | `#999` |
| Unidades (min/km, kcal/día…) | `#aaa` |
| Texto descriptivo secundario | `#999` |
| Encabezados de sección (footer, hero) | `#888` |
| Decorativo / muy secundario | `#666` |

**No usar** `#555`, `#444`, `#333` sobre fondos oscuros — ratio de contraste insuficiente (< 4.5:1 WCAG AA).

### Logo y favicon

El **logo** (`public/logo.svg`) es texto "Calc**Fit**" en fondo cream (`#F5F1E8`), "Calc" en ink y "Fit" en acid. ViewBox `160×48`, fuente Segoe UI 30px bold.

El **favicon** (`public/favicon.svg`) es una cruz `+` acid (`#CAFF00`) sobre fondo ink (`#0F0E0D`). ViewBox `32×32` — dos rectángulos perpendiculares de 6px de ancho.

- `Navbar.astro` — usa `<img src="/logo.svg" height="44">` (renderiza ~27px de texto)
- `index.astro` — mismo `<img>` en el nav inline de la homepage
- `public/favicon.ico` — fallback para Safari iOS

**Soporte favicon SVG:** Chrome 80+, Firefox 82+, Edge 80+, Safari 12+ ✓ — Safari iOS ✗ (usa el `.ico` de fallback). Si el favicon no aparece en el browser durante desarrollo, es caché — hacer Ctrl+Shift+R o abrir `/favicon.svg` directamente.

### Iconos en la homepage

Todos los íconos de las calculadoras son **SVG strings inline** renderizados con `<Fragment set:html={calc.icon} />`. Usan `currentColor` — el contenedor lleva `color: var(--acid)` sobre fondo ink o `color: var(--ink)` sobre fondo acid para theming automático. No hay emojis en ninguna parte del proyecto.

---

## Terminología LATAM

El proyecto usa terminología comprensible para Latinoamérica. Reglas fijas:

| Término incorrecto | Término correcto | Contexto |
|---|---|---|
| `suffix="ft"` | `suffix="pies"` | Inputs de altura imperial |
| `suffix="in"` | `suffix="pulg"` | Inputs de pulgadas imperial |
| `"bpm"` | `"ppm"` | Pulsaciones por minuto (frecuencia cardíaca) |
| `"FC máxima"` | `"Frec. cardíaca máxima"` | Labels de inputs |
| `"Chupitos"` | `"Shots/tragos"` | Spain-only, no se usa en LATAM |
| `suffix="ud"` | `suffix="cant."` | Conteo de bebidas |

El Toggle siempre muestra **"kg · cm"** y **"lb · pies"** — nunca "Métrico"/"Imperial" ni abreviaturas en inglés.

---

## Arquitectura de páginas

Cada página de calculadora sigue este patrón exacto (incluye los props SEO obligatorios):

```astro
<CalculatorLayout
  title="Calculadora de Nombre — Variante / Beneficio | CalcFit"
  description="Verbo de acción + keyword principal + beneficio concreto + CTA. Máx 155 chars."
  calculatorName="Nombre Calculadora"
  breadcrumbSlug="slug-url"
  ogImage="/og/nombre.jpg"
  keywords="keyword 1, keyword 2, keyword 3, keyword 4, keyword 5"
  faqs={[
    { q: '¿Pregunta frecuente 1?', a: 'Respuesta detallada de al menos 2 frases con datos concretos.' },
    { q: '¿Pregunta frecuente 2?', a: 'Respuesta detallada...' },
    { q: '¿Pregunta frecuente 3?', a: 'Respuesta detallada...' },
    { q: '¿Pregunta frecuente 4?', a: 'Respuesta detallada...' },
    { q: '¿Pregunta frecuente 5?', a: 'Respuesta detallada...' },
  ]}
>
  <!-- Header oscuro con H1 — usar color: #999 (nunca #666) en párrafo descriptivo -->
  <div style="background: var(--ink); padding: 40px 32px 32px;">
    <h1 style="font-family: var(--font-display); font-size: clamp(40px, 8vw, 64px); color: white; line-height: 0.92; margin-bottom: 12px;">
      Nombre<br><span style="color: var(--acid);">Calculadora</span>
    </h1>
    <p style="font-size: 13px; color: #999; max-width: 480px; line-height: 1.7;">
      Descripción breve de qué hace y para qué sirve.
    </p>
  </div>

  <!-- Componente React con client:load -->
  <NombreCalculator client:load />

  <!-- Contenido SEO server-rendered (no JavaScript) — OBLIGATORIO y rico -->
  <div slot="seo">
    <h2 style="font-family: var(--font-display); font-size: 32px; color: var(--ink); margin-bottom: 16px;">¿Cómo se calcula?</h2>
    <p style="font-size: 14px; line-height: 1.7; color: var(--muted); margin-bottom: 24px;">
      Explicación de la fórmula o método con referencias científicas.
    </p>

    <!-- Tabla de referencia (obligatoria si tiene rangos o categorías) -->
    <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px;">
      <!-- ... -->
    </table>

    <!-- Preguntas frecuentes en HTML — MISMO contenido que el prop faqs -->
    <h2 style="font-family: var(--font-display); font-size: 32px; color: var(--ink); margin-bottom: 16px; margin-top: 32px;">Preguntas frecuentes</h2>
    <div style="display: flex; flex-direction: column; gap: 16px;">
      {[
        { q: '¿Pregunta?', a: 'Respuesta.' },
      ].map(faq => (
        <div style="border-bottom: 1px solid var(--border); padding-bottom: 14px;">
          <p style="font-size: 14px; font-weight: 600; color: var(--ink); margin-bottom: 6px;">{faq.q}</p>
          <p style="font-size: 13px; color: var(--muted); line-height: 1.7;">{faq.a}</p>
        </div>
      ))}
    </div>
  </div>
</CalculatorLayout>
```

**Importante:** El slot `seo` es renderizado en el servidor como HTML estático. No va React ahí. Los componentes de calculadora llevan siempre `client:load`.

---

## Lógica de cálculo (src/lib/calculators.ts)

**Principio fundamental:** Ningún componente hace cálculos propios. Toda la matemática vive en `calculators.ts` como funciones puras exportadas.

### Funciones disponibles

Las 89 funciones están documentadas en [CALCULADORAS.md](CALCULADORAS.md) (índice) y en los archivos de detalle por categoría: [CALCULADORAS-FITNESS.md](CALCULADORAS-FITNESS.md), [CALCULADORAS-NUTRICION.md](CALCULADORAS-NUTRICION.md), [CALCULADORAS-EMBARAZO.md](CALCULADORAS-EMBARAZO.md), [CALCULADORAS-FECHAS.md](CALCULADORAS-FECHAS.md) — columna "Función en calculators.ts". La firma completa (parámetros y tipo de retorno) vive en el propio archivo `src/lib/calculators.ts` con TypeScript estricto.

Convención: todas las funciones son `export function calcularXxx(...)` sin efectos secundarios.

### Conversión de unidades (src/lib/units.ts)

```typescript
toKg(lb)         → kg
toCm(ft, inches) → cm
toLb(kg)         → lb
toFtIn(cm)       → { ft, inches }
```

---

## Componentes UI — guía de uso

### Toggle
Cambia entre sistema métrico e imperial. Siempre el primer elemento de los formularios con peso o altura. Las etiquetas son **"kg · cm"** y **"lb · pies"** — no cambiar a inglés.
```tsx
<Toggle value={units} onChange={setUnits} />
```

### Input
Sin borde lateral, solo `border-bottom`. Al focus cambia a `--acid`.
```tsx
<Input label="Peso" value={peso} onChange={setPeso} suffix="kg" error={errors.peso} />
```

### Button — variantes
- `primary` (default): fondo acid, texto ink — para el botón principal de calcular
- `ghost`: borde border, fondo transparente — para acciones secundarias
- `dark`: fondo ink, texto acid — para CTAs sobre fondo claro

### ResultCard
Muestra el resultado principal. Valor en Bebas Neue 72px color acid sobre fondo ink.
```tsx
<ResultCard label="Tu IMC" value={22.4} unit="kg/m²" interpretation="Peso normal" />
```

### HistoryTable
Solo disponible en: IMC, Calorías Diarias, Grasa Corporal. Lee/escribe localStorage.
```tsx
<HistoryTable storageKey="imc-history" unit="kg/m²" />
```

### ShareButtons
Incluye WhatsApp, X/Twitter y Copiar enlace. SVG inline, sin dependencias.
```tsx
<ShareButtons text="Mi IMC es 22.4..." url="https://www.calcfit.com/imc" />
```

---

## Visualizaciones

Tres visualizaciones específicas en `src/components/calculators/`:

- **GaugeIMC** — gauge SVG semicircular de 5 colores. Marcador animado con CSS `transform: rotate()`. Props: `imc: number`
- **ZonasCardiaca** — barras horizontales CSS con 5 zonas coloreadas. Muestra rangos en **ppm**. Props: `fcm, zonas[]`
- **BarrasCaloria** — 3 barras verticales (déficit / mantenimiento / superávit). La de mantenimiento en acid. Props: `tdee: number`

---

## Homepage (src/pages/index.astro)

La homepage muestra las **99 calculadoras** en 4 categorías mediante el componente `CalculatorBrowser`. Los datos (calculadoras, categorías e íconos SVG) viven en `src/lib/calcData.ts` como **fuente única**: `index.astro` y las páginas de categoría (`/fitness`, `/embarazo`, `/fechas`, `/nutricion`) importan de ahí. Al añadir una calculadora se edita SOLO `calcData.ts`. Los íconos se renderizan con `set:html` / `dangerouslySetInnerHTML`.

### Secciones de la homepage y dónde aparece el contador

| Sección | Ubicación en el archivo | Qué actualizar |
|---|---|---|
| `<Base title=…>` | línea ~174 | Número en el título |
| Schema `Organization` | campo `description` | Número en texto |
| Schema `ItemList` | campo `numberOfItems` | Número entero |
| `<Base description=…>` | línea ~175 | Número en la descripción |
| **Sección CTA** (fondo acid, al final) | párrafo inline | "79 calculadoras gratuitas te esperan." |

**Nota:** El ticker (banda acid) ya no incluye contador de calculadoras — fue eliminado. Los cards del grid tampoco muestran número de serie.

### Navbar de la homepage — categorías

El nav de la homepage (index.astro) tiene 4 links de categoría con scroll suave:
- `#fitness` → Fitness & salud
- `#embarazo` → Embarazo & fertilidad
- `#fechas` → Fechas & tiempo
- `#nutricion` → Nutrición & bienestar

Estos links cambian el hash de la URL → `CalculatorBrowser` escucha `hashchange` y activa la categoría correspondiente automáticamente. El `scroll-padding-top: 64px` en `html` compensa el navbar fixed.

### Navbar — position: fixed

Tanto `Navbar.astro` (páginas calculadoras) como el nav inline de `index.astro` usan `position: fixed; top: 0; left: 0; right: 0`. El espaciado lo compensa un `<div style="height: 56px">` inmediatamente después del nav.

### Hero — imagen de fondo (actualizado 2026-05-16)

La columna izquierda del hero (`.hero-left`) tiene una imagen de fondo de gimnasio libre de Unsplash con overlay oscuro:

```css
.hero-left {
  background-image:
    linear-gradient(rgba(10, 10, 9, 0.72), rgba(10, 10, 9, 0.72)),
    url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400&q=80&fit=crop');
  background-size: cover;
  background-position: center top;
}
```

- El overlay `rgba(10,10,9,0.72)` asegura contraste suficiente para el texto blanco.
- En móvil (`max-width: 768px`) se aplica `background-position: center center` y `min-height: 420px`.
- La columna derecha (`.hero-nums`) mantiene fondo sólido `var(--ink-2)` sin imagen.
- Si se cambia la imagen, verificar que el overlay siga siendo opaco suficiente (mínimo 0.65).

Categorías y conteo actual (total: 99) — ver detalle en [CALCULADORAS.md](CALCULADORAS.md) y archivos por categoría:
- Fitness & salud (51) · Embarazo & fertilidad (20) · Fechas & tiempo (8) · Nutrición & bienestar (20)

Al agregar una calculadora nueva, seguir el checklist completo de la sección "Reglas para agregar una calculadora nueva".

---

## Blog — Content Collections

El blog usa el **Content Layer API de Astro 6** con archivos `.md` en `src/content/blog/`.

### Archivos del sistema

| Archivo | Descripción |
|---|---|
| `src/content.config.ts` | Schema Zod con `glob` loader (Astro 6) |
| `src/pages/blog/[...page].astro` | Lista paginada (20 artículos/página). Genera `/blog`, `/blog/2`, etc. Usa `getStaticPaths` + `paginate()`. |
| `src/pages/blog/[slug].astro` | Template de artículo individual con JSON-LD Article |
| `src/content/blog/*.md` | Artículos — el nombre del archivo ES la URL |

### Schema de artículo (`src/content.config.ts`)

```ts
{
  titulo: string,
  descripcion?: string,
  categoria: 'fitness' | 'nutricion' | 'salud' | 'guias' | 'general',  // default: 'general'
  fecha: string,        // ISO "YYYY-MM-DD" — solo para ordenación, no aparece en la URL
  keywords: string[],
  autor: string,        // default: 'Equipo CalcFit'
  publicado: boolean,   // default: true — false oculta el artículo sin borrar el archivo
}
```

### Cómo crear un artículo nuevo

1. Crear `src/content/blog/[slug].md` — el nombre del archivo es la URL final (`/blog/slug`).
2. Escribir el frontmatter con los campos del schema.
3. El cuerpo puede ser Markdown o HTML.

Ejemplo mínimo:
```md
---
titulo: "Título del artículo"
descripcion: "Descripción para SEO y cards."
categoria: "fitness"
fecha: "2026-05-27"
keywords: ["keyword 1", "keyword 2"]
---

## Sección

Contenido del artículo...
```

### Reglas evergreen (OBLIGATORIO)

- **NUNCA incluir el año en el slug, título ni keywords.**
  - Correcto: `que-es-el-imc`, "Qué es el IMC"
  - Incorrecto: `que-es-el-imc-2026`, "Qué es el IMC 2026"
- El campo `fecha` solo sirve para ordenar artículos — no sale en la URL.

### Rutas del blog en la navegación

El blog está enlazado desde:
- **Navbar.astro** — link "Blog" visible en escritorio (oculto en móvil con `.nav-hide`)
- **Homepage (index.astro)** — link "Blog" en el nav de categorías + sección "DESDE EL BLOG" con los 3 artículos más recientes
- **Footer.astro** — link "Blog" en la columna "CalcFit"

### Sección "Desde el blog" en la homepage

La homepage muestra los **3 artículos más recientes** (publicado: true) con `getCollection`. La sección aparece solo si hay artículos publicados. Los artículos se ordenan por el campo `fecha` descendente.

### Sitemap

El sitemap se genera automáticamente con `@astrojs/sitemap` — las rutas `/blog/*` quedan incluidas sin configuración adicional.

### Checklist al agregar un artículo

1. Crear `src/content/blog/[slug].md` con frontmatter válido.
2. Ejecutar `npm run build` para verificar que no hay errores de schema.
3. El artículo aparecerá automáticamente en `/blog`, en la sección "Desde el blog" de la homepage (si es el más reciente) y en el sitemap.

---

## Páginas estáticas

Cinco páginas informativas/legales sin componentes React:

| Página | Ruta | Contenido |
|---|---|---|
| Sobre nosotros | `/sobre-nosotros` | Misión, tecnología, rigor científico |
| Contacto | `/contacto` | Solo email codezun@gmail.com, sin formulario |
| Aviso legal | `/aviso-legal` | LSSI-CE, 6 secciones |
| Política de privacidad | `/politica-privacidad` | RGPD/LOPDGDD, 8 secciones |
| Política de cookies | `/politica-cookies` | Explica uso de localStorage (sin cookies de rastreo) |

---

## Analytics

Google Analytics está activo en todas las páginas (ID: `G-NRM0FZ5W8S`). Se inyecta en `Base.astro` con `is:inline async` — equivalente al `strategy="afterInteractive"` de Next.js. No bloquea el render.

---

## SEO — Sistema completo (implementado 2026-05-16)

Este proyecto usa **SEO agresivo** en todas las calculadoras. Cada nueva calculadora DEBE seguir exactamente el mismo estándar.

### Arquitectura de schemas JSON-LD

`CalculatorLayout.astro` genera automáticamente un `@graph` con **3 schemas** por página:
1. **`MedicalWebContent`** — describe el contenido médico con `lastReviewed`, `publisher`, `audience: Patient`
2. **`BreadcrumbList`** — Inicio → Nombre Calculadora (necesario para rich results de breadcrumb)
3. **`FAQPage`** — generado automáticamente si se pasa el prop `faqs` (produce las rich results de preguntas en Google)

`Base.astro` tiene un schema `@graph` global en la homepage con `WebSite` (SearchAction) + `Organization`.

### Props SEO del CalculatorLayout

```astro
<CalculatorLayout
  title="..."          <!-- Obligatorio. Formato: "Keyword Principal — Variante | CalcFit". Máx 60 chars. -->
  description="..."   <!-- Obligatorio. Máx 155 chars. Incluir keyword, verbo, beneficio y CTA. -->
  keywords="..."      <!-- Obligatorio. 4-6 keywords separadas por comas. -->
  faqs={[...]}        <!-- Obligatorio. Mínimo 4 preguntas. Genera FAQPage JSON-LD automáticamente. -->
  calculatorName="..."
  breadcrumbSlug="..."
  ogImage="..."
  dateModified="YYYY-MM-DD"  <!-- Opcional. Default: 2026-05-16 -->
>
```

### Reglas de título (title)
- **Keyword primero**: empezar con el término que la gente busca, no con "Calculadora de"
- **Máx 60 caracteres** incluyendo " | CalcFit"
- Formato: `"Keyword Principal — Variante o Beneficio | CalcFit"`
- Ejemplos correctos:
  - `"Calculadora de IMC Gratis — Fórmula OMS | CalcFit"` ✓
  - `"Calculadora VO2 Máximo — Salud Cardiovascular | CalcFit"` ✓
- Ejemplos incorrectos:
  - `"CalcFit — Calculadora de IMC"` ✗ (marca primero)
  - `"Calculadora de Índice de Masa Corporal según OMS 2024"` ✗ (demasiado largo)

### Reglas de descripción (description)
- **Máx 155 caracteres**
- Estructura: `[Verbo acción] + [keyword] + [resultado concreto] + [beneficio]. [CTA o detalle técnico].`
- Siempre terminar con "Gratis." o "Sin registro." o similar
- La keyword principal debe aparecer en los primeros 100 chars

### Reglas de keywords
- 4-6 términos separados por coma
- Incluir: keyword exacta + variantes de long tail + pregunta ("cuánto/cómo/cuál")
- Ejemplo: `"calculadora IMC, índice de masa corporal, calcular IMC gratis, IMC normal OMS, fórmula IMC"`

### Reglas de FAQs (prop faqs y slot="seo")
- **Mínimo 4 preguntas**, ideal 5-6
- Las preguntas deben responder a búsquedas reales ("¿cuánto...?", "¿cómo...?", "¿qué es...?", "¿es seguro...?")
- Las respuestas deben tener al menos 2 frases con datos concretos (números, referencias, fuentes)
- El array `faqs` del prop y las FAQs en el slot HTML deben ser **idénticos**
- Sin FAQs no hay `FAQPage` schema → no hay rich results en Google

### JSON-LD schemas usados
| Página | Schemas |
|---|---|
| Homepage (`index.astro`) | `WebSite` + `Organization` + `ItemList` (34 calculadoras) en `@graph` |
| Cada calculadora | `MedicalWebContent` + `BreadcrumbList` + `FAQPage` en `@graph` |

### Sitemap
Generado automáticamente por `@astrojs/sitemap`. Dos archivos en `/dist/`:
- `sitemap-index.xml` — índice principal
- `sitemap-0.xml` — todas las URLs bajo `https://www.calcfit.com`

URL a enviar en Google Search Console: `https://www.calcfit.com/sitemap-index.xml` (con www).

### Dominio canónico
Todo el sitio usa `https://www.calcfit.com` (con www). Configurado en `astro.config.mjs` → `site: 'https://www.calcfit.com'`. Al desplegar, configurar redirect 301 de `calcfit.com` → `www.calcfit.com` en el hosting.

### Imágenes OG
Carpeta `public/og/` — pendiente generar las imágenes por calculadora. Formato: 1200×630px. La ruta en cada página es `/og/[nombre].jpg`.

---

## Scripts disponibles

```bash
npm run dev      # servidor de desarrollo en localhost:4321
npm run build    # build estático en dist/
npm run preview  # preview del build
```

---

## Reglas para agregar una calculadora nueva

### Checklist completo — en este orden exacto:

**1. Lógica de cálculo**
- Agregar la función en `src/lib/calculators.ts` (función pura, cero efectos secundarios)
- Actualizar el bloque de documentación en CLAUDE.md → sección "Funciones disponibles"

**2. Componente React**
- Crear `src/components/calculators/NombreCalculator.tsx`
- **El div raíz DEBE ser siempre:** `<div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>` — sin esto el contenido no se centra
- Importar la función de `calculators.ts` — nunca calcular inline en el componente
- Usar `Toggle` si el formulario tiene peso o altura
- Usar `useValidation` o validación inline para los inputs
- Usar `Input`, `Button`, `ResultCard`, `ShareButtons`
- Respetar terminología LATAM (pies/pulg/ppm — ver tabla arriba)
- Agregar el nombre del archivo en la lista de calculators de CLAUDE.md

**3. Página Astro con SEO completo**
- Crear `src/pages/slug.astro` usando `CalculatorLayout`
- Rellenar los 4 props SEO obligatorios: `title`, `description`, `keywords`, `faqs`
  - `title`: keyword primero, máx 60 chars, formato "Keyword — Variante | CalcFit"
  - `description`: máx 155 chars, verbo + keyword + beneficio + "Gratis."
  - `keywords`: 4-6 términos en español separados por coma
  - `faqs`: mínimo 4 preguntas con respuestas de 2+ frases con datos concretos
- Añadir slot `"seo"` con: H2 intro + párrafo + tabla de referencia + sección FAQs (mismo contenido que el prop `faqs`)
- El párrafo del header oscuro usa `color: #999` (nunca `#666`)

**4. Sincronización de la homepage** (`src/pages/index.astro`)
- Añadir el ícono SVG al objeto `I` al inicio del frontmatter
- Añadir la entrada al array `calculadoras` con: `{ slug, nombre, desc, badge, destacada, num, icon }`
  - `num` debe ser el número siguiente (ej. si había 39, el nuevo es '40')
  - `badge`: `'popular'` | `'new'` | `'essential'` | `null`
- Añadir el slug al array correcto en `categorias` (Fitness, Embarazo, Fechas, Nutrición)
- Actualizar el `numberOfItems` en el schema `ItemList` de la homepage
- Actualizar el title y description de la homepage si el número de calculadoras cambia
  - Title: `"CalcFit — 40 Calculadoras de Salud..."` (actualizar número)
  - Description: `"40 calculadoras de salud..."` (actualizar número)
- Actualizar el texto de la **sección CTA**: `"49 calculadoras gratuitas te esperan."` → nuevo número
- **Nota:** El ticker ya no incluye contador de calculadoras (fue eliminado). El card number también fue eliminado del grid.

**5. Footer** (`src/components/layout/Footer.astro`)
- El enlace ya dice `"Ver todas →"` — no requiere actualización al agregar calculadoras

**6. CLAUDE.md** (este archivo)
- Actualizar el contador en la sección de estructura de carpetas: `← 35 componentes React`
- Añadir la función nueva a la sección "Funciones disponibles" de `calculators.ts`
- Añadir el archivo `.astro` a la lista de páginas
- Actualizar las categorías de la homepage si el conteo cambió
- Añadir entrada al Registro de cambios

**7. Verificación final**
- Ejecutar `npm run build` — debe completar sin errores
- El número de páginas en el build debe coincidir (actualmente 95: 89 calculadoras + 1 homepage + 5 estáticas)

---

### Resumen rápido (puntos de sincronización al agregar calculadora)

| Archivo | Qué actualizar |
|---|---|
| `src/lib/calculators.ts` | Nueva función pura |
| `src/components/calculators/NombreCalculator.tsx` | Nuevo componente |
| `src/pages/slug.astro` | Nueva página con SEO completo |
| `src/pages/index.astro` | Ícono en `I`, entrada en `calculadoras`, slug en `categorias`, `numberOfItems`, title, description, **ticker** (`num: 'N'`), **CTA** ("N calculadoras te esperan") |
| `src/components/layout/Footer.astro` | Sin cambios (dice "Ver todas →") |
| `CLAUDE.md` | Función, archivos, contadores, registro de cambios |

---

## Reglas para modificar estilos

- Los estilos van en los atributos `style` inline de cada componente/página (no hay clases CSS globales salvo las de animación `.anim`)
- Para cambiar un color de la paleta: editar `src/styles/tokens.css`
- Las animaciones `.anim .anim-1..6` están en `src/styles/global.css` y se aplican con clases HTML
- Nunca agregar `border-radius` mayor a 2px
- Nunca agregar `box-shadow`
- Nunca agregar gradientes

### Div raíz de cada componente calculadora — OBLIGATORIO

**Todo componente en `src/components/calculators/` DEBE tener este div raíz exacto:**

```tsx
<div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
```

Las 4 propiedades son **no negociables**:

| Propiedad | Valor | Razón |
|---|---|---|
| `padding` | `clamp(16px, 4vw, 32px)` | Responsive sin media queries |
| `maxWidth` | `640px` | Limita el ancho en pantallas grandes |
| `margin` | `0 auto` | **Centra horizontalmente** — sin esto el contenido se pega a la izquierda |
| `display` + `flexDirection` + `gap` | `flex / column / 24px` | Espaciado uniforme entre secciones |

**Lo que NO se debe poner en el div raíz:**
- `background: 'var(--cream)'` — el layout ya lo hereda, es redundante
- Ningún `maxWidth` diferente a `640px` para el wrapper principal (excepto `VolumenEntrenamiento` que usa 720px por su tabla)

**Error típico a evitar (batch 7B):**
```tsx
// ✗ MAL — sin centrado, sin maxWidth
<div style={{ padding: 'clamp(16px, 4vw, 32px)', background: 'var(--cream)' }}>

// ✓ BIEN
<div style={{ padding: 'clamp(16px, 4vw, 32px)', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
```

### Responsive — patrones establecidos

- `padding: clamp(16px, 4vw, 32px)` en todos los wrappers de calculadoras (evita media queries en TSX)
- `gridTemplateColumns: 'repeat(auto-fit, minmax(Xpx, 1fr))'` para todos los grids de resultados — valores usados: 80px, 100px, 120px, 130px, 150px según densidad de contenido
- `overflow-x: hidden` aplicado en `html, body` en `global.css` como red de seguridad
- Las secciones de `index.astro` con padding inline usan clases + `!important` en el `<style>` para overrides móvil
- El header oscuro de cada página calculadora se hace responsive vía `:global(.calc-main > div:first-child)` en `CalculatorLayout.astro`
- Tablas con scroll interno: envolver en `<div style="overflow-x: auto; -webkit-overflow-scrolling: touch">` con `minWidth` en el hijo

---

## localStorage keys en uso

| Calculadora | Key |
|---|---|
| IMC | `imc-history` |
| Calorías Diarias | `calorias-history` |
| Grasa Corporal | `grasa-history` |

Siempre verificar `typeof window !== 'undefined'` antes de acceder a localStorage.

---

## Pendientes conocidos

- Deploy en producción (Vercel / Netlify / Cloudflare Pages) — configurar redirect 301 de non-www a www
- Verificar propiedad en Google Search Console y enviar sitemap con URL www

> Resueltos (2026-06-16): imágenes OG generadas para las 99 calculadoras + `default.jpg` con `scripts/generate-og.mjs` (regenerar tras añadir calculadoras); `apple-touch-icon.png` 180×180 añadido. El sitio **no usa anuncios** actualmente (Monetag y AdSense fueron eliminados); si se reactivan, revisar la coherencia de `politica-cookies`.

## Registro de cambios

| Fecha | Acción |
|---|---|
| 2026-06-16 | Auditoría SEO + 7 tandas. (1) Eliminados TODOS los anuncios: Monetag (push/vignette/popunder) en Base.astro + componente AdSense `AdBanner.astro` y sus usos. (2) `calcData.ts` convertido en fuente única: integradas las 10 calculadoras del Batch 9 (Embarazo `/embarazo` pasa a 20) e `index.astro` ahora importa de calcData (fin de la duplicación). `og:type=article` en artículos del blog. (3) Corregidos 5 enlaces internos rotos del blog. (4) Generadas 99 imágenes OG de marca + `default.jpg` (`scripts/generate-og.mjs`); `ogImage` no estándar normalizados a `/og/[slug].jpg`. (5) 74 títulos acortados a ≤60 chars (keyword primero). (6) 45 meta descriptions acortadas a ≤155 chars. (7) Sitemap con prioridades por tipo (home 1.0, calc 0.8, blog 0.7, categoría 0.6, legal 0.3) y lastmod por build; breadcrumb de 3 niveles (Inicio→Categoría→Calculadora) en HTML y schema; `apple-touch-icon.png` 180×180; `og:image:alt`/`twitter:image:alt`; enlaces SSR a categorías en el footer. Total: 99 calculadoras. |
| 2026-06-02 | Blog: +20 artículos SEO (grasa-abdominal, ganar-musculo-siendo-delgado, cuanto-tarda-verse-el-musculo, running-para-principiantes, entrenamiento-mayores-40, vo2-maximo-como-mejorar, calorias-alimentos-comunes, proteina-vegetal-vs-animal, alcohol-y-calorias, dieta-mediterranea, carga-glucemica-practica, omega-3-beneficios, colesterol-alto-que-comer, presion-arterial-normal, glucosa-en-sangre, frecuencia-cardiaca-reposo, magnesio-deficiencia, sarcopenia-perdida-muscular, perder-peso-sin-efecto-rebote, salud-hormonal-y-ejercicio). Total blog: 48 artículos. |
| 2026-06-03 | Batch 9 Embarazo: +10 calculadoras (ventana-fertil, edad-gestacional, trimestre-embarazo, aumento-peso-embarazo, kick-counter, test-ovulacion, beta-hcg, probabilidad-embarazo, tiempo-postparto, compatibilidad-lactancia). Total: 99. Embarazo & fertilidad pasa de 10 a 20. |
| 2026-06-02 | Blog: paginación implementada. `index.astro` reemplazado por `[...page].astro` con `paginate()` (20 artículos/página). Navegación prev/next + números de página. |
| 2026-05-29 | SEO/URLs: `trailingSlash: 'never'` en `astro.config.mjs`. Redirect 301 `/*/→/:splat` en `public/_redirects` (Cloudflare Pages) para normalizar URLs con slash final. |
| 2026-05-27 | Blog: Content Layer API con `src/content.config.ts` + `src/pages/blog/`. Sección "Desde el blog" en homepage. Links en Navbar, homepage nav y Footer. |
| 2026-05-23 | Batch 8: +10 calculadoras (cuenta-regresiva, semanas-de-vida, generacion, jubilacion, edad-planetas, cuando-test-embarazo, peso-bebe-semana, lactancia, fecha-concepcion, fibra-diaria). Total: 89. |
| 2026-05-20 | Badges: eliminada etiqueta `'new'` de todas las cards (65 instancias → `null`). Solo se mantienen `'popular'` y `'essential'`. |
| 2026-05-20 | Batch 7B: +10 calculadoras (ftp-ciclismo, cadencia-carrera, predictor-carrera, recuperacion-muscular, vitamina-d, proteina-por-comida, ig-comida, omega-ratio, imc-infantil, edad-biologica). Total: 79. |
| 2026-05-20 | Batch 7A: +10 calculadoras (potencia-salto, grasa-visceral, oximetria, umbral-anaerobico, carga-entrenamiento, escala-borg, fc-reposo, actividad-fisica, hidratacion-deportiva, ritmo-natacion). Total: 69. |
| 2026-05-20 | Batch 6: +10 calculadoras (vam, indice-masa-grasa, creatina, ritmo-maraton, riesgo-diabetes, indice-conicidad, calorias-bebidas, tasa-sudoracion, masa-osea, sindrome-metabolico). Total: 59. |
| 2026-05-20 | UI: Navbar cambiado a `position: fixed` en homepage y páginas calculadoras. CalculatorBrowser: eliminada pill "Todas", navegación por hash (#fitness, #embarazo, #fechas, #nutricion). Nav homepage: 4 links de categoría con scroll suave. Ticker: eliminado contador de calculadoras. Cards: eliminado número de serie. Footer: "Ver todas →" (sin número). |
| 2026-05-20 | Bugfixes (12): GrasaCalculator validación, TestCooper fórmula Cooper, ColesterolCalculator warning TG≥400, DeficitCalorico validación peso objetivo, IndiceAdipositad imperial cadera, borderRadius '50%'→'2px' (PresionPulso/TemperaturaCorporal), renombres esSeguaro→esSeguro y pesoCorpoalKg→pesoCorporalKg, voseo en Sueno, VolumenEntrenamiento limitado a 2-4 días. |
| 2026-05-18 | Batch 5: +10 calculadoras (calorias-natacion, test-cooper, recuperacion-cardiaca, temperatura-corporal, carga-glucemica, peso-embarazo, presion-pulso, talla-predicha, test-rockport, cafeina). Total: 49. |
| 2026-05-16 | Batch 4: +5 calculadoras (glucosa, colesterol, calorias-ciclismo, fuerza-relativa, masa-muscular). Total: 39. |
| 2026-05-16 | Batch 3: +10 calculadoras (metabolismo-basal, 1rm, calorias-caminando, deficit-calorico, complexion-corporal, resistencia-insulina, somatotipo, riesgo-cardiovascular, indice-adiposidad, volumen-entrenamiento). Total: 34. |
| 2026-05-16 | SEO agresivo: Base.astro con Organization schema + SearchAction. CalculatorLayout.astro con props `keywords`, `faqs`, `dateModified` y generación automática de FAQPage + BreadcrumbList en @graph. Todas las 34 páginas actualizadas con titles/descriptions optimizados, keywords meta y FAQs en JSON-LD. Homepage con ItemList schema y título actualizado. |
| 2026-05-16 | Hero: imagen de gym Unsplash con overlay oscuro en columna izquierda. |
