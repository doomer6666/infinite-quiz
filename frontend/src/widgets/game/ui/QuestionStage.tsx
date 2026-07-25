import { useState } from "react";
import { FiStar, FiTrendingUp, FiCheck } from "react-icons/fi";
import type { Question, GameStatus } from "@infinite-quiz/common";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface Props {
  question: Question;
  index: number;
  timeLeft: number;
  status: GameStatus;
  isHost: boolean;
  answered: boolean;
  onSubmitAnswer: (answerId: string) => void;
}

const LETTERS = ["А", "Б", "В", "Г", "Д", "Е", "Ж", "З"];

export function QuestionStage({
  question,
  index,
  timeLeft,
  status,
  isHost,
  answered,
  onSubmitAnswer,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const isShow = status === "QUESTION_SHOW";
  const isAnswering = status === "QUESTION_ANSWERING";
  const isResults = status === "QUESTION_RESULTS";
  const timerPercent =
    question.timeLimit > 0 ? (timeLeft / question.timeLimit) * 100 : 0;
  const canAnswer = (isShow || isAnswering) && !answered;

  const handleClick = (answerId: string | undefined) => {
    if (!canAnswer || !answerId) return;
    setSelectedId(answerId);
    onSubmitAnswer(answerId);
  };
  console.log("Timer should show:", isAnswering, "timeLeft:", timeLeft);

  return (
    <div className="question-view">
      <div className="q-stage">
        <div className="q-header-row">
          <div className="q-badges">
            <div className="q-badge badge-num">
              <FiTrendingUp size={10} /> Вопрос {index + 1}
            </div>
            <div className="q-badge badge-pts">
              <FiStar size={10} /> {question.points} баллов
            </div>
          </div>
          {isAnswering && (
            <div className="timer-wrap" style={{ width: 76, height: 76 }}>
              <CircularProgressbar
                value={timerPercent}
                text={`${timeLeft}`}
                strokeWidth={8}
                styles={buildStyles({
                  textSize: "28px",
                  pathTransitionDuration: 0.1,
                  pathColor:
                    timeLeft <= 3
                      ? "#ff6b6b"
                      : timeLeft <= 5
                        ? "#ffd166"
                        : "#ffffff",
                  textColor: "#ffffff",
                  trailColor: "rgba(255, 255, 255, 0.1)",
                  strokeLinecap: "round",
                })}
              />
            </div>
          )}
        </div>

        <div className="q-text-card">
          <div className="q-text">{question.text}</div>
        </div>

        <div className="answers-wrap">
          <div
            className={`answers-grid-${question.answers.length <= 2 ? "2" : "4"}`}
          >
            {question.answers.map((answer, i) => (
              <div
                key={answer._id ?? i}
                className={`ans-opt ${
                  selectedId === answer._id && !isResults ? "ans-selected" : ""
                } ${isResults && answer.isCorrect ? "revealed-correct" : ""} ${
                  isResults && !answer.isCorrect ? "revealed-wrong" : ""
                } ${canAnswer ? "ans-clickable" : ""}`}
                onClick={() => handleClick(answer._id)}
              >
                <div className="ans-letter">
                  {selectedId === answer._id && !isResults ? (
                    <FiCheck size={14} color="white" />
                  ) : (
                    LETTERS[i]
                  )}
                </div>
                <div className="ans-text">{answer.text}</div>
              </div>
            ))}
          </div>
        </div>

        {answered && (isShow || isAnswering) && (
          <div className="player-waiting">
            Ответ принят, ожидаем остальных...
          </div>
        )}

        {!isHost && isShow && !answered && (
          <div className="player-waiting">Выберите ответ...</div>
        )}
      </div>
    </div>
  );
}
