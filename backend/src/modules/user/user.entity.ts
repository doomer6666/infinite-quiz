import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";
import { User } from "../../shared/types/index.js";
import { createSHA256 } from "../../shared/utils/index.js";

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
  }

  @prop({ required: true, default: "", type: () => String })
  public email: string;

  @prop({ required: true, default: "", type: () => String })
  public name: string;

  @prop({ required: true, default: "", type: () => String })
  private _password: string;

  public get password() {
    return this._password;
  }

  public setPassword(password: string, salt: string) {
    this._password = createSHA256(password, salt);
  }
}

export const UserModel = getModelForClass(UserEntity);
