import React from 'react'
import { Container, Row, Col, Modal, Button, Offcanvas } from 'react-bootstrap'
import userDataStore from '../../store/userDataStore'
import QrCode from '../QrCode'
import AuthService from '../../service/Auth/AuthService'
import { Divider } from 'antd'
import { Link } from 'react-router-dom'
import newOrderDataStore from '../../store/newOrderDataStore'
import bookingStore from '../../store/bookingStore'
import logsStore from '../../store/logsStore'
import imag from '../../styles/g4523.png'


interface headerProps {
  title: string
  icon: string
}

const Header: React.FC<headerProps> = ({ title, icon }: any) => {

  //////////////////////////
  // Store states
  /////////////////////////
  const dataStore = userDataStore((state: any) => state)
  const authLogout = userDataStore((state: any) => state.authLogout)
  const newOrderDelete = newOrderDataStore((state: any) => state.newOrderDelete)
  const bookingRemove = bookingStore((state: any) => state.bookingRemove)
  const clearLogCatcher = logsStore((state: any) => state.logCatcher)

  //Auth deliverer modal
  const [show, setShow] = React.useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  //menu Right (offcanvas)
  const [showOffcanvas, setShowOffcanvas] = React.useState<boolean>(false)
  const handleCloseOffcanvas = () => setShowOffcanvas(false)
  const handleShowOffcanvas = () => setShowOffcanvas(true)

  return (
    <>
      <Modal show={show} onHide={handleClose} animation={false} centered>
        <Modal.Header closeButton>
          <Modal.Title className='text-secondary'>
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
                <QrCode data={`${dataStore.id}`} />
              </Col>
            </Container>
            <Container className='text-center text-warning'>
              <small>
                <b>Respectez le sens du qrcode lors du scan</b>
              </small>
            </Container>
          </Container>
        </Modal.Body>
        <Container className='text-end'>
          <Button variant='secondary' className='text-light w-25 m-3' onClick={handleClose}>
            Fermer
          </Button>
        </Container>
      </Modal>
      <Container
        fluid={'lg'}
        className='top-nav sticky-top bg-secondary py-2 text-info shadow'
      >
        <Row className='align-middle pe-0'>
          <Col className='ff-agency m-auto '>
            <i className={`${icon} fs-4 align-bottom`}></i> 
            {/* <i className={`ri-settings-6-line fs-4 align-bottom`}></i>  */}
            {/* <img alt='Conteneur' src={imag} width={24} height={24} /> */}
            <span className='ps-2'>{title}</span>
          </Col>
          <Col
            xs={5}
            md={3}
            className='company-name align-bottom  text-center align-middle animate__animated animate__bounceIn top-menu border-start fw-bold'
          >
            {dataStore.company_name}{' '}
            <Button variant='secondary' className='' onClick={handleShowOffcanvas}>
              <i className='ri-menu-line'></i>
            </Button>
          </Col>
        </Row>
      </Container>
      <Offcanvas
        show={showOffcanvas}
        onHide={handleCloseOffcanvas}
        placement='end'
        className='menu-right bg-secondary border-0'
      >
        <Offcanvas.Header closeButton closeVariant='white'>
          <Offcanvas.Title>
            {' '}
            <b className='text-info'>
              {dataStore.firstname} - {dataStore.company_name}
            </b>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className='text-light'>
          <Container className='mb-3'>
            <Row
              className=' menu-link'
              onClick={() => {
                handleShow()
                handleCloseOffcanvas()
              }}
            >
              <Col xs={2}>
                {' '}
                <i className='ri-qr-code-line fs-5'></i>
              </Col>{' '}
              <Col className='m-auto user-name'>Identification</Col>
            </Row>
          </Container>
          {/* <Container className='mb-3'>
            <Link
              className='text-decoration-none text-light'
              to='/dashboard'
              onClick={handleCloseOffcanvas}
            >
              <Row className=' menu-link'>
                <Col xs={2}>
                  {' '}
                  <i className='ri-pie-chart-2-fill fs-5'></i>
                </Col>{' '}
                <Col className='m-auto user-name'>Tableau de bord</Col>
              </Row>
            </Link>
          </Container> */}
          <Container className='mb-3'>
            <Link
              className='text-decoration-none text-light'
              to='/nouvelle-commande'
              onClick={handleCloseOffcanvas}
            >
              <Row className=' menu-link'>
                <Col xs={2}>
                  {' '}
                  <i className='ri-file-add-line fs-5'></i>
                </Col>{' '}
                <Col className='m-auto user-name'>Nouvelle commande</Col>
              </Row>
            </Link>
          </Container>
          <Container className='mb-3'>
            <Link
              className='text-decoration-none text-light'
              to='/map'
              onClick={handleCloseOffcanvas}
            >
              <Row className=' menu-link'>
                <Col xs={2}>
                  {' '}
                  <i className='ri-map-pin-line fs-5'></i>
                </Col>{' '}
                <Col className='m-auto user-name'>Map</Col>
              </Row>
            </Link>
          </Container>
          <Divider className='log-out pb-5 me-3'></Divider>
          <Container className='log-out'>
            <Row
              className='menu-link'
              onClick={() => {
                authLogout()
                newOrderDelete()
                bookingRemove()
                AuthService.logout()
                clearLogCatcher()
              }}
            >
              <Col xs={2}>
                {' '}
                <i className='ri-logout-box-r-line fs-5'></i>
              </Col>{' '}
              <Col className='m-auto user-name'>Déconnexion</Col>
            </Row>
          </Container>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default Header
