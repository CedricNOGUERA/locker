import React from 'react'
import { Container, Row, Col, Dropdown } from 'react-bootstrap'

const SearchBar = ({ searchBarProps }: any) => {
  const {
    searchOrder,
    setSearchOrder,
    setSelectedStore,
    selectedOrderCity,
    setSelectedOrderCity,
    allSlot,
  
  } = searchBarProps

  const [uniqueTab, setUniqueTab] = React.useState<any>([])

  React.useEffect(() => {
    // setReadOnlyInput(true)
  }, [])

  React.useEffect(() => {
    const bookingLocker: any = allSlot?.['hydra:member']?.map(
      (locker: any) => locker?.slot?.temperatureZone?.locker
    )
    const unique: any = [...new Set(bookingLocker?.map((locker: any) => locker?.location))]

    setUniqueTab(unique)
  }, [allSlot])

  const filteredCity = (place: any) => {
    const city: any = allSlot?.['hydra:member']
      ?.map((locker: any) => locker?.slot?.temperatureZone?.locker)
      .filter((lockerCity: any) => lockerCity?.location === place)
    return city && city[0]?.city
  }
  const filteredStore = (place: any) => {
    const city: any = allSlot?.['hydra:member']
      ?.map((locker: any) => locker?.slot?.temperatureZone?.locker)
      .filter((lockerCity: any) => lockerCity?.location === place)
    return city && city[0]['@id']
  }
 

  return (
    <Container className={`mb-2 text-center`}>
      <Container
        fluid
        className=' text-info ps-2 pe-4 py-0 bg-secondary rounded-pill  my-auto '
      >
        <Dropdown>
          <Container fluid className='px-0 py-0'>
            <Row className='align-middle'>
              <Col className='text-start'>
                <div className='input-group '>
                  {/* <i className='ri-search-line me-1 '></i> */}
                  <input
                    type='text'
                    className='form-control rounded-pill '
                    placeholder='N° Commande...'
                    aria-label='searchOrder'
                    aria-describedby='search-order'
                    style={{ height: '40px' }}
                    // style={{ height: '25px' }}
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
                    <i className='ri-search-line fs-5 input-button'></i>
                  )}
                </div>
              </Col>
              {allSlot?.['hydra:member']?.length > 0 && (
                <Col xs={4} md={2} className='text- p-0 m-auto'>
                  <Dropdown.Toggle
                    as='div'
                    variant=''
                    id='dropdown-basic'
                    className='text-ligh'
                  >
                    <i className='ri-store-2-line fs-5 align-middle text-info me-2'></i>{' '}
                    <span className='font-85'>{selectedOrderCity} </span>
                  </Dropdown.Toggle>
                </Col>
              )}
            </Row>
          </Container>
          <Dropdown.Menu className='shadow ' style={{ width: 360 }}>
            {uniqueTab?.map((locker: any, indx: any) => (
              <Dropdown.Item
                key={Math.random()}
                title={locker}
                className='w-100'
                onClick={() => {
                  setSelectedOrderCity(filteredCity(locker))
                  setSelectedStore(filteredStore(locker))
                }}
              >
                <Row className='item-menu text-secondary align-middle pe-3 w-100'>
                  <Col xs={2} className='ms-0 ps-1'>
                    {' '}
                    <i className='ri-store-2-line fs-5 align-bottom text-info me-2'></i>{' '}
                  </Col>{' '}
                  <Col
                    xs={10}
                    className='m-auto my-0 user-name ps-0 pb-0 ms- font-85  text-dark'
                  >
                    {locker}
                  </Col>
                </Row>
                <Row className=' text-secondary '>
                  <Col xs={2} className=''>
                    {' '}
                  </Col>{' '}
                  <Col xs={10} className='font-75 font-weight-300 m-auto ps-0 py-0 ms-'>
                    {filteredCity(locker)}
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
