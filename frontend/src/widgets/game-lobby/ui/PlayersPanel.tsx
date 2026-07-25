import { FiUsers } from "react-icons/fi";
import type { Player } from "@infinite-quiz/common";

interface Props {
  players: Player[];
}

const MAX_PLAYERS = 50;

const AVATAR_COLORS = [
  "linear-gradient(135deg,#0077FF,#0055CC)",
  "linear-gradient(135deg,#F59E0B,#D97706)",
  "linear-gradient(135deg,#10B981,#059669)",
  "linear-gradient(135deg,#8B5CF6,#7C3AED)",
  "linear-gradient(135deg,#F43F5E,#E11D48)",
  "linear-gradient(135deg,#06B6D4,#0891B2)",
  "linear-gradient(135deg,#84CC16,#65A30D)",
];

function getInitials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

export function PlayersPanel({ players }: Props) {
  const count = players.length;
  const fillPercent = Math.round((count / MAX_PLAYERS) * 100);

  return (
    <div className="right-col">
      <div className="right-col-header">
        <div className="right-col-title">
          <FiUsers size={15} />
          Участники
          <span className="players-count-badge">{count}</span>
        </div>
      </div>

      <div className="players-scroll">
        {players.length === 0 && (
          <div className="players-empty">Пока никто не подключился</div>
        )}
        {players.map((player, i) => (
          <div className="player-item" key={player._id}>
            <div
              className="p-avatar"
              style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
            >
              {getInitials(player.name)}
            </div>
            <div className="p-info">
              <div className="p-name">{player.name}</div>
            </div>
            <div className="p-status" />
          </div>
        ))}
      </div>

      <div className="right-col-footer">
        <div className="players-bar-wrap">
          <div className="players-bar-label">
            <span>Заполненность комнаты</span>
            <span>
              {count} / {MAX_PLAYERS}
            </span>
          </div>
          <div className="players-bar">
            <div
              className="players-bar-fill"
              style={{ width: `${fillPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
