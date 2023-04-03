
import React from 'react'
import { Badge, Button, Col, Container, Modal, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Loading from '../../components/ui/Loading'
import BookingSlotservice from '../../service/BookingSlot/BookingSlotservice'
import newOrderDataStore from '../../store/newOrderDataStore'
import userDataStore from '../../store/userDataStore'
import Swal from 'sweetalert2'
import bookingStore from '../../store/bookingStore'
import { _strRandom } from '../../utils/functions'
import OrdersService from '../../service/Orders/OrdersService'

const NewOrder = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const dataStore = userDataStore((state: any) => state)
  const newOrderRegister = newOrderDataStore((state: any) => state.newOrderRegister)
  const newOrderDelete = newOrderDataStore((state: any) => state.newOrderDelete)
  const orderStore = newOrderDataStore((state: any) => state)
  const bookingSet = bookingStore((state: any) => state.bookingSet)
  const bookingstore = bookingStore((state: any) => state)
  const [size, setSize] = React.useState<any>([])
  const [bookingSlot, setBookingSlot] = React.useState<any>("")
  const [filteredBooking, setFilteredBooking] = React.useState<any>("")
  const [qty, setQty] = React.useState<any>()

  const [allSlot, setAllSlot] = React.useState<any>([])
  const [newOrderInprogress, setNewOrderInprogress] = React.useState<boolean>(false)





  React.useEffect(() => {
    getBookingAllSlot(dataStore.token)
  }, [dataStore.token])


  React.useEffect(() => {
    
  if(bookingSlot && bookingSlot !==""){
    setFilteredBooking(bookingstore.bookingData["hydra:member"]?.filter((slot: any) => slot['@id'] === bookingSlot))
    // setFilteredBooking(allSlot['hydra:member']?.filter((slot: any) => slot['@id'] === bookingSlot))

  }

  }, [bookingSlot])


  const getBookingAllSlot = (token: any) => {
    BookingSlotservice.allSlot(token).then((response: any) => {
      setAllSlot(response.data)
      setIsLoading(false)
      bookingSet(response.data)
    })
  }
 
  const createNewOrder = () => {
    function entierAleatoire(min: any, max: any) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    const randomCode = _strRandom("popopop").toLocaleUpperCase() + entierAleatoire(1, 9)
   
    const test = {

        "service" : "B2C",
        "destination" : {
        
            "apm" : orderStore?.lockerId,
        
            "location" : orderStore.location
        
          },
        
          "receiveCode" : entierAleatoire(100000000, 999999999),
        
          "slotSize" : orderStore.slotSize,
        
          "hold" : null,
          "status" : "created",
          "totalSlot": parseInt(qty),
        
          "multiOrder" : {
        
            "code" : orderStore?.lockerId +-+ entierAleatoire(100000000, 999999999),   //"Gen Auto : (ex: Locker.id-25963)",
        
            "itemCount" : parseInt(qty),//1"Parmètre attendu venant du formulaire (ex: 2) [number field]"
        
          },
        
          "extras" : {
        
            "companyId" : dataStore.cleveronCompany_id,
        
            "receiveCodeAlt" : `${entierAleatoire(100000000, 999999999)}`,//"Gen Auto : (ex: 1548726) [string & uniq field]"
        
          },
        
          "blocking" : null,
        
          "dropOff" : {
        
            "type" : "SEND",
        
            "code" : randomCode //"GenKey('code') (ex:MWBZOMA1)"
        
          },
        
          "changesTimestamp" : new Date(Date.now()).toISOString(),//"Date now() (ex: 2019-09-01T13:05:27.363+03:00)",
        
          "barcode" : dataStore.cleveronCompany_id +'-'+ randomCode  ,//"Company.cleveronCompanyId-GenKey('code') (ex:VINI-0A8-MWBZOMA1)",
        
          "measurement" : null,
        
          "claims" : null,
        
          "temperatureZonePredefined" : orderStore?.tempZone,
        
          "holdExpireAt" : null,
        
          "ageRestriction" : null,
        
          "allocationRequired" : true,
        
          "scanOnOperout" : null,
        
          "phone" : null,
        
          "templates" : null,
        
          "slotGroup" : null,
        
          "email" : null,
        
          "orderGroup" : null,
          "shippedBy": {
            "@context": "string",
            "@id": dataStore.id,
            "@type": "string",
            "username": dataStore.firstname,
            "roles": [
              "delilverer"
            ]
          },
        
        }
        console.log(test)
        newOrderDelete()


        OrdersService.create(dataStore.token, test)

  }
  

const sweetModal = async(e: any) => {
  e.preventDefault()
 
  const { value: accept } = await Swal.fire({
    icon: 'question',
    title: 'Voulez-vous valider la création ?',
    inputValue: 1,
    showCancelButton: true,
    confirmButtonText: 'Continue <i class="fa fa-arrow-right"></i>',
    confirmButtonColor: "#54AB57"
  })
  
  if (accept) {
    Swal.fire({
      position: 'top-end',
      toast: true,
      icon: 'success',
      title: 'Commande validée',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    })
    createNewOrder()
  }
  else{
    Swal.fire({
      position: 'top-end',
      toast: true,
      icon: 'error',
      title: 'Commande non validée',
      showConfirmButton: false,
      timer: 3000,
      // timerProgressBar: true,
    })
  }




}

  return (
    <div>
      <Container className='my-2'>
        <Container className='px-3 py-0 bg-secondary rounded-pill shadow my-auto '>
          <Row>
            {orderStore.lockerId === null ? (
              <>
                <Col xs={2} md={5} lg={5}>
                  <Link to='/in-progress' className='text-decoration-none'>
                    <i className='ri-arrow-left-line text-info ms-2 fs-3 bg-secondary rounded-pill'></i>{' '}
                  </Link>
                </Col>
                <Col className='m-auto text-light text-start pe-4'>
                
                    <i className='ri-inbox-fill align-bottom'></i>{' '}
                    <span className='fw-bold'>sélectionnez un locker</span>
                  
                </Col>
              </>
            ) : (
              <>
                <Col xs={2} md={5} lg={5}
                onClick={() =>  newOrderRegister(
                  null,
                  orderStore.location,
                  orderStore.companyId,
                  orderStore.companyName,
                  orderStore.lockerType,
                  orderStore.delivererId,
                  null,
                  null,
                  0
                )}>
                  
                    <i className='ri-arrow-left-line text-info ms-2 fs-3 bg-secondary rounded-pill'></i>{' '}
                  
                </Col>
                <Col className='m-auto text-light text-start pe-4'>
                 
                 
                    <i className='ri-shopping-basket-2-line align-bottom'></i>{' '}
                    <span className='fw-bold'>Nombre de panier nécessaire</span>
                 
                </Col>
              </>
            )}
          </Row>
        </Container>
      </Container>
      {isLoading ? (
        <Container className='text-center mt-5'>
          <Loading variant='warning' />
        </Container>
      ) : (
        <Container>
          {orderStore.lockerId === null &&
            allSlot['hydra:member']?.map(
              (locker: any) =>
                locker?.capacity > 0  && (
                  <Container
                    key={locker?.id}
                    className='my-3 px-2 py-2 bg-white rounded-pill shadow'
                    onClick={() => {
                      setBookingSlot(locker['@id'])
                      setNewOrderInprogress(true)
                      newOrderRegister(
                        locker?.slot.temperatureZone.locker.cleveronApmId,
                        locker?.slot.temperatureZone.locker?.location,
                        dataStore.company_id,
                        dataStore.company_name,
                        locker?.slot.temperatureZone.locker.type,
                        dataStore.id,
                        locker?.slot.temperatureZone?.keyTemp,
                        locker?.slot?.size,
                        0
                      )
                    }}
                  >
                    <Row className='py-2'>
                      <Col xs={10} className='m-auto text-secondary pe-0'>
                        <img
                          alt='Refroidissement icon'
                          src={
                            'https://img.icons8.com/color/512/' +
                            (locker?.slot?.temperatureZone?.keyTemp === 'FRESH'
                              ? 'organic-food'
                              : locker?.slot?.temperatureZone.keyTemp === 'FREEZE'
                              ? 'winter'
                              : 'dry') +
                            '.png'
                          }
                          style={{ width: '20px' }}
                          className=''
                        />{' '} {locker?.slot.size} - {' '}
                        <span className='item-locker-list fw-bold'>
                          {locker?.slot?.temperatureZone?.locker?.city?.toUpperCase()} -{' '}
                        

                        <Badge bg="info">
                          {locker?.company.name}
                        </Badge>
                        
                        
                        </span>
                      </Col>
                      <Col xs={2} className=''>
                        <span className='rounded-pill bg-warning item-locker-list badge'>
                          {locker?.capacity}
                        </span>
                      </Col>
                    </Row>
                  </Container>
                )
            )}
          {orderStore?.slotSize !== null && (
            <Container>
              <div className='mb-3 mt-4 text-secondary '></div>
              <form
                onSubmit={(e) => {
                  setQty(null)
                  sweetModal(e)
                  newOrderRegister(
                    orderStore.lockerId,
                    orderStore.location,
                    orderStore.companyId,
                    orderStore.companyName,
                    orderStore.lockerType,
                    orderStore.delivererId,
                    orderStore.tempZone,
                    orderStore.slotSize,
                    parseInt(qty)
                  )
                }}
              >
                <input
                  className='form-control mb-3'
                  type='number'
                  placeholder='Saisissez le nombre de panier'
                  value={qty}
                  onChange={(e) => setQty(e.currentTarget.value)}
                  required
                />
                <div className='w-100 text-end'>
                  <Button type='submit' variant='outline-warning' className='rounded-pill'>
                    Valider
                  </Button>
                </div>
              </form>
            </Container>
          )}
        </Container>
      )}
    </div>
  )
}

export default NewOrder
