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
