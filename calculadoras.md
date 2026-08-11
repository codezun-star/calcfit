# CalcFit — Registro de Calculadoras

> Índice general. El detalle de cada categoría está en su archivo propio.
> **Total: 143 calculadoras** (la fuente autoritativa del inventario es `src/lib/calcData.ts`;
> las listas rápidas de slugs de este archivo quedan pendientes de sincronización completa).
> Ver también: [CLAUDE.md](CLAUDE.md)

## Archivos de detalle

| Categoría | Archivo | Calculadoras |
|---|---|---|
| Fitness & salud | [CALCULADORAS-FITNESS.md](CALCULADORAS-FITNESS.md) | 63 |
| Nutrición & bienestar | [CALCULADORAS-NUTRICION.md](CALCULADORAS-NUTRICION.md) | 32 |
| Embarazo & fertilidad | [CALCULADORAS-EMBARAZO.md](CALCULADORAS-EMBARAZO.md) | 29 |
| Fechas & tiempo | [CALCULADORAS-FECHAS.md](CALCULADORAS-FECHAS.md) | 19 |

---

## Slugs rápidos por categoría

### Fitness & salud (51)
`imc` · `calorias-diarias` · `peso-ideal` · `grasa-corporal` · `frecuencia-cardiaca` · `agua-diaria` · `ffmi` · `complexion-corporal` · `somatotipo` · `indice-adiposidad` · `vo2-maximo` · `presion-arterial` · `riesgo-cardiovascular` · `cintura-cadera` · `cintura-estatura` · `1rm` · `volumen-entrenamiento` · `fuerza-relativa` · `masa-muscular` · `calorias-ejercicio` · `calorias-caminando` · `calorias-ciclismo` · `calorias-natacion` · `ritmo-carrera` · `test-cooper` · `test-rockport` · `recuperacion-cardiaca` · `temperatura-corporal` · `presion-pulso` · `talla-predicha` · `vam` · `indice-masa-grasa` · `ritmo-maraton` · `indice-conicidad` · `tasa-sudoracion` · `masa-osea` · `sindrome-metabolico` · `potencia-salto` · `grasa-visceral` · `oximetria` · `umbral-anaerobico` · `carga-entrenamiento` · `escala-borg` · `fc-reposo` · `actividad-fisica` · `hidratacion-deportiva` · `ritmo-natacion` · `ftp-ciclismo` · `cadencia-carrera` · `predictor-carrera` · `recuperacion-muscular` · `test-flexiones`

### Embarazo & fertilidad (20)
`ovulacion` · `ciclo-menstrual` · `semana-embarazo` · `fecha-parto` · `peso-embarazo` · `imc-infantil` · `cuando-test-embarazo` · `peso-bebe-semana` · `lactancia` · `fecha-concepcion` · `ventana-fertil` · `edad-gestacional` · `trimestre-embarazo` · `aumento-peso-embarazo` · `kick-counter` · `test-ovulacion` · `beta-hcg` · `probabilidad-embarazo` · `tiempo-postparto` · `compatibilidad-lactancia`

### Fechas & tiempo (8)
`edad` · `dias-fechas` · `edad-biologica` · `cuenta-regresiva` · `semanas-de-vida` · `generacion` · `jubilacion` · `edad-planetas`

### Nutrición & bienestar (20)
`macronutrientes` · `proteinas` · `metabolismo-basal` · `deficit-calorico` · `resistencia-insulina` · `glucosa` · `colesterol` · `carga-glucemica` · `cafeina` · `sueno` · `ayuno-intermitente` · `alcoholemia` · `creatina` · `calorias-bebidas` · `riesgo-diabetes` · `vitamina-d` · `proteina-por-comida` · `ig-comida` · `omega-ratio` · `fibra-diaria` · `calorias-receta`

---

## Componentes de visualización

| Componente | Uso |
|---|---|
| `GaugeIMC.tsx` | Gauge SVG semicircular animado — usado en IMC |
| `ZonasCardiaca.tsx` | Barras horizontales de zonas cardíacas — usado en FCM |
| `BarrasCaloria.tsx` | Barras verticales déficit/mant/superávit — usado en Calorías |

---

## Próximo número de serie

Al agregar una nueva calculadora, el número siguiente es **#100**.
