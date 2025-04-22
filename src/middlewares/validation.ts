import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

export const urlValidation = zValidator('query',
  z.object({
    url: z.string().url().refine((val) => val.startsWith('http'), {
      message: 'The URL must be a valid HTTP/HTTPS URL.',
    }),
  })
)
