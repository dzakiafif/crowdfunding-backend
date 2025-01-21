import { ApiProperty } from "@nestjs/swagger";
import { z } from "zod";

// Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special characters
const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
);

export const registerSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(5, { message: "Must be 5 or more characters long" }),
  password: z
    .string()
    .min(8, { message: "Must be 8 or more characters long" })
    .regex(passwordValidation, {
      message:
        "Password is not valid. at least one uppercase letter, one lowercase letter, one number and one special characters",
    }),
  name: z.string().min(3, { message: "Must be 3 or more characters long" }),
});

export type registerDto = z.infer<typeof registerSchema>;

export class RequestRegisterDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  name: string;
}
