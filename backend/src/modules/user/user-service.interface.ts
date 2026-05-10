import { DocumentType } from "@typegoose/typegoose";
import { CreateUserDto } from "./dto/create-user.dto.js";
import { UserEntity } from "./user.entity.js";

export interface IUserService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findById(id: string): Promise<DocumentType<UserEntity> | null>;
}
