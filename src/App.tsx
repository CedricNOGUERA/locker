import React from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import './App.css'
import userDataStore from './store/userDataStore'
import 'animate.css'
import BottomNavBar from './components/layout/BottomNavBar'
import OrdersService from './service/Orders/OrdersService'
import Loading from './components/ui/Loading'
import { Button, Container } from 'react-bootstrap'
import BookingSlotservice from './service/BookingSlot/BookingSlotservice'

function App() {
  /////////////////////
  //States
  ////////////////////
  const isLogged = userDataStore((state: any) => state.isLogged)
  const authLogout = userDataStore((state: any) => state.authLogout)
  const token = userDataStore((state: any) => state.token)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [expireToken, setExpireToken] = React.useState<boolean>(false)

  const [selectedStore, setSelectedStore] = React.useState<any>('')
  const [allSlot, setAllSlot] = React.useState<any>([])
  const [selectedOrderCity, setSelectedOrderCity] = React.useState<any>('')
  const [orderData, setOrderData] = React.useState<any>([])
  const [selectedItem, setSelectedItem] = React.useState<string>('home')
  const [orderReady, setOrderReady] = React.useState<any>([])
  const [orderPickedUp, setOrderPickedUp] = React.useState<any>([])
  const [orderExpired, setOrderExpired] = React.useState<any>([])
  const [orderCreated, setOrderCreated] = React.useState<any>([])

  const [allOrder, setAllOrder] = React.useState<any>([])
  const [historyOrder, setHistoryOrder] = React.useState<any>([])
  const [orderByPage, setOrderByPage] = React.useState<any>([])
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage: number = 30 // Nombre d'éléments par page

  const [origin, setOrigin] = React.useState(window?.history?.state.key)
  const navigate = useNavigate()
  const [isOnline, setIsOnline] = React.useState(window.navigator.onLine)

  const handleOnline = () => {
    setIsOnline(true)
  }

  const handleOffline = () => {
    setIsOnline(false)
    alert('Connexion perdue, reconnectez-vous')
    authLogout()
  }

  /////////////////////
  //UseEffect
  ////////////////////
  React.useEffect(() => {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const currentDate = new Date()
  const sevenDaysAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000)

  const formattedDate = `${sevenDaysAgo.getFullYear()}-${String(
    sevenDaysAgo.getMonth() + 1
  ).padStart(2, '0')}-${String(sevenDaysAgo.getDate()).padStart(2, '0')}`


  React.useEffect(() => {
    if (token && token?.length > 0) {
      getallOrders(token)
      getOrdersByStatus(token, 'ready_for_delivery', setOrderReady)
      getOrdersByStatus(token, 'picked_up', setOrderPickedUp)
      getOrdersByStatus(token, 'overtime', setOrderExpired)
      getOrdersByStatus(token, 'created', setOrderCreated)
      getBookingAllSlot(token)
    }
  }, [token])

  React.useEffect(() => {
    if (orderData['hydra:member']?.length > 29) {
      getOrderByPages(token, 2, setOrderByPage)
    }
  }, [orderData])

  React.useEffect(() => {
    setAllOrder(orderData['hydra:member']?.concat(orderByPage))
  }, [orderByPage])

  React.useEffect(() => {
    setSelectedOrderCity(
      allSlot?.['hydra:member']
        ? allSlot?.['hydra:member'][0]?.slot?.temperatureZone?.locker?.city
        : ''
    )
    setSelectedStore(
      allSlot?.['hydra:member']
        ? allSlot?.['hydra:member'][0]?.slot?.temperatureZone?.locker &&
            // allSlot?.['hydra:member'][0]?.slot?.temperatureZone?.locker?.shortLocation
            allSlot?.['hydra:member'][0]?.slot?.temperatureZone?.locker['@id']
        : ''
    )
  }, [allSlot])

  const totalPages = Math.ceil(allOrder && allOrder?.length / itemsPerPage);
  // const totalPages = 1

  /////////////////////
  //Events
  ////////////////////
  const expiredToken = (error: any) => {
    if (!expireToken) {
      if (error?.response?.data?.message === 'Expired JWT Token') {
        setExpireToken(true)
        alert('Session expirée, reconnectez-vous.')
        console.log('allOrder_app')
        authLogout()
        return
      }
      if (error?.response?.data?.message === 'Invalid JWT Token') {
        setExpireToken(true)
        alert('Token invalide, reconnectez-vous.')
        authLogout()
        return
      }
    }
  }

  const getallOrders = (token: any) => {
    OrdersService.allOrders(token)
      .then((response: any) => {
        setIsLoading(false)
        setOrderData(response.data)
      })
      .catch((error: any) => {
        setIsLoading(false)
        expiredToken(error)
        console.log(error)
      })
  }
  const getOrdersByDate = (token: any, date: any) => {
    OrdersService.ordersByDate(token, date)
      .then((response: any) => {
        setIsLoading(false)
        setOrderData(response.data)
      })
      .catch((error: any) => {
        setIsLoading(false)
        expiredToken(error)
        console.log(error)
      })
  }

  const getOrderByPages = (token: any, page: any, setData: any) => {
    OrdersService.ordersByPage(token, page)
      .then((response: any) => {
        setIsLoading(false)
        setData(response.data['hydra:member'])

        console.log(response.data)
      })
      .catch((error: any) => {
        setIsLoading(false)
      })
  }

  const getOrdersByStatus = (token: any, status: any, setData: any) => {
    OrdersService.ordersByStatus(token, status)
      .then((response: any) => {
        setIsLoading(false)
        setData(response.data)
      })
      .catch((error: any) => {
        console.log(error)

        setIsLoading(false)
      })
  }

  const getBookingAllSlot = (token: any) => {
    BookingSlotservice.allSlot(token)
      .then((response: any) => {
        setAllSlot(response.data)
      })
      .catch((error: any) => {
        setIsLoading(false)
        console.log(error)
      })
  }

  const bottomProps = {
    orderReady,
    orderPickedUp,
    orderExpired,
  }



  return (
    <div className='first-block 
    bg-darkGray
    '>
      {!isLogged && <Navigate to='/connexion' />}
      {isLoading ? (
        <>
          <Container className='text-center pt-5 vh-100'>
            <Loading vairant='warning' className='' />
          </Container>
        </>
      ) : (
        <>
          <Outlet
            context={[
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
              setOrderCreated,
              selectedItem,
              expireToken,
              setExpireToken,
              allOrder,
            ]}
          />
        </>
      )}

      <BottomNavBar
        orderData={orderData}
        selectedStore={selectedStore}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        bottomProps={bottomProps}
      />
    </div>
  )
}

export default App
