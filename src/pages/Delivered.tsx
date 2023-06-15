import React from "react";
import { Navigate, useOutletContext } from "react-router-dom";
import Loading from "../components/ui/Loading";
import userDataStore from "../store/userDataStore";
import "../App.css";
import "animate.css";
import { message } from "antd";
import { _searchWithRegex } from "../utils/functions";
import SearchBar from "../components/ui/SearchBar";
import OrderList from "../components/ui/OrderList";
// import ScanPage from "../components/ui/ScanPage";
import { Container } from "react-bootstrap";
import ScanPageDelivered from "../components/ui/ScanPageDelivered";
import ScanPage from "../components/ui/ScanPage";
import OrdersService from "../service/Orders/OrdersService";

const Delivered: React.FC = () => {
  const isLogged = userDataStore((state: any) => state.isLogged);
  const [selectedStore, setSelectedStore, orderData, setOrderData, selectedOrderCity, setSelectedOrderCity,  allSlot, setAllSlot] = useOutletContext<any>()


  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const [selectedOrder, setSelectedOrder] = React.useState<any>("");
  const [searchOrder, setSearchOrder] = React.useState<any>("");
  const [filteredOrder, setFilteredOrder] = React.useState<any>([]);

  const [messageApi, contextHolder] = message.useMessage();

  const  newStatus ="overtime"

  const orderByStatus = orderData["hydra:member"]?.filter((order: any) => order.status === "operin" && order.bookingSlot.slot.temperatureZone.locker.location === selectedStore );


  React.useEffect(() => {
  
    if(orderData && orderData["hydra:member"]?.length > 0){
      setIsLoading(false)
    }
    else{
      // setIsError(true)
      setIsLoading(true)
    }
      
  }, [orderData])


  React.useEffect(() => {
    _searchWithRegex(searchOrder, orderByStatus, setFilteredOrder);
  }, [searchOrder]);


  
  const getOrderByPage = (token: any, page: any) => {
    OrdersService.ordersByPage(token, page).then((response: any) => {
      setIsLoading(false)
      setOrderData(response.data)
    }).catch((error: any) => {
      setIsLoading(false)
      
    })
  }




  const searchBarProps = {
    searchOrder,
    setSearchOrder,
    selectedStore,
    setSelectedStore,
    selectedOrderCity,
    setSelectedOrderCity,
    allSlot,

  };

  const orderListProps = {
    // orderTab,
    filteredOrder,
    setSelectedOrder,
    searchOrder,
    setSearchOrder,
    orderByStatus,
    orderData,
    getOrderByPage,
  };
  
  const scanPageProps = {
   
    selectedOrder,
    setOrderData,
    messageApi,
    setSelectedOrder,
     newStatus,
  };

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
  );
};

export default Delivered;
