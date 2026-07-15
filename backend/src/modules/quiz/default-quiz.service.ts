import { DocumentType, types } from "@typegoose/typegoose";
import { inject, injectable } from "inversify";
import { Component } from "../../shared/types/conponent.js";
import { ILogger } from "../../shared/libs/logger/index.js";
import { QuizEntity } from "./quiz.entity.js";
import { IQuizService } from "./quiz-service.interface.js";
import {
  CreateQuizDto,
  PublishQuizSchema,
  UpdateQuizDto,
} from "@infinite-quiz/common";
import { DEFAULT_STATIC_QUIZ_FILE_NAME } from "../../shared/constants/default-images.js";
import { findQuestion } from "./utils/extract-subdoc.js";
import { StatusCodes } from "http-status-codes";
import { HttpError } from "../../shared/libs/rest/index.js";

@injectable()
export class DefaultQuizService implements IQuizService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.QuizModel)
    private readonly quizModel: types.ModelType<QuizEntity>,
  ) {}

  private recalculate(questions: { points: number }[]) {
    return {
      questionCount: questions.length,
      pointsCount: questions.reduce((sum, q) => sum + (q.points || 0), 0),
    };
  }

  public async exists(id: string): Promise<boolean> {
    return (await this.quizModel.exists({ _id: id })) !== null;
  }

  public async create(
    dto: CreateQuizDto,
    hostId: string,
  ): Promise<DocumentType<QuizEntity>> {
    const { questionCount, pointsCount } = this.recalculate(
      dto.questions ?? [],
    );

    const result = await this.quizModel.create({
      ...dto,
      hostId,
      imageFilename: dto.imageFilename ?? DEFAULT_STATIC_QUIZ_FILE_NAME,
      questionCount,
      pointsCount,
      status: "draft",
    });

    this.logger.info(`New quiz created: ${dto.title}`);
    return result;
  }

  public async findById(id: string): Promise<DocumentType<QuizEntity> | null> {
    return this.quizModel.findOne({ _id: id }).exec();
  }

  public async findByTitle(
    title: string,
  ): Promise<DocumentType<QuizEntity> | null> {
    return this.quizModel.findOne({ title }).exec();
  }

  public async findAll(): Promise<DocumentType<QuizEntity>[]> {
    return this.quizModel.find().select("-questions").exec();
  }

  public async findByHostId(
    hostId: string,
  ): Promise<DocumentType<QuizEntity>[]> {
    return this.quizModel.find({ hostId }).select("-questions").exec();
  }

  public async updateById(
    id: string,
    dto: UpdateQuizDto,
  ): Promise<DocumentType<QuizEntity> | null> {
    const updateData: Record<string, unknown> = { ...dto };

    if (dto.questions) {
      const { questionCount, pointsCount } = this.recalculate(dto.questions);
      updateData.questionCount = questionCount;
      updateData.pointsCount = pointsCount;
    }

    return this.quizModel
      .findOneAndUpdate({ _id: id }, updateData, { new: true })
      .exec();
  }

  public async deleteById(id: string): Promise<boolean> {
    const result = await this.quizModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  public async addQuestion(
    quizId: string,
    dto: {
      text: string;
      points: number;
      timeLimit: number;
      answers: { text: string; isCorrect: boolean }[];
    },
  ): Promise<DocumentType<QuizEntity> | null> {
    return this.quizModel
      .findOneAndUpdate(
        { _id: quizId },
        {
          $push: { questions: dto },
          $inc: { questionCount: 1, pointsCount: dto.points },
        },
        { new: true },
      )
      .exec();
  }

  public async updateQuestionById(
    quizId: string,
    questionId: string,
    dto: {
      text?: string;
      points?: number;
      timeLimit?: number;
      answers?: { text: string; isCorrect: boolean }[];
    },
  ): Promise<DocumentType<QuizEntity> | null> {
    const oldQuiz = await this.quizModel.findById(quizId).exec();
    if (!oldQuiz) return null;

    const oldQuestion = findQuestion(oldQuiz, questionId);
    const oldPoints = oldQuestion?.points ?? 0;
    const newPoints = dto.points ?? oldPoints;
    const pointsDiff = newPoints - oldPoints;

    const setFields: Record<string, unknown> = {};
    if (dto.text !== undefined) setFields["questions.$.text"] = dto.text;
    if (dto.points !== undefined) setFields["questions.$.points"] = dto.points;
    if (dto.timeLimit !== undefined)
      setFields["questions.$.timeLimit"] = dto.timeLimit;
    if (dto.answers !== undefined)
      setFields["questions.$.answers"] = dto.answers;

    const updateQuery: Record<string, unknown> = { $set: setFields };
    if (pointsDiff !== 0) {
      updateQuery.$inc = { pointsCount: pointsDiff };
    }

    return this.quizModel
      .findOneAndUpdate(
        { _id: quizId, "questions._id": questionId },
        updateQuery,
        { new: true },
      )
      .exec();
  }

  public async deleteQuestionById(
    quizId: string,
    questionId: string,
  ): Promise<boolean> {
    const quiz = await this.quizModel.findById(quizId).exec();
    if (!quiz) return false;

    const question = findQuestion(quiz, questionId);
    if (!question) return false;

    const result = await this.quizModel
      .findOneAndUpdate(
        { _id: quizId },
        {
          $pull: { questions: { _id: questionId } },
          $inc: { questionCount: -1, pointsCount: -(question.points ?? 0) },
        },
      )
      .exec();

    return result !== null;
  }

  public async setQuizImage(
    quizId: string,
    filename: string,
  ): Promise<DocumentType<QuizEntity> | null> {
    return this.quizModel
      .findOneAndUpdate(
        { _id: quizId },
        { $set: { imageFilename: filename } },
        { new: true },
      )
      .exec();
  }

  public async updateAnswerById(
    quizId: string,
    questionId: string,
    answerId: string,
    dto: { text?: string; isCorrect?: boolean },
  ): Promise<DocumentType<QuizEntity> | null> {
    return this.quizModel
      .findOneAndUpdate(
        {
          _id: quizId,
          "questions._id": questionId,
          "questions.answers._id": answerId,
        },
        { $set: { "questions.$[q].answers.$[a]": dto } },
        {
          new: true,
          arrayFilters: [{ "q._id": questionId }, { "a._id": answerId }],
        },
      )
      .exec();
  }

  public async publish(id: string): Promise<DocumentType<QuizEntity>> {
    const quiz = await this.quizModel.findById(id).exec();

    if (!quiz) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        "Quiz not found",
        "QuizService",
      );
    }
    const validation = PublishQuizSchema.safeParse(
      quiz.toObject({ virtuals: true }),
    );

    if (!validation.success) {
      const formattedErrors = validation.error.issues.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }));

      throw new HttpError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        "Невозможно опубликовать квиз. Черновик заполнен не полностью.",
        "QuizService",
      );
    }

    const publishedQuiz = await this.quizModel
      .findOneAndUpdate(
        { _id: id },
        { $set: { status: "published" } },
        { new: true, runValidators: true },
      )
      .exec();

    this.logger.info(`Quiz published successfully: ${quiz.title}`);
    return publishedQuiz!;
  }
}
