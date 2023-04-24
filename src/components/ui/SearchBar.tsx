import React from 'react'
import { Container, Row, Col, Dropdown, Tooltip, OverlayTrigger } from 'react-bootstrap'

const SearchBar = ({ searchBarProps }: any) => {
  const {
    searchOrder,
    setSearchOrder,
    selectedStore,
    setSelectedStore,
    selectedOrderCity,
    setSelectedOrderCity,
    allSlot,
  } = searchBarProps

  const bookingLocker = allSlot?.['hydra:member']?.map(
    (locker: any) => locker?.slot?.temperatureZone?.locker
  )

  return (
    <Container className='mt-2 text-center'>
      <Container
        fluid
        className=' text-info ps-2 pe-4 py-0 bg-secondary rounded-pill shadow my-auto '
      >
        <Dropdown>
          <Container fluid className='px-0'>
            <Row className='align-middle'>
              <Col className='m-auto text-start'>
                <div className='input-group'>
                  <i className='ri-search-line me-1'></i>
                  <input
                    type='text'
                    className='form-control rounded-pill'
                    placeholder='N° Commande...'
                    aria-label='Username'
                    aria-describedby='basic-addon1'
                    style={{ height: '25px' }}
                    value={searchOrder}
                    onChange={(e) => setSearchOrder(e.currentTarget.value)}
                  />
                </div>
              </Col>
              <Col xs={1} className='m-auto text-start text-md-end'>
                <i className='ri-store-2-line fs-5 '></i>{' '}
              </Col>
              <Col xs={4} md={2} className='text-start text-md-end'>
                <Dropdown.Toggle variant='' id='dropdown-basic' className='text-light'>
                  {selectedOrderCity}
                </Dropdown.Toggle>
              </Col>
            </Row>
          </Container>
          <Dropdown.Menu className='shadow'>
            {bookingLocker?.map((locker: any) => (
              <Dropdown.Item
                title={locker?.location}
                onClick={() => {
                  setSelectedOrderCity(locker?.city)
                  setSelectedStore(locker?.location)
                }}
              >
                <Row className=''>
                  <Col xs={3}>
                    {' '}
                    <i className='ri-store-2-line fs-5'></i>
                  </Col>{' '}
                  <Col className='m-auto user-name'>{locker.city}</Col>
                </Row>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Container>
    </Container>
  )
}

export default SearchBar
