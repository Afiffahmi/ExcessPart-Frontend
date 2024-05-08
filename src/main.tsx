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
import ConsumeList from"./routes/ConsumeList";
import ConsumeHistory from"./routes/ConsumeHistory";
import Login from "./routes/Login";
import Protected from "./components/Protected";
import Register from "./routes/Register";



const rootContainer = document.getElementById("root");

if (!rootContainer) {
  throw new Error("Root container element not found");
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Protected Component={App}/>,
    errorElement: <ErrorPage />,
  },
  {
    path:"/database",
    element: <Protected Component={Database}/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/regex",
    element: <Protected Component={RegisterExcess}/>,
    errorElement: <ErrorPage />,
  },
  {
    path:"/excess",
    element: <Protected Component={ExcessPart}/>,
    errorElement: <ErrorPage />,
    
  },
  {
    path: "/confirmation",
    element: <Protected Component={Confirmation}/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/consume",
    element: <Protected Component={ConsumeList}/>,
    errorElement: <ErrorPage/>
  },
  {
    path: "/history",
    element: <Protected Component={ConsumeHistory}/>,
    errorElement: <ErrorPage/>
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />
  },
  {
    path: '/register',
    element: <Register />,
    errorElement: <ErrorPage />
  }
  


]);

ReactDOM.createRoot(rootContainer).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
