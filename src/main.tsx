import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import App from "./App";
import ErrorPage from "./components/error-page";
import Database from "./routes/Database"
import RegisterExcess from "./routes/RegisterExcess"
import ExcessPart from "./routes/ExcessPart";
import Confirmation from "./routes/Cofirmation";

const rootContainer = document.getElementById("root");

if (!rootContainer) {
  throw new Error("Root container element not found");
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage />,
  },
  {
    path:"/database",
    element: <Database />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/regex",
    element: <RegisterExcess />,
    errorElement: <ErrorPage />,
  },
  {
    path:"/excess",
    element: <ExcessPart/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/confirmation",
    element: <Confirmation />,
    errorElement: <ErrorPage />,
  }
  


]);

ReactDOM.createRoot(rootContainer).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
