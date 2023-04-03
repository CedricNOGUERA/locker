import React from 'react'
import { Navigate, useOutletContext } from 'react-router-dom'
import Loading from '../components/ui/Loading'
import userDataStore from '../store/userDataStore'
import '../App.css'
import 'animate.css'
import { message } from 'antd'
import { _searchWithRegex, _updateStatus } from '../utils/functions'
import SearchBar from '../components/ui/SearchBar'
import OrderList from '../components/ui/OrderList'
import ScanPage from '../components/ui/ScanPage'
import { Container } from 'react-bootstrap'
import axios from 'axios'
import UserService from '../service/UserService'
import BookingSlotservice from '../service/BookingSlot/BookingSlotservice'

const InProgress: React.FC = () => {
  const isLogged = userDataStore((state: any) => state.isLogged)
  const dataStore = userDataStore((state: any) => state)
  const [selectedStore, setSelectedStore, orderData, setOrderData] = useOutletContext<any>()

  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const [selectedOrder, setSelectedOrder] = React.useState<any>('')
  const [searchOrder, setSearchOrder] = React.useState<any>('')
  const [filteredOrder, setOrderFilter] = React.useState<any>([])

  const [messageApi, contextHolder] = message.useMessage()

  const objectif = 'delivered'

  const orderTab = orderData

  const [deliveries, setDeliveries] = React.useState<any>({})
  const [allUser, setAllUser] = React.useState<any>([])
  const [myData, setMyData] = React.useState<any>([])
  const [allSlot, setAllSlot] = React.useState<any>([])

  const userToken = localStorage.getItem('user')

  const progress = orderData["hydra:member"]?.filter((order: any) => order.status === "operin")

  React.useEffect(() => {
    getDeliveries()
    getMyData(dataStore.token)
    getBookingAllSlot(dataStore.token)
  }, [])


  // React.useEffect(() => {
  //   _searchWithRegex(searchOrder, orderData, setOrderFilter);
  // }, [searchOrder]);

  const getDeliveries = () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://192.168.1.186:8000/api/orders',
      headers: {
        Authorization: 'Bearer ' + dataStore.token,
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

  // const getBookingSlot = (token: any, id: any) => {
  //   BookingSlotservice.slot(token, id)
  //   .then((response: any) => {
  //     setAllSlot(response.data)
  //   })
  // }

  const getBookingAllSlot = (token: any) => {
    BookingSlotservice.allSlot(token).then((response: any) => {
      setAllSlot(response.data)
    })
  }

  const getMyData = (token: any) => {
    UserService.me(token).then((response: any) => {
      setMyData(response.data)
    })
  }



  const searchBarProps = {
    searchOrder,
    setSearchOrder,
    selectedStore,
    setSelectedStore,
    allSlot,
  }

  const orderListProps = {
    orderData,
    filteredOrder,
    setSelectedOrder,
    searchOrder,
    setSearchOrder,
    allSlot,
    progress,
  }

  const scanPageProps = {
    _updateStatus,
    selectedOrder,
    orderData,
    setOrderData,
    messageApi,
    setSelectedOrder,
    objectif,
  }

  return (
    <div className='cde App'>
      {contextHolder}
      {(!isLogged || !userToken) && <Navigate to='/connexion' />}
      {isLoading ? (
        <Container className='text-center mt-5'>
          <Loading />
        </Container>
      ) : (
        <>
          {!selectedOrder ? (
            <>
              <SearchBar searchBarProps={searchBarProps} />
              <OrderList orderListProps={orderListProps} deliveries={deliveries} />
            </>
          ) : (
            <ScanPage scanPageProps={scanPageProps} />
          )}
        </>
      )}
    </div>
  )
}

export default InProgress
