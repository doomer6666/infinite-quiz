import { DocumentType, types } from "@typegoose/typegoose";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { IUserService } from "./user-service.interface.js";
import { UserEntity } from "./user.entity.js";
import { inject, injectable } from "inversify";
import { Component } from "../../shared/types/conponent.js";
import { ILogger } from "../../shared/libs/logger/index.js";
import { UpdateUserDto } from "./dto/update-user.dto.js";
import { getRandomAvatar } from "../../shared/constants/default-images.js";

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
    const avatar = dto.avatar ?? getRandomAvatar();

    const user = new UserEntity({ ...dto, avatar });
    user.setPassword(dto.password, salt);

    const res = this.userModel.create(user);
    this.logger.info(`New user created: ${user.name}`);
    return res as Promise<DocumentType<UserEntity>>;
  }

  public async exists(id: string): Promise<boolean> {
    return (await this.userModel.exists({ _id: id })) !== null;
  }

  public async findByEmail(
    email: string,
  ): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email });
  }

  public async findById(id: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ _id: id });
  }

  public async updateById(
    id: string,
    dto: UpdateUserDto,
  ): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOneAndUpdate({ _id: id }, dto, {
      returnDocument: "after",
    });
  }

  public async deleteById(id: string): Promise<boolean> {
    return this.userModel.deleteOne({ _id: id }).exec() !== null;
  }
}
