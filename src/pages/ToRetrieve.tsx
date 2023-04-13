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
import BookingSlotservice from "../service/BookingSlot/BookingSlotservice";

const ToRetrieve: React.FC = () => {
  const isLogged = userDataStore((state: any) => state.isLogged);
  const dataStore = userDataStore((state: any) => state);
  const [selectedStore, setSelectedStore, orderData, setOrderData, selectedOrderCity, setSelectedOrderCity] = useOutletContext<any>()


  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const [selectedOrder, setSelectedOrder] = React.useState<any>("");
  const [searchOrder, setSearchOrder] = React.useState<any>("");
  const [filteredOrder, setFilteredOrder] = React.useState<any>([]);
  const [allSlot, setAllSlot] = React.useState<any>([])

  const [messageApi, contextHolder] = message.useMessage();

  const objectif ="inProgress"

  // const orderTab = orderData.filter(
  //   (order: any) =>
  //     order.status === "toRetrieve" && order.location === selectedStore
  // );
  const progress = orderData["hydra:member"]?.filter((order: any) => order.status === "operout" && order.bookingSlot.slot.temperatureZone.locker.location === selectedStore)

  React.useEffect(() => {
   
    getBookingAllSlot(dataStore.token)
  }, [])


  React.useEffect(() => {
    _searchWithRegex(searchOrder, progress, setFilteredOrder);
  }, [searchOrder]);




  const getBookingAllSlot = (token: any) => {
    BookingSlotservice.allSlot(token).then((response: any) => {
      setAllSlot(response.data)
    })
  }
  const searchBarProps = {
    searchOrder,
    setSearchOrder,
    selectedStore,
    setSelectedStore,
    selectedOrderCity,
    setSelectedOrderCity,
    allSlot
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
    // orderTab,
    filteredOrder,
    setSelectedOrder,
    searchOrder,
    setSearchOrder,
    progress
  };

  console.log(filteredOrder)

  return (
    <Container fluid className="cde App px-0">
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
  )
}

export default ToRetrieve;
