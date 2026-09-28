import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { calculadoras, categorias } from '../lib/calcData';

/**
 * /search.json — índice del buscador de la app (AppShell.astro).
 *
 * Se genera en cada build desde calcData.ts y la colección del blog, así que
 * nunca se desincroniza. No va incrustado en las páginas: el buscador lo pide
 * la primera vez que se abre, de modo que no pesa en las 232 páginas.
 *
 * Formato compacto (tuplas) para que ocupe poco:
 *   i: iconos SVG sin repetir
 *   c: [slug, nombre, descripción, categoría, índice del icono]
 *   b: [slug, título, descripción]
 */

const catLabel: Record<string, string> = {};
for (const cat of categorias) {
  for (const slug of cat.slugs) catLabel[slug] = cat.label;
}

export const GET: APIRoute = async () => {
  const icons: string[] = [];
  const iconIndex = new Map<string, number>();
  const iconOf = (svg: string): number => {
    let idx = iconIndex.get(svg);
    if (idx === undefined) {
      idx = icons.length;
      icons.push(svg);
      iconIndex.set(svg, idx);
    }
    return idx;
  };

  const calcs = calculadoras.map((c) => [c.slug, c.nombre, c.desc, catLabel[c.slug] ?? '', iconOf(c.icon)]);

  const posts = (await getCollection('blog', (e) => e.data.publicado !== false))
    .sort((a, b) => b.data.fecha.localeCompare(a.data.fecha))
    .map((p) => [`/blog/${p.id}`, p.data.titulo, p.data.descripcion ?? '']);

  return new Response(JSON.stringify({ i: icons, c: calcs, b: posts }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
