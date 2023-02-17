import React from "react";
import { Navigate, useOutletContext } from "react-router-dom";
import Loading from "../components/ui/Loading";
import userDataStore from "../store/userDataStore";
import "../App.css";
import "animate.css";
import { message } from "antd";
import images from "../styles/no-order.png";
import { searchWithRegex, _notif } from "../utils/functions";
import SearchBar from "../components/ui/SearchBar";
import OrderList from "../components/ui/OrderList";
import ScanPage from "../components/ui/ScanPage";

const InProgress: React.FC = () => {
  const isLogged = userDataStore((state: any) => state.isLogged);
  const [selectedStore, setSelectedStore, orderData, setOrderData] =
    useOutletContext<any>();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isSearch, setIsSearch] = React.useState<boolean>(true);

  const [selectedOrder, setSelectedOrder] = React.useState<any>("");
  const [searchOrder, setSearchOrder] = React.useState<any>("");
  const [orderFilter, setOrderFilter] = React.useState<any>([]);

  const [messageApi, contextHolder] = message.useMessage();

  React.useEffect(() => {
    if (orderData) {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    // if (searchOrder.length > 2 && filteredOrder.length === 0) {
    //   setIsSearch(false);
    // }
    searchWithRegex(searchOrder, orderTab, setOrderFilter)

  }, [searchOrder]);
  console.log(orderFilter)

  /********************************
   * Change order status
   *******************************/

  const updateStatus = (id: any) => {
    const indx = orderData?.findIndex((order: any) => order.id === id);
    const filteredOrder = orderData?.filter((order: any) => order.id === id);

    const newTab = [...orderData];
    const newStatus = {
      id: filteredOrder[0].id,
      location: filteredOrder[0].location,
      orderNum: filteredOrder[0].orderNum,
      temp: filteredOrder[0].temp,
      numbContainer: filteredOrder[0].numbContainer,
      firstNameCustom: filteredOrder[0].firstNameCustom,
      LastNameCustom: filteredOrder[0].LastNameCustom,
      detailOrder: filteredOrder[0].detailOrder,
      status: "delivered",
    };
    newTab[indx] = newStatus;

    setOrderData(newTab);

    _notif(filteredOrder[0].id, messageApi, setSelectedOrder);

    if (filteredOrder.length > 0) {
      _notif(filteredOrder[0].id, messageApi, setSelectedOrder);
    } else {
      alert("Erreur");
    }
  };

  const orderTab = orderData.filter(
    (order: any) =>
      order.status === "inProgress" && order.location === selectedStore
  );



  return (
    <div className="cde App">
      {contextHolder}
      {!isLogged && <Navigate to="/connexion" />}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {!selectedOrder ? (
            <>
              <SearchBar
                searchOrder={searchOrder}
                setSearchOrder={setSearchOrder}
                selectedStore={selectedStore}
                setSelectedStore={setSelectedStore}
              />
              <OrderList
                orderTab={orderTab}
                filteredOrder={orderFilter}
                setSelectedOrder={setSelectedOrder}
                searchOrder={searchOrder}
                setSearchOrder={setSearchOrder}
                images={images}
              />
            </>
          ) : (
            <ScanPage
              selectedOrder={selectedOrder}
              setSelectedOrder={setSelectedOrder}
              updateStatus={updateStatus}
            />
          )}
        </>
      )}
    </div>
  );
};

export default InProgress;
