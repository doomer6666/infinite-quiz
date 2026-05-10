import { ContainerModule } from "inversify";
import { Component } from "../../shared/types/conponent.js";
import { IUserService } from "./user-service.interface.js";
import { DefaultUserService } from "./default-user.service.js";
import { types } from "@typegoose/typegoose";
import { UserEntity, UserModel } from "./user.entity.js";
import { BaseController } from "../../shared/libs/rest/index.js";
import { UserContoller } from "./user.controller.js";

export function createUserContainer(): ContainerModule {
  const userContainer = new ContainerModule(({ bind }) => {
    bind<IUserService>(Component.UserService)
      .to(DefaultUserService)
      .inSingletonScope();

    bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(
      UserModel,
    );
    bind<BaseController>(Component.UserController)
      .to(UserContoller)
      .inSingletonScope();
  });

  return userContainer;
}
