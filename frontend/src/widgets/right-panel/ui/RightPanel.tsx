import type { QuizWizardState } from "@/entities/quiz/index";
import type { QuizCategory } from "@infinite-quiz/common";
import {
  BsCheckCircle,
  BsClock,
  BsStarFill,
  BsCircle,
  BsCheck2,
} from "react-icons/bs";

interface RightPanelProps {
  state: QuizWizardState;
  imagePreviewUrl: string | null;
}

const CATEGORY_LABELS: Record<QuizCategory, string> = {
  science: "Наука",
  history: "История",
  technologies: "Технологии",
  geography: "География",
  movie: "Кино",
  sports: "Спорт",
};

export const RightPanel: React.FC<RightPanelProps> = ({
  state,
  imagePreviewUrl,
}) => {
  return (
    <div className="right-panel">
      <div className="preview-card">
        {imagePreviewUrl && (
          <div
            style={{
              width: "100%",
              height: "120px",
              overflow: "hidden",
              borderRadius: "16px 16px 0 0",
            }}
          >
            <img
              src={imagePreviewUrl}
              alt="Quiz Preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        )}
        <div
          className="preview-header"
          style={imagePreviewUrl ? { borderRadius: "0" } : {}}
        >
          <div className="preview-badge">
            <BsCheckCircle size={9} color="white" /> Предпросмотр
          </div>
          <div className="preview-title">{state.title || "Название квиза"}</div>
          <div className="preview-meta">
            <div className="preview-meta-item">
              <BsClock size={11} color="rgba(255,255,255,0.8)" />{" "}
              {state.timePerQuestion} сек / вопрос
            </div>
            <div className="preview-meta-item">
              <BsStarFill size={11} color="rgba(255,255,255,0.8)" />{" "}
              {state.pointsPerQuestion} баллов / вопрос
            </div>
          </div>
        </div>
        <div className="preview-body">
          {state.category && (
            <div className="preview-cats">
              <span className="preview-cat-tag">
                {CATEGORY_LABELS[state.category]}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="tips-card">
        <div className="tips-title">
          <BsCircle size={14} color="#0055CC" />
          Советы
        </div>
        <div className="tip-item">
          <div className="tip-dot">
            <BsCheck2 size={9} color="#0077FF" />
          </div>
          <span className="tip-text">
            Выбирайте категорию, которая точно описывает тематику вопросов
          </span>
        </div>
        <div className="tip-item">
          <div className="tip-dot">
            <BsCheck2 size={9} color="#0077FF" />
          </div>
          <span className="tip-text">
            20–30 секунд — оптимальное время для большинства вопросов
          </span>
        </div>
        <div className="tip-item">
          <div className="tip-dot">
            <BsCheck2 size={9} color="#0077FF" />
          </div>
          <span className="tip-text">
            Баллы за вопрос помогают балансировать сложность квиза
          </span>
        </div>
      </div>
    </div>
  );
};
