import React from 'react'
import { Badge, Button, Col, Container, FormCheck, FormGroup, Row } from 'react-bootstrap'
import { Link, Navigate, useOutletContext } from 'react-router-dom'
import Loading from '../../components/ui/Loading'
import BookingSlotservice from '../../service/BookingSlot/BookingSlotservice'
import newOrderDataStore from '../../store/newOrderDataStore'
import userDataStore from '../../store/userDataStore'
import Swal from 'sweetalert2'
import bookingStore from '../../store/bookingStore'
import { _strRandom } from '../../utils/functions'
import axios from 'axios'
import OrdersService from '../../service/Orders/OrdersService'
import AlertIsError from '../../components/ui/warning/AlertIsError'

const NewOrder = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [isError, setIsError] = React.useState<boolean>(false)
  const isLogged = userDataStore((state: any) => state.isLogged)
  const dataStore = userDataStore((state: any) => state)
  const newOrderRegister = newOrderDataStore((state: any) => state.newOrderRegister)
  const newOrderDelete = newOrderDataStore((state: any) => state.newOrderDelete)
  const orderStore = newOrderDataStore((state: any) => state)
  const bookingSet = bookingStore((state: any) => state.bookingSet)
  const bookingstore = bookingStore((state: any) => state)

  const [
    selectedStore,
    setSelectedStore,
    orderData,
    setOrderData,
    selectedOrderCity,
    setSelectedOrderCity,
  ] = useOutletContext<any>()

  const [bookingSlot, setBookingSlot] = React.useState<any>('')
  // const [filteredBooking, setFilteredBooking] = React.useState<any>('')
  const [qty, setQty] = React.useState<any>()
  const [ageRestriction, setAgeRestriction] = React.useState<boolean>(false)

  const [allSlot, setAllSlot] = React.useState<any>([])

  React.useEffect(() => {
    getBookingAllSlot(dataStore.token)
  }, [dataStore.token])


  const getBookingAllSlot = (token: any) => {
    BookingSlotservice.allSlot(token).then((response: any) => {
      setAllSlot(response.data)
      setIsLoading(false)
      bookingSet(response.data)
    })
    .catch((error) =>{
      setIsError(true)
      console.log(isError)
    })
  }

  const getallOrders = (token: any) => {
    OrdersService.allOrders(token).then((response: any) => {
      setOrderData(response.data)
    })
  }

  const createNewOrder = () => {
    function entierAleatoire(min: any, max: any) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    const randomCode = _strRandom('popopop').toLocaleUpperCase() + entierAleatoire(1, 9)
    const receiveCode = entierAleatoire(100000000, 999999999)

    let myOrder = {
      service: 'B2C',
      ageRestriction: orderStore.ageRestriction ,
      barcode: dataStore.cleveronCompany_id + '-' + randomCode,
      destination: {
        apm: orderStore?.lockerId,
      },

      receiveCode: `${receiveCode}`,

      changesTimestamp: new Date(Date.now()).toISOString(),
      bookingSlot: orderStore.bookingSlotId,

      totalSlot: parseInt(qty),
    }

    let config = {
      method: 'post',
      url: 'http://192.168.1.186:8000/api/orders',
      headers: {
        Authorization: 'Bearer ' + dataStore.token,
        'Content-Type': 'application/json',
      },
      data: myOrder,
    }

    axios
      .request(config)
      .then((response) => {
        // newOrderDelete()
        setQty(null)
        getallOrders(dataStore.token)
        Swal.fire({
          position: 'top-end',
          toast: true,
          icon: 'success',
          title: 'Commande validée',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        })
      })
      .catch((error) => {
        console.log(error)

        Swal.fire({
          position: 'top-end',
          toast: true,
          icon: 'error',
          title: 'Commande non validée',
          text: 'Une erreur s\'est produite, Réessayer',
          showConfirmButton: false,
          timer: 4000,
        })
        //envoyer email à ITL et enregistrer log dans BDD

      })

  }

  const newOrderModal = async (e: any) => {
    e.preventDefault()

    const { value: accept } = await Swal.fire({
      icon: 'question',
      title: 'Voulez-vous valider la commande ?',
      inputValue: 1,
      showCancelButton: true,
      confirmButtonText: 'Continue',
      confirmButtonColor: '#54AB57',
      cancelButtonText: 'Annuler',
      cancelButtonColor: '#eb5959',
    })

    if (accept) {
     
      createNewOrder()
    } else {
      Swal.fire({
        position: 'top-end',
        toast: true,
        icon: 'error',
        title: 'Commande annulée',
        showConfirmButton: false,
        timer: 3000,
        // timerProgressBar: true,
      })
      newOrderDelete()
      setQty(null)
      setAgeRestriction(false)
      // envoyer un email a ITL + log
    }
  }

  const noDispoModal = async () => {
    const { value: accept } = await Swal.fire({
      icon: 'warning',
      title: 'Locker plein',
      text: "Aucun casier n'est disponible",
      inputValue: 1,
      showConfirmButton: false,
      showDenyButton: true,
      // confirmButtonColor: "#54AB57",
      denyButtonText:
        '<span className=" m-auto"><i class="ri-arrow-left-circle-fill m-auto  fs-5"></i> Retour</span>',
    })

    if (!accept) {
      Swal.fire({
        position: 'top-end',
        toast: true,
        icon: 'error',
        title: 'Commande non validée',
        showConfirmButton: false,
        timer: 3000,
      })
      
    }
  }


  return (
    <div>
      {(!isLogged || !dataStore.token) && <Navigate to='/connexion' />}

      <Container className='my-2'>
        <Container className='px-3 py-0 bg-secondary rounded-pill shadow my-auto '>
          <Row>
            {orderStore.lockerId === null ? (
              <>
                <Col xs={2} md={5} lg={5}>
                  <Link
                    to='/in-progress'
                    className='text-decoration-none'
                    onClick={() => newOrderDelete()}
                  >
                    <i className='ri-arrow-left-line text-info ms-2 fs-3 bg-secondary rounded-pill'></i>{' '}
                  </Link>
                </Col>
                <Col className='m-auto text-light text-start pe-4'>
                  <i className='ri-inbox-fill align-bottom me-2'></i>{' '}
                  <span className='fw-bold'>sélectionnez un locker</span>
                </Col>
              </>
            ) : (
              <>
                <Col
                  xs={2}
                  md={5}
                  lg={5}
                  onClick={() =>
                    newOrderRegister(
                      null,
                      orderStore.location,
                      null,
                      orderStore.companyId,
                      orderStore.companyName,
                      orderStore.lockerType,
                      orderStore.delivererId,
                      null,
                      null,
                      0,
                      0
                    )
                  }
                >
                  <i className='ri-arrow-left-line text-info ms-2 fs-3 bg-secondary rounded-pill'></i>{' '}
                </Col>
                <Col className='m-auto text-light text-start pe-4'>
                  <i className='ri-shopping-basket-2-line align-bottom me-2'></i>{' '}
                  <span className='fw-bold'>Nombre de panier nécessaire</span>
                </Col>
              </>
            )}
          </Row>
        </Container>
      </Container>
      {isError ? (
        <Container className='text-center mt-5'>
          <AlertIsError
            title="Une erreur s'est produite"
            msg='Vérifiez votre connexion internet ou contactez votre administrateur'
          />
        </Container>
      ) : isLoading ? (
        <Container className='text-center mt-5'>
          <Loading variant='warning' />
        </Container>
      ) : (
        <Container className='pb-5'>
          {orderStore.lockerId === null &&
            allSlot['hydra:member']?.map((locker: any) => (
              <Container
                key={locker?.id}
                className='my-3 px-2 py-2 bg-white rounded-pill shadow w-100'
                onClick={() => {
                  setBookingSlot(locker['@id'])
                  locker?.available > 0
                    ? newOrderRegister(
                        locker?.slot.temperatureZone.locker.cleveronApmId,
                        locker?.slot.temperatureZone.locker?.location,
                        locker?.['@id'],
                        dataStore.company_id,
                        dataStore.company_name,
                        locker?.slot.temperatureZone.locker.type,
                        dataStore.id,
                        locker?.slot.temperatureZone?.keyTemp,
                        locker?.slot?.size,
                        0,
                        0
                      )
                    : noDispoModal()
                }}
              >
                <Row className='py-2' disabled>
                  <Col xs={10} className='m-auto text-secondary pe-0'>
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
                      style={{ width: '20px' }}
                      className=''
                    />{' '}
                    {locker?.slot.size} -{' '}
                    <span className='item-locker-list fw-bold'>
                      {locker?.slot?.temperatureZone?.locker?.city?.toUpperCase()} -{' '}
                      <Badge
                        bg={
                          locker?.slot?.temperatureZone?.keyTemp === 'FRESH'
                            ? 'success'
                            : locker?.slot?.temperatureZone.keyTemp === 'FREEZE'
                            ? 'info'
                            : 'warning'
                        }
                      >
                        {locker?.company.name}
                      </Badge>
                    </span>
                  </Col>
                  <Col xs={2} className=''>
                    <span
                      className={
                        locker?.available > 0
                          ? 'rounded-pill bg-warning item-locker-list badge'
                          : 'rounded-pill bg-danger item-locker-list badge'
                      }
                    >
                      {locker?.available}
                    </span>
                  </Col>
                </Row>
              </Container>
            ))}
          {orderStore?.slotSize !== null && (
            <Container>
              <div className='mb-3 mt-4 text-secondary '></div>
              <form
                onSubmit={(e) => {
                  newOrderModal(e)
                  newOrderRegister(
                    orderStore.lockerId,
                    orderStore.location,
                    orderStore.bookingSlot,
                    orderStore.companyId,
                    orderStore.companyName,
                    orderStore.lockerType,
                    orderStore.delivererId,
                    orderStore.tempZone,
                    orderStore.slotSize,
                    parseInt(qty),
                    ageRestriction === true ? 18 : 0
                  )
                }}
              >
                <input
                  className='form-control mb-3'
                  type='number'
                  min={1}
                  placeholder='Nombre de panier'
                  value={qty}
                  onChange={(e) => setQty(e.currentTarget.value)}
                  required
                />
                <FormGroup className='mb-3 text-muted' controlId='formBasicCheckbox'>
                  <FormCheck type='checkbox' label="Restriction d'âge" checked={ageRestriction} onChange={() => setAgeRestriction(!ageRestriction)}  />
                </FormGroup>
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
