import { useMeQuery } from "@/entities/user/index";
import { Navigate, Outlet } from "react-router-dom";

export const PublicOnlyRoute = () => {
  const token = localStorage.getItem("token");
  const { isLoading } = useMeQuery(undefined, {
    skip: !token,
  });

  if (isLoading) {
    return (
      <div className="preloader">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (token) {
    return <Navigate to="/quizzes" replace />;
  }

  return <Outlet />;
};
