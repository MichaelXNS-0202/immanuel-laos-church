import { defineCollection, z } from 'astro:content';

const news = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    author: z.string().optional(),
    excerpt: z.string().optional(),
    image: z.string().optional(),
  }),
});

const sermons = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    preacher: z.string(),
    scripture: z.string().optional(),
    youtubeId: z.string().optional(), // e.g. 'dQw4w9WgXcQ'
    audioUrl: z.string().optional(),
    excerpt: z.string().optional(),
  }),
});

const events = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    endDate: z.date().optional(),
    location: z.string().optional(),
    excerpt: z.string().optional(),
  }),
});

export const collections = { news, sermons, events };
