import { DocumentType, types } from "@typegoose/typegoose";
import { CreateQuestionDto, CreateQuizDto } from "./dto/create-quiz.dto.js";
import { IQuizService } from "./quiz-service.interface.js";
import { AnswerEntity, QuestionEntity, QuizEntity } from "./quiz.entity.js";
import { inject, injectable } from "inversify";
import { Component } from "../../shared/types/conponent.js";
import { ILogger } from "../../shared/libs/logger/index.js";
import { UpdateAnswerDto, UpdateQuestionDto } from "./dto/update-quiz.dto.js";
import { DEFAULT_STATIC_QUIZ_FILE_NAME } from "../../shared/constants/default-images.js";

@injectable()
export class DefaultQuizService implements IQuizService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.QuizModel)
    private readonly quizModel: types.ModelType<QuizEntity>,
  ) {}
  public async exists(id: string): Promise<boolean> {
    return (await this.quizModel.exists({ _id: id })) !== null;
  }

  public async create(dto: CreateQuizDto): Promise<DocumentType<QuizEntity>> {
    const result = await this.quizModel.create({
      ...dto,
      imageFilename: dto.imageFilename ?? DEFAULT_STATIC_QUIZ_FILE_NAME,
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

  public async findAll(): Promise<DocumentType<QuizEntity>[] | null> {
    return this.quizModel.find().exec();
  }

  public async updateById(
    id: string,
    dto: CreateQuizDto,
  ): Promise<DocumentType<QuizEntity> | null> {
    return this.quizModel
      .findOneAndUpdate({ _id: id }, dto, { new: true })
      .exec();
  }

  public async deleteById(id: string): Promise<boolean> {
    const result = await this.quizModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  public async findByHostId(
    hostId: string,
  ): Promise<DocumentType<QuizEntity>[] | null> {
    return this.quizModel.find({ hostId }).exec();
  }

  public async updateQuestionById(
    quizId: string,
    questionId: string,
    dto: UpdateQuestionDto,
  ): Promise<QuestionEntity | null> {
    const quiz = await this.quizModel
      .findOneAndUpdate(
        { _id: quizId, "questions._id": questionId },
        { $set: { questions: { _id: questionId } } },
        {
          new: true,
          projection: {
            questions: { $elemMatch: { _id: questionId } },
          },
        },
      )
      .exec();

    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
      return null;
    }

    return quiz.questions[0];
  }

  public async addQuestion(
    quizId: string,
    dto: CreateQuestionDto,
  ): Promise<QuestionEntity | null> {
    const quiz = await this.quizModel
      .findOneAndUpdate(
        { _id: quizId },
        { $push: { questions: dto } },
        {
          new: true,
        },
      )
      .exec();
    return quiz?.questions[-1] ?? null;
  }

  public async deleteQuestionById(
    quizId: string,
    questionId: string,
  ): Promise<boolean> {
    const result = await this.quizModel
      .findOneAndUpdate(
        { _id: quizId },
        { $pull: { questions: { _id: questionId } } },
      )
      .exec();

    return result !== null;
  }

  public async updateAnswerById(
    quizId: string,
    questionId: string,
    answerId: string,
    dto: UpdateAnswerDto,
  ): Promise<AnswerEntity | null> {
    const quiz = await this.quizModel
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
          projection: {
            questions: {
              $elemMatch: { _id: questionId },
            },
          },
        },
      )
      .exec();

    if (!quiz?.questions?.length) {
      return null;
    }

    const question = quiz.questions[0];
    const answer = question.answers.find(
      (a) => a._id && a._id.toString() === answerId,
    );
    return answer ?? null;
  }
}
