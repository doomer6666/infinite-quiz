import { Request, Response, NextFunction } from "express";
import { IMiddleware } from "./middleware.interface.js";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { StatusCodes } from "http-status-codes";

export class ValidateDtoMiddleware implements IMiddleware {
  constructor(private dto: ClassConstructor<object>) {}

  public async execute(
    { body }: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    console.log(body);
    const dtoInstance = plainToInstance(this.dto, body);
    const errors = await validate(dtoInstance);
    if (errors.length > 0) {
      const messages = errors
        .map((error) => Object.values(error.constraints || {}))
        .flat();

      res.status(StatusCodes.BAD_REQUEST).json({
        error: "Validation failed",
        messages,
      });
      return;
    }
    next();
  }
}
