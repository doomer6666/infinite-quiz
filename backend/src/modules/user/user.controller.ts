import { injectable, inject } from "inversify";
import {
  BaseController,
  HttpError,
  HttpMethod,
} from "../../shared/libs/rest/index.js";
import { ILogger } from "../../shared/libs/logger/index.js";
import { Component } from "../../shared/types/index.js";
import { IUserService } from "./index.js";
import { IConfig, MainShema } from "../../shared/config/index.js";
import { StatusCodes } from "http-status-codes";
import { CreateUserRequest } from "./requests/create-user-request.type.js";
import { fillDTO } from "../../shared/utils/common.js";
import { UserRdo } from "./rdo/user.rdo.js";
import { Request, Response } from "express";
import { ValidateDtoMiddleware } from "../../shared/libs/rest/middleware/validate-dto.middleware.js";
import { CreateUserDto } from "./dto/create-user.dto.js";

@injectable()
export class UserContoller extends BaseController {
  constructor(
    @inject(Component.Logger) readonly logger: ILogger,
    @inject(Component.UserService) private readonly userService: IUserService,
    @inject(Component.Config) private readonly config: IConfig<MainShema>,
  ) {
    super(logger);
    this.logger.info("Register routes for UserController…");

    this.addRoute({
      path: "/register",
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)],
    });
  }

  public async create(
    { body }: CreateUserRequest,
    res: Response,
  ): Promise<void> {
    const existUser = await this.userService.findByEmail(body.email);

    if (existUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        "UserController",
      );
    }

    const result = await this.userService.create(body, this.config.get("SALT"));
    this.created(res, fillDTO(UserRdo, result));
  }
}
