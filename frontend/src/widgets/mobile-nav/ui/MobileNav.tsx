import { MdLanguage, MdPerson, MdEdit } from "react-icons/md";
import { PageNameEnum, type PageName } from "@/shared/lib/hooks/index";

interface MobileNavProps {
  activePage: PageName;
  onNavigate: (page: PageName) => void;
}

const NAV_ITEMS = [
  { id: PageNameEnum.all, icon: <MdLanguage size={22} />, label: "Все квизы" },
  { id: PageNameEnum.mine, icon: <MdPerson size={22} />, label: "Мои" },
  { id: PageNameEnum.drafts, icon: <MdEdit size={22} />, label: "Черновики" },
];

const MobileNav = ({ activePage, onNavigate }: MobileNavProps) => {
  return (
    <div className="mobile-nav">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          id={`mnav-${item.id}`}
          className={`mobile-nav-item ${activePage === item.id ? "active" : ""}`}
          onClick={() => onNavigate(item.id)}
        >
          <div className="mobile-nav-icon">{item.icon}</div>
          <span className="mobile-nav-label">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default MobileNav;
