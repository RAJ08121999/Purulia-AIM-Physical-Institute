import { z } from 'zod';

export function createPaginationSchema<T extends [string, ...string[]]>(sortableFields: T) {
  return z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().trim().optional(),
    sortBy: z.enum(sortableFields).optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  });
}

export const StandardPaginationSchema = createPaginationSchema(['createdAt', 'updatedAt', 'name', 'id']);
export type StandardPaginationInput = z.infer<typeof StandardPaginationSchema>;
