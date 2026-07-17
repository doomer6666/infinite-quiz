import { BsChevronLeft, BsChevronRight, BsCheck2 } from "react-icons/bs";

interface NavigationActionsProps {
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
  isFinalStep?: boolean;
  hideBack?: boolean;
}

export const NavigationActions: React.FC<NavigationActionsProps> = ({
  onBack,
  onNext,
  nextLabel,
  isFinalStep,
  hideBack,
}) => {
  return (
    <div className="nav-actions">
      {!hideBack && (
        <button className="btn-back-step" onClick={onBack}>
          <BsChevronLeft size={15} />
          <span>Назад</span>
        </button>
      )}

      <button
        className="btn-next-step"
        onClick={onNext}
        style={
          isFinalStep
            ? { background: "linear-gradient(135deg,#1A9E5C,#147A48)" }
            : {}
        }
      >
        {isFinalStep && <BsCheck2 size={15} />}
        {nextLabel}
        {!isFinalStep && <BsChevronRight size={15} />}
      </button>
    </div>
  );
};
