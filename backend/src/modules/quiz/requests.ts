import { Request } from "express";
import { RequestParams, RequestBody } from "../../shared/libs/rest/index.js";
import { CreateQuizDto } from "./index.js";
import { UpdateQuizDto } from "./dto/update-quiz.dto.js";

export type CreateQuizRequest = Request<
  RequestParams,
  RequestBody,
  CreateQuizDto
>;
export type UpdateQuizRequest = Request<
  RequestParams,
  RequestBody,
  UpdateQuizDto
>;
