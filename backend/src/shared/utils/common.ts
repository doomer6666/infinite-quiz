import { StatusCodes } from "http-status-codes";
import { HttpError, RequestParams } from "../libs/rest/index.js";
import { ClassConstructor, plainToInstance } from "class-transformer";

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

export const fillDTO = <T, V>(someDTO: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(someDTO, plainObject, { excludeExtraneousValues: true });

export const createErrorObject = (message: string) => ({
  error: message,
});

export const getId = (params: RequestParams): string => {
  const { offerId } = params;
  if (typeof offerId !== "string") {
    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `Id «${offerId}» not correct.`,
    );
  }
  return offerId;
};
