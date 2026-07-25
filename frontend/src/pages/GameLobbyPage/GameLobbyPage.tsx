import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./GameLobbyPage.css";
import { gameApi } from "@/entities/game/api/gameApi";
import { useGame } from "@/entities/game/model/useGame";
import { useMeQuery } from "@/entities/user/index";
import { CodeBlock } from "@/widgets/game-lobby/ui/CodeBlock";
import { LobbyTopbar } from "@/widgets/game-lobby/ui/LobbyTopbar";
import { PlayersPanel } from "@/widgets/game-lobby/ui/PlayersPanel";
import { QuizInfo } from "@/widgets/game-lobby/ui/QuizInfo";
import { StatusBar } from "@/widgets/game-lobby/ui/StatusBar";
import { socket } from "@/shared/index";

export default function GameLobbyPage() {
  const { id } = useParams<{ id: string }>()!;
  const navigate = useNavigate();
  const { data: user } = useMeQuery();
  const { code, status, players } = useGame();
  const hasCreatedRef = useRef(false);

  useEffect(() => {
    if (!user || !id || code) return;
    localStorage.setItem("quizId", id);
    const tryCreate = () => {
      if (hasCreatedRef.current) return;
      hasCreatedRef.current = true;
      console.log("Creating game ONCE");
      gameApi.create(id, user.id);
    };

    if (socket.connected) {
      tryCreate();
    } else {
      socket.once("connect", tryCreate);
    }
  }, [user, id, code]);

  const handleStart = () => {
    if (code) {
      gameApi.start(code);
      navigate(`/game/${code}`);
    }
  };

  const handleCancel = () => {
    navigate("/quizzes");
  };

  return (
    <div className="lobby-page">
      <div className="bg-deco">
        <div className="bg-dots" />
        <div className="bg-circle-1" />
        <div className="bg-circle-2" />
        <div className="bg-circle-3" />
        <div className="bg-circle-4" />
      </div>

      <LobbyTopbar
        status={status}
        onStart={handleStart}
        onCancel={handleCancel}
      />

      <div className="page">
        <div className="left-col">
          <CodeBlock code={code!} />
          <StatusBar players={players} onStart={handleStart} />
          <QuizInfo />
        </div>
        <PlayersPanel players={players} />
      </div>
    </div>
  );
}
