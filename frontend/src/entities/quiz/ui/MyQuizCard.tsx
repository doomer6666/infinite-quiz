import {
  MdQuestionAnswer,
  MdStar,
  MdPlayArrow,
  MdEdit,
  MdDelete,
} from "react-icons/md";
import type { QuizDto } from "@infinite-quiz/common";
import { useGetUserByIdQuery } from "@/entities/user/index";
import { useNavigate } from "react-router-dom";
import { useDeleteQuizMutation, usePublishQuizMutation } from "../api/quiz.api";

export const MyQuizCard = ({
  _id,
  imageFilename,
  category,
  questionCount,
  title,
  hostId,
  pointsCount,
  status,
}: QuizDto) => {
  const { data: author, isLoading, isError } = useGetUserByIdQuery(hostId);
  const nav = useNavigate();
  const [deleteQuiz] = useDeleteQuizMutation();
  const [publishQuiz] = usePublishQuizMutation();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError || !author) {
    return <div>Автор не найден</div>;
  }
  const isDraft = status === "draft";
  const onPublishQuiz = async () => {
    try {
      await publishQuiz(_id);
      console.log(121331);
    } catch {
      /* empty */
    }
  };
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
          <button
            className="card-btn btn-edit"
            onClick={() => nav(`${_id}/edit`)}
          >
            <MdEdit size={13} /> {isDraft ? "Доработать" : "Изменить"}
          </button>
          {isDraft ? (
            <button className="card-btn btn-pub" onClick={onPublishQuiz}>
              Опубликовать
            </button>
          ) : (
            <button className="card-btn btn-run">
              <MdPlayArrow size={13} color="white" /> Запустить
            </button>
          )}
          <button
            className="card-btn btn-del"
            style={{ flex: 0, padding: "8px 10px" }}
            onClick={() => deleteQuiz(_id)}
          >
            <MdDelete size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
