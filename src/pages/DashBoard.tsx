import React from 'react'
import { Badge, Card, Col, Container, Row } from 'react-bootstrap'
import userDataStore from '../store/userDataStore'
import { useOutletContext, Link } from 'react-router-dom'
import DashBoardLoader from '../components/ui/loading/DashBoardLoader'
import AlertIsError from '../components/ui/warning/AlertIsError'

const DashBoard = () => {
  //////////////////////////
  // booleans States
  /////////////////////////
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isError, setIsError] = React.useState<boolean>(false)
  const [isTest, setIsTest] = React.useState<boolean>(false)

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
      {/* {(!isLogged || !dataStore.userToken || !dataStore.company_name) && (
        <Navigate to='/connexion' />
      )} */}

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

      {
      isError ? (
        <Container className='text-center mt-5'>
          <AlertIsError
            title="Une erreur s'est produite"
            msg='Vérifiez votre connexion internet ou contactez votre administrateur.'
            colorIcon='danger'
          />
        </Container>
      ) : 
      isLoading ? (
        <DashBoardLoader />
      ) : (
        allSlot?.['hydra:member']?.map((slot: any) => (
          <Card
            key={Math.random()}
            className='py-0 mb-3 border-0 rounded bg-secondary animate__animated'
            onClick={() => {
              setSelectedStore(slot?.slot.temperatureZone.locker.location)
              setSelectedOrderCity(slot?.slot.temperatureZone.locker.city)
            }}
          >
            <Link to='/in-progress' className=' text-decoration-none'>
              {' '}
              <Row className=''>
                <Col xs={7} className='m-auto ff-agency text-light ps-4 text-start'>
                  <i className='ri-store-2-line  '></i> -{' '}
                  <span>{slot?.slot.temperatureZone.locker.location} </span> -{' '}
                  <span>{slot?.slot.temperatureZone.locker.city} </span>
                </Col>
                <Col className='me-2 text-end'>
                  <Row>
                    <Col xs={12} className='mb-1 py-0'>
                      <Badge bg='info' className='py-2 w-100'>
                        En cours :{' '}
                        {
                          orderData['hydra:member']?.filter(
                            (order: any) =>
                              order.status === 'created' &&
                              order.bookingSlot.slot.temperatureZone.locker.location ===
                                slot?.slot.temperatureZone.locker.location
                          )?.length
                        }
                      </Badge>
                    </Col>
                    <Col className='py-0'>
                      <Badge bg='warning' className='py-2 w-100'>
                        A récupérer : {''}
                        {
                          orderData['hydra:member']?.filter(
                            (order: any) =>
                              order.status === 'operin' &&
                              order.bookingSlot.slot.temperatureZone.locker.location ===
                                slot?.slot.temperatureZone.locker.location
                          )?.length
                        }
                      </Badge>
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
