import { useMeQuery } from "@/shared/api";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  console.log(token);
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

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
