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
