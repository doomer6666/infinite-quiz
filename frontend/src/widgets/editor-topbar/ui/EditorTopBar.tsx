import { BsChevronLeft, BsCheck2 } from "react-icons/bs";
import { MdQuiz } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface EditorTopBarProps {
  title: string;
  questionsCount: number;
  onSaveDraft: () => void;
  onPublish: () => void;
}

export const EditorTopBar: React.FC<EditorTopBarProps> = ({
  title,
  questionsCount,
  onSaveDraft,
  onPublish,
}) => {
  const nav = useNavigate();
  return (
    <div className="topbar">
      <div className="topbar-left">
        <a className="back-btn" onClick={() => nav(-1)}>
          <BsChevronLeft size={14} />
          Настройки
        </a>
        <div className="topbar-brand">
          <div className="brand-icon">
            <MdQuiz size={18} color="white" />
          </div>
          <span className="brand-name">Infinite Quiz</span>
        </div>
      </div>
      <div className="topbar-center">
        <span className="quiz-title-bar">{title}</span>
        <span className="quiz-count-badge">{questionsCount} вопросов</span>
      </div>
      <div className="topbar-right">
        <button className="btn-primary" onClick={onSaveDraft}>
          <BsCheck2 size={14} />
          Сохранить
        </button>
        <button className="btn-primary" onClick={onPublish}>
          <BsCheck2 size={15} />
          Опубликовать
        </button>
      </div>
    </div>
  );
};
