import { injectable } from "inversify";
import { IController, Route } from "../index.js";
import {
  Request,
  Response,
  NextFunction,
  RequestHandler,
  Router,
} from "express";
import { StatusCodes } from "http-status-codes";
import { ILogger } from "../../logger/index.js";

const DEFAULT_CONTENT_TYPE = "application/json";

@injectable()
export abstract class BaseController implements IController {
  private readonly _router: Router;
  constructor(protected readonly logger: ILogger) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  addRoute(route: Route): void {
    const handler = route.handler.bind(this);
    const wrapperAsyncHandler = this.asyncHandler(handler);

    const middlewareHandlers = route.middlewares?.map((item) =>
      this.asyncHandler(item.execute.bind(item)),
    );
    const allHandlers = middlewareHandlers
      ? [...middlewareHandlers, wrapperAsyncHandler]
      : wrapperAsyncHandler;

    this._router[route.method](route.path, allHandlers);
    this.logger.info(
      `Route registered: ${route.method.toUpperCase()} ${route.path}`,
    );
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    res.type(DEFAULT_CONTENT_TYPE).status(statusCode).json(data);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  private asyncHandler(fn: RequestHandler): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      const result = fn(req, res, next);

      if (result instanceof Promise) {
        result.catch(next);
      }

      return result;
    };
  }
}
