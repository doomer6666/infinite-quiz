import { useParams, useNavigate } from "react-router-dom";
import "./GamePage.css";
import { gameApi } from "@/entities/game/api/gameApi";
import { useGame } from "@/entities/game/model/useGame";
import { useMeQuery } from "@/entities/user/index";
import { GameFooter } from "@/widgets/game/ui/GameFooter";
import { GameTopbar } from "@/widgets/game/ui/GameTopbar";
import { QuestionStage } from "@/widgets/game/ui/QuestionStage";
import { ProgressDots } from "@/widgets/game/ui/ProgressDots";
import { GameEndScreen } from "@/widgets/game/ui/GameEndScreen";
import { useEffect, useRef } from "react";
import { socket } from "@/shared/index";

export default function GamePage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { data: user } = useMeQuery();
  const { status, question, timeLeft, players, results, answered } = useGame();

  const role = localStorage.getItem("gameRole") ?? "player";
  const isHost = role === "host";
  const hasStartedRef = useRef(false);

  const handleNext = () => code && gameApi.nextQuestion(code);
  const handleEnd = () => navigate("/quizzes");
  const handleSubmitAnswer = (answerId: string) => {
    if (code && user) gameApi.submitAnswer(code, answerId, user.id);
  };

  useEffect(() => {
    if (!isHost || !code || hasStartedRef.current) return;

    const show = () => {
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;

      setTimeout(() => {
        console.log("Calling showQuestion after delay");
        gameApi.showQuestion(code);
      }, 200);
    };

    if (socket.connected) {
      show();
    } else {
      socket.connect();
      socket.once("connect", show);
    }
  }, [isHost, code]);

  if (status === "GAME_END" && results) {
    return (
      <GameEndScreen leaderboard={results.leaderboard} onEnd={handleEnd} />
    );
  }

  if (!question) {
    return (
      <div className="game-page">
        <div className="game-loading">
          {isHost ? "Загрузка вопроса..." : "Ожидание вопроса..."}
        </div>
      </div>
    );
  }

  return (
    <div className="game-page">
      <div className="bg-deco">
        <div className="bg-dots" />
        <div className="bg-blob-1" />
        <div className="bg-blob-2" />
      </div>

      <GameTopbar
        playersCount={players.length}
        isHost={isHost}
        onEnd={handleEnd}
      />

      <ProgressDots current={question.index + 1} total={question.total} />

      <QuestionStage
        question={question.question}
        index={question.index}
        timeLeft={timeLeft}
        status={status}
        isHost={isHost}
        answered={answered}
        onSubmitAnswer={handleSubmitAnswer}
      />

      <GameFooter
        status={status}
        isHost={isHost}
        answeredCount={results?.scores ? Object.keys(results.scores).length : 0}
        totalPlayers={players.length}
        isLast={question.index >= question.total - 1}
        onNext={handleNext}
        onEnd={handleEnd}
      />
    </div>
  );
}
