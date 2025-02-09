import { z } from "zod"
import { ZodValidationPipe } from "./zod-validation.pipe"

describe("ZodValidationPipe", () => {
  it("should be defined", () => {
    const loginSchema = z.object({
      email: z.string(),
      password: z.string(),
    })
    expect(new ZodValidationPipe(loginSchema)).toBeDefined()
  })
})
