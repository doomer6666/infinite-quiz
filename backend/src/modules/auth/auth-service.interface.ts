import { LoginUserDto } from "@infinite-quiz/common";
import { UserEntity } from "../user/index.js";

export interface IAuthService {
  authenticate(user: UserEntity): Promise<string>;
  verify(dto: LoginUserDto): Promise<UserEntity>;
}
