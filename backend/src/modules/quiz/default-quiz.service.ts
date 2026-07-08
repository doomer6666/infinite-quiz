import { DocumentType, types } from "@typegoose/typegoose";
import { CreateQuizDto } from "./dto/create-quiz.dto.js";
import { IQuizService } from "./quiz-service.interface.js";
import { QuizEntity } from "./quiz.entity.js";
import { inject, injectable } from "inversify";
import { Component } from "../../shared/types/conponent.js";
import { ILogger } from "../../shared/libs/logger/index.js";

@injectable()
export class DefaultQuizService implements IQuizService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.QuizModel)
    private readonly quizModel: types.ModelType<QuizEntity>,
  ) {}

  public async create(dto: CreateQuizDto): Promise<DocumentType<QuizEntity>> {
    const result = await this.quizModel.create(dto);
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
    return this.quizModel.findOneAndUpdate({ id }, dto, { new: true }).exec();
  }

  public async deleteById(id: string): Promise<boolean> {
    const result = await this.quizModel.deleteOne({ id }).exec();
    return result.deletedCount > 0;
  }

  findByHostId(hostId: string): Promise<DocumentType<QuizEntity>[] | null> {
    throw new Error("Method not implemented.");
  }
}
