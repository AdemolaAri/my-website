import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const collections = {
	work: defineCollection({
		// Load Markdown files in the src/content/work directory.
		loader: glob({ base: './src/content/work', pattern: '**/*.md' }),
		schema: z.object({
			title: z.string(),
			description: z.string(),
			publishDate: z.coerce.date(),
			tags: z.array(z.string()),
			img: z.string(),
			img_alt: z.string().optional(),
		}),
	}),
	courses: defineCollection({
		// Load Markdown files in the src/content/courses directory.
		loader: glob({ base: './src/content/courses', pattern: '**/*.md' }),
		schema: z.object({
			title: z.string(),
			description: z.string(),
			publishDate: z.coerce.date(),
			tags: z.array(z.string()).optional(),
			img: z.string().optional(),
			img_alt: z.string().optional(),
			duration: z.string().optional(),
			youtube: z.string().optional(),
		}),
	}),
	oss: defineCollection({
		// Load Markdown files in the src/content/oss directory.
		loader: glob({ base: './src/content/oss', pattern: '**/*.md' }),
		schema: z.object({
			title: z.string(),
			description: z.string(),
			repo: z.string(),
			repoUrl: z.string().url(),
			type: z.enum(['pr', 'issue', 'maintainer', 'contributor']),
			link: z.string().url().optional(),
			publishDate: z.coerce.date(),
			tags: z.array(z.string()).optional(),
		}),
	}),
};
