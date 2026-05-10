import { DocumentType } from "@typegoose/typegoose";
import { CreateQuizDto } from "./dto/create-quiz.dto.js";
import { QuizEntity } from "./quiz.entity.js";

export interface IQuizService {
  create(dto: CreateQuizDto): Promise<DocumentType<QuizEntity>>;
  findById(id: string): Promise<DocumentType<QuizEntity> | null>;
  findByTitle(title: string): Promise<DocumentType<QuizEntity> | null>;
  findAll(): Promise<DocumentType<QuizEntity>[] | null>;
  updateById(
    id: string,
    dto: CreateQuizDto,
  ): Promise<DocumentType<QuizEntity> | null>;
  deleteById(id: string): Promise<boolean>;
}
