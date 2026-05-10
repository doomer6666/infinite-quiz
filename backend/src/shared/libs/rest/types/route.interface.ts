import { RequestHandler } from "express";
import { HttpMethod } from "./http-method.enum.js";
import { IMiddleware } from "../middleware/middleware.interface.js";

export interface Route {
  path: string;
  method: HttpMethod;
  handler: RequestHandler;
  middlewares?: IMiddleware[];
}
