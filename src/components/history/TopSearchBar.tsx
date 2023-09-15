import { Container, Row, Col } from 'react-bootstrap'
import BackButton from '../ui/BackButton'
import { _imgFilter } from '../../utils/functions'
import BadgedIcon from '../ui/BadgedIcon'

const TopSearchBar = ({ topSearchBarProps }: any) => {
  const { selectedOrder, setSelectedOrder, searchOrder, setSearchOrder } = topSearchBarProps

  return (
    <Container fluid className={`ps- sticky-top rounded-pill ${selectedOrder && "bg-secondary"}  mb-2`}>
      <Row>
        {!selectedOrder && (
          <>
            <Col xs={12} className=' text-start '>
              <div className='input-group'>
                <input
                  type='text'
                  className='form-control rounded-pill'
                  placeholder='N° Commande...'
                  aria-label='search'
                  aria-describedby='search-order'
                  style={{ height: '40px', 
                backgroundColor: '#ddd',
                }}
                  value={searchOrder}
                  onChange={(e) => setSearchOrder(e.currentTarget.value)}
                />
                 {searchOrder !== '' ? (
                    <i
                      className='ri-close-circle-fill text-warning delete-button fs-3'
                      onClick={() => {
                        setSearchOrder('')
                      }}
                    ></i>
                  ) : (
                    <i className='ri-search-line fs-5 input-button  text-secondary'></i>
                  )}
              </div>
            </Col>
          </>
        )}
        {selectedOrder && (
          <>
            <Col
              xs={2}
              md={1}
              lg={1}
              className='m-auto py-0 text-center'
              onClick={() => setSelectedOrder('')}
            >
              <BackButton />
            </Col>
            <Col className='m-auto text-light text-center ps-1 pe-2 py-0'>
              <span className='fw-bold font-75'>{selectedOrder?.barcode}</span>
            </Col>
            <Col xs={2} md={1} lg={1} className='m-auto text-light text-start  me-3 py-0'>
              <BadgedIcon
                slot={selectedOrder?.bookingSlot}
                borderColor='secondary'
                imgSize='30px'
              />
            </Col>
          </>
        )}
      </Row>
    </Container>
  )
}

export default TopSearchBar
