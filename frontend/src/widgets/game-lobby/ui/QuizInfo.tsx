import { useGetQuizQuery } from "@/entities/quiz/index";
import { FiFileText } from "react-icons/fi";
import { useParams } from "react-router-dom";

export function QuizInfo() {
  const { id } = useParams<{ id: string }>();
  const { data: quiz } = useGetQuizQuery(id!);
  if (!quiz) return;

  const duration = Math.round(
    (quiz.questionCount *
      // eslint-disable-next-line no-useless-assignment
      quiz.questions.reduce((total, q) => (total += q.points), 0)) /
      60,
  );

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
            <div className="detail-val">~{quiz.questions[0].points} с</div>
            <div className="detail-label">На вопрос</div>
          </div>
          <div className="detail-item">
            <div className="detail-val">{quiz.pointsCount}</div>
            <div className="detail-label">Баллов за вопрос</div>
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
