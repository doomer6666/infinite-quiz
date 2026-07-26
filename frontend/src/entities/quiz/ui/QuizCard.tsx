import { useGetUserByIdQuery } from "@/entities/user/index";
import type { QuizDto } from "@infinite-quiz/common";
import { MdQuestionAnswer, MdStar, MdPlayArrow } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface QuizCardProps {
  quiz: QuizDto;
}

export const QuizCard = ({ quiz }: QuizCardProps) => {
  const {
    _id,
    imageFilename,
    category,
    questionCount,
    title,
    hostId,
    pointsCount,
  } = quiz;
  const { data: author, isLoading, isError } = useGetUserByIdQuery(hostId);
  const role = localStorage.getItem("gameRole");
  const nav = useNavigate();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError || !author) {
    return <div>Автор не найден</div>;
  }
  return (
    <div className="quiz-card">
      <div className="card-cover">
        <img className="card-cover-img" src={imageFilename} alt="Аватар" />
        <div className="card-cover-gradient" />
        <div className="card-cover-badges">
          <span className="cover-badge cover-badge-cat">{category}</span>
        </div>
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
          <button
            className="card-btn btn-run"
            onClick={() =>
              role === "host" ? nav(`${_id}/start`) : nav("/join")
            }
          >
            <MdPlayArrow size={14} color="white" /> Играть
          </button>
        </div>
      </div>
    </div>
  );
};
