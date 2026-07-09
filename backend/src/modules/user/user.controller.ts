import { injectable, inject } from "inversify";
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  PathTransformerMiddleware,
  PrivateRouteMiddleware,
  UploadFileMiddleware,
} from "../../shared/libs/rest/index.js";
import { ILogger } from "../../shared/libs/logger/index.js";
import { Component } from "../../shared/types/index.js";
import { IUserService, LoginUserDto } from "./index.js";
import { IConfig, MainShema } from "../../shared/config/index.js";
import { StatusCodes } from "http-status-codes";
import { CreateUserRequest } from "./requests/create-user-request.type.js";
import { fillDTO, getId } from "../../shared/utils/common.js";
import { UserRdo } from "./rdo/user.rdo.js";
import { Request, Response } from "express";
import { ValidateDtoMiddleware } from "../../shared/libs/rest/middleware/validate-dto.middleware.js";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { LoggedUserRdo } from "./rdo/logged-user.rdo.js";
import { IAuthService } from "../auth/auth-service.interface.js";
import { LoginUserRequest } from "./requests/login-user-request.type.js";
import { LogoutUserRequest } from "./requests/logout-user-request.type.js";
import { RefreshUserRequest } from "./requests/refresh-user-request.type.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";
import { UpdateUserRequest } from "./requests/update-user-request.type.js";
import { PublicUserRdo } from "./rdo/public-user.rdo.js";
import { PathTransformer } from "../../shared/libs/rest/transform/path-transformer.js";

@injectable()
export class UserContoller extends BaseController {
  private readonly pathTransformerMiddleware: PathTransformerMiddleware;
  constructor(
    @inject(Component.Logger) readonly logger: ILogger,
    @inject(Component.UserService) private readonly userService: IUserService,
    @inject(Component.Config) private readonly config: IConfig<MainShema>,
    @inject(Component.AuthService) private readonly authService: IAuthService,
    @inject(Component.PathTransformer)
    private readonly pathTransformer: PathTransformer,
  ) {
    super(logger);
    this.logger.info("Register routes for UserController…");

    this.pathTransformerMiddleware = new PathTransformerMiddleware(
      pathTransformer,
    );

    this.addRoute({
      path: "/register",
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)],
    });

    this.addRoute({
      path: "/login",
      method: HttpMethod.Get,
      handler: this.checkAuthenticate,
      middlewares: [new PrivateRouteMiddleware()],
    });
    this.addRoute({
      path: "/login",
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)],
    });
    this.addRoute({
      path: "/logout",
      method: HttpMethod.Post,
      handler: this.logout,
      middlewares: [new PrivateRouteMiddleware()],
    });

    this.addRoute({
      path: "/refresh",
      method: HttpMethod.Post,
      handler: this.refresh,
      middlewares: [new PrivateRouteMiddleware()],
    });
    this.addRoute({
      path: "/:id",
      method: HttpMethod.Get,
      handler: this.getUserById,
      middlewares: [
        new DocumentExistsMiddleware(userService, "User", "id"),
        this.pathTransformerMiddleware,
      ],
    });
    this.addRoute({
      path: "/:id/avatar",
      method: HttpMethod.Post,
      handler: this.uploadImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new DocumentExistsMiddleware(userService, "User", "id"),
        new UploadFileMiddleware(this.config.get("UPLOAD_DIR"), "avatar"),
      ],
    });
    this.addRoute({
      path: "/:id",
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new DocumentExistsMiddleware(userService, "User", "id"),
      ],
    });
    this.addRoute({
      path: "/:id",
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new DocumentExistsMiddleware(userService, "User", "id"),
      ],
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

  public async getUserById({ params }: Request, res: Response) {
    const id = getId(params);
    const user = await this.userService.findById(id);

    if (!user) {
      throw new HttpError(StatusCodes.NOT_FOUND, "User not found");
    }

    this.ok(
      res,
      fillDTO(PublicUserRdo, {
        id: user._id.toString(),
        name: user.name,
        avatar: user.avatar,
      }),
    );
  }

  public async update(req: UpdateUserRequest, res: Response) {
    const userDto: UpdateUserDto = req.body;
    const id: string = getId(req.params);

    const updateUser = await this.userService.updateById(id, userDto);
    return this.ok(res, fillDTO(UpdateUserDto, updateUser));
  }

  public async delete({ params }: Request, res: Response) {
    const id = getId(params);
    const isDelited = await this.userService.deleteById(id);
    if (!isDelited) {
      this.logger.warn(`${id} is not deleted!`);
    }
    return this.noContent(res, isDelited);
  }

  public async checkAuthenticate(
    { tokenPayload: { email } }: Request,
    res: Response,
  ) {
    const foundedUser = await this.userService.findByEmail(email);

    if (!foundedUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        "Unauthorized",
        "UserController",
      );
    }

    this.ok(res, fillDTO(LoggedUserRdo, foundedUser));
  }

  public async login({ body }: LoginUserRequest, res: Response) {
    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);

    const responseData = fillDTO(LoggedUserRdo, {
      email: user.email,
      token,
    });
    this.ok(res, responseData);
  }

  public async logout(
    { body }: LogoutUserRequest,
    res: Response,
  ): Promise<void> {
    this.noContent(res, { body });
  }

  public async refresh(
    { body }: RefreshUserRequest,
    res: Response,
  ): Promise<void> {
    this.ok(res, body.token);
  }

  public async uploadImage({ params, file }: Request, res: Response) {
    if (!file || typeof params.quizId !== "string") {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        "Image is required",
        "QuizController",
      );
    }
    const updateDto = { avatar: file.filename };
    const result = await this.userService.updateById(params.quizId, updateDto);
    this.created(res, fillDTO(UserRdo, result));
  }
}
