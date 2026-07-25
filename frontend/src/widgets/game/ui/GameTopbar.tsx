import { FiBox, FiUsers, FiSquare } from "react-icons/fi";

interface Props {
  playersCount: number;
  isHost: boolean;
  onEnd: () => void;
}

export function GameTopbar({ playersCount, isHost, onEnd }: Props) {
  return (
    <div className="topbar">
      <div className="tb-brand">
        <FiBox size={17} color="white" />
        <span className="tb-brand-name">Infinite Quiz</span>
      </div>
      <div className="tb-center">
        <div className="live-chip">ИГРА ИДЕТ</div>
      </div>
      <div className="tb-right">
        <div className="tb-players-chip">
          <FiUsers size={12} /> {playersCount}
        </div>
        {isHost && (
          <button className="tb-btn tb-btn-danger" onClick={onEnd}>
            <FiSquare size={12} /> Завершить
          </button>
        )}
      </div>
    </div>
  );
}
