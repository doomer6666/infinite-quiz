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
  const { id } = params;
  if (typeof id !== "string") {
    throw new HttpError(StatusCodes.BAD_REQUEST, `Id «${id}» not correct.`);
  }
  return id;
};

export function getFullServerPath(host: string, port: number) {
  return `http://${host}:${port}`;
}

export const isObject = (value: unknown): value is Record<string, object> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
