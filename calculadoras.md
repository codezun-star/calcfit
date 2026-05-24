# CalcFit — Registro de Calculadoras

> **Total: 89 calculadoras** | Referencia completa: componentes, páginas, funciones y categorías.
> Ver también: [CLAUDE.md](CLAUDE.md) para arquitectura, diseño y reglas de desarrollo.

---

## Tabla completa

| # | Nombre | Slug / Página | Componente | Función en calculators.ts | Categoría | Batch |
|---|---|---|---|---|---|---|
| 1 | IMC | `/imc` | `IMCCalculator.tsx` | `calcularIMC` | Fitness | 1 |
| 2 | Calorías Diarias | `/calorias-diarias` | `CaloriasCalculator.tsx` | `calcularTDEE` | Fitness | 1 |
| 3 | Peso Ideal | `/peso-ideal` | `PesoIdealCalculator.tsx` | `calcularPesoIdeal` | Fitness | 1 |
| 4 | Grasa Corporal | `/grasa-corporal` | `GrasaCalculator.tsx` | `calcularGrasaCorporal` | Fitness | 1 |
| 5 | Frecuencia Cardíaca | `/frecuencia-cardiaca` | `FCMCalculator.tsx` | `calcularFCM` | Fitness | 1 |
| 6 | Agua Diaria | `/agua-diaria` | `AguaCalculator.tsx` | `calcularAguaDiaria` | Fitness | 1 |
| 7 | Ovulación | `/ovulacion` | `OvulacionCalculator.tsx` | `calcularOvulacion` | Embarazo | 1 |
| 8 | Semana de Embarazo | `/semana-embarazo` | `EmbarazoCalculator.tsx` | `calcularSemanaEmbarazo` | Embarazo | 1 |
| 9 | Fecha de Parto | `/fecha-parto` | `PartoCalculator.tsx` | `calcularFechaParto` | Embarazo | 1 |
| 10 | Calculadora de Edad | `/edad` | `EdadCalculator.tsx` | `calcularEdad` | Fechas | 1 |
| 11 | Días entre Fechas | `/dias-fechas` | `DiasFechasCalculator.tsx` | `calcularDiasFechas` | Fechas | 1 |
| 12 | Macronutrientes | `/macronutrientes` | `MacroCalculator.tsx` | `calcularMacronutrientes` | Nutrición | 1 |
| 13 | Proteínas Diarias | `/proteinas` | `ProteinasCalculator.tsx` | `calcularProteinasDiarias` | Nutrición | 1 |
| 14 | Ciclos de Sueño | `/sueno` | `SuenoCalculator.tsx` | `calcularSueno` | Nutrición | 1 |
| 15 | Cintura-Cadera | `/cintura-cadera` | `CinturaCaderaCalculator.tsx` | `calcularCinturaCadera` | Fitness | 2 |
| 16 | Calorías Ejercicio | `/calorias-ejercicio` | `CaloriasEjercicioCalculator.tsx` | `calcularCaloriasEjercicio` | Fitness | 2 |
| 17 | Alcoholemia | `/alcoholemia` | `AlcoholemiaCalculator.tsx` | `calcularAlcoholemia` | Nutrición | 2 |
| 18 | Presión Arterial | `/presion-arterial` | `PresionArterialCalculator.tsx` | `calcularPresionArterial` | Fitness | 2 |
| 19 | VO2 Máximo | `/vo2-maximo` | `VO2MaxCalculator.tsx` | `calcularVO2Max` | Fitness | 2 |
| 20 | FFMI | `/ffmi` | `FFMICalculator.tsx` | `calcularFFMI` | Fitness | 2 |
| 21 | Ciclo Menstrual | `/ciclo-menstrual` | `CicloMenstrualCalculator.tsx` | `calcularCicloMenstrual` | Embarazo | 2 |
| 22 | Ritmo de Carrera | `/ritmo-carrera` | `RitmoCarreraCalculator.tsx` | `calcularRitmoCarrera` | Fitness | 2 |
| 23 | Cintura-Estatura | `/cintura-estatura` | `CinturaEstaturaCalculator.tsx` | `calcularCinturaEstatura` | Fitness | 2 |
| 24 | Ayuno Intermitente | `/ayuno-intermitente` | `AyunoCalculator.tsx` | `calcularAyunoIntermitente` | Nutrición | 2 |
| 25 | Metabolismo Basal | `/metabolismo-basal` | `MetabolismoBasalCalculator.tsx` | `calcularMetabolismoBasal` | Fitness | 3 |
| 26 | 1 Rep. Máxima | `/1rm` | `UnRepeticionMaximaCalculator.tsx` | `calcularUnaRepeticionMaxima` | Fitness | 3 |
| 27 | Calorías Caminando | `/calorias-caminando` | `CaloriasCaminandoCalculator.tsx` | `calcularCaloriasCaminando` | Fitness | 3 |
| 28 | Déficit Calórico | `/deficit-calorico` | `DeficitCaloricoCalculator.tsx` | `calcularDeficitCalorico` | Nutrición | 3 |
| 29 | Complexión Corporal | `/complexion-corporal` | `ComplexionCorporalCalculator.tsx` | `calcularComplexionCorporal` | Fitness | 3 |
| 30 | Resistencia a Insulina | `/resistencia-insulina` | `ResistenciaInsulinaCalculator.tsx` | `calcularHOMAIR` | Nutrición | 3 |
| 31 | Somatotipo | `/somatotipo` | `SomatotipoCalculator.tsx` | `calcularSomatotipo` | Fitness | 3 |
| 32 | Riesgo Cardiovascular | `/riesgo-cardiovascular` | `RiesgoCardiovascularCalculator.tsx` | `calcularRiesgoCardiovascular` | Fitness | 3 |
| 33 | Índice de Adiposidad | `/indice-adiposidad` | `IndiceAdipositadCalculator.tsx` | `calcularBAI` | Fitness | 3 |
| 34 | Volumen Entrenamiento | `/volumen-entrenamiento` | `VolumenEntrenamientoCalculator.tsx` | `calcularVolumenEntrenamiento` | Fitness | 3 |
| 35 | Glucosa | `/glucosa` | `GlucosaCalculator.tsx` | `calcularGlucosa` | Nutrición | 4 |
| 36 | Colesterol | `/colesterol` | `ColesterolCalculator.tsx` | `calcularColesterol` | Nutrición | 4 |
| 37 | Calorías Ciclismo | `/calorias-ciclismo` | `CaloriasCiclismoCalculator.tsx` | `calcularCaloriasCiclismo` | Fitness | 4 |
| 38 | Fuerza Relativa | `/fuerza-relativa` | `FuerzaRelativaCalculator.tsx` | `calcularFuerzaRelativa` | Fitness | 4 |
| 39 | Masa Muscular | `/masa-muscular` | `MasaMuscularCalculator.tsx` | `calcularMasaMuscular` | Fitness | 4 |
| 40 | Calorías Natación | `/calorias-natacion` | `CaloriasNatacionCalculator.tsx` | `calcularCaloriasNatacion` | Fitness | 5 |
| 41 | Test de Cooper | `/test-cooper` | `TestCooperCalculator.tsx` | `calcularTestCooper` | Fitness | 5 |
| 42 | Recuperación Cardíaca | `/recuperacion-cardiaca` | `RecuperacionCardiacaCalculator.tsx` | `calcularRecuperacionCardiaca` | Fitness | 5 |
| 43 | Temperatura Corporal | `/temperatura-corporal` | `TemperaturaCorporalCalculator.tsx` | `calcularTemperaturaCorporal` | Fitness | 5 |
| 44 | Carga Glucémica | `/carga-glucemica` | `CargaGlucemicaCalculator.tsx` | `calcularCargaGlucemica` | Nutrición | 5 |
| 45 | Peso en Embarazo | `/peso-embarazo` | `PesoEmbarazoCalculator.tsx` | `calcularPesoEmbarazo` | Embarazo | 5 |
| 46 | Presión de Pulso | `/presion-pulso` | `PresionPulsoCalculator.tsx` | `calcularPresionPulso` | Fitness | 5 |
| 47 | Talla Predicha | `/talla-predicha` | `TallaPredichCalculator.tsx` | `calcularTallaPredicha` | Fitness | 5 |
| 48 | Test Rockport | `/test-rockport` | `TestRockportCalculator.tsx` | `calcularTestRockport` | Fitness | 5 |
| 49 | Cafeína | `/cafeina` | `CafeinaCalculator.tsx` | `calcularCafeina` | Nutrición | 5 |
| 50 | VAM | `/vam` | `VAMCalculator.tsx` | `calcularVAM` | Fitness | 6 |
| 51 | Índice de Masa Grasa | `/indice-masa-grasa` | `IndiceMasaGrasaCalculator.tsx` | `calcularFMIConSexo` | Fitness | 6 |
| 52 | Creatina | `/creatina` | `CreatinaCalculator.tsx` | `calcularCreatina` | Nutrición | 6 |
| 53 | Ritmo Maratón | `/ritmo-maraton` | `RitmoMaratonCalculator.tsx` | `calcularRitmoMaraton` | Fitness | 6 |
| 54 | Riesgo Diabetes | `/riesgo-diabetes` | `RiesgoDiabetesCalculator.tsx` | `calcularFINDRISC` | Nutrición | 6 |
| 55 | Índice de Conicidad | `/indice-conicidad` | `IndiceConicidadCalculator.tsx` | `calcularIndiceConicidad` | Fitness | 6 |
| 56 | Calorías Bebidas | `/calorias-bebidas` | `CaloriasBedidasCalculator.tsx` | `calcularCaloriasBebidas` | Nutrición | 6 |
| 57 | Tasa de Sudoración | `/tasa-sudoracion` | `TasaSudoracionCalculator.tsx` | `calcularTasaSudoracion` | Fitness | 6 |
| 58 | Masa Ósea | `/masa-osea` | `MasaOseaCalculator.tsx` | `calcularMasaOsea` | Fitness | 6 |
| 59 | Síndrome Metabólico | `/sindrome-metabolico` | `SindromeMetabolicoCalculator.tsx` | `calcularSindromeMetabolico` | Fitness | 6 |
| 60 | Potencia de Salto | `/potencia-salto` | `PotenciaSaltoCalculator.tsx` | `calcularPotenciaSalto` | Fitness | 7A |
| 61 | Grasa Visceral | `/grasa-visceral` | `GrasaVisceralCalculator.tsx` | `calcularGrasaVisceral` | Fitness | 7A |
| 62 | Oximetría | `/oximetria` | `OximetriaCalculator.tsx` | `calcularOximetria` | Fitness | 7A |
| 63 | Umbral Anaeróbico | `/umbral-anaerobico` | `UmbralAnaerobicoCalculator.tsx` | `calcularUmbralAnaerobico` | Fitness | 7A |
| 64 | Carga de Entrenamiento | `/carga-entrenamiento` | `CargaEntrenamientoCalculator.tsx` | `calcularCargaEntrenamiento` | Fitness | 7A |
| 65 | Escala de Borg | `/escala-borg` | `EscalaBorgCalculator.tsx` | `calcularEscalaBorg` | Fitness | 7A |
| 66 | FC en Reposo | `/fc-reposo` | `FCReposoCalculator.tsx` | `calcularFCReposo` | Fitness | 7A |
| 67 | Actividad Física OMS | `/actividad-fisica` | `ActividadFisicaCalculator.tsx` | `calcularActividadFisicaOMS` | Fitness | 7A |
| 68 | Hidratación Deportiva | `/hidratacion-deportiva` | `HidratacionDeportivaCalculator.tsx` | `calcularHidratacionDeportiva` | Fitness | 7A |
| 69 | Ritmo de Natación | `/ritmo-natacion` | `RitmoNatacionCalculator.tsx` | `calcularRitmoNatacion` | Fitness | 7A |
| 70 | FTP Ciclismo | `/ftp-ciclismo` | `FTPCiclismoCalculator.tsx` | `calcularFTP` | Fitness | 7B |
| 71 | Cadencia de Carrera | `/cadencia-carrera` | `CadenciaCarreraCalculator.tsx` | `calcularCadenciaCarrera` | Fitness | 7B |
| 72 | Predictor de Carrera | `/predictor-carrera` | `PredictorCarreraCalculator.tsx` | `calcularPredictorCarrera` | Fitness | 7B |
| 73 | Recuperación Muscular | `/recuperacion-muscular` | `RecuperacionMuscularCalculator.tsx` | `calcularRecuperacionMuscular` | Fitness | 7B |
| 74 | Vitamina D Solar | `/vitamina-d` | `VitaminaDCalculator.tsx` | `calcularVitaminaDSolar` | Nutrición | 7B |
| 75 | Proteína por Comida | `/proteina-por-comida` | `ProteinaPorComidaCalculator.tsx` | `calcularProteinaPorComida` | Nutrición | 7B |
| 76 | IG de Comida | `/ig-comida` | `IGComidaCalculator.tsx` | `calcularIGComida` | Nutrición | 7B |
| 77 | Ratio Omega | `/omega-ratio` | `OmegaRatioCalculator.tsx` | `calcularOmegaRatio` | Nutrición | 7B |
| 78 | IMC Infantil | `/imc-infantil` | `IMCInfantilCalculator.tsx` | `calcularIMCInfantil` | Embarazo | 7B |
| 79 | Edad Biológica | `/edad-biologica` | `EdadBiologicaCalculator.tsx` | `calcularEdadBiologica` | Fechas | 7B |
| 80 | Cuenta Regresiva | `/cuenta-regresiva` | `CuentaRegresivaCalculator.tsx` | `calcularCuentaRegresiva` | Fechas | 8 |
| 81 | Semanas de Vida | `/semanas-de-vida` | `SemanasDeVidaCalculator.tsx` | `calcularSemanasDeVida` | Fechas | 8 |
| 82 | Mi Generación | `/generacion` | `GeneracionCalculator.tsx` | `calcularGeneracion` | Fechas | 8 |
| 83 | Edad de Jubilación | `/jubilacion` | `JubilacionCalculator.tsx` | `calcularJubilacion` | Fechas | 8 |
| 84 | Edad en Planetas | `/edad-planetas` | `EdadPlanetasCalculator.tsx` | `calcularEdadPlanetas` | Fechas | 8 |
| 85 | Test de Embarazo | `/cuando-test-embarazo` | `CuandoTestEmbarazoCalculator.tsx` | `calcularCuandoTestEmbarazo` | Embarazo | 8 |
| 86 | Peso del Bebé | `/peso-bebe-semana` | `PesoBebeSemanaCalculator.tsx` | `calcularPesoBebeSemanaPorSemana` | Embarazo | 8 |
| 87 | Lactancia Materna | `/lactancia` | `LactanciaCalculator.tsx` | `calcularLactancia` | Embarazo | 8 |
| 88 | Fecha de Concepción | `/fecha-concepcion` | `FechaConcecionCalculator.tsx` | `calcularFechaConcepcion` | Embarazo | 8 |
| 89 | Fibra Diaria | `/fibra-diaria` | `FibraDiariaCalculator.tsx` | `calcularFibraDiaria` | Nutrición | 8 |

---

## Por categoría

### Fitness & salud (51)
`imc` · `calorias-diarias` · `peso-ideal` · `grasa-corporal` · `frecuencia-cardiaca` · `agua-diaria` · `ffmi` · `complexion-corporal` · `somatotipo` · `indice-adiposidad` · `vo2-maximo` · `presion-arterial` · `riesgo-cardiovascular` · `cintura-cadera` · `cintura-estatura` · `1rm` · `volumen-entrenamiento` · `fuerza-relativa` · `masa-muscular` · `calorias-ejercicio` · `calorias-caminando` · `calorias-ciclismo` · `calorias-natacion` · `ritmo-carrera` · `test-cooper` · `test-rockport` · `recuperacion-cardiaca` · `temperatura-corporal` · `presion-pulso` · `talla-predicha` · `vam` · `indice-masa-grasa` · `ritmo-maraton` · `indice-conicidad` · `tasa-sudoracion` · `masa-osea` · `sindrome-metabolico` · `potencia-salto` · `grasa-visceral` · `oximetria` · `umbral-anaerobico` · `carga-entrenamiento` · `escala-borg` · `fc-reposo` · `actividad-fisica` · `hidratacion-deportiva` · `ritmo-natacion` · `ftp-ciclismo` · `cadencia-carrera` · `predictor-carrera` · `recuperacion-muscular`

### Embarazo & fertilidad (10)
`ovulacion` · `ciclo-menstrual` · `semana-embarazo` · `fecha-parto` · `peso-embarazo` · `imc-infantil` · `cuando-test-embarazo` · `peso-bebe-semana` · `lactancia` · `fecha-concepcion`

### Fechas & tiempo (8)
`edad` · `dias-fechas` · `edad-biologica` · `cuenta-regresiva` · `semanas-de-vida` · `generacion` · `jubilacion` · `edad-planetas`

### Nutrición & bienestar (20)
`macronutrientes` · `proteinas` · `metabolismo-basal` · `deficit-calorico` · `resistencia-insulina` · `glucosa` · `colesterol` · `carga-glucemica` · `cafeina` · `sueno` · `ayuno-intermitente` · `alcoholemia` · `creatina` · `calorias-bebidas` · `riesgo-diabetes` · `vitamina-d` · `proteina-por-comida` · `ig-comida` · `omega-ratio` · `fibra-diaria`

---

## Componentes de visualización (no son calculadoras)

| Componente | Uso |
|---|---|
| `GaugeIMC.tsx` | Gauge SVG semicircular animado — usado en IMC |
| `ZonasCardiaca.tsx` | Barras horizontales de zonas cardíacas — usado en FCM |
| `BarrasCaloria.tsx` | Barras verticales déficit/mant/superávit — usado en Calorías |

---

## Próximo número de serie

Al agregar una nueva calculadora, el número siguiente es **#90**.
