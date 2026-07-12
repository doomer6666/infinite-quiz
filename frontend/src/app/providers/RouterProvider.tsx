import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "../../pages/LoginPage/LoginPage";
import InitialLayout from "../../shared/ui/layouts/InitialLayout";
import RegistrationPage from "../../pages/RegistrationPage/RegistrationPage";
import { ProtectedRoute } from "./ProtectedRoute";
import QuizesPage from "../../pages/QuizesPage/QuizesPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <InitialLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "registration",
        element: <RegistrationPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/quizes",
        element: <QuizesPage />,
      },
    ],
  },
]);

export const AppRouterProvider = () => {
  return <RouterProvider router={router} />;
};
