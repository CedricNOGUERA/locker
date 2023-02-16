import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import "./App.css";
import userDataStore from "./store/userDataStore";
import "animate.css";
import BottomNavBar from "./components/layout/BottomNavBar";
import { commandes } from "./data/commandes";

function App() {
  const isLogged = userDataStore((state: any) => state.isLogged);
  const [selectedStore, setSelectedStore] = React.useState<any>("Arue");


  let cdes: any = commandes;

  return (
    <div className="cde App">
      {!isLogged && <Navigate to="/connexion" />}

      <Outlet context={[selectedStore, setSelectedStore]} />

      <BottomNavBar commandes={cdes} selectedStore={selectedStore} />
    </div>
  );
}

export default App;
