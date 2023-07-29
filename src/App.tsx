import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import './App.css'
import userDataStore from './store/userDataStore'
import 'animate.css'
import BottomNavBar from './components/layout/BottomNavBar'
import OrdersService from './service/Orders/OrdersService'
import Loading from './components/ui/Loading'
import { Container } from 'react-bootstrap'
import BookingSlotservice from './service/BookingSlot/BookingSlotservice'

function App() {
  /////////////////////
  //States
  ////////////////////
  const isLogged = userDataStore((state: any) => state.isLogged)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const token = userDataStore((state: any) => state.token)

  const [selectedStore, setSelectedStore] = React.useState<any>('')
  const [allSlot, setAllSlot] = React.useState<any>([])
  const [selectedOrderCity, setSelectedOrderCity] = React.useState<any>('')
  const [orderData, setOrderData] = React.useState<any>([])
  const [selectedItem, setSelectedItem] = React.useState<string>('home')

  /////////////////////
  //UseEffect
  ////////////////////
  React.useEffect(() => {
    if (token && token?.length > 0) {
      getallOrders(token)
      getBookingAllSlot(token)
    }
  }, [token])

  React.useEffect(() => {
    setSelectedOrderCity(
      allSlot?.['hydra:member']
        ? allSlot?.['hydra:member'][0]?.slot?.temperatureZone.locker.city
        : ''
    )
    setSelectedStore(
      allSlot?.['hydra:member']
        ? allSlot?.['hydra:member'][0]?.slot?.temperatureZone.locker['@id']
        : ''
    )
  }, [allSlot])

  /////////////////////
  //Events
  ////////////////////

  const getallOrders = (token: any) => {
    OrdersService.allOrders(token)
      .then((response: any) => {
        setIsLoading(false)
        setOrderData(response.data)
      })
      .catch((error: any) => {
        setIsLoading(false)
      })
  }

  const getBookingAllSlot = (token: any) => {
    BookingSlotservice.allSlot(token).then((response: any) => {
      setAllSlot(response.data)
    })
  }
  return (
    <div className=''>
      {!isLogged && <Navigate to='/connexion' />}
      {isLoading ? (
        <>
          <Container className='text-center pt-5 vh-100'>
            <Loading vairant='warning' className='' />
          </Container>
        </>
      ) : (
        <Outlet
          context={[
            selectedStore,
            setSelectedStore,
            orderData,
            setOrderData,
            selectedOrderCity,
            setSelectedOrderCity,
            allSlot,
            setAllSlot,
            selectedItem,
            setSelectedItem,
          ]}
        />
      )}
      <BottomNavBar
        orderData={orderData}
        selectedStore={selectedStore}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />
    </div>
  )
}

export default App
