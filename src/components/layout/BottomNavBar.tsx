import { Container, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const BottomNavBar = ({ orderData, selectedStore }: any) => {
  const retrieve = orderData['hydra:member']?.filter(
    (order: any) =>
      order.status === 'overtime' &&
      order.bookingSlot.slot.temperatureZone.locker.location === selectedStore
  )
  const progress = orderData['hydra:member']?.filter(
    (order: any) =>
      order.status === 'created' &&
      order.bookingSlot.slot.temperatureZone.locker.location === selectedStore
  )
  const delivered = orderData['hydra:member']?.filter(
    (order: any) =>
      order.status === 'operin' &&
      order.bookingSlot.slot.temperatureZone.locker.location === selectedStore
  )

  return (
    <Container fluid className='bottom-navbar bg-secondary py-1 shadow'>
      <Nav className='justify-content-evenly' activeKey='/home'>
      
        <Nav.Item className='nav-item text-center'>
          <div className='text-center '></div>
          <Link to='/dashboard' className='text-info py-1 text-decoration-none'>
            <i className='ri-home-2-line fs-4 '></i>
           
            <br />
            {/* OperIn */}
            Home
          </Link>
        </Nav.Item>
        <Nav.Item className='nav-item text-center'>
          <div className='text-center '></div>
          <Link to='/in-progress' className='text-info py-1 text-decoration-none'>
            <i className='ri-file-list-line fs-4 '></i>
            {progress?.length > 0 && (
              <span className='badge rounded-pill bg-danger'>{progress?.length}</span>
            )}
            <br />
            {/* create */}
            A livrer
          </Link>
        </Nav.Item>
        <Nav.Item className='nav-item text-center'>
          <Link to='orders-to-retrieve' className='text-info py-1 text-decoration-none'>
            <i className='ri-inbox-unarchive-line fs-4 text-center'></i>
            {retrieve?.length > 0 && (
              <span className='badge rounded-pill bg-danger'>{retrieve?.length}</span>
            )}
            <br />
            {/* Overtime */}
            A récupérer
          </Link>
        </Nav.Item>
        {/* <Nav.Item className='nav-item text-center'>
          <Link to='/orders-delivered' className='text-info py-1 text-decoration-none'>
            <i className='ri-inbox-archive-line fs-4 '></i>
            {delivered?.length > 0 && (
              <span className=' badge rounded-pill bg-danger'>{delivered?.length}</span>
            )}
            <br />
            Déposées
          </Link>
        </Nav.Item> */}
      </Nav>
    </Container>
  )
}

export default BottomNavBar
