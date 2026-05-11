import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './middleware.interface.js';
import { HttpError } from '../errors/http-error.js';
import { StatusCodes } from 'http-status-codes';

export class PrivateRouteMiddleware implements IMiddleware {
  execute({ tokenPayload }: Request, _res: Response, next: NextFunction): void {
    if (!tokenPayload) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'PrivateRouteMiddleware'
      );
    }

    return next();
  }
}
