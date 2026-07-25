import { FiHelpCircle, FiPlay, FiX } from "react-icons/fi";
import { HiCube } from "react-icons/hi2";
import type { GameStatus } from "@infinite-quiz/common";

interface Props {
  status: GameStatus;
  onStart: () => void;
  onCancel: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  LOBBY: "ЛОББИ",
  INTRO: "СТАРТ",
  QUESTION_SHOW: "ВОПРОС",
  QUESTION_ANSWERING: "ОТВЕТЫ",
  QUESTION_RESULTS: "РЕЗУЛЬТАТЫ",
  GAME_END: "КОНЕЦ",
};

export function LobbyTopbar({ status, onStart, onCancel }: Props) {
  return (
    <div className="topbar">
      <a className="topbar-brand" href="/quizzes">
        <div className="brand-icon">
          <HiCube size={18} color="white" />
        </div>
        <span className="brand-name">Infinite Quiz</span>
      </a>

      <div className="topbar-center">
        <div className="live-chip">
          <div className="live-dot" />
          {STATUS_LABELS[status] ?? status}
        </div>
      </div>

      <div className="topbar-right">
        <button className="tb-btn tb-btn-start" onClick={onStart}>
          <FiPlay size={14} />
          Начать квиз
        </button>
        <button className="tb-btn tb-btn-danger" onClick={onCancel}>
          <FiX size={14} />
          Отменить
        </button>
      </div>
    </div>
  );
}
