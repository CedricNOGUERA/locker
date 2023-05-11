import React from 'react'
import userDataStore from '../../store/userDataStore'
import { useOutletContext } from 'react-router-dom'
import { Button, Col, Container, Row } from 'react-bootstrap'
import ItemList from '../../components/ui/ItemList'
import images from '../../styles/no-order-min.png'
import moment from 'moment'
import BackButton from '../../components/ui/BackButton'
import PlaceHolder from '../../components/ui/loading/PlaceHolder'

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
  ] = useOutletContext<any>()

  //////////////////////////
  // States
  /////////////////////////
  const [selectedOrder, setSelectedOrder] = React.useState<any>('')
  const [searchOrder, setSearchOrder] = React.useState<any>('')

  console.log(selectedOrder)
  const getMsg = (status: any) => {
    if (status === 'created') {
      return <div className='item-detail'>Commande préparée et prête à l'envoi</div>
    } else if (status === 'operin') {
      return <div className='item-detail'>Commande déposée dans locker</div>
    } else if (status === 'reminder') {
      return <div className='item-detail'>Envoi du 1🇪🇷 rappel</div>
    } else if (status === 'overtimedue') {
      return <div className='item-detail'>Envoi du 2è rappel</div>
    } else if (status === 'overtime') {
      return <div className='item-detail'>Commande expirée</div>
    } else if (status === 'operout') {
      return <div className='item-detail'>Commande récupérée par le livreur</div>
    } else if (status === 'receive') {
      return <div className='item-detail'>Commande récupérée par le client</div>
    }
  }

  return (
    <>
      <Container className='order-list '>
        <Container className='px- py-0 bg-secondary rounded-pill shadow mt-2 '>
          <Row>
            {selectedOrder && (
              <Col xs={1} md={5} lg={5} className='py-0' onClick={() => setSelectedOrder('')}>
                <BackButton />
              </Col>
            )}
            <Col className='bar-title m-auto text-light text-center pe-2 py-0'>
              <span className='fw-bold font-85'>
                {selectedOrder && selectedOrder?.history?.length > 0
                  ? 'Livraison n°'
                  : 'Sélectionner une livraison'}
              </span>{' '}
              {selectedOrder.id}
            </Col>
          </Row>
        </Container>
        {selectedOrder && selectedOrder?.history?.length > 0 && (
          <div className='history-tl-container animate__animated animate__backInLeft pb-5'>
            <ul className='tl'>
              {selectedOrder &&
                selectedOrder?.history?.length > 0 &&
                selectedOrder?.history?.map((order: any) => (
                  <li
                    key={Math.random()}
                    className='tl-item'
                    ng-repeat='item in retailer_history'
                  >
                    <div className='timestamp'>
                      {moment(order.updatedAt).format('DD/MM/YY')}
                      <br /> {moment(order.updatedAt).format('HH:mm:ss')}
                    </div>
                    <div className='item-title'>{order.status}</div>
                    {getMsg(order.status)}
                    {/* <div className='item-detail'>Don't forget the ring</div> */}
                  </li>
                ))}
            </ul>
          </div>
        )}
        {
     
        
        !selectedOrder &&
          orderData &&
          orderData['hydra:member']?.length > 0 &&
          orderData['hydra:member']?.map((liv: any, indx: any) => (
            <ItemList
              key={Math.random()}
              liv={liv}
              indx={indx}
              setSelectedOrder={setSelectedOrder}
              setSearchOrder={setSearchOrder}
              allSlot={allSlot}
            />
          ))
          
          }
      </Container>
    </>
  )
}

export default History
