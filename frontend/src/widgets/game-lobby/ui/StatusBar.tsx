import { FiPlay, FiWifi } from "react-icons/fi";
import type { Player } from "@infinite-quiz/common";

interface Props {
  players: Player[];
  onStart: () => void;
}

export function StatusBar({ players, onStart }: Props) {
  const count = players.length;

  return (
    <div className="status-bar">
      <div className="status-left">
        <div className="status-pill pill-waiting">
          <div className="pill-dot" />
          Ожидание участников
        </div>
        <div className="status-pill pill-online">
          <div className="pill-dot" />
          <FiWifi size={12} />
          {count} онлайн
        </div>
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
