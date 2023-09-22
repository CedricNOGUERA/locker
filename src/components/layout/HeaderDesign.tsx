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

  ////////////////////////
  //origin page
  ///////////////////////
  // const [origin, setOrigin] = React.useState(window?.history?.state.key);
  
  /////////////////////////
  //Fonction de retour en arrière
  ////////////////////////
  // const rtn = () => {
  //   if(window?.history?.state?.key !== origin){
  //     window.history.back()
  //   }
  // }
  function refreshPage() {
    window.location.reload()
  }

  return (
    <>
      <UserQrcode show={show} handleClose={handleClose} />
      <Container
        fluid={'lg'}
        className='top-nav-design sticky-to pb-2 text-info shado opacity-75'
      >
        <Row className=' pe-0'>
          <Col xs={2} className='py-2 ff-agency m-auto text-center'>
          </Col>
          <Col xs={8} sm={8} className='ff-agency m-auto text-center pb-2 '>
            <div>{title}</div>
          </Col>
          <Col xs={2} className='py-2 m-auto  align-bottom  text-end'>
            <Button aria-label="Aria Menu" title='Menu' variant='' onClick={handleShowOffcanvas}>
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
        <Offcanvas.Header
        className='pb-0'
        closeButton closeVariant='white'></Offcanvas.Header>
        <Offcanvas.Body className='text-light pe-0 pt-0'>
          <Container className='mb-2'>
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
          {/* <Container className='mb-2'>
            <Link
              className='text-decoration-none text-light'
              to='/deposees'
              onClick={handleCloseOffcanvas}
            >
              <Row className='menu-link'>
                <Col xs={2}>
                  {' '}
                  <i className='ri-flask-line fs-5'></i>
                </Col>{' '}
                <Col className='m-auto user-name'>Test</Col>
              </Row>
            </Link>
          </Container>
          <Container className='mb-2'>
            <Link
              className='text-decoration-none text-light'
              to='/dashboard'
              onClick={handleCloseOffcanvas}
            >
              <Row className=' menu-link'>
                <Col xs={2}>
                  {' '}
                  <i className='ri-line-chart-line fs-5'></i>
                </Col>{' '}
                <Col className='m-auto user-name'>Tableau de bord</Col>
              </Row>
            </Link>
          </Container> */}
          {/* <Container className='mb-2'>
            <Link
              className='text-decoration-none text-light'
              to='/retour'
              onClick={handleCloseOffcanvas}
            >
              <Row className=' menu-link'>
                <Col xs={2}>
                  {' '}
                  <i className='ri-arrow-go-back-line fs-5'></i>
                </Col>{' '}
                <Col className='m-auto user-name'>Commande à retourner</Col>
              </Row>
            </Link>
          </Container> */}
          <Container className='mb-2'>
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
          <Container className='mb-2'>
            <span className='text-decoration-none text-light' onClick={refreshPage}>
              <Row className='menu-link'>
                <Col xs={2}>
                  {' '}
                  <i className='ri-restart-line fs-5'></i>
                </Col>{' '}
                <Col className='m-auto user-name'>Rafraichir l'application</Col>
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
