import React, { useRef } from "react";
import {
  BsCardText,
  BsImage,
  BsChevronLeft,
  BsChevronRight,
  BsUpload,
} from "react-icons/bs";
import { QuestionAnswers } from "../../QuestionAnswers/ui/QuestionAnswers";
import type { EditorQuestion } from "@/entities/quiz/index";

interface QuestionEditorCardProps {
  question: EditorQuestion;
  index: number;
  total: number;
  onUpdate: (patch: Partial<EditorQuestion>) => void;
  onAnswerUpdate: (id: string, text: string) => void;
  onToggleCorrect: (id: string) => void;
  onAddAnswer: () => void;
  onDeleteAnswer: (id: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const QuestionEditorCard: React.FC<QuestionEditorCardProps> = ({
  question,
  index,
  total,
  onUpdate,
  onAnswerUpdate,
  onToggleCorrect,
  onAddAnswer,
  onDeleteAnswer,
  onNext,
  onPrev,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpdate({ imageUrl: URL.createObjectURL(file) });
    }
  };

  const removeImage = () => onUpdate({ imageUrl: null });

  return (
    <div id="editor-view">
      <div className="editor-card">
        <div className="editor-card-header">
          <div className="question-number-tag">
            <div className="q-index">{index + 1}</div>
            <span className="q-label">
              Вопрос {index + 1} из {total}
            </span>
          </div>
          <div className="type-tabs">
            <button
              className={`type-tab ${question.type === "text" ? "active" : ""}`}
              onClick={() => onUpdate({ type: "text" })}
            >
              <BsCardText size={13} />
              Текстовый
            </button>
            <button
              className={`type-tab ${question.type === "image" ? "active" : ""}`}
              onClick={() => onUpdate({ type: "image" })}
            >
              <BsImage size={13} />С изображением
            </button>
          </div>
        </div>

        <div className="editor-card-body">
          {question.type === "text" && (
            <div id="text-section">
              <div className="question-input-wrap">
                <textarea
                  className="question-textarea"
                  placeholder="Введите текст вопроса..."
                  maxLength={500}
                  value={question.text}
                  onChange={(e) => onUpdate({ text: e.target.value })}
                />
                <span className="char-count">{question.text.length}/500</span>
              </div>
            </div>
          )}

          {question.type === "image" && (
            <div id="image-section">
              <div className="question-input-wrap">
                <textarea
                  className="question-textarea"
                  placeholder="Введите вопрос к изображению..."
                  maxLength={500}
                  value={question.text}
                  onChange={(e) => onUpdate({ text: e.target.value })}
                />
                <span className="char-count">{question.text.length}/500</span>
              </div>

              <div
                className={`image-upload-zone ${question.imageUrl ? "has-image" : ""}`}
                onClick={() =>
                  !question.imageUrl && fileInputRef.current?.click()
                }
              >
                {question.imageUrl ? (
                  <>
                    <img
                      className="image-preview"
                      src={question.imageUrl}
                      alt=""
                    />
                    <div className="image-overlay">
                      <button
                        className="image-overlay-btn replace"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                      >
                        Заменить
                      </button>
                      <button
                        className="image-overlay-btn remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                      >
                        Удалить
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="upload-icon-wrap">
                      <BsUpload size={24} />
                    </div>
                    <div className="upload-label">Загрузить изображение</div>
                    <div className="upload-sub">
                      Перетащите файл или нажмите для выбора
                    </div>
                    <div className="upload-formats">
                      <span className="fmt-badge">JPG</span>
                      <span className="fmt-badge">PNG</span>
                      <span className="fmt-badge">GIF</span>
                      <span className="fmt-badge">WebP</span>
                    </div>
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          )}

          <QuestionAnswers
            answers={question.answers}
            answerMode={question.answerMode}
            onSetMode={(mode) => onUpdate({ answerMode: mode })}
            onToggleCorrect={onToggleCorrect}
            onChangeText={onAnswerUpdate}
            onAdd={onAddAnswer}
            onDelete={onDeleteAnswer}
          />
        </div>

        <div className="question-footer">
          <div className="footer-top-row">
            <div className="setting-group">
              <span className="setting-label">Время на ответ</span>
              <div className="setting-select-wrap">
                <select
                  className="setting-select"
                  value={question.timeLimit}
                  onChange={(e) =>
                    onUpdate({ timeLimit: Number(e.target.value) })
                  }
                >
                  {[5, 10, 20, 30, 45, 60, 90].map((t) => (
                    <option key={t} value={t}>
                      {t} сек
                    </option>
                  ))}
                </select>
                <span className="setting-select-arrow">
                  <BsChevronLeft
                    size={11}
                    style={{ transform: "rotate(-90deg)" }}
                  />
                </span>
              </div>
            </div>
            <div className="setting-group">
              <span className="setting-label">Баллы за ответ</span>
              <div className="setting-select-wrap">
                <select
                  className="setting-select"
                  value={question.points}
                  onChange={(e) => onUpdate({ points: Number(e.target.value) })}
                >
                  {[5, 10, 15, 20, 25, 50, 100].map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <span className="setting-select-arrow">
                  <BsChevronLeft
                    size={11}
                    style={{ transform: "rotate(-90deg)" }}
                  />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="editor-card-nav">
          <button className="nav-q-btn" disabled={index === 0} onClick={onPrev}>
            <BsChevronLeft size={14} />
            Предыдущий
          </button>
          <span className="nav-q-info">
            {index + 1} / {total}
          </span>
          <button
            className="nav-q-btn"
            disabled={index === total - 1}
            onClick={onNext}
          >
            Следующий
            <BsChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
