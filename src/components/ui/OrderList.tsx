import { Badge, Container } from 'react-bootstrap'
import ItemList from './ItemList'
import images from '../../styles/no-order-min.png'
import userDataStore from '../../store/userDataStore'
import React from 'react'

const   OrderList = ({ orderListProps }: any) => {
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
    orderData,
    getOrderByPage,
  } = orderListProps
  const dataStore = userDataStore((state: any) => state)
  const [pagination, setPagination] = React.useState<boolean>(false);

 

  return (
    <Container className='px-0 animate__animated animate__backInLeft'>
      {orderByStatus && orderByStatus?.length > 0 ? (
        filteredOrder && filteredOrder?.length > 0 ? (
          filteredOrder?.map((liv: any, indx: any) => (
            <ItemList
              key={Math.random()}
              liv={liv}
              indx={indx}
              setSelectedOrder={setSelectedOrder}
              setSearchOrder={setSearchOrder}
            />
          ))
        ) : filteredOrder?.length === 0 && searchOrder?.length > 2 ? (
          <div className=' text-center mt-5 pt-5'>
            <div className='user-name fs-3 fw-bold text-secondary'>
              <i className='ri-search-line me-1 align-bottom'></i> Aucune commande trouvée
            </div>
            <img className='' alt='no order' src={images} style={{ height: '256px' }} />
          </div>
        ) : (
        
         orderByStatus?.map((liv: any, indx: any) => (
            <ItemList
              key={Math.random()}
              liv={liv}
              indx={indx}
              setSelectedOrder={setSelectedOrder}
              setSearchOrder={setSearchOrder}
              allSlot={allSlot}
              trigger="order"
              />
              
          ))
            
        )
      ) : (
        <div className=' text-center mt-5 pt-5'>
          <img className='' alt='no order' src={images} style={{ height: '256px' }} />
          <div className='user-name fs-3 fw-bold text-secondary'>Aucune commande</div>
        </div>
      )}
      {/* 
      PAGINATION
      <Container>{(orderData['hydra:member']?.length === 30 || pagination === false) && orderByStatus?.length > 0 ? (
        <Badge bg="warning" className='pb-2 cursor-pointer' onClick={() => {getOrderByPage(dataStore.token, 2)
        setPagination(true)
        }}>
          page 2/2
        </Badge>
      )
      : orderByStatus?.length > 0 && pagination === true && 
      (
        <Badge bg="warning" className='pb-2 cursor-pointer' onClick={() => {getOrderByPage(dataStore.token, 1)
          setPagination(false)
        }}>
          ↩  retour
        </Badge>
      )
      }</Container> */}
    </Container>
  )
}

export default OrderList
