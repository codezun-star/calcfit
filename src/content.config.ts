import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    titulo: z.string(),
    descripcion: z.string().optional(),
    categoria: z.enum(['fitness', 'nutricion', 'salud', 'guias', 'general']).default('general'),
    fecha: z.string(),
    keywords: z.array(z.string()),
    autor: z.string().default('Equipo CalcFit'),
    publicado: z.boolean().default(true),
    tituloSeo: z.string().optional(),
    fechaModificada: z.string().optional(),
    unsplashQuery: z.string().optional(),
  }),
});

export const collections = { blog };
