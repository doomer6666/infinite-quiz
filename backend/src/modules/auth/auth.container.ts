import { ContainerModule } from "inversify";
import { Component } from "../../shared/types/conponent.js";
import { IAuthService } from "./auth-service.interface.js";
import { DefaultAuthService } from "./default-auth.service.js";

export function createAuthContainer(): ContainerModule {
  const authContainer = new ContainerModule(({ bind }) => {
    bind<IAuthService>(Component.AuthService)
      .to(DefaultAuthService)
      .inSingletonScope();
  });

  return authContainer;
}
