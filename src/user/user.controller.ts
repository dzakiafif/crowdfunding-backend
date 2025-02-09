import { AuthGuard } from "@app/common/auth/auth.guard"
import { Controller, Get, HttpStatus, Res, UseGuards } from "@nestjs/common"
import { Response } from "express"

@Controller("user")
export class UserController {
  @Get("profile")
  @UseGuards(AuthGuard)
  async profile(@Res() res: Response) {
    res
      .status(HttpStatus.OK)
      .json({ status: "success", message: "successfully get profile" })
  }
}
