import { z } from 'zod';

export const createBookSchema = z.object({
  name: z.string().min(2),
  description: z.string().max(500).optional(),
});

export const updateBookSchema = createBookSchema.partial();

export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
