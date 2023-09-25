import React from 'react'
import { Container, Row, Col, Button, Table, Modal, Spinner } from 'react-bootstrap'
import BadgedIcon from './BadgedIcon'
import userDataStore from '../../store/userDataStore'
import OrdersService from '../../service/Orders/OrdersService'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { _getOrdersByStatus } from '../../utils/functions'
const OrderDetail = ({ scanPageProps }: any) => {
  const navigate = useNavigate()

  ////////////////////
  //Props & store
  ///////////////////
  const {
    selectedOrder,
    setOrderData,
    setSelectedOrder,
    newStatus,
    setOrderReady,
    setOrderPickedUp,
    setSearchOrder,
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
          console.log(response.data)
          _getOrdersByStatus(dataStore.token, 'ready_for_delivery', setOrderReady)
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
    <Container fluid className='order-list  pb-5'>
      <div className='text-center'>
        <p className='col-12 mb-0 text-center font-75'>Détail de la commande</p>
        <Container className='py-0 bg-secondary rounded-pill shadow my-auto '>
          <Row>
            <Col
              xs={2}
              md={1}
              lg={1}
              className='back-to m-auto py-0 '
              onClick={() => {
                setSelectedOrder('')
                setSearchOrder('')
              }}
            >
               <i className='ri-arrow-left-line text-light fs-3 bg-secondary rounded-pill back-to'></i>
            </Col>
            <Col className='m-auto text-light text-center ps-1 pe-2 py-0'>
              <span className='fw-bold font-85'>
                <span className='fw-bold font-85'>n° {selectedOrder?.barcode}</span>
              </span>
            </Col>
            <Col xs={2} md={1} lg={1} className='m-auto text-light text-start me-3 py-0'>
              <BadgedIcon
                slot={selectedOrder?.bookingSlot}
                borderColor='secondary'
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
            Valider
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

      <Modal show={show} onHide={handleClose}>
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
            <Modal.Header closeButton>
              <Modal.Title>Prise en charge</Modal.Title>
            </Modal.Header>
            <Modal.Body>Voulez-vous prendre en charge cette commande ?</Modal.Body>
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
                Non
              </Button>
              <Button
                size='lg'
                type='submit'
                className='bg-green rounded-pill border-green text-light ms-3 px-4 '
                onClick={changeStatus}
              >
                {isLoading ? <Spinner size='sm' as='span' /> : 'Oui'}
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </Container>
  )
}

export default OrderDetail
