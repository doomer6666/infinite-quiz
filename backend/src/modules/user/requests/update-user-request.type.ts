import { Request } from "express";
import { RequestParams, RequestBody } from "../../../shared/libs/rest/index.js";
import { UpdateUserDto } from "@infinite-quiz/common";

export type UpdateUserRequest = Request<
  RequestParams,
  RequestBody,
  UpdateUserDto
>;
