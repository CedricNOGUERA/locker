import React from 'react'
import { Container, Row, Col, Button, Offcanvas } from 'react-bootstrap'
import userDataStore from '../../store/userDataStore'
import AuthService from '../../service/Auth/AuthService'
import { Divider } from 'antd'
import { Link } from 'react-router-dom'
import newOrderDataStore from '../../store/newOrderDataStore'
import bookingStore from '../../store/bookingStore'
import logsStore from '../../store/logsStore'
import UserQrcode from '../ui/modals/UserQrcode'

interface headerProps {
  title: string
}
const HeaderDesign: React.FC<headerProps> = ({ title }) => {
  //////////////////////////
  // Store states
  /////////////////////////
  const dataStore = userDataStore((state: any) => state)
  const authLogout = userDataStore((state: any) => state.authLogout)
  const newOrderDelete = newOrderDataStore((state: any) => state.newOrderDelete)
  const bookingRemove = bookingStore((state: any) => state.bookingRemove)
  const clearLogCatcher = logsStore((state: any) => state.logCatcher)

  //////////////////////////
  //Auth deliverer modal
  //////////////////////////
  const [show, setShow] = React.useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  //////////////////////////
  //menu Right (offcanvas)
  //////////////////////////
  const [showOffcanvas, setShowOffcanvas] = React.useState<boolean>(false)
  const handleCloseOffcanvas = () => setShowOffcanvas(false)
  const handleShowOffcanvas = () => setShowOffcanvas(true)


  /////////////////////////
  //Fonction de retour en arrière
  ////////////////////////
  const rtn = () => {
    window.history.back()
  }
  function refreshPage() {
    window.location.reload();
  }

  return (
    <>
      <UserQrcode show={show} handleClose={handleClose} />
      <Container
        fluid={'lg'}
        className='top-nav-design sticky-top pb-2 text-info shadow opacity-75'
      >
        <Row className=' pe-0'>
          <Col className='ff-agency m-auto pb-2 '>
            <i className={`ri-arrow-left-s-line fs-1 align-bottom`}
            onClick={() => rtn()}
            ></i>
          </Col>
          <Col xs={6} sm={8} className='ff-agency m-auto text-center pb-2 '>
            <div className='font-75 text-light'>{dataStore.company_name} </div>
            <div className=''>{title}</div>
          </Col>
          <Col className='pb-2 company-name align-bottom  text-end align-middle animate__animated animate__bounceIn top-menu fw-bold'>
            <Button variant='' onClick={handleShowOffcanvas}>
              <i className='ri-more-2-fill text-info fs-4'></i>
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
              to='/historique'
              onClick={handleCloseOffcanvas}
            >
              <Row className='menu-link'>
                <Col xs={2}>
                  {' '}
                  <i className='ri-history-line fs-5'></i>
                </Col>{' '}
                <Col className='m-auto user-name'>Historique</Col>
              </Row>
            </Link>
          </Container>
          <Container className='mb-3'>
            <Link
              className='text-decoration-none text-light'
              to='/deposees'
              onClick={handleCloseOffcanvas}
            >
              <Row className='menu-link'>
                <Col xs={2}>
                  {' '}
                  <i className='ri-check-line fs-5'></i>
                </Col>{' '}
                <Col className='m-auto user-name'>déposées</Col>
              </Row>
            </Link>
          </Container>
          <Container className='mb-3'>
            <Link
              className='text-decoration-none text-light'
              to='/update-password'
              onClick={handleCloseOffcanvas}
            >
              <Row className='menu-link'>
                <Col xs={2}>
                  {' '}
                  <i className='ri-lock-line fs-5'></i>
                </Col>{' '}
                <Col className='m-auto user-name'>Modifier votre mot passe</Col>
              </Row>
            </Link>
          </Container>
          <Container className='mb-3'>
            <span
              className='text-decoration-none text-light'
              onClick={refreshPage}
            >
              <Row className='menu-link'>
                <Col xs={2}>
                  {' '}
                  <i className='ri-restart-line fs-5'></i>
                </Col>{' '}
                <Col className='m-auto user-name'>Actualiser l'application</Col>
              </Row>
            </span>
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

export default HeaderDesign
