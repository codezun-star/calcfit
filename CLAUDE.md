# CalcFit — Contexto del Proyecto

## Qué es este proyecto

CalcFit (calcfit.com) es un sitio de calculadoras de salud gratuitas, validadas científicamente, sin registro ni cookies de rastreo. Todo el cálculo ocurre en el navegador del usuario — no hay backend.

Este es el proyecto **Astro** (migración desde Next.js). El proyecto Next.js original vive en `c:\Users\Jose\calculadora-imc-js` y se mantiene como respaldo sin modificaciones.

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
**Sin librerías de íconos** — solo SVG inline simples.
**Sin librerías de gráficos** — solo SVG/CSS puro.

---

## Estructura de carpetas

```
calcfit-astro/
├── public/
│   ├── favicon.svg
│   ├── favicon.ico
│   ├── robots.txt
│   └── og/                        ← imágenes OG estáticas (por generar)
├── src/
│   ├── styles/
│   │   ├── tokens.css             ← variables CSS (colores, tipografías)
│   │   └── global.css             ← reset + animaciones base
│   ├── layouts/
│   │   ├── Base.astro             ← HTML base con meta tags y JSON-LD
│   │   └── CalculatorLayout.astro ← layout de cada calculadora (navbar + breadcrumb + slots)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.astro
│   │   │   └── Footer.astro
│   │   ├── ui/                    ← componentes React reutilizables
│   │   │   ├── Toggle.tsx         ← métrico / imperial
│   │   │   ├── Input.tsx          ← input con label, sufijo y error inline
│   │   │   ├── Button.tsx         ← variantes: primary | ghost | dark
│   │   │   ├── ResultCard.tsx     ← card de resultado (valor grande en acid)
│   │   │   ├── HistoryTable.tsx   ← historial desde localStorage
│   │   │   ├── ShareButtons.tsx   ← WhatsApp, X/Twitter, Copiar enlace
│   │   │   └── Badge.tsx          ← popular | new | essential
│   │   └── calculators/           ← componentes React por calculadora
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
│   │       ├── GaugeIMC.tsx       ← gauge SVG semicircular animado
│   │       ├── ZonasCardiaca.tsx  ← barras horizontales de zonas cardíacas
│   │       └── BarrasCaloria.tsx  ← barras verticales déficit/mant/superávit
│   ├── lib/
│   │   ├── calculators.ts         ← TODA la lógica de cálculo (funciones puras)
│   │   ├── units.ts               ← conversiones métrico ↔ imperial
│   │   ├── useValidation.ts       ← hook de validación de campos
│   │   └── useHistory.ts          ← hook de historial en localStorage
│   └── pages/
│       ├── index.astro            ← homepage
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
│       └── sueno.astro
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
calcularIMC(pesoKg, alturaCm)              → { imc, categoria, rango }
calcularTDEE({ pesoKg, alturaCm, edadAnios, sexo, actividad })
                                            → { tmb, tdee, deficit, superavit }
calcularPesoIdeal(alturaCm, sexo)          → { devine, robinson, miller, hamwi, broca, promedio }
calcularGrasaCorporal({ sexo, alturaCm, cuelloCm, cinturaCm, caderaCm? })
                                            → { porcentaje, categoria }
calcularFCM(edad)                          → { fcm, zonas[] }
calcularAguaDiaria({ pesoKg, actividad, clima })
                                            → { litros, vasos }
calcularOvulacion({ ultimaMenstruacion, duracionCiclo })
                                            → { ovulacion, inicioFertil, finFertil, diasFertiles[] }
calcularSemanaEmbarazo(ultimaMenstruacion) → { semanas, dias, trimestre, fechaParto }
calcularFechaParto(ultimaMenstruacion)     → { fechaParto, semanasRestantes }
calcularEdad(fechaNacimiento)              → { anios, meses, dias, totalDias, proximoCumple }
calcularDiasFechas(fechaInicio, fechaFin)  → { dias, semanas, meses, anios }
calcularMacronutrientes({ pesoKg, objetivo, actividad })
                                            → { proteinas, carbohidratos, grasas, calorias }
calcularProteinasDiarias({ pesoKg, nivel }) → { minimo, optimo }
calcularSueno(horaDespertar)              → CicloSueno[]  (6 opciones de horario)
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
Cambia entre sistema métrico e imperial. Siempre el primer elemento de los formularios con peso o altura.
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
- **ZonasCardiaca** — barras horizontales CSS con 5 zonas coloreadas. Props: `fcm, zonas[]`
- **BarrasCaloria** — 3 barras verticales (déficit / mantenimiento / superávit). La de mantenimiento en acid. Props: `tdee: number`

---

## SEO

### Por página
- `Base.astro` genera automáticamente: meta charset/viewport, canonical, OG completo, Twitter Card, JSON-LD
- `CalculatorLayout.astro` inyecta `MedicalWebContent` schema por defecto en páginas de calculadoras
- Breadcrumb visible en todas las páginas interiores

### JSON-LD schemas usados
- `WebSite` en la homepage
- `MedicalWebContent` en cada calculadora (con `audience: Patient` y `lastReviewed`)

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
3. Crear la página en `src/pages/nombre.astro` usando `CalculatorLayout`
4. Agregar la calculadora al array en `src/pages/index.astro` (con slug, nombre, desc, badge, icon)
5. Ejecutar `npm run build` y verificar que pasa sin errores

---

## Reglas para modificar estilos

- Los estilos van en los atributos `style` inline de cada componente/página (no hay clases CSS globales salvo las de animación `.anim`)
- Para cambiar un color de la paleta: editar `src/styles/tokens.css`
- Las animaciones `.anim .anim-1..6` están en `src/styles/global.css` y se aplican con clases HTML
- Nunca agregar `border-radius` mayor a 2px
- Nunca agregar `box-shadow`
- Nunca agregar gradientes

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

- Generar imágenes OG estáticas en `public/og/` (1200×630px por calculadora)
- Páginas estáticas: `/sobre-nosotros`, `/contacto`, `/aviso-legal`, `/politica-privacidad`
- Favicon personalizado (actualmente usa el SVG de Astro por defecto)
- Google Analytics o sistema de métricas (actualmente ninguno)
