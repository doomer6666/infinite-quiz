import type {
  EditorQuestion,
  QuestionType,
  AnswerMode,
} from "@/entities/quiz/index";
import { useState } from "react";
import { createEmptyQuestion, genId } from "../lib/factory";

export const useQuestionsEditor = (
  initialQuestions: EditorQuestion[],
  defaultPoints: number,
  defaultTime: number,
) => {
  const [questions, setQuestions] =
    useState<EditorQuestion[]>(initialQuestions);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeQuestion = questions[activeIndex];

  const updateQuestion = (id: string, patch: Partial<EditorQuestion>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...patch } : q)),
    );
  };

  const handleAnswerTextChange = (qId: string, aId: string, text: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? {
              ...q,
              answers: q.answers.map((a) =>
                a.id === aId ? { ...a, text } : a,
              ),
            }
          : q,
      ),
    );
  };

  const handleToggleCorrect = (qId: string, aId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        if (q.answerMode === "single") {
          return {
            ...q,
            answers: q.answers.map((a) => ({ ...a, isCorrect: a.id === aId })),
          };
        }
        return {
          ...q,
          answers: q.answers.map((a) =>
            a.id === aId ? { ...a, isCorrect: !a.isCorrect } : a,
          ),
        };
      }),
    );
  };

  const handleAddAnswer = (qId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId || q.answers.length >= 8) return q;
        return {
          ...q,
          answers: [...q.answers, { id: genId(), text: "", isCorrect: false }],
        };
      }),
    );
  };

  const handleDeleteAnswer = (qId: string, aId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId || q.answers.length <= 2) return q;
        return { ...q, answers: q.answers.filter((a) => a.id !== aId) };
      }),
    );
  };

  const handleAddQuestion = (type: QuestionType, mode: AnswerMode) => {
    const newQ = createEmptyQuestion(defaultPoints, defaultTime);
    Object.assign(newQ, { type, answerMode: mode });

    setQuestions((prev) => [...prev, newQ]);
    setActiveIndex(questions.length);
  };

  const handleDuplicate = (id: string) => {
    const indexToInsert = questions.findIndex((q) => q.id === id);
    if (indexToInsert === -1) return;

    const qToDup = questions[indexToInsert];
    const newQ: EditorQuestion = {
      ...qToDup,
      id: genId(),
      answers: qToDup.answers.map((a) => ({ ...a, id: genId() })),
    };

    const newQuestions = [...questions];
    newQuestions.splice(indexToInsert + 1, 0, newQ);

    setQuestions(newQuestions);
    setActiveIndex(indexToInsert + 1);
  };

  const handleDelete = (id: string) => {
    if (questions.length <= 1) return;
    const index = questions.findIndex((q) => q.id === id);
    const newQuestions = questions.filter((q) => q.id !== id);
    setQuestions(newQuestions);

    setActiveIndex((prev) => {
      if (prev > index) return prev - 1;
      if (prev >= newQuestions.length) return newQuestions.length - 1;
      return prev;
    });
  };

  return {
    questions,
    activeIndex,
    activeQuestion,
    setActiveIndex,
    updateQuestion,
    handleAnswerTextChange,
    handleToggleCorrect,
    handleAddAnswer,
    handleDeleteAnswer,
    handleAddQuestion,
    handleDuplicate,
    handleDelete,
  };
};
