import {
  MdQuestionAnswer,
  MdMoreVert,
  MdEdit,
  MdDelete,
  MdUpload,
  MdInsertDriveFile,
  MdWarning,
} from "react-icons/md";
import type { CtxType } from "@/shared/lib/hooks/index";

export interface DraftCardProps {
  image?: string;
  category?: string;
  title: string;
  filledQuestions: number;
  totalQuestions: number;
  progressPercent: number;
  warningText: string;
  canPublish?: boolean;
  onMenuClick: (e: React.MouseEvent, type: CtxType) => void;
}

export const DraftCard = ({
  image,
  category,
  title,
  filledQuestions,
  totalQuestions,
  progressPercent,
  warningText,
  canPublish = true,
  onMenuClick,
}: DraftCardProps) => {
  const progressColor =
    progressPercent === 0
      ? "var(--error)"
      : "linear-gradient(to right,#D97706,#F59E0B)";

  const progressTextColor = progressPercent === 0 ? "var(--error)" : "#D97706";

  return (
    <div className="quiz-card draft-card">
      <div
        className="card-cover"
        style={
          !image
            ? {
                background: "linear-gradient(135deg,#E5F2FF,#C7DEFF)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }
            : undefined
        }
      >
        {image ? (
          <img className="card-cover-img" src={image} alt="" />
        ) : (
          <MdInsertDriveFile
            size={48}
            color="#0077FF"
            style={{ opacity: 0.3 }}
          />
        )}
        <div className="card-cover-gradient" />
        <div className="card-cover-badges">
          <span className="cover-badge cover-badge-draft">
            <MdInsertDriveFile size={10} color="white" /> Черновик
          </span>
          {category && (
            <span className="cover-badge cover-badge-cat">{category}</span>
          )}
        </div>
        <button
          className="cover-menu-btn"
          onClick={(e) => onMenuClick(e, "draft")}
        >
          <MdMoreVert size={15} />
        </button>
        <div className="card-cover-bottom">
          <div
            className="cover-stat"
            style={!image ? { color: "rgba(10,25,41,0.6)" } : undefined}
          >
            <MdQuestionAnswer size={11} />
            {totalQuestions === 0
              ? "0 вопросов"
              : `${filledQuestions} из ${totalQuestions} вопросов`}
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="card-title">{title}</div>

        {totalQuestions > 0 && (
          <div className="draft-progress-wrap">
            <div className="draft-progress-label">
              <span>Готовность вопросов</span>
              <span style={{ fontWeight: 700, color: progressTextColor }}>
                {progressPercent}%
              </span>
            </div>
            <div className="draft-progress-bar">
              <div
                className="draft-progress-fill"
                style={{
                  width: `${progressPercent}%`,
                  background: progressColor,
                }}
              />
            </div>
          </div>
        )}

        <div className="draft-warning">
          <MdWarning
            size={14}
            color="#B25B00"
            style={{ flexShrink: 0, marginTop: 1 }}
          />
          <span className="draft-warning-text">{warningText}</span>
        </div>

        <div className="card-actions">
          <button className="card-btn btn-edit">
            <MdEdit size={13} /> Доработать
          </button>
          <button
            className="card-btn btn-pub"
            style={
              !canPublish ? { opacity: 0.45, cursor: "not-allowed" } : undefined
            }
            disabled={!canPublish}
          >
            <MdUpload size={13} color="white" /> Опубликовать
          </button>
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
