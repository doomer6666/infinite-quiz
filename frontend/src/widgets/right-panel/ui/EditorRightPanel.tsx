import type { EditorQuestion } from "@/entities/quiz/index";
import React from "react";
import { BsCheck2, BsInfoCircle } from "react-icons/bs";

interface EditorRightPanelProps {
  questions: EditorQuestion[];
}

export const EditorRightPanel: React.FC<EditorRightPanelProps> = ({
  questions,
}) => {
  const textCount = questions.filter((q) => q.type === "text").length;
  const imageCount = questions.filter((q) => q.type === "image").length;
  const singleCount = questions.filter((q) => q.answerMode === "single").length;
  const multiCount = questions.filter((q) => q.answerMode === "multi").length;

  return (
    <div className="right-panel">
      <div className="rpanel-card">
        <div className="rpanel-title">
          <div className="rpanel-title-icon">
            <BsCheck2 size={12} />
          </div>
          Типы вопросов
        </div>
        <div className="types-breakdown">
          <div className="type-row">
            <div className="type-dot type-dot-text"></div>
            <span className="type-row-label">Текстовые</span>
            <span className="type-row-val">{textCount}</span>
          </div>
          <div className="type-row">
            <div className="type-dot type-dot-image"></div>
            <span className="type-row-label">С изображением</span>
            <span className="type-row-val">{imageCount}</span>
          </div>
          <div className="type-row">
            <div className="type-dot type-dot-single"></div>
            <span className="type-row-label">Один ответ</span>
            <span className="type-row-val">{singleCount}</span>
          </div>
          <div className="type-row">
            <div className="type-dot type-dot-multi"></div>
            <span className="type-row-label">Несколько ответов</span>
            <span className="type-row-val">{multiCount}</span>
          </div>
        </div>
      </div>

      <div className="tips-card">
        <div className="tips-title">
          <BsInfoCircle size={12} color="#0055CC" />
          Советы
        </div>
        <div className="tip-item">
          <div className="tip-dot">
            <BsCheck2 size={7} color="#0077FF" />
          </div>
          <span className="tip-text">
            Всегда отмечайте правильный ответ перед переходом к следующему
            вопросу
          </span>
        </div>
        <div className="tip-item">
          <div className="tip-dot">
            <BsCheck2 size={7} color="#0077FF" />
          </div>
          <span className="tip-text">
            4 варианта ответа — оптимально для баланса сложности
          </span>
        </div>
        <div className="tip-item">
          <div className="tip-dot">
            <BsCheck2 size={7} color="#0077FF" />
          </div>
          <span className="tip-text">
            Изображения делают квиз нагляднее и интереснее
          </span>
        </div>
        <div className="tip-item">
          <div className="tip-dot">
            <BsCheck2 size={7} color="#0077FF" />
          </div>
          <span className="tip-text">
            Подсказки помогают участникам лучше запомнить материал
          </span>
        </div>
      </div>
    </div>
  );
};
