import "./QuizPage.css";
import { useState } from "react";
import { useAppSelector } from "@/shared/lib/hooks";
import { Sidebar } from "@/widgets/sidebar/ui/Sidebar";
import { Topbar } from "@/widgets/topbar/ui/Topbar";
import { ContextMenu } from "@/widgets/context-menu/ui/ContextMenu";
import { useActivePage } from "@/shared/lib/hooks/useActivePage";
import { useContextMenu } from "@/shared/lib/hooks/useContextMenu";
import MobileNav from "@/widgets/mobile-nav/ui/MobileNav";
import { QuizCard, MyQuizCard } from "@/entities/quiz/index";
import type { Quiz } from "@/entities/quiz/index";
import { QuizToolbar } from "@/features/quiz/filter-quizzes/ui/QuizToolbar";

const ALL_QUIZZES: Quiz[] = [
  {
    id: "1",
    image: "test",
    category: "Наука",
    questions: 18,
    title: "Великие открытия в науке XX века",
    author: { id: "user-2", name: "Мария Козлова", avatar: "МК" },
    points: 180,
    status: "published",
  },
];

const QuizesPage = () => {
  const currentUser = useAppSelector((store) => store.currentUser);
  const currentUserId = currentUser.info?.id;

  const { activePage, setActivePage } = useActivePage("all");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const { visible, type, position, show, close } = useContextMenu();

  const otherQuizzes = ALL_QUIZZES.filter(
    (q) => q.author.id !== currentUserId && q.status === "published",
  );

  const myQuizzes = ALL_QUIZZES.filter((q) => q.author.id === currentUserId);

  const published = myQuizzes.filter((q) => q.status === "published");
  const drafts = myQuizzes.filter((q) => q.status === "draft");

  const filteredOther = activeCat
    ? otherQuizzes.filter((q) => q.category === activeCat)
    : otherQuizzes;

  const handleNavigate = (page: typeof activePage) => {
    setActiveCat(null);
    setActivePage(page);
    close();
  };

  const handleFilterCat = (cat: string) => {
    setActiveCat(cat);
    setActivePage("all");
    close();
  };

  return (
    <div className="quiz-page">
      <Sidebar
        activePage={activePage}
        activeCat={activeCat}
        onNavigate={handleNavigate}
        onFilterCat={handleFilterCat}
      />

      <div className="main-area">
        <Topbar />

        <div className="page-body">
          {/* Все квизы */}
          <div className={`page-tab ${activePage === "all" ? "active" : ""}`}>
            <QuizToolbar />
            <div className="results-count">
              Найдено <span>{filteredOther.length} квиза</span>
            </div>
            <div className="quizzes-grid">
              {filteredOther.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} onMenuClick={show} />
              ))}
            </div>
          </div>

          {/* Мои квизы */}
          <div className={`page-tab ${activePage === "mine" ? "active" : ""}`}>
            <div className="results-count">
              Опубликовано <span>{published.length} квиза</span>
            </div>
            <div className="quizzes-grid">
              {published.map((quiz) => (
                <MyQuizCard key={quiz.id} quiz={quiz} onMenuClick={show} />
              ))}
            </div>
          </div>

          {/* Черновики */}
          <div
            className={`page-tab ${activePage === "drafts" ? "active" : ""}`}
          >
            <div className="results-count">
              Черновиков <span>{drafts.length}</span>
            </div>
            <div className="quizzes-grid">
              {drafts.map((quiz) => (
                <MyQuizCard key={quiz.id} quiz={quiz} onMenuClick={show} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <MobileNav activePage={activePage} onNavigate={handleNavigate} />
      <ContextMenu visible={visible} type={type} position={position} />
    </div>
  );
};

export default QuizesPage;
