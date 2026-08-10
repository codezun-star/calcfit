export type CalcBadge = 'popular' | 'essential' | null;

export type Calc = {
  slug: string;
  nombre: string;
  desc: string;
  badge: CalcBadge;
  destacada: boolean;
  num: string;
  icon: string;
};

export type Categoria = {
  label: string;
  slug: string;
  slugs: string[];
};

const I: Record<string, string> = {
  imc:               `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="9" y1="3" x2="9" y2="15"/><line x1="3" y1="9" x2="15" y2="9"/><path d="M3 9 5.5 14 .5 14Z" fill="currentColor" stroke="none"/><path d="M15 9 12.5 14 17.5 14Z" fill="currentColor" stroke="none"/></svg>`,
  calorias:          `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M9 2c0 0 4 4 4 7.5a4 4 0 01-8 0C5 7 6.5 5 7.5 4c0 0-.5 2.5 1.5 3C9 5.5 9 2 9 2z"/></svg>`,
  pesoIdeal:         `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="7" width="16" height="4"/><line x1="4" y1="7" x2="4" y2="9.5"/><line x1="7" y1="7" x2="7" y2="11"/><line x1="10" y1="7" x2="10" y2="9.5"/><line x1="13" y1="7" x2="13" y2="11"/></svg>`,
  grasa:             `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="9" cy="9" r="7"/><path d="M9 9V2M9 9l5.5 4"/></svg>`,
  macro:             `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="6" y1="2" x2="6" y2="16"/><path d="M3 2v5a3 3 0 006 0V2"/><path d="M12 2c2 2 3 4 2 7l-1 1v6"/></svg>`,
  proteinas:         `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="9" x2="13" y2="9"/><rect x="1" y="7.5" width="3" height="3"/><rect x="4.5" y="6.5" width="2" height="5"/><rect x="11.5" y="6.5" width="2" height="5"/><rect x="14" y="7.5" width="3" height="3"/></svg>`,
  ffmi:              `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14c0-3 1.5-5.5 4-6l3.5-1.5c1.5-1 2.5-3 2-4S11 1.5 10 2.5L7.5 5c-1.5 1-3 3-3 5"/><circle cx="4.5" cy="11.5" r="2.5"/><line x1="1" y1="14" x2="17" y2="14"/></svg>`,
  tmb:               `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M9 1c0 0 5 5 5 9.5a5 5 0 01-10 0C4 8 6 6 7 5c0 0-.5 3 2 3.5C9 6.5 9 1 9 1z"/><path d="M7 13.5c.5 1 2 1.5 2 1.5"/></svg>`,
  oneRM:             `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="6" y="7" width="6" height="4"/><rect x="1" y="5.5" width="2" height="7"/><rect x="15" y="5.5" width="2" height="7"/><line x1="3" y1="9" x2="6" y2="9"/><line x1="12" y1="9" x2="15" y2="9"/></svg>`,
  calCaminando:      `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="3" r="1.5"/><path d="M9.5 5.5L7 10l3.5 1.5-2 5"/><path d="M9.5 5.5L12.5 8 15 7"/><path d="M6.5 10.5L4 15.5"/></svg>`,
  deficit:           `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="4" x2="13" y2="4"/><line x1="2" y1="8" x2="10" y2="8"/><line x1="2" y1="12" x2="7" y2="12"/><line x1="14" y1="10" x2="14" y2="17"/><polyline points="11,14 14,17 17,14"/></svg>`,
  complexion:        `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M5 7.5a4 4 0 018 0v3a4 4 0 01-8 0V7.5z"/><line x1="5" y1="10" x2="13" y2="10" stroke-dasharray="2 1.5"/><line x1="9" y1="14.5" x2="9" y2="17"/><line x1="6" y1="17" x2="12" y2="17"/></svg>`,
  calCiclismo:       `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="4" cy="13" r="3"/><circle cx="14" cy="13" r="3"/><path d="M4 13L7 7h4l2 3"/><circle cx="11" cy="4" r="1.5"/><line x1="9" y1="7" x2="14" y2="10"/></svg>`,
  fuerzaRel:         `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="6" y="8" width="6" height="3"/><rect x="1" y="6.5" width="2" height="6"/><rect x="15" y="6.5" width="2" height="6"/><line x1="3" y1="9.5" x2="6" y2="9.5"/><line x1="12" y1="9.5" x2="15" y2="9.5"/><line x1="6" y1="4" x2="12" y2="4"/><polyline points="8,2 6,4 8,6"/></svg>`,
  masaMuscular:      `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 12c0-3 1.5-5 4-5.5L11 5c2-1 4 0 4 2s-1.5 3-3.5 3L9 9.5"/><path d="M4 12c0 2 1.5 3.5 4 3.5s4-1.5 4-3.5"/><line x1="2" y1="14" x2="16" y2="14"/></svg>`,
  calNatacion:       `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="13" cy="3.5" r="1.5"/><path d="M10.5 5.5L8 9l-4 2"/><path d="M10.5 5.5L14 8l2 3"/><path d="M1 14.5c1.5-1.5 3 0 4.5 0s3-1.5 4.5-1.5 3 1.5 4.5 1.5"/></svg>`,
  testCooper:        `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="3" r="1.5"/><path d="M10 5.5L8 11l-3 2.5"/><path d="M10 5.5L14 8.5l2 4.5"/><path d="M7 9.5L5 15.5"/><path d="M1 16h16"/></svg>`,
  correr:            `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="3" r="1.5"/><path d="M10.5 5.5 7.5 8l2 2-1 6"/><path d="M10.5 5.5 14 7l1.5-1"/><path d="M9.5 10 5 11.5"/><path d="M7.5 8 4 13"/></svg>`,
};

export const calculadoras: Calc[] = [
  { slug: '/imc',                  nombre: 'Calculadora IMC',              desc: 'Índice de Masa Corporal según la OMS',              badge: 'popular',   destacada: true,  num: '01', icon: I.imc },
  { slug: '/calorias-diarias',     nombre: 'Calorías Diarias',             desc: 'TDEE con fórmula Mifflin-St Jeor',                  badge: null,        destacada: false, num: '02', icon: I.calorias },
  { slug: '/peso-ideal',           nombre: 'Peso Ideal',                   desc: '5 fórmulas: Devine, Robinson, Miller',              badge: null,        destacada: false, num: '03', icon: I.pesoIdeal },
  { slug: '/grasa-corporal',       nombre: 'Grasa Corporal',               desc: 'Método Marina US Navy',                             badge: null,        destacada: false, num: '04', icon: I.grasa },
  { slug: '/ffmi',                 nombre: 'FFMI',                         desc: 'Índice de Masa Libre de Grasa',                     badge: null,        destacada: false, num: '05', icon: I.ffmi },
  { slug: '/macronutrientes',      nombre: 'Macronutrientes',              desc: 'Proteínas, carbos y grasas ideales',                badge: null,        destacada: false, num: '06', icon: I.macro },
  { slug: '/proteinas',            nombre: 'Proteínas Diarias',            desc: 'Ingesta mínima y óptima de proteína',               badge: null,        destacada: false, num: '07', icon: I.proteinas },
  { slug: '/metabolismo-basal',    nombre: 'Metabolismo Basal',            desc: 'TMB: Mifflin, Harris-Benedict, Schofield',          badge: null,        destacada: false, num: '08', icon: I.tmb },
  { slug: '/1rm',                  nombre: '1RM — Una Rep. Máxima',        desc: 'Fórmulas Brzycki, Epley y Lander',                  badge: null,        destacada: false, num: '09', icon: I.oneRM },
  { slug: '/calorias-caminando',   nombre: 'Calorías Caminando',           desc: 'Gasto calórico por velocidad y duración',           badge: null,        destacada: false, num: '10', icon: I.calCaminando },
  { slug: '/deficit-calorico',     nombre: 'Déficit Calórico',             desc: 'Calorías para perder peso de forma segura',         badge: null,        destacada: false, num: '11', icon: I.deficit },
  { slug: '/complexion-corporal',  nombre: 'Complexión Corporal',          desc: 'Estructura ósea: pequeña, mediana, grande',         badge: null,        destacada: false, num: '12', icon: I.complexion },
  { slug: '/calorias-ciclismo',    nombre: 'Calorías en Ciclismo',          desc: 'Gasto calórico por velocidad e intensidad',        badge: null,        destacada: false, num: '13', icon: I.calCiclismo },
  { slug: '/fuerza-relativa',      nombre: 'Fuerza Relativa',               desc: 'Ratio 1RM/peso: press, sentadilla, muerto',        badge: null,        destacada: false, num: '14', icon: I.fuerzaRel },
  { slug: '/masa-muscular',        nombre: 'Masa Muscular',                 desc: 'Masa muscular esquelética y SMI (Lee 2000)',        badge: null,        destacada: false, num: '15', icon: I.masaMuscular },
  { slug: '/calorias-natacion',    nombre: 'Calorías Natación',             desc: 'Gasto calórico por estilo: crawl, mariposa',       badge: null,        destacada: false, num: '16', icon: I.calNatacion },
  { slug: '/test-cooper',          nombre: 'Test de Cooper',                desc: 'VO₂ máx en 12 minutos corriendo',                  badge: null,        destacada: false, num: '17', icon: I.testCooper },
  { slug: '/calorias-corriendo',    nombre: 'Calorías Corriendo',           desc: 'Gasto calórico al correr por peso, distancia y tiempo',   badge: null, destacada: false, num: '18', icon: I.correr },
];

export const categorias: Categoria[] = [
  {
    label: 'Fitness & composición corporal',
    slug: 'fitness',
    slugs: ['/imc', '/grasa-corporal', '/masa-muscular', '/ffmi', '/peso-ideal', '/complexion-corporal', '/calorias-caminando', '/calorias-natacion', '/calorias-ciclismo', '/calorias-corriendo', '/1rm', '/fuerza-relativa', '/test-cooper'],
  },
  {
    label: 'Calorías & nutrición',
    slug: 'nutricion',
    slugs: ['/calorias-diarias', '/metabolismo-basal', '/deficit-calorico', '/macronutrientes', '/proteinas'],
  },
];

export function getCalcsByCategory(slug: string): Calc[] {
  const cat = categorias.find(c => c.slug === slug);
  if (!cat) return [];
  const slugSet = new Set(cat.slugs);
  return calculadoras.filter(c => slugSet.has(c.slug));
}
