import {
  BaseController,
  HttpMethod,
  PrivateRouteMiddleware,
} from "../../shared/libs/rest/index.js";
import { Component } from "../../shared/types/conponent.js";
import { injectable, inject } from "inversify";
import { CreateQuizDto, IQuizService } from "./index.js";
import { ILogger } from "../../shared/libs/logger/index.js";
import { CreateQuizRequest } from "./requests/create-quiz-requests.js";
import { Response, Request } from "express";
import { CreateQuizRdo } from "./rdo/quiz.rdo.js";
import { fillDTO, getId } from "../../shared/utils/common.js";

@injectable()
export class QuizController extends BaseController {
  constructor(
    @inject(Component.QuizService) private quizService: IQuizService,
    @inject(Component.Logger) logger: ILogger,
  ) {
    super(logger);
    this.logger.info("Register routes for QuizController…");
    this.addRoute({
      method: HttpMethod.Post,
      path: "",
      handler: this.createQuiz,
      middlewares: [new PrivateRouteMiddleware()],
    });
    this.addRoute({
      method: HttpMethod.Get,
      path: "",
      handler: this.getAllQuizzes,
    });
    this.addRoute({
      method: HttpMethod.Get,
      path: "/:id",
      handler: this.getQuizById,
    });
    this.addRoute({
      method: HttpMethod.Patch,
      path: "/:id",
      handler: this.updateQuiz,
    });
    this.addRoute({
      method: HttpMethod.Delete,
      path: "/:id",
      handler: this.deleteQuiz,
    });
  }

  public async createQuiz(req: CreateQuizRequest, res: Response) {
    const quizDto: CreateQuizDto = req.body;
    const hostId: string = req.tokenPayload?.id;

    const dataForDatabase = { hostId: hostId, ...quizDto };
    const quiz = await this.quizService.create(dataForDatabase);
    this.created(res, fillDTO(CreateQuizRdo, quiz));
  }

  public async getAllQuizzes(_req: Request, res: Response) {
    const quizzes = await this.quizService.findAll();
    this.ok(res, quizzes);
  }
  public async getQuizById(req: Request, res: Response) {
    const id: string = getId(req.params);
    const quiz = await this.quizService.findById(id);
    this.ok(res, fillDTO(CreateQuizRdo, quiz));
  }
  public async updateQuiz() {}
  public async deleteQuiz() {}
}
