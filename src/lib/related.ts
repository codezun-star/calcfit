import { calculadoras, categorias, type Calc } from './calcData';

/**
 * Calculadoras relacionadas — enlazado interno automático.
 *
 * Antes sólo 16 de las 143 páginas pasaban el prop `related`, así que el resto
 * eran callejones sin salida: 55 calculadoras recibían enlaces desde una sola
 * página del sitio y 41 desde dos. Con Google eso significa poca frecuencia de
 * rastreo y casi ninguna autoridad interna, que es justo el síntoma descrito en
 * CLAUDE.md ("52 calculadoras sin una sola impresión").
 *
 * Este módulo calcula en build una lista de calculadoras afines para cualquier
 * slug, de forma determinista (el mismo código fuente produce siempre el mismo
 * HTML) y sin mantenimiento manual: una calculadora nueva queda enlazada en
 * cuanto se añade a `calcData.ts`.
 *
 * El criterio es la similitud de texto entre nombre + descripción + slug,
 * ponderada por IDF para que las palabras que aparecen en casi todas las
 * fichas ("calcula", "tu", "según") no dominen el parecido. Se prioriza la
 * misma categoría y se completa con otras categorías si hacen falta.
 */

const STOPWORDS = new Set([
  'a', 'al', 'algo', 'ante', 'aqui', 'asi', 'aunque', 'cada', 'como', 'con',
  'cual', 'cuando', 'cuanto', 'de', 'del', 'desde', 'donde', 'dos', 'el',
  'ella', 'ellos', 'en', 'entre', 'era', 'es', 'esa', 'ese', 'eso', 'esta',
  'este', 'esto', 'hasta', 'hay', 'la', 'las', 'le', 'lo', 'los', 'mas', 'me',
  'mi', 'mucho', 'muy', 'no', 'nos', 'o', 'para', 'pero', 'por', 'porque',
  'que', 'se', 'segun', 'ser', 'si', 'sin', 'sobre', 'solo', 'son', 'su',
  'sus', 'tan', 'te', 'tener', 'ti', 'tiene', 'tu', 'tus', 'un', 'una', 'uno',
  'unos', 'y', 'ya',
  // Verbos y sustantivos genéricos del dominio: aparecen en casi todas las
  // fichas y no aportan señal de parecido.
  'calcula', 'calcular', 'calculadora', 'calculo', 'conoce', 'cuanta',
  'cuantas', 'cuanto', 'cuantos', 'descubre', 'estima', 'gratis', 'necesitas',
  'nivel', 'obten', 'resultado', 'sabe', 'saber', 'segundos', 'tabla', 'tiempo',
]);

/** Quita acentos, baja a minúsculas y parte en palabras de 3+ letras. */
function tokenize(text: string): string[] {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t));
}

const catBySlug = new Map<string, string>();
for (const cat of categorias) {
  for (const slug of cat.slugs) catBySlug.set(slug, cat.label);
}

/** Bolsa de palabras de cada calculadora, indexada por slug. */
const tokensBySlug = new Map<string, Set<string>>();
for (const calc of calculadoras) {
  tokensBySlug.set(
    calc.slug,
    new Set(tokenize(`${calc.nombre} ${calc.desc} ${calc.slug.replace(/-/g, ' ')}`)),
  );
}

/**
 * Peso IDF de cada palabra: log(N / documentos que la contienen). Una palabra
 * presente en 2 fichas distingue mucho más que una presente en 40.
 */
const idf = new Map<string, number>();
{
  const docFreq = new Map<string, number>();
  for (const tokens of tokensBySlug.values()) {
    for (const token of tokens) docFreq.set(token, (docFreq.get(token) ?? 0) + 1);
  }
  const total = tokensBySlug.size;
  for (const [token, freq] of docFreq) idf.set(token, Math.log(total / freq));
}

/** Similitud = suma de los pesos IDF de las palabras compartidas. */
function similarity(a: Set<string>, b: Set<string>): number {
  let score = 0;
  // Se recorre el conjunto menor: el resultado es el mismo y evita trabajo.
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  for (const token of small) {
    if (large.has(token)) score += idf.get(token) ?? 0;
  }
  return score;
}

/**
 * Peso de pertenecer a la misma categoría. Por encima de cualquier parecido de
 * texto realista, así que las cuatro sugerencias salen de la misma categoría
 * siempre que la haya, y el parecido sólo decide el orden dentro de ella.
 */
const SAME_CATEGORY_BONUS = 5;

/** Cuántas sugerencias se muestran: 4 llena exactamente la rejilla. */
const DEFAULT_COUNT = 4;

/** Candidatas ordenadas de mejor a peor para un slug dado. */
function rank(slug: string): Calc[] {
  const own = tokensBySlug.get(slug);
  if (!own) return [];
  const ownCategory = catBySlug.get(slug);

  return calculadoras
    .filter((c) => c.slug !== slug)
    .map((c) => ({
      calc: c,
      score:
        similarity(own, tokensBySlug.get(c.slug) ?? new Set()) +
        (ownCategory && catBySlug.get(c.slug) === ownCategory ? SAME_CATEGORY_BONUS : 0),
    }))
    // Orden determinista: por puntuación y, a igualdad, alfabético por slug.
    // Sin el desempate el orden dependería del de `calculadoras`, y reordenar
    // ese array cambiaría el HTML de páginas que no se han tocado.
    .sort((a, b) => b.score - a.score || a.calc.slug.localeCompare(b.calc.slug))
    .map((s) => s.calc);
}

/**
 * Grafo completo, calculado una sola vez por build.
 *
 * Con las cuatro mejores candidatas a secas quedaban ~10 calculadoras que no
 * aparecían en la lista de nadie: seguían sin recibir un solo enlace desde otra
 * calculadora. La segunda pasada las coloca en la página con la que más se
 * parecen, sustituyendo su última sugerencia (la más débil). Así ninguna
 * calculadora queda sin enlaces entrantes.
 */
const graph: Map<string, Calc[]> = (() => {
  const map = new Map<string, Calc[]>();
  const ranked = new Map<string, Calc[]>();
  for (const calc of calculadoras) {
    const order = rank(calc.slug);
    ranked.set(calc.slug, order);
    map.set(calc.slug, order.slice(0, DEFAULT_COUNT));
  }

  const bySlug = new Map(calculadoras.map((c) => [c.slug, c]));
  const inbound = new Map<string, number>(calculadoras.map((c) => [c.slug, 0]));
  for (const list of map.values()) {
    for (const c of list) inbound.set(c.slug, (inbound.get(c.slug) ?? 0) + 1);
  }

  const orphansNow = () =>
    // En orden alfabético para que el resultado no dependa del orden del array
    // `calculadoras`.
    [...inbound.entries()]
      .filter(([, n]) => n === 0)
      .map(([slug]) => slug)
      .sort();

  // Cada inserción desaloja a otra calculadora, que puede quedarse a su vez sin
  // enlaces, así que se repite hasta que no queden huérfanas. El bucle tiene
  // tope porque cada vuelta reduce el número de huérfanas o termina.
  for (let pass = 0; pass < calculadoras.length; pass++) {
    const orphans = orphansNow();
    if (orphans.length === 0) break;
    let placed = false;

    for (const orphan of orphans) {
      const orphanCalc = bySlug.get(orphan);
      // Anfitriona: la calculadora con la que más se parece y que todavía no la
      // enlaza.
      const host = (ranked.get(orphan) ?? []).find((c) => {
        const list = map.get(c.slug);
        return list && !list.some((x) => x.slug === orphan);
      });
      if (!orphanCalc || !host) continue;
      const list = map.get(host.slug)!;

      // Se desaloja a la que más enlaces entrantes tiene: así la sustitución no
      // crea una huérfana nueva mientras alguna candidata tenga de sobra.
      let victimIdx = 0;
      for (let i = 1; i < list.length; i++) {
        if ((inbound.get(list[i].slug) ?? 0) > (inbound.get(list[victimIdx].slug) ?? 0)) victimIdx = i;
      }
      const victim = list[victimIdx];
      if ((inbound.get(victim.slug) ?? 0) <= 1) continue; // dejaría huérfana a la desalojada

      list[victimIdx] = orphanCalc;
      inbound.set(victim.slug, (inbound.get(victim.slug) ?? 1) - 1);
      inbound.set(orphan, (inbound.get(orphan) ?? 0) + 1);
      placed = true;
    }

    if (!placed) break;
  }

  return map;
})();

/**
 * Devuelve las calculadoras más afines a `slug`, excluida ella misma.
 *
 * @param slug  Slug con barra inicial (`/imc`) o sin ella (`imc`).
 * @param count Cuántas devolver. Por defecto 4, que es lo que muestra la rejilla.
 */
export function getRelatedCalcs(slug: string, count = DEFAULT_COUNT): Calc[] {
  const key = slug.startsWith('/') ? slug : `/${slug}`;
  const base = graph.get(key);
  if (!base) return [];
  if (count <= base.length) return base.slice(0, count);
  // Para listas más largas que el grafo precalculado se amplía sobre la marcha.
  return rank(key).slice(0, count);
}

/**
 * Calculadoras que mejor encajan con un texto libre (título + descripción +
 * keywords de un artículo del blog, por ejemplo).
 *
 * Sirve para enlazar cada artículo con las calculadoras de las que habla, en
 * lugar del enlace genérico a la home que había antes. Devuelve sólo las que
 * superan un mínimo de parecido: es preferible no enseñar nada a enseñar
 * cuatro calculadoras que no vienen a cuento.
 */
export function getCalcsForText(text: string, count = 3): Calc[] {
  const tokens = new Set(tokenize(text));
  if (tokens.size === 0) return [];

  const scored = calculadoras
    .map((c) => ({ calc: c, score: similarity(tokens, tokensBySlug.get(c.slug) ?? new Set()) }))
    .filter((s) => s.score >= MIN_TEXT_MATCH)
    .sort((a, b) => b.score - a.score || a.calc.slug.localeCompare(b.calc.slug));

  if (scored.length === 0) return [];

  // Umbral relativo: casi todos los artículos tienen una calculadora
  // claramente suya, y detrás una cola de coincidencias flojas por una palabra
  // corriente. Se exige a las demás un parecido comparable al de la primera,
  // así que un artículo muy específico enseña una sola sugerencia en vez de
  // rellenar con tres que no vienen a cuento.
  const cutoff = scored[0].score * RELATIVE_TEXT_MATCH;
  return scored.filter((s) => s.score >= cutoff).slice(0, count).map((s) => s.calc);
}

/**
 * Umbral absoluto de parecido para `getCalcsForText`: compartir al menos una
 * palabra bastante específica (presente en ~1 de cada 6 fichas).
 */
const MIN_TEXT_MATCH = 1.6;

/** Parecido mínimo de las siguientes sugerencias respecto a la primera. */
const RELATIVE_TEXT_MATCH = 0.55;
