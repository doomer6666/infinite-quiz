import { Request } from "express";
import { RequestParams, RequestBody } from "../../../shared/libs/rest/index.js";
import { LoginUserDto } from "@infinite-quiz/common";

export type LoginUserRequest = Request<
  RequestParams,
  RequestBody,
  LoginUserDto
>;
