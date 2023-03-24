import React from "react";
import { Navigate, useOutletContext } from "react-router-dom";
import Loading from "../components/ui/Loading";
import userDataStore from "../store/userDataStore";
import "../App.css";
import "animate.css";
import { message } from "antd";
import { _searchWithRegex, _updateStatus } from "../utils/functions";
import SearchBar from "../components/ui/SearchBar";
import OrderList from "../components/ui/OrderList";
import ScanPage from "../components/ui/ScanPage";
import { Container } from "react-bootstrap";

const ToRetrieve: React.FC = () => {
  const isLogged = userDataStore((state: any) => state.isLogged);
  const [selectedStore, setSelectedStore, orderData, setOrderData] =
    useOutletContext<any>();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const [selectedOrder, setSelectedOrder] = React.useState<any>("");
  const [searchOrder, setSearchOrder] = React.useState<any>("");
  const [filteredOrder, setOrderFilter] = React.useState<any>([]);

  const [messageApi, contextHolder] = message.useMessage();

  const objectif ="inProgress"

  const orderTab = orderData.filter(
    (order: any) =>
      order.status === "toRetrieve" && order.location === selectedStore
  );

  React.useEffect(() => {
    _searchWithRegex(searchOrder, orderTab, setOrderFilter);
  }, [searchOrder]);

  const searchBarProps = {
    searchOrder,
    setSearchOrder,
    selectedStore,
    setSelectedStore,
  };

  const scanPageProps = {
    _updateStatus,
    selectedOrder,
    orderData,
    setOrderData,
    messageApi,
    setSelectedOrder,
    objectif,
  };
  const orderListProps = {
    orderTab,
    filteredOrder,
    setSelectedOrder,
    searchOrder,
    setSearchOrder,
  };

  return (
    <Container className="cde App">
      {contextHolder}
      {!isLogged && <Navigate to="/connexion" />}
      {isLoading ? (
        <Container className="text-center mt-5">
          <Loading />
        </Container>
      ) : (
        <>
          {!selectedOrder ? (
            <>
              <SearchBar searchBarProps={searchBarProps} />
              <OrderList orderListProps={orderListProps} />
            </>
          ) : (
            <ScanPage scanPageProps={scanPageProps} />
          )}
        </>
      )}
    </Container>
  );
};

export default ToRetrieve;
