import type { PageName } from "@/shared/lib/hooks/index";
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

interface SidebarProps {
  activePage: PageName;
  activeCat: string | null;
  onNavigate: (page: PageName) => void;
  onFilterCat: (cat: string) => void;
}

const NAV_ITEMS = [
  {
    id: "all" as PageName,
    icon: <MdLanguage size={15} />,
    label: "Все квизы",
  },
  {
    id: "mine" as PageName,
    icon: <MdPerson size={15} />,
    label: "Мои квизы",
  },
  {
    id: "drafts" as PageName,
    icon: <MdEdit size={15} />,
    label: "Черновики",
  },
];

const CATEGORIES = [
  { label: "Наука", icon: <MdScience size={15} /> },
  { label: "История", icon: <MdAccessTime size={15} /> },
  { label: "Технологии", icon: <MdDesktopMac size={15} /> },
  { label: "География", icon: <MdPublic size={15} /> },
  { label: "Кино", icon: <MdPlayCircle size={15} /> },
  { label: "Спорт", icon: <MdSportsSoccer size={15} /> },
];

export const Sidebar = ({
  activePage,
  activeCat,
  onNavigate,
  onFilterCat,
}: SidebarProps) => {
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
          Infinite Quiz
          <span>Квизы</span>
        </div>
      </div>

      <nav className="side-nav">
        {NAV_ITEMS.map((item) => (
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
            key={cat.label}
            className={`side-nav-item ${activeCat === cat.label ? "active" : ""}`}
            onClick={() => onFilterCat(cat.label)}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}

        <div className="nav-spacer" />
        <div className="nav-divider" />

        <button className="side-nav-item danger">
          <MdLogout size={15} />
          Выйти
        </button>
      </nav>
    </div>
  );
};
