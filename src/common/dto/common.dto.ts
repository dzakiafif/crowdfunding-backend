import { z } from "zod"

export const envSchema = z.object({
  JWT_SECRET: z.string(),
  JWT_EXPIRESIN: z.string(),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().optional().default(3000),
})
