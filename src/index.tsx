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
import ToRetrieve from "./pages/ToRetrieve";
import InProgress from "./pages/InProgress";
import Header from "./components/layout/Header";



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "in-progress",
        // element: <InProgress />,
        element: (
              <React.Fragment>
                <Header title="Commandes en cours" />
                <InProgress />
              </React.Fragment>
            )
      },
      {
        path: "orders-delivered",
        element: 
        (
          <React.Fragment>
            <Header title="Commandes déposées" />
            <OrdersDelivered />
          </React.Fragment>
        ),
      },
      {
        path: "orders-to-retrieve",
       
        element: (
          <React.Fragment>
            <Header title="Commandes à récupérer" />
            <ToRetrieve />,
          </React.Fragment>
        )
      }
    ],
  },
  {
    path: "/connexion",
    element: <Auth />,
  },
  
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
serviceWorkerRegistration.register();
reportWebVitals();
