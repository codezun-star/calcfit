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
│   │   └── calculators/               ← 39 componentes React
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
│   │       ├── GlucosaCalculator.tsx
│   │       ├── ColesterolCalculator.tsx
│   │       ├── CaloriasCiclismoCalculator.tsx
│   │       ├── FuerzaRelativaCalculator.tsx
│   │       ├── MasaMuscularCalculator.tsx
│   │       ├── GaugeIMC.tsx           ← gauge SVG semicircular animado
│   │       ├── ZonasCardiaca.tsx      ← barras horizontales de zonas cardíacas
│   │       └── BarrasCaloria.tsx      ← barras verticales déficit/mant/superávit
│   ├── lib/
│   │   ├── calculators.ts             ← TODA la lógica de cálculo (funciones puras)
│   │   ├── units.ts                   ← conversiones métrico ↔ imperial
│   │   ├── useValidation.ts           ← hook de validación de campos
│   │   └── useHistory.ts              ← hook de historial en localStorage
│   └── pages/
│       ├── index.astro                ← homepage con las 39 calculadoras
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
│       ├── glucosa.astro
│       ├── colesterol.astro
│       ├── calorias-ciclismo.astro
│       ├── fuerza-relativa.astro
│       ├── masa-muscular.astro
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

// Calculadoras batch 4 (5 nuevas — 2026-05-16)
calcularGlucosa(valor, tipo)
  → { valor, categoria, riesgo, color, recomendacion }
  // tipo: 'ayunas' | 'postprandial' | 'hba1c' — criterios ADA 2024
  // riesgo: 'normal' | 'prediabetes' | 'diabetes'
calcularColesterol(total, hdl, trigliceridos, sexo)
  → { ldl, noHdl, ratioTotal, clasificacion: { total, hdl, ldl, trigliceridos }, riesgo, riesgoNombre, color, recomendacion }
  // Fórmula Friedewald: LDL = Total - HDL - TG/5. Válida con TG < 400 mg/dL
  // clasificacion[].{valor, categoria, color} — NCEP ATP III
calcularCaloriasCiclismo(pesoKg, duracionMin, intensidad)
  → { calorias, km, met, intensidadNombre }
  // intensidad: 'muy_lento' | 'lento' | 'moderado' | 'rapido' | 'muy_rapido'
  // también exporta: INTENSIDADES_CICLISMO (constante con MET por velocidad)
calcularFuerzaRelativa(pesoCorpoalKg, pesoLevantadoKg, ejercicio, sexo)
  → { ratio, nivel, nivelNombre, color, descripcion, estandares[] }
  // ejercicio: 'press_banca' | 'sentadilla' | 'peso_muerto' | 'press_militar'
  // nivel: 'principiante' | 'novato' | 'intermedio' | 'avanzado' | 'elite'
calcularMasaMuscular(pesoKg, alturaCm, edadAnios, sexo)
  → { masaMuscularKg, smi, porcentaje, categoria, nivel, color, descripcion }
  // Fórmula Lee 2000 validada contra DEXA (r=0.94)
  // nivel: 'bajo' | 'normal' | 'alto' — umbrales EWGSOP2
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

Categorías y conteo actual (total: 39):
1. **Fitness & salud** (24 calculadoras) — imc, peso-ideal, grasa-corporal, ffmi, complexion-corporal, somatotipo, indice-adiposidad, frecuencia-cardiaca, vo2-maximo, presion-arterial, riesgo-cardiovascular, cintura-cadera, cintura-estatura, 1rm, volumen-entrenamiento, fuerza-relativa, masa-muscular, calorias-ejercicio, calorias-caminando, calorias-ciclismo, ritmo-carrera, agua-diaria, calorias-diarias
2. **Embarazo & fertilidad** (4 calculadoras) — ovulacion, ciclo-menstrual, semana-embarazo, fecha-parto
3. **Fechas & tiempo** (2 calculadoras) — edad, dias-fechas
4. **Nutrición & bienestar** (10 calculadoras) — macronutrientes, proteinas, metabolismo-basal, deficit-calorico, resistencia-insulina, glucosa, colesterol, sueno, ayuno-intermitente, alcoholemia

Al agregar una calculadora nueva, seguir el checklist completo de la sección "Reglas para agregar una calculadora nueva".

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
  - `num` debe ser el número siguiente (ej. si había 34, el nuevo es '35')
  - `badge`: `'popular'` | `'new'` | `'essential'` | `null`
- Añadir el slug al array correcto en `categorias` (Fitness, Embarazo, Fechas, Nutrición)
- Actualizar el `numberOfItems` en el schema `ItemList` de la homepage (buscar `numberOfItems: 34`)
- Actualizar el title y description de la homepage si el número de calculadoras cambia
  - Title: `"CalcFit — 35 Calculadoras de Salud..."` (actualizar número)
  - Description: `"35 calculadoras de salud..."` (actualizar número)

**5. Footer** (`src/components/layout/Footer.astro`)
- Actualizar el texto del enlace: `"Ver las 34 →"` → `"Ver las 35 →"` (ajustar número)

**6. CLAUDE.md** (este archivo)
- Actualizar el contador en la sección de estructura de carpetas: `← 35 componentes React`
- Añadir la función nueva a la sección "Funciones disponibles" de `calculators.ts`
- Añadir el archivo `.astro` a la lista de páginas
- Actualizar las categorías de la homepage si el conteo cambió
- Añadir entrada al Registro de cambios

**7. Verificación final**
- Ejecutar `npm run build` — debe completar sin errores
- El número de páginas en el build debe coincidir (40 base + 1 por nueva calculadora)

---

### Resumen rápido (puntos de sincronización al agregar calculadora)

| Archivo | Qué actualizar |
|---|---|
| `src/lib/calculators.ts` | Nueva función pura |
| `src/components/calculators/NombreCalculator.tsx` | Nuevo componente |
| `src/pages/slug.astro` | Nueva página con SEO completo |
| `src/pages/index.astro` | Ícono en `I`, entrada en `calculadoras`, slug en `categorias`, `numberOfItems`, title, description |
| `src/components/layout/Footer.astro` | Número en "Ver las N →" |
| `CLAUDE.md` | Función, archivos, contadores, registro de cambios |

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
| 2026-05-16 | Batch 4: +5 calculadoras (glucosa, colesterol, calorias-ciclismo, fuerza-relativa, masa-muscular). Total: 39. |
| 2026-05-16 | Batch 3: +10 calculadoras (metabolismo-basal, 1rm, calorias-caminando, deficit-calorico, complexion-corporal, resistencia-insulina, somatotipo, riesgo-cardiovascular, indice-adiposidad, volumen-entrenamiento). Total: 34. |
| 2026-05-16 | SEO agresivo: Base.astro con Organization schema + SearchAction. CalculatorLayout.astro con props `keywords`, `faqs`, `dateModified` y generación automática de FAQPage + BreadcrumbList en @graph. Todas las 34 páginas actualizadas con titles/descriptions optimizados, keywords meta y FAQs en JSON-LD. Footer corregido a "Ver las 34". Homepage con ItemList schema y título actualizado. |
