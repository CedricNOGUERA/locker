import { Container, Col, Alert } from 'react-bootstrap'
import QrCode from '../QrCode'
import userDataStore from '../../store/userDataStore'
import axios from 'axios'
import OrdersService from '../../service/Orders/OrdersService'
import BackBar from './BackBar'

const ScanPage = ({ scanPageProps }: any) => {
  ////////////////////
  //Props
  ///////////////////
  const { selectedOrder, setOrderData, setSelectedOrder, newStatus } = scanPageProps

  const dataStore: any = userDataStore((states: any) => states)

  //////////////////////////
  // Events
  /////////////////////////
  const getallOrders = (token: any) => {
    OrdersService.allOrders(token).then((response: any) => {
      setOrderData(response.data)
    })
  }

  const changeStatus = () => {
    let data = {
      status: newStatus,
    }

    let config = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: process.env.REACT_APP_END_POINT + 'orders/' + selectedOrder.id,
      headers: {
        'Content-Type': 'application/merge-patch+json',
        Authorization: 'Bearer ' + dataStore.token,
      },
      data: data,
    }

    axios
      .request(config)
      .then((response: any) => {
        if(newStatus === 'operin'){
          console.log(selectedOrder?.client.email)
        }
        console.log(response.data)
        getallOrders(dataStore.token)
        setSelectedOrder(null)
      })
      .catch((error: any) => {
        console.log(error)
      })
  }
console.log(selectedOrder)
console.log(newStatus)
  return (
    <Container fluid className='pb-5'>
      <Container className='my-2 px-0'>
        <BackBar setSelectedOrder={setSelectedOrder} selectedOrder={selectedOrder} />
      </Container>
      <Container className='text-center text-danger py-0  m-auto opacity-75'>
        <span className='align-middle'>
          <i className='ri-error-warning-line fs-5'></i>
        </span>{' '}
        <small className='fw-bold align-middle '>haut du qrcode</small>{' '}
        <div className='bounced-arrow justify-content-around'>
          <i className='ri-arrow-up-fill '></i>
          <i className='ri-arrow-up-fill '></i>
          <i className='ri-arrow-up-fill '></i>
        </div>
      </Container>
      <Container
        className='bg-light p-3 w-75 border  animate__animated animate__fadeInDown'
        onClick={() => {
          changeStatus()
        }}
      >
        <Col xs={12} sm={5} md={7} lg={3} className='m-auto'>
          {
          newStatus === 'overtime' && selectedOrder.multiOrderCode ? (
            <QrCode data={`${selectedOrder?.multiOrderCode}`} />
          ) :
           newStatus === 'overtime' && !selectedOrder.multiOrderCode ? (
            <QrCode data={`${selectedOrder?.receiveCode}`} />
          ) :  
           (
            <QrCode data={`${selectedOrder?.barcode}`} />
          )}
        </Col>
      </Container>
      <Container className='text-center text-dark font-85'>
        <small>Respectez le sens du qrcode lors du scan</small>
      </Container>
      <Container className='text-center mt-4 px-0'>
        <Alert variant='secondary' className='border-2 border-secondary'>
          Saisie manuelle :
          <p className='text-info fw-bold m-0'>
            {
            newStatus === 'overtime' &&   selectedOrder.multiOrderCode
              ? selectedOrder?.multiOrderCode
              : newStatus === 'overtime' && !selectedOrder.multiOrderCode 
              ? selectedOrder?.receiveCode
              :
              
              selectedOrder?.barcode}
          </p>
        </Alert>
      </Container>
    </Container>
  )
}

export default ScanPage
