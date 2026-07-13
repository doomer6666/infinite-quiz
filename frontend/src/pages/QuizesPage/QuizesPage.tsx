import "./QuizPage.css";
import { useState } from "react";
import { Sidebar } from "@/widgets/sidebar/ui/Sidebar";
import { Topbar } from "@/widgets/topbar/ui/Topbar";
import { ContextMenu } from "@/widgets/context-menu/ui/ContextMenu";
import { useActivePage } from "@/shared/lib/hooks/useActivePage";
import { useContextMenu } from "@/shared/lib/hooks/useContextMenu";
import MobileNav from "@/widgets/mobile-nav/ui/MobileNav";
import {
  QuizCard,
  MyQuizCard,
  useGetQuizListQuery,
} from "@/entities/quiz/index";
import { QuizToolbar } from "@/features/quiz/filter-quizzes/ui/QuizToolbar";
import { useMeQuery } from "@/entities/user/index";

const QuizesPage = () => {
  const {
    data: currentUser,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useMeQuery();
  const { data: quizList = [], isLoading: quizesIsLoading } =
    useGetQuizListQuery();

  const { activePage, setActivePage } = useActivePage("all");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const { visible, type, position, show, close } = useContextMenu();

  if (isUserError || !currentUser) {
    return <div>User not found!</div>;
  }

  const currentUserId = currentUser.id;
  const otherQuizzes = quizList.filter(
    (q) => q.hostId !== currentUserId && q.status === "published",
  );

  const myQuizzes = quizList.filter((q) => q.hostId === currentUserId);

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

  if (quizesIsLoading || isUserLoading) {
    return <div>Loading...</div>;
  }
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
                <QuizCard
                  key={quiz._id ?? quiz.title}
                  quiz={quiz}
                  onMenuClick={show}
                />
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
                <MyQuizCard
                  key={quiz._id ?? quiz.title}
                  quiz={quiz}
                  onMenuClick={show}
                />
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
                <MyQuizCard
                  key={quiz._id ?? quiz.title}
                  quiz={quiz}
                  onMenuClick={show}
                />
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
