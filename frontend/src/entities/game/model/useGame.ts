import { useEffect, useState } from "react";
import type { GameStatus, Player, Question } from "@infinite-quiz/common";
import { socket } from "@/shared/index";
import { gameApi } from "../api/gameApi";

interface QuestionData {
  question: Question;
  index: number;
  total: number;
}

interface ResultsData {
  scores?: Record<string, number>;
  leaderboard: Player[];
}

export function useGame() {
  const [code, setRoomCode] = useState<string | null>(null);
  const [status, setStatus] = useState<GameStatus>("LOBBY");
  const [players, setPlayers] = useState<Player[]>([]);
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState<ResultsData | null>(null);

  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log("Socket error:", err.message);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
    socket.on("game:created", (data) => {
      setRoomCode(data.code);
      localStorage.setItem("code", data.code);
      localStorage.setItem("gameRole", "host");
    });

    socket.on("game:joined", (data) => {
      setRoomCode(data.code);
      localStorage.setItem("code", data.code);
      localStorage.setItem("gameRole", "player");
    });

    socket.on("game:status", (data) => setStatus(data.status));

    socket.on("game:players", (data) => setPlayers(data.players));

    socket.on("game:question", (data) => {
      setQuestion(data);
      setAnswered(false);
      setTimeLeft(0);
    });

    socket.on("game:answering", (data) => {
      setStatus("QUESTION_ANSWERING");
      setTimeLeft(data.timeLimit);

      const interval = setInterval(() => {
        const remaining = Math.max(
          0,
          Math.ceil((data.endsAt - Date.now()) / 1000),
        );
        setTimeLeft(remaining);
        if (remaining <= 0) clearInterval(interval);
      }, 100);

      return () => clearInterval(interval);
    });

    socket.on("game:answer-accepted", () => setAnswered(true));

    socket.on("game:results", (data) => {
      setResults(data);
      setStatus("QUESTION_RESULTS");
    });

    socket.on("game:end", (data) => {
      setResults(data);
      setStatus("GAME_END");
      localStorage.removeItem("code");
      localStorage.removeItem("gameRole");
    });

    socket.on("game:destroyed", () => {
      setStatus("LOBBY");
      setRoomCode(null);
      setPlayers([]);
      localStorage.removeItem("code");
      localStorage.removeItem("gameRole");
    });

    socket.on("game:reconnected", (data) => {
      setStatus(data.status);
    });

    socket.on("connect", () => {
      const savedRoom = localStorage.getItem("code");
      const userId = localStorage.getItem("userId");
      const role = localStorage.getItem("gameRole");
      if (savedRoom && userId && role) {
        gameApi.reconnect(savedRoom, userId, role);
      }
    });

    return () => {
      socket.off("game:created");
      socket.off("game:joined");
      socket.off("game:status");
      socket.off("game:players");
      socket.off("game:question");
      socket.off("game:answering");
      socket.off("game:answer-accepted");
      socket.off("game:results");
      socket.off("game:end");
      socket.off("game:destroyed");
      socket.off("game:reconnected");
      socket.off("connect");
    };
  }, []);

  return {
    code,
    status,
    players,
    question,
    timeLeft,
    answered,
    results,
  };
}
