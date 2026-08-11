import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { calculadoras, categorias } from '../lib/calcData';

/**
 * /llms.txt — índice legible por motores de respuesta (ChatGPT, Perplexity,
 * Claude, Google AI Overviews…). Se genera en cada build desde calcData.ts,
 * por lo que nunca se desincroniza del sitio real.
 * Especificación: https://llmstxt.org
 */

const SITE = 'https://www.calcfit.com';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog', (e) => e.data.publicado !== false))
    .sort((a, b) => b.data.fecha.localeCompare(a.data.fecha));

  const lines: string[] = [];

  lines.push('# CalcFit');
  lines.push('');
  lines.push(`> ${calculadoras.length} calculadoras de salud, fitness, nutrición, embarazo y fechas, con fórmulas validadas científicamente (OMS, Mifflin-St Jeor, US Navy, Cooper, AHA/ACC…). Todos los cálculos se ejecutan en el navegador del usuario: sin registro, sin backend y sin cookies de rastreo.`);
  lines.push('');
  lines.push('## Cómo usar este sitio');
  lines.push('');
  lines.push(`- Cada calculadora tiene su propia URL bajo el dominio raíz, sin barra final (ejemplo: ${SITE}/imc).`);
  lines.push('- Cada página incluye la fórmula empleada, una tabla de rangos de referencia y preguntas frecuentes con respuestas concretas.');
  lines.push('- El contenido explicativo es HTML estático renderizado en servidor: se puede leer y citar sin ejecutar JavaScript.');
  lines.push('- Idioma: español, con terminología adaptada a Latinoamérica (ppm, pies, pulgadas).');
  lines.push('- Aviso importante: los resultados son orientativos y de carácter informativo. No sustituyen el diagnóstico ni el consejo de un profesional sanitario.');
  lines.push('');

  for (const cat of categorias) {
    const slugSet = new Set(cat.slugs);
    const calcs = calculadoras.filter((c) => slugSet.has(c.slug));
    if (calcs.length === 0) continue;

    lines.push(`## ${cat.label}`);
    lines.push('');
    lines.push(`${calcs.length} calculadoras — índice en ${SITE}/${cat.slug}`);
    lines.push('');
    for (const calc of calcs) {
      lines.push(`- [${calc.nombre}](${SITE}${calc.slug}): ${calc.desc}`);
    }
    lines.push('');
  }

  if (posts.length > 0) {
    lines.push('## Blog');
    lines.push('');
    lines.push(`Artículos divulgativos sobre salud, entrenamiento y nutrición (${posts.length} artículos — índice en ${SITE}/blog)`);
    lines.push('');
    for (const post of posts) {
      lines.push(`- [${post.data.titulo}](${SITE}/blog/${post.id})${post.data.descripcion ? `: ${post.data.descripcion}` : ''}`);
    }
    lines.push('');
  }

  lines.push('## Sobre el sitio');
  lines.push('');
  lines.push(`- Editor: CalcFit (${SITE})`);
  lines.push('- Contacto: codezun@gmail.com');
  lines.push(`- Sitemap: ${SITE}/sitemap-index.xml`);
  lines.push(`- Sobre nosotros: ${SITE}/sobre-nosotros`);
  lines.push('- Privacidad: sin cookies de rastreo; el historial opcional se guarda solo en el localStorage del navegador.');
  lines.push('- Licencia de uso del contenido: se permite citar y resumir el contenido indicando la fuente con enlace a la URL original.');
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
