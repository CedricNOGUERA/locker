import React from 'react'
import { Navigate, useOutletContext } from 'react-router-dom'
import { message } from 'antd'
import { Container } from 'react-bootstrap'
import userDataStore from '../store/userDataStore'
import { _searchWithRegex } from '../utils/functions'
import SearchBar from '../components/ui/SearchBar'
import OrderList from '../components/ui/OrderList'
import ScanPage from '../components/ui/ScanPage'
import AlertIsError from '../components/ui/warning/AlertIsError'
import PlaceHolder from '../components/ui/loading/PlaceHolder'
import '../App.css'
import 'animate.css'

const InProgress: React.FC = () => {
  //////////////////////////
  // booleans States
  /////////////////////////
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isError, setIsError] = React.useState<boolean>(false)

  //////////////////////////
  // Store & context state
  /////////////////////////
  const isLogged = userDataStore((state: any) => state.isLogged)
  const dataStore = userDataStore((state: any) => state)
  const [
    selectedStore,
    setSelectedStore,
    orderData,
    setOrderData,
    selectedOrderCity,
    setSelectedOrderCity,
    allSlot,
    setAllSlot,
  ] = useOutletContext<any>()
  const userToken = localStorage.getItem('user')
  const [messageApi, contextHolder] = message.useMessage()

  const [selectedOrder, setSelectedOrder] = React.useState<any>('')
  const [searchOrder, setSearchOrder] = React.useState<any>('')
  const [filteredOrder, setFilteredOrder] = React.useState<any>([])

  const objectif = 'operin'

  const orderByStatus = orderData['hydra:member']?.filter(
    (order: any) =>
      order.status === 'created' &&
      order.bookingSlot.slot.temperatureZone.locker.location === selectedStore
  )

  React.useEffect(() => {
    if (orderByStatus && orderData && orderData['hydra:member']?.length > 0) {
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



  return (
    <Container fluid className='cde App px-0'>
      {contextHolder}
      {(!isLogged || !userToken || !dataStore.company_name) && <Navigate to='/connexion' />}

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
