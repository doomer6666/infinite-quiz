import { Request, Response, NextFunction } from "express";
import { IMiddleware } from "./middleware.interface.js";
import { JWTPayload, jwtVerify } from "jose";
import { createSecretKey } from "node:crypto";
import { HttpError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import { TokenPayload } from "../../../../modules/auth/index.js";

function isTokenPayload(payload: JWTPayload): payload is TokenPayload {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "email" in payload &&
    typeof payload.email === "string" &&
    "name" in payload &&
    typeof payload.name === "string" &&
    "id" in payload &&
    typeof payload.id === "string"
  );
}

export class ParseTokenMiddleware implements IMiddleware {
  constructor(private readonly jwtSecret: string) {}

  public async execute(
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> {
    const authorizationHeader = req.headers?.authorization?.split(" ");
    if (!authorizationHeader) {
      return next();
    }

    const [, token] = authorizationHeader;

    try {
      const { payload } = await jwtVerify(
        token,
        createSecretKey(this.jwtSecret, "utf-8"),
      );
      if (isTokenPayload(payload)) {
        req.tokenPayload = { ...payload };
        return next();
      }
    } catch {
      return next(
        new HttpError(
          StatusCodes.UNAUTHORIZED,
          "Invalid token",
          "AuthenticateMiddleware",
        ),
      );
    }
  }
}
