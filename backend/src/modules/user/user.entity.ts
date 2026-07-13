import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";
import { createSHA256 } from "../../shared/utils/index.js";
import { User, UserRoleEnum } from "@infinite-quiz/common";

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: "users",
  },
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  constructor(userData: User) {
    super();
    this.email = userData.email;
    this.name = userData.name;
    this._password = userData.password;
    this.avatar = userData.avatar;
    this.role = userData.role;
  }
  @prop({ type: () => String, required: true })
  public avatar!: string;

  @prop({
    type: () => String,
    enum: Object.values(UserRoleEnum),
    required: true,
  })
  public role!: string;

  @prop({ required: true, default: "", type: () => String })
  public email: string;

  @prop({ required: true, default: "", type: () => String })
  public name: string;

  @prop({
    type: () => String,
    required: true,
    default: "",
  })
  private _password: string;

  public get password() {
    return this._password;
  }

  public setPassword(password: string, salt: string) {
    this._password = createSHA256(password, salt);
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
