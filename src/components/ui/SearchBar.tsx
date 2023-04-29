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

  const [test, settest] = React.useState<any>()

  const bookingLocker: any = allSlot?.['hydra:member']?.map(
    (locker: any) => locker?.slot?.temperatureZone?.locker
  )

  const newObject: any = []

  React.useEffect(() => {
    unique()
  }, [allSlot])

  const unique = () => {
    for (var i = 0; i < bookingLocker?.length; i++) {
      newObject?.push(bookingLocker[i].location)
    }
    // return newObject
    settest(newObject)
  }

  var uniquex = Array.from(new Set(test))

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
                  <i className='ri-store-2-line fs-5 align-bottom text-info me-2'></i>{' '}
                  <span>{selectedOrderCity}</span>
                </Dropdown.Toggle>
              </Col>
            </Row>
          </Container>
          <Dropdown.Menu className='shadow'>
            {uniquex?.map((locker: any) => (
              <Dropdown.Item
                key={Math.random()}
                title={locker}
                onClick={() => {
                  setSelectedStore(locker)
                }}
              >
                <Row className=' text-secondary'>
                  <Col xs={2} className=''>
                    {' '}
                    {/* <img
                    alt='zone'
                    src={
                      'https://img.icons8.com/color/512/' +
                      (locker?.slot?.temperatureZone?.keyTemp === 'FRESH'
                        ? 'organic-food'
                        : locker?.slot?.temperatureZone.keyTemp === 'FREEZE'
                        ? 'winter'
                        : 'dry') +
                      '.png'
                    }
                    style={{ width: '24px' }}
                  /> */}
                  <i className='ri-store-2-line fs-5 align-bottom text-info me-2'></i>{' '}

                  </Col>{' '}
                  <Col xs={9} className='m-auto user-name ps-3'>
                    {locker}
                  </Col>
                </Row>
              </Dropdown.Item>
            ))}
            {/* {allSlot?.['hydra:member']?.map((locker: any) => (
              <Dropdown.Item
              key={Math.random()}
                title={locker?.slot?.temperatureZone?.locker?.location}
                onClick={() => {
                  setSelectedOrderCity(locker?.slot?.temperatureZone?.locker?.city)
                  setSelectedStore(locker?.slot?.temperatureZone?.locker?.location)
                }}
              >
                <Row className=' text-secondary'>
                  <Col xs={2} className=''>
                    {' '}
                    <img
                    alt='zone'
                    src={
                      'https://img.icons8.com/color/512/' +
                      (locker?.slot?.temperatureZone?.keyTemp === 'FRESH'
                        ? 'organic-food'
                        : locker?.slot?.temperatureZone.keyTemp === 'FREEZE'
                        ? 'winter'
                        : 'dry') +
                      '.png'
                    }
                    style={{ width: '24px' }}
                  />
                  </Col>{' '}
                  <Col xs={9} className='m-auto user-name ps-3'>{locker?.slot?.temperatureZone?.locker.location}</Col>
                </Row>
              </Dropdown.Item>
            ))} */}
          </Dropdown.Menu>
        </Dropdown>
      </Container>
    </Container>
  )
}

export default SearchBar
