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
import axios from "axios";
import UserService from "../service/UserService";
import BookingSlotservice from "../service/BookingSlot/BookingSlotservice";

const InProgress: React.FC = () => {
  const isLogged = userDataStore((state: any) => state.isLogged);
  const dataStore = userDataStore((state: any) => state)
  const [selectedStore, setSelectedStore, orderData, setOrderData] =
    useOutletContext<any>();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const [selectedOrder, setSelectedOrder] = React.useState<any>("");
  const [searchOrder, setSearchOrder] = React.useState<any>("");
  const [filteredOrder, setFilteredOrder] = React.useState<any>([]);

  const [messageApi, contextHolder] = message.useMessage();

  const objectif ="delivered"

  const orderTab = orderData.filter(
    (order: any) =>
      order.status === "inProgress" && order.location === selectedStore
  );

  const [deliveries, setDeliveries] = React.useState<any>({});
  const [allUser, setAllUser] = React.useState<any>([]);
  const [user, setUser] = React.useState<any>([]);
  const [myData, setMyData] = React.useState<any>([]);
  const [allSlot, setAllSlot] = React.useState<any>([]);

  const userToken = localStorage.getItem("user");

  console.log(orderData)

  React.useEffect(() => {
    
    getDeliveries()
    getMyData(dataStore.token)
    getBookingSlot(dataStore.token)
    // getUserById("3")
  }, []);



  React.useEffect(() => {
    _searchWithRegex(searchOrder, orderTab, setFilteredOrder);
  }, [searchOrder]);


  // const filteredDeliveries = deliveries.filter((delivery: any) => )

  
  const getDeliveries = () => {
    let config = {
      method: 'get',
      // maxBodyLength: Infinity,
      url: 'http://192.168.1.250:8000/api/deliveries',
      headers: {
        Authorization:
          'Bearer ' + dataStore.token,
      },
    }

    axios
      .request(config)
      .then((response) => {
        setDeliveries(response.data)
        setOrderData(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

const getBookingSlot = (token: any) => {
  BookingSlotservice.allSlot(token)
  .then((response: any) => {
    setAllSlot(response.data)
  })
}
console.log(deliveries)

  const getMyData = (token: any) => {
    UserService.me(token)
    .then((response: any) => {
    setMyData(response.data)
  })
}
console.log(myData)



  const getAllUsers = (token: any) => {
    UserService.getAllUser(token).then((response: any) => {
      setAllUser(response.data)
    })
  }

  console.log(allUser)

  const searchBarProps = {
    searchOrder,
    setSearchOrder,
    selectedStore,
    setSelectedStore,
  };
  
  const orderListProps = {
    orderTab,
    filteredOrder,
    setSelectedOrder,
    searchOrder,
    setSearchOrder,
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

 

  return (
    <div className="cde App">
      {contextHolder}
      {(!isLogged || !userToken) && <Navigate to="/connexion" />}
      {isLoading ? (
        <Container className="text-center mt-5">
          <Loading />
        </Container>
      ) : (
        <>
          {!selectedOrder ? (
            <>
              <SearchBar searchBarProps={searchBarProps} />
              <OrderList orderListProps={orderListProps} deliveries={deliveries}/>
            </>
          ) : (
            <ScanPage scanPageProps={scanPageProps} />
          )}
        </>
      )}
    </div>
  );
};

export default InProgress;
