import { useEffect, useState } from "react";
import type {
  GameResults,
  GameStatus,
  Player,
  Question,
} from "@infinite-quiz/common";
import { socket } from "@/shared/index";
import { gameApi } from "../api/gameApi";

interface QuestionData {
  question: Question;
  index: number;
  total: number;
}

let timerInterval: ReturnType<typeof setInterval> | null = null;

export function useGame() {
  const [code, setCode] = useState<string | null>(null);
  const [status, setStatus] = useState<GameStatus>("LOBBY");
  const [players, setPlayers] = useState<Player[]>([]);
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState<GameResults | null>(null);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      const savedRoom = localStorage.getItem("code");
      const userId = localStorage.getItem("userId");
      const role = localStorage.getItem("gameRole");
      if (savedRoom && userId && role) {
        gameApi.reconnect(savedRoom, userId, role);
      }
    });

    socket.on("game:created", (data) => {
      setCode(data.code);
      localStorage.setItem("code", data.code);
      localStorage.setItem("gameRole", "host");
    });

    socket.on("game:joined", (data) => {
      setCode(data.code);
      localStorage.setItem("code", data.code);
      localStorage.setItem("gameRole", "player");
    });

    socket.on("game:status", (data) => {
      console.log("game:status:", data.status);
      setStatus(data.status);
    });

    socket.on("game:players", (data) => {
      setPlayers(data.players);
    });

    socket.on("game:question", (data) => {
      console.log("1. game:question received");
      setQuestion(data);
      setAnswered(false);

      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    });

    socket.on("game:answering", (data) => {
      console.log("2. game:answering received, timeLimit:", data.timeLimit);
      setStatus("QUESTION_ANSWERING");
      setTimeLeft(data.timeLimit);

      if (timerInterval) {
        clearInterval(timerInterval);
      }

      const updateTimer = () => {
        const remaining = Math.max(
          0,
          Math.ceil((data.endsAt - Date.now()) / 1000),
        );
        setTimeLeft(remaining);
        if (remaining <= 0 && timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
        }
      };

      timerInterval = setInterval(updateTimer, 100);
    });

    socket.on("game:answering", (data) => {
      console.log("game:answering received:", data);
      setStatus("QUESTION_ANSWERING");

      if (timerInterval) {
        clearInterval(timerInterval);
      }

      const updateTimer = () => {
        const remaining = Math.max(
          0,
          Math.ceil((data.endsAt - Date.now()) / 1000),
        );
        setTimeLeft(remaining);
        if (remaining <= 0 && timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
        }
      };

      updateTimer();
      timerInterval = setInterval(updateTimer, 100);
    });

    socket.on("game:answer-accepted", () => {
      setAnswered(true);
    });

    socket.on("game:results", (data) => {
      setResults(data);
      setStatus("QUESTION_RESULTS");
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    });

    socket.on("game:end", (data) => {
      setResults({ scores: {}, leaderboard: data.leaderboard });
      setStatus("GAME_END");
      localStorage.removeItem("code");
      localStorage.removeItem("gameRole");
    });

    socket.on("game:destroyed", () => {
      setStatus("LOBBY");
      setCode(null);
      setPlayers([]);
      localStorage.removeItem("code");
      localStorage.removeItem("gameRole");
    });

    socket.on("game:reconnected", (data) => {
      setStatus(data.status);
    });

    return () => {
      socket.off("connect");
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

      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    };
  }, []);

  return { code, status, players, question, timeLeft, answered, results };
}
