import { AddQuestionPanel } from "@/features/quiz/AddQuestionPanel/ui/AddQuestionPanel";
import { QuestionEditorCard } from "@/features/quiz/QuestionEditorCard/ui/QuestionEditorCard";
import { EditorTopBar } from "@/widgets/editor-topbar/ui/EditorTopBar";
import { QuestionsList } from "@/widgets/questions-list/ui/QuestionsList";
import { EditorRightPanel } from "@/widgets/right-panel/ui/EditorRightPanel";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./QuizQuestionsPage.css";
import { useQuestionsEditor } from "@/features/quiz/index";
import {
  useUpdateQuizMutation,
  usePublishQuizMutation,
  useGetQuizQuery,
  type EditorQuestion,
} from "@/entities/quiz/index";
import type { UpdateQuizDto, Question, Answer } from "@infinite-quiz/common";
import { mapDtoToEditorQuestions } from "@/features/quiz/lib/mappers";
import { createEmptyQuestion } from "@/features/quiz/lib/factory";

export const QuestionsView: React.FC<{
  id?: string;
  quizTitle: string;
  initialQuestions: EditorQuestion[];
  defaultPoints: number;
  defaultTime: number;
}> = ({ id, quizTitle, initialQuestions, defaultPoints, defaultTime }) => {
  const [updateQuiz] = useUpdateQuizMutation();
  const [publishQuiz] = usePublishQuizMutation();
  const nav = useNavigate();

  const [showAddPanel, setShowAddPanel] = useState(false);
  const editor = useQuestionsEditor(
    initialQuestions,
    defaultPoints,
    defaultTime,
  );
  const buildUpdateDto = (): UpdateQuizDto => {
    const questionsDto: Question[] = editor.questions.map((q) => {
      const answers: Answer[] = q.answers.map((a) => {
        const answer: Answer = {
          text: a.text,
          isCorrect: a.isCorrect,
        };
        if (!a.id.startsWith("q-")) {
          answer._id = a.id;
        }
        return answer;
      });

      const question: Question = {
        text: q.text,
        points: q.points,
        timeLimit: q.timeLimit,
        answers,
      };

      if (!q.id.startsWith("q-")) {
        question._id = q.id;
      }

      return question;
    });

    return { questions: questionsDto };
  };
  const handleSaveDraft = async () => {
    try {
      if (id) {
        const dto = buildUpdateDto();
        console.log(dto);

        await updateQuiz({ id: id, body: dto }).unwrap();
        nav("/quizzes");
      }
    } catch {
      /* empty */
    }
  };

  const handlePublish = async () => {
    try {
      if (id) {
        const dto = buildUpdateDto();
        await updateQuiz({ id: id, body: dto }).unwrap();
        await publishQuiz(id).unwrap();
        nav("/quizzes");
      }
    } catch {
      /* empty */
    }
  };

  return (
    <>
      <EditorTopBar
        title={quizTitle}
        questionsCount={editor.questions.length}
        onPublish={handlePublish}
        onSaveDraft={handleSaveDraft}
      />

      <div className="layout">
        <QuestionsList
          questions={editor.questions}
          activeIndex={editor.activeIndex}
          onSelect={editor.setActiveIndex}
          onAddClick={() => setShowAddPanel(true)}
          onDuplicate={editor.handleDuplicate}
          onDelete={editor.handleDelete}
        />

        <div className="editor-area">
          {showAddPanel ? (
            <AddQuestionPanel
              onClose={() => setShowAddPanel(false)}
              onAdd={(type, mode) => {
                editor.handleAddQuestion(type, mode);
                setShowAddPanel(false);
              }}
            />
          ) : (
            <QuestionEditorCard
              question={editor.activeQuestion}
              index={editor.activeIndex}
              total={editor.questions.length}
              onUpdate={(patch) =>
                editor.updateQuestion(editor.activeQuestion.id, patch)
              }
              onAnswerUpdate={(aId, text) =>
                editor.handleAnswerTextChange(
                  editor.activeQuestion.id,
                  aId,
                  text,
                )
              }
              onToggleCorrect={(aId) =>
                editor.handleToggleCorrect(editor.activeQuestion.id, aId)
              }
              onAddAnswer={() =>
                editor.handleAddAnswer(editor.activeQuestion.id)
              }
              onDeleteAnswer={(aId) =>
                editor.handleDeleteAnswer(editor.activeQuestion.id, aId)
              }
              onNext={() =>
                editor.setActiveIndex((prev) =>
                  Math.min(prev + 1, editor.questions.length - 1),
                )
              }
              onPrev={() =>
                editor.setActiveIndex((prev) => Math.max(prev - 1, 0))
              }
            />
          )}
        </div>

        <EditorRightPanel questions={editor.questions} />
      </div>
    </>
  );
};

export const QuizQuestionsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const stateDefaults =
    (location.state as {
      pointsPerQuestion?: number;
      timePerQuestion?: number;
    }) || {};

  const { data: existingQuiz, isLoading } = useGetQuizQuery(id!, {
    skip: !id,
  });

  if (isLoading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Загрузка редактора вопросов...
      </div>
    );
  }

  const defaultPoints =
    stateDefaults.pointsPerQuestion ??
    existingQuiz?.questions?.[0]?.points ??
    10;
  const defaultTime =
    stateDefaults.timePerQuestion ??
    existingQuiz?.questions?.[0]?.timeLimit ??
    20;

  const mappedQuestions = mapDtoToEditorQuestions(existingQuiz);

  const initialQuestions =
    mappedQuestions.length > 0
      ? mappedQuestions
      : [createEmptyQuestion(defaultPoints, defaultTime)];

  return (
    <QuestionsView
      id={id}
      quizTitle={existingQuiz?.title || "Новый квиз"}
      initialQuestions={initialQuestions}
      defaultPoints={defaultPoints}
      defaultTime={defaultTime}
    />
  );
};
