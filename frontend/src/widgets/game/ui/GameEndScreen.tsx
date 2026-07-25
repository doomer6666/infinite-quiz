import { FiAward } from "react-icons/fi";
import type { Player } from "@infinite-quiz/common";

interface Props {
  leaderboard: Player[];
  onEnd: () => void;
}

export function GameEndScreen({ leaderboard, onEnd }: Props) {
  return (
    <div className="game-end-screen">
      <div className="end-card">
        <FiAward size={48} color="#FFD700" />
        <h2>Игра окончена!</h2>
        <div className="leaderboard">
          {leaderboard.map((player, i) => (
            <div
              key={player._id}
              className={`lb-row ${i < 3 ? `lb-top-${i + 1}` : ""}`}
            >
              <span className="lb-pos">{i + 1}</span>
              <span className="lb-name">{player.name}</span>
              <span className="lb-score">{player.score} очков</span>
            </div>
          ))}
        </div>
        <button className="end-btn" onClick={onEnd}>
          Вернуться к квизам
        </button>
      </div>
    </div>
  );
}
