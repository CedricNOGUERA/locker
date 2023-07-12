import { Container } from 'react-bootstrap'
import ItemList from './ItemList'
import images from '../../styles/no-order-min.png'
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
        <NoData images={images} isFilteredOrders={isFilteredOrders} msg="Aucune commande" msg2="Aucune commande trouvée" />
      )}
    </Container>
  )
}

export default OrderList
