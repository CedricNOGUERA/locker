import React from 'react'
import { Container, Row, Col, Dropdown } from 'react-bootstrap'

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

  const [uniqueTab, setUniqueTab] = React.useState([])
  const [cityTab, setCityTab] = React.useState([])

  React.useEffect(() => {
    const bookingLocker: any = allSlot?.['hydra:member']?.map(
      (locker: any) => locker?.slot?.temperatureZone?.locker
    )
    const deduplicate: any = [...new Set(bookingLocker?.map((locker: any) => locker.location))]
    setUniqueTab(deduplicate)

  
    const deduplicateCity: any = [...new Set(bookingLocker?.map((locker: any) => locker.city))]
    setCityTab(deduplicateCity)
  }, [allSlot])

  console.log(cityTab)
  return (
    <Container className='mt-2 text-center'>
      <Container
        fluid
        className=' text-info ps-2 pe-4 py-0 bg-secondary rounded-pill shadow my-auto '
      >
        <Dropdown>
          <Container fluid className='px-0 py-0'>
            <Row className='align-middle'>
              <Col className=' text-start '>
                <div className='input-group'>
                  <i className='ri-search-line me-1 '></i>
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

              <Col xs={4} md={2} className='text- p-0 m-auto'>
                <Dropdown.Toggle
                  as='div'
                  variant=''
                  id='dropdown-basic'
                  className='text-light'
                >
                  <i className='ri-store-2-line fs-5 align-middle text-info me-2'></i>{' '}
                  <span className='font-85'>{selectedOrderCity}</span>
                </Dropdown.Toggle>
              </Col>
            </Row>
          </Container>
          <Dropdown.Menu className='shadow'>
            {uniqueTab?.map((locker: any, indx: any) => (
              <Dropdown.Item
                key={Math.random()}
                title={locker}
                onClick={() => {
                  setSelectedOrderCity(cityTab[indx])
                  setSelectedStore(locker)
                }}
              >
                <Row className='item-menu text-secondary align-middle'>
                  <Col xs={1} className=''>
                    {' '}
                    <i className='ri-store-2-line fs-5 align-bottom text-info me-2'></i>{' '}
                  </Col>{' '}
                  <Col xs={10} className='m-auto my-0 user-name ps-3 pb-0  text-dark'>
                    {locker}
                  </Col>
                </Row>
                <Row className=' text-secondary '>
                  <Col xs={1} className=''>
                    {' '}
                  </Col>{' '}
                  <Col
                    xs={10}
                    className='font-75 font-weight-300 m-auto ps-3 py-0'
                  >
                    {cityTab[indx]}
                  </Col>
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
