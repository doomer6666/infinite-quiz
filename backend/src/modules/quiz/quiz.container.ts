import { ContainerModule } from "inversify";
import { Component } from "../../shared/types/conponent.js";
import { DefaultQuizService } from "./default-quiz.service.js";
import { IQuizService } from "./quiz-service.interface.js";
import { types } from "@typegoose/typegoose";
import { QuizEntity, QuizModel } from "./quiz.entity.js";
import { QuizController } from "./quiz.controller.js";
import { BaseController } from "../../shared/libs/rest/index.js";

export function CreateQuizContainer(): ContainerModule {
  const container = new ContainerModule(({ bind }) => {
    bind<IQuizService>(Component.QuizService)
      .to(DefaultQuizService)
      .inSingletonScope();
    bind<types.ModelType<QuizEntity>>(Component.QuizModel).toConstantValue(
      QuizModel,
    );
    bind<BaseController>(Component.QuizController)
      .to(QuizController)
      .inSingletonScope();
  });

  return container;
}
