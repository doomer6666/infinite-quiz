import { FiFileText, FiSettings } from "react-icons/fi";

export function QuizInfo() {
  const quiz = {
    title: "Великие открытия в науке",
    questionCount: 18,
    timePerQuestion: 20,
    pointsPerQuestion: 10,
    category: "Наука, История",
  };

  const duration = Math.round((quiz.questionCount * quiz.timePerQuestion) / 60);

  return (
    <div className="bottom-row">
      <div className="info-card">
        <div className="info-card-header">
          <div className="info-card-icon">
            <FiFileText size={18} />
          </div>
          <div>
            <div className="info-card-title">О квизе</div>
            <div className="info-card-sub">{quiz.title}</div>
          </div>
        </div>
        <div className="quiz-detail-grid">
          <div className="detail-item">
            <div className="detail-val">{quiz.questionCount}</div>
            <div className="detail-label">Вопросов</div>
          </div>
          <div className="detail-item">
            <div className="detail-val">{quiz.timePerQuestion} с</div>
            <div className="detail-label">На вопрос</div>
          </div>
          <div className="detail-item">
            <div className="detail-val">{quiz.pointsPerQuestion}</div>
            <div className="detail-label">Баллов / вопрос</div>
          </div>
          <div className="detail-item">
            <div className="detail-val">~{duration} м</div>
            <div className="detail-label">Длительность</div>
          </div>
          <div className="detail-item" style={{ gridColumn: "1/3" }}>
            <div className="detail-val" style={{ fontSize: 15 }}>
              {quiz.category}
            </div>
            <div className="detail-label">Категории</div>
          </div>
        </div>
      </div>
    </div>
  );
}
