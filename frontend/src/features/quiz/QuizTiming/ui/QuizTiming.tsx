import type { QuizWizardState } from "@/entities/quiz/index";
import React from "react";
import { MdAccessTime, MdTimer } from "react-icons/md";

interface QuizTimingProps {
  state: QuizWizardState;
  errors: Partial<Record<keyof QuizWizardState, string>>;
  updateState: (patch: Partial<QuizWizardState>) => void;
}

const TIMES = [5, 10, 20, 30, 45, 60, 90, 120];

export const QuizTiming: React.FC<QuizTimingProps> = ({
  state,
  errors,
  updateState,
}) => {
  return (
    <div className="step-content">
      <div className="section-header">
        <div className="section-tag">
          <MdAccessTime size={12} />
          Шаг 4
        </div>
        <div className="section-title">Настройка времени</div>
        <div className="section-subtitle">
          Задайте ограничения по времени на вопросы
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <div className="card-title-icon">
            <MdTimer size={16} />
          </div>
          Время на один вопрос
        </div>
        <div className="card-subtitle">
          Сколько секунд даётся участнику на ответ
        </div>

        <div className="time-options">
          {TIMES.map((time) => (
            <div
              key={time}
              className={`time-chip ${state.timePerQuestion === time ? "selected" : ""}`}
              onClick={() => updateState({ timePerQuestion: time })}
            >
              <div className="time-chip-val">{time}</div>
              <div className="time-chip-unit">сек</div>
            </div>
          ))}
        </div>

        <div className="field-wrap" style={{ marginTop: 16, marginBottom: 0 }}>
          <label className="field-label">Своё значение (секунды)</label>
          <div className="field-input-wrap">
            <span className="field-icon">
              <MdTimer size={16} />
            </span>
            <input
              type="number"
              className="field-input"
              placeholder="От 5 до 600"
              min="5"
              max="600"
              value={state.timePerQuestion || ""}
              onChange={(e) =>
                updateState({ timePerQuestion: Number(e.target.value) })
              }
            />
          </div>
          {errors.timePerQuestion && (
            <span className="field-hint" style={{ color: "var(--error)" }}>
              {errors.timePerQuestion}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
