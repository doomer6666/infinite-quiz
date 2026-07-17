import { BsPlusLg, BsCheck2, BsCircle, BsGrid3X3Gap } from "react-icons/bs";
import { AnswerItem } from "./AnswerItem";
import type { AnswerMode, EditorAnswer } from "@/entities/quiz/index";

interface QuestionAnswersProps {
  answers: EditorAnswer[];
  answerMode: AnswerMode;
  onSetMode: (mode: AnswerMode) => void;
  onToggleCorrect: (id: string) => void;
  onChangeText: (id: string, text: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

export const QuestionAnswers: React.FC<QuestionAnswersProps> = ({
  answers,
  answerMode,
  onSetMode,
  onToggleCorrect,
  onChangeText,
  onAdd,
  onDelete,
}) => {
  const hasCorrect = answers.some((a) => a.isCorrect);

  return (
    <>
      <div className="answer-section-header">
        <span className="answer-section-label">Варианты ответов</span>
        <div className="answer-mode-tabs">
          <button
            className={`answer-mode-tab ${answerMode === "single" ? "active" : ""}`}
            onClick={() => onSetMode("single")}
          >
            <BsCircle size={13} />
            Один
          </button>
          <button
            className={`answer-mode-tab ${answerMode === "multi" ? "active" : ""}`}
            onClick={() => onSetMode("multi")}
          >
            <BsGrid3X3Gap size={13} />
            Несколько
          </button>
        </div>
      </div>

      <div className="answers-list">
        {answers.map((ans, i) => (
          <AnswerItem
            key={ans.id}
            index={i}
            answer={ans}
            isMulti={answerMode === "multi"}
            canDelete={answers.length > 2}
            onToggleCorrect={() => onToggleCorrect(ans.id)}
            onChangeText={(text) => onChangeText(ans.id, text)}
            onDelete={() => onDelete(ans.id)}
          />
        ))}
      </div>

      <button
        className="add-answer-btn"
        onClick={onAdd}
        disabled={answers.length >= 8}
      >
        <BsPlusLg size={15} />
        Добавить вариант ответа
      </button>

      <div
        className="correct-hint"
        style={{ display: hasCorrect ? "flex" : "none" }}
      >
        <BsCheck2
          size={15}
          color="#1A9E5C"
          style={{ flexShrink: 0, marginTop: "1px" }}
        />
        <span className="correct-hint-text">
          Правильный ответ выбран. Нажмите на маркер или «Верный» рядом с другим
          вариантом, чтобы изменить выбор.
        </span>
      </div>
    </>
  );
};
