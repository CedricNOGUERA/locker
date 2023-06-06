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
    selectedItem,
    setSelectedItem,
  ] = useOutletContext<any>()


  //////////////////////////
  // States
  /////////////////////////
  const [selectedOrder, setSelectedOrder] = React.useState<any>('')
  const [searchOrder, setSearchOrder] = React.useState<any>('')
  const [filteredOrder, setFilteredOrder] = React.useState<any>([])



  React.useEffect(() => {
    setSelectedItem('user')
  }, [])


  React.useEffect(() => {
    _searchWithRegex(searchOrder, orderData['hydra:member'], setFilteredOrder)
  }, [searchOrder]);


 

console.log(orderData)
 
  return (
    <Container className='order-list pb-5 mb-5 px-2'>
      <Container className=' py-0 bg-secondary rounded-pill  my-2 '>
        <Row>
          {selectedOrder ? (
            <Col xs={2} md={2} lg={5} className='py-0' onClick={() => setSelectedOrder('')}>
              <BackButton />
            </Col>
          ) : (
            <Col xs={12} className=' text-start '>
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
                {searchOrder !== "" && 
                <i className='ri-close-circle-fill text-warning delete-button'
                onClick={() => setSearchOrder("")}></i>
                
                }
              </div>

            </Col>
          )}
          <Col className='bar-tite m-auto text-light text-center ps-0 pe-2 py-0'>
            <span className='fw-bold font-75'>
              {selectedOrder && selectedOrder.barcode }
            </span>{' '}
          </Col>
          {selectedOrder && <Col xs={2} md={2} lg={5} className='py-0'></Col>}
        </Row>
      </Container>
      {selectedOrder && (
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
                  {order.status === 'created' ? (
                    <div className='timestamp'>
                      {moment(selectedOrder.createdAt).format('DD/MM/YY')}
                      <br /> {moment(selectedOrder.createdAt).format('HH:mm:ss')}
                    </div>
                  ) : (
                    <div className='timestamp'>
                      {moment(order.updatedAt).format('DD/MM/YY')}
                      <br /> {moment(order.updatedAt).format('HH:mm:ss')}
                    </div>
                  )}
                  <div className='item-title'>{_getStatus(order.status)}</div>
                  <div className='item-detail'> {_getStatusMsg(order.status)}</div>
                </li>
              ))}

            {selectedOrder && (
              <li className='tl-item-current' ng-repeat='item in retailer_histor'>
                <div className='timestamp-current fw-bold'>
                  {selectedOrder?.history?.length > 0 ? 
                  moment(
                    selectedOrder?.history[selectedOrder?.history?.length - 1]?.updatedAt
                  ).format('DD/MM/YY') 
                  :
                  moment(
                    selectedOrder?.createdAt
                  ).format('DD/MM/YY') 
                   }
                  <br />{' '}
                  {selectedOrder?.history?.length > 0 ? 
                  moment(
                    selectedOrder?.history[selectedOrder?.history?.length - 1]?.updatedAt
                  ).format('HH:mm:ss')
                :
                moment(
                  selectedOrder?.createdAt
                ).format('HH:mm:ss') 

                }
                </div>
                <div className='item-title-current'>{_getStatus(selectedOrder.status)}</div>

                <div className='item-detail-current fw-bold'>
                  {' '}
                  {_getStatusMsg(selectedOrder.status)}
                </div>
              </li>
            )}
          </ul>
        </div>
      )}
      {!selectedOrder && filteredOrder && filteredOrder.length > 0
        ? filteredOrder.map((liv: any, indx: any) => (
          <Container className='px-0 animate__animated animate__backInLef'>
            <ItemList
              key={Math.random()}
              liv={liv}
              indx={indx}
              setSelectedOrder={setSelectedOrder}
              setSearchOrder={setSearchOrder}
              // allSlot={allSlot}
              trigger='history'
            />
            </Container>
          ))
        : !selectedOrder &&
          orderData &&
          orderData['hydra:member']?.length > 0 &&
          orderData['hydra:member']?.map((liv: any, indx: any) => (
            <Container className='px-0 animate__animated animate__backInLeft'>
            <ItemList

              key={Math.random()}
              liv={liv}
              indx={indx}
              setSelectedOrder={setSelectedOrder}
              setSearchOrder={setSearchOrder}
              allSlot={allSlot}
              trigger='history'
            />
            </Container>
          ))}
    </Container>
  )
}

export default History
