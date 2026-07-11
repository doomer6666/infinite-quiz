import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { IMiddleware } from "./middleware.interface.js";
import { HttpError } from "../errors/http-error.js";
import { StatusCodes } from "http-status-codes";

export class ValidateZodMiddleware implements IMiddleware {
  constructor(
    private readonly schema: ZodSchema,
    private readonly source: "body" | "query" | "params" = "body",
  ) {}

  public async execute(
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> {
    const data = req[this.source];

    const result = this.schema.safeParse(data);

    if (!result.success) {
      return next(
        new HttpError(
          StatusCodes.BAD_REQUEST,
          result.error.message,
          "ValidateZodMiddleware",
        ),
      );
    }

    req[this.source] = result.data;
    next();
  }
}
