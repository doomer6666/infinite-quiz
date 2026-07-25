import { FiChevronRight, FiCheck } from "react-icons/fi";
import type { GameStatus } from "@infinite-quiz/common";

interface Props {
  status: GameStatus;
  isHost: boolean;
  answeredCount: number;
  totalPlayers: number;
  isLast: boolean;
  onNext: () => void;
  onEnd: () => void;
}

export function GameFooter({
  status,
  isHost,
  answeredCount,
  totalPlayers,
  isLast,
  onNext,
  onEnd,
}: Props) {
  if (!isHost) return null;

  const isResults = status === "QUESTION_RESULTS";
  const answeredPct =
    totalPlayers > 0 ? Math.round((answeredCount / totalPlayers) * 100) : 0;

  return (
    <div className="q-footer">
      <div className="footer-left">
        <div className="answered-block">
          <span className="answered-label">Ответили</span>
          <div className="answered-bar-wrap">
            <div
              className="answered-bar-fill"
              style={{ width: `${answeredPct}%` }}
            />
          </div>
          <span className="answered-val">
            {answeredCount} / {totalPlayers}
          </span>
        </div>
      </div>
      <div className="footer-right">
        {isResults && !isLast && (
          <button className="f-btn f-btn-next" onClick={onNext}>
            Следующий <FiChevronRight size={14} />
          </button>
        )}
        {isResults && isLast && (
          <button className="f-btn f-btn-next" onClick={onEnd}>
            <FiCheck size={14} /> Завершить
          </button>
        )}
      </div>
    </div>
  );
}
