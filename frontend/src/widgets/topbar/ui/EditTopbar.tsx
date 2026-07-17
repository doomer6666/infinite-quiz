import { BsChevronLeft, BsCheck2 } from "react-icons/bs";
import { MdQuiz } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface TopBarProps {
  isHasTittle: boolean;
  submitWizard: () => void;
  isSubmitting: boolean;
}
export const TopBar: React.FC<TopBarProps> = ({
  isHasTittle,
  submitWizard,
  isSubmitting,
}) => {
  const navigate = useNavigate();

  const onDraftSubmit = () => {
    submitWizard();
    navigate("/quizzes");
  };
  return (
    <div className="topbar">
      <div className="topbar-left">
        <a className="back-btn" onClick={() => navigate(-1)}>
          <BsChevronLeft size={15} />
          Назад
        </a>
        <div className="topbar-brand">
          <div className="brand-icon">
            <MdQuiz size={20} color="white" />
          </div>
          <span className="brand-name">Infinite Quiz</span>
        </div>
      </div>
      <div className="topbar-right">
        <button
          className="btn-ghost"
          disabled={!isHasTittle || isSubmitting}
          onClick={onDraftSubmit}
        >
          Сохранить черновик
        </button>
        <button className="btn-primary">
          <BsCheck2 size={15} />
          Опубликовать
        </button>
      </div>
    </div>
  );
};
