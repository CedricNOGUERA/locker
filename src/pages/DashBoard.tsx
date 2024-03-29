import React from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import userDataStore from '../store/userDataStore'
import { useOutletContext, Link, Navigate } from 'react-router-dom'
import DashBoardLoader from '../components/ui/loading/DashBoardLoader'
import AlertIsError from '../components/ui/warning/AlertIsError'
import images from '../styles/no-order.webp'
import BadgedIcon from '../components/ui/BadgedIcon'
import NoData from '../components/ui/warning/NoData'

const DashBoard = () => {
  //////////////////////////
  // booleans States
  /////////////////////////
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isError, setIsError] = React.useState<boolean>(false)
  const [chosenLocker, setChosenLocker] = React.useState<any>([])
  const [uniqueTab, setUniqueTab] = React.useState<any>([])
  const [cityTab, setCityTab] = React.useState<any>([])
  const [lockers, setLockers] = React.useState<any>('')

  //////////////////////////
  // Store & context state
  /////////////////////////
  const isLogged = userDataStore((state: any) => state.isLogged)
  const dataStore = userDataStore((state: any) => state)
  const [
    orderData,
    setSelectedStore,
    setSelectedOrderCity,
    allSlot,
    setSelectedItem,
    selectedStore,
    setOrderData,
    selectedOrderCity,
    setAllSlot,
    totalPages,
    setHistoryOrder,
    historyOrder,
    orderReady,
    setOrderReady,
    orderPickedUp,
    setOrderPickedUp,
    orderExpired,
  
    
  ] = useOutletContext<any>()

  //////////////////////////
  // UseEffect
  /////////////////////////
  React.useEffect(() => {
    setIsLoading(true)
    setSelectedItem('')
  }, [dataStore.token])

  React.useEffect(() => {
    const bookingLocker: any = orderData?.['hydra:member']?.map((locker: any) => locker)
    setChosenLocker(bookingLocker)
    
    const unique: any = [
      ...new Set(
        bookingLocker?.map(
          (locker: any) => locker?.bookingSlot?.slot?.temperatureZone?.locker.location
        )
      ),
    ]
    setUniqueTab(unique)

    const uniqueCity: any = [
      ...new Set(
        bookingLocker?.map(
          (locker: any) => locker?.bookingSlot?.slot?.temperatureZone?.locker.city
        )
      ),
    ]
    setCityTab(uniqueCity)

    if (allSlot && allSlot['hydra:member']?.length > 0) {
      setIsLoading(false)
    } else {
      if (allSlot && allSlot['hydra:member']?.length < 0) {
        setIsError(true)
        setIsLoading(false)
      }
    }
  }, [allSlot])

console.log(allSlot)



  return (
    <Container className='cde App text-center mt-2'>
      {(!isLogged || !dataStore.token || !dataStore.company_name) && (
        <Navigate to='/connexion' />
      )}
      <div className='ff-agency text-warning bg-secondary rounded-pill  mt-2 mb-3'>
        <Row className='p'>
          <Col className='text-center ps-0'>Visualisation générale</Col>
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
      ) : allSlot?.['hydra:member']?.length > 0 ? (
        allSlot?.['hydra:member']?.map((slot: any, indx: any) => (
          <Card 
            key={Math.random()}
            className='py-0 mb-3 border-0 rounded bg-secondary animate__animated'
            onClick={() => {
              setSelectedStore(slot?.slot?.temperatureZone?.locker['@id'])
              setSelectedOrderCity(slot?.slot?.temperatureZone?.locker?.city)
            }}
          >
            <Link to='/preparations' className=' text-decoration-none'>
              {' '}
              <Row className='pe-0 ps-1 w-100'>
                <Col xs={2} className='m-auto text-start'>
                 <BadgedIcon slot={slot} borderColor="secondary" imgSize="40px" />
                </Col>
                <Col xs={9} className='m-auto text-light text-start'>
                  <span className='dash-location font-7'>
                    {slot?.slot?.temperatureZone?.locker?.location}{' '}
                  </span>{' '}
                </Col>
              </Row>

                <Col xs={12} className=' text-start'>
                  <Row className='pe-3 ps-3' >
                    <Col xs={4} className='mb-1 py-0 text-light px-0'>
                      <i className='ri-checkbox-line text-warning align-bottom fs-2'  ></i>
                      <span className='dash-city font-65'>
                        {' '}
                        Préparation :{' '}
                       <b className='font-85'>

                        {
                          orderReady['hydra:member']?.filter(
                            (order: any) =>
                            order?.status === 'ready_for_delivery' &&
                            order?.bookingSlot?.slot?.temperatureZone.locker.location ===
                            slot?.slot?.temperatureZone?.locker.location &&
                            order?.bookingSlot?.slot?.temperatureZone?.name ===
                            slot?.slot?.temperatureZone?.name &&
                            order?.bookingSlot?.slot?.size === slot?.slot?.size
                            )?.length
                          }
                          </b>
                      </span>
                    </Col>
                    <Col xs={4} className='mb-1 py-0 text-light px-0'>
                      <i className='ri-truck-line text-warning align-bottom fs-2'></i>
                      <span className='dash-city font-65'>
                        {' '}
                        A livrer :{' '}
                       <b className='font-85'>


                        {
                          orderPickedUp['hydra:member']?.filter(
                            (order: any) =>
                            order?.status === 'picked_up' &&
                            order?.bookingSlot?.slot?.temperatureZone.locker.location ===
                            slot?.slot?.temperatureZone.locker?.location &&
                              order?.bookingSlot?.slot?.temperatureZone?.name ===
                                slot?.slot?.temperatureZone?.name &&
                                order?.bookingSlot?.slot?.size === slot?.slot?.size
                          )?.length
                        }
                                </b>
                      </span>
                    </Col>
                    <Col className='py-0 text-light px-0'>
                      <i className='ri-inbox-unarchive-line text-warning align-bottom fs-2'></i>
                      <span className='dash-city font-65'>
                        {' '}
                        A récupérer :{' '}
                       <b className='font-85'>

                        
                        {
                          orderExpired['hydra:member']?.filter(
                            (order: any) =>
                              order?.status === 'overtime' &&
                              order?.bookingSlot?.slot?.temperatureZone?.locker?.location ===
                                slot?.slot?.temperatureZone?.locker?.location &&
                              order?.bookingSlot?.slot?.temperatureZone?.name ===
                                slot?.slot?.temperatureZone?.name &&
                              order?.bookingSlot?.slot?.size === slot?.slot?.size
                          )?.length
                        }
                        </b>
                      </span>
                    </Col>
                  </Row>
                </Col>
            </Link>
          </Card>
        ))
      ) : (
        <NoData images={images} isFilteredOrders={false} msg="Aucune Réservation" msg2="" />
      )}
    </Container>
  )
}

export default DashBoard
