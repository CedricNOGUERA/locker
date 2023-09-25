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
 console.log(selectedStore)

  return (
    <Container className={`search-bar mb-2 text-center`}>
      <Container
        fluid
        className={` text-light ps-2 rounded-pill  my-auto  ${uniqueTab?.length > 1 && "bg-warning pe-4"}`} 
      >
        <Dropdown>
          <Container fluid className='px-0'>
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

                    style={{ height: uniqueTab?.length > 1 ? '35px' : '40px',
                    backgroundColor: '#ddd',
                  }}
                    value={searchOrder}
                    onChange={(e) => setSearchOrder(e.currentTarget.value)}
                  />
                  {searchOrder !== '' ? (
                    <i
                      className={`ri-close-circle-fill text-green ${uniqueTab?.length > 1 ? "delete-button fs-2" : "delete-history-button fs-2"} 
                      
                      `}
                      onClick={() => {
                        setSearchOrder('')
                      }}
                    ></i>
                  ) : (
                    <i className={`text-secondary ri-search-line fs-5 ${uniqueTab?.length > 1 ? "input-button" : "input-history-button"} `}></i>
                  )}
                </div>
              </Col>
              {uniqueTab?.length > 1 && (
                <Col xs={4} md={2} className='text- p-0 m-auto'>
                  <Dropdown.Toggle
                    as='div'
                    variant=''
                    id='dropdown-basic'
                    className='text-ligh'
                  >
                    <i className='ri-store-2-line fs-5 align-middle text-light me-2'></i>{' '}
                    <span className='font-85'>{uniqueTab?.length > 1 && selectedStore === '/api/lockers/3' ? 'Côté mer' : selectedStore === '/api/lockers/6' ? 'Côté mont.' : 'Arue'} </span>
                  </Dropdown.Toggle>
                </Col>
              )}
            </Row>
          </Container>
          <Dropdown.Menu className='shadow' style={{ width: 360 }}>
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
                    <i className='ri-store-2-line fs-5 align-bottom text-green me-2'></i>{' '}
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
