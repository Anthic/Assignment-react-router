import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../MainLayout/MainLayout";
import HomePage from "../Pages/HomePage";
import PredictionPage from "../Pages/PredictionPage";
import ContactPage from "../Pages/ContactPage";
import LoginPage from "../Pages/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/prediction",
        element: <PredictionPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },
]);
