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
│   │   └── calculators/               ← 79 componentes React
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
│   │       ├── CaloriasNatacionCalculator.tsx
│   │       ├── TestCooperCalculator.tsx
│   │       ├── RecuperacionCardiacaCalculator.tsx
│   │       ├── TemperaturaCorporalCalculator.tsx
│   │       ├── CargaGlucemicaCalculator.tsx
│   │       ├── PesoEmbarazoCalculator.tsx
│   │       ├── PresionPulsoCalculator.tsx
│   │       ├── TallaPredichCalculator.tsx
│   │       ├── TestRockportCalculator.tsx
│   │       ├── CafeinaCalculator.tsx
│   │       ├── VAMCalculator.tsx
│   │       ├── IndiceMasaGrasaCalculator.tsx
│   │       ├── CreatinaCalculator.tsx
│   │       ├── RitmoMaratonCalculator.tsx
│   │       ├── RiesgoDiabetesCalculator.tsx
│   │       ├── IndiceConicidadCalculator.tsx
│   │       ├── CaloriasBedidasCalculator.tsx
│   │       ├── TasaSudoracionCalculator.tsx
│   │       ├── MasaOseaCalculator.tsx
│   │       ├── SindromeMetabolicoCalculator.tsx
│   │       ├── PotenciaSaltoCalculator.tsx
│   │       ├── GrasaVisceralCalculator.tsx
│   │       ├── OximetriaCalculator.tsx
│   │       ├── UmbralAnaerobicoCalculator.tsx
│   │       ├── CargaEntrenamientoCalculator.tsx
│   │       ├── EscalaBorgCalculator.tsx
│   │       ├── FCReposoCalculator.tsx
│   │       ├── ActividadFisicaCalculator.tsx
│   │       ├── HidratacionDeportivaCalculator.tsx
│   │       ├── RitmoNatacionCalculator.tsx
│   │       ├── FTPCiclismoCalculator.tsx
│   │       ├── CadenciaCarreraCalculator.tsx
│   │       ├── PredictorCarreraCalculator.tsx
│   │       ├── RecuperacionMuscularCalculator.tsx
│   │       ├── VitaminaDCalculator.tsx
│   │       ├── ProteinaPorComidaCalculator.tsx
│   │       ├── IGComidaCalculator.tsx
│   │       ├── OmegaRatioCalculator.tsx
│   │       ├── IMCInfantilCalculator.tsx
│   │       ├── EdadBiologicaCalculator.tsx
│   │       ├── GaugeIMC.tsx           ← gauge SVG semicircular animado
│   │       ├── ZonasCardiaca.tsx      ← barras horizontales de zonas cardíacas
│   │       └── BarrasCaloria.tsx      ← barras verticales déficit/mant/superávit
│   ├── lib/
│   │   ├── calculators.ts             ← TODA la lógica de cálculo (funciones puras)
│   │   ├── units.ts                   ← conversiones métrico ↔ imperial
│   │   ├── useValidation.ts           ← hook de validación de campos
│   │   └── useHistory.ts              ← hook de historial en localStorage
│   └── pages/
│       ├── index.astro                ← homepage con las 79 calculadoras
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
│       ├── calorias-natacion.astro
│       ├── test-cooper.astro
│       ├── recuperacion-cardiaca.astro
│       ├── temperatura-corporal.astro
│       ├── carga-glucemica.astro
│       ├── peso-embarazo.astro
│       ├── presion-pulso.astro
│       ├── talla-predicha.astro
│       ├── test-rockport.astro
│       ├── cafeina.astro
│       ├── vam.astro
│       ├── indice-masa-grasa.astro
│       ├── creatina.astro
│       ├── ritmo-maraton.astro
│       ├── riesgo-diabetes.astro
│       ├── indice-conicidad.astro
│       ├── calorias-bebidas.astro
│       ├── tasa-sudoracion.astro
│       ├── masa-osea.astro
│       ├── sindrome-metabolico.astro
│       ├── potencia-salto.astro
│       ├── grasa-visceral.astro
│       ├── oximetria.astro
│       ├── umbral-anaerobico.astro
│       ├── carga-entrenamiento.astro
│       ├── escala-borg.astro
│       ├── fc-reposo.astro
│       ├── actividad-fisica.astro
│       ├── hidratacion-deportiva.astro
│       ├── ritmo-natacion.astro
│       ├── ftp-ciclismo.astro
│       ├── cadencia-carrera.astro
│       ├── predictor-carrera.astro
│       ├── recuperacion-muscular.astro
│       ├── vitamina-d.astro
│       ├── proteina-por-comida.astro
│       ├── ig-comida.astro
│       ├── omega-ratio.astro
│       ├── imc-infantil.astro
│       ├── edad-biologica.astro
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

// Calculadoras batch 5 (10 nuevas — 2026-05-18)
export const ESTILOS_NATACION: Record<EstiloNatacion, {met, nombre}>
calcularCaloriasNatacion(pesoKg, duracionMin, estilo)
  → { calorias, met, estiloNombre }
  // estilo: 'recreacional' | 'crawl_lento' | 'crawl_rapido' | 'pecho' | 'espalda' | 'mariposa'
calcularTestCooper(distanciaMetros, sexo, edad)
  → { vo2max, categoria, color }
  // Fórmula Cooper 1968: VO₂ = (distancia − 504.9) / 44.73
calcularRecuperacionCardiaca(fcPico, fc1Min)
  → { diferencia, categoria, riesgo, color, recomendacion }
  // riesgo: 'excelente' | 'normal' | 'bajo' | 'anormal' — Cole et al. NEJM 1999
calcularTemperaturaCorporal(valor, unidad)
  → { valorC, valorF, categoria, riesgo, color, recomendacion }
  // unidad: 'c' | 'f' — riesgo: 'hipotermia_grave'...'hiperpirexia'
calcularCargaGlucemica(indiceGlucemico, carbohidratosG)
  → { cargaGlucemica, categoria, categoriaNombre, color, recomendacion }
  // baja < 10, media 10–19, alta ≥ 20
calcularPesoEmbarazo(pesoPreKg, alturaCm, semanaActual, pesoActualKg?)
  → { imc, categoriaImc, gananciaTotalMin, gananciaTotalMax, gananciaSemanaMin, gananciaSemanaMax, gananciaAcumuladaMin, gananciaAcumuladaMax, dentroRango }
  // Guías IOM 2009 por IMC pre-gestacional
calcularPresionPulso(sistolica, diastolica)
  → { pp, categoria, riesgo, color, recomendacion }
  // riesgo: 'muy_baja' | 'baja' | 'normal' | 'elevada' | 'muy_elevada'
calcularTallaPredicha(tallaPadreCm, tallaMadreCm, sexo)
  → { tallaPredichaCm, rangoMinCm, rangoMaxCm, tallaPredichaPies, tallaPredichaPulg }
  // Fórmula mid-parental height (Tanner) — rango ±8.5 cm (95% CI)
calcularTestRockport(tiempoMin, fcFinal, pesoKg, edadAnios, sexo)
  → { vo2max, categoria, color }
  // Fórmula Kline 1987 — r = 0.88 validación
calcularCafeina(pesoKg, consumoMg)
  → { dosisPorKg, nivelConsumo, nivelNombre, color, recomendacion, equivalencias[], maxDiario }
  // nivelConsumo: 'bajo' | 'moderado' | 'alto' | 'excesivo' — FDA/EFSA/ISSN

// Calculadoras batch 6 (10 nuevas — 2026-05-20)
calcularVAM(vo2max)
  → { vam, zonas[] }
  // vam (km/h) = vo2max / 3.5
  // zonas[]: { nombre, porcentajeMin, porcentajeMax, descripcion } — 5 zonas (Recuperación 60% a Supramáximo >100%)

calcularFMIConSexo(pesoKg, alturaCm, grasaPorcentaje, sexo)
  → { masaGrasaKg, fmi, categoria, riesgo, color, descripcion }
  // FMI = masaGrasaKg / altura_m²
  // Hombres: <3 muy bajo, 3-6 atlético, 6-12 saludable, 12-18 sobrepeso, >18 obesidad
  // Mujeres: <8 muy bajo, 8-13 atlético, 13-20 saludable, 20-28 sobrepeso, >28 obesidad

calcularCreatina(pesoKg, protocolo)
  → { faseCarga, mantenimiento, diasSaturacion, pesoCreatinaTotal, recomendacion }
  // protocolo: 'carga' | 'directo'
  // Carga: 0.3 g/kg/día × 5 días (4 tomas), saturación 5-7 días
  // Directo: 5 g/día, saturación ~28 días

calcularRitmoMaraton(horasObj, minutosObj, segundosObj)
  → { ritmoSegKm, ritmoStr, ritmoMinMilla, velocidadKmh, splits[], tiempoMediaMaraton, tiempoTotal }
  // splits[]: { km, tiempoAcumulado, ritmo } — puntos: 5, 10, 15, 20, 21.1, 25, 30, 35, 40, 42.195

calcularFINDRISC(resp, sexo)
  → { puntuacion, categoria, probabilidad, color, riesgo, recomendacion }
  // resp: RespuestasFINDRISC (8 preguntas)
  // Score 0-7 bajo (1%), 8-11 ligeramente elevado (4%), 12-14 moderado (17%), 15-20 alto (33%), >20 muy alto (50%)

calcularIndiceConicidad(cinturaCm, pesoKg, alturaCm, sexo)
  → { ic, categoria, riesgo, color, recomendacion }
  // IC = cinturaCm / (0.109 × √(pesoKg / altura_m)) — Valdez 1991
  // Hombres: <1.25 bajo, 1.25-1.35 moderado, >1.35 alto
  // Mujeres: <1.18 bajo, 1.18-1.28 moderado, >1.28 alto

calcularCaloriasBebidas(cervezas, vinos, licores, cocktails)
  → { totalKcal, totalAlcoholG, desglose[], equivalencias[] }
  // Cerveza 330ml 5%: 153 kcal / Vino 150ml 12%: 123 kcal / Licor 40ml 40%: 95 kcal / Cocktail 200ml 10%: 142 kcal
  // equivalencias: caminar, correr, ciclismo (en minutos)

calcularTasaSudoracion(pesoAntesKg, pesoDespuesKg, fluidosLitros, duracionMin)
  → { tasaMLhora, perdidaPorcentaje, recomendacionMLhora, estado, color, recomendacion }
  // sweatRate = ((pesoAntes − pesDespues)×1000 + fluidos×1000) / (duracion/60) — fórmula ACSM

calcularMasaOsea(pesoKg, alturaCm, sexo)
  → { masaOseaKg, porcentajeCorporal, categoria, color, descripcion }
  // Fórmula Kim 2002 — validada contra DEXA (r=0.84)
  // Hombres: boneKg = −5.765 + 0.0685×h + 0.0513×p
  // Mujeres:  boneKg = −3.651 + 0.0426×h + 0.0432×p

calcularSindromeMetabolico(cinturaCm, sexo, trigliceridos, hdl, sistolica, diastolica, glucosaAyunas, medicacionTA, medicacionGlucosa)
  → { criteriosCumplidos, tiene, criterios[], riesgo, color, recomendacion }
  // Criterios IDF 2006 LATAM: cintura hombre >90cm (obligatorio), mujer >80cm (obligatorio)
  // + ≥2 de: TG≥150, HDL<40/50, PA≥130/85, Glucosa≥100 (o medicación)

// Calculadoras batch 7A (10 nuevas — fitness avanzado — 2026-05-20)
calcularPotenciaSalto(pesoKg, alturasCm, sexo)
  → { potenciaPicoW, potenciaMediaW, wattsPerKg, nivel, nivelNombre, color, descripcion }
  // Fórmula Sayers 1999: P_pico = 60.7×h + 45.3×p − 2055

calcularGrasaVisceral(cinturaCm, caderaCm, alturaCm, edadAnios, sexo)
  → { nivelEstimado, categoria, color, riesgo, recomendacion }
  // Estimación basada en WHtR + ajuste por edad y sexo. Escala 1–20 (Tanita)

calcularOximetria(spo2, altitudM)
  → { categoria, color, riesgo, recomendacion, spo2AjustadoAltitud }
  // riesgo: 'bajo' | 'leve' | 'moderado' | 'grave' — ajuste automático por altitud >2500 m

calcularUmbralAnaerobico(edadAnios, fcReposo, fcMax?)
  → { fcUmbral, fcUmbralMin, fcUmbralMax, porcentajeFCmax, fcMaxUsada, zonaDescripcion, recomendacion }
  // Karvonen al 87%: fcUmbral = fcReposo + 0.87 × (fcMax − fcReposo)

calcularCargaEntrenamiento(sesiones: SesionRPE[])
  → { cargaSemanalUA, promedioDiario, monotonia, strain, categoria, color, recomendacion }
  // SesionRPE: { rpe, duracionMin } — UA = RPE × duracion — monotonia = media/SD

calcularEscalaBorg(rpe, escala: 'borg6_20' | 'cr10')
  → { descripcion, porcentajeFCmax, intensidad, zonaEntrenamiento, color, recomendacion }
  // CR10 se convierte a Borg 6–20: borgValue = rpe × 1.5 + 6

calcularFCReposo(fcReposo, edadAnios, sexo)
  → { categoria, nivelFitness, color, fcMaxEstimada, reservaCardiaca, descripcion }
  // Tablas por sexo: Atleta/Élite < 49 ppm (H) / < 53 ppm (M) hasta Pobre

calcularActividadFisicaOMS(minutosModera, minutosVigoroso, diasFuerza)
  → { metMinSemana, nivelOMS, nivelNombre, color, cumpleRecomendacion, equivalenteModera, recomendacion }
  // OMS 2020: ≥600 MET·min/sem aeróbico + ≥2 días fuerza = suficiente; ≥1200 = óptimo

calcularHidratacionDeportiva(pesoKg, duracionMin, intensidad, temperatura)
  → { aguaPreEjercicioMl, aguaDuranteML_15min, aguaPostEjercicioMl, totalMl, electrolitosNecesarios, recomendacion }
  // intensidad: 'baja' | 'moderada' | 'alta' | 'muy_alta' — temperatura: 'fresco' | 'templado' | 'calido' | 'muy_calido'

calcularRitmoNatacion(distanciaM, tiempoMin, tiempoSeg, largo: 25 | 50)
  → { ritmoPor100m, ritmoPor50m, velocidadMps, velocidadKmh, largosPorMinuto, categoria, color }
  // categorias: Élite (<60s/100m), Competitivo, Fitness/Avanzado, Principiante, Muy principiante

// Calculadoras batch 7B (10 nuevas — mixto — 2026-05-20)
calcularFTP(potenciaW, protocolo: ProtocoloFTP, pesoKg)
  → { ftpW, wPerKg, nivel, nivelNombre, color, zonas[] }
  // protocolo: 'test20min' (×0.95) | 'test8min' (×0.90) | 'rampa' (×0.75)
  // zonas[]: { nombre, minW, maxW, descripcion } — Z1 a Z6 (Coggan)

calcularCadenciaCarrera(pasosPorMinuto, velocidadKmh?)
  → { cadencia, categoria, color, longitudZancadaCm, eficiencia, recomendacion }
  // Óptima: 180–185 ppm (Jack Daniels). longitudZancadaCm solo si se pasa velocidad

calcularPredictorCarrera(tiempoMin, tiempoSeg, distanciaKm1, distanciaKm2)
  → { tiempoPredichoStr, tiempoPredichoSeg, ritmoPredichoStr, velocidadKmh, formula }
  // Fórmula de Riegel: t2 = t1 × (d2/d1)^1.06

calcularVitaminaDSolar(tipoPiel: 1–6, latitud, estacion, superficie)
  → { minutosNecesarios, vitaminaDUI, recomendacion, advertencia }
  // tipoPiel 1 (muy clara) a 6 (muy oscura) — advertencia en invierno+frío (síntesis imposible)

calcularProteinaPorComida(pesoKg, objetivo, comidasDia)
  → { totalDiarioG, porComidaG, maximoAbsorcionG, distribucion[], recomendacion }
  // objetivo: 'mantenimiento' (1.6g) | 'hipertrofia' (2.0g) | 'perdida_grasa' (2.4g) por kg
  // maximoAbsorcionG = 0.4 g/kg por toma

calcularIGComida(alimentos: AlimentoIG[])
  → { igPonderado, cargaGlucemica, categoria, color, recomendacion }
  // AlimentoIG: { nombre, ig, carbsG } — IG ponderado + CG total de la comida completa

calcularOmegaRatio(omega3G, omega6G)
  → { ratio, categoriaRatio, color, recomendacion, omega3Recomendado, deficit }
  // Ratio omega-6/omega-3. Óptimo ≤4:1; típico dieta occidental 15–20:1

calcularRecuperacionMuscular(grupoMuscular, volumenSeries, intensidad, nivelExperiencia)
  → { horasRecuperacion, diasRecuperacion, estrategias[], senalesPorRecuperar[], recomendacion }
  // intensidad: 'ligero' | 'moderado' | 'intenso' | 'muy_intenso'

calcularIMCInfantil(pesoKg, alturaCm, edadMeses, sexo: 'nino' | 'nina')
  → { imc, percentil, categoria, color, zScore, recomendacion }
  // Tablas OMS Growth Reference 5–19 años — percentiles 5, 85, 95 por edad y sexo

calcularEdadBiologica(edadCronologica, respuestas: RespuestasEdadBiologica)
  → { edadBiologica, diferencia, categoria, color, factoresPositivos[], factoresNegativos[], recomendacion }
  // 8 factores (actividad, tabaco, alcohol, sueño, estrés, dieta, IMC, chequeos)
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

La homepage muestra las **79 calculadoras** en 4 categorías. Los íconos SVG están definidos como strings en el objeto `I` al inicio del frontmatter y se renderizan con `<Fragment set:html={calc.icon} />`.

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

Categorías y conteo actual (total: 79):
1. **Fitness & salud** (51 calculadoras) — imc, peso-ideal, grasa-corporal, ffmi, complexion-corporal, somatotipo, indice-adiposidad, frecuencia-cardiaca, vo2-maximo, presion-arterial, riesgo-cardiovascular, cintura-cadera, cintura-estatura, 1rm, volumen-entrenamiento, fuerza-relativa, masa-muscular, calorias-ejercicio, calorias-caminando, calorias-ciclismo, calorias-natacion, ritmo-carrera, agua-diaria, calorias-diarias, test-cooper, test-rockport, recuperacion-cardiaca, temperatura-corporal, presion-pulso, talla-predicha, vam, indice-masa-grasa, ritmo-maraton, indice-conicidad, tasa-sudoracion, masa-osea, sindrome-metabolico, potencia-salto, grasa-visceral, oximetria, umbral-anaerobico, carga-entrenamiento, escala-borg, fc-reposo, actividad-fisica, hidratacion-deportiva, ritmo-natacion, ftp-ciclismo, cadencia-carrera, predictor-carrera, recuperacion-muscular
2. **Embarazo & fertilidad** (6 calculadoras) — ovulacion, ciclo-menstrual, semana-embarazo, fecha-parto, peso-embarazo, imc-infantil
3. **Fechas & tiempo** (3 calculadoras) — edad, dias-fechas, edad-biologica
4. **Nutrición & bienestar** (19 calculadoras) — macronutrientes, proteinas, metabolismo-basal, deficit-calorico, resistencia-insulina, glucosa, colesterol, carga-glucemica, cafeina, sueno, ayuno-intermitente, alcoholemia, creatina, calorias-bebidas, riesgo-diabetes, vitamina-d, proteina-por-comida, ig-comida, omega-ratio

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
- El número de páginas en el build debe coincidir (actualmente 85: 79 calculadoras + 1 homepage + 5 estáticas)

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

- Generar imágenes OG estáticas en `public/og/` (1200×630px por calculadora) — pendientes todas las de batch 3 al 7
- Deploy en producción (Vercel / Netlify / Cloudflare Pages) — configurar redirect 301 de non-www a www
- Verificar propiedad en Google Search Console y enviar sitemap con URL www
- Agregar `apple-touch-icon` PNG 180×180 para homescreen iOS (actualmente no hay)

## Registro de cambios

| Fecha | Acción |
|---|---|
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
