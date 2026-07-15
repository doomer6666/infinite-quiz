import "./QuizEditorPage.css";
import {
  useQuizEditorWizard,
  QuizBasicInfo,
  QuizCategories,
  QuizScoring,
  QuizTiming,
  ProgressBar,
  NavigationActions,
} from "@/features/index";
import { RightPanel } from "@/widgets/right-panel/ui/RightPanel";
import { SidebarSteps } from "@/widgets/sidebar-steps/ui/SidebarSteps";
import { TopBar } from "@/widgets/topbar/ui/EditTopbar";
import { useNavigate } from "react-router-dom";

export const QuizEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    step,
    validSteps,
    state,
    errors,
    updateState,
    next,
    back,
    goTo,
    submitWizard,
    isSubmitting,
    imagePreviewUrl,
  } = useQuizEditorWizard();

  const handleFinalNext = async () => {
    try {
      const result = await submitWizard();

      navigate(`/quiz/${result.quiz._id}/questions`, {
        state: result.questionDefaults,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <QuizBasicInfo
            state={state}
            errors={errors}
            updateState={updateState}
            imagePreviewUrl={imagePreviewUrl}
          />
        );
      case 2:
        return (
          <QuizCategories
            state={state}
            errors={errors}
            updateState={updateState}
          />
        );
      case 3:
        return (
          <QuizScoring
            state={state}
            errors={errors}
            updateState={updateState}
          />
        );
      case 4:
        return (
          <QuizTiming state={state} errors={errors} updateState={updateState} />
        );
      default:
        return null;
    }
  };

  const getNextLabel = () => {
    const labels: Record<number, string> = {
      1: "Далее: Категория",
      2: "Далее: Баллы",
      3: "Далее: Время",
      4: "Готово — перейти к вопросам",
    };
    return labels[step];
  };

  return (
    <>
      <TopBar
        isHasTittle={state.title.length > 3}
        submitWizard={submitWizard}
        isSubmitting={isSubmitting}
      />

      <div className="page-layout">
        <SidebarSteps
          currentStep={step}
          validSteps={validSteps}
          onStepClick={goTo}
        />

        <div className="main-content">
          <ProgressBar currentStep={step} />

          {renderStepContent()}

          <NavigationActions
            hideBack={step === 1}
            onBack={back}
            onNext={step === 4 ? handleFinalNext : next}
            nextLabel={getNextLabel()}
            isFinalStep={step === 4}
          />
        </div>

        <RightPanel state={state} imagePreviewUrl={imagePreviewUrl} />
      </div>
    </>
  );
};
