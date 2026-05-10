import { Request } from "express";
import { RequestBody, RequestParams } from "../../../shared/libs/rest/index.js";

export type LogoutUserRequest = Request<
  RequestParams,
  RequestBody,
  { token: string }
>;
