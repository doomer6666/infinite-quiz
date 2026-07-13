import {
  MdQuestionAnswer,
  MdStar,
  MdPlayArrow,
  MdMoreVert,
  MdEdit,
  MdDelete,
} from "react-icons/md";
import type { CtxType } from "@/shared/lib/hooks/index";
import type { QuizDto } from "@infinite-quiz/common";
import { useGetUserByIdQuery } from "@/entities/user/index";

interface MyQuizCardProps {
  quiz: QuizDto;
  onMenuClick: (e: React.MouseEvent, type: CtxType) => void;
}

export const MyQuizCard = ({ quiz, onMenuClick }: MyQuizCardProps) => {
  const {
    imageFilename,
    category,
    questionCount,
    title,
    hostId,
    pointsCount,
    status,
  } = quiz;
  const { data: author, isLoading, isError } = useGetUserByIdQuery(hostId);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError || !author) {
    return <div>Автор не найден</div>;
  }
  const isDraft = status === "draft";
  const ctxType: CtxType = isDraft ? "draft" : "mine";

  return (
    <div className={`quiz-card ${isDraft ? "draft-card" : ""}`}>
      <div className="card-cover">
        <img className="card-cover-img" src={imageFilename} alt="" />
        <div className="card-cover-gradient" />
        <div className="card-cover-badges">
          {isDraft && (
            <span className="cover-badge cover-badge-draft">Черновик</span>
          )}
          <span className="cover-badge cover-badge-cat">{category}</span>
        </div>
        <button
          className="cover-menu-btn"
          onClick={(e) => onMenuClick(e, ctxType)}
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
        <div className="card-meta">
          <div className="card-meta-item">
            <MdStar size={13} /> {pointsCount} баллов
          </div>
        </div>

        <div className="card-actions">
          <button className="card-btn btn-edit">
            <MdEdit size={13} /> {isDraft ? "Доработать" : "Изменить"}
          </button>
          {isDraft ? (
            <button className="card-btn btn-pub">Опубликовать</button>
          ) : (
            <button className="card-btn btn-run">
              <MdPlayArrow size={13} color="white" /> Запустить
            </button>
          )}
          <button
            className="card-btn btn-del"
            style={{ flex: 0, padding: "8px 10px" }}
          >
            <MdDelete size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
