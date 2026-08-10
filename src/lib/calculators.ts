// ─── IMC ───────────────────────────────────────────────────────────────────
export interface IMCResult {
  imc: number;
  categoria: string;
  rango: 'bajo' | 'normal' | 'sobrepeso' | 'obesidad';
}

export function calcularIMC(pesoKg: number, alturaCm: number): IMCResult {
  const alturaM = alturaCm / 100;
  const imc = Math.round((pesoKg / (alturaM * alturaM)) * 10) / 10;

  let categoria: string;
  let rango: IMCResult['rango'];

  if (imc < 18.5) {
    categoria = 'Bajo peso';
    rango = 'bajo';
  } else if (imc < 25) {
    categoria = 'Peso normal';
    rango = 'normal';
  } else if (imc < 30) {
    categoria = 'Sobrepeso';
    rango = 'sobrepeso';
  } else if (imc < 35) {
    categoria = 'Obesidad grado I';
    rango = 'obesidad';
  } else if (imc < 40) {
    categoria = 'Obesidad grado II';
    rango = 'obesidad';
  } else {
    categoria = 'Obesidad grado III';
    rango = 'obesidad';
  }

  return { imc, categoria, rango };
}

// ─── TDEE ──────────────────────────────────────────────────────────────────
interface TDEEParams {
  pesoKg: number;
  alturaCm: number;
  edadAnios: number;
  sexo: 'hombre' | 'mujer';
  actividad: 'sedentario' | 'ligero' | 'moderado' | 'activo' | 'muy_activo';
}

export interface TDEEResult {
  tmb: number;
  tdee: number;
  deficit: number;
  superavit: number;
}

export function calcularTDEE(params: TDEEParams): TDEEResult {
  const { pesoKg, alturaCm, edadAnios, sexo, actividad } = params;

  const tmb = sexo === 'hombre'
    ? 10 * pesoKg + 6.25 * alturaCm - 5 * edadAnios + 5
    : 10 * pesoKg + 6.25 * alturaCm - 5 * edadAnios - 161;

  const factores: Record<string, number> = {
    sedentario:  1.2,
    ligero:      1.375,
    moderado:    1.55,
    activo:      1.725,
    muy_activo:  1.9,
  };

  const tdee = Math.round(tmb * factores[actividad]);

  return {
    tmb: Math.round(tmb),
    tdee,
    deficit:   tdee - 500,
    superavit: tdee + 500,
  };
}

// ─── PESO IDEAL ────────────────────────────────────────────────────────────
export interface PesoIdealResult {
  devine:   number;
  robinson: number;
  miller:   number;
  hamwi:    number;
  broca:    number;
  promedio: number;
}

export function calcularPesoIdeal(alturaCm: number, sexo: 'hombre' | 'mujer'): PesoIdealResult {
  const pulgadasExtra = (alturaCm - (sexo === 'hombre' ? 152.4 : 152.4)) / 2.54;

  const devine   = sexo === 'hombre' ? 50  + 2.3  * pulgadasExtra : 45.5 + 2.3  * pulgadasExtra;
  const robinson = sexo === 'hombre' ? 52  + 1.9  * pulgadasExtra : 49   + 1.7  * pulgadasExtra;
  const miller   = sexo === 'hombre' ? 56.2 + 1.41 * pulgadasExtra : 53.1 + 1.36 * pulgadasExtra;
  const hamwi    = sexo === 'hombre' ? 48  + 2.7  * pulgadasExtra : 45.5 + 2.2  * pulgadasExtra;
  const broca    = sexo === 'hombre' ? (alturaCm - 100) * 0.9 : (alturaCm - 100) * 0.85;

  const promedio = Math.round(((devine + robinson + miller + hamwi + broca) / 5) * 10) / 10;

  return {
    devine:   Math.round(devine   * 10) / 10,
    robinson: Math.round(robinson * 10) / 10,
    miller:   Math.round(miller   * 10) / 10,
    hamwi:    Math.round(hamwi    * 10) / 10,
    broca:    Math.round(broca    * 10) / 10,
    promedio,
  };
}

// ─── GRASA CORPORAL ────────────────────────────────────────────────────────
interface GrasaCorporalParams {
  sexo:      'hombre' | 'mujer';
  alturaCm:  number;
  cuelloCm:  number;
  cinturaCm: number;
  caderaCm?: number;
}

export interface GrasaCorporalResult {
  porcentaje: number;
  categoria:  string;
}

export function calcularGrasaCorporal(params: GrasaCorporalParams): GrasaCorporalResult {
  const { sexo, alturaCm, cuelloCm, cinturaCm, caderaCm } = params;

  let porcentaje: number;

  if (sexo === 'hombre') {
    porcentaje = 495 / (1.0324 - 0.19077 * Math.log10(cinturaCm - cuelloCm) + 0.15456 * Math.log10(alturaCm)) - 450;
  } else {
    const cadera = caderaCm ?? cinturaCm * 0.9;
    porcentaje = 495 / (1.29579 - 0.35004 * Math.log10(cinturaCm + cadera - cuelloCm) + 0.22100 * Math.log10(alturaCm)) - 450;
  }

  porcentaje = Math.round(porcentaje * 10) / 10;

  let categoria: string;
  if (sexo === 'hombre') {
    if (porcentaje < 6)       categoria = 'Esencial';
    else if (porcentaje < 14) categoria = 'Atlético';
    else if (porcentaje < 18) categoria = 'Fitness';
    else if (porcentaje < 25) categoria = 'Aceptable';
    else                      categoria = 'Obesidad';
  } else {
    if (porcentaje < 14)      categoria = 'Esencial';
    else if (porcentaje < 21) categoria = 'Atlético';
    else if (porcentaje < 25) categoria = 'Fitness';
    else if (porcentaje < 32) categoria = 'Aceptable';
    else                      categoria = 'Obesidad';
  }

  return { porcentaje, categoria };
}

// ─── MACRONUTRIENTES ───────────────────────────────────────────────────────
interface MacroParams {
  pesoKg:    number;
  objetivo:  'perder' | 'mantener' | 'ganar';
  actividad: 'sedentario' | 'ligero' | 'moderado' | 'activo';
}

export interface MacroResult {
  proteinas:      number;
  carbohidratos:  number;
  grasas:         number;
  calorias:       number;
}

export function calcularMacronutrientes(params: MacroParams): MacroResult {
  const { pesoKg, objetivo, actividad } = params;

  const factoresActividad: Record<string, number> = {
    sedentario: 26,
    ligero:     30,
    moderado:   33,
    activo:     37,
  };

  let calorias = pesoKg * factoresActividad[actividad];
  if (objetivo === 'perder')  calorias -= 400;
  if (objetivo === 'ganar')   calorias += 300;
  calorias = Math.round(calorias);

  const factoresProteina: Record<string, number> = {
    perder:   2.2,
    mantener: 1.8,
    ganar:    2.0,
  };

  const proteinas     = Math.round(pesoKg * factoresProteina[objetivo]);
  const grasas        = Math.round((calorias * 0.25) / 9);
  const carbohidratos = Math.round((calorias - proteinas * 4 - grasas * 9) / 4);

  return { proteinas, carbohidratos, grasas, calorias };
}

// ─── PROTEÍNAS DIARIAS ─────────────────────────────────────────────────────
interface ProteinasParams {
  pesoKg: number;
  nivel:  'sedentario' | 'amateur' | 'atleta';
}

export interface ProteinasResult {
  minimo:  number;
  optimo:  number;
}

export function calcularProteinasDiarias(params: ProteinasParams): ProteinasResult {
  const factores: Record<string, [number, number]> = {
    sedentario: [0.8, 1.2],
    amateur:    [1.4, 1.8],
    atleta:     [1.8, 2.5],
  };

  const [fMin, fOpt] = factores[params.nivel];
  return {
    minimo: Math.round(params.pesoKg * fMin),
    optimo: Math.round(params.pesoKg * fOpt),
  };
}

// ─── FFMI ──────────────────────────────────────────────────────────────────
export interface FFMIResult {
  ffmi: number;
  ffmiNormalizado: number;
  masaMagraKg: number;
  categoria: string;
  nivel: 'bajo' | 'normal' | 'encima_media' | 'atletico' | 'avanzado';
}

export function calcularFFMI(pesoKg: number, alturaCm: number, grasaPorcentaje: number): FFMIResult {
  const alturaM = alturaCm / 100;
  const masaMagraKg = Math.round(pesoKg * (1 - grasaPorcentaje / 100) * 10) / 10;
  const ffmi = Math.round((masaMagraKg / (alturaM * alturaM)) * 10) / 10;
  const ffmiNormalizado = Math.round((ffmi + 6.1 * (1.8 - alturaM)) * 10) / 10;

  let categoria: string;
  let nivel: FFMIResult['nivel'];

  if (ffmiNormalizado < 17)       { categoria = 'Por debajo de la media'; nivel = 'bajo'; }
  else if (ffmiNormalizado < 20)  { categoria = 'Normal';                 nivel = 'normal'; }
  else if (ffmiNormalizado < 22)  { categoria = 'Por encima de la media'; nivel = 'encima_media'; }
  else if (ffmiNormalizado < 24)  { categoria = 'Atlético';               nivel = 'atletico'; }
  else                            { categoria = 'Avanzado / Élite';       nivel = 'avanzado'; }

  return { ffmi, ffmiNormalizado, masaMagraKg, categoria, nivel };
}

// ─── METABOLISMO BASAL (TMB) ───────────────────────────────────────────────
export interface MetabolismoBasalResult {
  mifflin:   number;
  harris:    number;
  schofield: number;
  promedio:  number;
  categoria: string;
}

export function calcularMetabolismoBasal(
  pesoKg:    number,
  alturaCm:  number,
  edadAnios: number,
  sexo:      'hombre' | 'mujer',
): MetabolismoBasalResult {
  const mifflin = sexo === 'hombre'
    ? 10 * pesoKg + 6.25 * alturaCm - 5 * edadAnios + 5
    : 10 * pesoKg + 6.25 * alturaCm - 5 * edadAnios - 161;

  const harris = sexo === 'hombre'
    ? 88.362 + 13.397 * pesoKg + 4.799 * alturaCm - 5.677 * edadAnios
    : 447.593 + 9.247 * pesoKg + 3.098 * alturaCm - 4.330 * edadAnios;

  let schofield: number;
  if (sexo === 'hombre') {
    if (edadAnios < 18)       schofield = 17.686 * pesoKg + 658.2;
    else if (edadAnios < 30)  schofield = 15.057 * pesoKg + 692.2;
    else if (edadAnios < 60)  schofield = 11.472 * pesoKg + 873.1;
    else                      schofield = 11.711 * pesoKg + 587.7;
  } else {
    if (edadAnios < 18)       schofield = 13.384 * pesoKg + 692.6;
    else if (edadAnios < 30)  schofield = 14.818 * pesoKg + 486.6;
    else if (edadAnios < 60)  schofield =  8.126 * pesoKg + 845.6;
    else                      schofield =  9.082 * pesoKg + 658.5;
  }

  const promedio   = Math.round((mifflin + harris + schofield) / 3);
  const umbralBajo = sexo === 'hombre' ? 1400 : 1100;
  const umbralAlto = sexo === 'hombre' ? 1800 : 1500;
  const categoria  = promedio < umbralBajo ? 'TMB baja' : promedio < umbralAlto ? 'TMB normal' : 'TMB alta';

  return { mifflin: Math.round(mifflin), harris: Math.round(harris), schofield: Math.round(schofield), promedio, categoria };
}

// ─── UNA REPETICIÓN MÁXIMA (1RM) ──────────────────────────────────────────
function _repsFor1RM(pct: number): number {
  if (pct >= 100) return 1;
  if (pct >= 95)  return 2;
  if (pct >= 90)  return 4;
  if (pct >= 85)  return 6;
  if (pct >= 80)  return 8;
  if (pct >= 75)  return 10;
  if (pct >= 70)  return 12;
  if (pct >= 65)  return 15;
  if (pct >= 60)  return 17;
  if (pct >= 55)  return 20;
  return 25;
}

export interface UnaRepeticionMaximaResult {
  brzycki: number;
  epley:   number;
  lander:  number;
  promedio: number;
  tabla: { porcentaje: number; peso: number; reps: number }[];
}

export function calcularUnaRepeticionMaxima(pesoKg: number, reps: number): UnaRepeticionMaximaResult {
  const brzycki = pesoKg / (1.0278 - 0.0278 * reps);
  const epley   = pesoKg * (1 + reps / 30);
  const lander  = (100 * pesoKg) / (101.3 - 2.67123 * reps);
  const promedio = (brzycki + epley + lander) / 3;
  const r = (v: number) => Math.round(v * 10) / 10;

  return {
    brzycki: r(brzycki),
    epley:   r(epley),
    lander:  r(lander),
    promedio: r(promedio),
    tabla: [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50].map(pct => ({
      porcentaje: pct,
      peso: r(promedio * pct / 100),
      reps: _repsFor1RM(pct),
    })),
  };
}

// ─── CALORÍAS CAMINANDO ────────────────────────────────────────────────────
export type VelocidadCaminata = 'muy_lento' | 'lento' | 'moderado' | 'rapido' | 'muy_rapido';

export const VELOCIDADES_CAMINATA: Record<VelocidadCaminata, { kmh: number; met: number; nombre: string }> = {
  muy_lento:  { kmh: 2.5, met: 2.0, nombre: 'Muy lento (< 3 km/h)' },
  lento:      { kmh: 3.5, met: 2.8, nombre: 'Lento (3–4 km/h)' },
  moderado:   { kmh: 4.5, met: 3.5, nombre: 'Moderado (4–5 km/h)' },
  rapido:     { kmh: 5.5, met: 4.3, nombre: 'Rápido (5–6 km/h)' },
  muy_rapido: { kmh: 7.0, met: 5.0, nombre: 'Muy rápido (> 6 km/h)' },
};

export interface CaloriasCaminandoResult {
  calorias: number;
  km:       number;
  pasos:    number;
  velocidadNombre: string;
}

export function calcularCaloriasCaminando(
  pesoKg:      number,
  duracionMin: number,
  velocidad:   VelocidadCaminata,
): CaloriasCaminandoResult {
  const { kmh, met, nombre } = VELOCIDADES_CAMINATA[velocidad];
  const horas = duracionMin / 60;
  return {
    calorias: Math.round(met * pesoKg * horas),
    km:       Math.round(kmh * horas * 10) / 10,
    pasos:    Math.round(kmh * horas * 1350),
    velocidadNombre: nombre,
  };
}

// ─── DÉFICIT CALÓRICO ──────────────────────────────────────────────────────
export type ObjetivoDeficit = '0.25' | '0.5' | '0.75' | '1.0';

export interface DeficitCaloricoResult {
  caloriasDiarias: number;
  deficitDiario:   number;
  perdidaSemanal:  number;
  tiempoSemanas:   number;
  tiempoMeses:     number;
  esSeguro:        boolean;
}

export function calcularDeficitCalorico(
  tdee:           number,
  pesoActualKg:   number,
  pesoObjetivoKg: number,
  objetivo:       ObjetivoDeficit,
): DeficitCaloricoResult {
  const kgSemana    = parseFloat(objetivo);
  const caloriasDiarias = Math.max(1200, tdee - Math.round(kgSemana * 7700 / 7));
  const deficitDiario   = tdee - caloriasDiarias;
  const kgDiff      = Math.abs(pesoActualKg - pesoObjetivoKg);
  const semanas     = kgDiff > 0 ? Math.ceil(kgDiff * 7700 / (deficitDiario * 7)) : 0;
  return {
    caloriasDiarias,
    deficitDiario,
    perdidaSemanal: Math.round(deficitDiario * 7 / 7700 * 100) / 100,
    tiempoSemanas:  semanas,
    tiempoMeses:    Math.round(semanas / 4.33 * 10) / 10,
    esSeguro:       deficitDiario <= 1000,
  };
}

// ─── COMPLEXIÓN CORPORAL ───────────────────────────────────────────────────
export interface ComplexionCorporalResult {
  tipo:      'pequena' | 'mediana' | 'grande';
  tipoNombre: string;
  indice:    number;
  descripcion: string;
}

export function calcularComplexionCorporal(
  alturaCm: number,
  munecaCm: number,
  sexo:     'hombre' | 'mujer',
): ComplexionCorporalResult {
  const indice   = Math.round((alturaCm / munecaCm) * 100) / 100;
  const [hi, lo] = sexo === 'hombre' ? [10.4, 9.6] : [11.0, 10.1];

  if (indice > hi)  return { tipo: 'pequena', tipoNombre: 'Complexión pequeña', indice, descripcion: 'Estructura ósea fina. El peso ideal puede ser hasta un 10 % menor al estándar.' };
  if (indice >= lo) return { tipo: 'mediana', tipoNombre: 'Complexión mediana', indice, descripcion: 'Estructura ósea promedio. Las tablas de peso ideal estándar aplican directamente.' };
  return             { tipo: 'grande',  tipoNombre: 'Complexión grande',  indice, descripcion: 'Estructura ósea robusta. El peso ideal puede ser hasta un 10 % mayor al estándar.' };
}

// ─── CALORÍAS CICLISMO ────────────────────────────────────────────────────────
export type IntensidadCiclismo = 'muy_lento' | 'lento' | 'moderado' | 'rapido' | 'muy_rapido';

export const INTENSIDADES_CICLISMO: Record<IntensidadCiclismo, { kmh: number; met: number; nombre: string }> = {
  muy_lento:  { kmh: 14,  met: 4.0,  nombre: 'Muy lento (< 16 km/h)' },
  lento:      { kmh: 17,  met: 6.8,  nombre: 'Lento (16–19 km/h)' },
  moderado:   { kmh: 21,  met: 8.0,  nombre: 'Moderado (19–22 km/h)' },
  rapido:     { kmh: 24,  met: 10.0, nombre: 'Rápido (22–26 km/h)' },
  muy_rapido: { kmh: 28,  met: 12.0, nombre: 'Muy rápido (> 26 km/h)' },
};

export interface CaloriasCiclismoResult {
  calorias:       number;
  km:             number;
  met:            number;
  intensidadNombre: string;
}

export function calcularCaloriasCiclismo(
  pesoKg:      number,
  duracionMin: number,
  intensidad:  IntensidadCiclismo,
): CaloriasCiclismoResult {
  const { kmh, met, nombre } = INTENSIDADES_CICLISMO[intensidad];
  const horas = duracionMin / 60;
  return {
    calorias:        Math.round(met * pesoKg * horas),
    km:              Math.round(kmh * horas * 10) / 10,
    met,
    intensidadNombre: nombre,
  };
}

// ─── FUERZA RELATIVA ──────────────────────────────────────────────────────────
export type EjercicioFuerza = 'press_banca' | 'sentadilla' | 'peso_muerto' | 'press_militar';

export interface FuerzaRelativaResult {
  ratio:       number;
  nivel:       'principiante' | 'novato' | 'intermedio' | 'avanzado' | 'elite';
  nivelNombre: string;
  color:       string;
  descripcion: string;
  estandares:  { nivel: string; ratio: number; color: string }[];
}

export function calcularFuerzaRelativa(
  pesoCorporalKg:   number,
  pesoLevantadoKg:  number,
  ejercicio:        EjercicioFuerza,
  sexo:             'hombre' | 'mujer',
): FuerzaRelativaResult {
  const ratio = Math.round((pesoLevantadoKg / pesoCorporalKg) * 100) / 100;

  type Umbral = [number, number, number, number];
  const umbrales: Record<EjercicioFuerza, { h: Umbral; m: Umbral }> = {
    press_banca:  { h: [0.5, 0.75, 1.25, 1.75], m: [0.35, 0.5, 0.75, 1.0] },
    sentadilla:   { h: [0.75, 1.25, 1.75, 2.25], m: [0.5, 0.75, 1.25, 1.5] },
    peso_muerto:  { h: [1.0, 1.5, 2.0, 2.5],    m: [0.75, 1.0, 1.5, 1.75] },
    press_militar:{ h: [0.35, 0.55, 0.8, 1.1],  m: [0.2, 0.35, 0.5, 0.65] },
  };

  const [t1, t2, t3, t4] = sexo === 'hombre' ? umbrales[ejercicio].h : umbrales[ejercicio].m;

  const estandares = [
    { nivel: 'Principiante', ratio: t1!, color: '#60A5FA' },
    { nivel: 'Novato',       ratio: t2!, color: '#34D399' },
    { nivel: 'Intermedio',   ratio: t3!, color: '#CAFF00' },
    { nivel: 'Avanzado',     ratio: t4!, color: '#FB923C' },
    { nivel: 'Élite',        ratio: t4! + 0.5, color: '#F87171' },
  ];

  if (ratio < t1!)  return { ratio, nivel: 'principiante', nivelNombre: 'Principiante', color: '#60A5FA', descripcion: 'Nivel inicial. Con entrenamiento consistente avanzarás rápido.',      estandares };
  if (ratio < t2!)  return { ratio, nivel: 'novato',       nivelNombre: 'Novato',       color: '#34D399', descripcion: 'Buen punto de partida. Sigue progresando con técnica correcta.',    estandares };
  if (ratio < t3!)  return { ratio, nivel: 'intermedio',   nivelNombre: 'Intermedio',   color: '#CAFF00', descripcion: 'Nivel sólido. Aplica periodización para seguir avanzando.',         estandares };
  if (ratio < t4!)  return { ratio, nivel: 'avanzado',     nivelNombre: 'Avanzado',     color: '#FB923C', descripcion: 'Fuerza relativa alta. Pocos llegan a este nivel.',                  estandares };
  return              { ratio, nivel: 'elite',         nivelNombre: 'Élite',        color: '#F87171', descripcion: 'Fuerza de alto rendimiento. Nivel competitivo o deportista de élite.', estandares };
}

// ─── MASA MUSCULAR ESQUELÉTICA ────────────────────────────────────────────────
export interface MasaMuscularResult {
  masaMuscularKg: number;
  smi:            number;
  porcentaje:     number;
  categoria:      string;
  nivel:          'bajo' | 'normal' | 'alto';
  color:          string;
  descripcion:    string;
}

export function calcularMasaMuscular(
  pesoKg:    number,
  alturaCm:  number,
  edadAnios: number,
  sexo:      'hombre' | 'mujer',
): MasaMuscularResult {
  const alturaM   = alturaCm / 100;
  const genero    = sexo === 'hombre' ? 1 : 0;
  // Fórmula Lee 2000 (kg)
  const masa = 0.244 * pesoKg + 7.80 * alturaM - 0.098 * edadAnios + 6.6 * genero - 3.3;
  const masaMuscularKg = Math.round(masa * 10) / 10;
  const smi            = Math.round((masa / (alturaM * alturaM)) * 10) / 10;
  const porcentaje     = Math.round((masa / pesoKg) * 1000) / 10;

  // EWGSOP2 cutpoints
  const bajoCut  = sexo === 'hombre' ? 7.0 : 5.5;
  const altoCut  = sexo === 'hombre' ? 9.5 : 7.5;

  if (smi < bajoCut)  return { masaMuscularKg, smi, porcentaje, categoria: 'Masa muscular baja',    nivel: 'bajo',   color: '#F87171', descripcion: 'Por debajo del umbral de sarcopenia (EWGSOP2). Considera entrenamiento de fuerza y mayor ingesta proteica.' };
  if (smi <= altoCut) return { masaMuscularKg, smi, porcentaje, categoria: 'Masa muscular normal',  nivel: 'normal', color: '#34D399', descripcion: 'Masa muscular esquelética en rango saludable. Mantén el entrenamiento de fuerza y una dieta rica en proteínas.' };
  return                { masaMuscularKg, smi, porcentaje, categoria: 'Masa muscular alta',     nivel: 'alto',   color: '#CAFF00', descripcion: 'Masa muscular elevada. Propio de personas con entrenamiento de fuerza avanzado o deportistas.' };
}

// ─── CALORÍAS NATACIÓN ────────────────────────────────────────────────────────
export type EstiloNatacion = 'recreacional' | 'crawl_lento' | 'crawl_rapido' | 'pecho' | 'espalda' | 'mariposa';

export const ESTILOS_NATACION: Record<EstiloNatacion, { met: number; nombre: string }> = {
  recreacional: { met: 5.8,  nombre: 'Recreacional (estilo libre suave)' },
  crawl_lento:  { met: 7.0,  nombre: 'Crawl lento' },
  crawl_rapido: { met: 9.8,  nombre: 'Crawl rápido / competición' },
  pecho:        { met: 8.3,  nombre: 'Pecho (braza)' },
  espalda:      { met: 7.0,  nombre: 'Espalda' },
  mariposa:     { met: 13.8, nombre: 'Mariposa' },
};

export interface CaloriasNatacionResult {
  calorias:     number;
  met:          number;
  estiloNombre: string;
}

export function calcularCaloriasNatacion(
  pesoKg:      number,
  duracionMin: number,
  estilo:      EstiloNatacion,
): CaloriasNatacionResult {
  const { met, nombre } = ESTILOS_NATACION[estilo];
  return {
    calorias:     Math.round(met * pesoKg * (duracionMin / 60)),
    met,
    estiloNombre: nombre,
  };
}

// ─── TEST DE COOPER (12 MINUTOS) ──────────────────────────────────────────────
export interface TestCooperResult {
  vo2max:      number;
  categoria:   string;
  color:       string;
}

export function calcularTestCooper(
  distanciaMetros: number,
  sexo:            'hombre' | 'mujer',
  edad:            number,
): TestCooperResult {
  const vo2max = Math.round(((distanciaMetros - 504.9) / 44.73) * 10) / 10;

  type Corte = [number, number, number, number];
  const cortesH: Record<string, Corte> = {
    '<30': [38, 44, 50, 56], '<40': [34, 40, 46, 52], '<50': [31, 37, 43, 49], '50+': [26, 32, 38, 44],
  };
  const cortesM: Record<string, Corte> = {
    '<30': [29, 35, 41, 47], '<40': [27, 33, 39, 45], '<50': [25, 31, 37, 43], '50+': [22, 28, 34, 40],
  };
  const key = edad < 30 ? '<30' : edad < 40 ? '<40' : edad < 50 ? '<50' : '50+';
  const [c1, c2, c3, c4] = (sexo === 'hombre' ? cortesH : cortesM)[key]!;

  const etiquetas = ['Muy bajo', 'Bajo', 'Promedio', 'Bueno', 'Excelente'];
  const colores   = ['#F87171', '#FB923C', '#CAFF00', '#34D399', '#60A5FA'];
  const idx = vo2max < c1! ? 0 : vo2max < c2! ? 1 : vo2max < c3! ? 2 : vo2max < c4! ? 3 : 4;

  return { vo2max, categoria: etiquetas[idx]!, color: colores[idx]! };
}

// ── Calorías corriendo (MET del Compendium of Physical Activities 2011) ──
export function calcularCaloriasCorriendo(pesoKg: number, distanciaKm: number, minutos: number): {
  calorias: number; met: number; velocidadKmH: number; ritmo: string;
  equivalencias: { alimento: string; cantidad: string }[];
} {
  const horas = minutos / 60;
  const velocidadKmH = horas > 0 ? distanciaKm / horas : 0;
  let met: number;
  if (velocidadKmH < 8) met = 6.0;
  else if (velocidadKmH < 9.7) met = 8.3;
  else if (velocidadKmH < 10.8) met = 9.8;
  else if (velocidadKmH < 11.3) met = 10.5;
  else if (velocidadKmH < 12.9) met = 11.0;
  else if (velocidadKmH < 13.9) met = 11.8;
  else if (velocidadKmH < 14.5) met = 12.3;
  else if (velocidadKmH < 16.1) met = 12.8;
  else met = 14.5;
  const calorias = Math.round((met * 3.5 * pesoKg / 200) * minutos);
  const ritmoMin = velocidadKmH > 0 ? 60 / velocidadKmH : 0;
  const rm = Math.floor(ritmoMin);
  const rs = Math.round((ritmoMin - rm) * 60);
  const ritmo = velocidadKmH > 0 ? `${rm}:${String(rs).padStart(2, '0')}` : '—';
  const equivalencias = [
    { alimento: 'Plátanos', cantidad: (calorias / 90).toFixed(1) },
    { alimento: 'Rebanadas de pan', cantidad: (calorias / 75).toFixed(1) },
    { alimento: 'Cervezas (330 ml)', cantidad: (calorias / 140).toFixed(1) },
  ];
  return { calorias, met, velocidadKmH: Math.round(velocidadKmH * 10) / 10, ritmo, equivalencias };
}

