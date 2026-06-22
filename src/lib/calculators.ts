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

// ─── FRECUENCIA CARDÍACA MÁXIMA ────────────────────────────────────────────
export interface ZonaCardiaca {
  nombre: string;
  min:    number;
  max:    number;
  color:  string;
}

export interface FCMResult {
  fcm:   number;
  zonas: ZonaCardiaca[];
}

export function calcularFCM(edad: number): FCMResult {
  const fcm = 220 - edad;
  const zonas: ZonaCardiaca[] = [
    { nombre: 'Recuperación',    min: Math.round(fcm * 0.50), max: Math.round(fcm * 0.60), color: '#60A5FA' },
    { nombre: 'Quema de grasa',  min: Math.round(fcm * 0.60), max: Math.round(fcm * 0.70), color: '#34D399' },
    { nombre: 'Aeróbica',        min: Math.round(fcm * 0.70), max: Math.round(fcm * 0.80), color: 'var(--acid)' },
    { nombre: 'Anaeróbica',      min: Math.round(fcm * 0.80), max: Math.round(fcm * 0.90), color: '#FB923C' },
    { nombre: 'Máxima',          min: Math.round(fcm * 0.90), max: fcm,                    color: '#F87171' },
  ];
  return { fcm, zonas };
}

// ─── AGUA DIARIA ───────────────────────────────────────────────────────────
interface AguaDiariaParams {
  pesoKg:    number;
  actividad: 'sedentario' | 'ligero' | 'moderado' | 'activo';
  clima:     'templado' | 'calido' | 'muy_calido';
}

export interface AguaDiariaResult {
  litros: number;
  vasos:  number;
}

export function calcularAguaDiaria(params: AguaDiariaParams): AguaDiariaResult {
  const { pesoKg, actividad, clima } = params;

  const factoresActividad: Record<string, number> = {
    sedentario: 30,
    ligero:     33,
    moderado:   37,
    activo:     40,
  };
  const factoresClima: Record<string, number> = {
    templado:   0,
    calido:     350,
    muy_calido: 700,
  };

  const mlBase = pesoKg * factoresActividad[actividad] + factoresClima[clima];
  const litros = Math.round((mlBase / 1000) * 10) / 10;
  const vasos  = Math.round(mlBase / 250);

  return { litros, vasos };
}

// ─── OVULACIÓN ─────────────────────────────────────────────────────────────
interface OvulacionParams {
  ultimaMenstruacion: Date;
  duracionCiclo:      number;
}

export interface OvulacionResult {
  ovulacion:    Date;
  inicioFertil: Date;
  finFertil:    Date;
  diasFertiles: Date[];
}

export function calcularOvulacion(params: OvulacionParams): OvulacionResult {
  const { ultimaMenstruacion, duracionCiclo } = params;

  const ovulacion = new Date(ultimaMenstruacion);
  ovulacion.setDate(ovulacion.getDate() + duracionCiclo - 14);

  const inicioFertil = new Date(ovulacion);
  inicioFertil.setDate(inicioFertil.getDate() - 5);

  const finFertil = new Date(ovulacion);
  finFertil.setDate(finFertil.getDate() + 1);

  const diasFertiles: Date[] = [];
  const cur = new Date(inicioFertil);
  while (cur <= finFertil) {
    diasFertiles.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }

  return { ovulacion, inicioFertil, finFertil, diasFertiles };
}

// ─── SEMANA DE EMBARAZO ────────────────────────────────────────────────────
export interface SemanaEmbarazoResult {
  semanas:     number;
  dias:        number;
  trimestre:   number;
  fechaParto:  Date;
}

export function calcularSemanaEmbarazo(ultimaMenstruacion: Date): SemanaEmbarazoResult {
  const hoy = new Date();
  const diffMs = hoy.getTime() - ultimaMenstruacion.getTime();
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const semanas = Math.floor(diffDias / 7);
  const dias    = diffDias % 7;

  let trimestre: number;
  if (semanas < 13)      trimestre = 1;
  else if (semanas < 27) trimestre = 2;
  else                   trimestre = 3;

  const fechaParto = new Date(ultimaMenstruacion);
  fechaParto.setDate(fechaParto.getDate() + 280);

  return { semanas, dias, trimestre, fechaParto };
}

// ─── FECHA DE PARTO ────────────────────────────────────────────────────────
export interface FechaPartoResult {
  fechaParto:        Date;
  semanasRestantes:  number;
}

export function calcularFechaParto(ultimaMenstruacion: Date): FechaPartoResult {
  const fechaParto = new Date(ultimaMenstruacion);
  fechaParto.setDate(fechaParto.getDate() + 280);

  const hoy = new Date();
  const diffMs = fechaParto.getTime() - hoy.getTime();
  const semanasRestantes = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24 * 7)));

  return { fechaParto, semanasRestantes };
}

// ─── EDAD ──────────────────────────────────────────────────────────────────
export interface EdadResult {
  anios:        number;
  meses:        number;
  dias:         number;
  totalDias:    number;
  proximoCumple: Date;
}

export function calcularEdad(fechaNacimiento: Date): EdadResult {
  const hoy = new Date();

  let anios = hoy.getFullYear() - fechaNacimiento.getFullYear();
  let meses = hoy.getMonth() - fechaNacimiento.getMonth();
  let dias  = hoy.getDate() - fechaNacimiento.getDate();

  if (dias < 0) {
    meses--;
    dias += new Date(hoy.getFullYear(), hoy.getMonth(), 0).getDate();
  }
  if (meses < 0) {
    anios--;
    meses += 12;
  }

  const totalDias = Math.floor((hoy.getTime() - fechaNacimiento.getTime()) / (1000 * 60 * 60 * 24));

  const proximoCumple = new Date(hoy.getFullYear(), fechaNacimiento.getMonth(), fechaNacimiento.getDate());
  if (proximoCumple <= hoy) proximoCumple.setFullYear(hoy.getFullYear() + 1);

  return { anios, meses, dias, totalDias, proximoCumple };
}

// ─── DÍAS ENTRE FECHAS ─────────────────────────────────────────────────────
export interface DiasFechasResult {
  dias:   number;
  semanas: number;
  meses:  number;
  anios:  number;
}

export function calcularDiasFechas(fechaInicio: Date, fechaFin: Date): DiasFechasResult {
  const diffMs = Math.abs(fechaFin.getTime() - fechaInicio.getTime());
  const dias   = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return {
    dias,
    semanas: Math.floor(dias / 7),
    meses:   Math.floor(dias / 30.44),
    anios:   Math.floor(dias / 365.25),
  };
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

// ─── RELACIÓN CINTURA-CADERA ───────────────────────────────────────────────
interface CinturaCaderaParams {
  sexo: 'hombre' | 'mujer';
  cinturaCm: number;
  caderaCm: number;
}

export interface CinturaCaderaResult {
  ratio: number;
  categoria: string;
  riesgo: 'bajo' | 'moderado' | 'alto';
}

export function calcularCinturaCadera(params: CinturaCaderaParams): CinturaCaderaResult {
  const { sexo, cinturaCm, caderaCm } = params;
  const ratio = Math.round((cinturaCm / caderaCm) * 100) / 100;

  let categoria: string;
  let riesgo: CinturaCaderaResult['riesgo'];

  if (sexo === 'hombre') {
    if (ratio < 0.9)  { categoria = 'Bajo riesgo';      riesgo = 'bajo'; }
    else if (ratio < 1.0) { categoria = 'Riesgo moderado'; riesgo = 'moderado'; }
    else              { categoria = 'Riesgo alto';       riesgo = 'alto'; }
  } else {
    if (ratio < 0.8)  { categoria = 'Bajo riesgo';      riesgo = 'bajo'; }
    else if (ratio < 0.85) { categoria = 'Riesgo moderado'; riesgo = 'moderado'; }
    else              { categoria = 'Riesgo alto';       riesgo = 'alto'; }
  }

  return { ratio, categoria, riesgo };
}

// ─── CALORÍAS QUEMADAS EN EJERCICIO ───────────────────────────────────────
export type ActividadFisica =
  | 'caminar_lento' | 'caminar_rapido' | 'correr_8' | 'correr_12'
  | 'ciclismo' | 'natacion' | 'yoga' | 'pesas' | 'hiit'
  | 'baile' | 'futbol' | 'tenis';

interface CaloriasEjercicioParams {
  pesoKg: number;
  duracionMin: number;
  actividad: ActividadFisica;
}

export interface CaloriasEjercicioResult {
  calorias: number;
  met: number;
  actividadNombre: string;
}

export const METS: Record<ActividadFisica, { met: number; nombre: string }> = {
  caminar_lento:  { met: 2.8,  nombre: 'Caminar (lento)' },
  caminar_rapido: { met: 3.8,  nombre: 'Caminar (rápido)' },
  correr_8:       { met: 8.0,  nombre: 'Correr (8 km/h)' },
  correr_12:      { met: 11.5, nombre: 'Correr (12 km/h)' },
  ciclismo:       { met: 7.5,  nombre: 'Ciclismo moderado' },
  natacion:       { met: 5.8,  nombre: 'Natación' },
  yoga:           { met: 2.5,  nombre: 'Yoga' },
  pesas:          { met: 4.0,  nombre: 'Entrenamiento de fuerza' },
  hiit:           { met: 10.0, nombre: 'HIIT' },
  baile:          { met: 4.5,  nombre: 'Baile' },
  futbol:         { met: 7.0,  nombre: 'Fútbol' },
  tenis:          { met: 7.3,  nombre: 'Tenis' },
};

export function calcularCaloriasEjercicio(params: CaloriasEjercicioParams): CaloriasEjercicioResult {
  const { pesoKg, duracionMin, actividad } = params;
  const { met, nombre } = METS[actividad];
  const calorias = Math.round(met * pesoKg * (duracionMin / 60));
  return { calorias, met, actividadNombre: nombre };
}

// ─── ALCOHOLEMIA ───────────────────────────────────────────────────────────
interface AlcoholemiaParams {
  pesoKg: number;
  sexo: 'hombre' | 'mujer';
  bebidasCerveza: number;
  bebidasVino: number;
  bebidasCopa: number;
  horasTranscurridas: number;
}

export interface AlcoholemiaResult {
  bac: number;
  estado: string;
  aptoConducir: boolean;
  horasHastaCero: number;
}

export function calcularAlcoholemia(params: AlcoholemiaParams): AlcoholemiaResult {
  const { pesoKg, sexo, bebidasCerveza, bebidasVino, bebidasCopa, horasTranscurridas } = params;

  const gramosAlcohol =
    bebidasCerveza * (330 * 0.05 * 0.789) +
    bebidasVino    * (150 * 0.12 * 0.789) +
    bebidasCopa    * (50  * 0.40 * 0.789);

  const r = sexo === 'hombre' ? 0.68 : 0.55;
  const bacBruto = gramosAlcohol / (pesoKg * r);
  const bac = Math.max(0, Math.round((bacBruto - 0.15 * horasTranscurridas) * 100) / 100);

  let estado: string;
  if (bac === 0)       estado = 'Sin alcohol detectable';
  else if (bac < 0.3)  estado = 'Sin efectos notables';
  else if (bac < 0.5)  estado = 'Euforia leve';
  else if (bac < 1.0)  estado = 'Alteración moderada';
  else if (bac < 1.5)  estado = 'Alteración severa';
  else if (bac < 3.0)  estado = 'Intoxicación grave';
  else                 estado = 'Peligro vital';

  const horasHastaCero = Math.max(0, Math.round((bacBruto / 0.15) * 10) / 10);

  return { bac, estado, aptoConducir: bac < 0.5, horasHastaCero };
}

// ─── PRESIÓN ARTERIAL ──────────────────────────────────────────────────────
export interface PresionArterialResult {
  categoria: string;
  riesgo: 'hipotension' | 'normal' | 'elevada' | 'alta1' | 'alta2' | 'crisis';
  recomendacion: string;
  color: string;
}

export function calcularPresionArterial(sistolica: number, diastolica: number): PresionArterialResult {
  if (sistolica < 90 || diastolica < 60)
    return { categoria: 'Hipotensión', riesgo: 'hipotension', recomendacion: 'Consulte a su médico si tiene mareos o síntomas.', color: '#60A5FA' };
  if (sistolica >= 180 || diastolica >= 120)
    return { categoria: 'Crisis hipertensiva', riesgo: 'crisis', recomendacion: 'Busque atención médica de inmediato.', color: '#DC2626' };
  if (sistolica >= 140 || diastolica >= 90)
    return { categoria: 'Hipertensión grado 2', riesgo: 'alta2', recomendacion: 'Tratamiento médico necesario. Consulte a su médico.', color: '#F87171' };
  if (sistolica >= 130 || diastolica >= 80)
    return { categoria: 'Hipertensión grado 1', riesgo: 'alta1', recomendacion: 'Cambios en el estilo de vida y posible medicación.', color: '#FB923C' };
  if (sistolica >= 120 && diastolica < 80)
    return { categoria: 'Presión elevada', riesgo: 'elevada', recomendacion: 'Adopte hábitos saludables para prevenir hipertensión.', color: '#CAFF00' };
  return { categoria: 'Presión normal', riesgo: 'normal', recomendacion: 'Mantenga sus hábitos saludables.', color: '#34D399' };
}

// ─── VO2 MÁXIMO ────────────────────────────────────────────────────────────
export interface VO2MaxResult {
  vo2max: number;
  categoria: string;
  nivel: 'muy_bajo' | 'bajo' | 'moderado' | 'bueno' | 'excelente' | 'superior';
}

export function calcularVO2Max(
  edad: number,
  sexo: 'hombre' | 'mujer',
  fcReposo: number,
  fcMaxima?: number,
): VO2MaxResult {
  const fcm = fcMaxima ?? (220 - edad);
  const vo2max = Math.round((fcm / fcReposo) * 15 * 10) / 10;

  const umbrales = sexo === 'hombre' ? [28, 34, 42, 52, 60] : [22, 28, 35, 45, 53];

  let categoria: string;
  let nivel: VO2MaxResult['nivel'];

  if (vo2max < umbrales[0]!)      { categoria = 'Muy bajo';   nivel = 'muy_bajo'; }
  else if (vo2max < umbrales[1]!) { categoria = 'Bajo';       nivel = 'bajo'; }
  else if (vo2max < umbrales[2]!) { categoria = 'Moderado';   nivel = 'moderado'; }
  else if (vo2max < umbrales[3]!) { categoria = 'Bueno';      nivel = 'bueno'; }
  else if (vo2max < umbrales[4]!) { categoria = 'Excelente';  nivel = 'excelente'; }
  else                            { categoria = 'Superior';   nivel = 'superior'; }

  return { vo2max, categoria, nivel };
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

// ─── CICLO MENSTRUAL ───────────────────────────────────────────────────────
export interface FaseCiclo {
  nombre: string;
  inicio: Date;
  fin: Date;
  descripcion: string;
  color: string;
}

export interface CicloMenstrualResult {
  proximaMenstruacion: Date;
  fases: FaseCiclo[];
  diaActual: number;
  faseActual: string;
}

export function calcularCicloMenstrual(
  ultimaMenstruacion: Date,
  duracionCiclo: number,
  duracionPeriodo: number,
): CicloMenstrualResult {
  const hoy = new Date();
  const add = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

  const diaActual = Math.max(1, Math.floor((hoy.getTime() - ultimaMenstruacion.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  const diaOvulacion = duracionCiclo - 14;

  const fases: FaseCiclo[] = [
    { nombre: 'Menstruación', inicio: ultimaMenstruacion,               fin: add(ultimaMenstruacion, duracionPeriodo - 1), descripcion: 'Sangrado menstrual',      color: '#F87171' },
    { nombre: 'Folicular',    inicio: add(ultimaMenstruacion, duracionPeriodo), fin: add(ultimaMenstruacion, diaOvulacion - 2), descripcion: 'Preparación folicular', color: '#60A5FA' },
    { nombre: 'Ovulación',    inicio: add(ultimaMenstruacion, diaOvulacion - 1), fin: add(ultimaMenstruacion, diaOvulacion + 1), descripcion: 'Máxima fertilidad',    color: '#CAFF00' },
    { nombre: 'Lútea',        inicio: add(ultimaMenstruacion, diaOvulacion + 2), fin: add(ultimaMenstruacion, duracionCiclo - 1), descripcion: 'Fase postovulatoria', color: '#FB923C' },
  ];

  const faseActual = fases.find(f => hoy >= f.inicio && hoy <= f.fin)?.nombre ?? 'Calculando...';

  return {
    proximaMenstruacion: add(ultimaMenstruacion, duracionCiclo),
    fases,
    diaActual,
    faseActual,
  };
}

// ─── RITMO DE CARRERA ──────────────────────────────────────────────────────
export interface RitmoCarreraResult {
  ritmoMinPorKm: string;
  ritmoMinPorMilla: string;
  velocidadKmh: number;
  tiempos: { distancia: string; tiempo: string }[];
}

export function calcularRitmoCarrera(distanciaKm: number, minutosTotal: number): RitmoCarreraResult {
  const segTotal = minutosTotal * 60;
  const segPorKm = segTotal / distanciaKm;

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const ss = Math.round(s % 60);
    return `${m}:${String(ss).padStart(2, '0')}`;
  };

  const tiempos = [
    { distancia: '1 km',    km: 1 },
    { distancia: '5 km',    km: 5 },
    { distancia: '10 km',   km: 10 },
    { distancia: '21.1 km', km: 21.0975 },
    { distancia: '42.2 km', km: 42.195 },
  ].map(({ distancia, km }) => ({ distancia, tiempo: fmt(segPorKm * km) }));

  return {
    ritmoMinPorKm:    fmt(segPorKm),
    ritmoMinPorMilla: fmt(segPorKm * 1.60934),
    velocidadKmh:     Math.round((distanciaKm / (minutosTotal / 60)) * 10) / 10,
    tiempos,
  };
}

// ─── ÍNDICE CINTURA-ESTATURA ───────────────────────────────────────────────
export interface CinturaEstaturaResult {
  ratio: number;
  categoria: string;
  riesgo: 'bajo' | 'saludable' | 'sobrepeso' | 'obeso';
  recomendacion: string;
}

export function calcularCinturaEstatura(cinturaCm: number, alturaCm: number): CinturaEstaturaResult {
  const ratio = Math.round((cinturaCm / alturaCm) * 100) / 100;

  if (ratio < 0.40) return { ratio, categoria: 'Bajo',      riesgo: 'bajo',      recomendacion: 'Puede indicar bajo peso. Consulte a su médico.' };
  if (ratio < 0.50) return { ratio, categoria: 'Saludable', riesgo: 'saludable', recomendacion: 'Excelente. Riesgo cardiovascular bajo.' };
  if (ratio < 0.60) return { ratio, categoria: 'Sobrepeso', riesgo: 'sobrepeso', recomendacion: 'Riesgo cardiovascular moderado. Reduzca el perímetro de cintura.' };
  return             { ratio, categoria: 'Obesidad',   riesgo: 'obeso',      recomendacion: 'Riesgo cardiovascular elevado. Consulte a su médico.' };
}

// ─── AYUNO INTERMITENTE ────────────────────────────────────────────────────
export type ProtocoloAyuno = '14:10' | '16:8' | '18:6' | '20:4';

interface AyunoParams {
  protocolo: ProtocoloAyuno;
  horaInicioComida: string;
}

export interface AyunoResult {
  horaFinComida: string;
  horaInicioAyuno: string;
  horaFinAyuno: string;
  horasAyuno: number;
  horasComida: number;
  beneficios: string[];
}

export function calcularAyunoIntermitente(params: AyunoParams): AyunoResult {
  const { protocolo, horaInicioComida } = params;
  const [hH, mH] = horaInicioComida.split(':').map(Number);
  const minInicio = (hH ?? 0) * 60 + (mH ?? 0);

  const horasMap: Record<ProtocoloAyuno, { ayuno: number; comida: number }> = {
    '14:10': { ayuno: 14, comida: 10 },
    '16:8':  { ayuno: 16, comida: 8 },
    '18:6':  { ayuno: 18, comida: 6 },
    '20:4':  { ayuno: 20, comida: 4 },
  };
  const { ayuno, comida } = horasMap[protocolo];

  const fmtMin = (min: number) => {
    const h = Math.floor((min % 1440) / 60);
    const m = min % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const beneficiosMap: Record<ProtocoloAyuno, string[]> = {
    '14:10': ['Ideal para principiantes', 'Mejora la sensibilidad a la insulina', 'Fácil de mantener a largo plazo'],
    '16:8':  ['El protocolo más popular', 'Reduce el apetito', 'Mejora el metabolismo', 'Autofagia moderada'],
    '18:6':  ['Mayor quema de grasa', 'Autofagia significativa', 'Mejor control glucémico'],
    '20:4':  ['Máxima autofagia', 'Reducción calórica efectiva', 'Solo recomendado con supervisión médica'],
  };

  return {
    horaFinComida:   fmtMin(minInicio + comida * 60),
    horaInicioAyuno: fmtMin(minInicio + comida * 60),
    horaFinAyuno:    fmtMin(minInicio + 1440),
    horasAyuno:      ayuno,
    horasComida:     comida,
    beneficios:      beneficiosMap[protocolo],
  };
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

// ─── RESISTENCIA A LA INSULINA (HOMA-IR) ──────────────────────────────────
export interface HOMAIRResult {
  homaIR:     number;
  categoria:  string;
  riesgo:     'sensible' | 'normal' | 'limite' | 'resistente';
  descripcion: string;
  color:      string;
}

export function calcularHOMAIR(glucosaAyunas: number, insulinaAyunas: number): HOMAIRResult {
  const homaIR = Math.round((glucosaAyunas * insulinaAyunas) / 405 * 100) / 100;
  if (homaIR < 1.0) return { homaIR, categoria: 'Alta sensibilidad', riesgo: 'sensible',   color: '#34D399', descripcion: 'Excelente sensibilidad a la insulina. Sin resistencia detectable.' };
  if (homaIR < 2.0) return { homaIR, categoria: 'Normal',            riesgo: 'normal',     color: '#CAFF00', descripcion: 'Sensibilidad insulínica dentro del rango normal.' };
  if (homaIR < 3.0) return { homaIR, categoria: 'En límite',         riesgo: 'limite',     color: '#FB923C', descripcion: 'Posible resistencia incipiente. Revise hábitos y consulte a su médico.' };
  return             { homaIR, categoria: 'Resistencia',         riesgo: 'resistente', color: '#F87171', descripcion: 'Resistencia a la insulina significativa. Consulte a su médico.' };
}

// ─── SOMATOTIPO ────────────────────────────────────────────────────────────
export type TipoSomatotipo = 'ectomorfo' | 'mesomorfo' | 'endomorfo' | 'ecto_meso' | 'endo_meso';

export interface SomatotipoResult {
  tipo:        TipoSomatotipo;
  tipoNombre:  string;
  descripcion: string;
  puntaje:     { ecto: number; meso: number; endo: number };
  recomendaciones: { dieta: string; entreno: string };
}

export function calcularSomatotipo(
  pesoKg:   number,
  alturaCm: number,
  munecaCm: number,
  sexo:     'hombre' | 'mujer',
): SomatotipoResult {
  const imc          = pesoKg / ((alturaCm / 100) ** 2);
  const indiceMuneca = alturaCm / munecaCm;
  const [frameHi, frameLo] = sexo === 'hombre' ? [10.4, 9.6] : [11.0, 10.1];

  let ecto = 0, meso = 0, endo = 0;
  if (imc < 18.5)     { ecto += 3; }
  else if (imc < 20)  { ecto += 2; meso += 1; }
  else if (imc < 23)  { meso += 3; }
  else if (imc < 26)  { meso += 1; endo += 2; }
  else                { endo += 3; }

  if (indiceMuneca > frameHi)       ecto += 2;
  else if (indiceMuneca >= frameLo) meso += 1;
  else                              endo += 2;

  const total = (ecto + meso + endo) || 1;
  const puntaje = {
    ecto: Math.round(ecto / total * 10) / 10,
    meso: Math.round(meso / total * 10) / 10,
    endo: Math.round(endo / total * 10) / 10,
  };

  if (ecto > meso && ecto > endo)
    return { tipo: 'ectomorfo',  tipoNombre: 'Ectomorfo',      descripcion: 'Complexión delgada, metabolismo rápido, dificultad para ganar masa muscular.', puntaje, recomendaciones: { dieta: 'Superávit calórico (+300–500 kcal). Alta proteína (2–2.5 g/kg). Carbohidratos abundantes.', entreno: 'Prioriza la fuerza con progresión lineal. Limita el cardio. Descansa suficiente.' } };
  if (meso > ecto && meso > endo)
    return { tipo: 'mesomorfo',  tipoNombre: 'Mesomorfo',      descripcion: 'Complexión atlética, responde bien al entrenamiento, mantiene el peso con facilidad.', puntaje, recomendaciones: { dieta: 'Calorías según objetivo. Proteína 1.8–2.2 g/kg. Balance de macros flexible.', entreno: 'Alta versatilidad: combina fuerza, hipertrofia y cardio según tu objetivo.' } };
  if (endo > ecto && endo > meso)
    return { tipo: 'endomorfo',  tipoNombre: 'Endomorfo',      descripcion: 'Complexión robusta, tendencia a acumular grasa fácilmente, metabolismo más lento.', puntaje, recomendaciones: { dieta: 'Déficit moderado (–300–500 kcal). Alta proteína. Controla los carbohidratos refinados.', entreno: 'Combina fuerza con HIIT. Alta frecuencia semanal.' } };
  if (ecto >= meso)
    return { tipo: 'ecto_meso',  tipoNombre: 'Ecto-Mesomorfo', descripcion: 'Delgado con buena base muscular. Responde bien a la fuerza sin acumular grasa.', puntaje, recomendaciones: { dieta: 'Superávit leve (+200–300 kcal). Proteína 2–2.5 g/kg.', entreno: 'Fuerza con volumen moderado. Mínimo cardio.' } };
  return   { tipo: 'endo_meso',  tipoNombre: 'Endo-Mesomorfo', descripcion: 'Complexión grande con buena musculatura. Gana fácilmente músculo y grasa.', puntaje, recomendaciones: { dieta: 'Calorías controladas. Alta proteína. Déficit moderado para definir.', entreno: 'Combina fuerza e intervalos. Monitorea la ingesta total.' } };
}

// ─── RIESGO CARDIOVASCULAR (Framingham simplificado) ──────────────────────
interface RiesgoCardiovascularParams {
  edad:         number;
  sexo:         'hombre' | 'mujer';
  sistolica:    number;
  imc:          number;
  fumador:      boolean;
  diabetes:     boolean;
  antecedentes: boolean;
}

export interface RiesgoCardiovascularResult {
  riesgo10Anios:  number;
  categoria:      'bajo' | 'moderado' | 'alto' | 'muy_alto';
  categoriaNombre: string;
  color:          string;
  recomendacion:  string;
}

export function calcularRiesgoCardiovascular(params: RiesgoCardiovascularParams): RiesgoCardiovascularResult {
  const { edad, sexo, sistolica, imc, fumador, diabetes, antecedentes } = params;

  let pts = 0;
  const tablaEdadH: [number, number][] = [[30,0],[35,2],[40,5],[45,7],[50,8],[55,10],[60,11],[65,12],[70,14],[75,15]];
  const tablaEdadM: [number, number][] = [[30,0],[35,2],[40,4],[45,5],[50,7],[55,8],[60,9],[65,10],[70,11],[75,12]];
  for (const [e, p] of (sexo === 'hombre' ? tablaEdadH : tablaEdadM)) { if (edad >= e) pts = p; }

  if (imc >= 30) pts += 2; else if (imc >= 25) pts += 1;
  if (sistolica >= 160) pts += 3; else if (sistolica >= 140) pts += 2; else if (sistolica >= 130) pts += 1; else if (sistolica < 120) pts -= 2;
  if (fumador)      pts += sexo === 'hombre' ? 4 : 3;
  if (diabetes)     pts += sexo === 'hombre' ? 3 : 4;
  if (antecedentes) pts += 2;

  const tablaRH: [number, number][] = [[3,1],[5,2],[7,3],[9,5],[11,8],[13,12],[15,20],[17,31]];
  const tablaRM: [number, number][] = [[-1,1],[1,2],[3,3],[5,5],[7,7],[9,11],[11,18],[13,27]];
  let r10 = 1;
  for (const [p, r] of (sexo === 'hombre' ? tablaRH : tablaRM)) { if (pts >= p) r10 = r; }
  const riesgo10Anios = Math.min(r10, 40);

  if (riesgo10Anios < 5)  return { riesgo10Anios, categoria: 'bajo',     categoriaNombre: 'Riesgo bajo',     color: '#34D399', recomendacion: 'Mantenga sus hábitos saludables. Control cada 5 años.' };
  if (riesgo10Anios < 10) return { riesgo10Anios, categoria: 'moderado', categoriaNombre: 'Riesgo moderado', color: '#CAFF00', recomendacion: 'Mejore dieta y actividad física. Control anual recomendado.' };
  if (riesgo10Anios < 20) return { riesgo10Anios, categoria: 'alto',     categoriaNombre: 'Riesgo alto',     color: '#FB923C', recomendacion: 'Consulte a su médico. Posible necesidad de tratamiento.' };
  return                    { riesgo10Anios, categoria: 'muy_alto', categoriaNombre: 'Riesgo muy alto', color: '#F87171', recomendacion: 'Atención médica urgente. Tratamiento intensivo recomendado.' };
}

// ─── ÍNDICE DE ADIPOSIDAD CORPORAL (BAI) ──────────────────────────────────
export interface BAIResult {
  bai:       number;
  categoria: string;
  riesgo:    'bajo' | 'normal' | 'sobrepeso' | 'obeso';
  color:     string;
}

export function calcularBAI(alturaCm: number, caderaCm: number, sexo: 'hombre' | 'mujer'): BAIResult {
  const bai = Math.round((caderaCm / ((alturaCm / 100) ** 1.5) - 18) * 10) / 10;
  if (sexo === 'hombre') {
    if (bai < 8)  return { bai, categoria: 'Bajo peso', riesgo: 'bajo',      color: '#60A5FA' };
    if (bai < 21) return { bai, categoria: 'Normal',    riesgo: 'normal',    color: '#34D399' };
    if (bai < 26) return { bai, categoria: 'Sobrepeso', riesgo: 'sobrepeso', color: '#CAFF00' };
    return               { bai, categoria: 'Obesidad',  riesgo: 'obeso',     color: '#F87171' };
  } else {
    if (bai < 21) return { bai, categoria: 'Bajo peso', riesgo: 'bajo',      color: '#60A5FA' };
    if (bai < 33) return { bai, categoria: 'Normal',    riesgo: 'normal',    color: '#34D399' };
    if (bai < 39) return { bai, categoria: 'Sobrepeso', riesgo: 'sobrepeso', color: '#CAFF00' };
    return               { bai, categoria: 'Obesidad',  riesgo: 'obeso',     color: '#F87171' };
  }
}

// ─── VOLUMEN DE ENTRENAMIENTO SEMANAL ─────────────────────────────────────
export type NivelExperiencia = 'principiante' | 'intermedio' | 'avanzado';

export interface GrupoMuscularVolumen {
  nombre:      string;
  mev:         number;
  mrv:         number;
  recomendado: number;
}

export interface VolumenEntrenamientoResult {
  grupos:          GrupoMuscularVolumen[];
  totalSetsSemana: number;
  recomendacion:   string;
}

export function calcularVolumenEntrenamiento(
  nivel:          NivelExperiencia,
  diasPorSemana:  number,
): VolumenEntrenamientoResult {
  const nivelF: Record<NivelExperiencia, number> = { principiante: 0.7, intermedio: 1.0, avanzado: 1.3 };
  const factor = nivelF[nivel] * Math.min(1, diasPorSemana / 4);

  const base = [
    { nombre: 'Pecho',          mevB: 10, mrvB: 20 },
    { nombre: 'Espalda',        mevB: 10, mrvB: 25 },
    { nombre: 'Hombros',        mevB:  8, mrvB: 20 },
    { nombre: 'Bíceps',         mevB:  8, mrvB: 20 },
    { nombre: 'Tríceps',        mevB:  6, mrvB: 18 },
    { nombre: 'Cuádriceps',     mevB:  8, mrvB: 20 },
    { nombre: 'Isquiotibiales', mevB:  6, mrvB: 20 },
    { nombre: 'Glúteos',        mevB:  4, mrvB: 16 },
    { nombre: 'Abdominales',    mevB:  6, mrvB: 16 },
    { nombre: 'Pantorrillas',   mevB:  8, mrvB: 16 },
  ];

  const grupos = base.map(({ nombre, mevB, mrvB }) => {
    const mev = Math.max(4, Math.round(mevB * factor));
    const mrv = Math.max(6, Math.round(mrvB * factor));
    return { nombre, mev, mrv, recomendado: Math.round((mev + mrv) / 2) };
  });

  const recMap: Record<NivelExperiencia, string> = {
    principiante: 'Comienza con el volumen mínimo efectivo (MEV) y auméntalo gradualmente. La consistencia supera al volumen.',
    intermedio:   'Trabaja entre el MEV y el MRV. Sube el volumen progresivamente cada mesociclo de 4–6 semanas.',
    avanzado:     'Acércate al MRV en fases de acumulación y alterna con semanas de descarga para optimizar la recuperación.',
  };

  return { grupos, totalSetsSemana: grupos.reduce((s, g) => s + g.recomendado, 0), recomendacion: recMap[nivel] };
}

// ─── TIEMPO DE SUEÑO ───────────────────────────────────────────────────────
export interface CicloSueno {
  horaDormir: string;
  ciclos:     number;
  horas:      number;
  calidad:    'Mínimo' | 'Recomendado' | 'Óptimo' | 'Excesivo';
}

export function calcularSueno(horaDespertar: string): CicloSueno[] {
  const [hStr, mStr] = horaDespertar.split(':');
  const hDespertar = parseInt(hStr, 10);
  const mDespertar = parseInt(mStr, 10);

  const totalMinutosDespertar = hDespertar * 60 + mDespertar;
  const CICLO_MIN = 90;
  const DORMIRSE_MIN = 15;

  const calidades: CicloSueno['calidad'][] = ['Mínimo', 'Mínimo', 'Recomendado', 'Óptimo', 'Óptimo', 'Excesivo'];

  return [4, 5, 6, 7, 8, 9].map((ciclos, i) => {
    const minutosNecesarios = ciclos * CICLO_MIN + DORMIRSE_MIN;
    let minutosDormir = totalMinutosDespertar - minutosNecesarios;
    if (minutosDormir < 0) minutosDormir += 1440;

    const hDormir = Math.floor(minutosDormir / 60) % 24;
    const mDormir = minutosDormir % 60;

    const hh = String(hDormir).padStart(2, '0');
    const mm = String(mDormir).padStart(2, '0');

    return {
      horaDormir: `${hh}:${mm}`,
      ciclos,
      horas: Math.round((ciclos * CICLO_MIN) / 60 * 10) / 10,
      calidad: calidades[i]!,
    };
  });
}

// ─── GLUCOSA EN SANGRE ────────────────────────────────────────────────────────
export type TipoMedicionGlucosa = 'ayunas' | 'postprandial' | 'hba1c';

export interface GlucosaResult {
  valor:        number;
  categoria:    string;
  riesgo:       'normal' | 'prediabetes' | 'diabetes';
  color:        string;
  recomendacion: string;
}

export function calcularGlucosa(valor: number, tipo: TipoMedicionGlucosa): GlucosaResult {
  if (tipo === 'ayunas') {
    if (valor < 100) return { valor, categoria: 'Normal',       riesgo: 'normal',      color: '#34D399', recomendacion: 'Glucosa en ayunas normal. Mantén hábitos saludables y control anual.' };
    if (valor < 126) return { valor, categoria: 'Prediabetes',  riesgo: 'prediabetes', color: '#FB923C', recomendacion: 'Glucosa elevada. Cambia dieta, aumenta actividad física y consulta a tu médico.' };
    return             { valor, categoria: 'Diabetes',      riesgo: 'diabetes',    color: '#F87171', recomendacion: 'Valor diagnóstico de diabetes. Consulta a tu médico de inmediato.' };
  }
  if (tipo === 'postprandial') {
    if (valor < 140) return { valor, categoria: 'Normal',      riesgo: 'normal',      color: '#34D399', recomendacion: 'Respuesta glucémica normal tras la comida.' };
    if (valor < 200) return { valor, categoria: 'Prediabetes', riesgo: 'prediabetes', color: '#FB923C', recomendacion: 'Tolerancia a la glucosa alterada. Reduce los carbohidratos refinados y consulta a tu médico.' };
    return             { valor, categoria: 'Diabetes',     riesgo: 'diabetes',    color: '#F87171', recomendacion: 'Valor diagnóstico de diabetes. Consulta a tu médico de inmediato.' };
  }
  // HbA1c (%)
  if (valor < 5.7) return { valor, categoria: 'Normal',      riesgo: 'normal',      color: '#34D399', recomendacion: 'HbA1c normal. Mantén hábitos saludables.' };
  if (valor < 6.5) return { valor, categoria: 'Prediabetes', riesgo: 'prediabetes', color: '#FB923C', recomendacion: 'HbA1c elevada. Modifica dieta y actividad física. Control cada 6 meses.' };
  return             { valor, categoria: 'Diabetes',     riesgo: 'diabetes',    color: '#F87171', recomendacion: 'HbA1c en rango diagnóstico de diabetes. Consulta a tu médico de inmediato.' };
}

// ─── COLESTEROL ───────────────────────────────────────────────────────────────
export interface ColesterolResult {
  ldl:        number;
  noHdl:      number;
  ratioTotal: number;
  clasificacion: {
    total:        { valor: number; categoria: string; color: string };
    hdl:          { valor: number; categoria: string; color: string };
    ldl:          { valor: number; categoria: string; color: string };
    trigliceridos:{ valor: number; categoria: string; color: string };
  };
  riesgo:        'optimo' | 'normal' | 'limite' | 'alto' | 'muy_alto';
  riesgoNombre:  string;
  color:         string;
  recomendacion: string;
}

export function calcularColesterol(
  total:        number,
  hdl:          number,
  trigliceridos: number,
  sexo:         'hombre' | 'mujer',
): ColesterolResult {
  const ldl    = Math.round(total - hdl - trigliceridos / 5);
  const noHdl  = total - hdl;
  const ratioTotal = Math.round((total / hdl) * 10) / 10;

  const clTotal =
    total < 200 ? { valor: total, categoria: 'Deseable',      color: '#34D399' } :
    total < 240 ? { valor: total, categoria: 'Límite alto',   color: '#FB923C' } :
                  { valor: total, categoria: 'Alto',           color: '#F87171' };

  const hdlMin = sexo === 'mujer' ? 50 : 40;
  const clHDL =
    hdl >= 60                      ? { valor: hdl, categoria: 'Protector',     color: '#34D399' } :
    hdl >= hdlMin                  ? { valor: hdl, categoria: 'Normal',         color: '#CAFF00' } :
                                     { valor: hdl, categoria: 'Bajo (riesgo)',  color: '#F87171' };

  const clLDL =
    ldl < 100 ? { valor: ldl, categoria: 'Óptimo',      color: '#34D399' } :
    ldl < 130 ? { valor: ldl, categoria: 'Casi óptimo', color: '#CAFF00' } :
    ldl < 160 ? { valor: ldl, categoria: 'Límite alto', color: '#FB923C' } :
    ldl < 190 ? { valor: ldl, categoria: 'Alto',         color: '#F87171' } :
                { valor: ldl, categoria: 'Muy alto',     color: '#EF4444' };

  const clTG =
    trigliceridos < 150  ? { valor: trigliceridos, categoria: 'Normal',       color: '#34D399' } :
    trigliceridos < 200  ? { valor: trigliceridos, categoria: 'Límite alto',  color: '#FB923C' } :
    trigliceridos < 500  ? { valor: trigliceridos, categoria: 'Alto',          color: '#F87171' } :
                           { valor: trigliceridos, categoria: 'Muy alto',      color: '#EF4444' };

  let riesgo: ColesterolResult['riesgo'];
  let riesgoNombre: string;
  let color: string;
  let recomendacion: string;
  if (ldl < 100 && hdl >= 60) { riesgo = 'optimo';   riesgoNombre = 'Perfil óptimo';    color = '#34D399'; recomendacion = 'Perfil lipídico óptimo. Mantén tu dieta y actividad física.'; }
  else if (ldl < 130)         { riesgo = 'normal';   riesgoNombre = 'Perfil normal';    color = '#CAFF00'; recomendacion = 'Perfil dentro del rango normal. Control anual recomendado.'; }
  else if (ldl < 160)         { riesgo = 'limite';   riesgoNombre = 'Límite alto';      color = '#FB923C'; recomendacion = 'LDL en el límite. Mejora la dieta y consulta a tu médico.'; }
  else if (ldl < 190)         { riesgo = 'alto';     riesgoNombre = 'Riesgo alto';      color = '#F87171'; recomendacion = 'LDL elevado. Es probable que necesites tratamiento médico.'; }
  else                        { riesgo = 'muy_alto'; riesgoNombre = 'Riesgo muy alto';  color = '#EF4444'; recomendacion = 'LDL muy elevado. Consulta a tu médico de inmediato.'; }

  return { ldl, noHdl, ratioTotal, clasificacion: { total: clTotal, hdl: clHDL, ldl: clLDL, trigliceridos: clTG }, riesgo, riesgoNombre, color, recomendacion };
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

// ─── RECUPERACIÓN CARDÍACA ────────────────────────────────────────────────────
export interface RecuperacionCardiacaResult {
  diferencia:    number;
  categoria:     string;
  riesgo:        'excelente' | 'normal' | 'bajo' | 'anormal';
  color:         string;
  recomendacion: string;
}

export function calcularRecuperacionCardiaca(fcPico: number, fc1Min: number): RecuperacionCardiacaResult {
  const diferencia = fcPico - fc1Min;
  if (diferencia >= 22) return { diferencia, categoria: 'Excelente', riesgo: 'excelente', color: '#34D399', recomendacion: 'Recuperación cardíaca excelente. Indica alta aptitud cardiovascular aeróbica.' };
  if (diferencia >= 12) return { diferencia, categoria: 'Normal',    riesgo: 'normal',    color: '#CAFF00', recomendacion: 'Recuperación dentro del rango normal. Mantén la actividad aeróbica regular.' };
  if (diferencia >= 0)  return { diferencia, categoria: 'Baja',      riesgo: 'bajo',      color: '#FB923C', recomendacion: 'Recuperación lenta. Mejora tu condición aeróbica y consulta con un médico.' };
  return                        { diferencia, categoria: 'Anormal',   riesgo: 'anormal',   color: '#F87171', recomendacion: 'La FC aumentó tras el ejercicio. Signo de alarma — consulta a tu médico.' };
}

// ─── TEMPERATURA CORPORAL ─────────────────────────────────────────────────────
export type UnidadTemperatura = 'c' | 'f';

export interface TemperaturaCorporalResult {
  valorC:        number;
  valorF:        number;
  categoria:     string;
  riesgo:        'hipotermia_grave' | 'hipotermia_leve' | 'normal' | 'febricula' | 'fiebre' | 'fiebre_alta' | 'hiperpirexia';
  color:         string;
  recomendacion: string;
}

export function calcularTemperaturaCorporal(valor: number, unidad: UnidadTemperatura): TemperaturaCorporalResult {
  const valorC = unidad === 'f' ? Math.round((valor - 32) / 1.8 * 10) / 10 : valor;
  const valorF = unidad === 'c' ? Math.round((valor * 1.8 + 32) * 10) / 10 : valor;
  if (valorC < 32)   return { valorC, valorF, categoria: 'Hipotermia grave', riesgo: 'hipotermia_grave', color: '#60A5FA', recomendacion: 'Emergencia médica. Llama a urgencias de inmediato.' };
  if (valorC < 35)   return { valorC, valorF, categoria: 'Hipotermia leve',  riesgo: 'hipotermia_leve',  color: '#93C5FD', recomendacion: 'Hipotermia. Calienta gradualmente y busca atención médica.' };
  if (valorC <= 37.5)return { valorC, valorF, categoria: 'Normal',           riesgo: 'normal',           color: '#34D399', recomendacion: 'Temperatura corporal normal. Sin acción requerida.' };
  if (valorC <= 38)  return { valorC, valorF, categoria: 'Febrícula',        riesgo: 'febricula',        color: '#CAFF00', recomendacion: 'Temperatura ligeramente elevada. Reposo, hidratación y monitoreo.' };
  if (valorC <= 39)  return { valorC, valorF, categoria: 'Fiebre',           riesgo: 'fiebre',           color: '#FB923C', recomendacion: 'Fiebre moderada. Hidratación y antitérmico si hay malestar. Consultar si persiste.' };
  if (valorC <= 40)  return { valorC, valorF, categoria: 'Fiebre alta',      riesgo: 'fiebre_alta',      color: '#EF4444', recomendacion: 'Fiebre alta. Antitérmico y consulta médica urgente.' };
  return               { valorC, valorF, categoria: 'Hiperpirexia',      riesgo: 'hiperpirexia',      color: '#DC2626', recomendacion: 'Temperatura peligrosamente alta. Emergencia médica inmediata.' };
}

// ─── CARGA GLUCÉMICA ──────────────────────────────────────────────────────────
export interface CargaGlucemicaResult {
  cargaGlucemica: number;
  categoria:      'baja' | 'media' | 'alta';
  categoriaNombre: string;
  color:          string;
  recomendacion:  string;
}

export function calcularCargaGlucemica(indiceGlucemico: number, carbohidratosG: number): CargaGlucemicaResult {
  const cargaGlucemica = Math.round((indiceGlucemico * carbohidratosG) / 100 * 10) / 10;
  if (cargaGlucemica < 10) return { cargaGlucemica, categoria: 'baja',  categoriaNombre: 'Carga baja',  color: '#34D399', recomendacion: 'Impacto glucémico bajo. Adecuado para la mayoría, incluyendo personas con diabetes.' };
  if (cargaGlucemica < 20) return { cargaGlucemica, categoria: 'media', categoriaNombre: 'Carga media', color: '#CAFF00', recomendacion: 'Impacto glucémico moderado. Consume con moderación si controlas el azúcar en sangre.' };
  return                     { cargaGlucemica, categoria: 'alta',  categoriaNombre: 'Carga alta',  color: '#F87171', recomendacion: 'Impacto glucémico elevado. Limita su consumo, especialmente si eres diabético o prediabético.' };
}

// ─── GANANCIA DE PESO EN EL EMBARAZO (IOM 2009) ───────────────────────────────
export interface PesoEmbarazoResult {
  imc:                  number;
  categoriaImc:         string;
  gananciaTotalMin:     number;
  gananciaTotalMax:     number;
  gananciaSemanaMin:    number;
  gananciaSemanaMax:    number;
  gananciaAcumuladaMin: number;
  gananciaAcumuladaMax: number;
  dentroRango:          boolean | null;
}

export function calcularPesoEmbarazo(
  pesoPreKg:     number,
  alturaCm:      number,
  semanaActual:  number,
  pesoActualKg?: number,
): PesoEmbarazoResult {
  const alturaM = alturaCm / 100;
  const imc     = Math.round((pesoPreKg / (alturaM ** 2)) * 10) / 10;

  let categoriaImc: string, ganTMin: number, ganTMax: number, ganSMin: number, ganSMax: number;
  if (imc < 18.5)      { categoriaImc = 'Bajo peso';  ganTMin = 12.5; ganTMax = 18;   ganSMin = 0.44; ganSMax = 0.58; }
  else if (imc < 25)   { categoriaImc = 'Normal';     ganTMin = 11.5; ganTMax = 16;   ganSMin = 0.35; ganSMax = 0.50; }
  else if (imc < 30)   { categoriaImc = 'Sobrepeso';  ganTMin = 7;    ganTMax = 11.5; ganSMin = 0.23; ganSMax = 0.33; }
  else                 { categoriaImc = 'Obesidad';   ganTMin = 5;    ganTMax = 9;    ganSMin = 0.17; ganSMax = 0.27; }

  const sT2y3 = Math.max(0, semanaActual - 13);
  const acumMin = Math.round((Math.min(semanaActual, 13) * (2 / 13) + sT2y3 * ganSMin) * 10) / 10;
  const acumMax = Math.round((Math.min(semanaActual, 13) * (2 / 13) + sT2y3 * ganSMax) * 10) / 10;

  let dentroRango: boolean | null = null;
  if (pesoActualKg !== undefined) {
    const ganReal = pesoActualKg - pesoPreKg;
    dentroRango   = ganReal >= acumMin && ganReal <= acumMax;
  }

  return { imc, categoriaImc, gananciaTotalMin: ganTMin, gananciaTotalMax: ganTMax, gananciaSemanaMin: ganSMin, gananciaSemanaMax: ganSMax, gananciaAcumuladaMin: acumMin, gananciaAcumuladaMax: acumMax, dentroRango };
}

// ─── PRESIÓN DE PULSO ─────────────────────────────────────────────────────────
export interface PresionPulsoResult {
  pp:            number;
  categoria:     string;
  riesgo:        'muy_baja' | 'baja' | 'normal' | 'elevada' | 'muy_elevada';
  color:         string;
  recomendacion: string;
}

export function calcularPresionPulso(sistolica: number, diastolica: number): PresionPulsoResult {
  const pp = sistolica - diastolica;
  if (pp < 25)  return { pp, categoria: 'Muy baja',     riesgo: 'muy_baja',    color: '#60A5FA', recomendacion: 'PP muy baja. Puede indicar bajo gasto cardíaco. Consulta médica urgente.' };
  if (pp < 40)  return { pp, categoria: 'Baja',         riesgo: 'baja',        color: '#93C5FD', recomendacion: 'PP algo baja. Monitorea junto a otros síntomas y consulta con tu médico.' };
  if (pp <= 60) return { pp, categoria: 'Normal',       riesgo: 'normal',      color: '#34D399', recomendacion: 'Presión de pulso normal (40–60 mmHg). Sin acción requerida.' };
  if (pp <= 80) return { pp, categoria: 'Elevada',      riesgo: 'elevada',     color: '#FB923C', recomendacion: 'PP elevada. Asociada con rigidez arterial. Controla la tensión y consulta.' };
  return          { pp, categoria: 'Muy elevada',  riesgo: 'muy_elevada', color: '#F87171', recomendacion: 'PP muy elevada. Riesgo cardiovascular aumentado. Consulta médica necesaria.' };
}

// ─── TALLA ADULTA PREDICHA (MID-PARENTAL HEIGHT) ─────────────────────────────
export interface TallaPredichResult {
  tallaPredichaCm:    number;
  rangoMinCm:         number;
  rangoMaxCm:         number;
  tallaPredichaPies:  number;
  tallaPredichaPulg:  number;
}

export function calcularTallaPredicha(
  tallaPadreCm: number,
  tallaMadreCm: number,
  sexo:         'hombre' | 'mujer',
): TallaPredichResult {
  const ajuste          = sexo === 'hombre' ? 13 : -13;
  const tallaPredichaCm = Math.round(((tallaPadreCm + tallaMadreCm + ajuste) / 2) * 10) / 10;
  const rangoMinCm      = Math.round((tallaPredichaCm - 8.5) * 10) / 10;
  const rangoMaxCm      = Math.round((tallaPredichaCm + 8.5) * 10) / 10;
  const totalPulg       = tallaPredichaCm / 2.54;
  return {
    tallaPredichaCm,
    rangoMinCm,
    rangoMaxCm,
    tallaPredichaPies: Math.floor(totalPulg / 12),
    tallaPredichaPulg: Math.round(totalPulg % 12),
  };
}

// ─── TEST DE ROCKPORT (1 MILLA) ───────────────────────────────────────────────
export interface TestRockportResult {
  vo2max:    number;
  categoria: string;
  color:     string;
}

export function calcularTestRockport(
  tiempoMin:  number,
  fcFinal:    number,
  pesoKg:     number,
  edadAnios:  number,
  sexo:       'hombre' | 'mujer',
): TestRockportResult {
  const pesoPounds = pesoKg * 2.2046;
  const sexoN      = sexo === 'hombre' ? 1 : 0;
  const vo2max     = Math.round((132.853 - 0.0769 * pesoPounds - 0.3877 * edadAnios + 6.315 * sexoN - 3.2649 * tiempoMin - 0.1565 * fcFinal) * 10) / 10;

  const cortes = sexo === 'hombre'
    ? [35, 42, 49, 56]
    : [28, 34, 41, 48];
  const etiquetas = ['Muy bajo', 'Bajo', 'Promedio', 'Bueno', 'Excelente'];
  const colores   = ['#F87171', '#FB923C', '#CAFF00', '#34D399', '#60A5FA'];
  const idx = vo2max < cortes[0]! ? 0 : vo2max < cortes[1]! ? 1 : vo2max < cortes[2]! ? 2 : vo2max < cortes[3]! ? 3 : 4;

  return { vo2max, categoria: etiquetas[idx]!, color: colores[idx]! };
}

// ─── DOSIS SEGURA DE CAFEÍNA ──────────────────────────────────────────────────
export interface CafeinaResult {
  dosisPorKg:   number;
  nivelConsumo: 'bajo' | 'moderado' | 'alto' | 'excesivo';
  nivelNombre:  string;
  color:        string;
  recomendacion: string;
  equivalencias: { nombre: string; cantidad: number; unidad: string }[];
  maxDiario:    number;
}

export function calcularCafeina(pesoKg: number, consumoMg: number): CafeinaResult {
  const dosisPorKg  = Math.round((consumoMg / pesoKg) * 10) / 10;
  const equivalencias = [
    { nombre: 'Café espresso',      cantidad: Math.round(consumoMg / 63),  unidad: 'tazas' },
    { nombre: 'Café de filtro',     cantidad: Math.round(consumoMg / 95),  unidad: 'tazas' },
    { nombre: 'Red Bull (250 ml)',  cantidad: Math.round(consumoMg / 80),  unidad: 'latas' },
    { nombre: 'Refresco cola (330 ml)', cantidad: Math.round(consumoMg / 35), unidad: 'latas' },
  ];
  if (dosisPorKg < 2) return { dosisPorKg, nivelConsumo: 'bajo',     nivelNombre: 'Bajo',     color: '#34D399', recomendacion: 'Consumo bajo y seguro. Dentro de los límites recomendados por la FDA y EFSA.', equivalencias, maxDiario: 400 };
  if (dosisPorKg < 4) return { dosisPorKg, nivelConsumo: 'moderado', nivelNombre: 'Moderado', color: '#CAFF00', recomendacion: 'Consumo moderado. En el rango de dosis ergogénica para rendimiento deportivo (3–6 mg/kg).', equivalencias, maxDiario: 400 };
  if (dosisPorKg < 6) return { dosisPorKg, nivelConsumo: 'alto',     nivelNombre: 'Alto',     color: '#FB923C', recomendacion: 'Consumo alto. Posibles efectos: insomnio, taquicardia, ansiedad. No superes 400 mg/día.', equivalencias, maxDiario: 400 };
  return                { dosisPorKg, nivelConsumo: 'excesivo',  nivelNombre: 'Excesivo', color: '#F87171', recomendacion: 'Consumo excesivo. Riesgo de toxicidad por cafeína. Reduce la ingesta urgentemente.', equivalencias, maxDiario: 400 };
}

// ─── BATCH 6 ──────────────────────────────────────────────────────────────────

// ─── VAM (VELOCIDAD AERÓBICA MÁXIMA) ─────────────────────────────────────────
export interface ZonaVAM {
  nombre:        string;
  porcentajeMin: number;
  porcentajeMax: number;
  descripcion:   string;
}

export interface VAMResult {
  vam:   number;
  zonas: ZonaVAM[];
}

export function calcularVAM(vo2max: number): VAMResult {
  const vam = Math.round((vo2max / 3.5) * 10) / 10;
  const zonas: ZonaVAM[] = [
    { nombre: 'Recuperación',  porcentajeMin: 60,  porcentajeMax: 70,  descripcion: 'Rodajes suaves. Acelera la recuperación activa sin estrés fisiológico.' },
    { nombre: 'Aeróbico',      porcentajeMin: 70,  porcentajeMax: 80,  descripcion: 'Base aeróbica. Mejora la eficiencia del sistema cardiovascular y la oxidación de grasas.' },
    { nombre: 'Umbral',        porcentajeMin: 80,  porcentajeMax: 90,  descripcion: 'Entrenamiento de umbral anaeróbico. Eleva la VAM y retrasa la fatiga.' },
    { nombre: 'VO₂ máx',      porcentajeMin: 90,  porcentajeMax: 100, descripcion: 'Intervalos de alta intensidad. Maximiza el consumo de oxígeno.' },
    { nombre: 'Supramáximo',   porcentajeMin: 100, porcentajeMax: 120, descripcion: 'Sprints y esfuerzos anaeróbicos. Desarrolla la potencia y tolerancia al lactato.' },
  ];
  return { vam, zonas };
}

// ─── FMI (ÍNDICE DE MASA GRASA) ───────────────────────────────────────────────
export interface FMIResult {
  masaGrasaKg: number;
  fmi:         number;
  categoria:   string;
  riesgo:      string;
  color:       string;
  descripcion: string;
}

export function calcularFMI(pesoKg: number, alturaCm: number, grasaPorcentaje: number): FMIResult {
  const masaGrasaKg = Math.round((pesoKg * grasaPorcentaje / 100) * 10) / 10;
  const alturaM     = alturaCm / 100;
  const fmi         = Math.round((masaGrasaKg / (alturaM * alturaM)) * 10) / 10;

  if (grasaPorcentaje <= 0 || grasaPorcentaje >= 100) {
    return { masaGrasaKg, fmi, categoria: 'Sin datos', riesgo: 'indeterminado', color: '#888', descripcion: 'Introduce un porcentaje de grasa válido.' };
  }

  // Hombres
  const esHombre = false; // se determina externamente en el componente; aquí la lógica usa rangos mixtos
  // Umbrales FMI según Smalley et al. (hombres y mujeres se pasan como parámetro en la función que llama)
  // Para simplificar: la función acepta el porcentaje de grasa y calcula el FMI; la categoría
  // se evalúa externamente en el componente a partir del sexo.
  // Sin embargo para no requerir sexo extra aquí devolvemos categoría genérica por FMI:
  if (fmi < 3)   return { masaGrasaKg, fmi, categoria: 'Muy bajo',   riesgo: 'bajo',      color: '#60A5FA', descripcion: 'FMI muy bajo. Posible déficit de grasa corporal esencial.' };
  if (fmi < 6)   return { masaGrasaKg, fmi, categoria: 'Atlético',   riesgo: 'optimo',    color: '#34D399', descripcion: 'FMI propio de deportistas. Excelente composición corporal.' };
  if (fmi < 13)  return { masaGrasaKg, fmi, categoria: 'Saludable',  riesgo: 'normal',    color: '#CAFF00', descripcion: 'FMI en rango saludable. Buen equilibrio entre masa grasa y masa magra.' };
  if (fmi < 20)  return { masaGrasaKg, fmi, categoria: 'Sobrepeso',  riesgo: 'elevado',   color: '#FB923C', descripcion: 'FMI elevado. Exceso de grasa corporal relativo a la talla.' };
  return           { masaGrasaKg, fmi, categoria: 'Obesidad',   riesgo: 'alto',      color: '#F87171', descripcion: 'FMI en rango de obesidad. Riesgo metabólico y cardiovascular aumentado.' };
}

export function calcularFMIConSexo(pesoKg: number, alturaCm: number, grasaPorcentaje: number, sexo: 'hombre' | 'mujer'): FMIResult {
  const masaGrasaKg = Math.round((pesoKg * grasaPorcentaje / 100) * 10) / 10;
  const alturaM     = alturaCm / 100;
  const fmi         = Math.round((masaGrasaKg / (alturaM * alturaM)) * 10) / 10;

  if (sexo === 'hombre') {
    if (fmi < 3)   return { masaGrasaKg, fmi, categoria: 'Muy bajo',   riesgo: 'bajo',    color: '#60A5FA', descripcion: 'FMI muy bajo. Posible déficit de grasa corporal esencial.' };
    if (fmi < 6)   return { masaGrasaKg, fmi, categoria: 'Atlético',   riesgo: 'optimo',  color: '#34D399', descripcion: 'FMI de deportista. Excelente composición corporal.' };
    if (fmi < 12)  return { masaGrasaKg, fmi, categoria: 'Saludable',  riesgo: 'normal',  color: '#CAFF00', descripcion: 'FMI en rango saludable para hombres.' };
    if (fmi < 18)  return { masaGrasaKg, fmi, categoria: 'Sobrepeso',  riesgo: 'elevado', color: '#FB923C', descripcion: 'Exceso de grasa corporal. Considera dieta y ejercicio.' };
    return           { masaGrasaKg, fmi, categoria: 'Obesidad',   riesgo: 'alto',    color: '#F87171', descripcion: 'FMI en rango de obesidad. Riesgo metabólico y cardiovascular elevado.' };
  } else {
    if (fmi < 8)   return { masaGrasaKg, fmi, categoria: 'Muy bajo',   riesgo: 'bajo',    color: '#60A5FA', descripcion: 'FMI muy bajo. Posible déficit de grasa corporal esencial.' };
    if (fmi < 13)  return { masaGrasaKg, fmi, categoria: 'Atlético',   riesgo: 'optimo',  color: '#34D399', descripcion: 'FMI de deportista. Excelente composición corporal.' };
    if (fmi < 20)  return { masaGrasaKg, fmi, categoria: 'Saludable',  riesgo: 'normal',  color: '#CAFF00', descripcion: 'FMI en rango saludable para mujeres.' };
    if (fmi < 28)  return { masaGrasaKg, fmi, categoria: 'Sobrepeso',  riesgo: 'elevado', color: '#FB923C', descripcion: 'Exceso de grasa corporal. Considera dieta y ejercicio.' };
    return           { masaGrasaKg, fmi, categoria: 'Obesidad',   riesgo: 'alto',    color: '#F87171', descripcion: 'FMI en rango de obesidad. Riesgo metabólico y cardiovascular elevado.' };
  }
}

// ─── CREATINA ─────────────────────────────────────────────────────────────────
export type ProtocoloCreatina = 'carga' | 'directo';

export interface CreatinaResult {
  faseCarga: { dosisGDia: number; dosisPorToma: number; tomas: number; duracionDias: number } | null;
  mantenimiento: { dosisGDia: number };
  diasSaturacion: number;
  pesoCreatinaTotal: number;
  recomendacion: string;
}

export function calcularCreatina(pesoKg: number, protocolo: ProtocoloCreatina): CreatinaResult {
  const dosisCargaDia   = Math.round(pesoKg * 0.3 * 10) / 10;
  const dosisPorToma    = Math.round((pesoKg * 0.075) * 10) / 10;
  const pesoCreatinaTotal = Math.round(dosisCargaDia * 5 * 10) / 10;

  if (protocolo === 'carga') {
    return {
      faseCarga: { dosisGDia: dosisCargaDia, dosisPorToma, tomas: 4, duracionDias: 5 },
      mantenimiento: { dosisGDia: 5 },
      diasSaturacion: 5,
      pesoCreatinaTotal,
      recomendacion: `Fase de carga: ${dosisCargaDia} g/día repartidos en 4 tomas de ${dosisPorToma} g durante 5 días, seguidos de 5 g/día de mantenimiento. Los músculos se saturan en 5–7 días.`,
    };
  } else {
    return {
      faseCarga: null,
      mantenimiento: { dosisGDia: 5 },
      diasSaturacion: 28,
      pesoCreatinaTotal: 0,
      recomendacion: 'Protocolo directo: 5 g/día de forma continua. Los músculos alcanzan la saturación en aproximadamente 28 días sin los posibles efectos gastrointestinales de la carga.',
    };
  }
}

// ─── RITMO DE MARATÓN ─────────────────────────────────────────────────────────
export interface SplitMaraton {
  km:              number;
  tiempoAcumulado: string;
  ritmo:           string;
}

export interface RitmoMaratonResult {
  ritmoSegKm:         number;
  ritmoStr:           string;
  ritmoMinMilla:      string;
  velocidadKmh:       number;
  splits:             SplitMaraton[];
  tiempoMediaMaraton: string;
  tiempoTotal:        string;
}

function segsAStr(totalSegs: number): string {
  const h = Math.floor(totalSegs / 3600);
  const m = Math.floor((totalSegs % 3600) / 60);
  const s = Math.round(totalSegs % 60);
  const hh = String(h).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function calcularRitmoMaraton(horasObj: number, minutosObj: number, segundosObj: number): RitmoMaratonResult {
  const totalSegundos = horasObj * 3600 + minutosObj * 60 + segundosObj;
  const ritmoSegKm    = Math.round(totalSegundos / 42.195 * 10) / 10;
  const ritmoMins     = Math.floor(ritmoSegKm / 60);
  const ritmoSegs     = Math.round(ritmoSegKm % 60);
  const ritmoStr      = `${ritmoMins}:${String(ritmoSegs).padStart(2, '0')} min/km`;

  const milla = ritmoSegKm * 1.60934;
  const mMins = Math.floor(milla / 60);
  const mSegs = Math.round(milla % 60);
  const ritmoMinMilla = `${mMins}:${String(mSegs).padStart(2, '0')} min/milla`;

  const velocidadKmh = Math.round((3600 / ritmoSegKm) * 10) / 10;

  const puntosKm = [5, 10, 15, 20, 21.1, 25, 30, 35, 40, 42.195];
  const splits: SplitMaraton[] = puntosKm.map(km => ({
    km,
    tiempoAcumulado: segsAStr(Math.round(km * ritmoSegKm)),
    ritmo: ritmoStr,
  }));

  return {
    ritmoSegKm,
    ritmoStr,
    ritmoMinMilla,
    velocidadKmh,
    splits,
    tiempoMediaMaraton: segsAStr(Math.round(21.1 * ritmoSegKm)),
    tiempoTotal:        segsAStr(totalSegundos),
  };
}

// ─── FINDRISC (RIESGO DE DIABETES TIPO 2) ────────────────────────────────────
export interface RespuestasFINDRISC {
  edad:              'menos45' | '45a54' | '55a64' | 'mas65';
  imc:               'menos25' | '25a30' | 'mas30';
  cintura:           'normal' | 'elevada' | 'muy_elevada';
  actividadFisica:   boolean;
  frutasVerduras:    boolean;
  medicacionTA:      boolean;
  glucosaAlta:       boolean;
  familiarDiabetes:  'no' | 'segundo_grado' | 'primer_grado';
}

export interface FINDRISCResult {
  puntuacion:    number;
  categoria:     string;
  probabilidad:  string;
  color:         string;
  riesgo:        string;
  recomendacion: string;
}

export function calcularFINDRISC(resp: RespuestasFINDRISC, sexo: 'hombre' | 'mujer'): FINDRISCResult {
  let pts = 0;

  // Edad
  if (resp.edad === '45a54')  pts += 2;
  else if (resp.edad === '55a64')  pts += 3;
  else if (resp.edad === 'mas65')  pts += 4;

  // IMC
  if (resp.imc === '25a30')   pts += 1;
  else if (resp.imc === 'mas30')   pts += 3;

  // Cintura (hombres: normal <94, elevada 94–102, muy_elevada >102; mujeres: <80, 80–88, >88)
  if (resp.cintura === 'elevada')       pts += 3;
  else if (resp.cintura === 'muy_elevada') pts += 4;

  // Actividad física (No = +2)
  if (!resp.actividadFisica) pts += 2;

  // Frutas y verduras (No = +1)
  if (!resp.frutasVerduras)  pts += 1;

  // Medicación para tensión arterial
  if (resp.medicacionTA)     pts += 2;

  // Glucosa alta previa
  if (resp.glucosaAlta)      pts += 5;

  // Antecedentes familiares
  if (resp.familiarDiabetes === 'segundo_grado') pts += 3;
  else if (resp.familiarDiabetes === 'primer_grado')   pts += 5;

  if (pts <= 7)  return { puntuacion: pts, categoria: 'Bajo',              probabilidad: '1 de cada 100',  color: '#34D399', riesgo: 'bajo',         recomendacion: 'Riesgo bajo de desarrollar diabetes tipo 2. Mantén hábitos saludables y realiza controles periódicos.' };
  if (pts <= 11) return { puntuacion: pts, categoria: 'Ligeramente elevado', probabilidad: '1 de cada 25', color: '#CAFF00', riesgo: 'leve',          recomendacion: 'Riesgo ligeramente elevado. Mejora tu dieta, aumenta la actividad física y realiza una glucemia en ayunas.' };
  if (pts <= 14) return { puntuacion: pts, categoria: 'Moderado',          probabilidad: '1 de cada 6',    color: '#FB923C', riesgo: 'moderado',      recomendacion: 'Riesgo moderado. Consulta con tu médico para una evaluación metabólica completa y cambios en el estilo de vida.' };
  if (pts <= 20) return { puntuacion: pts, categoria: 'Alto',              probabilidad: '1 de cada 3',    color: '#F87171', riesgo: 'alto',          recomendacion: 'Riesgo alto. Es probable que ya tengas glucosa alterada o diabetes no diagnosticada. Consulta a tu médico urgentemente.' };
  return           { puntuacion: pts, categoria: 'Muy alto',           probabilidad: '1 de cada 2',    color: '#DC2626', riesgo: 'muy_alto',      recomendacion: 'Riesgo muy alto. Probabilidad del 50% de tener diabetes tipo 2 no diagnosticada. Busca atención médica de inmediato.' };
}

// ─── ÍNDICE DE CONICIDAD ──────────────────────────────────────────────────────
export interface IndiceConicidadResult {
  ic:            number;
  categoria:     string;
  riesgo:        string;
  color:         string;
  recomendacion: string;
}

export function calcularIndiceConicidad(
  cinturaCm: number,
  pesoKg:    number,
  alturaCm:  number,
  sexo:      'hombre' | 'mujer',
): IndiceConicidadResult {
  const alturaM = alturaCm / 100;
  const ic = Math.round((cinturaCm / 100 / (0.109 * Math.sqrt(pesoKg / alturaM))) * 1000) / 1000;

  if (sexo === 'hombre') {
    if (ic < 1.25) return { ic, categoria: 'Bajo riesgo',      riesgo: 'bajo',     color: '#34D399', recomendacion: 'Distribución de grasa favorable. Riesgo cardiovascular bajo.' };
    if (ic < 1.35) return { ic, categoria: 'Riesgo moderado',  riesgo: 'moderado', color: '#FB923C', recomendacion: 'Riesgo moderado. Considera reducir la grasa abdominal con ejercicio y dieta.' };
    return           { ic, categoria: 'Riesgo alto',       riesgo: 'alto',     color: '#F87171', recomendacion: 'Riesgo cardiovascular elevado. Consulta con tu médico y mejora tu composición corporal.' };
  } else {
    if (ic < 1.18) return { ic, categoria: 'Bajo riesgo',      riesgo: 'bajo',     color: '#34D399', recomendacion: 'Distribución de grasa favorable. Riesgo cardiovascular bajo.' };
    if (ic < 1.28) return { ic, categoria: 'Riesgo moderado',  riesgo: 'moderado', color: '#FB923C', recomendacion: 'Riesgo moderado. Considera reducir la grasa abdominal con ejercicio y dieta.' };
    return           { ic, categoria: 'Riesgo alto',       riesgo: 'alto',     color: '#F87171', recomendacion: 'Riesgo cardiovascular elevado. Consulta con tu médico y mejora tu composición corporal.' };
  }
}

// ─── CALORÍAS EN BEBIDAS ALCOHÓLICAS ─────────────────────────────────────────
export interface BebidaItem {
  nombre:      string;
  cantidad:    number;
  kcalUnitaria: number;
  kcalTotal:   number;
  alcoholG:    number;
}

export interface CaloriasBedidasResult {
  totalKcal:    number;
  totalAlcoholG: number;
  desglose:     BebidaItem[];
  equivalencias: { actividad: string; minutos: number }[];
}

export function calcularCaloriasBebidas(
  cervezas:  number,
  vinos:     number,
  licores:   number,
  cocktails: number,
): CaloriasBedidasResult {
  const bebidas: BebidaItem[] = [
    { nombre: 'Cerveza (330 ml 5%)',   cantidad: cervezas,  kcalUnitaria: 153, kcalTotal: cervezas * 153,  alcoholG: cervezas * 13   },
    { nombre: 'Vino (150 ml 12%)',     cantidad: vinos,     kcalUnitaria: 123, kcalTotal: vinos * 123,     alcoholG: vinos * 14.4    },
    { nombre: 'Licor/copa (40 ml 40%)',cantidad: licores,   kcalUnitaria: 95,  kcalTotal: licores * 95,    alcoholG: licores * 12.6  },
    { nombre: 'Cocktail (200 ml 10%)', cantidad: cocktails, kcalUnitaria: 142, kcalTotal: cocktails * 142, alcoholG: cocktails * 16  },
  ].filter(b => b.cantidad > 0);

  const totalKcal     = Math.round(bebidas.reduce((s, b) => s + b.kcalTotal, 0));
  const totalAlcoholG = Math.round(bebidas.reduce((s, b) => s + b.alcoholG, 0) * 10) / 10;

  const equivalencias = [
    { actividad: 'Caminar',   minutos: Math.round(totalKcal / 4) },
    { actividad: 'Correr',    minutos: Math.round(totalKcal / 10) },
    { actividad: 'Ciclismo',  minutos: Math.round(totalKcal / 8) },
  ];

  return { totalKcal, totalAlcoholG, desglose: bebidas, equivalencias };
}

// ─── TASA DE SUDORACIÓN ───────────────────────────────────────────────────────
export interface TasaSudoracionResult {
  tasaMLhora:          number;
  perdidaPorcentaje:   number;
  recomendacionMLhora: number;
  estado:              string;
  color:               string;
  recomendacion:       string;
}

export function calcularTasaSudoracion(
  pesoAntesKg:   number,
  pesoDespuesKg: number,
  fluidosLitros: number,
  duracionMin:   number,
): TasaSudoracionResult {
  const perdidaKg     = pesoAntesKg - pesoDespuesKg;
  const tasaMLhora    = Math.round(((perdidaKg * 1000 + fluidosLitros * 1000) / (duracionMin / 60)));
  const perdidaPorcentaje = Math.round((perdidaKg / pesoAntesKg) * 1000) / 10;
  const recomendacionMLhora = tasaMLhora;

  if (tasaMLhora < 500)  return { tasaMLhora, perdidaPorcentaje, recomendacionMLhora, estado: 'Muy baja',   color: '#60A5FA', recomendacion: 'Tasa de sudoración muy baja. Es posible que el esfuerzo o las condiciones ambientales sean leves.' };
  if (tasaMLhora < 1000) return { tasaMLhora, perdidaPorcentaje, recomendacionMLhora, estado: 'Baja',       color: '#34D399', recomendacion: 'Tasa de sudoración baja. Bebe al menos 500 mL/h durante el ejercicio.' };
  if (tasaMLhora < 1500) return { tasaMLhora, perdidaPorcentaje, recomendacionMLhora, estado: 'Normal',     color: '#CAFF00', recomendacion: `Tasa normal. Repón ${tasaMLhora} mL/h. Puedes usar agua o bebida isotónica si el ejercicio supera 60 min.` };
  if (tasaMLhora < 2000) return { tasaMLhora, perdidaPorcentaje, recomendacionMLhora, estado: 'Alta',       color: '#FB923C', recomendacion: `Tasa alta. Repón ${tasaMLhora} mL/h y añade electrolitos (sodio, potasio) en ejercicios prolongados.` };
  return                   { tasaMLhora, perdidaPorcentaje, recomendacionMLhora, estado: 'Muy alta',    color: '#F87171', recomendacion: `Tasa muy alta (>${tasaMLhora} mL/h). Prioriza la hidratación con bebidas con electrolitos. Consulta con un especialista en nutrición deportiva.` };
}

// ─── MASA ÓSEA ────────────────────────────────────────────────────────────────
export interface MasaOseaResult {
  masaOseaKg:        number;
  porcentajeCorporal: number;
  categoria:         string;
  color:             string;
  descripcion:       string;
}

export function calcularMasaOsea(pesoKg: number, alturaCm: number, sexo: 'hombre' | 'mujer'): MasaOseaResult {
  let masa: number;
  if (sexo === 'hombre') {
    masa = -5.765 + 0.0685 * alturaCm + 0.0513 * pesoKg;
  } else {
    masa = -3.651 + 0.0426 * alturaCm + 0.0432 * pesoKg;
  }
  const masaOseaKg        = Math.round(masa * 100) / 100;
  const porcentajeCorporal = Math.round((masa / pesoKg) * 1000) / 10;

  if (sexo === 'hombre') {
    if (porcentajeCorporal < 12) return { masaOseaKg, porcentajeCorporal, categoria: 'Baja',    color: '#F87171', descripcion: 'Masa ósea por debajo del rango normal para hombres. Considera consultar a tu médico.' };
    if (porcentajeCorporal <= 16) return { masaOseaKg, porcentajeCorporal, categoria: 'Normal',  color: '#34D399', descripcion: 'Masa ósea dentro del rango normal para hombres. Mantén calcio, vitamina D y ejercicio de impacto.' };
    return                         { masaOseaKg, porcentajeCorporal, categoria: 'Alta',    color: '#60A5FA', descripcion: 'Masa ósea elevada. Propio de personas con entrenamiento de fuerza o mayor densidad ósea natural.' };
  } else {
    if (porcentajeCorporal < 10) return { masaOseaKg, porcentajeCorporal, categoria: 'Baja',    color: '#F87171', descripcion: 'Masa ósea por debajo del rango normal para mujeres. Consulta a tu médico.' };
    if (porcentajeCorporal <= 14) return { masaOseaKg, porcentajeCorporal, categoria: 'Normal',  color: '#34D399', descripcion: 'Masa ósea dentro del rango normal para mujeres. Mantén calcio, vitamina D y ejercicio físico.' };
    return                         { masaOseaKg, porcentajeCorporal, categoria: 'Alta',    color: '#60A5FA', descripcion: 'Masa ósea elevada. Favorecida por entrenamiento de fuerza o buena genética ósea.' };
  }
}

// ─── SÍNDROME METABÓLICO (IDF 2006) ──────────────────────────────────────────
export interface CriterioMetabolico {
  nombre:  string;
  valor:   string;
  umbral:  string;
  cumple:  boolean;
}

export interface SindromeMetabolicoResult {
  criteriosCumplidos: number;
  tiene:              boolean;
  criterios:          CriterioMetabolico[];
  riesgo:             string;
  color:              string;
  recomendacion:      string;
}

export function calcularSindromeMetabolico(
  cinturaCm:       number,
  sexo:            'hombre' | 'mujer',
  trigliceridos:   number,
  hdl:             number,
  sistolica:       number,
  diastolica:      number,
  glucosaAyunas:   number,
  medicacionTA:    boolean,
  medicacionGlucosa: boolean,
): SindromeMetabolicoResult {
  // Criterio 1 (OBLIGATORIO): Obesidad central — IDF LATAM
  const cinturaMax  = sexo === 'hombre' ? 90 : 80;
  const cumpleCintura = cinturaCm > cinturaMax;

  // Criterio 2: Triglicéridos
  const cumpleTG = trigliceridos >= 150;

  // Criterio 3: HDL bajo
  const hdlMin    = sexo === 'mujer' ? 50 : 40;
  const cumpleHDL = hdl < hdlMin;

  // Criterio 4: Presión arterial
  const cumplePA  = sistolica >= 130 || diastolica >= 85 || medicacionTA;

  // Criterio 5: Glucosa
  const cumpleGlucosa = glucosaAyunas >= 100 || medicacionGlucosa;

  const criterios: CriterioMetabolico[] = [
    { nombre: 'Obesidad central',   valor: `${cinturaCm} cm`,        umbral: `> ${cinturaMax} cm`,         cumple: cumpleCintura },
    { nombre: 'Triglicéridos',      valor: `${trigliceridos} mg/dL`, umbral: '≥ 150 mg/dL',                cumple: cumpleTG },
    { nombre: 'HDL colesterol',     valor: `${hdl} mg/dL`,           umbral: `< ${hdlMin} mg/dL`,          cumple: cumpleHDL },
    { nombre: 'Presión arterial',   valor: `${sistolica}/${diastolica} mmHg`, umbral: '≥ 130/85 mmHg',     cumple: cumplePA },
    { nombre: 'Glucosa en ayunas',  valor: `${glucosaAyunas} mg/dL`, umbral: '≥ 100 mg/dL',               cumple: cumpleGlucosa },
  ];

  const criteriosAdicionales = [cumpleTG, cumpleHDL, cumplePA, cumpleGlucosa].filter(Boolean).length;
  const criteriosCumplidos   = [cumpleCintura, cumpleTG, cumpleHDL, cumplePA, cumpleGlucosa].filter(Boolean).length;
  const tiene = cumpleCintura && criteriosAdicionales >= 2;

  if (!tiene) return { criteriosCumplidos, tiene, criterios, riesgo: 'sin_sindrome', color: '#34D399', recomendacion: 'No cumples los criterios diagnósticos de síndrome metabólico. Mantén hábitos saludables y controles periódicos.' };
  if (criteriosCumplidos === 3) return { criteriosCumplidos, tiene, criterios, riesgo: 'moderado', color: '#FB923C', recomendacion: 'Síndrome metabólico presente (3 criterios). Consulta a tu médico y adopta cambios inmediatos en dieta y ejercicio.' };
  return { criteriosCumplidos, tiene, criterios, riesgo: 'alto', color: '#F87171', recomendacion: 'Síndrome metabólico con múltiples criterios. Riesgo cardiovascular y de diabetes tipo 2 significativamente elevado. Atención médica urgente.' };
}

// ─── BATCH 7A ─────────────────────────────────────────────────────────────────

// ─── POTENCIA DE SALTO ────────────────────────────────────────────────────────
export interface PotenciaSaltoResult {
  potenciaPicoW:  number;
  potenciaMediaW: number;
  wattsPerKg:     number;
  nivel:          string;
  nivelNombre:    string;
  color:          string;
  descripcion:    string;
}

export function calcularPotenciaSalto(
  pesoKg:    number,
  alturasCm: number,
  sexo:      'hombre' | 'mujer',
): PotenciaSaltoResult {
  // Sayers 1999: P_pico(W) = 60.7 × alturaCm + 45.3 × pesoKg − 2055
  const potenciaPicoW  = Math.round(60.7 * alturasCm + 45.3 * pesoKg - 2055);
  const potenciaMediaW = Math.round(21.2 * alturasCm + 23.0 * pesoKg - 1393);
  const wattsPerKg     = Math.round((potenciaPicoW / pesoKg) * 10) / 10;

  // Umbrales W/kg según sexo
  const umbrales = sexo === 'hombre'
    ? [{ nivel: 'excelente', min: 45, nombre: 'Excelente', color: '#34D399', desc: 'Potencia explosiva de nivel élite o avanzado.' },
       { nivel: 'bueno',     min: 35, nombre: 'Bueno',     color: '#CAFF00', desc: 'Potencia superior a la media. Buen nivel atlético.' },
       { nivel: 'promedio',  min: 25, nombre: 'Promedio',  color: '#60A5FA', desc: 'Potencia dentro del rango normal para adultos activos.' },
       { nivel: 'bajo',      min: 15, nombre: 'Bajo',      color: '#FB923C', desc: 'Potencia por debajo del promedio. Entrenamiento explosivo recomendado.' },
       { nivel: 'muy_bajo',  min: 0,  nombre: 'Muy bajo',  color: '#F87171', desc: 'Potencia muy baja. Considera añadir pliometría y ejercicios de fuerza.' }]
    : [{ nivel: 'excelente', min: 35, nombre: 'Excelente', color: '#34D399', desc: 'Potencia explosiva de nivel élite o avanzado.' },
       { nivel: 'bueno',     min: 25, nombre: 'Bueno',     color: '#CAFF00', desc: 'Potencia superior a la media. Buen nivel atlético.' },
       { nivel: 'promedio',  min: 18, nombre: 'Promedio',  color: '#60A5FA', desc: 'Potencia dentro del rango normal para adultos activas.' },
       { nivel: 'bajo',      min: 10, nombre: 'Bajo',      color: '#FB923C', desc: 'Potencia por debajo del promedio. Entrenamiento explosivo recomendado.' },
       { nivel: 'muy_bajo',  min: 0,  nombre: 'Muy bajo',  color: '#F87171', desc: 'Potencia muy baja. Considera añadir pliometría y ejercicios de fuerza.' }];

  const cat = umbrales.find(u => wattsPerKg >= u.min) ?? umbrales[umbrales.length - 1];
  return {
    potenciaPicoW,
    potenciaMediaW,
    wattsPerKg,
    nivel:       cat.nivel,
    nivelNombre: cat.nombre,
    color:       cat.color,
    descripcion: cat.desc,
  };
}

// ─── GRASA VISCERAL ───────────────────────────────────────────────────────────
export interface GrasaVisceralResult {
  nivelEstimado: number;
  categoria:     string;
  color:         string;
  riesgo:        string;
  recomendacion: string;
}

export function calcularGrasaVisceral(
  cinturaCm: number,
  caderaCm:  number,
  alturaCm:  number,
  edadAnios: number,
  sexo:      'hombre' | 'mujer',
): GrasaVisceralResult {
  const whtr      = cinturaCm / alturaCm;
  const edadBonus = edadAnios > 40 ? 2 : 0;
  const sexoBonus = sexo === 'hombre' ? 1 : 0;
  const nivelRaw  = whtr * 30 + edadBonus + sexoBonus;
  const nivelEstimado = Math.min(20, Math.max(1, Math.round(nivelRaw)));

  if (nivelEstimado <= 9)  return { nivelEstimado, categoria: 'Saludable',    color: '#34D399', riesgo: 'bajo',   recomendacion: 'Tu nivel de grasa visceral es saludable. Mantén tu dieta y actividad física actuales.' };
  if (nivelEstimado <= 14) return { nivelEstimado, categoria: 'Exceso',       color: '#FB923C', riesgo: 'moderado', recomendacion: 'Nivel de grasa visceral elevado. Reduce carbohidratos refinados, aumenta el cardio y el entrenamiento de fuerza.' };
  return                          { nivelEstimado, categoria: 'Alto riesgo',  color: '#F87171', riesgo: 'alto',   recomendacion: 'Grasa visceral en rango de alto riesgo. Consulta a tu médico y modifica urgentemente tu dieta y actividad física.' };
}

// ─── OXIMETRÍA ────────────────────────────────────────────────────────────────
export interface OximetriaResult {
  categoria:             string;
  color:                 string;
  riesgo:                string;
  recomendacion:         string;
  spo2AjustadoAltitud:   number;
}

export function calcularOximetria(
  spo2:     number,
  altitudM: number,
): OximetriaResult {
  // SpO2 esperado según altitud (aprox para > 2500 m)
  const ajuste = altitudM > 2500 ? (altitudM / 300) * 0.9 : 0;
  const spo2AjustadoAltitud = Math.max(80, Math.round((98 - ajuste) * 10) / 10);

  if (spo2 >= 95) return { categoria: 'Normal',             color: '#34D399', riesgo: 'bajo',    spo2AjustadoAltitud, recomendacion: 'Saturación de oxígeno normal. No se requiere ninguna acción.' };
  if (spo2 >= 91) return { categoria: 'Hipoxia leve',       color: '#CAFF00', riesgo: 'leve',    spo2AjustadoAltitud, recomendacion: 'Saturación ligeramente reducida. Monitoriza y consulta a un médico si persiste o tienes síntomas.' };
  if (spo2 >= 86) return { categoria: 'Hipoxia moderada',   color: '#FB923C', riesgo: 'moderado', spo2AjustadoAltitud, recomendacion: 'Saturación moderadamente baja. Busca atención médica pronto. Evita el esfuerzo físico.' };
  return                 { categoria: 'Hipoxia grave',      color: '#F87171', riesgo: 'grave',   spo2AjustadoAltitud, recomendacion: 'Saturación críticamente baja. Busca atención de emergencia de inmediato.' };
}

// ─── UMBRAL ANAERÓBICO ────────────────────────────────────────────────────────
export interface UmbralAnaerobicoResult {
  fcUmbral:         number;
  fcUmbralMin:      number;
  fcUmbralMax:      number;
  porcentajeFCmax:  number;
  fcMaxUsada:       number;
  zonaDescripcion:  string;
  recomendacion:    string;
}

export function calcularUmbralAnaerobico(
  edadAnios: number,
  fcReposo:  number,
  fcMax?:    number,
): UmbralAnaerobicoResult {
  const fcMaxUsada = fcMax ?? (220 - edadAnios);
  // Karvonen al 87%
  const fcUmbral    = Math.round(fcReposo + 0.87 * (fcMaxUsada - fcReposo));
  const fcUmbralMin = fcUmbral - 5;
  const fcUmbralMax = fcUmbral + 5;
  const porcentajeFCmax = Math.round((fcUmbral / fcMaxUsada) * 100);

  return {
    fcUmbral,
    fcUmbralMin,
    fcUmbralMax,
    porcentajeFCmax,
    fcMaxUsada,
    zonaDescripcion: 'Zona de umbral anaeróbico (≈ 85–90% FC máx). En este rango el lactato empieza a acumularse más rápido de lo que el cuerpo puede eliminarlo.',
    recomendacion:   'Entrena en este rango con series de tempo o intervalos de 20–40 min para elevar tu umbral y mejorar el rendimiento de resistencia.',
  };
}

// ─── CARGA DE ENTRENAMIENTO ───────────────────────────────────────────────────
export interface SesionRPE {
  rpe:         number;
  duracionMin: number;
}

export interface CargaEntrenamientoResult {
  cargaSemanalUA: number;
  promedioDiario: number;
  monotonia:      number;
  strain:         number;
  categoria:      string;
  color:          string;
  recomendacion:  string;
}

export function calcularCargaEntrenamiento(sesiones: SesionRPE[]): CargaEntrenamientoResult {
  if (sesiones.length === 0) {
    return { cargaSemanalUA: 0, promedioDiario: 0, monotonia: 0, strain: 0, categoria: 'Sin datos', color: '#888', recomendacion: 'Introduce al menos una sesión de entrenamiento.' };
  }

  const uas = sesiones.map(s => s.rpe * s.duracionMin);
  const cargaSemanalUA = uas.reduce((a, b) => a + b, 0);

  // Rellenar con ceros los días sin sesión hasta completar 7 días
  const diasCompletos = [...uas];
  while (diasCompletos.length < 7) diasCompletos.push(0);

  const media = diasCompletos.reduce((a, b) => a + b, 0) / diasCompletos.length;
  const promedioDiario = Math.round(media);

  const varianza = diasCompletos.reduce((acc, ua) => acc + Math.pow(ua - media, 2), 0) / diasCompletos.length;
  const sd = Math.sqrt(varianza);

  const monotonia = sd > 0 ? Math.round((media / sd) * 100) / 100 : 0;
  const strain    = Math.round(cargaSemanalUA * monotonia);

  if (cargaSemanalUA < 1000) return { cargaSemanalUA, promedioDiario, monotonia, strain, categoria: 'Carga baja',    color: '#60A5FA', recomendacion: 'Carga semanal insuficiente para generar adaptaciones significativas. Aumenta el volumen o la intensidad.' };
  if (cargaSemanalUA <= 3000 && monotonia < 2) return { cargaSemanalUA, promedioDiario, monotonia, strain, categoria: 'Carga óptima',  color: '#34D399', recomendacion: 'Carga y variabilidad en rango óptimo. Mantén la planificación actual.' };
  if (monotonia >= 2) return { cargaSemanalUA, promedioDiario, monotonia, strain, categoria: 'Monotonía alta', color: '#FB923C', recomendacion: 'Monotonía elevada (≥ 2): riesgo de sobreentrenamiento y lesión. Varía la intensidad entre sesiones.' };
  return { cargaSemanalUA, promedioDiario, monotonia, strain, categoria: 'Carga alta',   color: '#F87171', recomendacion: 'Carga semanal muy elevada (> 3000 UA). Considera semanas de descarga cada 3–4 semanas.' };
}

// ─── ESCALA DE BORG ───────────────────────────────────────────────────────────
export interface EscalaBorgResult {
  descripcion:       string;
  porcentajeFCmax:   number;
  intensidad:        string;
  zonaEntrenamiento: string;
  color:             string;
  recomendacion:     string;
}

export function calcularEscalaBorg(
  rpe:    number,
  escala: 'borg6_20' | 'cr10',
): EscalaBorgResult {
  // Convertir CR10 a Borg 6-20
  const borgValue = escala === 'cr10' ? Math.min(20, Math.max(6, Math.round(rpe * 1.5 + 6))) : rpe;
  const pctFCmax  = borgValue * 10;

  const NIVELES = [
    { min: 6,  max: 9,  desc: 'Muy ligero', intensidad: 'Muy baja',    zona: 'Calentamiento / recuperación activa',     color: '#60A5FA', rec: 'Ideal para calentamiento, enfriamiento o días de recuperación activa.' },
    { min: 10, max: 11, desc: 'Ligero',     intensidad: 'Baja',        zona: 'Zona 1 — quema de grasas',                color: '#34D399', rec: 'Ritmo conversacional cómodo. Útil para rodajes de recuperación.' },
    { min: 12, max: 13, desc: 'Moderado',   intensidad: 'Moderada',    zona: 'Zona 2 — aeróbico base',                  color: '#CAFF00', rec: 'Zona aeróbica base. Debe representar el 70–80% de tu volumen semanal.' },
    { min: 14, max: 15, desc: 'Algo duro',  intensidad: 'Media-alta',  zona: 'Zona 3 — umbral aeróbico',                color: '#FB923C', rec: 'Zona de tempo. Duro pero sostenible 20–60 min. Eleva el umbral aeróbico.' },
    { min: 16, max: 17, desc: 'Duro',       intensidad: 'Alta',        zona: 'Zona 4 — umbral anaeróbico',              color: '#F87171', rec: 'Zona de intervalos. Máximo 15% del volumen semanal para evitar sobreentrenamiento.' },
    { min: 18, max: 20, desc: 'Muy duro / Máximo', intensidad: 'Máxima', zona: 'Zona 5 — VO₂ máx / anaeróbico',      color: '#DC2626', rec: 'Zona de sprints y esfuerzo máximo. Limita a 1–2 sesiones semanales con buena recuperación.' },
  ];

  const nivel = NIVELES.find(n => borgValue >= n.min && borgValue <= n.max) ?? NIVELES[NIVELES.length - 1];

  return {
    descripcion:       nivel.desc,
    porcentajeFCmax:   Math.min(100, pctFCmax),
    intensidad:        nivel.intensidad,
    zonaEntrenamiento: nivel.zona,
    color:             nivel.color,
    recomendacion:     nivel.rec,
  };
}

// ─── FC EN REPOSO ─────────────────────────────────────────────────────────────
export interface FCReposoResult {
  categoria:        string;
  nivelFitness:     string;
  color:            string;
  fcMaxEstimada:    number;
  reservaCardiaca:  number;
  descripcion:      string;
}

export function calcularFCReposo(
  fcReposo:  number,
  edadAnios: number,
  sexo:      'hombre' | 'mujer',
): FCReposoResult {
  const fcMaxEstimada  = 220 - edadAnios;
  const reservaCardiaca = fcMaxEstimada - fcReposo;

  const tablas = {
    hombre: [
      { max: 49,  cat: 'Atleta',    fitness: 'Atleta/Élite',  color: '#34D399', desc: 'FC en reposo de deportista de élite. Indica muy alta eficiencia cardíaca.' },
      { max: 58,  cat: 'Excelente', fitness: 'Excelente',     color: '#CAFF00', desc: 'Excelente capacidad cardiovascular. Propio de personas muy activas.' },
      { max: 65,  cat: 'Bueno',     fitness: 'Bueno',         color: '#60A5FA', desc: 'Buena condición cardiovascular. Por encima del promedio.' },
      { max: 72,  cat: 'Normal',    fitness: 'Normal',        color: '#888',    desc: 'FC en reposo dentro del rango normal para adultos.' },
      { max: 81,  cat: 'Bajo',      fitness: 'Bajo',          color: '#FB923C', desc: 'FC en reposo elevada. Considera aumentar la actividad aeróbica.' },
      { max: 999, cat: 'Pobre',     fitness: 'Pobre',         color: '#F87171', desc: 'FC en reposo muy alta. Consulta con tu médico y adopta hábitos más activos.' },
    ],
    mujer: [
      { max: 53,  cat: 'Atleta',    fitness: 'Atleta/Élite',  color: '#34D399', desc: 'FC en reposo de deportista de élite. Indica muy alta eficiencia cardíaca.' },
      { max: 60,  cat: 'Excelente', fitness: 'Excelente',     color: '#CAFF00', desc: 'Excelente capacidad cardiovascular. Propio de personas muy activas.' },
      { max: 67,  cat: 'Bueno',     fitness: 'Bueno',         color: '#60A5FA', desc: 'Buena condición cardiovascular. Por encima del promedio.' },
      { max: 73,  cat: 'Normal',    fitness: 'Normal',        color: '#888',    desc: 'FC en reposo dentro del rango normal para adultos.' },
      { max: 82,  cat: 'Bajo',      fitness: 'Bajo',          color: '#FB923C', desc: 'FC en reposo elevada. Considera aumentar la actividad aeróbica.' },
      { max: 999, cat: 'Pobre',     fitness: 'Pobre',         color: '#F87171', desc: 'FC en reposo muy alta. Consulta con tu médico y adopta hábitos más activos.' },
    ],
  };

  const fila = tablas[sexo].find(f => fcReposo <= f.max) ?? tablas[sexo][tablas[sexo].length - 1];
  return {
    categoria:       fila.cat,
    nivelFitness:    fila.fitness,
    color:           fila.color,
    fcMaxEstimada,
    reservaCardiaca,
    descripcion:     fila.desc,
  };
}

// ─── ACTIVIDAD FÍSICA OMS ─────────────────────────────────────────────────────
export type NivelActividad_OMS = 'inactivo' | 'insuficiente' | 'suficiente' | 'optimo';

export interface ActividadFisicaOMSResult {
  metMinSemana:        number;
  nivelOMS:            NivelActividad_OMS;
  nivelNombre:         string;
  color:               string;
  cumpleRecomendacion: boolean;
  equivalenteModera:   number;
  recomendacion:       string;
}

export function calcularActividadFisicaOMS(
  minutosModera:   number,
  minutosVigoroso: number,
  diasFuerza:      number,
): ActividadFisicaOMSResult {
  const metMinSemana    = minutosModera * 4 + minutosVigoroso * 8;
  const equivalenteModera = Math.round(metMinSemana / 4);
  const cumpleAerob     = metMinSemana >= 600; // ≥150 min moderada equivalente
  const cumpleFuerza    = diasFuerza >= 2;
  const cumpleRecomendacion = cumpleAerob && cumpleFuerza;

  if (metMinSemana === 0)    return { metMinSemana, nivelOMS: 'inactivo',     nivelNombre: 'Inactivo',              color: '#F87171', cumpleRecomendacion, equivalenteModera, recomendacion: 'No registras actividad física. La OMS recomienda al menos 150 min de actividad moderada y 2 días de fuerza a la semana.' };
  if (metMinSemana < 600)    return { metMinSemana, nivelOMS: 'insuficiente', nivelNombre: 'Insuficiente',          color: '#FB923C', cumpleRecomendacion, equivalenteModera, recomendacion: 'Actividad insuficiente según la OMS 2020. Aumenta gradualmente hasta alcanzar los 150 min de moderada o 75 min de vigorosa.' };
  if (metMinSemana < 1200)   return { metMinSemana, nivelOMS: 'suficiente',   nivelNombre: 'Suficiente',            color: '#CAFF00', cumpleRecomendacion, equivalenteModera, recomendacion: `Cumples la recomendación mínima de la OMS${!cumpleFuerza ? ', pero añade ≥2 días de entrenamiento de fuerza' : ''}. ¡Buen trabajo!` };
  return                            { metMinSemana, nivelOMS: 'optimo',       nivelNombre: 'Óptimo',                color: '#34D399', cumpleRecomendacion, equivalenteModera, recomendacion: `Superas la recomendación de la OMS (≥1200 MET·min/sem)${!cumpleFuerza ? '. Recuerda añadir ≥2 días de fuerza' : ''}. Excelente nivel de actividad.` };
}

// ─── HIDRATACIÓN DEPORTIVA ────────────────────────────────────────────────────
export interface HidratacionDeportivaResult {
  aguaPreEjercicioMl:    number;
  aguaDuranteML_15min:   number;
  aguaPostEjercicioMl:   number;
  totalMl:               number;
  electrolitosNecesarios: boolean;
  recomendacion:         string;
}

export function calcularHidratacionDeportiva(
  pesoKg:      number,
  duracionMin: number,
  intensidad:  'baja' | 'moderada' | 'alta' | 'muy_alta',
  temperatura: 'fresco' | 'templado' | 'calido' | 'muy_calido',
): HidratacionDeportivaResult {
  // Pre: 5 mL/kg
  const aguaPreEjercicioMl = Math.round(pesoKg * 5);

  // Durante: mL cada 15 min según intensidad + temperatura
  const matrizDurante: Record<string, Record<string, number>> = {
    baja:     { fresco: 150, templado: 175, calido: 200, muy_calido: 250 },
    moderada: { fresco: 175, templado: 200, calido: 250, muy_calido: 300 },
    alta:     { fresco: 200, templado: 250, calido: 300, muy_calido: 350 },
    muy_alta: { fresco: 250, templado: 300, calido: 350, muy_calido: 400 },
  };
  const aguaDuranteML_15min = matrizDurante[intensidad][temperatura];

  // Post: estimación de pérdida × 1.5
  const tasaL_h: Record<string, number> = { baja: 0.5, moderada: 0.8, alta: 1.2, muy_alta: 1.8 };
  const factorTemp: Record<string, number> = { fresco: 0.8, templado: 1.0, calido: 1.2, muy_calido: 1.5 };
  const perdidaKg = tasaL_h[intensidad] * factorTemp[temperatura] * (duracionMin / 60);
  const aguaPostEjercicioMl = Math.round(perdidaKg * 1500); // 1.5 L por kg perdido

  const totalMl = aguaPreEjercicioMl + Math.round((duracionMin / 15) * aguaDuranteML_15min) + aguaPostEjercicioMl;
  const electrolitosNecesarios = duracionMin > 60 && (intensidad === 'moderada' || intensidad === 'alta' || intensidad === 'muy_alta');

  return {
    aguaPreEjercicioMl,
    aguaDuranteML_15min,
    aguaPostEjercicioMl,
    totalMl,
    electrolitosNecesarios,
    recomendacion: electrolitosNecesarios
      ? 'Con más de 60 min de ejercicio moderado/intenso, repón también electrolitos (sodio, potasio). Una bebida isotónica o agua con sales puede prevenir la hiponatremia.'
      : 'El agua sola es suficiente para esta sesión. Bebe antes de tener sed y monitoriza el color de tu orina (debe ser amarillo pálido).',
  };
}

// ─── RITMO DE NATACIÓN ────────────────────────────────────────────────────────
export interface RitmoNatacionResult {
  ritmoPor100m:    string;
  ritmoPor50m:     string;
  velocidadMps:    number;
  velocidadKmh:    number;
  largosPorMinuto: number;
  categoria:       string;
  color:           string;
}

export function calcularRitmoNatacion(
  distanciaM: number,
  tiempoMin:  number,
  tiempoSeg:  number,
  largo:      25 | 50,
): RitmoNatacionResult {
  const tiempoTotalSeg = tiempoMin * 60 + tiempoSeg;
  const seg100m        = (tiempoTotalSeg / distanciaM) * 100;
  const seg50m         = seg100m / 2;

  const fmt = (s: number) => {
    const m  = Math.floor(s / 60);
    const ss = Math.round(s % 60).toString().padStart(2, '0');
    return `${m}:${ss}`;
  };

  const velocidadMps    = Math.round((distanciaM / tiempoTotalSeg) * 100) / 100;
  const velocidadKmh    = Math.round(velocidadMps * 3.6 * 10) / 10;
  const largosPorMinuto = Math.round((distanciaM / largo) / (tiempoTotalSeg / 60) * 10) / 10;

  if (seg100m < 60)  return { ritmoPor100m: `${fmt(seg100m)} /100m`, ritmoPor50m: `${fmt(seg50m)} /50m`, velocidadMps, velocidadKmh, largosPorMinuto, categoria: 'Élite / Competitivo',  color: '#34D399' };
  if (seg100m < 80)  return { ritmoPor100m: `${fmt(seg100m)} /100m`, ritmoPor50m: `${fmt(seg50m)} /50m`, velocidadMps, velocidadKmh, largosPorMinuto, categoria: 'Competitivo',          color: '#CAFF00' };
  if (seg100m < 100) return { ritmoPor100m: `${fmt(seg100m)} /100m`, ritmoPor50m: `${fmt(seg50m)} /50m`, velocidadMps, velocidadKmh, largosPorMinuto, categoria: 'Fitness / Avanzado',   color: '#60A5FA' };
  if (seg100m < 120) return { ritmoPor100m: `${fmt(seg100m)} /100m`, ritmoPor50m: `${fmt(seg50m)} /50m`, velocidadMps, velocidadKmh, largosPorMinuto, categoria: 'Principiante',         color: '#FB923C' };
  return                    { ritmoPor100m: `${fmt(seg100m)} /100m`, ritmoPor50m: `${fmt(seg50m)} /50m`, velocidadMps, velocidadKmh, largosPorMinuto, categoria: 'Muy principiante',     color: '#F87171' };
}

// ─── BATCH 7B ────────────────────────────────────────────────────────────────

// ─── FTP CICLISMO ─────────────────────────────────────────────────────────────
export type ProtocoloFTP = 'test20min' | 'test8min' | 'rampa';

export interface ZonaFTP {
  nombre:      string;
  minW:        number;
  maxW:        number;
  descripcion: string;
}

export interface FTPResult {
  ftpW:        number;
  wPerKg:      number;
  nivel:       string;
  nivelNombre: string;
  color:       string;
  zonas:       ZonaFTP[];
}

export function calcularFTP(potenciaW: number, protocolo: ProtocoloFTP, pesoKg: number): FTPResult {
  let ftpW: number;
  if (protocolo === 'test20min')      ftpW = Math.round(potenciaW * 0.95);
  else if (protocolo === 'test8min')  ftpW = Math.round(potenciaW * 0.90);
  else                                ftpW = Math.round(potenciaW * 0.75); // rampa

  const wPerKg = Math.round((ftpW / pesoKg) * 100) / 100;

  let nivel: string;
  let nivelNombre: string;
  let color: string;
  if (wPerKg < 2.0)      { nivel = 'sin_categoria'; nivelNombre = 'Sin categoría'; color = '#9CA3AF'; }
  else if (wPerKg < 2.5) { nivel = 'cat4';          nivelNombre = 'Categoría 4';   color = '#60A5FA'; }
  else if (wPerKg < 3.0) { nivel = 'cat3';          nivelNombre = 'Categoría 3';   color = '#34D399'; }
  else if (wPerKg < 3.5) { nivel = 'cat2';          nivelNombre = 'Categoría 2';   color = '#CAFF00'; }
  else if (wPerKg < 4.0) { nivel = 'cat1';          nivelNombre = 'Categoría 1';   color = '#FB923C'; }
  else if (wPerKg < 4.5) { nivel = 'pro';           nivelNombre = 'Pro';           color = '#F87171'; }
  else                   { nivel = 'elite';         nivelNombre = 'Elite';         color = '#DC2626'; }

  const zonas: ZonaFTP[] = [
    { nombre: 'Z1 — Recuperación activa', minW: 0,                    maxW: Math.round(ftpW * 0.55), descripcion: 'Intensidad muy baja. Ideal para días de recuperación.' },
    { nombre: 'Z2 — Base aeróbica',       minW: Math.round(ftpW * 0.56), maxW: Math.round(ftpW * 0.75), descripcion: 'Resistencia aeróbica. Base de entrenamiento de fondo.' },
    { nombre: 'Z3 — Tempo',               minW: Math.round(ftpW * 0.76), maxW: Math.round(ftpW * 0.90), descripcion: 'Esfuerzo moderado-alto. Mejora la eficiencia aeróbica.' },
    { nombre: 'Z4 — Umbral',              minW: Math.round(ftpW * 0.91), maxW: Math.round(ftpW * 1.05), descripcion: 'Entrenamiento al umbral de lactato. Alta intensidad sostenida.' },
    { nombre: 'Z5 — VO₂ máx',            minW: Math.round(ftpW * 1.06), maxW: Math.round(ftpW * 1.20), descripcion: 'Intervalos de alta intensidad. Mejora el VO₂ máximo.' },
    { nombre: 'Z6 — Anaeróbico',          minW: Math.round(ftpW * 1.21), maxW: 9999,                    descripcion: 'Esfuerzo máximo y supramáximo. Sprints y potencia pico.' },
  ];

  return { ftpW, wPerKg, nivel, nivelNombre, color, zonas };
}

// ─── CADENCIA DE CARRERA ──────────────────────────────────────────────────────
export interface CadenciaCarreraResult {
  cadencia:          number;
  categoria:         string;
  color:             string;
  longitudZancadaCm: number | null;
  eficiencia:        string;
  recomendacion:     string;
}

export function calcularCadenciaCarrera(pasosPorMinuto: number, velocidadKmh?: number): CadenciaCarreraResult {
  let categoria: string;
  let color: string;
  let eficiencia: string;
  let recomendacion: string;

  if (pasosPorMinuto < 160) {
    categoria = 'Muy baja';  color = '#F87171'; eficiencia = 'Ineficiente';
    recomendacion = 'Cadencia muy baja. Aumenta gradualmente 5 ppm por semana. Una cadencia baja incrementa el riesgo de lesiones y el impacto en articulaciones.';
  } else if (pasosPorMinuto < 170) {
    categoria = 'Baja';      color = '#FB923C'; eficiencia = 'Por mejorar';
    recomendacion = 'Cadencia algo baja. Intenta aumentar la frecuencia de zancada acortando el paso y aterrizando bajo el centro de masa.';
  } else if (pasosPorMinuto < 180) {
    categoria = 'Aceptable'; color = '#CAFF00'; eficiencia = 'Aceptable';
    recomendacion = 'Cadencia aceptable. Estás cerca del rango óptimo. Trabaja en la postura y el aterrizaje para llegar a 180 ppm.';
  } else if (pasosPorMinuto <= 185) {
    categoria = 'Óptima';   color = '#34D399'; eficiencia = 'Óptima';
    recomendacion = 'Cadencia óptima según estándares de biomecánica (Jack Daniels). Minimiza el impacto y maximiza la eficiencia energética.';
  } else {
    categoria = 'Alta';     color = '#60A5FA'; eficiencia = 'Elevada';
    recomendacion = 'Cadencia alta. Puede ser normal en corredores élite a ritmos rápidos. Verifica que la zancada no sea excesivamente corta.';
  }

  let longitudZancadaCm: number | null = null;
  if (velocidadKmh !== undefined && velocidadKmh > 0) {
    const velocidadMps = velocidadKmh / 3.6;
    longitudZancadaCm  = Math.round((velocidadMps / (pasosPorMinuto / 60)) * 100);
  }

  return { cadencia: pasosPorMinuto, categoria, color, longitudZancadaCm, eficiencia, recomendacion };
}

// ─── PREDICTOR DE CARRERA (RIEGEL) ────────────────────────────────────────────
export interface PredictorCarreraResult {
  tiempoPredichoStr: string;
  tiempoPredichoSeg: number;
  ritmoPredichoStr:  string;
  velocidadKmh:      number;
  formula:           string;
}

export function calcularPredictorCarrera(
  tiempoMin:     number,
  tiempoSeg:     number,
  distanciaKm1:  number,
  distanciaKm2:  number,
): PredictorCarreraResult {
  const t1Seg = tiempoMin * 60 + tiempoSeg;
  const t2Seg = t1Seg * Math.pow(distanciaKm2 / distanciaKm1, 1.06);

  const h  = Math.floor(t2Seg / 3600);
  const m  = Math.floor((t2Seg % 3600) / 60);
  const s  = Math.round(t2Seg % 60);
  const hh = String(h).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  const tiempoPredichoStr = h > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;

  const ritmoSegPorKm = t2Seg / distanciaKm2;
  const ritmoM        = Math.floor(ritmoSegPorKm / 60);
  const ritmoS        = Math.round(ritmoSegPorKm % 60);
  const ritmoPredichoStr = `${ritmoM}:${String(ritmoS).padStart(2, '0')} min/km`;

  const velocidadKmh = Math.round((distanciaKm2 / (t2Seg / 3600)) * 10) / 10;

  return {
    tiempoPredichoStr,
    tiempoPredichoSeg: Math.round(t2Seg),
    ritmoPredichoStr,
    velocidadKmh,
    formula: 'Fórmula de Riegel: t2 = t1 × (d2/d1)^1.06',
  };
}

// ─── VITAMINA D SOLAR ─────────────────────────────────────────────────────────
export interface VitaminaDResult {
  minutosNecesarios: number;
  vitaminaDUI:       number;
  recomendacion:     string;
  advertencia:       string | null;
}

export function calcularVitaminaDSolar(
  tipoPiel:   1 | 2 | 3 | 4 | 5 | 6,
  latitud:    'tropical' | 'subtropical' | 'templado' | 'frio',
  estacion:   'verano' | 'primavera' | 'otono' | 'invierno',
  superficie: 'brazos' | 'brazos_piernas' | 'bikini',
): VitaminaDResult {
  const baseMin: Record<number, number> = { 1: 10, 2: 14, 3: 20, 4: 28, 5: 35, 6: 40 };
  let minutos = baseMin[tipoPiel];

  const latMult: Record<string, number>  = { tropical: 1.0, subtropical: 1.2, templado: 1.5, frio: 2.0 };
  const estMult: Record<string, number>  = { verano: 1.0, primavera: 1.5, otono: 2.0, invierno: 4.0 };
  const supMult: Record<string, number>  = { bikini: 1.0, brazos_piernas: 1.4, brazos: 2.0 };

  minutos = Math.round(minutos * latMult[latitud] * estMult[estacion] * supMult[superficie]);

  let advertencia: string | null = null;
  if (estacion === 'invierno' && latitud === 'frio') {
    advertencia = 'En invierno a latitudes altas, la síntesis de vitamina D solar es prácticamente imposible. Considera suplementación.';
    minutos = 0;
  }

  const supUI: Record<string, number> = { bikini: 3000, brazos_piernas: 2000, brazos: 1000 };
  const vitaminaDUI = advertencia ? 0 : supUI[superficie];

  const recomendacion = advertencia
    ? 'Consulta a tu médico sobre suplementación con vitamina D3 (800–2000 UI/día es el rango habitual).'
    : `Exponte al sol ${minutos} min en las horas de mayor radiación (10–15h). No apliques protector solar durante ese tiempo. Evita quemaduras.`;

  return { minutosNecesarios: minutos, vitaminaDUI, recomendacion, advertencia };
}

// ─── PROTEÍNA POR COMIDA ──────────────────────────────────────────────────────
export interface DistribucionComida {
  comida:   number;
  gramos:   number;
  ejemplos: string;
}

export interface ProteinaPorComidaResult {
  totalDiarioG:     number;
  porComidaG:       number;
  maximoAbsorcionG: number;
  distribucion:     DistribucionComida[];
  recomendacion:    string;
}

export function calcularProteinaPorComida(
  pesoKg:     number,
  objetivo:   'mantenimiento' | 'hipertrofia' | 'perdida_grasa',
  comidasDia: number,
): ProteinaPorComidaResult {
  const grPorKg: Record<string, number> = { mantenimiento: 1.6, hipertrofia: 2.0, perdida_grasa: 2.4 };
  const totalDiarioG     = Math.round(pesoKg * grPorKg[objetivo]);
  const porComidaG       = Math.round(totalDiarioG / comidasDia);
  const maximoAbsorcionG = Math.round(pesoKg * 0.4);

  const ejemplosPorComida = [
    'Huevos, yogur griego, cottage cheese',
    'Batido de proteína, frutos secos con proteína',
    'Pollo, pavo, atún, legumbres',
    'Requesón, jamón, queso fresco',
    'Salmón, ternera, claras de huevo',
    'Caseína, leche, queso (antes de dormir)',
  ];

  const distribucion: DistribucionComida[] = Array.from({ length: comidasDia }, (_, i) => ({
    comida:   i + 1,
    gramos:   porComidaG,
    ejemplos: ejemplosPorComida[i % ejemplosPorComida.length],
  }));

  const recomendacion = `Con ${comidasDia} comidas al día distribuye ${porComidaG} g de proteína por comida. El máximo aprovechable por toma es ~${maximoAbsorcionG} g (0.4 g/kg), por lo que ${porComidaG > maximoAbsorcionG ? 'considera aumentar el número de comidas.' : 'tu distribución es óptima.'}`;

  return { totalDiarioG, porComidaG, maximoAbsorcionG, distribucion, recomendacion };
}

// ─── ÍNDICE GLUCÉMICO DE COMIDA ───────────────────────────────────────────────
export interface AlimentoIG {
  nombre: string;
  ig:     number;
  carbsG: number;
}

export interface IGComidaResult {
  igPonderado:    number;
  cargaGlucemica: number;
  categoria:      string;
  color:          string;
  recomendacion:  string;
}

export function calcularIGComida(alimentos: AlimentoIG[]): IGComidaResult {
  const totalCarbs = alimentos.reduce((s, a) => s + a.carbsG, 0);
  if (totalCarbs === 0) {
    return { igPonderado: 0, cargaGlucemica: 0, categoria: 'Sin carbohidratos', color: '#9CA3AF', recomendacion: 'No se detectaron carbohidratos en la comida.' };
  }

  const igPonderado    = Math.round(alimentos.reduce((s, a) => s + a.ig * a.carbsG, 0) / totalCarbs);
  const cargaGlucemica = Math.round((igPonderado * totalCarbs) / 100);

  const catIG  = igPonderado < 55 ? 'IG bajo' : igPonderado < 70 ? 'IG medio' : 'IG alto';
  const catCG  = cargaGlucemica < 10 ? 'CG baja' : cargaGlucemica < 20 ? 'CG media' : 'CG alta';
  const color  = cargaGlucemica >= 20 ? '#F87171' : igPonderado >= 70 ? '#FB923C' : '#34D399';

  const recomendacion = cargaGlucemica >= 20
    ? 'Carga glucémica alta. Reduce los carbohidratos refinados o añade fibra, proteína y grasa para modular la respuesta glucémica.'
    : cargaGlucemica >= 10
      ? 'Carga glucémica moderada. Combina con proteína y grasa para reducir el impacto sobre la glucosa.'
      : 'Carga glucémica baja. Esta combinación produce una respuesta glucémica controlada.';

  return { igPonderado, cargaGlucemica, categoria: `${catIG} · ${catCG}`, color, recomendacion };
}

// ─── RATIO OMEGA-3/6 ──────────────────────────────────────────────────────────
export interface OmegaRatioResult {
  ratio:             number;
  categoriaRatio:    string;
  color:             string;
  recomendacion:     string;
  omega3Recomendado: number;
  deficit:           number | null;
}

export function calcularOmegaRatio(omega3G: number, omega6G: number): OmegaRatioResult {
  const omega3Recomendado = 1.6;
  const deficit = omega3G < omega3Recomendado ? Math.round((omega3Recomendado - omega3G) * 10) / 10 : null;

  if (omega3G === 0) {
    return { ratio: 0, categoriaRatio: 'Sin omega-3', color: '#F87171', recomendacion: 'No se detectó omega-3 en tu dieta. Consume pescado azul, nueces o semillas de chía. Considera suplementación con omega-3 EPA/DHA.', omega3Recomendado, deficit: omega3Recomendado };
  }

  const ratio = Math.round((omega6G / omega3G) * 10) / 10;

  let categoriaRatio: string;
  let color: string;
  let recomendacion: string;
  if (ratio <= 4)       { categoriaRatio = 'Óptimo';      color = '#34D399'; recomendacion = 'Ratio omega-6/omega-3 óptimo. Tu dieta favorece un perfil antiinflamatorio y protege la salud cardiovascular.'; }
  else if (ratio <= 7)  { categoriaRatio = 'Aceptable';   color = '#CAFF00'; recomendacion = 'Ratio algo elevado. Aumenta el consumo de omega-3 (salmón, sardinas, nueces, chía) para alcanzar la proporción ideal 4:1.'; }
  else if (ratio <= 15) { categoriaRatio = 'Elevado';     color = '#FB923C'; recomendacion = 'Ratio elevado, típico de la dieta occidental. Reduce aceites vegetales (girasol, maíz) y aumenta omega-3 de pescado azul o suplementos EPA/DHA.'; }
  else                  { categoriaRatio = 'Muy elevado'; color = '#F87171'; recomendacion = 'Ratio muy elevado (15–20:1 típico de dieta occidental). Asociado a inflamación crónica y mayor riesgo cardiovascular. Revisa tu dieta con un nutricionista.'; }

  return { ratio, categoriaRatio, color, recomendacion, omega3Recomendado, deficit };
}

// ─── RECUPERACIÓN MUSCULAR ────────────────────────────────────────────────────
export type IntensidadEntrenamiento = 'ligero' | 'moderado' | 'intenso' | 'muy_intenso';

export interface RecuperacionMuscularResult {
  horasRecuperacion:   number;
  diasRecuperacion:    number;
  estrategias:         string[];
  senalesPorRecuperar: string[];
  recomendacion:       string;
}

export function calcularRecuperacionMuscular(
  grupoMuscular:    string,
  volumenSeries:    number,
  intensidad:       IntensidadEntrenamiento,
  nivelExperiencia: 'principiante' | 'intermedio' | 'avanzado',
): RecuperacionMuscularResult {
  const baseHoras: Record<IntensidadEntrenamiento, number> = {
    ligero: 30, moderado: 60, intenso: 84, muy_intenso: 108,
  };
  let horas = baseHoras[intensidad];

  if (nivelExperiencia === 'principiante') horas += 24;
  else if (nivelExperiencia === 'avanzado') horas -= 12;

  if (volumenSeries > 20) horas += 24;

  const gruposGrandes = ['piernas', 'gluteos', 'espalda'];
  if (gruposGrandes.includes(grupoMuscular)) horas += 12;

  horas = Math.max(24, horas);
  const diasRecuperacion = Math.round((horas / 24) * 10) / 10;

  const estrategias = [
    'Duerme 7–9 horas por noche (90% de la recuperación ocurre durante el sueño)',
    'Consume 20–40 g de proteína dentro de las 2 horas post-entrenamiento',
    'Hidrátate bien: repón 500 mL por cada 0.5 kg perdido',
    'Aplica frío local (10–15 min) en las primeras 24 h si hay dolor intenso',
    'Foam rolling y estiramientos suaves a las 24–48 h',
  ];

  const senalesPorRecuperar = [
    'Dolor muscular al tacto o al movimiento (DOMS)',
    'Reducción del rendimiento en la siguiente sesión',
    'Sensación de pesadez o rigidez muscular',
    'Hinchazón o temperatura local elevada',
  ];

  const recomendacion = `Para ${grupoMuscular} con intensidad ${intensidad} y nivel ${nivelExperiencia}, necesitas aproximadamente ${horas} horas (${diasRecuperacion} días) antes de volver a entrenar el mismo grupo.`;

  return { horasRecuperacion: horas, diasRecuperacion, estrategias, senalesPorRecuperar, recomendacion };
}

// ─── IMC PEDIÁTRICO (OMS) ─────────────────────────────────────────────────────
export interface IMCInfantilResult {
  imc:           number;
  percentil:     number;
  categoria:     string;
  color:         string;
  zScore:        number;
  recomendacion: string;
}

// Percentil 85 y 95 por edad (años) y sexo — OMS Growth Reference 5–19 años
const P85_NINO: Record<number, [number, number]> = {
  2:[18.1,19.5], 3:[17.6,19.0], 4:[17.3,18.8], 5:[17.1,18.7], 6:[17.1,18.9],
  7:[17.3,19.2], 8:[17.7,19.8], 9:[18.2,20.5], 10:[18.7,21.2], 11:[19.4,22.1],
  12:[20.1,23.0], 13:[20.8,23.9], 14:[21.5,24.7], 15:[22.1,25.4], 16:[22.6,25.9],
  17:[23.0,26.4], 18:[23.3,26.7], 19:[23.5,26.9],
};
const P85_NINA: Record<number, [number, number]> = {
  2:[18.0,19.4], 3:[17.5,18.9], 4:[17.2,18.7], 5:[17.1,18.8], 6:[17.2,19.1],
  7:[17.5,19.7], 8:[18.0,20.5], 9:[18.6,21.4], 10:[19.3,22.3], 11:[20.1,23.2],
  12:[20.9,24.1], 13:[21.6,24.9], 14:[22.2,25.6], 15:[22.7,26.1], 16:[23.1,26.5],
  17:[23.4,26.8], 18:[23.6,27.0], 19:[23.7,27.1],
};

export function calcularIMCInfantil(
  pesoKg:    number,
  alturaCm:  number,
  edadMeses: number,
  sexo:      'nino' | 'nina',
): IMCInfantilResult {
  const alturaM   = alturaCm / 100;
  const imc       = Math.round((pesoKg / (alturaM * alturaM)) * 10) / 10;
  const edadAnios = Math.floor(edadMeses / 12);

  const tabla   = sexo === 'nino' ? P85_NINO : P85_NINA;
  const edadKey = Math.min(Math.max(edadAnios, 2), 19);
  const umbral  = tabla[edadKey];

  if (!umbral) {
    return { imc, percentil: 50, categoria: 'Edad fuera de rango', color: '#9CA3AF', zScore: 0, recomendacion: 'Esta calculadora es válida para edades entre 2 y 19 años.' };
  }

  const [p85, p95] = umbral;
  const p5  = p85 - 4;
  const p50 = p85 - 2;

  let percentil: number;
  let zScore: number;
  let categoria: string;
  let color: string;
  let recomendacion: string;

  if (imc < p5) {
    percentil = 3; zScore = -2.1; categoria = 'Bajo peso'; color = '#60A5FA';
    recomendacion = 'El IMC está por debajo del percentil 5. Consulta al pediatra para descartar déficit nutricional o patología subyacente.';
  } else if (imc < p85) {
    const fraccion = (imc - p5) / (p85 - p5);
    percentil = Math.round(5 + fraccion * 80);
    zScore    = Math.round(((imc - p50) / (p85 - p50)) * 10) / 10;
    categoria = 'Peso normal'; color = '#34D399';
    recomendacion = 'IMC dentro del rango normal para su edad. Mantén una alimentación equilibrada y actividad física regular.';
  } else if (imc < p95) {
    percentil = 90; zScore = 1.3; categoria = 'Sobrepeso'; color = '#FB923C';
    recomendacion = 'IMC entre el percentil 85 y 95 (sobrepeso). Promueve hábitos alimentarios saludables y actividad física. Consulta al pediatra.';
  } else {
    percentil = 97; zScore = 2.1; categoria = 'Obesidad'; color = '#F87171';
    recomendacion = 'IMC por encima del percentil 95 (obesidad). Es importante consultar al pediatra para una evaluación y plan de acción personalizado.';
  }

  return { imc, percentil, categoria, color, zScore, recomendacion };
}

// ─── EDAD BIOLÓGICA ───────────────────────────────────────────────────────────
export interface RespuestasEdadBiologica {
  actividadFisica: 'sedentario' | 'moderado' | 'activo' | 'muy_activo';
  tabaco:          'nunca' | 'exfumador' | 'fumador';
  alcohol:         'nunca' | 'moderado' | 'exceso';
  sueno:           'menos6' | 'entre6_8' | 'mas8';
  estres:          'bajo' | 'moderado' | 'alto' | 'muy_alto';
  dieta:           'mala' | 'regular' | 'buena' | 'excelente';
  imc:             'bajo' | 'normal' | 'sobrepeso' | 'obesidad';
  checkups:        boolean;
}

export interface EdadBiologicaResult {
  edadBiologica:    number;
  diferencia:       number;
  categoria:        string;
  color:            string;
  factoresPositivos: string[];
  factoresNegativos: string[];
  recomendacion:    string;
}

export function calcularEdadBiologica(
  edadCronologica: number,
  respuestas:      RespuestasEdadBiologica,
): EdadBiologicaResult {
  let ajuste = 0;
  const factoresPositivos: string[] = [];
  const factoresNegativos: string[] = [];

  if (respuestas.actividadFisica === 'muy_activo')  { ajuste -= 5; factoresPositivos.push('Actividad física muy alta (−5 años)'); }
  else if (respuestas.actividadFisica === 'activo') { ajuste -= 3; factoresPositivos.push('Actividad física activa (−3 años)'); }
  else if (respuestas.actividadFisica === 'moderado') { ajuste -= 1; factoresPositivos.push('Actividad física moderada (−1 año)'); }
  else { ajuste += 4; factoresNegativos.push('Sedentarismo (+4 años)'); }

  if (respuestas.tabaco === 'fumador')       { ajuste += 7; factoresNegativos.push('Fumador activo (+7 años)'); }
  else if (respuestas.tabaco === 'exfumador') { ajuste += 2; factoresNegativos.push('Ex fumador (+2 años)'); }
  else { factoresPositivos.push('No fumador (0)'); }

  if (respuestas.alcohol === 'exceso') { ajuste += 4; factoresNegativos.push('Consumo excesivo de alcohol (+4 años)'); }

  if (respuestas.sueno === 'menos6')    { ajuste += 3; factoresNegativos.push('Sueño insuficiente <6h (+3 años)'); }
  else if (respuestas.sueno === 'mas8') { ajuste += 2; factoresNegativos.push('Sueño excesivo >8h (+2 años)'); }
  else { factoresPositivos.push('Sueño óptimo 6–8 h (0)'); }

  if (respuestas.estres === 'muy_alto') { ajuste += 5; factoresNegativos.push('Estrés muy alto (+5 años)'); }
  else if (respuestas.estres === 'alto') { ajuste += 3; factoresNegativos.push('Estrés alto (+3 años)'); }
  else if (respuestas.estres === 'bajo') { ajuste -= 1; factoresPositivos.push('Estrés bajo (−1 año)'); }

  if (respuestas.dieta === 'excelente')   { ajuste -= 3; factoresPositivos.push('Dieta excelente (−3 años)'); }
  else if (respuestas.dieta === 'buena') { ajuste -= 1; factoresPositivos.push('Buena dieta (−1 año)'); }
  else if (respuestas.dieta === 'regular') { ajuste += 1; factoresNegativos.push('Dieta regular (+1 año)'); }
  else { ajuste += 4; factoresNegativos.push('Mala dieta (+4 años)'); }

  if (respuestas.imc === 'obesidad')      { ajuste += 5; factoresNegativos.push('Obesidad (+5 años)'); }
  else if (respuestas.imc === 'sobrepeso') { ajuste += 2; factoresNegativos.push('Sobrepeso (+2 años)'); }
  else if (respuestas.imc === 'bajo')     { ajuste += 1; factoresNegativos.push('Bajo peso (+1 año)'); }
  else { factoresPositivos.push('Peso normal (0)'); }

  if (respuestas.checkups) { ajuste -= 1; factoresPositivos.push('Chequeos médicos regulares (−1 año)'); }
  else { ajuste += 1; factoresNegativos.push('Sin chequeos médicos regulares (+1 año)'); }

  const edadBiologica = Math.max(18, edadCronologica + ajuste);
  const diferencia    = edadBiologica - edadCronologica;

  let categoria: string;
  let color: string;
  if (diferencia <= -5)     { categoria = 'Muy joven biológicamente';  color = '#34D399'; }
  else if (diferencia <= -2) { categoria = 'Joven biológicamente';      color = '#CAFF00'; }
  else if (diferencia <= 2)  { categoria = 'Acorde a tu edad';          color = '#60A5FA'; }
  else if (diferencia <= 5)  { categoria = 'Algo mayor biológicamente'; color = '#FB923C'; }
  else                       { categoria = 'Significativamente mayor';  color = '#F87171'; }

  const recomendacion = diferencia > 2
    ? 'Tu edad biológica es mayor que tu edad cronológica. Los factores negativos aceleran el envejecimiento celular. Pequeños cambios de hábitos tienen un gran impacto.'
    : diferencia < -2
      ? 'Excelente. Tu estilo de vida ralentiza el envejecimiento biológico. Mantén tus hábitos positivos y los chequeos médicos periódicos.'
      : 'Tu edad biológica está alineada con tu edad cronológica. Hay margen de mejora trabajando en los factores negativos detectados.';

  return { edadBiologica, diferencia, categoria, color, factoresPositivos, factoresNegativos, recomendacion };
}

// ─── CUENTA REGRESIVA A FECHA ────────────────────────────────────────────────
export function calcularCuentaRegresiva(fechaObjetivo: string): {
  dias: number; horas: number; minutos: number; segundos: number;
  totalSegundos: number; pasado: boolean; fechaFormateada: string;
} {
  const ahora  = new Date();
  const target = new Date(fechaObjetivo + 'T00:00:00');
  const diff   = target.getTime() - ahora.getTime();
  const pasado = diff < 0;
  const abs    = Math.abs(diff);
  const totalSegundos = Math.floor(abs / 1000);
  const dias    = Math.floor(abs / (1000 * 60 * 60 * 24));
  const horas   = Math.floor((abs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((abs % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((abs % (1000 * 60)) / 1000);
  const fechaFormateada = target.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  return { dias, horas, minutos, segundos, totalSegundos, pasado, fechaFormateada };
}

// ─── SEMANAS DE VIDA ─────────────────────────────────────────────────────────
export function calcularSemanasDeVida(fechaNacimiento: string): {
  totalSemanas: number; totalDias: number; anios: number; meses: number;
  proximaSemanaClave: number; semanasHastaProxima: number;
} {
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  const diffMs = hoy.getTime() - nacimiento.getTime();
  const totalDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalSemanas = Math.floor(totalDias / 7);
  const anios  = Math.floor(totalDias / 365.25);
  const meses  = Math.floor(totalDias / 30.44);
  const hitos  = [500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000];
  const proximaSemanaClave = hitos.find(h => h > totalSemanas) ?? (Math.ceil(totalSemanas / 500) * 500 + 500);
  const semanasHastaProxima = proximaSemanaClave - totalSemanas;
  return { totalSemanas, totalDias, anios, meses, proximaSemanaClave, semanasHastaProxima };
}

// ─── CALCULADORA DE GENERACIÓN ───────────────────────────────────────────────
export function calcularGeneracion(anioNacimiento: number): {
  generacion: string; rangoAnios: string; descripcion: string;
  caracteristicas: string[]; color: string; edadActual: number;
} {
  const edadActual = new Date().getFullYear() - anioNacimiento;
  let generacion: string, rangoAnios: string, descripcion: string, caracteristicas: string[], color: string;
  if (anioNacimiento < 1946) {
    generacion = 'Generación Silenciosa'; rangoAnios = '1928–1945'; color = '#94A3B8';
    descripcion = 'La generación que creció durante la Gran Depresión y la Segunda Guerra Mundial. Marcada por la austeridad, el sacrificio colectivo y el respeto a la autoridad.';
    caracteristicas = ['Máxima lealtad institucional', 'Ahorro y austeridad como valores', 'Respeto a la jerarquía', 'Alta resiliencia ante la adversidad'];
  } else if (anioNacimiento <= 1964) {
    generacion = 'Baby Boomer'; rangoAnios = '1946–1964'; color = '#F59E0B';
    descripcion = 'La generación del auge demográfico postguerra. Testigos de la televisión, el rock and roll y los primeros viajes espaciales. Impulsaron el movimiento de los derechos civiles.';
    caracteristicas = ['Optimismo y fe en el progreso', 'Fuerte ética de trabajo', 'Lealtad a la empresa', 'Pioneros de la contracultura'];
  } else if (anioNacimiento <= 1980) {
    generacion = 'Generación X'; rangoAnios = '1965–1980'; color = '#8B5CF6';
    descripcion = 'La generación "olvidada" entre los Boomers y los Millennials. Creció con el surgimiento de la MTV, el fin de la Guerra Fría y los primeros ordenadores personales.';
    caracteristicas = ['Alta independencia y autonomía', 'Escepticismo saludable', 'Equilibrio trabajo-vida personal', 'Adaptabilidad tecnológica'];
  } else if (anioNacimiento <= 1996) {
    generacion = 'Millennial'; rangoAnios = '1981–1996'; color = '#06B6D4';
    descripcion = 'La primera generación verdaderamente digital. Creció con internet y los móviles. Más educada que las anteriores, pero enfrentó la Gran Recesión de 2008 y la crisis del empleo.';
    caracteristicas = ['Nativos digitales tempranos', 'Mentalidad colaborativa', 'Valores de propósito en el trabajo', 'Endeudados pero optimistas'];
  } else if (anioNacimiento <= 2012) {
    generacion = 'Generación Z'; rangoAnios = '1997–2012'; color = '#10B981';
    descripcion = 'La primera generación que nunca conoció el mundo sin smartphones e internet. Creció con las redes sociales, la crisis climática y la pandemia de COVID-19.';
    caracteristicas = ['Nativos digitales totales', 'Pragmatismo financiero', 'Alta conciencia social y ambiental', 'Comunicación visual e instantánea'];
  } else {
    generacion = 'Generación Alpha'; rangoAnios = '2013–actualidad'; color = '#F43F5E';
    descripcion = 'La generación más joven, nacida en un mundo completamente digital, con inteligencia artificial, TikTok y streaming desde el inicio. Aún en formación como generación.';
    caracteristicas = ['Hiper-conectados desde el nacimiento', 'Influenciados por creadores de contenido', 'Educación híbrida presencial-digital', 'Nativos de la IA'];
  }
  return { generacion, rangoAnios, descripcion, caracteristicas, color, edadActual };
}

// ─── FECHA DE JUBILACIÓN ─────────────────────────────────────────────────────
export type PaisJubilacion =
  'argentina' | 'mexico' | 'colombia' | 'chile' | 'peru' | 'espana' |
  'venezuela' | 'ecuador' | 'bolivia' | 'paraguay' | 'uruguay' | 'otro';

const EDADES_JUBILACION: Record<PaisJubilacion, { hombre: number; mujer: number; nombre: string }> = {
  argentina: { hombre: 65, mujer: 60, nombre: 'Argentina' },
  mexico:    { hombre: 65, mujer: 65, nombre: 'México' },
  colombia:  { hombre: 62, mujer: 57, nombre: 'Colombia' },
  chile:     { hombre: 65, mujer: 65, nombre: 'Chile' },
  peru:      { hombre: 65, mujer: 65, nombre: 'Perú' },
  espana:    { hombre: 67, mujer: 67, nombre: 'España' },
  venezuela: { hombre: 60, mujer: 55, nombre: 'Venezuela' },
  ecuador:   { hombre: 65, mujer: 65, nombre: 'Ecuador' },
  bolivia:   { hombre: 65, mujer: 60, nombre: 'Bolivia' },
  paraguay:  { hombre: 60, mujer: 60, nombre: 'Paraguay' },
  uruguay:   { hombre: 65, mujer: 65, nombre: 'Uruguay' },
  otro:      { hombre: 65, mujer: 65, nombre: 'País no listado' },
};

export function calcularJubilacion(edadActual: number, sexo: 'hombre' | 'mujer', pais: PaisJubilacion): {
  edadJubilacion: number; aniosRestantes: number; mesesRestantes: number;
  yaJubilado: boolean; paisNombre: string; anioEstimado: number;
  descripcion: string;
} {
  const datos = EDADES_JUBILACION[pais];
  const edadJubilacion = datos[sexo];
  const aniosRestantes = Math.max(0, edadJubilacion - edadActual);
  const mesesRestantes = aniosRestantes * 12;
  const anioEstimado   = new Date().getFullYear() + aniosRestantes;
  const yaJubilado     = edadActual >= edadJubilacion;
  const descripcion    = yaJubilado
    ? `Has alcanzado la edad de jubilación legal en ${datos.nombre} (${edadJubilacion} años).`
    : `En ${datos.nombre}, la edad legal de jubilación para ${sexo === 'hombre' ? 'hombres' : 'mujeres'} es ${edadJubilacion} años. Te quedan aproximadamente ${aniosRestantes} año${aniosRestantes !== 1 ? 's' : ''}.`;
  return { edadJubilacion, aniosRestantes, mesesRestantes, yaJubilado, paisNombre: datos.nombre, anioEstimado, descripcion };
}

// ─── EDAD EN OTROS PLANETAS ──────────────────────────────────────────────────
export function calcularEdadPlanetas(edadAnios: number): {
  planetas: { nombre: string; periodo: number; edad: number; emoji: string; descripcion: string }[];
} {
  const datos = [
    { nombre: 'Mercurio',  periodo: 0.2408, emoji: '☿', descripcion: 'El más cercano al Sol. Su año dura solo 88 días terrestres.' },
    { nombre: 'Venus',     periodo: 0.6152, emoji: '♀', descripcion: 'El planeta más caliente. Su año dura 225 días terrestres.' },
    { nombre: 'Marte',     periodo: 1.881,  emoji: '♂', descripcion: 'El planeta rojo. Su año equivale a casi 2 años terrestres.' },
    { nombre: 'Júpiter',   periodo: 11.86,  emoji: '♃', descripcion: 'El gigante gaseoso. Su año dura casi 12 años terrestres.' },
    { nombre: 'Saturno',   periodo: 29.46,  emoji: '♄', descripcion: 'Con sus anillos icónicos. Su año dura casi 30 años terrestres.' },
    { nombre: 'Urano',     periodo: 84.01,  emoji: '⛢', descripcion: 'El planeta inclinado. Su año dura 84 años terrestres.' },
    { nombre: 'Neptuno',   periodo: 164.8,  emoji: '♆', descripcion: 'El más lejano. Su año dura 165 años terrestres.' },
  ];
  const planetas = datos.map(p => ({
    ...p,
    edad: parseFloat((edadAnios / p.periodo).toFixed(2)),
  }));
  return { planetas };
}

// ─── CUÁNDO HACER EL TEST DE EMBARAZO ────────────────────────────────────────
export function calcularCuandoTestEmbarazo(ultimaMenstruacion: string, duracionCiclo: number): {
  fechaOvulacion: string; diaTestMinimo: string; diaTestOptimo: string;
  diasHastaTestOptimo: number; puedeHacerTest: boolean; explicacion: string;
} {
  const um   = new Date(ultimaMenstruacion);
  const hoy  = new Date();
  const ovulacionMs = um.getTime() + (duracionCiclo - 14) * 24 * 60 * 60 * 1000;
  const ovulacion   = new Date(ovulacionMs);
  const testMinimo  = new Date(ovulacionMs + 10 * 24 * 60 * 60 * 1000);
  const testOptimo  = new Date(ovulacionMs + 14 * 24 * 60 * 60 * 1000);
  const diasHastaTestOptimo = Math.ceil((testOptimo.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
  const puedeHacerTest = hoy >= testMinimo;
  const fmt = (d: Date) => d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  const explicacion = puedeHacerTest
    ? 'Ya puedes realizarte el test. Para mayor precisión, hazlo por la mañana con la primera orina del día.'
    : `El test puede dar negativo falso si se hace muy pronto. Espera hasta el día óptimo para una lectura fiable.`;
  return {
    fechaOvulacion: fmt(ovulacion),
    diaTestMinimo:  fmt(testMinimo),
    diaTestOptimo:  fmt(testOptimo),
    diasHastaTestOptimo: Math.max(0, diasHastaTestOptimo),
    puedeHacerTest,
    explicacion,
  };
}

// ─── PESO DEL BEBÉ POR SEMANA ────────────────────────────────────────────────
const PESO_BEBE_OMS: Record<number, { pesoMinG: number; pesoMaxG: number; tallaMinCm: number; tallaMaxCm: number; descripcion: string }> = {
  8:  { pesoMinG: 1,    pesoMaxG: 2,    tallaMinCm: 1.6,  tallaMaxCm: 2,    descripcion: 'Tamaño de una frambuesa. Se forman los principales órganos.' },
  10: { pesoMinG: 4,    pesoMaxG: 5,    tallaMinCm: 3,    tallaMaxCm: 3.5,  descripcion: 'Tamaño de una ciruela. Ya tiene todos los órganos formados.' },
  12: { pesoMinG: 14,   pesoMaxG: 18,   tallaMinCm: 5.5,  tallaMaxCm: 6,    descripcion: 'Tamaño de una lima. Finaliza el primer trimestre.' },
  16: { pesoMinG: 100,  pesoMaxG: 120,  tallaMinCm: 11,   tallaMaxCm: 12,   descripcion: 'Tamaño de un aguacate. Puede escuchar sonidos.' },
  20: { pesoMinG: 280,  pesoMaxG: 320,  tallaMinCm: 25,   tallaMaxCm: 26,   descripcion: 'Tamaño de un plátano. Mitad del embarazo.' },
  24: { pesoMinG: 530,  pesoMaxG: 600,  tallaMinCm: 29,   tallaMaxCm: 30,   descripcion: 'Tamaño de una mazorca de maíz. Se forman las huellas dactilares.' },
  28: { pesoMinG: 900,  pesoMaxG: 1100, tallaMinCm: 36,   tallaMaxCm: 37,   descripcion: 'Tamaño de una berenjena. Abre y cierra los ojos.' },
  32: { pesoMinG: 1700, pesoMaxG: 1900, tallaMinCm: 41,   tallaMaxCm: 43,   descripcion: 'Tamaño de un coco. El cerebro se desarrolla rápidamente.' },
  36: { pesoMinG: 2600, pesoMaxG: 2900, tallaMinCm: 47,   tallaMaxCm: 48,   descripcion: 'Casi a término. Los pulmones están casi maduros.' },
  40: { pesoMinG: 3200, pesoMaxG: 3600, tallaMinCm: 50,   tallaMaxCm: 51,   descripcion: 'A término completo. Listo para nacer.' },
};

export function calcularPesoBebeSemanaPorSemana(semana: number): {
  semana: number; pesoMinG: number; pesoMaxG: number; pesoMedioG: number;
  tallaMinCm: number; tallaMaxCm: number; tallaMediaCm: number;
  descripcion: string; trimestre: number;
} {
  const semanas = Object.keys(PESO_BEBE_OMS).map(Number).sort((a, b) => a - b);
  let inferior = semanas[0], superior = semanas[semanas.length - 1];
  for (let i = 0; i < semanas.length - 1; i++) {
    if (semana >= semanas[i] && semana <= semanas[i + 1]) {
      inferior = semanas[i]; superior = semanas[i + 1]; break;
    }
  }
  if (semana <= semanas[0]) { inferior = superior = semanas[0]; }
  if (semana >= semanas[semanas.length - 1]) { inferior = superior = semanas[semanas.length - 1]; }
  const a = PESO_BEBE_OMS[inferior], b = PESO_BEBE_OMS[superior];
  const t = inferior === superior ? 0 : (semana - inferior) / (superior - inferior);
  const interp = (x: number, y: number) => Math.round(x + (y - x) * t);
  const interpF = (x: number, y: number) => parseFloat((x + (y - x) * t).toFixed(1));
  const pesoMinG   = interp(a.pesoMinG, b.pesoMinG);
  const pesoMaxG   = interp(a.pesoMaxG, b.pesoMaxG);
  const tallaMinCm = interpF(a.tallaMinCm, b.tallaMinCm);
  const tallaMaxCm = interpF(a.tallaMaxCm, b.tallaMaxCm);
  const descripcion = inferior === superior ? PESO_BEBE_OMS[inferior].descripcion : PESO_BEBE_OMS[inferior].descripcion;
  const trimestre   = semana <= 13 ? 1 : semana <= 26 ? 2 : 3;
  return {
    semana,
    pesoMinG, pesoMaxG, pesoMedioG: Math.round((pesoMinG + pesoMaxG) / 2),
    tallaMinCm, tallaMaxCm, tallaMediaCm: interpF(a.tallaMinCm, b.tallaMaxCm),
    descripcion, trimestre,
  };
}

// ─── CALCULADORA DE LACTANCIA ────────────────────────────────────────────────
export function calcularLactancia(pesoMadreKg: number, frecuenciaTomas: number): {
  mlPorToma: number; mlTotalDia: number; caloriasExtra: number;
  duracionRecomendadaMeses: number; beneficiosBebe: string[]; beneficiosMadre: string[];
  recomendacion: string;
} {
  const mlPorToma    = Math.round(600 / Math.max(1, frecuenciaTomas));
  const mlTotalDia   = mlPorToma * frecuenciaTomas;
  const caloriasExtra = Math.round(pesoMadreKg > 0 ? 500 : 500);
  const beneficiosBebe: string[] = [
    'Anticuerpos que protegen de infecciones',
    'Menor riesgo de alergias y asma',
    'Desarrollo cognitivo optimizado',
    'Menor riesgo de obesidad infantil',
    'Vínculo afectivo reforzado',
  ];
  const beneficiosMadre: string[] = [
    'Recuperación uterina más rápida',
    'Reducción del riesgo de cáncer de mama',
    'Quema aproximada de 500 kcal adicionales por día',
    'Menor riesgo de osteoporosis a largo plazo',
    'Reducción del riesgo de diabetes tipo 2',
  ];
  const recomendacion = 'La OMS recomienda lactancia materna exclusiva durante los primeros 6 meses de vida, y continuar hasta los 2 años o más junto con alimentación complementaria.';
  return {
    mlPorToma, mlTotalDia, caloriasExtra: 500,
    duracionRecomendadaMeses: 24, beneficiosBebe, beneficiosMadre, recomendacion,
  };
}

// ─── FECHA DE CONCEPCIÓN ─────────────────────────────────────────────────────
export function calcularFechaConcepcion(
  tipo: 'parto' | 'regla',
  fecha: string,
  duracionCiclo: number = 28
): {
  fechaConcepcionEstimada: string; ventanaInicio: string; ventanaFin: string;
  semanasActuales: number; explicacion: string;
} {
  let concepcion: Date;
  if (tipo === 'parto') {
    const parto = new Date(fecha);
    concepcion = new Date(parto.getTime() - 266 * 24 * 60 * 60 * 1000);
  } else {
    const regla = new Date(fecha);
    concepcion = new Date(regla.getTime() + (duracionCiclo - 14) * 24 * 60 * 60 * 1000);
  }
  const ventanaInicio = new Date(concepcion.getTime() - 3 * 24 * 60 * 60 * 1000);
  const ventanaFin    = new Date(concepcion.getTime() + 2 * 24 * 60 * 60 * 1000);
  const hoy = new Date();
  const semanasActuales = Math.floor((hoy.getTime() - concepcion.getTime()) / (7 * 24 * 60 * 60 * 1000));
  const fmt = (d: Date) => d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  const explicacion = tipo === 'parto'
    ? 'Estimación basada en la fecha probable de parto. La concepción ocurre ~266 días antes del parto (38 semanas de embarazo real).'
    : 'Estimación basada en la última regla. La concepción ocurre alrededor del día de ovulación (ciclo − 14 días).';
  return {
    fechaConcepcionEstimada: fmt(concepcion),
    ventanaInicio: fmt(ventanaInicio),
    ventanaFin:    fmt(ventanaFin),
    semanasActuales: Math.max(0, semanasActuales),
    explicacion,
  };
}

// ─── BATCH EMBARAZO EXTRA ────────────────────────────────────────────────────

// ─── VENTANA FÉRTIL CON PROBABILIDADES ───────────────────────────────────────
export interface DiaFertilidad {
  fecha: Date;
  diaRelativo: number;
  probabilidad: number;
  etiqueta: string;
  color: string;
}

export interface VentanaFertilResult {
  ovulacion: Date;
  diasFertiles: DiaFertilidad[];
  inicioVentana: Date;
  finVentana: Date;
  diasHastaOvulacion: number;
  proximoCiclo: Date;
  enVentanaAhora: boolean;
}

export function calcularVentanaFertil(
  ultimaMenstruacion: Date,
  duracionCiclo: number,
): VentanaFertilResult {
  const diaOvulacion = duracionCiclo - 14;
  const ovulacion = new Date(ultimaMenstruacion.getTime() + diaOvulacion * 86400000);
  const hoy = new Date();

  const probs: { diaRelativo: number; prob: number; etiqueta: string; color: string }[] = [
    { diaRelativo: -5, prob: 10, etiqueta: 'Fértil',     color: '#60A5FA' },
    { diaRelativo: -4, prob: 14, etiqueta: 'Fértil',     color: '#60A5FA' },
    { diaRelativo: -3, prob: 22, etiqueta: 'Muy fértil', color: '#FB923C' },
    { diaRelativo: -2, prob: 27, etiqueta: 'Muy fértil', color: '#FB923C' },
    { diaRelativo: -1, prob: 33, etiqueta: 'Más fértil', color: '#CAFF00' },
    { diaRelativo:  0, prob: 15, etiqueta: 'Ovulación',  color: '#F43F5E' },
  ];

  const diasFertiles: DiaFertilidad[] = probs.map(p => ({
    fecha: new Date(ovulacion.getTime() + p.diaRelativo * 86400000),
    diaRelativo: p.diaRelativo,
    probabilidad: p.prob,
    etiqueta: p.etiqueta,
    color: p.color,
  }));

  const inicioVentana = diasFertiles[0].fecha;
  const finVentana    = diasFertiles[5].fecha;
  const diasHastaOvulacion = Math.ceil((ovulacion.getTime() - hoy.getTime()) / 86400000);
  const proximoCiclo  = new Date(ultimaMenstruacion.getTime() + duracionCiclo * 86400000);
  const enVentanaAhora = hoy >= inicioVentana && hoy <= new Date(finVentana.getTime() + 86400000);

  return { ovulacion, diasFertiles, inicioVentana, finVentana, diasHastaOvulacion, proximoCiclo, enVentanaAhora };
}

// ─── EDAD GESTACIONAL ─────────────────────────────────────────────────────────
export interface EdadGestacionalResult {
  semanas: number;
  diasExtra: number;
  totalDias: number;
  trimestre: 1 | 2 | 3;
  fpp: Date;
  fechaConcepcionEstimada: Date;
  etapa: string;
  hitoActual: string;
  diasParaParto: number;
  porcentajeCompletado: number;
}

export function calcularEdadGestacional(
  tipo: 'fur' | 'concepcion',
  fecha: Date,
): EdadGestacionalResult {
  const fur = tipo === 'fur'
    ? fecha
    : new Date(fecha.getTime() - 14 * 86400000);

  const fechaConcepcionEstimada = new Date(fur.getTime() + 14 * 86400000);
  const hoy = new Date();
  const totalDias = Math.floor((hoy.getTime() - fur.getTime()) / 86400000);
  const semanas   = Math.floor(totalDias / 7);
  const diasExtra = totalDias % 7;
  const fpp       = new Date(fur.getTime() + 280 * 86400000);
  const diasParaParto = Math.max(0, Math.ceil((fpp.getTime() - hoy.getTime()) / 86400000));
  const porcentajeCompletado = Math.min(100, Math.round((totalDias / 280) * 100));
  const trimestre: 1 | 2 | 3 = semanas < 14 ? 1 : semanas < 28 ? 2 : 3;

  let etapa: string;
  let hitoActual: string;
  if (semanas < 6)       { etapa = 'Embrión temprano';         hitoActual = 'Implantación completada. Inicio de la formación del saco amniótico y vellosidades coriónicas.'; }
  else if (semanas < 9)  { etapa = 'Período embrionario';      hitoActual = 'El corazón ya late (semana 6). Se forman el tubo neural, los miembros y los principales órganos.'; }
  else if (semanas < 14) { etapa = 'Final del 1er trimestre';  hitoActual = 'Todos los órganos están formados. El bebé puede cerrar el puño y tiene huellas dactilares visibles.'; }
  else if (semanas < 20) { etapa = '2° trimestre temprano';    hitoActual = 'El bebé puede oír. Movimientos visibles en ecografía. Se distingue el sexo del bebé.'; }
  else if (semanas < 28) { etapa = '2° trimestre tardío';      hitoActual = 'El bebé abre los ojos. Ciclos de sueño-vigilia establecidos. Los pulmones maduran.'; }
  else if (semanas < 32) { etapa = '3er trimestre temprano';   hitoActual = 'El cerebro se desarrolla rápidamente. El bebé almacena grasa y gana peso notable.'; }
  else if (semanas < 37) { etapa = 'Pretérmino tardío';        hitoActual = 'Pulmones casi maduros. El bebé adopta posición cefálica. Ganancia de peso final.'; }
  else                   { etapa = 'A término completo';       hitoActual = 'El bebé está listo para nacer. Peso aprox. 3–3.5 kg. El parto puede ocurrir en cualquier momento.'; }

  return { semanas, diasExtra, totalDias, trimestre, fpp, fechaConcepcionEstimada, etapa, hitoActual, diasParaParto, porcentajeCompletado };
}

// ─── TRIMESTRE DEL EMBARAZO ───────────────────────────────────────────────────
export interface HitoEmbarazo { semana: number; descripcion: string; }

export interface TrimestreEmbarazoResult {
  trimestre: 1 | 2 | 3;
  semanasRestantesTrimestre: number;
  semanaInicioTrimestre: number;
  semanaFinTrimestre: number;
  hitosBebe: HitoEmbarazo[];
  hitosEmbarazada: string[];
  checklistMedico: string[];
  color: string;
}

export function calcularTrimestreEmbarazo(semanas: number): TrimestreEmbarazoResult {
  let trimestre: 1 | 2 | 3;
  let semanaInicioTrimestre: number;
  let semanaFinTrimestre: number;
  let color: string;
  let hitosBebe: HitoEmbarazo[];
  let hitosEmbarazada: string[];
  let checklistMedico: string[];

  if (semanas <= 13) {
    trimestre = 1; semanaInicioTrimestre = 1; semanaFinTrimestre = 13; color = '#60A5FA';
    hitosBebe = [
      { semana: 6,  descripcion: 'El corazón comienza a latir (110–160 latidos/min)' },
      { semana: 8,  descripcion: 'Tamaño de una frambuesa. Se forman todos los órganos principales' },
      { semana: 10, descripcion: 'Dedos completamente formados. Puede mover los miembros' },
      { semana: 12, descripcion: 'Puede abrir y cerrar el puño. Se ven las huellas dactilares' },
      { semana: 13, descripcion: 'Tamaño de un limón. El riesgo de aborto cae drásticamente' },
    ];
    hitosEmbarazada = ['Náuseas y fatiga intensa (primer trimestre)', 'Aumento del pecho y sensibilidad mamaria', 'Primera ecografía (semanas 11–13) con translucencia nucal', 'Análisis de sangre del primer trimestre'];
    checklistMedico = ['Primera consulta prenatal antes de la semana 10', 'Analítica completa + grupo sanguíneo + serologías', 'Ecografía 11–13 semanas + marcadores bioquímicos', 'Comenzar ácido fólico 400–800 mcg/día (antes y durante)', 'Evitar alcohol, tabaco y medicamentos sin prescripción'];
  } else if (semanas <= 26) {
    trimestre = 2; semanaInicioTrimestre = 14; semanaFinTrimestre = 26; color = '#34D399';
    hitosBebe = [
      { semana: 16, descripcion: 'Tamaño de un aguacate. Puede escuchar sonidos y voces' },
      { semana: 18, descripcion: 'Se distingue el sexo en ecografía. Bosteza y se chupa el pulgar' },
      { semana: 20, descripcion: 'Ecografía morfológica. Mide ~25 cm. Mitad del embarazo' },
      { semana: 24, descripcion: 'Umbral de viabilidad extrauterina. Huellas dactilares completas' },
      { semana: 26, descripcion: 'Abre y cierra los ojos. Los pulmones producen surfactante' },
    ];
    hitosEmbarazada = ['Generalmente cesan las náuseas', 'Movimiento fetal perceptible (semana 16–20)', 'Crecimiento visible del abdomen', 'Posibles dolores de espalda y ligamentos redondos'];
    checklistMedico = ['Ecografía morfológica (semana 20)', 'Test de O\'Sullivan para diabetes gestacional (semanas 24–28)', 'Control tensional en cada visita', 'Hierro oral si hay anemia ferropénica', 'Vacuna dTpa (tosferina) entre semanas 27 y 36'];
  } else {
    trimestre = 3; semanaInicioTrimestre = 27; semanaFinTrimestre = 40; color = '#FB923C';
    hitosBebe = [
      { semana: 28, descripcion: 'Tamaño de berenjena. El cerebro se pliega y desarrolla rápidamente' },
      { semana: 32, descripcion: 'Los pulmones casi maduros. El bebé almacena grasa rápidamente' },
      { semana: 36, descripcion: 'Posición cefálica (cabeza abajo) para el parto. Pulmones casi listos' },
      { semana: 38, descripcion: 'A término temprano. Puede nacer en cualquier momento' },
      { semana: 40, descripcion: 'Término completo. Peso promedio: 3.2–3.6 kg, talla: 50–51 cm' },
    ];
    hitosEmbarazada = ['Mayor cansancio y dificultad para dormir', 'Contracciones de Braxton Hicks frecuentes', 'Descenso del bebé hacia la pelvis (semana 36+)', 'Preparación para el parto y la lactancia'];
    checklistMedico = ['Controles cada 2 semanas (semanas 28–36), luego semanales', 'Ecografía de crecimiento fetal', 'Cultivo de estreptococo grupo B (semanas 35–37)', 'Elaborar plan de parto', 'Preparar bolsa de hospital'];
  }

  const semanasRestantesTrimestre = Math.max(0, semanaFinTrimestre - semanas);
  return { trimestre, semanasRestantesTrimestre, semanaInicioTrimestre, semanaFinTrimestre, hitosBebe, hitosEmbarazada, checklistMedico, color };
}

// ─── GANANCIA DE PESO EN EL EMBARAZO (IOM 2009 / OMS) ────────────────────────
export interface GananciaTrimestre { trimestre: number; gananciaKg: string; ritmoSem: string; }

export interface GananciaPesoEmbarazoResult {
  imcPreEmbarazo: number;
  categoriaIMC:   string;
  gananciaMinKg:  number;
  gananciaMaxKg:  number;
  gananciaActualKg: number;
  gananciaEsperadaKg: number;
  estado:         string;
  color:          string;
  porTrimestre:   GananciaTrimestre[];
  recomendacion:  string;
}

export function calcularGananciaPesoEmbarazo(
  pesoInicialKg:  number,
  alturaCm:       number,
  pesoActualKg:   number,
  semanasActuales: number,
  gemelar:        boolean,
): GananciaPesoEmbarazoResult {
  const alturaM = alturaCm / 100;
  const imcPreEmbarazo = Math.round((pesoInicialKg / (alturaM * alturaM)) * 10) / 10;

  let categoriaIMC: string;
  let gananciaMinKg: number;
  let gananciaMaxKg: number;
  let ritmo1: number;
  let ritmo23: number;

  if (imcPreEmbarazo < 18.5) {
    categoriaIMC = 'Bajo peso';
    gananciaMinKg = gemelar ? 22.7 : 12.5; gananciaMaxKg = gemelar ? 28.1 : 18;
    ritmo1 = 0.5; ritmo23 = 0.5;
  } else if (imcPreEmbarazo < 25) {
    categoriaIMC = 'Peso normal';
    gananciaMinKg = gemelar ? 16.8 : 11.5; gananciaMaxKg = gemelar ? 24.5 : 16;
    ritmo1 = 0.4; ritmo23 = 0.45;
  } else if (imcPreEmbarazo < 30) {
    categoriaIMC = 'Sobrepeso';
    gananciaMinKg = gemelar ? 14.1 : 7; gananciaMaxKg = gemelar ? 22.7 : 11.5;
    ritmo1 = 0.3; ritmo23 = 0.3;
  } else {
    categoriaIMC = 'Obesidad';
    gananciaMinKg = gemelar ? 11.3 : 5; gananciaMaxKg = gemelar ? 19.1 : 9;
    ritmo1 = 0.2; ritmo23 = 0.25;
  }

  const gananciaActualKg = Math.round((pesoActualKg - pesoInicialKg) * 10) / 10;
  const gananciaEsperadaKg = Math.round((semanasActuales <= 13
    ? ritmo1 * semanasActuales
    : ritmo1 * 13 + ritmo23 * (semanasActuales - 13)) * 10) / 10;

  const diff = gananciaActualKg - gananciaEsperadaKg;
  let estado: string;
  let color: string;
  if (diff < -2)       { estado = 'Por debajo de lo esperado'; color = '#60A5FA'; }
  else if (diff > 2.5) { estado = 'Por encima de lo esperado'; color = '#F87171'; }
  else                 { estado = 'Dentro del rango esperado'; color = '#34D399'; }

  const porTrimestre: GananciaTrimestre[] = [
    { trimestre: 1, gananciaKg: `1–2 kg`, ritmoSem: `${ritmo1} kg/sem` },
    { trimestre: 2, gananciaKg: `${Math.round(ritmo23 * 13 * 10) / 10} kg`, ritmoSem: `${ritmo23} kg/sem` },
    { trimestre: 3, gananciaKg: `${Math.round(ritmo23 * 14 * 10) / 10} kg`, ritmoSem: `${ritmo23} kg/sem` },
  ];

  const recomendacion = `IMC pre-embarazo ${imcPreEmbarazo} (${categoriaIMC}). Ganancia total recomendada: ${gananciaMinKg}–${gananciaMaxKg} kg${gemelar ? ' (gemelar)' : ''}. Consulta con tu obstetra o matrona.`;

  return { imcPreEmbarazo, categoriaIMC, gananciaMinKg, gananciaMaxKg, gananciaActualKg, gananciaEsperadaKg, estado, color, porTrimestre, recomendacion };
}

// ─── CONTADOR DE MOVIMIENTOS FETALES ─────────────────────────────────────────
export interface KickCounterResult {
  cantidad:            number;
  minutosTranscurridos: number;
  objetivo:            number;
  alcanzado:           boolean;
  velocidad:           string;
  alerta:              boolean;
  mensaje:             string;
  color:               string;
}

export function evaluarKickCounter(
  cantidad:            number,
  minutosTranscurridos: number,
  semanasEmbarazo:     number,
): KickCounterResult {
  const objetivo = 10;
  const alcanzado = cantidad >= objetivo;
  const seg = minutosTranscurridos > 0 && cantidad > 0
    ? Math.round(minutosTranscurridos / cantidad)
    : 0;
  const velocidad = cantidad > 0 ? `1 mov. cada ${seg} min` : 'Sin movimientos aún';

  let alerta: boolean;
  let mensaje: string;
  let color: string;

  if (semanasEmbarazo < 28) {
    alerta = false; color = '#60A5FA';
    mensaje = 'Antes de la semana 28 los movimientos son más irregulares. Monitoriza diariamente a partir de la semana 28.';
  } else if (alcanzado) {
    alerta = false; color = '#34D399';
    mensaje = `¡Excelente! ${cantidad} movimientos en ${minutosTranscurridos} min. Patrón normal. Repite mañana a la misma hora.`;
  } else if (minutosTranscurridos >= 120) {
    alerta = true; color = '#F87171';
    mensaje = `Solo ${cantidad} de ${objetivo} movimientos en 2 horas. Contacta a tu médico o ve a urgencias. No esperes.`;
  } else {
    alerta = false; color = '#FB923C';
    mensaje = `${cantidad} de ${objetivo} movimientos. Continúa contando. Si en 2 horas no llegas a 10, llama a tu médico.`;
  }

  return { cantidad, minutosTranscurridos, objetivo, alcanzado, velocidad, alerta, mensaje, color };
}

// ─── DÍAS ÓPTIMOS PARA TEST DE OVULACIÓN LH ──────────────────────────────────
export interface DiaTestOvulacion {
  dia: number;
  fecha: Date;
  recomendado: boolean;
  etiqueta: string;
}

export interface TestOvulacionLHResult {
  diaInicioTest:      number;
  diaFinTest:         number;
  fechaInicioTest:    Date;
  diaOvulacion:       number;
  diasTest:           DiaTestOvulacion[];
  instrucciones:      string[];
  advertencias:       string[];
}

export function calcularTestOvulacionLH(
  ultimaMenstruacion: Date,
  duracionCiclo:      number,
): TestOvulacionLHResult {
  const diaOvulacion   = duracionCiclo - 14;
  const diaInicioTest  = Math.max(1, diaOvulacion - 4);
  const diaFinTest     = diaOvulacion + 2;
  const fechaInicioTest = new Date(ultimaMenstruacion.getTime() + diaInicioTest * 86400000);

  const diasTest: DiaTestOvulacion[] = [];
  for (let d = diaInicioTest; d <= diaFinTest; d++) {
    const fecha = new Date(ultimaMenstruacion.getTime() + d * 86400000);
    const recomendado = d >= diaOvulacion - 2 && d <= diaOvulacion;
    let etiqueta: string;
    if (d === diaOvulacion)     etiqueta = 'Ovulación estimada';
    else if (d === diaOvulacion - 1) etiqueta = 'Pico de LH probable';
    else if (d === diaOvulacion - 2) etiqueta = 'Alta probabilidad LH+';
    else if (d < diaOvulacion)  etiqueta = 'Inicio monitoreo';
    else                         etiqueta = 'Confirmación';
    diasTest.push({ dia: d, fecha, recomendado, etiqueta });
  }

  const instrucciones = [
    'Haz el test entre las 10:00 y las 20:00 (el LH sube en la mañana y se detecta en orina horas después)',
    'Usa la segunda orina del día, no la primera de la mañana',
    'Reduce la ingesta de líquidos las 2 horas previas para no diluir la muestra',
    'Lee el resultado a los 3–5 minutos exactos',
    'Resultado positivo: línea de test tan oscura o más oscura que la línea de control',
    'Tras el pico de LH, la ovulación ocurre en las próximas 24–36 horas',
  ];

  const advertencias = [
    'Los ciclos irregulares pueden requerir empezar el test antes del día indicado',
    'El SOP puede dar picos de LH múltiples sin ovulación real',
    'Las tiras tienen sensibilidades variables (20–40 mIU/ml) — revisa las instrucciones del fabricante',
  ];

  return { diaInicioTest, diaFinTest, fechaInicioTest, diaOvulacion, diasTest, instrucciones, advertencias };
}

// ─── BETA HCG ─────────────────────────────────────────────────────────────────
export interface BetaHCGResult {
  tasaAumentoPct:    number;
  tiempoDuplicacion: number;
  interpretacion:    string;
  color:             string;
  recomendacion:     string;
  semanaEstimada:    string;
  ascensoAdecuado:   boolean;
}

export function calcularBetaHCG(
  hcg1: number,
  hcg2: number,
  dias: number,
): BetaHCGResult {
  const ratio = hcg2 / hcg1;
  const tasaAumentoPct = Math.round((ratio - 1) * 100);
  const tiempoDuplicacion = ratio > 1
    ? Math.round((dias * Math.LN2) / Math.log(ratio) * 10) / 10
    : 0;

  // Normalized increase to 48h equivalent
  const aumento48h = dias > 0 ? Math.pow(ratio, 2 / dias) - 1 : 0;

  let interpretacion: string;
  let color: string;
  let recomendacion: string;
  let ascensoAdecuado: boolean;

  if (hcg2 < hcg1) {
    interpretacion = 'Descenso de hCG';
    color = '#F87171'; ascensoAdecuado = false;
    recomendacion = 'El descenso de hCG puede indicar aborto espontáneo o embarazo ectópico en resolución. Consulta a tu médico urgentemente.';
  } else if (aumento48h >= 0.66) {
    interpretacion = 'Ascenso normal (≥66% en 48 h)';
    color = '#34D399'; ascensoAdecuado = true;
    recomendacion = 'El ascenso de hCG es adecuado para un embarazo intrauterino evolutivo. Continúa con los controles programados por tu médico.';
  } else if (aumento48h >= 0.53) {
    interpretacion = 'Ascenso en el límite bajo (53–66% en 48 h)';
    color = '#CAFF00'; ascensoAdecuado = true;
    recomendacion = 'Ascenso en el límite inferior aceptable. Repite la beta-hCG en 48 h y realiza ecografía transvaginal para confirmar localización del embarazo.';
  } else {
    interpretacion = 'Ascenso insuficiente (<53% en 48 h)';
    color = '#FB923C'; ascensoAdecuado = false;
    recomendacion = 'Un ascenso menor al 53% en 48 h puede indicar embarazo ectópico o gestación no evolutiva. Acude a urgencias obstétricas sin demora.';
  }

  let semanaEstimada: string;
  if (hcg2 < 1200)       semanaEstimada = '3–4 semanas';
  else if (hcg2 < 6000)  semanaEstimada = '4–5 semanas';
  else if (hcg2 < 32000) semanaEstimada = '5–6 semanas';
  else if (hcg2 < 100000) semanaEstimada = '6–7 semanas';
  else                   semanaEstimada = '> 7 semanas';

  return { tasaAumentoPct, tiempoDuplicacion, interpretacion, color, recomendacion, semanaEstimada, ascensoAdecuado };
}

// ─── PROBABILIDAD DE EMBARAZO POR DÍA DEL CICLO ──────────────────────────────
export interface ProbabilidadEmbarazoResult {
  probabilidadPct: number;
  etapa:           string;
  color:           string;
  descripcion:     string;
  diasDesdeOvulacion: number;
  recomendacion:   string;
}

export function calcularProbabilidadEmbarazo(
  diasDesdeFUR:  number,
  duracionCiclo: number,
  relaciones:    'una' | 'repetidas' | 'ninguna',
): ProbabilidadEmbarazoResult {
  const diaOvulacion = duracionCiclo - 14;
  const diasDesdeOvulacion = diasDesdeFUR - diaOvulacion;

  const probIndividual: Record<number, number> = {
    [-5]: 0.10, [-4]: 0.14, [-3]: 0.22, [-2]: 0.27, [-1]: 0.33,
    [0]: 0.15, [1]: 0.05, [2]: 0.02,
  };

  const prob = probIndividual[diasDesdeOvulacion] ?? (diasDesdeOvulacion < -5 ? 0.01 : 0.01);

  let probabilidadPct: number;
  if (relaciones === 'ninguna')   probabilidadPct = 1;
  else if (relaciones === 'repetidas') probabilidadPct = Math.min(85, Math.round(prob * 160));
  else                            probabilidadPct = Math.round(prob * 100);

  let etapa: string;
  let color: string;
  let descripcion: string;

  if (diasDesdeOvulacion < -5) {
    etapa = 'Fase folicular'; color = '#60A5FA';
    descripcion = 'Antes de la ventana fértil. Los espermatozoides no pueden sobrevivir hasta la ovulación.';
  } else if (diasDesdeOvulacion <= -1) {
    etapa = 'Ventana fértil'; color = '#CAFF00';
    descripcion = 'Días de mayor probabilidad de concepción. Los espermatozoides sobreviven 3–5 días en el tracto reproductor.';
  } else if (diasDesdeOvulacion === 0) {
    etapa = 'Día de ovulación'; color = '#FB923C';
    descripcion = 'El óvulo es viable solo 12–24 horas. Alta probabilidad con relaciones hoy.';
  } else if (diasDesdeOvulacion <= 2) {
    etapa = 'Post-ovulación'; color = '#FB923C';
    descripcion = 'Probabilidad baja. El óvulo no suele ser viable más de 24 h tras la ovulación.';
  } else {
    etapa = 'Fase lútea'; color = '#9CA3AF';
    descripcion = 'Fuera de la ventana fértil. La probabilidad de concepción es mínima.';
  }

  const recomendacion = relaciones === 'ninguna'
    ? 'Sin relaciones sexuales en este ciclo, la probabilidad de embarazo es prácticamente nula.'
    : `En el día ${diasDesdeFUR} del ciclo (${diasDesdeOvulacion > 0 ? '+' : ''}${diasDesdeOvulacion} respecto a la ovulación), la probabilidad estimada es del ${probabilidadPct}%.`;

  return { probabilidadPct, etapa, color, descripcion, diasDesdeOvulacion, recomendacion };
}

// ─── RECUPERACIÓN POSTPARTO ───────────────────────────────────────────────────
export interface EtapaPostparto {
  nombre:       string;
  descripcion:  string;
  semanaInicio: number;
  semanaFin:    number;
  sintomas:     string[];
  consejos:     string[];
}

export interface TiempoPostpartoResult {
  semanasPostparto:       number;
  diasPostparto:          number;
  etapaActual:            EtapaPostparto;
  proxControl:            string;
  alertas:                string[];
  progresoCicatrizacion:  string;
}

export function calcularTiempoPostparto(fechaParto: Date): TiempoPostpartoResult {
  const hoy = new Date();
  const diasPostparto    = Math.floor((hoy.getTime() - fechaParto.getTime()) / 86400000);
  const semanasPostparto = Math.floor(diasPostparto / 7);

  const etapas: EtapaPostparto[] = [
    {
      nombre: 'Puerperio inmediato', descripcion: 'Primeras 24 h. Estabilización y primeros momentos con el bebé.',
      semanaInicio: 0, semanaFin: 0,
      sintomas: ['Sangrado (loquios rojos)', 'Dolor perineal o de cesárea', 'Contracciones uterinas', 'Calor y sudoración intensa'],
      consejos: ['Contacto piel con piel con el bebé', 'Inicio de lactancia en la primera hora si es posible', 'Reposo y observación médica en las primeras horas'],
    },
    {
      nombre: 'Puerperio temprano', descripcion: 'Días 2–7. El útero comienza a involucionar.',
      semanaInicio: 0, semanaFin: 1,
      sintomas: ['Loquios rosados-marrones', 'Ingurgitación mamaria (día 3–5)', 'Baby blues leve (70% de las madres)', 'Fatiga intensa'],
      consejos: ['Tomas frecuentes para establecer la lactancia (8–12 al día)', 'Reposo relativo', 'Higiene perineal con agua tibia', 'No ignorar signos de alarma'],
    },
    {
      nombre: 'Puerperio tardío', descripcion: 'Semanas 2–6. Recuperación física progresiva.',
      semanaInicio: 2, semanaFin: 6,
      sintomas: ['Loquios amarillo-blancos (disminuyendo)', 'Fatiga acumulada', 'Cambios de humor', 'Posible dolor en cicatriz'],
      consejos: ['Caminatas suaves a partir de la semana 2', 'Ejercicios de Kegel para el suelo pélvico', 'Apoyo familiar para el descanso', 'Control del estado emocional'],
    },
    {
      nombre: 'Recuperación media', descripcion: 'Semanas 6–12. Revisión puerperal y retorno a la actividad.',
      semanaInicio: 6, semanaFin: 12,
      sintomas: ['Cese de loquios', 'Posible retorno de la menstruación (sin lactancia)', 'Caída del cabello (efluvio posparto)', 'Mejora energética progresiva'],
      consejos: ['Consulta puerperal obligatoria (semana 6)', 'Retomar ejercicio gradualmente', 'Fisioterapia de suelo pélvico si hay síntomas', 'Hablar de anticoncepción con el médico'],
    },
    {
      nombre: 'Recuperación avanzada', descripcion: 'A partir de semana 12. Estabilización general.',
      semanaInicio: 12, semanaFin: 999,
      sintomas: ['Caída de cabello máxima (semana 12–16)', 'Cambios corporales que persisten', 'Energía gradualmente recuperada'],
      consejos: ['Ejercicio de intensidad moderada (consultar con médico)', 'Nutrición equilibrada especialmente en lactancia', 'Screening de depresión posparto', 'Revisión ginecológica anual'],
    },
  ];

  const etapaActual = etapas.find(e => semanasPostparto >= e.semanaInicio && semanasPostparto <= e.semanaFin) ?? etapas[etapas.length - 1];

  let proxControl: string;
  if (semanasPostparto < 1)      proxControl = 'Control de puerperio inmediato (24–48 h)';
  else if (semanasPostparto < 6) proxControl = 'Revisión puerperal a las 6 semanas del parto';
  else if (semanasPostparto < 12) proxControl = 'Consulta de suelo pélvico recomendada';
  else                           proxControl = 'Revisión ginecológica anual + suelo pélvico';

  const alertas = [
    'Fiebre > 38°C (posible infección puerperal)',
    'Loquios con mal olor intenso o color verdoso',
    'Dolor abdominal intenso no habitual',
    'Tristeza profunda > 2 semanas o incapacidad de cuidar al bebé (depresión posparto)',
    'Dolor, calor o hinchazón en una pierna (posible trombosis)',
    'Herida de episiotomía o cesárea con signos de infección',
  ];

  const progresoCicatrizacion = semanasPostparto < 2
    ? 'Cicatrización inicial — reposo y evitar esfuerzos'
    : semanasPostparto < 6
      ? 'Cicatrización en progreso — higiene cuidadosa y reposo relativo'
      : 'Cicatriz estabilizada — iniciar rehabilitación de suelo pélvico';

  return { semanasPostparto, diasPostparto, etapaActual, proxControl, alertas, progresoCicatrizacion };
}

// ─── COMPATIBILIDAD DE MEDICAMENTOS CON LACTANCIA ─────────────────────────────
export type NivelLactancia = 'L1' | 'L2' | 'L3' | 'L4' | 'L5';

interface MedDB {
  nombre: string; nivel: NivelLactancia; descripcion: string;
  recomendacion: string; color: string; alternativa: string | null;
}

const DB_LACTANCIA: MedDB[] = [
  { nombre: 'paracetamol',       nivel: 'L1', descripcion: 'Paso mínimo a la leche materna. Ampliamente usado en madres lactantes.',                               recomendacion: 'Compatible. Primera línea para dolor y fiebre.',                                                        color: '#34D399', alternativa: null },
  { nombre: 'acetaminofen',      nivel: 'L1', descripcion: 'Paso mínimo a la leche materna. Ampliamente usado en madres lactantes.',                               recomendacion: 'Compatible. Primera línea para dolor y fiebre.',                                                        color: '#34D399', alternativa: null },
  { nombre: 'ibuprofeno',        nivel: 'L1', descripcion: 'Paso muy bajo a la leche materna. Considerado seguro en lactancia.',                                   recomendacion: 'Compatible. Dosis habituales. Preferido frente a naproxeno.',                                            color: '#34D399', alternativa: null },
  { nombre: 'naproxeno',         nivel: 'L3', descripcion: 'Vida media larga. Puede acumularse en leche con uso prolongado.',                                       recomendacion: 'Preferir ibuprofeno. Si se usa, dosis únicas y espaciadas.',                                            color: '#CAFF00', alternativa: 'ibuprofeno' },
  { nombre: 'aspirina',          nivel: 'L3', descripcion: 'Asociado a síndrome de Reye en lactantes con dosis altas.',                                             recomendacion: 'Evitar para dolor/fiebre. Solo en dosis antiagregante (100 mg/día) si es imprescindible.',              color: '#CAFF00', alternativa: 'paracetamol o ibuprofeno' },
  { nombre: 'amoxicilina',       nivel: 'L1', descripcion: 'Pasa en pequeñas cantidades a la leche, sin efectos adversos relevantes.',                             recomendacion: 'Compatible. Puede causar diarrea leve o candidiasis oral en el lactante.',                              color: '#34D399', alternativa: null },
  { nombre: 'azitromicina',      nivel: 'L2', descripcion: 'Paso bajo a la leche. Vigilar posible diarrea en el lactante.',                                        recomendacion: 'Compatible. Segunda línea si amoxicilina no es adecuada.',                                              color: '#34D399', alternativa: null },
  { nombre: 'claritromicina',    nivel: 'L2', descripcion: 'Datos limitados pero generalmente aceptado.',                                                          recomendacion: 'Compatible con precaución. Vigilar tolerancia digestiva del lactante.',                                color: '#34D399', alternativa: null },
  { nombre: 'ciprofloxacina',    nivel: 'L3', descripcion: 'Puede afectar la flora intestinal del lactante. Uso puntual aceptable.',                               recomendacion: 'Evitar si hay alternativa. Uso puntual vigilando al lactante.',                                          color: '#CAFF00', alternativa: 'amoxicilina o cefalexina' },
  { nombre: 'metronidazol',      nivel: 'L2', descripcion: 'Compatible en ciclos cortos. Tras dosis única de 2 g, suspender lactancia 24 h.',                     recomendacion: 'Compatible en tratamientos cortos.',                                                                    color: '#34D399', alternativa: null },
  { nombre: 'omeprazol',         nivel: 'L1', descripcion: 'Paso insignificante a la leche materna. Amplia experiencia de uso.',                                   recomendacion: 'Compatible. Primera línea para reflujo/gastritis.',                                                     color: '#34D399', alternativa: null },
  { nombre: 'loratadina',        nivel: 'L1', descripcion: 'Antihistamínico no sedante con mínimo paso a la leche.',                                              recomendacion: 'Antihistamínico de elección en lactancia.',                                                              color: '#34D399', alternativa: null },
  { nombre: 'cetirizina',        nivel: 'L2', descripcion: 'Puede causar somnolencia leve en el lactante.',                                                        recomendacion: 'Compatible. Preferir loratadina si es posible.',                                                         color: '#34D399', alternativa: 'loratadina' },
  { nombre: 'sertralina',        nivel: 'L2', descripcion: 'ISRS de elección en lactancia. Niveles plasmáticos bajos en el lactante.',                             recomendacion: 'Compatible. Primera línea para depresión/ansiedad posparto.',                                           color: '#34D399', alternativa: null },
  { nombre: 'fluoxetina',        nivel: 'L2', descripcion: 'Acumulación de metabolito activo (norfluoxetina) en el lactante.',                                      recomendacion: 'Precaución. Preferir sertralina. Vigilar irritabilidad y alteraciones del sueño en el lactante.',      color: '#CAFF00', alternativa: 'sertralina' },
  { nombre: 'alprazolam',        nivel: 'L3', descripcion: 'Benzodiacepina de vida media corta. Puede causar sedación en el lactante.',                            recomendacion: 'Evitar uso prolongado. Dosis puntuales mínimas.',                                                       color: '#CAFF00', alternativa: 'sertralina' },
  { nombre: 'clonazepam',        nivel: 'L3', descripcion: 'Puede acumularse en el lactante causando sedación.',                                                    recomendacion: 'Solo si es imprescindible. Dosis mínima eficaz.',                                                       color: '#CAFF00', alternativa: null },
  { nombre: 'diazepam',          nivel: 'L4', descripcion: 'Vida media larga. Acumulación significativa. Riesgo de sedación, hipotermia y apnea en el lactante.', recomendacion: 'Contraindicado en lactancia mantenida. Solo uso puntual de urgencia.',                                 color: '#FB923C', alternativa: 'lorazepam en dosis puntual' },
  { nombre: 'levotiroxina',      nivel: 'L1', descripcion: 'Hormona tiroidea fisiológica. Paso mínimo a la leche. Necesaria para el hipotiroidismo.',              recomendacion: 'Compatible. No suspender. El hipotiroidismo no tratado afecta más a la lactancia.',                    color: '#34D399', alternativa: null },
  { nombre: 'metformina',        nivel: 'L1', descripcion: 'Paso muy bajo a la leche. Ampliamente usada en diabetes durante la lactancia.',                        recomendacion: 'Compatible. No suspender si es necesaria para el control glucémico.',                                  color: '#34D399', alternativa: null },
  { nombre: 'insulina',          nivel: 'L1', descripcion: 'No pasa a la leche materna. Se destruye en el tracto digestivo si hubiera algún paso.',                recomendacion: 'Completamente compatible. Continuar sin restricciones.',                                                 color: '#34D399', alternativa: null },
  { nombre: 'prednisona',        nivel: 'L2', descripcion: 'Compatible a dosis bajas (< 20 mg/día). A dosis altas esperar 4 h tras la toma.',                     recomendacion: 'Compatible a dosis habituales. A dosis altas (> 40 mg/día), esperar 4 h antes de lactar.',           color: '#34D399', alternativa: null },
  { nombre: 'enalapril',         nivel: 'L2', descripcion: 'IECA con paso mínimo a la leche. Datos de seguridad favorables.',                                      recomendacion: 'Compatible. Antihipertensivo de elección en lactancia.',                                                color: '#34D399', alternativa: null },
  { nombre: 'warfarina',         nivel: 'L2', descripcion: 'Paso muy bajo a la leche. No anticoagula al lactante a dosis terapéuticas maternas.',                  recomendacion: 'Compatible. Monitorizar signos de sangrado en el lactante.',                                            color: '#34D399', alternativa: null },
  { nombre: 'codeina',           nivel: 'L4', descripcion: 'Metabolizadores ultrarrápidos CYP2D6 pueden causar sobredosis y muerte en el lactante.',               recomendacion: 'CONTRAINDICADO en lactancia. Usar paracetamol e ibuprofeno.',                                            color: '#F87171', alternativa: 'paracetamol + ibuprofeno' },
  { nombre: 'tramadol',          nivel: 'L3', descripcion: 'Opioide con paso significativo a la leche. Puede causar sedación y depresión respiratoria.',           recomendacion: 'Evitar si es posible. Uso muy puntual a dosis mínimas.',                                                color: '#FB923C', alternativa: 'paracetamol + ibuprofeno' },
  { nombre: 'doxiciclina',       nivel: 'L4', descripcion: 'Puede causar coloración dental y alteración del crecimiento óseo en el lactante con uso prolongado.', recomendacion: 'Contraindicado en tratamientos > 3 semanas. Valorar riesgo/beneficio en tratamientos cortos.',        color: '#F87171', alternativa: 'amoxicilina o azitromicina' },
  { nombre: 'metotrexato',       nivel: 'L5', descripcion: 'Antimetabolito citotóxico. Puede causar supresión medular grave en el lactante.',                      recomendacion: 'CONTRAINDICADO. Suspender la lactancia.',                                                               color: '#F87171', alternativa: null },
  { nombre: 'atorvastatina',     nivel: 'L5', descripcion: 'Sin datos de seguridad en lactancia. Potencial efecto en el desarrollo del lactante.',                 recomendacion: 'CONTRAINDICADO. Suspender lactancia o el tratamiento.',                                                 color: '#F87171', alternativa: null },
  { nombre: 'simvastatina',      nivel: 'L5', descripcion: 'Las estatinas interfieren con la síntesis de colesterol, esencial para el desarrollo del lactante.',  recomendacion: 'CONTRAINDICADO. No usar durante la lactancia.',                                                          color: '#F87171', alternativa: null },
  { nombre: 'cotrimoxazol',      nivel: 'L3', descripcion: 'Evitar en prematuros y neonatos con ictericia o déficit de G6PD.',                                     recomendacion: 'Precaución. Evitar las primeras 4 semanas de vida del lactante.',                                       color: '#CAFF00', alternativa: 'amoxicilina' },
  { nombre: 'propranolol',       nivel: 'L2', descripcion: 'Beta-bloqueante con paso mínimo a la leche.',                                                          recomendacion: 'Compatible. Vigilar signos de bradicardia, hipoglucemia y somnolencia en el lactante.',               color: '#34D399', alternativa: null },
  { nombre: 'metoprolol',        nivel: 'L3', descripcion: 'Paso mayor que propranolol. Monitorizar bradicardia en el lactante.',                                  recomendacion: 'Precaución. Preferir propranolol. Vigilar frecuencia cardíaca del lactante.',                          color: '#CAFF00', alternativa: 'propranolol' },
];

export interface CompatibilidadLactanciaResult {
  encontrado:    boolean;
  medicamento:   string;
  nivel:         NivelLactancia | null;
  descripcion:   string;
  recomendacion: string;
  color:         string;
  alternativa:   string | null;
  nivelTexto:    string;
}

export function verificarCompatibilidadLactancia(
  medicamento: string,
): CompatibilidadLactanciaResult {
  const normalizar = (s: string) =>
    s.toLowerCase().trim().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const busqueda = normalizar(medicamento);

  const encontrado = DB_LACTANCIA.find(m => {
    const n = normalizar(m.nombre);
    return n === busqueda || busqueda.includes(n) || n.includes(busqueda);
  });

  const nivelTextos: Record<NivelLactancia, string> = {
    L1: 'Compatible — Máxima seguridad',
    L2: 'Compatible con precaución',
    L3: 'Precaución moderada',
    L4: 'Riesgo potencial — Evitar',
    L5: 'CONTRAINDICADO',
  };

  if (!encontrado) {
    return {
      encontrado: false,
      medicamento,
      nivel: null,
      descripcion: 'Medicamento no encontrado en nuestra base de datos. No significa que sea inseguro. Consulta con tu médico, farmacéutico o la base de datos LactMed (NIH) para información actualizada.',
      recomendacion: 'Consulta siempre con tu médico o farmacéutico antes de tomar cualquier medicamento durante la lactancia.',
      color: '#9CA3AF',
      alternativa: null,
      nivelTexto: 'Sin datos — Consulta a tu médico',
    };
  }

  return {
    encontrado: true,
    medicamento: encontrado.nombre,
    nivel: encontrado.nivel,
    descripcion: encontrado.descripcion,
    recomendacion: encontrado.recomendacion,
    color: encontrado.color,
    alternativa: encontrado.alternativa,
    nivelTexto: nivelTextos[encontrado.nivel],
  };
}

// ─── FIBRA DIARIA RECOMENDADA ────────────────────────────────────────────────
export type ObjetivoFibra = 'digestivo' | 'cardiovascular' | 'peso';

export function calcularFibraDiaria(edadAnios: number, sexo: 'hombre' | 'mujer', objetivo: ObjetivoFibra): {
  gramosDiarios: number; gramosSolubles: number; gramosInsolubles: number;
  fuentesSolubles: { alimento: string; gramosPorRacion: string }[];
  fuentesInsolubles: { alimento: string; gramosPorRacion: string }[];
  beneficio: string; recomendacion: string;
} {
  let base = sexo === 'hombre' ? 38 : 25;
  if (edadAnios > 50) base = sexo === 'hombre' ? 30 : 21;
  const extra = objetivo === 'cardiovascular' ? 5 : objetivo === 'peso' ? 5 : 0;
  const gramosDiarios    = base + extra;
  const gramosSolubles   = Math.round(gramosDiarios * 0.35);
  const gramosInsolubles = gramosDiarios - gramosSolubles;
  const fuentesSolubles = [
    { alimento: 'Avena (80 g)',         gramosPorRacion: '4 g' },
    { alimento: 'Manzana con piel',     gramosPorRacion: '3 g' },
    { alimento: 'Legumbres cocidas (200 g)', gramosPorRacion: '6 g' },
    { alimento: 'Zanahoria (100 g)',    gramosPorRacion: '2 g' },
  ];
  const fuentesInsolubles = [
    { alimento: 'Salvado de trigo (15 g)', gramosPorRacion: '4 g' },
    { alimento: 'Pan integral (2 rebanadas)', gramosPorRacion: '4 g' },
    { alimento: 'Brócoli cocido (150 g)',  gramosPorRacion: '4 g' },
    { alimento: 'Almendras (30 g)',        gramosPorRacion: '2 g' },
  ];
  const beneficioMap: Record<ObjetivoFibra, string> = {
    digestivo:      'Regula el tránsito intestinal, previene el estreñimiento y reduce el riesgo de cáncer de colon.',
    cardiovascular: 'La fibra soluble reduce el colesterol LDL hasta un 5–10% y mejora el control glucémico.',
    peso:           'La fibra aumenta la saciedad y ralentiza la absorción de nutrientes, favoreciendo el control del apetito.',
  };
  const recomendacion = `Distribuye tu ingesta de fibra a lo largo del día y aumenta gradualmente para evitar molestias digestivas. Acompaña siempre con al menos 1.5–2 L de agua diarios.`;
  return { gramosDiarios, gramosSolubles, gramosInsolubles, fuentesSolubles, fuentesInsolubles, beneficio: beneficioMap[objetivo], recomendacion };
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

// ── Contador de contracciones de parto (regla 5-1-1) ──
export function evaluarContracciones(contracciones: { start: number; durationSec: number }[]): {
  total: number; frecuenciaMin: number; duracionSeg: number;
  fase: 'sin-datos' | 'temprana' | 'activa' | 'hospital'; mensaje: string;
} {
  if (contracciones.length < 2) {
    return { total: contracciones.length, frecuenciaMin: 0, duracionSeg: 0, fase: 'sin-datos',
      mensaje: 'Registra al menos 2 contracciones para calcular la frecuencia.' };
  }
  const recientes = contracciones.slice(-6);
  const intervalos: number[] = [];
  for (let i = 1; i < recientes.length; i++) {
    intervalos.push((recientes[i].start - recientes[i - 1].start) / 60000);
  }
  const frecuenciaMin = Math.round((intervalos.reduce((a, b) => a + b, 0) / intervalos.length) * 10) / 10;
  const duracionSeg = Math.round(recientes.reduce((a, c) => a + c.durationSec, 0) / recientes.length);
  let fase: 'temprana' | 'activa' | 'hospital';
  let mensaje: string;
  if (frecuenciaMin <= 5 && duracionSeg >= 45) {
    fase = 'hospital';
    mensaje = 'Patrón 5-1-1: contracciones cada 5 minutos o menos que duran cerca de 1 minuto. Contacta a tu médico o acude al hospital.';
  } else if (frecuenciaMin <= 10) {
    fase = 'activa';
    mensaje = 'Trabajo de parto activo en progreso. Prepárate y mantén el registro del tiempo.';
  } else {
    fase = 'temprana';
    mensaje = 'Fase temprana. Descansa, hidrátate y sigue registrando las contracciones.';
  }
  return { total: contracciones.length, frecuenciaMin, duracionSeg, fase, mensaje };
}

// ── Sumar o restar días/meses/años a una fecha ──
export function calcularFechaDesplazada(fechaBase: string, dias: number, meses: number, anios: number, operacion: 'sumar' | 'restar'): {
  fechaResultante: string; diaSemana: string; fechaLarga: string; diferenciaDias: number;
} {
  const [y, m, d] = fechaBase.split('-').map(Number);
  const base = new Date(y, m - 1, d, 12, 0, 0);
  const signo = operacion === 'restar' ? -1 : 1;
  const r = new Date(base);
  r.setFullYear(r.getFullYear() + signo * anios);
  r.setMonth(r.getMonth() + signo * meses);
  r.setDate(r.getDate() + signo * dias);
  const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const mesesNombre = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const mm = String(r.getMonth() + 1).padStart(2, '0');
  const dd = String(r.getDate()).padStart(2, '0');
  const diferenciaDias = Math.round((r.getTime() - base.getTime()) / 86400000);
  return {
    fechaResultante: `${r.getFullYear()}-${mm}-${dd}`,
    diaSemana: diasSemana[r.getDay()],
    fechaLarga: `${r.getDate()} de ${mesesNombre[r.getMonth()]} de ${r.getFullYear()}`,
    diferenciaDias,
  };
}

// ── Azúcar diario recomendado (OMS: azúcares libres < 10% e ideal < 5% de la energía) ──
export function calcularAzucarDiario(caloriasDiarias: number): {
  limiteMaxG: number; idealG: number; limiteMaxCucharaditas: number; idealCucharaditas: number;
  ejemplos: { alimento: string; azucarG: number; porcentajeDelLimite: number }[];
} {
  const limiteMaxG = Math.round((caloriasDiarias * 0.10) / 4);
  const idealG = Math.round((caloriasDiarias * 0.05) / 4);
  const limiteMaxCucharaditas = Math.round((limiteMaxG / 4) * 10) / 10;
  const idealCucharaditas = Math.round((idealG / 4) * 10) / 10;
  const ejemplos = [
    { alimento: 'Lata de refresco (330 ml)', azucarG: 35 },
    { alimento: 'Barra de chocolate con leche', azucarG: 24 },
    { alimento: 'Vaso de jugo de naranja (250 ml)', azucarG: 21 },
    { alimento: 'Yogur de sabores (125 g)', azucarG: 13 },
    { alimento: 'Galletas dulces (2 unidades)', azucarG: 8 },
  ].map(e => ({ ...e, porcentajeDelLimite: Math.round((e.azucarG / limiteMaxG) * 100) }));
  return { limiteMaxG, idealG, limiteMaxCucharaditas, idealCucharaditas, ejemplos };
}

// ════════════════════════════════════════════════════════════════
//  FITNESS — nuevas calculadoras
// ════════════════════════════════════════════════════════════════

// ── Pasos a calorías y distancia ──
export function calcularPasosCalorias(pasos: number, pesoKg: number, alturaCm = 170): {
  calorias: number; distanciaKm: number; minutos: number; porcentajeObjetivo: number;
} {
  const zancadaM = alturaCm * 0.00415; // ~0.415 × altura (m)
  const distanciaKm = Math.round((pasos * zancadaM / 1000) * 100) / 100;
  const calorias = Math.round(pasos * 0.04 * (pesoKg / 70));
  const minutos = Math.round(pasos / 100); // cadencia media ~100 pasos/min
  const porcentajeObjetivo = Math.round((pasos / 10000) * 100);
  return { calorias, distanciaKm, minutos, porcentajeObjetivo };
}

// ── Calorías saltando la cuerda ──
export function calcularCaloriasSaltarCuerda(pesoKg: number, minutos: number, intensidad: 'lento' | 'moderado' | 'rapido'): {
  calorias: number; met: number;
} {
  const met = intensidad === 'lento' ? 8.8 : intensidad === 'rapido' ? 12.3 : 11.8;
  const calorias = Math.round((met * 3.5 * pesoKg / 200) * minutos);
  return { calorias, met };
}

// ── Calorías bailando / zumba ──
export function calcularCaloriasBailando(pesoKg: number, minutos: number, estilo: 'social' | 'zumba' | 'intenso'): {
  calorias: number; met: number;
} {
  const met = estilo === 'social' ? 5.0 : estilo === 'intenso' ? 8.5 : 7.3;
  const calorias = Math.round((met * 3.5 * pesoKg / 200) * minutos);
  return { calorias, met };
}

// ── Calorías en elíptica ──
export function calcularCaloriasEliptica(pesoKg: number, minutos: number, intensidad: 'suave' | 'moderada' | 'intensa'): {
  calorias: number; met: number;
} {
  const met = intensidad === 'suave' ? 5.0 : intensidad === 'intensa' ? 8.0 : 6.8;
  const calorias = Math.round((met * 3.5 * pesoKg / 200) * minutos);
  return { calorias, met };
}

// ── Calorías levantando pesas ──
export function calcularCaloriasPesas(pesoKg: number, minutos: number, intensidad: 'general' | 'vigoroso' | 'circuito'): {
  calorias: number; met: number;
} {
  const met = intensidad === 'general' ? 3.5 : intensidad === 'circuito' ? 8.0 : 6.0;
  const calorias = Math.round((met * 3.5 * pesoKg / 200) * minutos);
  return { calorias, met };
}

// ── Calorías jugando fútbol ──
export function calcularCaloriasFutbol(pesoKg: number, minutos: number, intensidad: 'recreativo' | 'competitivo'): {
  calorias: number; met: number;
} {
  const met = intensidad === 'competitivo' ? 10.0 : 7.0;
  const calorias = Math.round((met * 3.5 * pesoKg / 200) * minutos);
  return { calorias, met };
}

// ── Masa corporal magra (fórmula de Boer) ──
export function calcularMasaMagra(pesoKg: number, alturaCm: number, sexo: 'hombre' | 'mujer'): {
  masaMagraKg: number; masaGrasaKg: number; porcentajeMagra: number; porcentajeGraso: number;
} {
  const lbm = sexo === 'hombre'
    ? 0.407 * pesoKg + 0.267 * alturaCm - 19.2
    : 0.252 * pesoKg + 0.473 * alturaCm - 48.3;
  const masaMagraKg = Math.round(lbm * 10) / 10;
  const masaGrasaKg = Math.round((pesoKg - lbm) * 10) / 10;
  const porcentajeMagra = Math.round((lbm / pesoKg) * 1000) / 10;
  const porcentajeGraso = Math.round(((pesoKg - lbm) / pesoKg) * 1000) / 10;
  return { masaMagraKg, masaGrasaKg, porcentajeMagra, porcentajeGraso };
}

// ── Superficie corporal (BSA) ──
export function calcularSuperficieCorporal(pesoKg: number, alturaCm: number): {
  mosteller: number; duBois: number; promedio: number;
} {
  const mosteller = Math.sqrt((alturaCm * pesoKg) / 3600);
  const duBois = 0.007184 * Math.pow(alturaCm, 0.725) * Math.pow(pesoKg, 0.425);
  const r = (n: number) => Math.round(n * 100) / 100;
  return { mosteller: r(mosteller), duBois: r(duBois), promedio: r((mosteller + duBois) / 2) };
}

// ── Porcentaje de peso perdido ──
export function calcularPorcentajePesoPerdido(pesoInicial: number, pesoActual: number): {
  diferenciaKg: number; porcentaje: number; gano: boolean; mensaje: string;
} {
  const diferenciaKg = Math.round((pesoInicial - pesoActual) * 10) / 10;
  const porcentaje = Math.round((diferenciaKg / pesoInicial) * 1000) / 10;
  const gano = diferenciaKg < 0;
  let mensaje: string;
  if (Math.abs(porcentaje) < 0.5) mensaje = 'Tu peso se mantiene prácticamente igual.';
  else if (gano) mensaje = `Has ganado ${Math.abs(porcentaje)}% de tu peso inicial (${Math.abs(diferenciaKg)} kg).`;
  else if (porcentaje >= 5) mensaje = `Has perdido un ${porcentaje}% de tu peso, una pérdida clínicamente significativa.`;
  else mensaje = `Has perdido un ${porcentaje}% de tu peso inicial (${diferenciaKg} kg).`;
  return { diferenciaKg, porcentaje, gano, mensaje };
}

// ── Frecuencia respiratoria normal ──
export function evaluarFrecuenciaRespiratoria(rpm: number, edadAnios: number): {
  categoria: 'bradipnea' | 'normal' | 'taquipnea'; rangoNormal: string; min: number; max: number; mensaje: string;
} {
  let min: number, max: number;
  if (edadAnios < 1) { min = 30; max = 60; }
  else if (edadAnios < 3) { min = 24; max = 40; }
  else if (edadAnios < 6) { min = 22; max = 34; }
  else if (edadAnios < 12) { min = 18; max = 30; }
  else if (edadAnios < 18) { min = 12; max = 20; }
  else { min = 12; max = 20; }
  let categoria: 'bradipnea' | 'normal' | 'taquipnea';
  let mensaje: string;
  if (rpm < min) { categoria = 'bradipnea'; mensaje = 'Frecuencia por debajo de lo esperado (bradipnea). Si se acompaña de síntomas, consulta a un profesional.'; }
  else if (rpm > max) { categoria = 'taquipnea'; mensaje = 'Frecuencia por encima de lo esperado (taquipnea). Puede deberse a esfuerzo, fiebre o ansiedad; valora el contexto.'; }
  else { categoria = 'normal'; mensaje = 'Frecuencia respiratoria dentro del rango normal para la edad.'; }
  return { categoria, rangoNormal: `${min}–${max} rpm`, min, max, mensaje };
}

// ════════════════════════════════════════════════════════════════
//  NUTRICIÓN — nuevas calculadoras
// ════════════════════════════════════════════════════════════════

// ── Superávit calórico para ganar masa muscular ──
export function calcularSuperavitCalorico(tdee: number): {
  escenarios: { nombre: string; calorias: number; superavit: number; gananciaSemanalKg: number; gananciaMensualKg: number }[];
} {
  const niveles = [
    { nombre: 'Lento (lean bulk)', superavit: 200 },
    { nombre: 'Moderado', superavit: 350 },
    { nombre: 'Rápido', superavit: 500 },
  ];
  const escenarios = niveles.map(n => {
    const gananciaSemanalKg = Math.round((n.superavit * 7 / 7700) * 100) / 100;
    return {
      nombre: n.nombre,
      calorias: Math.round(tdee + n.superavit),
      superavit: n.superavit,
      gananciaSemanalKg,
      gananciaMensualKg: Math.round(gananciaSemanalKg * 4.345 * 100) / 100,
    };
  });
  return { escenarios };
}

// ── Macros de dieta keto / cetogénica ──
export function calcularKetoMacros(tdee: number, objetivo: 'perder' | 'mantener' | 'ganar'): {
  calorias: number; grasaG: number; proteinaG: number; carbosG: number;
  grasaPct: number; proteinaPct: number; carbosPct: number;
} {
  const factor = objetivo === 'perder' ? 0.80 : objetivo === 'ganar' ? 1.10 : 1.0;
  const calorias = Math.round(tdee * factor);
  const grasaPct = 70, proteinaPct = 25, carbosPct = 5;
  return {
    calorias,
    grasaG: Math.round((calorias * grasaPct / 100) / 9),
    proteinaG: Math.round((calorias * proteinaPct / 100) / 4),
    carbosG: Math.round((calorias * carbosPct / 100) / 4),
    grasaPct, proteinaPct, carbosPct,
  };
}

// ── Sal y sodio recomendado (OMS < 5 g de sal / < 2 g de sodio) ──
export function calcularSalDiaria(salConsumidaG: number): {
  limiteSalG: number; limiteSodioMg: number; sodioConsumidoMg: number; porcentaje: number; mensaje: string;
} {
  const limiteSalG = 5;
  const limiteSodioMg = 2000;
  const sodioConsumidoMg = Math.round(salConsumidaG * 400); // 1 g sal ≈ 400 mg sodio
  const porcentaje = Math.round((salConsumidaG / limiteSalG) * 100);
  let mensaje: string;
  if (porcentaje <= 100) mensaje = `Estás dentro del límite de la OMS (5 g de sal/día). Te queda margen de ${Math.max(0, 5 - salConsumidaG).toFixed(1)} g.`;
  else mensaje = `Superas el límite de la OMS en un ${porcentaje - 100}%. Reducir la sal baja la presión arterial y el riesgo cardiovascular.`;
  return { limiteSalG, limiteSodioMg, sodioConsumidoMg, porcentaje, mensaje };
}

// helper interno para tablas de micronutrientes por edad/sexo
function rdaPorTramo(
  edad: number, sexo: 'hombre' | 'mujer', etapa: 'ninguna' | 'embarazo' | 'lactancia',
  tabla: { hasta: number; h: number; m: number }[], emb: number, lac: number,
): number {
  if (etapa === 'embarazo') return emb;
  if (etapa === 'lactancia') return lac;
  const tramo = tabla.find(t => edad <= t.hasta) ?? tabla[tabla.length - 1];
  return sexo === 'hombre' ? tramo.h : tramo.m;
}

// ── Calcio diario recomendado (mg) ──
export function calcularCalcioDiario(edad: number, sexo: 'hombre' | 'mujer', etapa: 'ninguna' | 'embarazo' | 'lactancia'): {
  rdaMg: number; ulMg: number; mensaje: string;
} {
  const rdaMg = rdaPorTramo(edad, sexo, etapa, [
    { hasta: 3, h: 700, m: 700 }, { hasta: 8, h: 1000, m: 1000 }, { hasta: 18, h: 1300, m: 1300 },
    { hasta: 50, h: 1000, m: 1000 }, { hasta: 70, h: 1000, m: 1200 }, { hasta: 130, h: 1200, m: 1200 },
  ], 1000, 1000);
  return { rdaMg, ulMg: 2500, mensaje: 'El calcio es clave para huesos y dientes. Lácteos, sardinas, tofu y verduras de hoja verde son buenas fuentes.' };
}

// ── Hierro diario recomendado (mg) ──
export function calcularHierroDiario(edad: number, sexo: 'hombre' | 'mujer', etapa: 'ninguna' | 'embarazo' | 'lactancia'): {
  rdaMg: number; ulMg: number; mensaje: string;
} {
  const rdaMg = rdaPorTramo(edad, sexo, etapa, [
    { hasta: 3, h: 7, m: 7 }, { hasta: 8, h: 10, m: 10 }, { hasta: 13, h: 8, m: 8 },
    { hasta: 18, h: 11, m: 15 }, { hasta: 50, h: 8, m: 18 }, { hasta: 130, h: 8, m: 8 },
  ], 27, 9);
  return { rdaMg, ulMg: 45, mensaje: 'El hierro previene la anemia. La carne roja aporta hierro hemo (mejor absorbido); las legumbres, hierro no hemo (mejóralo con vitamina C).' };
}

// ── Magnesio diario recomendado (mg) ──
export function calcularMagnesioDiario(edad: number, sexo: 'hombre' | 'mujer', etapa: 'ninguna' | 'embarazo' | 'lactancia'): {
  rdaMg: number; mensaje: string;
} {
  const rdaMg = rdaPorTramo(edad, sexo, etapa, [
    { hasta: 3, h: 80, m: 80 }, { hasta: 8, h: 130, m: 130 }, { hasta: 13, h: 240, m: 240 },
    { hasta: 18, h: 410, m: 360 }, { hasta: 30, h: 400, m: 310 }, { hasta: 130, h: 420, m: 320 },
  ], 360, 320);
  return { rdaMg, mensaje: 'El magnesio participa en más de 300 reacciones enzimáticas. Frutos secos, semillas, legumbres y cereales integrales son ricos en magnesio.' };
}

// ── Zinc diario recomendado (mg) ──
export function calcularZincDiario(edad: number, sexo: 'hombre' | 'mujer', etapa: 'ninguna' | 'embarazo' | 'lactancia'): {
  rdaMg: number; ulMg: number; mensaje: string;
} {
  const rdaMg = rdaPorTramo(edad, sexo, etapa, [
    { hasta: 3, h: 3, m: 3 }, { hasta: 8, h: 5, m: 5 }, { hasta: 13, h: 8, m: 8 },
    { hasta: 18, h: 11, m: 9 }, { hasta: 130, h: 11, m: 8 },
  ], 11, 12);
  return { rdaMg, ulMg: 40, mensaje: 'El zinc es esencial para el sistema inmune y la cicatrización. Carnes, mariscos, semillas de calabaza y legumbres lo aportan.' };
}

// ── Vitamina C diaria recomendada (mg) ──
export function calcularVitaminaCDiaria(edad: number, sexo: 'hombre' | 'mujer', etapa: 'ninguna' | 'embarazo' | 'lactancia', fumador: boolean): {
  rdaMg: number; ulMg: number; mensaje: string;
} {
  let rdaMg = rdaPorTramo(edad, sexo, etapa, [
    { hasta: 3, h: 15, m: 15 }, { hasta: 8, h: 25, m: 25 }, { hasta: 13, h: 45, m: 45 },
    { hasta: 18, h: 75, m: 65 }, { hasta: 130, h: 90, m: 75 },
  ], 85, 120);
  if (fumador) rdaMg += 35;
  return { rdaMg, ulMg: 2000, mensaje: 'La vitamina C es antioxidante y favorece la absorción del hierro. Cítricos, kiwi, pimiento y fresas son excelentes fuentes.' };
}

// ── Potasio diario recomendado (mg, ingesta adecuada) ──
export function calcularPotasioDiario(edad: number, sexo: 'hombre' | 'mujer', etapa: 'ninguna' | 'embarazo' | 'lactancia'): {
  rdaMg: number; mensaje: string;
} {
  const rdaMg = rdaPorTramo(edad, sexo, etapa, [
    { hasta: 3, h: 2000, m: 2000 }, { hasta: 8, h: 2300, m: 2300 }, { hasta: 13, h: 2500, m: 2300 },
    { hasta: 18, h: 3000, m: 2300 }, { hasta: 130, h: 3400, m: 2600 },
  ], 2900, 2800);
  return { rdaMg, mensaje: 'El potasio ayuda a controlar la presión arterial y el equilibrio de líquidos. Plátano, papa, legumbres, aguacate y espinaca destacan.' };
}

// ── Gramos de grasa al día (20–35 % de la energía) ──
export function calcularGrasaDiaria(caloriasDiarias: number): {
  minG: number; maxG: number; recomendadoG: number; saturadasMaxG: number;
} {
  return {
    minG: Math.round((caloriasDiarias * 0.20) / 9),
    maxG: Math.round((caloriasDiarias * 0.35) / 9),
    recomendadoG: Math.round((caloriasDiarias * 0.30) / 9),
    saturadasMaxG: Math.round((caloriasDiarias * 0.10) / 9),
  };
}

// ════════════════════════════════════════════════════════════════
//  EMBARAZO & FERTILIDAD — nuevas calculadoras
// ════════════════════════════════════════════════════════════════

// ── Calendario chino del bebé (predicción de sexo, sin base científica) ──
const CHINO_CHART: Record<number, string> = {
  18: 'NVNVVVVVVVVV', 19: 'VNVNNNNNNVVV', 20: 'NVNNNNNNNVVN', 21: 'NVNNNNNNNNNN',
  22: 'VNNVNVVNVVVV', 23: 'NNVNNVNVNNNV', 24: 'NVNNVNNVVVVV', 25: 'VNNVNNVNNNVN',
  26: 'NVNVNNNVNVVV', 27: 'VNVNVNNNVNVV', 28: 'NVNVVNNNVVVV', 29: 'VNVVNNNVVVNN',
  30: 'NVVVVVVVVVNN', 31: 'NVNVVVVVVVVN', 32: 'NVNVVVVVVVVN', 33: 'VNVNVVNVVVVN',
  34: 'NVNVVVVVVVNN', 35: 'NNVNVVNVVVNN', 36: 'NNNVNVNNVVVV', 37: 'VNNNVNVNVNVN',
  38: 'NVNNNVNVNVNV', 39: 'VNNNNNVNVVVV', 40: 'NVNVNVNVNVNN', 41: 'VNVNVNVNNNNV',
  42: 'NVNVNVNVNNVN', 43: 'VNNNVNVNVNNN', 44: 'NNVNNNVVNVNV', 45: 'VNNVNNVNVNVN',
};
export function calcularCalendarioChino(edadMadre: number, mesConcepcion: number): {
  prediccion: 'niño' | 'niña'; edadLunar: number; mesConcepcion: number; valido: boolean;
} {
  const edadLunar = Math.min(45, Math.max(18, edadMadre + 1));
  const fila = CHINO_CHART[edadLunar];
  const valido = !!fila && mesConcepcion >= 1 && mesConcepcion <= 12;
  const letra = valido ? fila[mesConcepcion - 1] : 'N';
  return { prediccion: letra === 'V' ? 'niño' : 'niña', edadLunar, mesConcepcion, valido };
}

// ── Semanas de embarazo a meses ──
export function convertirSemanasEmbarazoAMeses(semanas: number): {
  mesNumero: number; texto: string; trimestre: 1 | 2 | 3; semanas: number;
} {
  const tabla = [
    { mes: 1, hasta: 4 }, { mes: 2, hasta: 8 }, { mes: 3, hasta: 13 }, { mes: 4, hasta: 17 },
    { mes: 5, hasta: 22 }, { mes: 6, hasta: 27 }, { mes: 7, hasta: 31 }, { mes: 8, hasta: 35 }, { mes: 9, hasta: 42 },
  ];
  const fila = tabla.find(t => semanas <= t.hasta) ?? tabla[tabla.length - 1];
  const trimestre: 1 | 2 | 3 = semanas <= 13 ? 1 : semanas <= 27 ? 2 : 3;
  return { mesNumero: fila.mes, texto: `${fila.mes}.º mes`, trimestre, semanas };
}

// ── Cuenta atrás para el parto ──
export function calcularCuentaAtrasParto(fechaParto: string): {
  diasRestantes: number; semanasTexto: string; semanasEmbarazo: number; porcentaje: number; mensaje: string;
} {
  const [y, m, d] = fechaParto.split('-').map(Number);
  const fpp = new Date(y, m - 1, d, 12, 0, 0);
  const hoy = new Date(); hoy.setHours(12, 0, 0, 0);
  const diasRestantes = Math.round((fpp.getTime() - hoy.getTime()) / 86400000);
  const semRest = Math.floor(Math.abs(diasRestantes) / 7);
  const diasRest = Math.abs(diasRestantes) % 7;
  const totalDias = 280;
  const transcurridos = totalDias - diasRestantes;
  const semanasEmbarazo = Math.max(0, Math.min(42, Math.floor(transcurridos / 7)));
  const porcentaje = Math.max(0, Math.min(100, Math.round((transcurridos / totalDias) * 100)));
  let mensaje: string;
  if (diasRestantes < 0) mensaje = 'La fecha probable de parto ya pasó. Tu bebé puede nacer cualquier día; consulta con tu médico.';
  else if (diasRestantes === 0) mensaje = '¡Hoy es la fecha probable de parto!';
  else mensaje = `Estás de aproximadamente ${semanasEmbarazo} semanas. Faltan ${semRest} semanas y ${diasRest} días.`;
  return { diasRestantes, semanasTexto: `${semRest} sem ${diasRest} d`, semanasEmbarazo, porcentaje, mensaje };
}

// ── Días post ovulación (DPO) ──
export function calcularDPO(fechaOvulacion: string): {
  dpo: number; fase: string; testFiable: string; mensaje: string;
} {
  const [y, m, d] = fechaOvulacion.split('-').map(Number);
  const ovu = new Date(y, m - 1, d, 12, 0, 0);
  const hoy = new Date(); hoy.setHours(12, 0, 0, 0);
  const dpo = Math.round((hoy.getTime() - ovu.getTime()) / 86400000);
  const fechaTest = new Date(ovu); fechaTest.setDate(fechaTest.getDate() + 14);
  const testFiable = `${String(fechaTest.getDate()).padStart(2, '0')}/${String(fechaTest.getMonth() + 1).padStart(2, '0')}/${fechaTest.getFullYear()}`;
  let fase: string, mensaje: string;
  if (dpo < 0) { fase = 'Antes de la ovulación'; mensaje = 'La fecha de ovulación aún no ha llegado.'; }
  else if (dpo <= 5) { fase = 'Fase lútea temprana'; mensaje = 'Es muy pronto para detectar el embarazo. El óvulo viaja hacia el útero.'; }
  else if (dpo <= 12) { fase = 'Ventana de implantación'; mensaje = 'La implantación suele ocurrir entre los días 6 y 12 DPO. Un test aún puede dar falso negativo.'; }
  else { fase = 'Fase de test fiable'; mensaje = 'A partir de 12-14 DPO un test de embarazo en orina ya es bastante fiable.'; }
  return { dpo, fase, testFiable, mensaje };
}

// ── Ácido fólico en el embarazo ──
export function calcularAcidoFolico(etapa: 'buscando' | 'embarazo' | 'lactancia', riesgo: 'normal' | 'alto'): {
  dosisMcg: number; cuandoEmpezar: string; mensaje: string;
} {
  let dosisMcg: number, cuandoEmpezar: string;
  if (riesgo === 'alto') {
    dosisMcg = 4000;
    cuandoEmpezar = 'Al menos 1 mes antes de concebir y durante el primer trimestre.';
  } else if (etapa === 'lactancia') {
    dosisMcg = 500;
    cuandoEmpezar = 'Durante toda la lactancia materna.';
  } else if (etapa === 'embarazo') {
    dosisMcg = 600;
    cuandoEmpezar = 'Desde la confirmación del embarazo hasta al menos la semana 12.';
  } else {
    dosisMcg = 400;
    cuandoEmpezar = 'Desde al menos 1 mes antes de buscar el embarazo.';
  }
  const mensaje = riesgo === 'alto'
    ? 'Dosis alta indicada en antecedentes de defectos del tubo neural, diabetes, epilepsia u obesidad. Siempre bajo supervisión médica.'
    : 'El ácido fólico reduce el riesgo de defectos del tubo neural como la espina bífida. Consulta tu dosis con tu médico.';
  return { dosisMcg, cuandoEmpezar, mensaje };
}

// ── Percentil estimado del bebé (peso o talla, OMS 0–24 meses) ──
const OMS_PESO_NINO = [3.3,4.5,5.6,6.4,7.0,7.5,7.9,8.3,8.6,8.9,9.2,9.4,9.6,9.9,10.1,10.3,10.5,10.7,10.9,11.1,11.3,11.5,11.8,12.0,12.2];
const OMS_PESO_NINA = [3.2,4.2,5.1,5.8,6.4,6.9,7.3,7.6,7.9,8.2,8.5,8.7,8.9,9.2,9.4,9.6,9.8,10.0,10.2,10.4,10.6,10.9,11.1,11.3,11.5];
const OMS_TALLA_NINO = [49.9,54.7,58.4,61.4,63.9,65.9,67.6,69.2,70.6,72.0,73.3,74.5,75.7,76.9,78.0,79.1,80.2,81.2,82.3,83.2,84.2,85.1,86.0,86.9,87.8];
const OMS_TALLA_NINA = [49.1,53.7,57.1,59.8,62.1,64.0,65.7,67.3,68.7,70.1,71.5,72.8,74.0,75.2,76.4,77.5,78.6,79.7,80.7,81.7,82.7,83.7,84.6,85.5,86.4];
function normalCDF(z: number): number {
  // Aproximación de Abramowitz & Stegun
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (z > 0) p = 1 - p;
  return p;
}
export function calcularPercentilBebe(sexo: 'nino' | 'nina', edadMeses: number, valor: number, tipo: 'peso' | 'talla'): {
  percentil: number; mediana: number; z: number; categoria: string;
} {
  const idx = Math.min(24, Math.max(0, Math.round(edadMeses)));
  const tabla = tipo === 'peso'
    ? (sexo === 'nino' ? OMS_PESO_NINO : OMS_PESO_NINA)
    : (sexo === 'nino' ? OMS_TALLA_NINO : OMS_TALLA_NINA);
  const mediana = tabla[idx];
  const sd = tipo === 'peso' ? mediana * 0.12 : mediana * 0.038;
  const z = (valor - mediana) / sd;
  let percentil = Math.round(normalCDF(z) * 100);
  percentil = Math.min(99, Math.max(1, percentil));
  let categoria: string;
  if (percentil < 3) categoria = 'Por debajo de lo esperado';
  else if (percentil < 15) categoria = 'En el rango bajo de la normalidad';
  else if (percentil <= 85) categoria = 'En el rango normal';
  else if (percentil <= 97) categoria = 'En el rango alto de la normalidad';
  else categoria = 'Por encima de lo esperado';
  return { percentil, mediana: Math.round(mediana * 10) / 10, z: Math.round(z * 100) / 100, categoria };
}

// ── Cantidad de leche que necesita el bebé ──
export function calcularLecheBebe(pesoKg: number, edadMeses: number, tomas: number): {
  totalDiaMl: number; porTomaMl: number; rangoMin: number; rangoMax: number; tomas: number;
} {
  // 150 ml/kg/día de referencia (rango 120–180), se estabiliza a partir de ~6 meses
  const mlPorKg = edadMeses >= 6 ? 120 : 150;
  let totalDiaMl = Math.round(pesoKg * mlPorKg);
  if (totalDiaMl > 1000) totalDiaMl = 1000; // límite práctico de fórmula
  const t = Math.max(1, tomas);
  return {
    totalDiaMl,
    porTomaMl: Math.round(totalDiaMl / t),
    rangoMin: Math.round((pesoKg * 120) / t),
    rangoMax: Math.round((pesoKg * 180) / t),
    tomas: t,
  };
}

// ── Edad corregida del bebé prematuro ──
export function calcularEdadCorregida(fechaNacimiento: string, semanasGestacion: number): {
  edadCronologicaSemanas: number; edadCorregidaSemanas: number; semanasPrematuro: number;
  cronologicaTexto: string; corregidaTexto: string; mensaje: string;
} {
  const [y, m, d] = fechaNacimiento.split('-').map(Number);
  const nac = new Date(y, m - 1, d, 12, 0, 0);
  const hoy = new Date(); hoy.setHours(12, 0, 0, 0);
  const edadCronologicaSemanas = Math.max(0, Math.round((hoy.getTime() - nac.getTime()) / (86400000 * 7)));
  const semanasPrematuro = Math.max(0, 40 - semanasGestacion);
  const edadCorregidaSemanas = Math.max(0, edadCronologicaSemanas - semanasPrematuro);
  const fmt = (sem: number) => {
    const meses = Math.floor(sem / 4.345);
    const resto = Math.round(sem - meses * 4.345);
    return meses >= 1 ? `${meses} mes${meses > 1 ? 'es' : ''} y ${resto} sem` : `${sem} semanas`;
  };
  return {
    edadCronologicaSemanas, edadCorregidaSemanas, semanasPrematuro,
    cronologicaTexto: fmt(edadCronologicaSemanas),
    corregidaTexto: fmt(edadCorregidaSemanas),
    mensaje: 'La edad corregida se usa para valorar el desarrollo del prematuro, normalmente hasta los 2 años.',
  };
}

// ── Fertilidad según la edad de la mujer ──
export function calcularFertilidadPorEdad(edad: number): {
  probabilidadCiclo: number; probabilidadAnual: number; reserva: string; mensaje: string;
} {
  let probabilidadCiclo: number, probabilidadAnual: number, reserva: string;
  if (edad < 25) { probabilidadCiclo = 25; probabilidadAnual = 96; reserva = 'Óptima'; }
  else if (edad < 30) { probabilidadCiclo = 20; probabilidadAnual = 91; reserva = 'Muy buena'; }
  else if (edad < 35) { probabilidadCiclo = 15; probabilidadAnual = 86; reserva = 'Buena'; }
  else if (edad < 38) { probabilidadCiclo = 10; probabilidadAnual = 78; reserva = 'En descenso'; }
  else if (edad < 41) { probabilidadCiclo = 7; probabilidadAnual = 65; reserva = 'Reducida'; }
  else if (edad < 44) { probabilidadCiclo = 4; probabilidadAnual = 40; reserva = 'Baja'; }
  else { probabilidadCiclo = 2; probabilidadAnual = 15; reserva = 'Muy baja'; }
  const mensaje = edad >= 35
    ? 'La fertilidad desciende de forma más marcada a partir de los 35 años. Si llevas 6 meses buscando, consulta a un especialista.'
    : 'Cifras orientativas de parejas sanas sin problemas de fertilidad. La mayoría logra el embarazo dentro del primer año.';
  return { probabilidadCiclo, probabilidadAnual, reserva, mensaje };
}

// ── Fecha de parto por FIV (transferencia embrionaria) ──
export function calcularFechaPartoFIV(fechaTransferencia: string, diaEmbrion: 3 | 5): {
  fechaParto: string; fechaPartoLarga: string; semanasActuales: string; diasRestantes: number;
} {
  const [y, m, d] = fechaTransferencia.split('-').map(Number);
  const tr = new Date(y, m - 1, d, 12, 0, 0);
  const fpp = new Date(tr); fpp.setDate(fpp.getDate() + (266 - diaEmbrion));
  const hoy = new Date(); hoy.setHours(12, 0, 0, 0);
  const inicioGest = new Date(fpp); inicioGest.setDate(inicioGest.getDate() - 280);
  const diasGest = Math.max(0, Math.round((hoy.getTime() - inicioGest.getTime()) / 86400000));
  const sem = Math.floor(diasGest / 7), dias = diasGest % 7;
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const mm = String(fpp.getMonth() + 1).padStart(2, '0');
  const dd = String(fpp.getDate()).padStart(2, '0');
  return {
    fechaParto: `${fpp.getFullYear()}-${mm}-${dd}`,
    fechaPartoLarga: `${fpp.getDate()} de ${meses[fpp.getMonth()]} de ${fpp.getFullYear()}`,
    semanasActuales: `${sem} sem ${dias} d`,
    diasRestantes: Math.round((fpp.getTime() - hoy.getTime()) / 86400000),
  };
}

// ════════════════════════════════════════════════════════════════
//  FECHAS & TIEMPO — nuevas calculadoras
// ════════════════════════════════════════════════════════════════

// ── Días laborables entre dos fechas ──
export function calcularDiasLaborables(fechaInicio: string, fechaFin: string, incluirSabado: boolean): {
  diasTotales: number; diasLaborables: number; finDeSemana: number; semanas: number;
} {
  const [y1, m1, d1] = fechaInicio.split('-').map(Number);
  const [y2, m2, d2] = fechaFin.split('-').map(Number);
  let ini = new Date(y1, m1 - 1, d1, 12, 0, 0);
  let fin = new Date(y2, m2 - 1, d2, 12, 0, 0);
  if (ini > fin) { const t = ini; ini = fin; fin = t; }
  let diasTotales = 0, diasLaborables = 0, finDeSemana = 0;
  const cur = new Date(ini);
  while (cur <= fin) {
    diasTotales++;
    const dow = cur.getDay();
    const esLaborable = incluirSabado ? dow !== 0 : (dow !== 0 && dow !== 6);
    if (esLaborable) diasLaborables++; else finDeSemana++;
    cur.setDate(cur.getDate() + 1);
  }
  return { diasTotales, diasLaborables, finDeSemana, semanas: Math.round((diasTotales / 7) * 10) / 10 };
}

// ── Horas trabajadas (entrada/salida + descanso) ──
export function calcularHorasTrabajadas(entrada: string, salida: string, descansoMin: number): {
  horasDecimales: number; texto: string; totalMin: number;
} {
  const [eh, em] = entrada.split(':').map(Number);
  const [sh, sm] = salida.split(':').map(Number);
  let min = (sh * 60 + sm) - (eh * 60 + em);
  if (min < 0) min += 24 * 60; // turno nocturno
  min -= Math.max(0, descansoMin);
  if (min < 0) min = 0;
  const h = Math.floor(min / 60), m = min % 60;
  return { horasDecimales: Math.round((min / 60) * 100) / 100, texto: `${h}h ${m}min`, totalMin: min };
}

// ── Sumar o restar horas y minutos ──
export function calcularSumaHoras(h1: number, m1: number, op: 'sumar' | 'restar', h2: number, m2: number): {
  horas: number; minutos: number; totalMin: number; texto: string; negativo: boolean;
} {
  const signo = op === 'restar' ? -1 : 1;
  let totalMin = (h1 * 60 + m1) + signo * (h2 * 60 + m2);
  const negativo = totalMin < 0;
  totalMin = Math.abs(totalMin);
  const horas = Math.floor(totalMin / 60), minutos = totalMin % 60;
  return { horas, minutos, totalMin, texto: `${negativo ? '−' : ''}${horas}h ${minutos}min`, negativo };
}

// ── Conversor de unidades de tiempo ──
export function convertirTiempo(valor: number, unidad: 'segundos' | 'minutos' | 'horas' | 'dias' | 'semanas'): {
  segundos: number; minutos: number; horas: number; dias: number; semanas: number;
} {
  const factor: Record<string, number> = { segundos: 1, minutos: 60, horas: 3600, dias: 86400, semanas: 604800 };
  const seg = valor * factor[unidad];
  const r = (n: number) => Math.round(n * 1000) / 1000;
  return { segundos: r(seg), minutos: r(seg / 60), horas: r(seg / 3600), dias: r(seg / 86400), semanas: r(seg / 604800) };
}

// ── Número de semana del año (ISO 8601) ──
export function calcularNumeroSemana(fecha: string): {
  semana: number; anio: number; diaDelAnio: number; trimestre: number;
} {
  const [y, m, d] = fecha.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const dayNum = (date.getUTCDay() + 6) % 7; // lunes = 0
  date.setUTCDate(date.getUTCDate() - dayNum + 3); // jueves de esa semana
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const firstDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNum + 3);
  const semana = 1 + Math.round((date.getTime() - firstThursday.getTime()) / (7 * 86400000));
  const inicioAnio = new Date(Date.UTC(y, 0, 1));
  const diaDelAnio = Math.floor((Date.UTC(y, m - 1, d) - inicioAnio.getTime()) / 86400000) + 1;
  return { semana, anio: date.getUTCFullYear(), diaDelAnio, trimestre: Math.floor((m - 1) / 3) + 1 };
}

// ── Qué día de la semana cae una fecha ──
export function calcularDiaSemana(fecha: string): {
  diaSemana: string; fechaLarga: string; esFinDeSemana: boolean; diaDelAnio: number;
} {
  const [y, m, d] = fecha.split('-').map(Number);
  const date = new Date(y, m - 1, d, 12, 0, 0);
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const dow = date.getDay();
  const inicioAnio = new Date(y, 0, 1, 12, 0, 0);
  const diaDelAnio = Math.floor((date.getTime() - inicioAnio.getTime()) / 86400000) + 1;
  return {
    diaSemana: dias[dow],
    fechaLarga: `${d} de ${meses[m - 1]} de ${y}`,
    esFinDeSemana: dow === 0 || dow === 6,
    diaDelAnio,
  };
}

// ── Tiempo juntos / desde una fecha (aniversario) ──
export function calcularTiempoJuntos(fechaInicio: string): {
  anios: number; meses: number; dias: number; totalDias: number; totalHoras: number;
  diasProximoAniversario: number; texto: string;
} {
  const [y, m, d] = fechaInicio.split('-').map(Number);
  const ini = new Date(y, m - 1, d, 0, 0, 0);
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  let anios = hoy.getFullYear() - ini.getFullYear();
  let meses = hoy.getMonth() - ini.getMonth();
  let dias = hoy.getDate() - ini.getDate();
  if (dias < 0) { meses--; dias += new Date(hoy.getFullYear(), hoy.getMonth(), 0).getDate(); }
  if (meses < 0) { anios--; meses += 12; }
  const totalDias = Math.floor((hoy.getTime() - ini.getTime()) / 86400000);
  const prox = new Date(hoy.getFullYear(), ini.getMonth(), ini.getDate(), 0, 0, 0);
  if (prox < hoy) prox.setFullYear(prox.getFullYear() + 1);
  const diasProximoAniversario = Math.ceil((prox.getTime() - hoy.getTime()) / 86400000);
  return {
    anios, meses, dias, totalDias, totalHoras: totalDias * 24,
    diasProximoAniversario,
    texto: `${anios} años, ${meses} meses y ${dias} días`,
  };
}

// ── Edad de tu mascota en años humanos ──
export function calcularEdadMascota(edadAnios: number, especie: 'perro' | 'gato', tamano: 'pequeno' | 'mediano' | 'grande'): {
  edadHumana: number; etapa: string; especie: 'perro' | 'gato';
} {
  let edadHumana: number;
  if (especie === 'gato') {
    if (edadAnios <= 1) edadHumana = Math.round(edadAnios * 15);
    else if (edadAnios <= 2) edadHumana = 15 + Math.round((edadAnios - 1) * 9);
    else edadHumana = 24 + Math.round((edadAnios - 2) * 4);
  } else {
    const porAnio = tamano === 'pequeno' ? 4 : tamano === 'grande' ? 6 : 5;
    if (edadAnios <= 1) edadHumana = Math.round(edadAnios * 15);
    else if (edadAnios <= 2) edadHumana = 15 + Math.round((edadAnios - 1) * 9);
    else edadHumana = 24 + Math.round((edadAnios - 2) * porAnio);
  }
  let etapa: string;
  if (edadHumana < 13) etapa = 'Cachorro';
  else if (edadHumana < 25) etapa = 'Joven';
  else if (edadHumana < 50) etapa = 'Adulto';
  else if (edadHumana < 70) etapa = 'Maduro';
  else etapa = 'Senior';
  return { edadHumana, etapa, especie };
}

// ── Día del año y días restantes ──
export function calcularDiaDelAnio(fecha: string): {
  diaDelAnio: number; diasRestantes: number; porcentaje: number; esBisiesto: boolean; totalDias: number;
} {
  const [y, m, d] = fecha.split('-').map(Number);
  const date = new Date(y, m - 1, d, 12, 0, 0);
  const inicioAnio = new Date(y, 0, 1, 12, 0, 0);
  const esBisiesto = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const totalDias = esBisiesto ? 366 : 365;
  const diaDelAnio = Math.floor((date.getTime() - inicioAnio.getTime()) / 86400000) + 1;
  return {
    diaDelAnio, diasRestantes: totalDias - diaDelAnio,
    porcentaje: Math.round((diaDelAnio / totalDias) * 100), esBisiesto, totalDias,
  };
}

// ── Año bisiesto ──
export function calcularAnioBisiesto(anio: number): {
  esBisiesto: boolean; proximoBisiesto: number; diasDelAnio: number; motivo: string;
} {
  const test = (a: number) => (a % 4 === 0 && a % 100 !== 0) || a % 400 === 0;
  const esBisiesto = test(anio);
  let proximoBisiesto = anio + 1;
  while (!test(proximoBisiesto)) proximoBisiesto++;
  let motivo: string;
  if (anio % 400 === 0) motivo = `${anio} es divisible entre 400, por lo que sí es bisiesto.`;
  else if (anio % 100 === 0) motivo = `${anio} es divisible entre 100 pero no entre 400, por lo que NO es bisiesto.`;
  else if (anio % 4 === 0) motivo = `${anio} es divisible entre 4 (y no entre 100), por lo que es bisiesto.`;
  else motivo = `${anio} no es divisible entre 4, por lo que no es bisiesto.`;
  return { esBisiesto, proximoBisiesto, diasDelAnio: esBisiesto ? 366 : 365, motivo };
}
