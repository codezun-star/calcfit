/**
 * Nodos JSON-LD compartidos por todas las páginas.
 *
 * Se definen una sola vez para que `Base.astro` y `CalculatorLayout.astro`
 * emitan exactamente la misma entidad Organization/WebSite y las referencias
 * por `@id` del resto del @graph nunca queden colgando.
 */

export const SITE_URL = 'https://www.calcfit.com';

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Fecha de última revisión global del sitio (ISO YYYY-MM-DD). */
export const SITE_DATE_MODIFIED = '2026-07-31';

export const organizationSchema = {
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: 'CalcFit',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/favicon.svg`,
    width: 32,
    height: 32,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'codezun@gmail.com',
    contactType: 'customer support',
    availableLanguage: 'Spanish',
  },
  sameAs: ['https://github.com/codezun-star/calcfit'],
  description: 'Calculadoras de salud gratuitas, validadas científicamente',
};

export const websiteSchema = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: 'CalcFit',
  url: SITE_URL,
  description: 'Calculadoras de salud gratuitas y validadas científicamente para toda Latinoamérica',
  inLanguage: 'es',
  publisher: { '@id': ORGANIZATION_ID },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
};
