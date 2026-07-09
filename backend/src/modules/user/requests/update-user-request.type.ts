import { Request } from "express";
import { RequestParams, RequestBody } from "../../../shared/libs/rest/index.js";
import { UpdateUserDto } from "../dto/update-user.dto.js";

export type UpdateUserRequest = Request<
  RequestParams,
  RequestBody,
  UpdateUserDto
>;
