import {
  BaseController,
  DocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  PathTransformerMiddleware,
  PrivateRouteMiddleware,
  UploadFileMiddleware,
} from "../../shared/libs/rest/index.js";
import { Component } from "../../shared/types/conponent.js";
import { injectable, inject } from "inversify";
import { CreateQuizDto, IQuizService } from "./index.js";
import { ILogger } from "../../shared/libs/logger/index.js";
import { CreateQuizRequest, UpdateQuizRequest } from "./requests.js";
import { Response, Request } from "express";
import { QuestionRdo, QuizRdo } from "./rdo/quiz.rdo.js";
import { fillDTO, getId } from "../../shared/utils/common.js";
import { IConfig } from "../../shared/config/config.interface.js";
import { MainShema } from "../../shared/config/main.shema.js";
import { StatusCodes } from "http-status-codes";
import { PathTransformer } from "../../shared/libs/rest/transform/path-transformer.js";
import { UpdateQuizDto } from "./dto/update-quiz.dto.js";

@injectable()
export class QuizController extends BaseController {
  private readonly pathTransformerMiddleware: PathTransformerMiddleware;
  constructor(
    @inject(Component.Config) private config: IConfig<MainShema>,
    @inject(Component.QuizService) private quizService: IQuizService,
    @inject(Component.Logger) logger: ILogger,
    @inject(Component.PathTransformer) pathTransformer: PathTransformer,
  ) {
    super(logger);
    this.logger.info("Register routes for QuizController…");
    this.pathTransformerMiddleware = new PathTransformerMiddleware(
      pathTransformer,
    );
    this.addRoute({
      method: HttpMethod.Post,
      path: "/",
      handler: this.createQuiz,
      middlewares: [new PrivateRouteMiddleware()],
    });
    this.addRoute({
      method: HttpMethod.Get,
      path: "/",
      handler: this.getAllQuizzes,
      middlewares: [this.pathTransformerMiddleware],
    });
    this.addRoute({
      method: HttpMethod.Get,
      path: "/:id",
      handler: this.getQuizById,
      middlewares: [
        new DocumentExistsMiddleware(quizService, "Quiz", "id"),
        this.pathTransformerMiddleware,
      ],
    });
    this.addRoute({
      method: HttpMethod.Patch,
      path: "/:id",
      middlewares: [new DocumentExistsMiddleware(quizService, "Quiz", "id")],

      handler: this.updateQuiz,
    });
    this.addRoute({
      method: HttpMethod.Delete,
      path: "/:id",
      middlewares: [new DocumentExistsMiddleware(quizService, "Quiz", "id")],
      handler: this.deleteQuiz,
    });
    this.addRoute({
      path: "/:quizId/image",
      method: HttpMethod.Post,
      handler: this.uploadImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new DocumentExistsMiddleware(quizService, "Quiz", "id"),
        new UploadFileMiddleware(
          this.config.get("UPLOAD_DIR"),
          "imageFilename",
        ),
      ],
    });
    this.addRoute({
      path: "/:quizId/:questionId/image",
      method: HttpMethod.Post,
      handler: this.uploadImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new DocumentExistsMiddleware(quizService, "Quiz", "id"),
        new UploadFileMiddleware(
          this.config.get("UPLOAD_DIR"),
          "imageFilename",
        ),
      ],
    });
  }

  public async createQuiz(req: CreateQuizRequest, res: Response) {
    const quizDto: CreateQuizDto = req.body;
    const hostId: string = req.tokenPayload?.id;

    const dataForDatabase = { hostId: hostId, ...quizDto };
    const quiz = await this.quizService.create(dataForDatabase);
    this.created(res, fillDTO(QuizRdo, quiz));
  }

  public async getAllQuizzes(_req: Request, res: Response) {
    const quizzes = await this.quizService.findAll();
    this.ok(res, quizzes);
  }

  public async getQuizById(req: Request, res: Response) {
    const id: string = getId(req.params);
    const quiz = await this.quizService.findById(id);
    this.ok(res, fillDTO(QuizRdo, quiz));
  }

  public async updateQuiz(req: UpdateQuizRequest, res: Response) {
    const quizDto: UpdateQuizDto = req.body;
    const id: string = getId(req.params);
    const hostId: string = req.tokenPayload?.id;

    const dataForDatabase = { hostId: hostId, ...quizDto };
    const quiz = await this.quizService.updateById(id, dataForDatabase);

    this.ok(res, fillDTO(QuizRdo, quiz));
  }

  public async deleteQuiz(req: Request, res: Response) {
    const id: string = getId(req.params);
    const hostId: string = req.tokenPayload?.id;

    const isDeleted = await this.quizService.deleteById(id);

    if (!isDeleted) {
      this.logger.warn("Quiz is not delete!");
    }
    this.noContent(res, isDeleted);
  }

  public async uploadImage({ params, file }: Request, res: Response) {
    if (!file || typeof params.quizId !== "string") {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        "Image is required",
        "QuizController",
      );
    }
    if (typeof params.questionId !== "string") {
      const updateDto = { imageFilename: file.filename };
      const result = await this.quizService.updateById(
        params.quizId,
        updateDto,
      );
      this.created(res, fillDTO(QuizRdo, result));
    } else {
      const updateQuestionDto = { imageFilename: file.filename };
      const result = await this.quizService.updateQuestionById(
        params.quizId,
        params.questionId,
        updateQuestionDto,
      );
      this.created(res, fillDTO(QuestionRdo, result));
    }
  }
}
