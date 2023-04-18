import React from 'react'
import { Navigate, useOutletContext } from 'react-router-dom'
import Loading from '../components/ui/Loading'
import userDataStore from '../store/userDataStore'
import '../App.css'
import 'animate.css'
import { message } from 'antd'
import { _searchWithRegex, _UpdateStatus } from '../utils/functions'
import SearchBar from '../components/ui/SearchBar'
import OrderList from '../components/ui/OrderList'
import ScanPage from '../components/ui/ScanPage'
import { Container, Placeholder } from 'react-bootstrap'
import BookingSlotservice from '../service/BookingSlot/BookingSlotservice'
import AlertIsError from '../components/ui/warning/AlertIsError'

const InProgress: React.FC = () => {

  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isError, setIsError] = React.useState<boolean>(false)
  
  //////////////////////////
  // Store & context state 
  /////////////////////////
  const isLogged = userDataStore((state: any) => state.isLogged)
  const dataStore = userDataStore((state: any) => state)
  const [selectedStore, setSelectedStore, orderData, setOrderData, selectedOrderCity, setSelectedOrderCity, allSlot, setAllSlot] = useOutletContext<any>()
  const userToken = localStorage.getItem('user')
  const [messageApi, contextHolder] = message.useMessage()


  const [selectedOrder, setSelectedOrder] = React.useState<any>('')
  const [searchOrder, setSearchOrder] = React.useState<any>('')
  const [filteredOrder, setFilteredOrder] = React.useState<any>([])

  
  
  
  
  const objectif = 'operin'


  const orderByStatus = orderData["hydra:member"]?.filter((order: any) => order.status === "created" && order.bookingSlot.slot.temperatureZone.locker.location === selectedStore)

  React.useEffect(() => {
  
    if(orderData && orderData["hydra:member"]?.length > 0){
      setIsLoading(false)
    }
    else{
      setIsLoading(true)
    }
  }, [orderData])


  React.useEffect(() => {
    _searchWithRegex(searchOrder, orderByStatus, setFilteredOrder);
  }, [searchOrder]);



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
    orderData,
    filteredOrder,
    setSelectedOrder,
    searchOrder,
    setSearchOrder,
    allSlot,
    orderByStatus,
  }

  const scanPageProps = {
    selectedOrder,
    setOrderData,
    messageApi,
    setSelectedOrder,
    objectif,
  }


  console.log(allSlot)



  return (
    <Container fluid className='cde App px-0'>
      {contextHolder}
      {(!isLogged || !userToken || !dataStore.company_name) && <Navigate to='/connexion' />}

      {isError ? (
        <Container className='text-center mt-5'>
          <AlertIsError
            title="Une erreur s'est produite"
            msg='Vérifiez votre connexion internet'
          />
        </Container>
      ) : isLoading ? (
        <Container className='text-center mt-2'>
          <Placeholder as='p' animation='glow'>
            <Placeholder xs={12} className='py-3 rounded-pill' />
          </Placeholder>
          <Placeholder as='p' animation='glow'>
            <Placeholder xs={12} className='py-4 rounded-pill' />
          </Placeholder>
          <Placeholder as='p' animation='glow'>
            <Placeholder xs={12} className='py-4 rounded-pill' />
          </Placeholder>
          <Placeholder as='p' animation='glow'>
            <Placeholder xs={12} className='py-4 rounded-pill' />
          </Placeholder>
          <Placeholder as='p' animation='glow'>
            <Placeholder xs={12} className='py-4 rounded-pill' />
          </Placeholder>
          <Placeholder as='p' animation='glow'>
            <Placeholder xs={12} className='py-4 rounded-pill' />
          </Placeholder>
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

export default InProgress
