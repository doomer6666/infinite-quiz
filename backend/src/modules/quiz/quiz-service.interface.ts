import { DocumentType } from "@typegoose/typegoose";
import { CreateQuestionDto, CreateQuizDto } from "./dto/create-quiz.dto.js";
import { AnswerEntity, QuestionEntity, QuizEntity } from "./quiz.entity.js";
import {
  UpdateAnswerDto,
  UpdateQuestionDto,
  UpdateQuizDto,
} from "./dto/update-quiz.dto.js";

export interface IQuizService {
  exists(id: string): Promise<boolean>;
  create(dto: CreateQuizDto): Promise<DocumentType<QuizEntity>>;
  findById(id: string): Promise<DocumentType<QuizEntity> | null>;
  findByHostId(hostId: string): Promise<DocumentType<QuizEntity>[] | null>;
  findByTitle(title: string): Promise<DocumentType<QuizEntity> | null>;
  findAll(): Promise<DocumentType<QuizEntity>[] | null>;
  updateById(
    id: string,
    dto: UpdateQuizDto,
  ): Promise<DocumentType<QuizEntity> | null>;
  deleteById(id: string): Promise<boolean>;
  updateQuestionById(
    quizId: string,
    questionId: string,
    dto: UpdateQuestionDto,
  ): Promise<QuestionEntity | null>;
  deleteQuestionById(quizId: string, questionId: string): Promise<boolean>;
}
