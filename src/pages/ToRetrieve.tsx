import React from 'react'
import { Navigate, useOutletContext } from 'react-router-dom'
import userDataStore from '../store/userDataStore'
import { message } from 'antd'
import { Container } from 'react-bootstrap'
import { _searchWithRegex } from '../utils/functions'
import SearchBar from '../components/ui/SearchBar'
import OrderList from '../components/ui/OrderList'
import ScanPage from '../components/ui/ScanPage'
import AlertIsError from '../components/ui/warning/AlertIsError'
import PlaceHolder from '../components/ui/loading/PlaceHolder'
import '../App.css'
import 'animate.css'
import OrdersService from '../service/Orders/OrdersService'

const ToRetrieve: React.FC = () => {
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
  ] = useOutletContext<any>()
  const [messageApi, contextHolder] = message.useMessage()
  const [uniqueTab, setUniqueTab] = React.useState<any>([])


  //////////////////////////
  // States
  /////////////////////////
  const [selectedOrder, setSelectedOrder] = React.useState<any>('')
  const [searchOrder, setSearchOrder] = React.useState<any>('')
  const [filteredOrder, setFilteredOrder] = React.useState<any>([])
  const [storeName, setStoreName] = React.useState<any>([])

  const newStatus = 'operout'

  const orderByStatus = orderExpired['hydra:member']?.filter(
    (order: any) =>
      order.bookingSlot.slot.temperatureZone.locker &&
      order.bookingSlot.slot.temperatureZone.locker['@id'] === selectedStore
  )
 

  //////////////////////////
  // UseEffect
  /////////////////////////

  React.useEffect(() => {
    setIsLoading(true)
    setSelectedItem('retrieve')
  }, [])
  React.useEffect(() => {
    const bookingLocker: any = allSlot?.['hydra:member']?.map(
      (locker: any) => locker?.slot?.temperatureZone?.locker
    )
    const deduplicate: any = [
      ...new Set(bookingLocker?.map((locker: any) => locker?.location)),
    ]
    setUniqueTab(deduplicate)
  }, [allSlot])

  React.useEffect(() => {
    if (orderByStatus && orderData && orderData['hydra:member']?.length > 0) {
      setIsLoading(false)
    } else {
      if (orderData && orderData['hydra:member']?.length < 0) {
        setIsError(true)
        setIsLoading(false)
      }
      setIsLoading(false)
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


   //////////////////////////
  // Events
  /////////////////////////
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

  //////////////////////////
  // Component Props
  /////////////////////////
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
  }

  const scanPageProps = {
    selectedOrder,
    setOrderData,
    messageApi,
    setSelectedOrder,
    newStatus,
  }

  return (
    <>
      {!selectedOrder && (
        <>
        {uniqueTab?.length > 1 && (
          <div className='col-12 pb-0 text-center text-light font-75 '>
            {storeName && storeName[0]?.slot?.temperatureZone?.locker?.location}
          </div>
            )}
          <div className='sticky-top pt-2'>
            <SearchBar searchBarProps={searchBarProps} />
          </div>
        </>
      )}
      <Container fluid className='cde App px-0'>
        {contextHolder}
        {(!isLogged || !dataStore.token || !dataStore.company_name) && (
          <Navigate to='/connexion' />
        )}

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
}

export default ToRetrieve
