import { Request } from "express";
import { RequestParams, RequestBody } from "../../../shared/libs/rest/index.js";
import { CreateQuizDto } from "../index.js";

export type CreateQuizRequest = Request<
  RequestParams,
  RequestBody,
  CreateQuizDto
>;
