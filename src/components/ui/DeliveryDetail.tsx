import React from 'react'
import { Container, Row, Col, Button, Alert, Table, Modal, Spinner } from 'react-bootstrap'
import BackButton from './BackButton'
import BadgedIcon from './BadgedIcon'
import userDataStore from '../../store/userDataStore'
import OrdersService from '../../service/Orders/OrdersService'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import QrCode from '../QrCode'
import { _getOrdersByStatus, _iconFilter, _iconFilter2, _iconFilter3, _tempFilter } from '../../utils/functions'
const DeliveryDetail = ({ scanPageProps }: any) => {

  const navigate = useNavigate();

  ////////////////////
  //Props & store
  ///////////////////
    
  const {
    selectedOrder,
    setOrderData,
    setSelectedOrder,
    newStatus,
    setOrderPickedUp,
  } = scanPageProps

  const dataStore: any = userDataStore((states: any) => states)
  const authLogout = userDataStore((state: any) => state.authLogout)


  const [isErrorValid, setIsErrorValid] = React.useState<boolean>(false)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [errorMsg, setErrorMsg] = React.useState<string>('')

  const [show, setShow] = React.useState<boolean>(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const [showUpdateStatus, setShowUpdateStatus] = React.useState<boolean>(false)
  const handleCloseUpdateStatus = () => setShowUpdateStatus(false)
  const handleShowUpdateStatus = () => {
    setShowUpdateStatus(true)
    handleClose()
    setTimeout(() => {
      setSelectedOrder(null)
      handleCloseUpdateStatus()
    }, 2000)
  }

 

  const getallOrders = (token: any) => {
    OrdersService.allOrders(token).then((response: any) => {
      setOrderData(response.data)
    }).catch((error: any) => {
      
      if(error?.response?.data?.message === 'Expired JWT Token'){
        alert('Session expirée, reconnectez-vous.')
        authLogout()
        navigate('/connexion')
      }
      if(error?.response?.data?.message === 'Invalid JWT Token'){
        alert('Session expirée, reconnectez-vous.')
        authLogout()
        navigate('/connexion')
        authLogout()
      }
      console.log(error)
    })
  }

  const changeStatus = () => {
    setIsLoading(true)
    console.log(selectedOrder)
    if (selectedOrder?.status === 'picked_up') {
      setIsErrorValid(true)
      setIsLoading(false)
      setErrorMsg(
        'Cette commande est déja prise en charge par ' +
          selectedOrder?.shippedBy?.firstName +
          ", rafraichissez l'application"
      )
    } else {
      let data = {
        status: newStatus,
        shippedBy: 'api/users/' + dataStore.id,
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
          getallOrders(dataStore.token)
          _getOrdersByStatus(dataStore.token, 'picked_up', setOrderPickedUp)
          setIsLoading(false)
          handleShowUpdateStatus()
        })
        .catch((error: any) => {
          console.log(error)
          setIsErrorValid(true)
          setIsLoading(false)
        })
    }
  }

  return (
    <Container fluid className='order-list pb-5'>
      <div className='text-center'>
        <p className='col-12 mb-0 text-center font-75 text-light'>
          Détail de la commande à livrer
        </p>
        <Container className='py-0 bg-gray rounded-pill shadow my-auto '>
          <Row>
            <Col
              xs={2}
              md={1}
              lg={1}
              className='m-auto py-0'
              onClick={() => setSelectedOrder('')}
            >
              <BackButton />
            </Col>
            <Col className='m-auto text-light text-center ps-1 pe-2 py-0'>
              <span className='fw-bold font-85'>
                <span className='fw-bold font-85'>n° {selectedOrder?.barcode}</span>
              </span>
            </Col>
            <Col xs={2} md={1} lg={1} className='m-auto text-light text-start ps- me-3 py-0'>
              <BadgedIcon
                slot={selectedOrder?.bookingSlot}
                borderColor='gray'
                imgSize='28px'
              />
            </Col>
          </Row>
        </Container>

        <Table striped className='mt-3 border-1'>
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
        <Container className='text-end mt-4'>
          <Button
            className='bg-green rounded-pill border-green text-light ms-3'
            type='submit'
            onClick={handleShow}
          >
            Qrcode
          </Button>
        </Container>
      </div>

      <Modal show={showUpdateStatus} onHide={handleCloseUpdateStatus}>
        <Modal.Body className='bg-dark rounded text-light'>
          {' '}
          {''}
          <Row className='m-auto'>
            <Col xs={2}>
              <i className='ri-checkbox-circle-line text-success fs-1 me-2 animate__animated animate__fadeInDown'></i>
            </Col>
            <Col className='m-auto'>Commande prise en charge</Col>
          </Row>
        </Modal.Body>
      </Modal>

      <Modal show={show} onHide={handleClose} centered>
        {isErrorValid ? (
          <>
            <Modal.Header closeButton>
              <Modal.Title>
                <i className='ri-error-warning-line fs-2 text-warning'></i>Attention
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {errorMsg ? errorMsg : 'Une anomalie est survenue... Rafraichissez la page'}
            </Modal.Body>
            <Modal.Footer>
              <Button
                size='lg'
                className=' rounded-pill border-warning text-light ms-3 px-4'
                variant='warning'
                onClick={() => {
                  setSelectedOrder('')
                  handleClose()
                  setIsErrorValid(false)
                }}
              >
                Réessayez
              </Button>
            </Modal.Footer>
          </>
        ) : (
          <>
            <Modal.Body>
              <Container className='text-center text-dange py-0  m-auto opacity-75'>
                <p>
                  <img
                    alt='température de la commande'
                    src={_iconFilter3(selectedOrder?.bookingSlot?.slot?.temperatureZone?.name)}
                    style={{ width: '35px', height: `35px` }}
                  />
                  <b>Zone {selectedOrder?.bookingSlot?.slot?.temperatureZone?.name}</b>
                </p>
              </Container>
              <Container className='bg-light p-2 border  animate__animated animate__fadeInDown'>
                <div className='m-auto'>
                  <QrCode data={`${selectedOrder?.barcode}`} />
                </div>
              </Container>
              <Container className='text-center mt-4 px-0'>
                <Alert variant='secondary' className='border-2 border-secondary'>
                  Saisie manuelle :
                  <p className='text-secondary fw-bold m-0'>{selectedOrder?.barcode}</p>
                </Alert>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button
                size='lg'
                className=' rounded-pill border-warning text-light ms-3 px-4'
                variant='warning'
                onClick={() => {
                  setSelectedOrder('')
                  handleClose()
                }}
              >
                Annuler
              </Button>
              <Button
                size='lg'
                type='submit'
                className='bg-green rounded-pill border-green text-light ms-3 px-4 '
                onClick={() => {
                  _getOrdersByStatus(dataStore.token, 'picked_up', setOrderPickedUp)
                  getallOrders(dataStore.token)
                  setSelectedOrder(null)
                  handleClose()
                }}
              >
                {isLoading ? (
                  <Spinner size='sm' as='span' />
                ) : newStatus === 'operin' ? (
                  'Déposer'
                ) : (
                  'Retirer'
                )}
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </Container>
  )
}

export default DeliveryDetail
