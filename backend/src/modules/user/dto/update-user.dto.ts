import { IsEmail, IsOptional, IsString, Length } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  public email?: string;

  @IsOptional()
  @IsString()
  @Length(1, 15)
  public name?: string;

  @IsOptional()
  @IsString()
  @Length(6, 12)
  public password?: string;

  @IsOptional()
  @IsString()
  public avatar?: string;
}
