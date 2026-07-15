import { injectable, inject } from "inversify";
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  PathTransformerMiddleware,
  PrivateRouteMiddleware,
  UploadFileMiddleware,
  ValidateZodMiddleware,
} from "../../shared/libs/rest/index.js";
import { ILogger } from "../../shared/libs/logger/index.js";
import { Component } from "../../shared/types/index.js";
import { IUserService } from "./index.js";
import { IConfig, MainShema } from "../../shared/config/index.js";
import { StatusCodes } from "http-status-codes";
import { CreateUserRequest } from "./requests/create-user-request.type.js";
import { getId } from "../../shared/utils/common.js";
import { Request, Response } from "express";
import { IAuthService } from "../auth/auth-service.interface.js";
import { LoginUserRequest } from "./requests/login-user-request.type.js";
import { LogoutUserRequest } from "./requests/logout-user-request.type.js";
import { UpdateUserRequest } from "./requests/update-user-request.type.js";
import { PathTransformer } from "../../shared/libs/rest/transform/path-transformer.js";
import {
  CreateUserSchema,
  UserWithTokenSсhema,
  LoginUserShema,
  PublicUserShema,
  type UpdateUserDto,
} from "@infinite-quiz/common";

export function userToResponse(user: {
  _id: unknown;
  email: string;
  name: string;
  avatar: string;
  role: string;
}) {
  return {
    id: String(user._id),
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    role: user.role,
  };
}
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
      middlewares: [
        new ValidateZodMiddleware(CreateUserSchema),
        this.pathTransformerMiddleware,
      ],
    });

    this.addRoute({
      path: "/login",
      method: HttpMethod.Get,
      handler: this.checkAuthenticate,
      middlewares: [
        new PrivateRouteMiddleware(),
        this.pathTransformerMiddleware,
      ],
    });
    this.addRoute({
      path: "/login",
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [
        new ValidateZodMiddleware(LoginUserShema),
        this.pathTransformerMiddleware,
      ],
    });
    this.addRoute({
      path: "/logout",
      method: HttpMethod.Post,
      handler: this.logout,
      middlewares: [new PrivateRouteMiddleware()],
    });

    this.addRoute({
      path: "/me",
      method: HttpMethod.Get,
      handler: this.me,
      middlewares: [
        new PrivateRouteMiddleware(),
        this.pathTransformerMiddleware,
      ],
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
        this.pathTransformerMiddleware,
      ],
    });
    this.addRoute({
      path: "/:id",
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new DocumentExistsMiddleware(userService, "User", "id"),
        this.pathTransformerMiddleware,
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
    const token = await this.authService.authenticate(result);

    this.created(
      res,
      UserWithTokenSсhema.parse({ ...userToResponse(result), token }),
    );
  }

  public async getUserById({ params }: Request, res: Response) {
    const id = getId(params);
    const user = await this.userService.findById(id);
    if (!user) {
      throw new HttpError(StatusCodes.NOT_FOUND, "User not found");
    }

    this.ok(res, PublicUserShema.parse(userToResponse(user)));
  }

  public async update(req: UpdateUserRequest, res: Response) {
    const userDto: UpdateUserDto = req.body;
    const id = getId(req.params);

    const updatedUser = await this.userService.updateById(id, userDto);
    if (!updatedUser) {
      throw new HttpError(StatusCodes.NOT_FOUND, "User not found");
    }

    this.ok(res, PublicUserShema.parse(userToResponse(updatedUser)));
  }

  public async delete({ params }: Request, res: Response) {
    const id = getId(params);
    const isDeleted = await this.userService.deleteById(id);
    if (!isDeleted) {
      this.logger.warn(`User ${id} is not deleted!`);
    }
    this.noContent(res, isDeleted);
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

    this.ok(res, PublicUserShema.parse(userToResponse(foundedUser)));
  }

  public async login({ body }: LoginUserRequest, res: Response) {
    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);

    this.ok(res, UserWithTokenSсhema.parse({ ...userToResponse(user), token }));
  }

  public async logout(
    { body }: LogoutUserRequest,
    res: Response,
  ): Promise<void> {
    this.noContent(res, { body });
  }

  public async me({ tokenPayload }: Request, res: Response): Promise<void> {
    const { email } = tokenPayload;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, "User not found");
    }
    this.ok(res, userToResponse(user));
  }

  public async refresh(req: Request, res: Response): Promise<void> {
    const { email } = req.tokenPayload;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, "User not found");
    }

    const token = await this.authService.authenticate(user);
    this.ok(res, { token });
  }

  public async uploadImage({ params, file }: Request, res: Response) {
    if (!file || typeof params.id !== "string") {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        "Image is required",
        "UserController",
      );
    }

    const result = await this.userService.updateById(params.id, {
      avatar: file.filename,
    });
    if (!result) {
      throw new HttpError(StatusCodes.NOT_FOUND, "User not found");
    }

    this.created(res, PublicUserShema.parse(userToResponse(result)));
  }
}
