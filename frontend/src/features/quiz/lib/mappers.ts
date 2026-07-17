import type { EditorQuestion } from "@/entities/quiz/index";
import type { QuizWithQuestionsDto } from "@infinite-quiz/common";

export const mapDtoToEditorQuestions = (
  dto: QuizWithQuestionsDto | undefined,
): EditorQuestion[] => {
  if (!dto?.questions?.length) return [];

  return dto.questions.map((q) => {
    const correctCount = q.answers.filter((a) => a.isCorrect).length;

    return {
      id: q._id,
      text: q.text,
      type: q.imageFilename ? "image" : "text",
      answerMode: correctCount > 1 ? "multi" : "single",
      imageUrl: q.imageFilename ?? null,
      answers: q.answers.map((a) => ({
        id: a._id,
        text: a.text,
        isCorrect: a.isCorrect,
      })),
      timeLimit: q.timeLimit,
      points: q.points,
    };
  });
};
