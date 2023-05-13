import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { Button, Col, Container, Row } from 'react-bootstrap'
import ItemList from '../../components/ui/ItemList'
import moment from 'moment'
import BackButton from '../../components/ui/BackButton'
import SearchBar from '../../components/ui/SearchBar'
import { _getStatus, _getStatusMsg, _searchWithRegex } from '../../utils/functions'

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


 


 
  return (
  
      <Container className='order-list pb-5 mb-5'>
        <Container className='px- py-0 bg-secondary rounded-pill  my-2 '>
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
            <Col className='bar-tite m-auto text-light text-center pe-2 py-0'>
              <span className='fw-bold font-85'>
                {selectedOrder ? selectedOrder.barcode : 'Sélectionner '}
              </span>{' '}
            </Col>
            {selectedOrder &&  (
              <Col
                xs={2}
                md={5}
                lg={5}
                className='py-0'
              ></Col>
            )}
          </Row>
        </Container>
        {selectedOrder  && (
          <div className='history-tl-container animate__animated animate__backInLeft pb-5'>
            <ul className='tl d-flex flex-column-reverse '>
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
                    <div className='item-title'>{_getStatus(order.status)}</div>
                    {/* {getStatusMsg(order.status)} */}
                    <div className='item-detail'> {_getStatusMsg(order.status)}</div>
                  </li>
                ))}
              <li  className='tl-item-current' ng-repeat='item in retailer_histor'>
                <div className='timestamp-current fw-bold'>
                  {moment(selectedOrder.updatedAt).format('DD/MM/YY')}
                  <br /> {moment(selectedOrder.updatedAt).format('HH:mm:ss')}
                </div>
                <div className='item-title-current'>{selectedOrder.status}</div>
                {/* {getStatusMsg(selectedOrder.status)} */}
                <div className='item-detail-current fw-bold'> {_getStatusMsg(selectedOrder.status)}</div>
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
