import { Request } from "express";
import { RequestParams, RequestBody } from "../../../shared/libs/rest/index.js";
import { CreateUserDto } from "../dto/create-user.dto.js";

export type CreateUserRequest = Request<
  RequestParams,
  RequestBody,
  CreateUserDto
>;
