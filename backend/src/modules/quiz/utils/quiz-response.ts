import { DocumentType } from "@typegoose/typegoose";
import { QuizEntity } from "../quiz.entity.js";

export function toQuizResponse(quiz: DocumentType<QuizEntity>) {
  return {
    id: quiz._id.toString(),
    hostId: quiz.hostId,
    title: quiz.title,
    imageFilename: quiz.imageFilename,
    questionCount: quiz.questionCount,
    pointsCount: quiz.pointsCount,
    status: quiz.status,
    category: quiz.category,
  };
}

export function toFullQuizResponse(quiz: DocumentType<QuizEntity>) {
  return {
    ...toQuizResponse(quiz),
    questions: quiz.questions.map((q) => ({
      id: q._id.toString(),
      text: q.text,
      points: q.points,
      timeLimit: q.timeLimit,
      imageFilename: q.imageFilename,
      answers: q.answers.map((a) => ({
        id: a._id.toString(),
        text: a.text,
        isCorrect: a.isCorrect,
      })),
    })),
  };
}
