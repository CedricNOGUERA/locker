import React from 'react'
import { Container, Row, Col, Modal, Button, Offcanvas } from 'react-bootstrap'
import userDataStore from '../../store/userDataStore'
import imag from '../../styles/openai-logo.png'
import QrCode from '../QrCode'
import AuthService from '../../service/Auth/AuthService'
import { Divider } from 'antd'
import { Link } from 'react-router-dom'
import newOrderDataStore from '../../store/newOrderDataStore'
import bookingStore from '../../store/bookingStore'

interface headerProps {
  title: string
}

const Header: React.FC<headerProps> = ({ title }: any) => {
  const dataStore = userDataStore((state: any) => state)
  const authLogout = userDataStore((state: any) => state.authLogout)
  const newOrderDelete = newOrderDataStore((state: any) => state.newOrderDelete)
  const bookingRemove = bookingStore((state: any) => state.bookingRemove)

  const [show, setShow] = React.useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)


  const [showOffcanvas, setShowOffcanvas] = React.useState<boolean>(false);

  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);




  return (
    <>
      <Modal show={show} onHide={handleClose} animation={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {dataStore.firstname} - ({dataStore.id})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container fluid className='pb-5'>
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
            <Container className='bg-light p-2    animate__animated animate__fadeInDown'>
              <Col xs={12} sm={5} md={7} lg={5} className='m-auto'>
                <QrCode orderNum={`${dataStore.id}`} />
              </Col>
            </Container>
            <Container className='text-center text-warning'>
              <small>
                <b>Respectez le sens du qrcode lors du scan</b>
              </small>
            </Container>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='info' className='text-light' onClick={handleClose}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      <Container
        fluid={'lg'}
        className='top-nav sticky-top bg-secondary py-2 text-light shadow'
      >
        <Row className='align-middle'>
          <Col className='ff-agency m-auto '>
            <img alt='Kangaroo icon' src={imag} style={{ height: '24px' }} />{' '}
            {title}
          </Col>
          <Col
            xs={5}
            md={3}
            className='text-center align-middle animate__animated animate__bounceIn top-menu border-start '
          >
            <span onClick={handleShowOffcanvas}>
              Fare Rata{' '}
              <Button variant='secondary' className=''>
                <i className='ri-menu-line'></i>
              </Button>
            </span>
          </Col>
        </Row>
      </Container>
      <Offcanvas
        show={showOffcanvas}
        onHide={handleCloseOffcanvas}
        placement='end'
        className='w-75'
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {' '}
            <b className='text-info'>
              {dataStore.firstname} - {dataStore.company_name}
            </b>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='text-secondary'>
          <Container>
            <Row className=' menu-link' onClick={() => {handleShow()
            handleCloseOffcanvas()
            }}>
              <Col xs={3}>
                {' '}
                <i className='ri-qr-code-line fs-5'></i>
              </Col>{' '}
              <Col className='m-auto user-name'>Identification</Col>
            </Row>
          </Container>
          <Container>
            <Link className='text-decoration-none text-secondary' to="/nouvelle-commande" onClick={handleCloseOffcanvas}>
            <Row className=' menu-link'>
              <Col xs={3}>
                {' '}
                <i className='ri-file-add-line fs-5'></i>
              </Col>{' '}
              <Col className='m-auto user-name'>
                N<sup>velle</sup> commande
              </Col>
            </Row>
            </Link>
          </Container>
          <Divider></Divider>
          <Container>
            <Row className='menu-link' onClick={() => {
                    authLogout()
                    newOrderDelete()
                    bookingRemove()
                    AuthService.logout()
                  }}>
              <Col xs={3}>
                {' '}
                <i className='ri-logout-box-r-line fs-5'></i>
              </Col>{' '}
              <Col className='m-auto user-name'> Log out</Col>
            </Row>
          </Container>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default Header
