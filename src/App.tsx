import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import "./App.css";
import userDataStore from "./store/userDataStore";
import "animate.css";
import BottomNavBar from "./components/layout/BottomNavBar";
import { commandes } from "./data/commandes2";

function App() {
  const isLogged = userDataStore((state: any) => state.isLogged);
  const [selectedStore, setSelectedStore] = React.useState<any>("Punaauia");
  const [orderData, setOrderData] = React.useState<any>(commandes);

  return (
    <div className="">
      {!isLogged && <Navigate to="/connexion" />}

      <Outlet
        context={[selectedStore, setSelectedStore, orderData, setOrderData]}
      />

      <BottomNavBar commandes={orderData} selectedStore={selectedStore} />
    </div>
  );
}

export default App;
