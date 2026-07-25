import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gameApi } from "@/entities/game/api/gameApi";
import { useMeQuery } from "@/entities/user";
import "./JoinPage.css";
import { useGame } from "@/entities/game/model/useGame";
import { socket } from "@/shared/index";
import { FiHash, FiLogIn } from "react-icons/fi";

export default function JoinPage() {
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { data: user } = useMeQuery();
  const { code, status, players } = useGame();
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!user || !inputCode.trim()) return;

    setError(null);

    const tryJoin = () => {
      gameApi.join(inputCode.trim().toUpperCase(), user.id);
    };

    if (socket.connected) {
      tryJoin();
    } else {
      socket.once("connect", tryJoin);
    }
  };

  socket.on("error", (data) => {
    setError(data.message);
  });

  useEffect(() => {
    if (code && status !== "LOBBY") {
      navigate(`/game/${code}`);
    }
  });

  if (code && status === "LOBBY") {
    return (
      <div className="join-page">
        <div className="join-card">
          <h2>Вы в комнате</h2>
          <div className="join-code-display">{code}</div>
          <p className="join-waiting">Ожидание начала игры...</p>
          <p className="join-players">Игроков: {players.length}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="join-page">
      <div className="join-card">
        <div className="join-icon">
          <FiHash size={32} />
        </div>
        <h2>Присоединиться к игре</h2>
        <p className="join-subtitle">
          Введите код комнаты, который показал организатор
        </p>

        <input
          className="join-input"
          type="text"
          placeholder="Например: A8K2X9"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value.toUpperCase())}
          maxLength={6}
          autoFocus
        />

        {error && <span className="join-error">{error}</span>}

        <button
          className="join-btn"
          onClick={handleJoin}
          disabled={!inputCode.trim() || !user}
        >
          <FiLogIn size={16} />
          Войти
        </button>

        <button className="join-back" onClick={() => navigate("/quizzes")}>
          Назад к квизам
        </button>
      </div>
    </div>
  );
}
