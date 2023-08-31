import { Container, Alert, Row, Col, Table } from 'react-bootstrap'
import QrCode from '../QrCode'
import userDataStore from '../../store/userDataStore'
import axios from 'axios'
import OrdersService from '../../service/Orders/OrdersService'
import { useNavigate } from 'react-router-dom'
import BackButton from './BackButton'
import BadgedIcon from './BadgedIcon'

const ScanPage = ({ scanPageProps }: any) => {
  const navigate = useNavigate()

  ////////////////////
  //Props & store
  ///////////////////

  const { selectedOrder, setOrderData, setSelectedOrder, newStatus
     } = scanPageProps

  const dataStore: any = userDataStore((states: any) => states)
  const authLogout = userDataStore((state: any) => state.authLogout)

  //////////////////////////
  // Events
  /////////////////////////
  const getallOrders = (token: any) => {
    OrdersService.allOrders(token)
      .then((response: any) => {
        setOrderData(response.data)
      })
      .catch((error: any) => {
        if (error?.response?.data?.message === 'Expired JWT Token') {
          alert('Session expirée, reconnectez-vous.')
          authLogout()
          navigate('/connexion')
        }
        if (error?.response?.data?.message === 'Invalid JWT Token') {
          alert('Session expirée, reconnectez-vous.')
          authLogout()
          navigate('/connexion')
          authLogout()
        }
        console.log(error?.response?.data?.message)
      })
  }
  

  const changeStatus = () => {
    let data = {
      status: newStatus,
      // shippedBy: 'api/users/' + dataStore.id,
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
        if (newStatus === 'ready_for_delivery') {
          console.log(selectedOrder?.client?.email)
        }
        console.log(response.data)
        getallOrders(dataStore.token)
        setSelectedOrder(null)
      })
      .catch((error: any) => {
        console.log(error)
      })
  }

  return (
    <Container fluid className='pb-5'>
      <p className='col-12 mb-0 text-center font-75'> </p>

      <Container className='py-0 bg-secondary rounded-pill shadow my-auto '>
        <Row>
          <Col
            xs={2}
            md={2}
            lg={2}
            className='m-auto py-0'
            onClick={() => setSelectedOrder('')}
          >
            <BackButton />
          </Col>
          <Col className='m-auto text-light text-center ps-1 pe-2 py-0'>
            <span className='fw-bold font-85'>
              <span className='fw-bold font-85'>Présenter le qrcode au locker</span>
            </span>
          </Col>
          <Col xs={2} md={2} lg={2} className='m-auto text-light text-start ps- me-3 py-0'>
            <BadgedIcon
              slot={selectedOrder?.bookingSlot}
              borderColor='secondary'
              imgSize='28px'
            />
          </Col>
        </Row>
      </Container>
<p className='text-center font-75'>Détail de la commande</p>
      <Table striped className='mt-3'>
          <thead>
            <tr>
              <th className='text-center text-secondary'>Qté</th>
              <th className='text-center text-secondary'>Libellé produit</th>
            </tr>
          </thead>
          <tbody>
            {selectedOrder?.products?.map((prod: any, index: any) => (
              <tr key={index}>
                <td className='text-center font-85'>{prod?.quantity}</td>
                <td className='text-center font-85'>{prod?.name}</td>
              </tr>
            ))}
          </tbody>
        </Table>
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
        className='bg-light p-2 w-75  border  animate__animated animate__fadeInDown'
        onClick={() => {
          if (selectedOrder?.status === 'created') {
            changeStatus()
          } else {
            getallOrders(dataStore.token)
            setSelectedOrder(null)
          }
        }}
      >
        <div className='m-auto'>
          {newStatus === 'receive' && selectedOrder.multiOrderCode ? (
            <QrCode data={`${selectedOrder?.multiOrderCode}`} />
          ) : newStatus === 'receive' && !selectedOrder.multiOrderCode ? (
            <QrCode data={`${selectedOrder?.receiveCode}`} />
          ) : (
            <QrCode data={`${selectedOrder?.barcode}`} />
          )}
        </div>
      </Container>
      <Container className='text-center text-dark font-85'>
        <small>Respectez le sens du qrcode lors du scan</small>
      </Container>
      <Container className='text-center mt-4 px-0'>
        <Alert variant='secondary' className='border-2 border-secondary'>
          Saisie manuelle :
          <p className='text-info fw-bold m-0'>
            {newStatus === 'receive' && selectedOrder.multiOrderCode
              ? selectedOrder?.multiOrderCode
              : newStatus === 'receive' && !selectedOrder.multiOrderCode
              ? selectedOrder?.receiveCode
              : selectedOrder?.barcode}
          </p>
        </Alert>
      </Container>
    </Container>
  )
}

export default ScanPage
