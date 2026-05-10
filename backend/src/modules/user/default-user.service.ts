import { DocumentType, types } from "@typegoose/typegoose";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { IUserService } from "./user-service.interface.js";
import { UserEntity } from "./user.entity.js";
import { inject, injectable } from "inversify";
import { Component } from "../../shared/types/conponent.js";
import { ILogger } from "../../shared/libs/logger/index.js";

@injectable()
export class DefaultUserService implements IUserService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.UserModel)
    private readonly userModel: types.ModelType<UserEntity>,
  ) {}

  public async create(
    dto: CreateUserDto,
    salt: string,
  ): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const res = this.userModel.create(user);
    this.logger.info(`New user created: ${user.name}`);
    return res as Promise<DocumentType<UserEntity>>;
  }

  public async findByEmail(
    email: string,
  ): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email });
  }

  public async findById(id: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ id });
  }
}
