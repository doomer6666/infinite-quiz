import { IsEmail, IsEnum, IsOptional, IsString, Length } from "class-validator";
import { CreateUserMessages } from "./create-user.messages.js";
import { UserRoleEnum } from "../../../shared/types/user.type.js";

export class CreateUserDto {
  @IsOptional()
  public avatar?: string;

  @IsString()
  @IsEnum(UserRoleEnum)
  public role!: string;

  @IsEmail({}, { message: CreateUserMessages.email.invalidFormat })
  public email!: string;

  @IsString()
  @Length(1, 15, { message: CreateUserMessages.name.lengthField })
  public name!: string;

  @IsString({ message: CreateUserMessages.password.invalidFormat })
  @Length(6, 12, { message: CreateUserMessages.password.lengthField })
  public password!: string;
}
