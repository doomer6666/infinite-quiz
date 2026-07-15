import type { QuizWizardState } from "@/entities/quiz/index";
import { type QuizCategory, QuizCategoryEnum } from "@infinite-quiz/common";
import React from "react";
import { BsCheckCircle, BsGrid3X3Gap, BsCheck2 } from "react-icons/bs";
import {
  MdScience,
  MdHistory,
  MdDevices,
  MdPublic,
  MdMovie,
  MdSportsSoccer,
} from "react-icons/md";

interface QuizCategoriesProps {
  state: QuizWizardState;
  errors: Partial<Record<keyof QuizWizardState, string>>;
  updateState: (patch: Partial<QuizWizardState>) => void;
}

const CATEGORIES: {
  label: string;
  value: QuizCategory;
  icon: React.ReactNode;
}[] = [
  {
    label: "Наука",
    value: QuizCategoryEnum.science,
    icon: <MdScience size={18} color="#0077FF" />,
  },
  {
    label: "История",
    value: QuizCategoryEnum.history,
    icon: <MdHistory size={18} color="#0077FF" />,
  },
  {
    label: "Технологии",
    value: QuizCategoryEnum.technologies,
    icon: <MdDevices size={18} color="#3D5A80" />,
  },
  {
    label: "География",
    value: QuizCategoryEnum.geography,
    icon: <MdPublic size={18} color="#3D5A80" />,
  },
  {
    label: "Кино",
    value: QuizCategoryEnum.movie,
    icon: <MdMovie size={18} color="#3D5A80" />,
  },
  {
    label: "Спорт",
    value: QuizCategoryEnum.sports,
    icon: <MdSportsSoccer size={18} color="#3D5A80" />,
  },
];

export const QuizCategories: React.FC<QuizCategoriesProps> = ({
  state,
  errors,
  updateState,
}) => {
  return (
    <div className="step-content">
      <div className="section-header">
        <div className="section-tag">
          <BsCheckCircle size={12} />
          Шаг 2
        </div>
        <div className="section-title">Категория квиза</div>
        <div className="section-subtitle">
          Выберите одну категорию для вашего квиза
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <div className="card-title-icon">
            <BsGrid3X3Gap size={16} />
          </div>
          Выбор категории
          <span className="badge-required">Обязательно</span>
        </div>
        <div className="card-subtitle">
          Выберите тему, которая будет охватывать вопросы вашего квиза
        </div>

        <div className="categories-grid">
          {CATEGORIES.map((cat) => {
            const isSelected = state.category === cat.value;
            return (
              <div
                key={cat.value}
                className={`category-chip ${isSelected ? "selected" : ""}`}
                onClick={() => updateState({ category: cat.value })}
                style={
                  errors.category && !isSelected
                    ? { borderColor: "var(--error)" }
                    : {}
                }
              >
                <div className="category-chip-icon">{cat.icon}</div>
                <span className="category-chip-label">{cat.label}</span>
                <div className="category-check">
                  {isSelected && <BsCheck2 size={8} color="white" />}
                </div>
              </div>
            );
          })}
        </div>
        {errors.category && (
          <span
            className="field-hint"
            style={{
              color: "var(--error)",
              marginTop: "12px",
              display: "block",
            }}
          >
            {errors.category}
          </span>
        )}
      </div>
    </div>
  );
};
