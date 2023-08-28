import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { _searchWithRegex } from '../../utils/functions'
import PlaceHolder from '../../components/ui/loading/PlaceHolder'
import TopSearchBar from '../../components/history/TopSearchBar'
import DetailHistory from '../../components/history/DetailHistory'
import AlertIsError from '../../components/ui/warning/AlertIsError'
import OrderList from '../../components/ui/OrderList'
import OrdersService from '../../service/Orders/OrdersService'
import userDataStore from '../../store/userDataStore'

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
  ] = useOutletContext<any>()

  const token = userDataStore((state: any) => state.token)
  //////////////////////////
  // States
  /////////////////////////
  const [selectedOrder, setSelectedOrder] = React.useState<any>('')
  const [searchOrder, setSearchOrder] = React.useState<any>('')
  const [filteredOrder, setFilteredOrder] = React.useState<any>([])

  const [currentPage, setCurrentPage] = React.useState<number>()

  const trigger = 'history'
  // let orderByStatus = allOrder
  let orderByStatus = orderData['hydra:member']

  React.useEffect(() => {
    setCurrentPage(1)
  }, [])

  React.useEffect(() => {
    setIsLoading(true)
    setSelectedItem('history')
    // setOrderByStatus(orderData && orderData['hydra:member'])

    // if(orderData['hydra:member']?.length > 29){

    //   getOrderByPage(token, 2, setOrderByPage)

    // }
  }, [orderData])

  //   React.useEffect(() => {
  //     if(orders){
  //       Array.from({ length: orderByPage?.length }).map((_, index) =>
  //       orders?.push(orderByPage[index])

  //       )

  // }
  //   }, [orderByPage])

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
    _searchWithRegex(searchOrder, historyOrder, setFilteredOrder)
    // _searchWithRegex(searchOrder, historyOrder['hydra:member'], setFilteredOrder)
  }, [historyOrder, searchOrder])

  React.useEffect(() => {
    if (currentPage) {
      getOrderByPage(token, currentPage, setHistoryOrder)
    }
  }, [currentPage])

  console.log(currentPage)
  // const totalPages = Math.ceil(orders && orders?.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const getOrderByPage = (token: any, page: any, setData: any) => {
    OrdersService.ordersByPage(token, page)
      .then((response: any) => {
        setIsLoading(false)
        setData(response.data['hydra:member'])

        console.log(response.data)
      })
      .catch((error: any) => {
        setIsLoading(false)
        console.log(error)
      })
  }

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
    trigger,
    historyOrder,
  }

  console.log(historyOrder)

  return (
    <Container className='order-list'>
      {selectedOrder && (
        <div className='col-12 pb-0 text-center font-75'>
          {' '}
          {selectedOrder?.bookingSlot?.slot?.temperatureZone?.locker?.location}
        </div>
      )}
      {!isLoading && (
        <div className='sticky-top pt-2 bg-light mb-4 '>
          <TopSearchBar topSearchBarProps={topSearchBarProps} />
        </div>
      )}
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
        !selectedOrder && (
          <>
            {totalPages > 1 && (
              <div className='pagination  mb-4'>
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    className={currentPage === index + 1 ? 'active' : ''}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
            <OrderList orderListProps={orderListProps} />
            {totalPages > 1 && (
              <div className='pagination'>
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    className={currentPage === index + 1 ? 'active' : ''}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )
      )}
    </Container>
  )
}

export default History
