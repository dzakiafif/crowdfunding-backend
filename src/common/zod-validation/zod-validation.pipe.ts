import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { z, ZodSchema } from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (err) {
      const showAllErrorMessage =
        err instanceof z.ZodError && err.errors && err.errors.length > 0
          ? err.errors.map((val) => val.message).join(", ")
          : "Validation Failed";
      throw new BadRequestException(showAllErrorMessage);
    }
  }
}
