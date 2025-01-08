import { z } from "zod";

export const registerSchema = z.object({
  email: z.string(),
  password: z.string(),
  name: z.string(),
});

export type registerDto = z.infer<typeof registerSchema>;
