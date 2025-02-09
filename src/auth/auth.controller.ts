import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UsePipes,
} from "@nestjs/common"
import { AuthService } from "./auth.service"
import { ZodValidationPipe } from "@app/common/zod-validation/zod-validation.pipe"
import { loginSchema, RequestLoginDto } from "./dto/login.dto"
import { Response } from "express"
import { registerSchema, RequestRegisterDto } from "./dto/register.dto"
import { z } from "zod"
import { ApiBody } from "@nestjs/swagger"

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @ApiBody({ type: RequestLoginDto })
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(
    @Body() req: RequestLoginDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const user = await this.authService.login(req)
      res.status(HttpStatus.OK).json({ status: "success", data: user })
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: "error",
        message: err instanceof z.ZodError ? err : err.response.message,
      })
    }
  }

  @Post("register")
  @ApiBody({ type: RequestRegisterDto })
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(registerSchema))
  async register(
    @Body() req: RequestRegisterDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const user = await this.authService.register(req)
      if (!user) {
        throw new BadRequestException("failed created data")
      }

      res
        .status(HttpStatus.OK)
        .json({ status: "success", message: "successfully create data" })
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: "error",
        message: err instanceof z.ZodError ? err : err.response.message,
      })
    }
  }
}
