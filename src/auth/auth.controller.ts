import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UsePipes,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ZodValidationPipe } from "@app/common/zod-validation/zod-validation.pipe";
import { loginDto, loginSchema } from "./dto/login.dto";
import { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Body() req: loginDto, @Res() res: Response): Promise<void> {
    try {
      const user = await this.authService.login(req);
      res.status(HttpStatus.OK).json({ status: "success", data: user });
    } catch (err) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ status: "error", message: err });
    }
  }
}
