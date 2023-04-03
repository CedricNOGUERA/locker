import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import "./App.css";
import userDataStore from "./store/userDataStore";
import "animate.css";
import BottomNavBar from "./components/layout/BottomNavBar";
import OrdersService from "./service/Orders/OrdersService";

function App() {
  const isLogged = userDataStore((state: any) => state.isLogged);
  const token = userDataStore((state: any) => state.token);
  const [selectedStore, setSelectedStore] = React.useState<any>("Punaauia");
  const [orderData, setOrderData] = React.useState<any>([]);





  React.useEffect(() => {
    
      getallOrders(token)
    
  }, []);





  const getallOrders = (token: any) =>{
    OrdersService.allOrders(token)
    .then((response: any) => {
      setOrderData(response.data)
    })
  }



  return (
    <div className="f">
      {!isLogged && <Navigate to="/connexion" />}

      <Outlet
        context={[selectedStore, setSelectedStore, orderData, setOrderData]}
      />
      <BottomNavBar 
      orderData={orderData}
       selectedStore={selectedStore}
       />
    </div>
  );
}

export default App;
