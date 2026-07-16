import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "../../pages/LoginPage/LoginPage";
import InitialLayout from "../../shared/ui/layouts/InitialLayout";
import RegistrationPage from "../../pages/RegistrationPage/RegistrationPage";
import { ProtectedRoute } from "./ProtectedRoute";
import QuizesPage from "../../pages/QuizesPage/QuizesPage";
import { PublicOnlyRoute } from "./PublicOnlyRoute";
import { QuizEditorPage } from "@/pages/QuizEditorPage/index";

const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [
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
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/quizzes",
        element: <QuizesPage />,
      },
      {
        path: "/quizzes/create",
        element: <QuizEditorPage />,
      },
      {
        path: "/quizzes/:id/edit",
        element: <QuizEditorPage />,
      },
    ],
  },
]);

export const AppRouterProvider = () => {
  return <RouterProvider router={router} />;
};
