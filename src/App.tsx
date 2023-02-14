
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import "./App.css";
import userDataStore from "./store/userDataStore";
import "animate.css";
import BottomNavBar from "./components/layout/BottomNavBar";

function App() {
 
  const isLogged = userDataStore((state: any) => state.isLogged);


  return (
    <div className="cde App">
      {!isLogged && <Navigate to="/connexion" />}

      <Outlet />

      <BottomNavBar />
    </div>
  );
}

export default App;
