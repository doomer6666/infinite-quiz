import React from "react";
import { BsCheck2 } from "react-icons/bs";
import { QUIZ_STEPS } from "../../../entities/quiz/model/types";

interface SidebarStepsProps {
  currentStep: number;
  validSteps: number[];
  onStepClick: (step: number) => void;
}

export const SidebarSteps: React.FC<SidebarStepsProps> = ({
  currentStep,
  validSteps,
  onStepClick,
}) => {
  return (
    <div className="sidebar-steps">
      <div className="steps-label">Шаги создания</div>

      {QUIZ_STEPS.map((step, i) => {
        const isDone = validSteps.includes(step.id) && step.id < currentStep;
        const isActive = step.id === currentStep;

        const canClick = validSteps.includes(step.id) || step.id <= currentStep;

        return (
          <React.Fragment key={step.id}>
            <div
              className={`step-item ${isDone ? "done" : ""} ${isActive ? "active" : ""}`}
              onClick={() => canClick && onStepClick(step.id)}
              style={{
                cursor: canClick ? "pointer" : "not-allowed",
                opacity: canClick ? 1 : 0.5,
              }}
            >
              <div className="step-num">
                {isDone ? <BsCheck2 size={12} color="white" /> : step.id}
              </div>
              <div className="step-info">
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.desc}</div>
              </div>
            </div>
            {i < QUIZ_STEPS.length - 1 && (
              <div
                className={`step-connector ${isDone ? "done-line" : ""}`}
              ></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
