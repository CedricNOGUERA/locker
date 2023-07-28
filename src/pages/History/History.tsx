import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import ItemList from '../../components/ui/ItemList'
import { _searchWithRegex } from '../../utils/functions'
import images from '../../styles/no-order-min.png'
import PlaceHolder from '../../components/ui/loading/PlaceHolder'
import TopSearchBar from '../../components/history/TopSearchBar'
import DetailHistory from '../../components/history/DetailHistory'
import AlertIsError from '../../components/ui/warning/AlertIsError'
import OrderList from '../../components/ui/OrderList'

const History = () => {
  //////////////////////////
  // booleans States
  /////////////////////////
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isError, setIsError] = React.useState<boolean>(false)

  //////////////////////////
  // Store & context state
  /////////////////////////
  const [
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
  ] = useOutletContext<any>()

  //////////////////////////
  // States
  /////////////////////////
  const [selectedOrder, setSelectedOrder] = React.useState<any>('')
  const [searchOrder, setSearchOrder] = React.useState<any>('')
  const [filteredOrder, setFilteredOrder] = React.useState<any>([])
  const [orderByStatus, setOrderByStatus] = React.useState<any>([])

  const trigger ="history"

  React.useEffect(() => {
    setIsLoading(true)
    setSelectedItem('user')
    setOrderByStatus(orderData['hydra:member'])
  }, [])

  React.useEffect(() => {
    if (
      (orderData && orderData['hydra:member']?.length > 0) ||
      (filteredOrder && filteredOrder['hydra:member']?.lenght > 0)
    ) {
      setIsLoading(false)
    } else {
      if (
        (orderData && orderData['hydra:member']?.length < 0) ||
        (filteredOrder && filteredOrder['hydra:member']?.lenght < 0)
      ) {
        setIsError(true)
        setIsLoading(false)
      }
      setIsLoading(false)
    }
  }, [orderData])

  React.useEffect(() => {
    _searchWithRegex(searchOrder, orderData['hydra:member'], setFilteredOrder)
  }, [orderData, searchOrder])

  //////////////////////////
  // Components props
  /////////////////////////

  const topSearchBarProps = { selectedOrder, setSelectedOrder, searchOrder, setSearchOrder }
  const orderListProps = {
    filteredOrder,
    setSelectedOrder,
    searchOrder,
    setSearchOrder,
    orderByStatus,
    orderData,
    trigger
  }

  console.log(selectedOrder)
  return (
    <Container className='order-list pb-5 mb-5'>
      {selectedOrder && 
         <div className='col-12 pb-0 text-center font-75'>
        {' '}
        {selectedOrder?.bookingSlot?.slot?.temperatureZone?.locker?.location}
      </div>
      
      }
      {!isLoading && <TopSearchBar topSearchBarProps={topSearchBarProps} />}
      {selectedOrder && <DetailHistory selectedOrder={selectedOrder} />}
      {isError ? (
        <div className='my-4'>
          <AlertIsError
            title='Une erreur est survenue'
            msg='Réessayez ou contactez votre administrateur'
            colorIcon='danger'
          />
        </div>
      ) : isLoading ? (
        <Container className='text-center mt-2'>
          <PlaceHolder paddingYFirst='3' />
        </Container>
      ) : (
        !selectedOrder && <OrderList orderListProps={orderListProps} />
      )}
    </Container>
  )
}

export default History
