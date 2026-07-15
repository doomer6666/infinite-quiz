import React from "react";
import { MdStars } from "react-icons/md";
import { BsCurrencyBitcoin } from "react-icons/bs";
import type { QuizWizardState } from "@/entities/quiz/index";

interface QuizScoringProps {
  state: QuizWizardState;
  errors: Partial<Record<keyof QuizWizardState, string>>;
  updateState: (patch: Partial<QuizWizardState>) => void;
}

const SCORES = [5, 10, 15, 20, 25, 50, 100];

export const QuizScoring: React.FC<QuizScoringProps> = ({
  state,
  errors,
  updateState,
}) => {
  return (
    <div className="step-content">
      <div className="section-header">
        <div className="section-tag">
          <MdStars size={12} />
          Шаг 3
        </div>
        <div className="section-title">Система баллов</div>
        <div className="section-subtitle">
          Настройте количество баллов за правильные ответы
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <div className="card-title-icon">
            <MdStars size={16} />
          </div>
          Баллы за правильный ответ
        </div>
        <div className="card-subtitle">
          Эти баллы будут автоматически применены к новым вопросам на следующем
          этапе. Итоговый счёт квиза рассчитается автоматически.
        </div>

        <div className="score-options" style={{ marginBottom: 16 }}>
          {SCORES.map((score) => (
            <div
              key={score}
              className={`score-chip ${state.pointsPerQuestion === score ? "selected" : ""}`}
              onClick={() => updateState({ pointsPerQuestion: score })}
            >
              {score}
            </div>
          ))}
        </div>

        <div className="field-wrap" style={{ marginBottom: 0 }}>
          <label className="field-label">Своё значение</label>
          <div className="field-input-wrap">
            <span className="field-icon">
              <BsCurrencyBitcoin size={16} />
            </span>
            <input
              type="number"
              className="field-input"
              placeholder="Введите число"
              min="1"
              max="9999"
              value={state.pointsPerQuestion || ""}
              onChange={(e) =>
                updateState({ pointsPerQuestion: Number(e.target.value) })
              }
            />
          </div>
          {errors.pointsPerQuestion && (
            <span className="field-hint" style={{ color: "var(--error)" }}>
              {errors.pointsPerQuestion}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
