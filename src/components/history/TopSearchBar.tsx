import { Container, Row, Col } from 'react-bootstrap'
import BackButton from '../ui/BackButton'
import { _imgFilter } from '../../utils/functions'

const TopSearchBar = ({ topSearchBarProps }: any) => {
  const { selectedOrder, setSelectedOrder, searchOrder, setSearchOrder } = topSearchBarProps

  return (
    <Container fluid className='ps-2 py-0   bg-secondary rounded-pill  my-2 '>
      <Row>
        {selectedOrder ? (
          <Col xs={2} md={2} lg={5} className='py-0' onClick={() => setSelectedOrder('')}>
            <BackButton />
          </Col>
        ) : (
          <Col xs={12} className=' text-start '>
            <div className='input-group'>
              <i className='ri-search-line ps-0 me-1 text-info '></i>
              <input
                type='text'
                className='form-control rounded-pill'
                placeholder='N° Commande...'
                aria-label='search'
                aria-describedby='search-order'
                style={{ height: '25px' }}
                value={searchOrder}
                onChange={(e) => setSearchOrder(e.currentTarget.value)}
              />
              {searchOrder !== '' && (
                <i
                  className='ri-close-circle-fill text-warning delete-button'
                  onClick={() => setSearchOrder('')}
                ></i>
              )}
            </div>
          </Col>
        )}
        <Col className='bar-tite m-auto text-light text-center ps-0 pe-2 py-0'>
          {selectedOrder && (
            <span className='fw-bold font-75'>
              <img
                alt='Temp icon'
                src={
                  'https://img.icons8.com/color/42/' +
                  _imgFilter(selectedOrder?.bookingSlot?.slot.temperatureZone?.keyTemp) +
                  '.png'
                }
                style={{ width: '30px', height: '30px' }}
                className='align-middle me-2'
              />
              {selectedOrder?.barcode} - {selectedOrder?.client?.email}
            </span>
          )}
        </Col>
        {selectedOrder && <Col xs={2} md={2} lg={5} className='py-0'></Col>}
      </Row>
    </Container>
  )
}

export default TopSearchBar
