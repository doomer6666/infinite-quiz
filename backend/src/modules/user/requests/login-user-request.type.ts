import { Request } from "express";
import { RequestParams, RequestBody } from "../../../shared/libs/rest/index.js";
import { LoginUserDto } from "../dto/login-user.dto.js";

export type LoginUserRequest = Request<
  RequestParams,
  RequestBody,
  LoginUserDto
>;
