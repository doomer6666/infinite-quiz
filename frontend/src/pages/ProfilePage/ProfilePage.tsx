import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiClock,
  FiLogOut,
  FiTrash2,
  FiEdit2,
  FiEye,
  FiEyeOff,
  FiLock,
  FiCheck,
  FiStar,
  FiAward,
  FiUpload,
} from "react-icons/fi";
import {
  useMeQuery,
  useUpdateUserMutation,
  useUploadAvatarMutation,
} from "@/entities/user";
import { useGetMyHistoryQuery } from "@/entities/game-history/api/gameHistoryApi";
import "./ProfilePage.css";

const AVATAR_PRESETS = ["blue.png", "green.png", "yellow.png", "brown.png"];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { data: user } = useMeQuery();
  const { data: history = [] } = useGetMyHistoryQuery();
  const [updateUser] = useUpdateUserMutation();
  const [uploadAvatar] = useUploadAvatarMutation();

  const [activeTab, setActiveTab] = useState<"profile" | "history">("profile");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [username, setUsername] = useState(user?.name ?? "");
  const [pass, setPass] = useState("");
  const [passConfirm, setPassConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showPassConfirm, setShowPassConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);

    if (!username.trim()) {
      setError("Введите имя пользователя");
      return;
    }

    if (pass && pass !== passConfirm) {
      setError("Пароли не совпадают");
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = { name: username.trim() };
      if (pass) data.password = pass;

      await updateUser({ id: user!.id, data }).unwrap();
      navigate("/quizzes");
    } catch {
      setError("Ошибка сохранения");
    }
  };

  const handlePresetClick = async (preset: string) => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:4010/static/${preset}`);
      const blob = await response.blob();
      const file = new File([blob], preset, { type: blob.type });
      await uploadAvatar({ id: user.id, file }).unwrap();
      setShowAvatarPicker(false);
    } catch {
      setError("Ошибка загрузки аватара");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      await uploadAvatar({ id: user.id, file }).unwrap();
      setShowAvatarPicker(false);
    } catch {
      setError("Ошибка загрузки изображения");
    }
  };

  const isHost = user?.role === "host";

  const stats = useMemo(() => {
    const totalScore = history.reduce((sum, h) => {
      const me = h.players.find((p) => p.userId === user?.id);
      return sum + (me?.score ?? 0);
    }, 0);

    const firstPlaces = history.filter((h) => {
      const me = h.players.find((p) => p.userId === user?.id);
      return me?.place === 1;
    }).length;

    const hosted = history.filter((h) => h.hostId === user?.id);
    const totalParticipants = hosted.reduce(
      (sum, h) => sum + h.players.length,
      0,
    );

    if (isHost) {
      return [
        {
          value: hosted.length,
          label: "Создано игр",
          icon: <FiStar size={15} color="#0077FF" />,
        },
        {
          value: history.length,
          label: "Сессий",
          icon: <FiClock size={15} color="#0077FF" />,
        },
        {
          value: totalParticipants,
          label: "Участников",
          icon: <FiUser size={15} color="#0077FF" />,
        },
      ];
    }

    return [
      {
        value: totalScore,
        label: "Всего баллов",
        icon: <FiStar size={15} color="#0077FF" />,
      },
      {
        value: history.length,
        label: "Сыграно игр",
        icon: <FiClock size={15} color="#0077FF" />,
      },
      {
        value: firstPlaces,
        label: "Первых мест",
        icon: <FiAward size={15} color="#F59E0B" />,
      },
    ];
  }, [history, user, isHost]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("code");
    localStorage.removeItem("gameRole");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="profile-app-wrapper">
      <div className="side-panel">
        <div className="side-logo">
          <div className="side-logo-icon">
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
              <rect
                x="1"
                y="1"
                width="6.5"
                height="6.5"
                rx="1.8"
                fill="rgba(255,255,255,0.9)"
              />
              <rect
                x="9.5"
                y="1"
                width="6.5"
                height="6.5"
                rx="1.8"
                fill="rgba(255,255,255,0.45)"
              />
              <rect
                x="1"
                y="9.5"
                width="6.5"
                height="6.5"
                rx="1.8"
                fill="rgba(255,255,255,0.45)"
              />
              <rect
                x="9.5"
                y="9.5"
                width="6.5"
                height="6.5"
                rx="1.8"
                fill="rgba(255,255,255,0.9)"
              />
            </svg>
          </div>
          <div className="side-logo-text">
            Infinite Quiz
            <span>Профиль</span>
          </div>
        </div>

        <nav className="side-nav">
          <button
            className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <FiUser size={15} /> Профиль
          </button>
          <button
            className={`nav-item ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            <FiClock size={15} /> История
          </button>

          <div className="nav-spacer" />
          <div className="nav-divider" />

          <button className="nav-item" onClick={() => navigate("/quizzes")}>
            <FiStar size={15} /> К квизам
          </button>
          <button className="nav-item" onClick={handleLogout}>
            <FiLogOut size={15} /> Выйти
          </button>
          <button
            className="nav-item danger"
            onClick={() => setShowDeleteModal(true)}
          >
            <FiTrash2 size={15} /> Удалить аккаунт
          </button>
        </nav>
      </div>
      <div className="main-panel">
        {activeTab === "profile" && (
          <div className="tab-content active">
            <div className="tab-scroll">
              {/* Avatar */}
              <div className="section-title">Аватар</div>
              <div className="avatar-block">
                <div className="avatar-wrap">
                  <div className="avatar">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                  <div
                    className="avatar-badge"
                    onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  >
                    <FiEdit2 size={10} color="white" />
                  </div>
                </div>
                <div>
                  <div className="avatar-name">{username || user.name}</div>
                  <div className="avatar-role">
                    {isHost ? "Организатор" : "Участник"}
                  </div>
                </div>
              </div>

              {showAvatarPicker && (
                <div className="avatar-picker open">
                  <div className="avatar-picker-title">
                    Заготовки или своё фото
                  </div>
                  <div className="avatar-presets">
                    {AVATAR_PRESETS.map((preset) => (
                      <img
                        key={preset}
                        src={`http://localhost:4010/static/${preset}`}
                        alt={preset}
                        className={`avatar-preset ${user.avatar.includes(preset) ? "selected" : ""}`}
                        onClick={() => handlePresetClick(preset)}
                      />
                    ))}
                  </div>
                  <label className="avatar-upload-btn">
                    <FiUpload size={14} />
                    Загрузить фото
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              )}

              {/* Stats */}
              <div className="section-title">Статистика</div>
              <div className="stats-block">
                {stats.map((s, i) => (
                  <div className="stat-card" key={i}>
                    <div className="stat-icon">{s.icon}</div>
                    <div className="stat-value">{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Edit */}
              <div className="section-title">Редактировать</div>
              <div className="field-wrap">
                <label className="field-label">Имя пользователя</label>
                <div className="field-input-wrap">
                  <span className="field-icon">
                    <FiEdit2 size={14} />
                  </span>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="your_username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="field-wrap">
                  <label className="field-label">Новый пароль</label>
                  <div className="field-input-wrap">
                    <span className="field-icon">
                      <FiLock size={14} />
                    </span>
                    <input
                      type={showPass ? "text" : "password"}
                      className="field-input has-right"
                      placeholder="Новый пароль"
                      value={pass}
                      onChange={(e) => setPass(e.target.value)}
                    />
                    <button
                      className="field-toggle"
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                    >
                      {showPass ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                    </button>
                  </div>
                </div>
                <div className="field-wrap">
                  <label className="field-label">Повтор пароля</label>
                  <div className="field-input-wrap">
                    <span className="field-icon">
                      <FiLock size={14} />
                    </span>
                    <input
                      type={showPassConfirm ? "text" : "password"}
                      className="field-input has-right"
                      placeholder="Повторите пароль"
                      value={passConfirm}
                      onChange={(e) => setPassConfirm(e.target.value)}
                    />
                    <button
                      className="field-toggle"
                      type="button"
                      onClick={() => setShowPassConfirm(!showPassConfirm)}
                    >
                      {showPassConfirm ? (
                        <FiEyeOff size={14} />
                      ) : (
                        <FiEye size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button className="btn-primary" onClick={handleSave}>
                <FiCheck size={14} color="white" /> Сохранить
              </button>
            </div>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div
          className="modal-overlay open"
          onClick={(e) =>
            e.target === e.currentTarget && setShowDeleteModal(false)
          }
        >
          <div className="modal">
            <div className="modal-title">Удалить аккаунт?</div>
            <div className="modal-desc">
              Это действие необратимо. Все ваши данные и история будут удалены
              навсегда.
            </div>
            <div className="modal-actions">
              <button
                className="btn-ghost"
                onClick={() => setShowDeleteModal(false)}
              >
                Отмена
              </button>
              <button className="btn-danger">
                <FiTrash2 size={13} /> Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
