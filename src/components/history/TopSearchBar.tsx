import { Container, Row, Col } from 'react-bootstrap'
import BackButton from '../ui/BackButton'
import { _imgFilter } from '../../utils/functions'
import BadgedIcon from '../ui/BadgedIcon'

const TopSearchBar = ({ topSearchBarProps }: any) => {
  const { selectedOrder, setSelectedOrder, searchOrder, setSearchOrder } = topSearchBarProps

  return (
    <Container fluid className='ps-2 py-0   bg-secondary rounded-pill  my-2 '>
      <Row>
        {selectedOrder ? (
          <Col xs={2} md={4} lg={4} className='m-auto mx-0 py-0 px-0 ps-2' onClick={() => setSelectedOrder('')}>
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
          {selectedOrder && (
            <>
        <Col xs={2} md={1} className='m-auto mx-0 py-0 px-0 ps-2'>
            <BadgedIcon slot={selectedOrder?.bookingSlot} borderColor="secondary" imgSize="30px" />
           
        </Col>
       
        <Col xs={8} md={4} lg={5} className='bar-tite m-auto ms-md-2 text-light text-center text-md-start ps-0 pe-2 py-0'>
              <span className='fw-bold font-75'>
              {selectedOrder?.barcode} - {selectedOrder?.client?.email}
            </span>
        </Col>
            </>
          )
        }
      </Row>
    </Container>
  )
}

export default TopSearchBar
