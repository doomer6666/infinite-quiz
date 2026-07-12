import { useMeQuery } from "@/shared/api";
import { useAppSelector } from "@/shared/lib/hooks";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const token = useAppSelector((state) => state.currentUser.token);
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
