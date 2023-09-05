import React from 'react'
import { Container, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import UserQrcode from '../ui/modals/UserQrcode'
import userDataStore from '../../store/userDataStore'
import imag from '../../styles/imagePlus4.png'

const BottomNavBar = ({
  orderData,
  selectedStore,
  selectedItem,
  setSelectedItem,
  bottomProps,
}: any) => {
  const { orderReady, orderPickedUp, orderExpired } = bottomProps
  //////////////////////////
  // Store
  /////////////////////////
  const dataStore = userDataStore((state: any) => state)

  //////////////////////
  //Auth deliverer modal
  //////////////////////
  const [show, setShow] = React.useState(false)
  const [isScroll, setIsScroll] = React.useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  ///////////////////////
  //Filter by status
  ///////////////////////
  const retrieve = orderExpired['hydra:member']?.filter(
    (order: any) =>
      order?.bookingSlot?.slot?.temperatureZone?.locker &&
      order?.bookingSlot?.slot?.temperatureZone?.locker['@id'] === selectedStore
  )
  const progress = orderPickedUp['hydra:member']?.filter(
    (order: any) =>
      order?.bookingSlot?.slot?.temperatureZone?.locker['@id'] &&
      order?.bookingSlot?.slot?.temperatureZone?.locker['@id'] === selectedStore &&
      order?.shippedBy &&
      order?.shippedBy['@id'] === `/api/users/${dataStore.id}`
  )
  const ready_for_delivery = orderReady['hydra:member']?.filter(
    (order: any) =>
      order?.bookingSlot?.slot?.temperatureZone?.locker &&
      order?.bookingSlot.slot?.temperatureZone?.locker['@id'] === selectedStore
  )

  /////////////////////
  //onSelect text become white
  /////////////////////
  const handleSelect = (item: any) => {
    setSelectedItem(item)
  }

  function hasDelivererRole(roles: any[]) {
    return roles?.includes('ROLE_ADMIN')
  }

  const userRoles = dataStore.roles
  const hasDeliverer = hasDelivererRole(userRoles)


  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 100) {
        setIsScroll(true)
      } else {
        setIsScroll(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])



  return (
    <Container fluid className={`bottom-navbar ${isScroll ?  'animate__animated animate__fadeOutDown' :  'animate__animated animate__fadeInUp'} py-1 shadow bg-secondary px-0 mt-auto`}>
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
            } py-1 pb-2 px-0 text-decoration-none`}
          >
            <i className='ri-checkbox-line fs-3'></i>
            {ready_for_delivery?.length > 0 && (
              <span
                className={`badge rounded-pill bg-${
                  selectedItem === 'preparations' ? 'warning' : 'info'
                }`}
              >
                {ready_for_delivery?.length}
              </span>
            )}
            <p>Prérations </p>
          </Link>
        </Nav.Item>
        <Nav.Item className='nav-item text-center' onClick={() => handleSelect('progress')}>
          <Link
            className={`nav-link px-0 text-${
              selectedItem === 'progress' ? 'light' : 'info'
            } py-1 pb-2 text-decoration-none`}
            to='/livraisons'
          >
            <i className='ri-truck-line fs-3 '></i>
            {progress?.length > 0 && (
              <span
                className={`badge rounded-pill bg-${
                  selectedItem === 'progress' ? 'warning' : 'info'
                }`}
              >
                {progress?.length}
              </span>
            )}
            <p>Livraisons</p>
          </Link>
        </Nav.Item>
        {hasDeliverer && (
          <>
            <Nav.Item
              className='nav-item text-center '
              style={{ position: 'absolute', bottom: '45px' }}
              onClick={() => handleSelect('order')}
              title='Nouvelle commande'
            >
              <Link
                to='/nouvelle-commande'
                className='text-info py-1 pb-5 mb-5 text-decoration-none'
              >
                <img alt='Plus icon' src={imag} width={52} height={52} />
              </Link>
            </Nav.Item>

            <Nav.Item className='nav-item text-center'>
              <div className='text-center '></div>
            </Nav.Item>
          </>
        )}
        <Nav.Item className='nav-item text-center' onClick={() => handleSelect('retrieve')}>
          <Link
            className={`nav-link px-0  text-${
              selectedItem === 'retrieve' ? 'light' : 'info'
            } py-1 pb-2 text-decoration-none`}
            to='/retraits'
          >
            <i className='ri-inbox-unarchive-line fs-3 text-center'></i>
            {retrieve?.length > 0 && (
              <span
                className={`badge rounded-pill bg-${
                  selectedItem === 'retrieve' ? 'warning' : 'info'
                }`}
              >
                {retrieve?.length}
              </span>
            )}
            <p>Retraits</p>
          </Link>
        </Nav.Item>
        <Nav.Item className='nav-item text-center ' onClick={() => handleSelect('history')}>
          <Link
            to='/historique'
            className={`nav-link px-0 text-${
              selectedItem === 'history' ? 'light' : 'info'
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
