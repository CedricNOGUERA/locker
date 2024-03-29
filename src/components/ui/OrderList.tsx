import { Container } from 'react-bootstrap'
import ItemList from './ItemList'
import images from '../../styles/no-order.webp'
import React from 'react'
import NoData from './warning/NoData'

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
    trigger,
    historyOrder
  } = orderListProps

  const [orderList, setOrderList] = React.useState([])
  const isFilteredOrders =
    filteredOrder?.length === 0 && orderList?.length === 0 && searchOrder?.length > 2

  React.useEffect(() => {
    if (filteredOrder?.length > 0 && searchOrder?.length > 1) {
      setOrderList(filteredOrder)
    } 
    else if (filteredOrder?.length === 0 && searchOrder?.length > 2) {
    setOrderList([])
    } 
    else if (trigger === "history") {
    setOrderList(historyOrder)
    } 
    else {
      setOrderList(orderByStatus)
    }
  }, [orderByStatus, filteredOrder, searchOrder, historyOrder])



  return (
    <Container className='order-list px-0 '>
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
        <NoData images={images} isFilteredOrders={isFilteredOrders} msg="Aucune commande" msg2="Aucune commande trouvée" />
      )}
    </Container>
  )
}

export default OrderList
