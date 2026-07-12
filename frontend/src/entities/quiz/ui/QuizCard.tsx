import type { CtxType } from "@/shared/lib/hooks/useContextMenu";
import {
  MdQuestionAnswer,
  MdStar,
  MdPlayArrow,
  MdMoreVert,
} from "react-icons/md";
import type { Quiz } from "../model/types";

interface QuizCardProps {
  quiz: Quiz;
  onMenuClick: (e: React.MouseEvent, type: CtxType) => void;
}

export const QuizCard = ({ quiz, onMenuClick }: QuizCardProps) => {
  const { image, category, questions, title, author, points } = quiz;

  return (
    <div className="quiz-card">
      <div className="card-cover">
        <img className="card-cover-img" src={image} alt="" />
        <div className="card-cover-gradient" />
        <div className="card-cover-badges">
          <span className="cover-badge cover-badge-cat">{category}</span>
        </div>
        <button
          className="cover-menu-btn"
          onClick={(e) => onMenuClick(e, "other")}
        >
          <MdMoreVert size={15} />
        </button>
        <div className="card-cover-bottom">
          <div className="cover-stat">
            <MdQuestionAnswer size={11} /> {questions} вопросов
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="card-title">{title}</div>
        <div className="card-author-row">
          <div className="author-avatar">{author.avatar}</div>
          <span className="author-name">{author.name}</span>
        </div>
        <div className="card-meta">
          <div className="card-meta-item">
            <MdStar size={13} /> {points} баллов
          </div>
        </div>
        <div className="card-actions">
          <button className="card-btn btn-run">
            <MdPlayArrow size={14} color="white" /> Играть
          </button>
        </div>
      </div>
    </div>
  );
};
