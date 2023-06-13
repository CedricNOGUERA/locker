import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { Col, Container, Row } from 'react-bootstrap'
import ItemList from '../../components/ui/ItemList'
import moment from 'moment'
import BackButton from '../../components/ui/BackButton'
import { _getStatus, _getStatusMsg, _searchWithRegex } from '../../utils/functions'

import images from '../../styles/no-order-min.png'
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
    setIsLoading(true)
    setSelectedItem('user')
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
    console.log(filteredOrder?.length)
  }, [orderData,searchOrder])

console.log(orderData['hydra:member']?.length)

  return (
    <Container className='order-list pb-5 mb-5'>
      {!isLoading && (
        <Container fluid className='ps-2 py-0   bg-secondary rounded-pill  my-2 '>
          <Row>
            {selectedOrder ? (
              <Col xs={2} md={2} lg={5} className='py-0' onClick={() => setSelectedOrder('')}>
                <BackButton />
              </Col>
            ) : (
              <Col xs={12} className=' text-start '>
                <div className='input-group'>
                  <i className='ri-search-line ps-0 me-1 text-info '></i>
                  <input
                    type='text'
                    className='form-control rounded-pill'
                    placeholder='N° Commande...'
                    aria-label='search'
                    aria-describedby='search-order'
                    style={{ height: '25px' }}
                    value={searchOrder}
                    onChange={(e) => setSearchOrder(e.currentTarget.value)}
                  />
                  {searchOrder !== '' && (
                    <i
                      className='ri-close-circle-fill text-warning delete-button'
                      onClick={() => setSearchOrder('')}
                    ></i>
                  )}
                </div>
              </Col>
            )}
            <Col className='bar-tite m-auto text-light text-center ps-0 pe-2 py-0'>
              <span className='fw-bold font-75'>
                {selectedOrder &&
                  `${selectedOrder?.barcode} - ${selectedOrder?.client?.email}`}
              </span>{' '}
            </Col>
            {selectedOrder && <Col xs={2} md={2} lg={5} className='py-0'></Col>}
          </Row>
        </Container>
      )}
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
                  {
                  order.status === 'created' ? (
                    <div className='timestamp'>
                      {moment(selectedOrder.createdAt).format('DD/MM/YY')}
                      <br /> {moment(selectedOrder.createdAt).format('HH:mm:ss')}
                    </div>
                  ) 
                  : (
                    <div className='timestamp'>
                      {moment(order.createdAt).format('DD/MM/YY')}
                      <br /> {moment(order.createdAt).format('HH:mm:ss')}
                    </div>
                   
                  )
                  }
                  <div className='item-title'>{_getStatus(order.status)}</div>
                  <div className='item-detail'> {_getStatusMsg(order.status)}</div>
                </li>
              ))}

            {selectedOrder && (
              <li className='tl-item-current' ng-repeat='item in retailer_histor'>
                <div className='timestamp-current fw-bold'>
                  {selectedOrder?.history?.length > 0
                    ? moment(
                        selectedOrder?.history[selectedOrder?.history?.length ]?.updatedAt
                      ).format('DD/MM/YY')
                    : moment(selectedOrder?.createdAt).format('DD/MM/YY')}
                  <br />{' '}
                  {selectedOrder?.history?.length > 0
                    ? moment(
                        // selectedOrder?.history[selectedOrder?.history?.length]?.updatedAt
                        selectedOrder?.updatedAt
                      ).format('HH:mm:ss')
                    : moment(selectedOrder?.createdAt).format('HH:mm:ss')}
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
      
      {isLoading ? (
        <Container className='text-center mt-2'>
          <PlaceHolder paddingYFirst='3' />
        </Container>
      ) : !selectedOrder && filteredOrder && filteredOrder.length > 0 && searchOrder?.length > 2 ? (
        filteredOrder.map((liv: any, indx: any) => (
          <Container key={Math.random()} className='px-0 animate__animated animate__backInLef'>
            <ItemList
              liv={liv}
              indx={indx}
              setSelectedOrder={setSelectedOrder}
              setSearchOrder={setSearchOrder}
              trigger='history'
            />
          </Container>
        ))
      ) : !selectedOrder && searchOrder?.length < 2  && orderData && orderData['hydra:member']?.length > 0 ? (
        orderData['hydra:member']?.map((liv: any, indx: any) => (
          <Container
            key={Math.random()}
            className='px-0 animate__animated animate__backInLeft'
          >
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
        ))
      ) : 
        (
      
          searchOrder &&
        filteredOrder &&
        filteredOrder.length === 0 ) ||
        (orderData &&
        orderData['hydra:member']?.length === 0) ?
        (


          <div className=' text-center mt-5 pt-5'>
            <img className='' alt='no order' src={images} style={{ height: '256px' }} />
            <div className='user-name fs-3 fw-bold text-secondary'>Aucune commande</div>
          </div>
        
      ) : null}
    </Container>
  )
}

export default History
