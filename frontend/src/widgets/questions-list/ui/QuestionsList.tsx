import type { EditorQuestion } from "@/entities/quiz/index";
import React from "react";
import {
  BsPlusLg,
  BsSearch,
  BsFiles,
  BsTrash,
  BsCheck2,
  BsClock,
} from "react-icons/bs";

interface QuestionsListProps {
  questions: EditorQuestion[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onAddClick: () => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const QuestionsList: React.FC<QuestionsListProps> = ({
  questions,
  activeIndex,
  onSelect,
  onAddClick,
  onDuplicate,
  onDelete,
}) => {
  console.log(questions);
  const filledCount = questions.filter((q) => q.text.trim() !== "").length;
  const completionPct = Math.round((filledCount / questions.length) * 100) || 0;
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="questions-list">
      <div className="list-header">
        <div className="list-header-top">
          <span className="list-label">Вопросы</span>
          <button className="add-q-btn" onClick={onAddClick}>
            <BsPlusLg size={12} />
            Добавить
          </button>
        </div>
        <div className="search-wrap">
          <span className="search-icon">
            <BsSearch size={13} />
          </span>
          <input className="search-input" placeholder="Поиск по вопросам..." />
        </div>
      </div>

      <div className="questions-scroll">
        {questions.map((q, i) => (
          <div
            key={q.id}
            className={`q-item ${i === activeIndex ? "active" : ""} ${q.text.trim() === "" ? "q-error" : ""}`}
            onClick={() => onSelect(i)}
          >
            <div className="q-num">{i + 1}</div>
            <div className="q-meta">
              <div className="q-type-row">
                <span
                  className={`q-type-badge ${q.type === "text" ? "badge-text" : "badge-image"}`}
                >
                  {q.type === "text" ? "Текст" : "Фото"}
                </span>
                <span
                  className={`q-type-badge ${q.answerMode === "single" ? "badge-single" : "badge-multi"}`}
                >
                  {q.answerMode === "single" ? "Один" : "Много"}
                </span>
              </div>
              <div
                className={`q-preview ${q.text.trim() === "" ? "empty" : ""}`}
              >
                {q.text.trim() === "" ? "Вопрос не заполнен" : q.text}
              </div>
            </div>
            <div className="q-actions">
              <button
                className="q-action-btn"
                title="Дублировать"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(q.id);
                }}
              >
                <BsFiles size={13} />
              </button>
              <button
                className="q-action-btn del"
                title="Удалить"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(q.id);
                }}
              >
                <BsTrash size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="list-footer">
        <div className="completion-row">
          <span className="completion-label">Готово</span>
          <span className="completion-pct">{completionPct}%</span>
        </div>
        <div className="completion-bar">
          <div
            className="completion-fill"
            style={{ width: `${completionPct}%` }}
          ></div>
        </div>
        <div className="footer-chips">
          <div className="footer-chip">
            <BsPlusLg size={11} />
            <span>{questions.length}</span> вопр.
          </div>
          <div className="footer-chip">
            <BsCheck2 size={11} />
            <span>{totalPoints}</span> балл.
          </div>
          <div className="footer-chip">
            <BsClock size={11} />~
            <span>
              {Math.ceil(questions.reduce((s, q) => s + q.timeLimit, 0) / 60)}
            </span>
            м
          </div>
        </div>
      </div>
    </div>
  );
};
