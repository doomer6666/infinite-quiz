import { inject, injectable } from "inversify";
import { UserEntity, LoginUserDto, IUserService } from "../user/index.js";
import { IAuthService } from "./auth-service.interface.js";
import * as crypto from "node:crypto";
import { SignJWT } from "jose";
import { JWT_ALGORITHM, JWT_EXPIRED } from "./auth.constant.js";
import { IConfig } from "../../shared/config/config.interface.js";
import { ILogger } from "../../shared/libs/logger/logger.interface.js";
import {
  UserNotFoundException,
  UserPasswordIncorrectException,
} from "../../shared/libs/rest/index.js";
import { Component } from "../../shared/types/conponent.js";
import { MainShema } from "../../shared/config/main.shema.js";

@injectable()
export class DefaultAuthService implements IAuthService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.UserService) private readonly userService: IUserService,
    @inject(Component.Config) private readonly config: IConfig<MainShema>,
  ) {}

  public async authenticate(user: UserEntity): Promise<string> {
    const jwtSecret = this.config.get("JWT_SECRET");
    const secterKey = crypto.createSecretKey(jwtSecret, "utf-8");
    const tokenPayload = {
      email: user.email,
      name: user.name,
      id: user.id,
    };

    this.logger.info(`Create token for ${user.email}`);
    return new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRED)
      .sign(secterKey);
  }

  public async verify(dto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      this.logger.warn(`User with ${dto.email} not found`);
      throw new UserNotFoundException();
    }

    if (!user.verifyPassword(dto.password, this.config.get("SALT"))) {
      this.logger.warn(`Incorrect password for ${dto.email}`);
      throw new UserPasswordIncorrectException();
    }

    return user;
  }
}
