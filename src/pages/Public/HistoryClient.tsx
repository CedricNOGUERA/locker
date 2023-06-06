import React from 'react'
import { Container, Navbar } from 'react-bootstrap'
import OrderService from '../../service/Orders/OrdersService'
import moment from 'moment'
import { useOutletContext, useParams } from 'react-router-dom'
import userDataStore from '../../store/userDataStore'
import { _getStatus, _getStatusMsg } from '../../utils/functions'

const HistoryClient = () => {
    const dataStore = userDataStore((states: any) => states)
    const token = userDataStore((state: any) => state.token)
    const [myOrder, setMyOrder] = React.useState<any>([])
    const [order, setOrder] = React.useState<any>([])


  const params = useParams()

    React.useEffect(() => {
      getOrder(params.id, token)
      getAllOrder(dataStore.token)
    }, [])

    const getOrder = (id: any, token: any) => {
      OrderService.order(id, token)
      .then((response: any) => {
        setMyOrder(response.data)
      })
      .catch((error: any) => {
        console.log(error)
      })
    }
    const getAllOrder = (token: any) => {
      OrderService.allOrders( token)
      .then((response: any) => {
        setOrder(response.data)
      })
      .catch((error: any) => {
        console.log(error)
      })
    }

    console.log(myOrder)
    console.log(myOrder.updatedAt)

  return (
    <Container fluid className='px-0'>
        {/* <Container
        
        className='top-nav-design sticky-top py-2 text-info shadow opacity-75 px-0 m-0'
      >
        <Navbar bg="" className='text-center px-0'>
        <Container >
          <Navbar.Brand className='text-info fw-bold m-auto' >Visualisation de l'état de votre commande</Navbar.Brand>
        </Container>
      </Navbar>
      
        </Container> */}
        <Navbar bg="secondary" expand="lg">
      <Container >
        <Navbar.Brand className='text-center text-info m-auto'>
        <div className='font-5 text-light' >{myOrder?.bookingSlot?.company?.name}</div>
            <div className='ff-agency font-5' >Suivi de votre commande</div>
        </Navbar.Brand>
    
      </Container>
    </Navbar>
    <Container className='text-center text-secondary fw-bold'> Commande n° {myOrder?.barcode}</Container>
    <Container className='text-center text-secondary fw-bold'>Client : {myOrder?.client?.name}</Container>
      <div className='history-tl-container animate__animated animate__backInLeft pb-5'>
            <ul className='tl d-flex flex-column-reverse'>
              {myOrder &&
                myOrder?.history?.length > 0 &&
                myOrder?.history?.map((order: any) => (
                  <li
                    key={Math.random()}
                    className='tl-item'
                    ng-repeat='item in retailer_history'
                  >
                   {order.status === 'created' ? (
                    <div className='timestamp'>
                      {moment(myOrder.createdAt).format('DD/MM/YY')}
                      <br /> {moment(myOrder.createdAt).format('HH:mm:ss')}
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
              {myOrder  && (
              <li className='tl-item-current' ng-repeat='item in retailer_histor'>
                <div className='timestamp-current fw-bold'>

                 {myOrder?.history?.length > 0 ? 
                  moment(
                    myOrder?.history[myOrder?.history?.length - 1]?.updatedAt
                  ).format('DD/MM/YY') 
                  :
                  moment(
                    myOrder?.createdAt
                  ).format('DD/MM/YY') 
                   }
                  <br />{' '}
                  {myOrder?.history?.length > 0 ? 
                  moment(
                    myOrder?.history[myOrder?.history?.length - 1]?.updatedAt
                  ).format('HH:mm:ss')
                :
                moment(
                  myOrder?.createdAt
                ).format('HH:mm:ss') 

                }
                </div>
                <div className='item-title-current'>{_getStatus(myOrder.status)}</div>

                <div className='item-detail-current fw-bold'>
                  {' '}
                  {_getStatusMsg(myOrder.status)}
                </div>
              </li>
              )}
            </ul>
          </div>
    </Container>
  )
}

export default HistoryClient
