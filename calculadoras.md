# CalcFit — Inventario de calculadoras

> **18 calculadoras.** La fuente autoritativa del inventario es `src/lib/calcData.ts`.
> Ver también: [CLAUDE.md](CLAUDE.md)

El sitio se redujo de 143 a 18 calculadoras el 10-08-2026 para concentrar la
autoridad temática en fitness, composición corporal y gasto calórico. El criterio y
los datos que lo respaldan están en el registro de cambios de CLAUDE.md.

## Tabla completa

| # | Nombre | Slug | Componente | Función en `calculators.ts` | Categoría |
|---|---|---|---|---|---|
| 1 | Calculadora IMC | `/imc` | `IMCCalculator.tsx` | `calcularIMC` | Fitness & composición corporal |
| 2 | Calorías Diarias | `/calorias-diarias` | `CaloriasCalculator.tsx` | `calcularTDEE` | Calorías & nutrición |
| 3 | Peso Ideal | `/peso-ideal` | `PesoIdealCalculator.tsx` | `calcularPesoIdeal` | Fitness & composición corporal |
| 4 | Grasa Corporal | `/grasa-corporal` | `GrasaCalculator.tsx` | `calcularGrasaCorporal` | Fitness & composición corporal |
| 5 | FFMI | `/ffmi` | `FFMICalculator.tsx` | `calcularFFMI` | Fitness & composición corporal |
| 6 | Macronutrientes | `/macronutrientes` | `MacroCalculator.tsx` | `calcularMacronutrientes` | Calorías & nutrición |
| 7 | Proteínas Diarias | `/proteinas` | `ProteinasCalculator.tsx` | `calcularProteinasDiarias` | Calorías & nutrición |
| 8 | Metabolismo Basal | `/metabolismo-basal` | `MetabolismoBasalCalculator.tsx` | `calcularMetabolismoBasal` | Calorías & nutrición |
| 9 | 1RM — Una Rep. Máxima | `/1rm` | `UnRepeticionMaximaCalculator.tsx` | `calcularUnaRepeticionMaxima` | Fitness & composición corporal |
| 10 | Calorías Caminando | `/calorias-caminando` | `CaloriasCaminandoCalculator.tsx` | `calcularCaloriasCaminando` | Fitness & composición corporal |
| 11 | Déficit Calórico | `/deficit-calorico` | `DeficitCaloricoCalculator.tsx` | `calcularTDEE` | Calorías & nutrición |
| 12 | Complexión Corporal | `/complexion-corporal` | `ComplexionCorporalCalculator.tsx` | `calcularComplexionCorporal` | Fitness & composición corporal |
| 13 | Calorías en Ciclismo | `/calorias-ciclismo` | `CaloriasCiclismoCalculator.tsx` | `calcularCaloriasCiclismo` | Fitness & composición corporal |
| 14 | Fuerza Relativa | `/fuerza-relativa` | `FuerzaRelativaCalculator.tsx` | `calcularFuerzaRelativa` | Fitness & composición corporal |
| 15 | Masa Muscular | `/masa-muscular` | `MasaMuscularCalculator.tsx` | `calcularMasaMuscular` | Fitness & composición corporal |
| 16 | Calorías Natación | `/calorias-natacion` | `CaloriasNatacionCalculator.tsx` | `calcularCaloriasNatacion` | Fitness & composición corporal |
| 17 | Test de Cooper | `/test-cooper` | `TestCooperCalculator.tsx` | `calcularTestCooper` | Fitness & composición corporal |
| 18 | Calorías Corriendo | `/calorias-corriendo` | `CaloriasCorriendoCalculator.tsx` | `calcularCaloriasCorriendo` | Fitness & composición corporal |

## Categorías

- **Fitness & composición corporal** (`/fitness`): 13 calculadoras
- **Calorías & nutrición** (`/nutricion`): 5 calculadoras
