import { z } from 'zod'

// structure for a blog event
export const eventCreateSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(4, 'Title is too short'),
  body: z
    .string({ required_error: 'Description is required' })
    .min(10, 'Description is too short')
    .max(2048, 'Description is too long'),
})

export const eventUpdateSchema = eventCreateSchema.merge(
  z.object({
    id: z.string(),
  }),
)
