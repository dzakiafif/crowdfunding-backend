import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common"
import { Observable } from "rxjs"

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest()
      const headers = request.headers
      if (headers.role !== "ADMIN")
        throw new ForbiddenException("Role not allowed")
      return true
    } catch (error) {
      throw new ForbiddenException(error)
    }
  }
}
