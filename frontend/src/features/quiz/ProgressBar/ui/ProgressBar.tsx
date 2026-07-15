import { QUIZ_STEPS } from "@/entities/quiz/index";
import React from "react";

interface ProgressBarProps {
  currentStep: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  return (
    <div className="progress-bar-wrap">
      <div className="progress-steps">
        {QUIZ_STEPS.map((step) => (
          <div
            key={step.id}
            className={`prog-step ${currentStep > step.id ? "done" : ""} ${currentStep === step.id ? "active" : ""}`}
          />
        ))}
      </div>
      <div className="progress-label">
        Шаг{" "}
        <span>
          {currentStep} из {QUIZ_STEPS.length}
        </span>{" "}
        — <span>{QUIZ_STEPS[currentStep - 1]?.name}</span>
      </div>
    </div>
  );
};
