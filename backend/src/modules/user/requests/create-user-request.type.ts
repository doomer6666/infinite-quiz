import { Request } from "express";
import { RequestParams, RequestBody } from "../../../shared/libs/rest/index.js";
import { CreateUserDto } from "@infinite-quiz/common";

export type CreateUserRequest = Request<
  RequestParams,
  RequestBody,
  CreateUserDto
>;
