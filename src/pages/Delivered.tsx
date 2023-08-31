import React from "react";
import { Navigate, useOutletContext } from "react-router-dom";
import userDataStore from "../store/userDataStore";
import "../App.css";
import "animate.css";
import { message } from "antd";
import { _searchWithRegex } from "../utils/functions";
import SearchBar from "../components/ui/SearchBar";
import OrderList from "../components/ui/OrderList";
import { Container } from "react-bootstrap";
import ScanPage from "../components/ui/ScanPage";
import OrdersService from "../service/Orders/OrdersService";
import PlaceHolder from "../components/ui/loading/PlaceHolder";
import AlertIsError from "../components/ui/warning/AlertIsError";

const Delivered: React.FC = () => {
  const isLogged = userDataStore((state: any) => state.isLogged)
  const [
    orderData,
    setSelectedStore,
    setSelectedOrderCity,
    allSlot,
    setSelectedItem,
    selectedStore,
    setOrderData,
    selectedOrderCity,
    setAllSlot,
    totalPages,
    setHistoryOrder,
    historyOrder,
    orderReady,
    setOrderReady,
    orderPickedUp,
    setOrderPickedUp,
    orderExpired,
    setOrderExpired,
    orderCreated,
  ] = useOutletContext<any>()

  const [isError, setIsError] = React.useState<boolean>(false)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const [selectedOrder, setSelectedOrder] = React.useState<any>('')
  const [searchOrder, setSearchOrder] = React.useState<any>('')
  const [filteredOrder, setFilteredOrder] = React.useState<any>([])
  const [storeName, setStoreName] = React.useState<any>([])
  const trigger = 'delivered'

  const [messageApi, contextHolder] = message.useMessage()

  const newStatus = 'ready_for_delivery'

  const orderByStatus = orderCreated['hydra:member']?.filter(
    (order: any) =>
      // order.status === 'created' &&
      order.bookingSlot.slot.temperatureZone.locker['@id'] === selectedStore
  )
  // const orderByStatus = orderData["hydra:member"]?.filter((order: any) => order.status === "created" && order.bookingSlot.slot.temperatureZone.locker["@id"] === selectedStore );

  React.useEffect(() => {
    // getOrderByStatus(dataStore.token, "created")
    // getOrderByPage(dataStore.token, 2)
  }, [])
  React.useEffect(() => {
    if (orderData && orderData['hydra:member']?.length > 0) {
      setIsLoading(false)
    } else {
      if (orderData && orderData['hydra:member']?.length < 0) {
        setIsError(true)
        setIsLoading(false)
      }
      setIsLoading(true)
    }
  }, [orderData])

  React.useEffect(() => {
    _searchWithRegex(searchOrder, orderByStatus, setFilteredOrder)
  }, [searchOrder])

  React.useEffect(() => {
    setStoreName(
      allSlot?.['hydra:member'] &&
        allSlot?.['hydra:member']?.filter(
          (locker: any) => locker?.slot?.temperatureZone?.locker['@id'] === selectedStore
        )
    )
  }, [selectedStore])

  const getOrderByStatus = (token: any, status: any) => {
    OrdersService.ordersByStatus(token, status)
      .then((response: any) => {
        setIsLoading(false)
        setOrderData(response.data)
      })
      .catch((error: any) => {
        setIsLoading(false)
      })
  }
  const getOrderByPage = (token: any, page: any) => {
    OrdersService.ordersByPage(token, page)
      .then((response: any) => {
        setIsLoading(false)
        setOrderData(response.data)
      })
      .catch((error: any) => {
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
  }

  const orderListProps = {
    filteredOrder,
    setSelectedOrder,
    searchOrder,
    setSearchOrder,
    orderByStatus,
    orderData,
    getOrderByPage,
    storeName,
    trigger,
  }

  const scanPageProps = {
    selectedOrder,
    setOrderData,
    messageApi,
    setSelectedOrder,
    newStatus,
  
  }


  console.log(selectedOrder)

  return (
    <>
      {!selectedOrder && (
        <>
          <div className='col-12 pb-0 text-center font-75 '>
            {storeName && storeName[0]?.slot?.temperatureZone?.locker?.location}
          </div>
          <div className='sticky-top pt-2 bg-light  '>
            <SearchBar searchBarProps={searchBarProps} />
          </div>
        </>
      )}
      <Container fluid className='cde App px-0'>
        {contextHolder}
        {!isLogged && <Navigate to='/connexion' />}
        {isError ? (
          <Container className='text-center mt-5'>
            <AlertIsError
              title="Une erreur s'est produite"
              msg='Vérifiez votre connexion internet ou contactez votre administrateur.'
              colorIcon='danger'
            />
          </Container>
        ) : isLoading ? (
          <Container className='text-center mt-2'>
            <PlaceHolder paddingYFirst='3' />
          </Container>
        ) : (
          <>
            {!selectedOrder ? (
                <OrderList orderListProps={orderListProps} />
            ) : (
              <ScanPage scanPageProps={scanPageProps} />
            )}
          </>
        )}
      </Container>
    </>
  )
};

export default Delivered;
