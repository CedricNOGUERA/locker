import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Auth from "./components/Auth";
import 'animate.css';
import OrdersDelivered from "./pages/OrdersDelivered";
import BottomNavBar from "./components/BottomNavBar";
import ToRetrieve from "./pages/ToRetrieve";



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/connexion",
    element: <Auth />,
  },
  {
    path: "/orders-delivered",
    element: <OrdersDelivered />,
  },
  {
    path: "/orders-to-retrieve",
    element: <ToRetrieve />,
  }
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
        <RouterProvider router={router} />
  <BottomNavBar />
  </React.StrictMode>
);
serviceWorkerRegistration.register();
reportWebVitals();
