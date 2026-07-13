import type {
  CreateQuizDto,
  UpdateQuizDto,
  CreateQuestionDto,
  UpdateQuestionDto,
  UpdateAnswerDto,
} from "@infinite-quiz/common";
import { DocumentType } from "@typegoose/typegoose";
import { QuizEntity } from "./quiz.entity.js";

export interface IQuizService {
  exists(id: string): Promise<boolean>;
  create(dto: CreateQuizDto, hostId: string): Promise<DocumentType<QuizEntity>>;
  findById(id: string): Promise<DocumentType<QuizEntity> | null>;
  findByTitle(title: string): Promise<DocumentType<QuizEntity> | null>;
  findAll(): Promise<DocumentType<QuizEntity>[]>;
  findByHostId(hostId: string): Promise<DocumentType<QuizEntity>[]>;
  updateById(
    id: string,
    dto: UpdateQuizDto,
  ): Promise<DocumentType<QuizEntity> | null>;
  deleteById(id: string): Promise<boolean>;
  addQuestion(
    quizId: string,
    dto: CreateQuestionDto,
  ): Promise<DocumentType<QuizEntity> | null>;
  updateQuestionById(
    quizId: string,
    questionId: string,
    dto: UpdateQuestionDto,
  ): Promise<DocumentType<QuizEntity> | null>;
  deleteQuestionById(quizId: string, questionId: string): Promise<boolean>;
  setQuizImage(
    quizId: string,
    filename: string,
  ): Promise<DocumentType<QuizEntity> | null>;
  updateAnswerById(
    quizId: string,
    questionId: string,
    answerId: string,
    dto: UpdateAnswerDto,
  ): Promise<DocumentType<QuizEntity> | null>;
}
