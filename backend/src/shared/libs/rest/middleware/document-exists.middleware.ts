import { Request, Response, NextFunction } from "express";
import { IMiddleware } from "./middleware.interface.js";
import { HttpError } from "../errors/http-error.js";
import { StatusCodes } from "http-status-codes";
import { IDocumentExists } from "../../../types/index.js";

export class DocumentExistsMiddleware implements IMiddleware {
  constructor(
    private readonly service: IDocumentExists,
    private readonly entityName: string,
    private readonly paramName: string,
  ) {}

  public async execute(
    { params }: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> {
    const documentId = params[this.paramName];
    if (
      typeof documentId === "string" &&
      !(await this.service.exists(documentId))
    ) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} with ${documentId} not found.`,
        "DocumentExistsMiddleware",
      );
    }
    next();
  }
}
