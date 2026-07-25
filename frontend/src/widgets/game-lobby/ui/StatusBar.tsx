import { FiPlay } from "react-icons/fi";
import type { Player } from "@infinite-quiz/common";
import { useGetQuizQuery } from "@/entities/quiz/index";
import { useParams } from "react-router-dom";

interface Props {
  players: Player[];
  onStart: () => void;
}

export function StatusBar({ players, onStart }: Props) {
  const count = players.length;
  const { id } = useParams<{ id: string }>();
  const { data: quiz } = useGetQuizQuery(id!);
  if (!quiz) return;
  return (
    <div className="status-bar">
      <div className="status-left">
        <h1>{quiz.title}</h1>
      </div>
      <div className="status-right">
        <button
          className="start-big-btn"
          onClick={onStart}
          disabled={count === 0}
        >
          <FiPlay size={16} />
          Начать квиз
        </button>
      </div>
    </div>
  );
}
