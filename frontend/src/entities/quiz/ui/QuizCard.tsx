import { useGetUserByIdQuery } from "@/entities/user/index";
import type { CtxType } from "@/shared/lib/hooks/useContextMenu";
import type { QuizDto } from "@infinite-quiz/common";
import {
  MdQuestionAnswer,
  MdStar,
  MdPlayArrow,
  MdMoreVert,
} from "react-icons/md";

interface QuizCardProps {
  quiz: QuizDto;
  onMenuClick: (e: React.MouseEvent, type: CtxType) => void;
}

export const QuizCard = ({ quiz, onMenuClick }: QuizCardProps) => {
  const { imageFilename, category, questionCount, title, hostId, pointsCount } =
    quiz;
  const { data: author, isLoading, isError } = useGetUserByIdQuery(hostId);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError || !author) {
    return <div>Автор не найден</div>;
  }
  return (
    <div className="quiz-card">
      <div className="card-cover">
        <img className="card-cover-img" src={imageFilename} alt="" />
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
            <MdQuestionAnswer size={11} /> {questionCount} вопросов
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="card-title">{title}</div>
        <div className="card-author-row">
          <div className="author-avatar">
            <img src={author.avatar} />
          </div>
          <span className="author-name">{author.name}</span>
        </div>
        <div className="card-meta">
          <div className="card-meta-item">
            <MdStar size={13} /> {pointsCount} баллов
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
