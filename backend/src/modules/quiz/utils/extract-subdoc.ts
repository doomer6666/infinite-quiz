import { DocumentType } from "@typegoose/typegoose";
import { QuizEntity, QuestionEntity, AnswerEntity } from "../quiz.entity.js";

export function findQuestion(
  quiz: DocumentType<QuizEntity>,
  questionId: string,
): QuestionEntity | null {
  return quiz.questions.find((q) => q._id?.toString() === questionId) ?? null;
}

export function findAnswer(
  question: QuestionEntity,
  answerId: string,
): AnswerEntity | null {
  return question.answers.find((a) => a._id?.toString() === answerId) ?? null;
}

export function lastQuestion(
  quiz: DocumentType<QuizEntity>,
): QuestionEntity | null {
  return quiz.questions[quiz.questions.length - 1] ?? null;
}
