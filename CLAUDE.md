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
│   └── og/                            ← imágenes OG estáticas (por generar)
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
│   │   └── calculators/               ← 34 componentes React
│   │       ├── IMCCalculator.tsx
│   │       ├── CaloriasCalculator.tsx
│   │       ├── PesoIdealCalculator.tsx
│   │       ├── GrasaCalculator.tsx
│   │       ├── FCMCalculator.tsx
│   │       ├── AguaCalculator.tsx
│   │       ├── OvulacionCalculator.tsx
│   │       ├── EmbarazoCalculator.tsx
│   │       ├── PartoCalculator.tsx
│   │       ├── EdadCalculator.tsx
│   │       ├── DiasFechasCalculator.tsx
│   │       ├── MacroCalculator.tsx
│   │       ├── ProteinasCalculator.tsx
│   │       ├── SuenoCalculator.tsx
│   │       ├── CinturaCaderaCalculator.tsx
│   │       ├── CaloriasEjercicioCalculator.tsx
│   │       ├── AlcoholemiaCalculator.tsx
│   │       ├── PresionArterialCalculator.tsx
│   │       ├── VO2MaxCalculator.tsx
│   │       ├── FFMICalculator.tsx
│   │       ├── CicloMenstrualCalculator.tsx
│   │       ├── RitmoCarreraCalculator.tsx
│   │       ├── CinturaEstaturaCalculator.tsx
│   │       ├── AyunoCalculator.tsx
│   │       ├── MetabolismoBasalCalculator.tsx
│   │       ├── UnRepeticionMaximaCalculator.tsx
│   │       ├── CaloriasCaminandoCalculator.tsx
│   │       ├── DeficitCaloricoCalculator.tsx
│   │       ├── ComplexionCorporalCalculator.tsx
│   │       ├── ResistenciaInsulinaCalculator.tsx
│   │       ├── SomatotipoCalculator.tsx
│   │       ├── RiesgoCardiovascularCalculator.tsx
│   │       ├── IndiceAdipositadCalculator.tsx
│   │       ├── VolumenEntrenamientoCalculator.tsx
│   │       ├── GaugeIMC.tsx           ← gauge SVG semicircular animado
│   │       ├── ZonasCardiaca.tsx      ← barras horizontales de zonas cardíacas
│   │       └── BarrasCaloria.tsx      ← barras verticales déficit/mant/superávit
│   ├── lib/
│   │   ├── calculators.ts             ← TODA la lógica de cálculo (funciones puras)
│   │   ├── units.ts                   ← conversiones métrico ↔ imperial
│   │   ├── useValidation.ts           ← hook de validación de campos
│   │   └── useHistory.ts              ← hook de historial en localStorage
│   └── pages/
│       ├── index.astro                ← homepage con las 34 calculadoras
│       ├── imc.astro
│       ├── calorias-diarias.astro
│       ├── peso-ideal.astro
│       ├── grasa-corporal.astro
│       ├── frecuencia-cardiaca.astro
│       ├── agua-diaria.astro
│       ├── ovulacion.astro
│       ├── semana-embarazo.astro
│       ├── fecha-parto.astro
│       ├── edad.astro
│       ├── dias-fechas.astro
│       ├── macronutrientes.astro
│       ├── proteinas.astro
│       ├── sueno.astro
│       ├── cintura-cadera.astro
│       ├── calorias-ejercicio.astro
│       ├── alcoholemia.astro
│       ├── presion-arterial.astro
│       ├── vo2-maximo.astro
│       ├── ffmi.astro
│       ├── ciclo-menstrual.astro
│       ├── ritmo-carrera.astro
│       ├── cintura-estatura.astro
│       ├── ayuno-intermitente.astro
│       ├── metabolismo-basal.astro
│       ├── 1rm.astro
│       ├── calorias-caminando.astro
│       ├── deficit-calorico.astro
│       ├── complexion-corporal.astro
│       ├── resistencia-insulina.astro
│       ├── somatotipo.astro
│       ├── riesgo-cardiovascular.astro
│       ├── indice-adiposidad.astro
│       ├── volumen-entrenamiento.astro
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

El logo es una **cruz "+"** SVG con los rectángulos en `fill="#CAFF00"`. Se usa en:
- `public/favicon.svg` — fondo `#0F0E0D`, cruz acid 32×32. Proporciones alineadas al navbar: brazos en y=2/x=2, grosor 6px, largo 28px.
- `Navbar.astro` — cruz SVG 18×18 inline junto al texto "CalcFit"
- `Footer.astro` — cruz SVG 15×15 inline junto al texto "CalcFit"

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

Cada página de calculadora sigue este patrón exacto:

```astro
<CalculatorLayout title="..." description="..." calculatorName="..." breadcrumbSlug="...">
  <!-- Header oscuro con H1 -->
  <div style="background: var(--ink); padding: 40px 32px 32px;">
    <h1>Nombre <span style="color: var(--acid);">Calculadora</span></h1>
    <p>Descripción breve</p>
  </div>

  <!-- Componente React con client:load -->
  <NombreCalculator client:load />

  <!-- Contenido SEO server-rendered (no JavaScript) -->
  <div slot="seo">
    <h2>¿Cómo se calcula?</h2>
    <!-- tabla de referencia, FAQ -->
  </div>
</CalculatorLayout>
```

**Importante:** El slot `seo` es renderizado en el servidor como HTML estático. No va React ahí. Los componentes de calculadora llevan siempre `client:load`.

---

## Lógica de cálculo (src/lib/calculators.ts)

**Principio fundamental:** Ningún componente hace cálculos propios. Toda la matemática vive en `calculators.ts` como funciones puras exportadas.

### Funciones disponibles

```typescript
// Calculadoras originales (14)
calcularIMC(pesoKg, alturaCm)
  → { imc, categoria, rango }
calcularTDEE({ pesoKg, alturaCm, edadAnios, sexo, actividad })
  → { tmb, tdee, deficit, superavit }
calcularPesoIdeal(alturaCm, sexo)
  → { devine, robinson, miller, hamwi, broca, promedio }
calcularGrasaCorporal({ sexo, alturaCm, cuelloCm, cinturaCm, caderaCm? })
  → { porcentaje, categoria }
calcularFCM(edad)
  → { fcm, zonas[] }
calcularAguaDiaria({ pesoKg, actividad, clima })
  → { litros, vasos }
calcularOvulacion({ ultimaMenstruacion, duracionCiclo })
  → { ovulacion, inicioFertil, finFertil, diasFertiles[] }
calcularSemanaEmbarazo(ultimaMenstruacion)
  → { semanas, dias, trimestre, fechaParto }
calcularFechaParto(ultimaMenstruacion)
  → { fechaParto, semanasRestantes }
calcularEdad(fechaNacimiento)
  → { anios, meses, dias, totalDias, proximoCumple }
calcularDiasFechas(fechaInicio, fechaFin)
  → { dias, semanas, meses, anios }
calcularMacronutrientes({ pesoKg, objetivo, actividad })
  → { proteinas, carbohidratos, grasas, calorias }
calcularProteinasDiarias({ pesoKg, nivel })
  → { minimo, optimo }
calcularSueno(horaDespertar)
  → CicloSueno[]  (6 opciones de horario)

// Calculadoras batch 2 (10)
calcularCinturaCadera({ sexo, cinturaCm, caderaCm })
  → { ratio, categoria, riesgo }
calcularCaloriasEjercicio({ pesoKg, duracionMin, actividad })
  → { calorias, met, actividadNombre }
  // también exporta: METS (constante con todos los tipos de actividad y sus MET)
calcularAlcoholemia({ pesoKg, sexo, bebidasCerveza, bebidasVino, bebidasCopa, horasTranscurridas })
  → { bac, estado, aptoConducir, horasHastaCero }
calcularPresionArterial(sistolica, diastolica)
  → { categoria, riesgo, recomendacion, color }
calcularVO2Max(edad, sexo, fcReposo, fcMaxima?)
  → { vo2max, categoria, nivel }
calcularFFMI(pesoKg, alturaCm, grasaPorcentaje)
  → { ffmi, ffmiNormalizado, masaMagraKg, categoria, nivel }
calcularCicloMenstrual(ultimaMenstruacion, duracionCiclo, duracionPeriodo)
  → { proximaMenstruacion, fases, diaActual, faseActual }
calcularRitmoCarrera(distanciaKm, minutosTotal)
  → { ritmoMinPorKm, ritmoMinPorMilla, velocidadKmh, tiempos[] }
calcularCinturaEstatura(cinturaCm, alturaCm)
  → { ratio, categoria, riesgo, recomendacion }
calcularAyunoIntermitente({ protocolo, horaInicioComida })
  → { horaFinComida, horaInicioAyuno, horaFinAyuno, horasAyuno, horasComida, beneficios }

// Calculadoras batch 3 (10 nuevas — 2026-05-16)
calcularMetabolismoBasal(pesoKg, alturaCm, edadAnios, sexo)
  → { mifflin, harris, schofield, promedio, categoria }
calcularUnaRepeticionMaxima(pesoKg, reps)
  → { brzycki, epley, lander, promedio, tabla[] }
  // tabla: [{ porcentaje, peso, reps }] — del 100% al 50%
calcularCaloriasCaminando(pesoKg, duracionMin, velocidad)
  → { calorias, km, pasos, velocidadNombre }
  // también exporta: VELOCIDADES_CAMINATA (constante con 5 velocidades y sus METs)
calcularDeficitCalorico(tdee, pesoActualKg, pesoObjetivoKg, objetivo)
  → { caloriasDiarias, deficitDiario, perdidaSemanal, tiempoSemanas, tiempoMeses, esSeguaro }
  // objetivo: '0.25' | '0.5' | '0.75' | '1.0' (kg por semana)
calcularComplexionCorporal(alturaCm, munecaCm, sexo)
  → { tipo, tipoNombre, indice, descripcion }
  // tipo: 'pequena' | 'mediana' | 'grande'
calcularHOMAIR(glucosaAyunas, insulinaAyunas)
  → { homaIR, categoria, riesgo, descripcion, color }
  // riesgo: 'sensible' | 'normal' | 'limite' | 'resistente'
calcularSomatotipo(pesoKg, alturaCm, munecaCm, sexo)
  → { tipo, tipoNombre, descripcion, puntaje, recomendaciones }
  // tipo: 'ectomorfo' | 'mesomorfo' | 'endomorfo' | 'ecto_meso' | 'endo_meso'
calcularRiesgoCardiovascular({ edad, sexo, sistolica, imc, fumador, diabetes, antecedentes })
  → { riesgo10Anios, categoria, categoriaNombre, color, recomendacion }
  // basado en modelo Framingham sin laboratorio
calcularBAI(alturaCm, caderaCm, sexo)
  → { bai, categoria, riesgo, color }
  // BAI = (cadera / altura^1.5) - 18
calcularVolumenEntrenamiento(nivel, diasPorSemana)
  → { grupos[], totalSetsSemana, recomendacion }
  // nivel: 'principiante' | 'intermedio' | 'avanzado'
  // grupos[]: { nombre, mev, mrv, recomendado } por grupo muscular (10 grupos)
```

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

La homepage muestra las **34 calculadoras** en 4 categorías. Los íconos SVG están definidos como strings en el objeto `I` al inicio del frontmatter y se renderizan con `<Fragment set:html={calc.icon} />`.

Categorías:
1. **Fitness & salud** (19 calculadoras)
2. **Embarazo & fertilidad** (4 calculadoras)
3. **Fechas & tiempo** (3 calculadoras)
4. **Nutrición & bienestar** (8 calculadoras)

Al agregar una calculadora nueva, añadirla al array `calculadoras` con: `{ slug, nombre, desc, badge, icon }` y al map `calcsBySlug` para asignarla a su categoría.

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

## SEO

### Por página
- `Base.astro` genera automáticamente: meta charset/viewport, canonical, OG completo, Twitter Card, JSON-LD (`is:inline` obligatorio en el script)
- `CalculatorLayout.astro` inyecta `MedicalWebContent` schema por defecto en páginas de calculadoras
- Breadcrumb visible en todas las páginas interiores

### JSON-LD schemas usados
- `WebSite` en la homepage
- `MedicalWebContent` en cada calculadora (con `audience: Patient` y `lastReviewed`)

### Sitemap
Generado automáticamente por `@astrojs/sitemap`. Dos archivos en `/dist/`:
- `sitemap-index.xml` — índice principal
- `sitemap-0.xml` — 30 URLs, todas bajo `https://www.calcfit.com`

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

1. Agregar la función de cálculo en `src/lib/calculators.ts` (función pura, cero efectos secundarios)
2. Crear el componente React en `src/components/calculators/NombreCalculator.tsx`
   - Importar la función de `calculators.ts`
   - Usar `Toggle` si tiene peso/altura
   - Usar `useValidation` o validación inline para los inputs
   - Usar `Input`, `Button`, `ResultCard`, `ShareButtons`
   - Respetar terminología LATAM (pies/pulg/ppm — ver tabla arriba)
3. Crear la página en `src/pages/nombre.astro` usando `CalculatorLayout`
4. Agregar al array `calculadoras` en `src/pages/index.astro` con su SVG icon y categoría
5. Ejecutar `npm run build` y verificar que pasa sin errores

---

## Reglas para modificar estilos

- Los estilos van en los atributos `style` inline de cada componente/página (no hay clases CSS globales salvo las de animación `.anim`)
- Para cambiar un color de la paleta: editar `src/styles/tokens.css`
- Las animaciones `.anim .anim-1..6` están en `src/styles/global.css` y se aplican con clases HTML
- Nunca agregar `border-radius` mayor a 2px
- Nunca agregar `box-shadow`
- Nunca agregar gradientes

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

- Generar imágenes OG estáticas en `public/og/` (1200×630px por calculadora) — pendientes 10 nuevas de batch 3
- Deploy en producción (Vercel / Netlify / Cloudflare Pages) — configurar redirect 301 de non-www a www
- Verificar propiedad en Google Search Console y enviar sitemap con URL www
- Agregar `apple-touch-icon` PNG 180×180 para homescreen iOS (actualmente no hay)

## Registro de cambios

| Fecha | Acción |
|---|---|
| 2026-05-16 | Batch 3: +10 calculadoras (metabolismo-basal, 1rm, calorias-caminando, deficit-calorico, complexion-corporal, resistencia-insulina, somatotipo, riesgo-cardiovascular, indice-adiposidad, volumen-entrenamiento). Total: 34. |
