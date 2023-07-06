import { Container } from 'react-bootstrap'
import ItemList from './ItemList'
import images from '../../styles/no-order-min.png'
import React from 'react'

const OrderList = ({ orderListProps }: any) => {
  //////////////////////////
  // Props
  /////////////////////////
  const {
    filteredOrder,
    setSelectedOrder,
    searchOrder,
    setSearchOrder,
    allSlot,
    orderByStatus,
    trigger
  } = orderListProps

  const [orderList, setOrderList] = React.useState([])
  const isFilteredOrders =
    filteredOrder?.length === 0 && orderList?.length === 0 && searchOrder?.length > 2

  React.useEffect(() => {
    if (filteredOrder?.length > 0 && searchOrder?.length > 2) {
      setOrderList(filteredOrder)
    } else if (filteredOrder?.length === 0 && searchOrder?.length > 2) {
      setOrderList([])
    } else {
      setOrderList(orderByStatus)
    }
  }, [orderByStatus, filteredOrder, searchOrder])

  console.log(filteredOrder)
  console.log(orderList)

  return (
    <Container className='px-0 animate__animated animate__backInLeft'>
      {(orderByStatus && orderByStatus?.length > 0 && orderList?.length > 0) ||
      (filteredOrder && filteredOrder?.length > 0) ? (
        orderList?.map((liv: any, indx: any) => (
          <ItemList
            key={Math.random()}
            liv={liv}
            indx={indx}
            setSelectedOrder={setSelectedOrder}
            setSearchOrder={setSearchOrder}
            trigger={trigger}
          />
        ))
      ) : (
        <div className='text-center mt-5 pt-5'>
          <img className='' alt='no order' src={images} style={{ height: '256px' }} />
          {isFilteredOrders ? (
            <div className='user-name fs-3 fw-bold text-secondary'>
              <i className='ri-search-line me-1 align-bottom'></i> Aucune commande trouvée
            </div>
          ) : (
            <div className='user-name fs-3 fw-bold text-secondary'>Aucune commande</div>
          )}
        </div>
      )}
    </Container>
  )
}

export default OrderList
