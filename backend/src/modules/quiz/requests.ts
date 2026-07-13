import { Request } from "express";
import { RequestParams, RequestBody } from "../../shared/libs/rest/index.js";
import { CreateQuizDto, UpdateQuizDto } from "@infinite-quiz/common";

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
