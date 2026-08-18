import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** Speaking — one .md per talk. Body (optional) is extra notes. */
const talks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/talks' }),
  schema: z.object({
    title: z.string(),
    event: z.string(),
    date: z.coerce.date(),
    videoUrl: z.string().url().optional(),
    slidesUrl: z.string().url().optional(),
    summary: z.string(),
    order: z.number().default(0),
  }),
});

/** Services — one .md per offering. */
const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    points: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

export const collections = { talks, services };
