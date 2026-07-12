import { useState } from "react";
import {
  MdSearch,
  MdKeyboardArrowDown,
  MdGridView,
  MdViewList,
} from "react-icons/md";

type FilterType = "all" | "popular" | "new";

const FILTERS: { id: FilterType; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "popular", label: "Популярные" },
  { id: "new", label: "Новые" },
];

export const QuizToolbar = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [activeView, setActiveView] = useState<"grid" | "list">("grid");

  return (
    <div className="toolbar">
      <div className="search-wrap">
        <span className="search-icon">
          <MdSearch size={16} />
        </span>
        <input className="search-input" placeholder="Поиск квизов..." />
      </div>

      <div className="filter-group">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={`filter-btn ${activeFilter === f.id ? "active" : ""}`}
            onClick={() => setActiveFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="sort-select-wrap">
        <select className="sort-select">
          <option>По дате</option>
          <option>По рейтингу</option>
          <option>По названию</option>
        </select>
        <span className="sort-arrow">
          <MdKeyboardArrowDown size={14} />
        </span>
      </div>

      <div className="view-toggle">
        <button
          className={`view-btn ${activeView === "grid" ? "active" : ""}`}
          onClick={() => setActiveView("grid")}
        >
          <MdGridView size={16} />
        </button>
        <button
          className={`view-btn ${activeView === "list" ? "active" : ""}`}
          onClick={() => setActiveView("list")}
        >
          <MdViewList size={16} />
        </button>
      </div>
    </div>
  );
};
