import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { Button, Col, Container, Row } from 'react-bootstrap'
import ItemList from '../../components/ui/ItemList'
import moment from 'moment'
import BackButton from '../../components/ui/BackButton'
import SearchBar from '../../components/ui/SearchBar'
import { _searchWithRegex } from '../../utils/functions'

const History = () => {


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
  const [filteredOrder, setFilteredOrder] = React.useState<any>([])

console.log(orderData)

  React.useEffect(() => {
   
    _searchWithRegex(searchOrder, orderData['hydra:member'], setFilteredOrder)


  }, [searchOrder]);


  console.log(selectedOrder)
  console.log(filteredOrder)
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
    } else if (status === 'return') {
      return <div className='item-detail'>Commande retournée au service client</div>
    }
  }

  // const searchBarProps = {
  //   searchOrder,
  //   setSearchOrder,
  //   selectedStore,
  //   setSelectedStore,
  //   selectedOrderCity,
  //   setSelectedOrderCity,
  //   allSlot,
  // }

  return (
  
      <Container className='order-list pb-5 mb-5'>
        <Container className='px- py-0 bg-secondary rounded-pill shadow mt-2 '>
          <Row>
            {selectedOrder ? (
              <Col xs={2} md={5} lg={5} className='py-0' onClick={() => setSelectedOrder('')}>
                <BackButton />
              </Col>
            ) : (
              <Col xs={7} className=' text-start '>
                <div className='input-group'>
                  <i className='ri-search-line me-1 text-info '></i>
                  <input
                    type='text'
                    className='form-control rounded-pill'
                    placeholder='N° Commande...'
                    aria-label='Username'
                    aria-describedby='basic-addon1'
                    style={{ height: '25px' }}
                    value={searchOrder}
                    onChange={(e) => setSearchOrder(e.currentTarget.value)}
                  />
                </div>
              </Col>
            )}
            <Col className='bar-title m-auto text-light text-center pe-2 py-0'>
              <span className='fw-bold font-85'>
                {selectedOrder ? '' : 'Sélectionner '}
              </span>{' '}
              {selectedOrder.barcode}
            </Col>
            {selectedOrder &&  (
              <Col
                xs={2}
                md={5}
                lg={5}
                className='py-0'
                onClick={() => setSelectedOrder('')}
              ></Col>
            )}
          </Row>
        </Container>
        {selectedOrder  && (
          <div className='history-tl-container animate__animated animate__backInLeft pb-5'>
            <ul className='tl d-flex flex-column-reverse'>
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
                  </li>
                ))}
              <li  className='tl-item-current' ng-repeat='item in retailer_histor'>
                <div className='timestamp-current'>
                  {moment(selectedOrder.updatedAt).format('DD/MM/YY')}
                  <br /> {moment(selectedOrder.updatedAt).format('HH:mm:ss')}
                </div>
                <div className='item-title'>{selectedOrder.status}</div>
                {getMsg(selectedOrder.status)}
              </li>
            </ul>
          </div>
        )}
        {!selectedOrder && filteredOrder && filteredOrder.length > 0
          ? filteredOrder.map((liv: any, indx: any) => (
            
              <ItemList
                key={Math.random()}
                liv={liv}
                indx={indx}
                setSelectedOrder={setSelectedOrder}
                setSearchOrder={setSearchOrder}
                allSlot={allSlot}
                trigger='history'
              />
            ))
          : !selectedOrder &&
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
                trigger='history'
              />
            ))}
      </Container>
  
  )
}

export default History
