import React from 'react'
import { Alert, Badge, Card, Col, Container, Row } from 'react-bootstrap'
import userDataStore from '../store/userDataStore'
import { useOutletContext, Link, Navigate } from 'react-router-dom'
import DashBoardLoader from '../components/ui/loading/DashBoardLoader'
import AlertIsError from '../components/ui/warning/AlertIsError'

const DashBoard = () => {
  //////////////////////////
  // booleans States
  /////////////////////////
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isError, setIsError] = React.useState<boolean>(false)

  //////////////////////////
  // Store & context state
  /////////////////////////
  const isLogged = userDataStore((state: any) => state.isLogged)
  const dataStore = userDataStore((state: any) => state)
  const [
    selectedStore,
    setSelectedStore,
    orderData,
    setOrderData,
    selectedOrderCity,
    setSelectedOrderCity,
    allSlot,
    setAllSlot,
   
  ] = useOutletContext<any>()

 

  React.useEffect(() => {
    if (allSlot && allSlot['hydra:member']?.length > 0) {
      setIsLoading(false)
    } else {
      if (allSlot && allSlot['hydra:member']?.length < 0) {
        setIsError(true)
        setIsLoading(false)
      }
      setIsLoading(true)
    }
  }, [allSlot])

  const rtn = () => {
    window.history.back()
  }

console.log(allSlot)

  return (
    <Container className='text-center mt-2'>
      {(!isLogged || !dataStore.token || !dataStore.company_name) && (
        <Navigate to='/connexion' />
      )}
      <div className='ff-agency text-info bg-secondary rounded-pill  mt-2 mb-3'>
        <Row className='p'>
          <Col xs={2}>
            <i
              className='ri-arrow-left-line text-info ms-2 fs-3 bg-secondary rounded-pill align-bottom'
              onClick={() => rtn()}
            ></i>{' '}
          </Col>
          <Col className='text-start ps-5'>Visualisation générale</Col>
        </Row>
      </div>

      {isError ? (
        <Container className='text-center mt-5'>
          <AlertIsError
            title="Une erreur s'est produite"
            msg='Vérifiez votre connexion internet ou contactez votre administrateur.'
            colorIcon='danger'
          />
        </Container>
      ) : isLoading ? (
        <DashBoardLoader />
      ) : (
        allSlot?.['hydra:member']?.map((slot: any) => (
          <Card
            key={Math.random()}
            className='py-0 mb-3 border-0 rounded bg-secondary animate__animated'
            onClick={() => {
              setSelectedStore(slot?.slot?.temperatureZone?.locker?.location)
              setSelectedOrderCity(slot?.slot?.temperatureZone?.locker?.city)
            }}
          >
            <Link to='/in-progress' className=' text-decoration-none'>
              {' '}
              <Row className='pe-0'>
                <Col xs={2} className='m-auto ms-2 me-0 text-end'>
                  <img
                    alt='zone'
                    src={
                      'https://img.icons8.com/color/512/' +
                      (slot?.slot?.temperatureZone?.keyTemp === 'FRESH'
                        ? 'organic-food'
                        : slot?.slot?.temperatureZone?.keyTemp === 'FREEZE'
                        ? 'winter'
                        : 'dry') +
                      '.png'
                    }
                    style={{ width: '40px' }}
                  />
                </Col>
                <Col xs={6} className='m-auto mx-1 text-light text-start font-85 '>
                  <span className=' font-85'>
                    {slot?.slot?.temperatureZone.locker.location}{' '}
                  </span>{' '}
                  -{' '}
                  <span className=' font-85'>{slot?.slot?.temperatureZone.locker.city} </span>
                </Col>
                <Col xs={3} className='me- text-start ps-0 pe-0'>
                  <Row>
                    <Col xs={12} className='mb-1 py-0 text-light px-0'>
                      <i className='ri-file-list-line text-info me-1 align-bottom'></i>
                      <span className=' font-75'>
                        {' '}
                        A livrer :{' '}
                        {
                          orderData['hydra:member']?.filter(
                            (order: any) =>
                              order.status === 'created' &&
                              order.bookingSlot.slot?.temperatureZone.locker.location ===
                                slot?.slot?.temperatureZone.locker.location &&
                              order.bookingSlot.slot?.temperatureZone.keyTemp ===
                                slot?.slot?.temperatureZone?.keyTemp
                          )?.length
                        }
                      </span>
                    </Col>
                    <Col className='py-0 text-light px-0'>
                      <i className='ri-inbox-unarchive-line text-info  me-1 align-bottom'></i>

                      <span className=' font-75'>
                        {' '}
                        A récupérer :{' '}
                        {
                          orderData['hydra:member']?.filter(
                            (order: any) =>
                              order.status === 'overtime' &&
                              order.bookingSlot.slot?.temperatureZone.locker.location ===
                                slot?.slot?.temperatureZone.locker.location &&
                              order.bookingSlot.slot?.temperatureZone.keyTemp ===
                                slot?.slot?.temperatureZone?.keyTemp
                          )?.length
                        }
                      </span>
                      {/* <Alert variant='info' className='py-0 px-1 me-3 pe- border-2 border-info text-center'>
                      <span className=' font-75'>

                        A récupérer : {''}
                        {
                          orderData['hydra:member']?.filter(
                            (order: any) =>
                            order.status === 'overtime' &&
                            order.bookingSlot.slot?.temperatureZone.locker.location ===
                            slot?.slot?.temperatureZone.locker.location && 
                            order.bookingSlot.slot?.temperatureZone.keyTemp === slot?.slot?.temperatureZone?.keyTemp
                            
                            )?.length
                          }
                          </span>
                      </Alert> */}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Link>
          </Card>
        ))
      )}
    </Container>
  )
}

export default DashBoard