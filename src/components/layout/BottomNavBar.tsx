import React from 'react'
import { Container, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import imag from '../../../src/styles/g5635.png'
import UserQrcode from '../ui/modals/UserQrcode'

const BottomNavBar = ({ orderData, selectedStore }: any) => {

  //////////////////////
  //Auth deliverer modal
  //////////////////////

  const [show, setShow] = React.useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  ///////////////////////
  //Filter by status
  ///////////////////////

  const retrieve = orderData['hydra:member']?.filter(
    (order: any) =>
      order.status === 'overtime' &&
      order.bookingSlot.slot?.temperatureZone.locker.location === selectedStore
  )
  const progress = orderData['hydra:member']?.filter(
    (order: any) =>
      order.status === 'created' &&
      order.bookingSlot.slot?.temperatureZone.locker.location === selectedStore
  )
 

  return (
    <Container fluid className='bottom-navbar py-1 shadow bg-secondary px-0 mt-auto'>
      <UserQrcode show={show} handleClose={handleClose} />
      <Nav className='justify-content-evenly' activeKey='/home'>
        <Nav.Item className='nav-item text-center pt-2'>
          <Link to='/dashboard' className='text-info py-1 text-decoration-none'>
            <div className='text-center '></div>
            <i className='ri-home-2-line fs-4 '></i>
          </Link>
        </Nav.Item>
        <Nav.Item className='nav-item text-center pt-2'>
          <div className='text-center '></div>
          <span onClick={handleShow} className='text-info py-1 text-decoration-none'>
            <i className='ri-user-line fs-4'></i>
          </span>
        </Nav.Item>
        <Nav.Item
          className='nav-item text-center '
          style={{ position: 'absolute', bottom: '43px' }}
        >
          <div className='text-center '></div>
          <Link
            to='/nouvelle-commande'
            className='text-info py-1 pb-5 mb-5 text-decoration-none'
          >
            <img alt='Plus icon' src={imag} width={52} />
          </Link>
        </Nav.Item>
        <Nav.Item className='nav-item text-center'>
          <div className='text-center '></div>
        </Nav.Item>
        <Nav.Item className='nav-item text-center pt-2'>
          <div className='text-center '></div>
          <Link to='/in-progress' className='text-info py-1 text-decoration-none'>
            <i className='ri-file-list-line fs-4 '></i>
            {progress?.length > 0 && (
              <span className='badge rounded-pill bg-warning'>{progress?.length}</span>
            )}
          </Link>
        </Nav.Item>
        <Nav.Item className='nav-item text-center pt-2'>
          <Link to='orders-to-retrieve' className='text-info py-1 text-decoration-none'>
            <i className='ri-inbox-unarchive-line fs-4 text-center'></i>
            {retrieve?.length > 0 && (
              <span className='badge rounded-pill bg-warning'>{retrieve?.length}</span>
            )}
          </Link>
        </Nav.Item>
      </Nav>
    </Container>
  )
}

export default BottomNavBar
