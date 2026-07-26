import { useEffect, useMemo } from "react";
import { FiBox, FiChevronLeft, FiAward } from "react-icons/fi";
import type { Player } from "@infinite-quiz/common";
import "./GameEndScreen.css";
import { socket } from "@/shared/index";

interface Props {
  leaderboard: Player[];
  quizTitle?: string;
  questionCount?: number;
  onEnd: () => void;
}

const AVATAR_COLORS = [
  "linear-gradient(135deg,#0077FF,#0055CC)",
  "linear-gradient(135deg,#F59E0B,#D97706)",
  "linear-gradient(135deg,#10B981,#059669)",
  "linear-gradient(135deg,#8B5CF6,#7C3AED)",
  "linear-gradient(135deg,#F43F5E,#E11D48)",
  "linear-gradient(135deg,#06B6D4,#0891B2)",
  "linear-gradient(135deg,#84CC16,#65A30D)",
  "linear-gradient(135deg,#F97316,#EA580C)",
];

function getInitials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

export function GameEndScreen({
  leaderboard,
  quizTitle,
  questionCount,
  onEnd,
}: Props) {
  const sorted = useMemo(
    () => [...leaderboard].sort((a, b) => b.score - a.score),
    [leaderboard],
  );
  const getAvatarUrl = (avatar: string) => {
    if (avatar.startsWith("http")) return avatar;
    return avatar.length > 12
      ? `http://localhost:4010/uploads/${avatar}`
      : `http://localhost:4010/static/${avatar}`;
  };

  const top3 = sorted.slice(0, 3);
  const totalScore = sorted.reduce((sum, p) => sum + p.score, 0);
  const avgPercent =
    questionCount && questionCount > 0
      ? Math.round((totalScore / (sorted.length * questionCount * 10)) * 100)
      : 0;

  useEffect(() => {
    const wrap = document.getElementById("confetti-wrap");
    if (!wrap) return;

    const colors = [
      "rgba(245,158,11,0.85)",
      "rgba(0,119,255,0.85)",
      "rgba(16,185,129,0.85)",
      "rgba(139,92,246,0.85)",
      "rgba(244,63,94,0.85)",
      "rgba(6,182,212,0.85)",
      "rgba(132,204,22,0.85)",
      "rgba(249,115,22,0.85)",
    ];

    for (let i = 0; i < 55; i++) {
      const el = document.createElement("div");
      el.className = "confetti-piece";
      const left = Math.random() * 100;
      const delay = Math.random() * 4;
      const duration = 3 + Math.random() * 4;
      const size = 5 + Math.random() * 7;
      const color = colors[Math.floor(Math.random() * colors.length)];
      el.style.cssText = `
        left:${left}%;
        width:${size}px;
        height:${size * (0.4 + Math.random() * 0.8)}px;
        background:${color};
        animation-delay:${delay}s;
        animation-duration:${duration}s;
        border-radius:${Math.random() > 0.5 ? "50%" : "2px"};
      `;
      wrap.appendChild(el);
    }

    return () => {
      wrap.innerHTML = "";
    };
  }, []);

  const handleEnd = () => {
    socket.disconnect();
    onEnd();
  };

  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);
  const podiumPlaces = top3[1] ? [2, 1, 3] : top3.length === 2 ? [2, 1] : [1];

  return (
    <div className="game-end-page">
      <div className="bg-deco">
        <div className="bg-dots" />
        <div className="bg-blob-1" />
        <div className="bg-blob-2" />
      </div>
      <div className="confetti-wrap" id="confetti-wrap" />

      <div className="topbar">
        <a className="tb-brand" href="/quizzes">
          <div className="tb-brand-icon">
            <FiBox size={17} color="white" />
          </div>
          <span className="tb-brand-name">Infinite Quiz</span>
        </a>
        <div className="tb-center">
          <span className="tb-quiz-name">{quizTitle}</span>
          <div className="finished-chip">
            <div className="finished-dot" />
            ЗАВЕРШЁН
          </div>
        </div>
        <div className="tb-right">
          <button className="tb-btn tb-btn-white" onClick={handleEnd}>
            <FiChevronLeft size={14} /> К квизам
          </button>
        </div>
      </div>

      <div className="page-wrap">
        {/* Hero */}
        <div className="winner-hero">
          <div className="trophy-wrap">
            <div className="trophy-glow" />
            <div className="trophy-icon">
              <FiAward size={40} color="white" />
            </div>
          </div>
          <div className="winner-title">Квиз завершён!</div>
          <div className="winner-sub">
            {quizTitle ?? "Квиз"} · {questionCount ?? sorted.length} вопросов ·{" "}
            {sorted.length} участников
          </div>
        </div>

        {/* Stats */}
        <div className="global-stats">
          <div className="gstat">
            <div className="gstat-val">{sorted.length}</div>
            <div className="gstat-label">Участников</div>
          </div>
          <div className="gstat">
            <div className="gstat-val">{questionCount ?? "—"}</div>
            <div className="gstat-label">Вопросов</div>
          </div>
          <div className="gstat">
            <div className="gstat-val">{avgPercent}%</div>
            <div className="gstat-label">Средний результат</div>
          </div>
        </div>

        {/* Podium */}
        {top3.length > 0 && (
          <>
            <div className="section-header">
              <div className="section-line" />
              <div className="section-title">Победители</div>
              <div className="section-line" />
            </div>

            <div className="podium">
              {podiumOrder.map((player, i) => {
                const place = podiumPlaces[i];
                const colorIdx = sorted.indexOf(player) % AVATAR_COLORS.length;
                return (
                  <div key={player._id} className={`podium-col col-${place}`}>
                    <div className="podium-player-info">
                      <div style={{ position: "relative" }}>
                        {place === 1 && (
                          <div className="podium-crown">
                            <svg
                              width="24"
                              height="18"
                              viewBox="0 0 24 18"
                              fill="none"
                            >
                              <path
                                d="M2 16L5 6l5 6 4-10 4 10 5-6 3 10H2z"
                                fill="#F59E0B"
                                stroke="#D97706"
                                strokeWidth="1"
                              />
                              <circle cx="2" cy="6" r="2" fill="#F59E0B" />
                              <circle cx="12" cy="2" r="2" fill="#F59E0B" />
                              <circle cx="22" cy="6" r="2" fill="#F59E0B" />
                            </svg>
                          </div>
                        )}
                        <div
                          className="podium-avatar"
                          style={{
                            width: place === 1 ? 58 : place === 2 ? 48 : 44,
                            height: place === 1 ? 58 : place === 2 ? 48 : 44,
                            fontSize: place === 1 ? 18 : place === 2 ? 15 : 14,
                            background: AVATAR_COLORS[colorIdx],
                            ...(place === 1
                              ? {
                                  boxShadow:
                                    "0 0 0 3px rgba(245,158,11,0.4),0 8px 24px rgba(0,0,0,0.3)",
                                }
                              : {}),
                          }}
                        >
                          <img
                            src={getAvatarUrl(player.avatar)}
                            alt={player.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "inherit",
                            }}
                          />
                        </div>
                        <div className={`podium-medal medal-${place}`}>
                          {place}
                        </div>
                      </div>
                      <div
                        className="podium-pname"
                        style={place === 1 ? { fontSize: 15 } : {}}
                      >
                        {player.name}
                      </div>
                      <div
                        className="podium-pscore"
                        style={
                          place === 1 ? { fontSize: 22, color: "#FDE68A" } : {}
                        }
                      >
                        {player.score} б.
                      </div>
                    </div>
                    <div className="podium-block">
                      <div className="podium-place-num">{place}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Full leaderboard */}
        <div className="section-header">
          <div className="section-line" />
          <div className="section-title">Полная таблица</div>
          <div className="section-line" />
        </div>

        <div className="leaderboard-card">
          <div className="lb-table-header">
            <div className="lb-th" style={{ textAlign: "center" }}>
              #
            </div>
            <div className="lb-th">Участник</div>
            <div className="lb-th right">Баллы</div>
          </div>

          {sorted.map((player, i) => {
            const rank = i + 1;
            const colorIdx = i % AVATAR_COLORS.length;
            const maxScore = sorted[0]?.score || 1;
            const barWidth = Math.round((player.score / maxScore) * 100);
            const barColor =
              rank === 1
                ? "linear-gradient(to right,#FDE68A,#F59E0B)"
                : rank === 2
                  ? "linear-gradient(to right,#E5E7EB,#9CA3AF)"
                  : rank === 3
                    ? "linear-gradient(to right,#FCD34D,#B45309)"
                    : "rgba(255,255,255,0.4)";

            const sub =
              rank === 1
                ? "Лучший результат"
                : rank === 2
                  ? "Серебряный призёр"
                  : rank === 3
                    ? "Бронзовый призёр"
                    : "";

            return (
              <div
                key={player._id}
                className={`lb-row ${rank <= 3 ? `rank-${rank}` : ""}`}
              >
                <div className="lb-rank-cell">
                  <div
                    className={`rank-badge ${rank <= 3 ? `rank-badge-${rank}` : "rank-badge-other"}`}
                  >
                    {rank}
                  </div>
                </div>
                <div className="lb-player-cell">
                  <div
                    className="lb-avatar"
                    style={{ background: AVATAR_COLORS[colorIdx] }}
                  >
                    {getInitials(player.name)}
                  </div>
                  <div className="lb-player-info">
                    <div className="lb-player-name">{player.name}</div>
                    {sub && <div className="lb-player-sub">{sub}</div>}
                  </div>
                </div>
                <div
                  className="lb-cell"
                  style={{
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 4,
                  }}
                >
                  <div
                    className="lb-score-val"
                    style={rank > 3 ? { color: "rgba(255,255,255,0.85)" } : {}}
                  >
                    {player.score}
                  </div>
                  <div className="lb-correct-bar-wrap">
                    <div
                      className="lb-correct-bar"
                      style={{ width: `${barWidth}%`, background: barColor }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
