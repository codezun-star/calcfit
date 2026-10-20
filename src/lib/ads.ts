/**
 * Unidades publicitarias del sitio — fuente única.
 *
 * Los banners con `atOptions` comparten una variable global: si se cargan dos
 * en la misma página, el último sobrescribe al anterior y sólo se pinta uno.
 * Por eso cada banner se renderiza dentro de su propio iframe `srcdoc`
 * (ver `AdEngine.astro`), que le da un `window` aislado y evita además que el
 * `document.write` del proveedor borre el documento ya hidratado por React.
 */

export interface AdUnit {
  /** Clave de la unidad en el panel del proveedor */
  key: string;
  width: number;
  height: number;
}

/** Banners iframe (highrevenueformat) */
export const AD_UNITS = {
  /** 728×90 — cabecera de escritorio */
  leaderboard: { key: '23201ecaaa964abba934b752593434c4', width: 728, height: 90 },
  /** 468×60 — banner intermedio de escritorio */
  banner: { key: '2beba7c91447b924ee81ce9843df17bc', width: 468, height: 60 },
  /** 300×250 — rectángulo en contenido (también válido en móvil) */
  rectangle: { key: 'dd7a320c8d66fa22a8973a6ec4c65801', width: 300, height: 250 },
  /** 160×600 — rascacielos de la columna lateral */
  skyscraper: { key: '3e1a51cae096c2f4619927364149b39f', width: 160, height: 600 },
  /** 160×300 — medio rascacielos, debajo del anterior */
  halfsky: { key: 'd28aedbbaa005ca8143f6c18937854ee', width: 160, height: 300 },
  /** 320×50 — cabecera y ancla en móvil */
  mobile: { key: '406dea4ed70bc2bce08b5c8c5ff9cb9a', width: 320, height: 50 },
} as const satisfies Record<string, AdUnit>;

export type AdUnitName = keyof typeof AD_UNITS;
/** `native` no es un banner iframe: usa contenedor propio + invoke asíncrono */
export type AdSlotName = AdUnitName | 'native' | 'none';

/** Dominio que sirve los `invoke.js` de los banners iframe */
export const AD_BANNER_HOST = 'https://www.highrevenueformat.com';

/** Native Banner — un único contenedor por página (el id es fijo) */
export const AD_NATIVE_KEY = '1803216fd17559bf6ca5516bae399474';
export const AD_NATIVE_SRC = `https://pl31073382.profitableratecpmnetwork.com/${AD_NATIVE_KEY}/invoke.js`;
/** Altura reservada para el native antes de que cargue (evita CLS) */
export const AD_NATIVE_MIN_HEIGHT = 250;

/** Script global de la red (una sola vez por página) */
export const AD_GLOBAL_SRC =
  'https://pl31073381.profitableratecpmnetwork.com/51/81/48/51814890af0502b1e60a87df7a9b6cd4.js';

/** Punto de corte móvil/escritorio para elegir formato */
export const AD_MOBILE_QUERY = '(max-width: 767px)';

/** Margen de precarga del IntersectionObserver */
export const AD_LAZY_MARGIN = '600px';

/** Altura que hay que reservar para un formato (0 si no se pinta) */
export function adHeight(name: AdSlotName): number {
  if (name === 'none') return 0;
  if (name === 'native') return AD_NATIVE_MIN_HEIGHT;
  return AD_UNITS[name].height;
}
