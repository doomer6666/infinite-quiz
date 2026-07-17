import type { EditorAnswer } from "@/entities/quiz/index";

import { BsCheck2, BsGripVertical, BsTrash } from "react-icons/bs";

const LETTERS = ["А", "Б", "В", "Г", "Д", "Е", "Ж", "З"];

interface AnswerItemProps {
  index: number;
  answer: EditorAnswer;
  isMulti: boolean;
  canDelete: boolean;
  onToggleCorrect: () => void;
  onChangeText: (text: string) => void;
  onDelete: () => void;
}

export const AnswerItem: React.FC<AnswerItemProps> = ({
  index,
  answer,
  isMulti,
  canDelete,
  onToggleCorrect,
  onChangeText,
  onDelete,
}) => {
  const itemClass = `answer-item ${answer.isCorrect ? (isMulti ? "correct-multi" : "correct") : ""}`;

  return (
    <div className={itemClass} data-correct={answer.isCorrect}>
      <div
        className={`answer-marker ${isMulti ? "multi-marker" : ""}`}
        onClick={onToggleCorrect}
      >
        {answer.isCorrect ? (
          <BsCheck2 size={12} color="white" />
        ) : (
          LETTERS[index] || index + 1
        )}
      </div>
      <input
        className="answer-input"
        value={answer.text}
        placeholder="Вариант ответа"
        onChange={(e) => onChangeText(e.target.value)}
      />
      <button className="answer-correct-btn" onClick={onToggleCorrect}>
        <BsCheck2 size={11} />
        Верный
      </button>
      <div className="answer-drag">
        <BsGripVertical size={14} />
      </div>
      <button
        className="answer-delete"
        onClick={onDelete}
        disabled={!canDelete}
        style={{ opacity: canDelete ? 1 : 0.3 }}
      >
        <BsTrash size={13} />
      </button>
    </div>
  );
};
