import { DocumentType } from "@typegoose/typegoose";
import { UserEntity } from "./user.entity.js";
import { CreateUserDto, UpdateUserDto } from "@infinite-quiz/common";

export interface IUserService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findById(id: string): Promise<DocumentType<UserEntity> | null>;
  updateById(
    id: string,
    dto: UpdateUserDto,
  ): Promise<DocumentType<UserEntity> | null>;
  deleteById(id: string): Promise<boolean>;
  exists(id: string): Promise<boolean>;
}
