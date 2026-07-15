import { useLogoutUserMutation } from "@/entities/user/index";
import { PageNameEnum, type PageName } from "@/shared/lib/hooks/index";
import {
  MdLanguage,
  MdPerson,
  MdEdit,
  MdScience,
  MdAccessTime,
  MdDesktopMac,
  MdPublic,
  MdPlayCircle,
  MdSportsSoccer,
  MdLogout,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  activePage: PageName;
  activeCat: string | null;
  role: string;
  onNavigate: (page: PageName) => void;
  onFilterCat: (cat: string) => void;
}

const NAV_ITEMS = [
  {
    id: PageNameEnum.all,
    icon: <MdLanguage size={15} />,
    label: "Все квизы",
    roles: ["member", "host"],
  },
  {
    id: PageNameEnum.mine,
    icon: <MdPerson size={15} />,
    label: "Мои квизы",
    roles: ["host"],
  },
  {
    id: PageNameEnum.drafts,
    icon: <MdEdit size={15} />,
    label: "Черновики",
    roles: ["host"],
  },
];

const CATEGORIES = [
  { label: "Наука", value: "science", icon: <MdScience size={15} /> },
  { label: "История", value: "history", icon: <MdAccessTime size={15} /> },
  {
    label: "Технологии",
    value: "technologies",
    icon: <MdDesktopMac size={15} />,
  },
  { label: "География", value: "geography", icon: <MdPublic size={15} /> },
  { label: "Кино", value: "movie", icon: <MdPlayCircle size={15} /> },
  { label: "Спорт", value: "sports", icon: <MdSportsSoccer size={15} /> },
];

export const Sidebar = ({
  activePage,
  activeCat,
  role,
  onNavigate,
  onFilterCat,
}: SidebarProps) => {
  const visibleNav = NAV_ITEMS.filter((item) => item.roles.includes(role));
  const [logoutUser] = useLogoutUserMutation();
  const navigate = useNavigate();
  const onLogout = async () => {
    await logoutUser(localStorage.getItem("token") ?? "");
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="side-panel">
      <div className="side-logo">
        <div className="side-logo-icon">
          <div className="side-logo-grid">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className="side-logo-text">
          Infinite Quiz<span>Квизы</span>
        </div>
      </div>

      <nav className="side-nav">
        {visibleNav.map((item) => (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            className={`side-nav-item ${activePage === item.id && !activeCat ? "active" : ""}`}
            onClick={() => onNavigate(item.id)}
          >
            {item.icon}
            {item.label}
          </button>
        ))}

        <div className="side-nav-section">Категории</div>

        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            className={`side-nav-item ${activeCat === cat.value ? "active" : ""}`}
            onClick={() => onFilterCat(cat.value)}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}

        <div className="nav-spacer" />
        <div className="nav-divider" />

        <button className="side-nav-item danger" onClick={onLogout}>
          <MdLogout size={15} />
          Выйти
        </button>
      </nav>
    </div>
  );
};
