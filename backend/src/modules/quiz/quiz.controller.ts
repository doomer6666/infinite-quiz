import {
  BaseController,
  DocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  PathTransformerMiddleware,
  PrivateRouteMiddleware,
  UploadFileMiddleware,
  ValidateZodMiddleware,
} from "../../shared/libs/rest/index.js";
import { Component } from "../../shared/types/conponent.js";
import { injectable, inject } from "inversify";
import { IQuizService } from "./index.js";
import { ILogger } from "../../shared/libs/logger/index.js";
import { Response, Request } from "express";
import { getId } from "../../shared/utils/common.js";
import { IConfig, MainShema } from "../../shared/config/index.js";
import { StatusCodes } from "http-status-codes";
import { PathTransformer } from "../../shared/libs/rest/transform/path-transformer.js";
import {
  CreateQuizSchema,
  QuizSchema,
  QuizWithQuestionsSchema,
  type UpdateQuizDto,
} from "@infinite-quiz/common";
import { toQuizResponse, toFullQuizResponse } from "./utils/quiz-response.js";

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
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateZodMiddleware(CreateQuizSchema),
      ],
    });

    this.addRoute({
      method: HttpMethod.Get,
      path: "/",
      handler: this.getAllQuizzes,
      middlewares: [this.pathTransformerMiddleware],
    });

    this.addRoute({
      method: HttpMethod.Get,
      path: "/my",
      handler: this.getMyQuizzes,
      middlewares: [
        new PrivateRouteMiddleware(),
        this.pathTransformerMiddleware,
      ],
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
      handler: this.updateQuiz,
      middlewares: [
        new PrivateRouteMiddleware(),
        new DocumentExistsMiddleware(quizService, "Quiz", "id"),
      ],
    });

    this.addRoute({
      method: HttpMethod.Delete,
      path: "/:id",
      handler: this.deleteQuiz,
      middlewares: [
        new PrivateRouteMiddleware(),
        new DocumentExistsMiddleware(quizService, "Quiz", "id"),
      ],
    });

    this.addRoute({
      path: "/:quizId/image",
      method: HttpMethod.Post,
      handler: this.uploadQuizImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new DocumentExistsMiddleware(quizService, "Quiz", "quizId"),
        new UploadFileMiddleware(
          this.config.get("UPLOAD_DIR"),
          "imageFilename",
        ),
      ],
    });

    this.addRoute({
      path: "/:quizId/:questionId/image",
      method: HttpMethod.Post,
      handler: this.uploadQuestionImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new DocumentExistsMiddleware(quizService, "Quiz", "quizId"),
        new UploadFileMiddleware(
          this.config.get("UPLOAD_DIR"),
          "imageFilename",
        ),
      ],
    });
  }

  public async createQuiz(req: Request, res: Response) {
    const quiz = await this.quizService.create(req.body, req.tokenPayload?.id);
    this.created(res, QuizWithQuestionsSchema.parse(toFullQuizResponse(quiz)));
  }

  public async getAllQuizzes(_req: Request, res: Response) {
    const quizzes = await this.quizService.findAll();
    this.ok(
      res,
      quizzes.map((q) => QuizSchema.parse(toQuizResponse(q))),
    );
  }

  public async getQuizById(req: Request, res: Response) {
    const quiz = await this.quizService.findById(getId(req.params));
    if (!quiz) throw new HttpError(StatusCodes.NOT_FOUND, "Quiz not found");
    this.ok(res, QuizWithQuestionsSchema.parse(toFullQuizResponse(quiz)));
  }

  public async updateQuiz(req: Request, res: Response) {
    const quiz = await this.quizService.updateById(
      getId(req.params),
      req.body as UpdateQuizDto,
    );
    if (!quiz) throw new HttpError(StatusCodes.NOT_FOUND, "Quiz not found");
    this.ok(res, QuizWithQuestionsSchema.parse(toFullQuizResponse(quiz)));
  }

  public async deleteQuiz(req: Request, res: Response) {
    const isDeleted = await this.quizService.deleteById(getId(req.params));
    if (!isDeleted)
      this.logger.warn(`Quiz ${getId(req.params)} is not deleted!`);
    this.noContent(res, isDeleted);
  }

  public async uploadQuizImage({ params, file }: Request, res: Response) {
    if (!file || typeof params.quizId !== "string") {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        "Image is required",
        "QuizController",
      );
    }
    const result = await this.quizService.setQuizImage(
      params.quizId,
      file.filename,
    );
    if (!result) throw new HttpError(StatusCodes.NOT_FOUND, "Quiz not found");
    this.created(res, QuizSchema.parse(toQuizResponse(result)));
  }

  public async uploadQuestionImage({ params, file }: Request, res: Response) {
    if (
      !file ||
      typeof params.quizId !== "string" ||
      typeof params.questionId !== "string"
    ) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        "Image is required",
        "QuizController",
      );
    }
    const result = await this.quizService.updateQuestionById(
      params.quizId,
      params.questionId,
      { imageFilename: file.filename },
    );
    if (!result)
      throw new HttpError(StatusCodes.NOT_FOUND, "Question not found");
    this.created(res, result);
  }

  public async getMyQuizzes(req: Request, res: Response) {
    const hostId = req.tokenPayload?.id;
    const quizzes = await this.quizService.findByHostId(hostId);
    this.ok(
      res,
      quizzes.map((q) => QuizSchema.parse(toQuizResponse(q))),
    );
  }
}
