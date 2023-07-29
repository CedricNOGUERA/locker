import React from 'react'
import { Container, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import imag from '../../../src/styles/imagePlus4.png'
import UserQrcode from '../ui/modals/UserQrcode'

const BottomNavBar = ({ orderData, selectedStore, selectedItem, setSelectedItem }: any) => {
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
      order?.status === 'overtime' &&
      order?.bookingSlot.slot?.temperatureZone.locker['@id'] === selectedStore
  )
  const progress = orderData['hydra:member']?.filter(
    (order: any) =>
      // order?.status === 'created' &&
      order?.status === 'picked_up' &&
      order?.bookingSlot.slot?.temperatureZone.locker['@id'] === selectedStore
  )
  const ready_for_delivery = orderData['hydra:member']?.filter(
    (order: any) =>
      order?.status === 'ready_for_delivery' &&
      order?.bookingSlot.slot?.temperatureZone.locker['@id'] === selectedStore
  )

  /////////////////////
  //onSelect text become white
  /////////////////////
  const handleSelect = (item: any) => {
    setSelectedItem(item)
  }

  
  return (
    <Container fluid className='bottom-navbar py-1 shadow bg-secondary px-0 mt-auto'>
      <UserQrcode show={show} handleClose={handleClose} />
      <Nav className='justify-content-evenly border-0 rounded' activeKey='home'>
        <Nav.Item
          className='nav-item text-center'
          onClick={() => handleSelect('preparations')}
        >
          <Link
            to='/preparations'
            className={`nav-link  text-${
              selectedItem === 'preparations' ? 'light' : 'info'
            } py-1 pb-2 text-decoration-none`}
          >
            <i className='ri-checkbox-line fs-3'></i>
            {ready_for_delivery?.length > 0 && (
              <span className='badge rounded-pill bg-info'>{ready_for_delivery?.length}</span>
            )}
            <p>Prérations </p>
          </Link>
        </Nav.Item>
        <Nav.Item className='nav-item text-center' onClick={() => handleSelect('progress')}>
          <Link
            className={`nav-link px-0 text-${
              selectedItem === 'progress' ? 'light' : 'info'
            } py-1 pb-2 text-decoration-none`}
            to='/in-progress'
          >
            <i className='ri-truck-line fs-3 '></i>
            {progress?.length > 0 && (
              <span className='badge rounded-pill bg-info'>{progress?.length}</span>
            )}
            <p>Livraisons</p>
          </Link>
        </Nav.Item>
        {/* <Nav.Item
          className='nav-item text-center '
          style={{ position: 'absolute', bottom: '45px' }}
          onClick={() => handleSelect('order')}
        >
          <div className='text-center '></div>
          <Link
            to='/nouvelle-commande'
            className='text-info py-1 pb-5 mb-5 text-decoration-none'
          >
            <img alt='Plus icon' src={imag} width={52} height={52} />
          </Link>
        </Nav.Item>
        <Nav.Item className='nav-item text-center'>
          <div className='text-center '></div>
        </Nav.Item> */}

        <Nav.Item className='nav-item text-center' onClick={() => handleSelect('retrieve')}>
          <Link
            className={`nav-link px-0  text-${
              selectedItem === 'retrieve' ? 'light' : 'info'
            } py-1 pb-2 text-decoration-none`}
            to='/orders-to-retrieve'
          >
            <i className='ri-inbox-unarchive-line fs-3 text-center'></i>
            {retrieve?.length > 0 && (
              <span className='badge rounded-pill bg-info'>{retrieve?.length}</span>
            )}
            <p>Retraits</p>
          </Link>
        </Nav.Item>
        <Nav.Item className='nav-item text-center ' onClick={() => handleSelect('home')}>
          <Link
            to='/historique'
            className={`nav-link  text-${
              selectedItem === 'home' ? 'light' : 'info'
            } py-1 pb-2 text-decoration-none`}
          >
            <i className='ri-history-line fs-3'></i>
            <p>Historique</p>
          </Link>
        </Nav.Item>
      </Nav>
    </Container>
  )
}
export default BottomNavBar
