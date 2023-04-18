import React from 'react'
import {
  Alert,
  Badge,
  Button,
  Col,
  Container,
  FormCheck,
  FormGroup,
  Placeholder,
  Row,
} from 'react-bootstrap'
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
import { getError } from '../../utils/errors/GetError'

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
  const [qty, setQty] = React.useState<any>()
  const [availableSlot, setAvailableSlot] = React.useState<any>()

  const [msgError, setMsgError] = React.useState<any>()
  const [codeError, setCodeError] = React.useState<any>()
  const [ageRestriction, setAgeRestriction] = React.useState<boolean>(false)

  const [allSlot, setAllSlot] = React.useState<any>([])

  const isSlotAvailable = availableSlot >= parseInt(qty);

  React.useEffect(() => {
    getBookingAllSlot(dataStore.token)
  }, [dataStore.token])

  const getBookingAllSlot = (token: any) => {
    setIsLoading(true)
    BookingSlotservice.allSlot(token)
      .then((response: any) => {
        setAllSlot(response.data)
        setIsLoading(false)
        bookingSet(response.data)
      })
      .catch((error) => {
        setIsError(true)
        setMsgError(getError(error))
        setCodeError(error.response.data.code)
      })
  }

  const getallOrders = (token: any) => {
    setIsLoading(true)
    OrdersService.allOrders(token)
      .then((response: any) => {
        setOrderData(response.data)
        setIsLoading(false)
      })
      .catch((error) => {
        setIsError(true)
        setMsgError(getError(error))
        setCodeError(error.response.data.code)
      })
  }

  const popUpError = (code: any, text: any) => {
    Swal.fire({
      position: 'top-end',
      background: 'rgb(238, 195, 195)',
      toast: true,
      icon: 'error',
      title: `Erreur : ${code}`,
      text: text,
      showConfirmButton: false,
      timer: 4000,
    })
  }

  const createNewOrder = () => {
    function entierAleatoire(min: any, max: any) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }
    const multiOrderCode = _strRandom('popopopp').toLocaleUpperCase()
    const receiveCodeAlt = entierAleatoire(10000000, 99999999)
    const randomCode = _strRandom('popopop').toLocaleUpperCase() + entierAleatoire(1, 9)
    const randomCodeMultiOrder = _strRandom('popopop').toLocaleUpperCase()
    const receiveCode = entierAleatoire(10000000, 99999999)

    let dataOrder: any =
      parseInt(qty) <= 1
        ? {
            service: 'B2C',
            ageRestriction: orderStore.ageRestriction,
            barcode: orderStore.companyName + '-' + randomCode,
            destination: {
              apm: orderStore?.lockerId,
            },

            receiveCode: `${receiveCode}`,
            keyTemp: orderStore.tempZone,
            // temperatureZonePredefined: orderStore.tempZone,

            changesTimestamp: new Date(Date.now()).toISOString(),
            bookingSlot: orderStore.bookingSlotId,

            totalSlot: parseInt(qty),
          }
        : Array.from({ length: parseInt(qty) }).map((_, indx) => ({
            service: 'B2C',
            ageRestriction: orderStore.ageRestriction,
            barcode: orderStore.companyName + '-' + randomCodeMultiOrder + (indx + 1),
            destination: {
              apm: orderStore?.lockerId,
            },
            receiveCode: `${receiveCode}`,

            multiOrder: {
              code: multiOrderCode,
              itemCount: parseInt(qty),
            },
            extra: {
              receiveCodeAlt: receiveCodeAlt,
              companyId: orderStore.companyId,
            },
            dropOff: {
              code: randomCodeMultiOrder + (indx + 1),
              type: 'SEND',
            },
            changesTimestamp: new Date(Date.now()).toISOString(),
            bookingSlot: orderStore.bookingSlotId,
            temperatureZonePredefined: orderStore.keyTemp,

            totalSlot: parseInt(qty),
          }))

if(parseInt(qty) === 1){

  
  let config = {
      method: 'post',
      url: 'http://192.168.1.186:8000/api/orders',
      headers: {
        Authorization: 'Bearer ' + dataStore.token,
        'Content-Type': 'application/json',
      },
      data: dataOrder,
    }

    axios
      .request(config)
      .then((response) => {
        newOrderDelete()
        setQty(null)
        getallOrders(dataStore.token)
        getBookingAllSlot(dataStore.token)

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
        console.log(getError(error))
        console.log(error.message)
        setMsgError(getError(error))
        popUpError(error.response.status, error.response.statusText)
      })
    }
    else{
      let config: any = {
        method: 'post',
        url: 'http://192.168.1.186:8000/api/orders',
        headers: {
          Authorization: 'Bearer ' + dataStore.token,
          'Content-Type': 'application/json',
        },
      }
      
      let promises = []
      
      for (let i = 0; i < dataOrder?.length; i++) {
        config.data = dataOrder[i]
        promises.push(axios.request(config))
      }
      
      Promise.all(promises)
        .then((responses) => {
          newOrderDelete()
          setQty(null)
          getallOrders(dataStore.token)

          Swal.fire({
            position: 'top-end',
            toast: true,
            icon: 'success',
            title: 'Commande(s) validée(s)',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          })
        })
        .catch((error) => {
          console.log(getError(error))
          console.log(error.message)
          console.log(error)
          setMsgError(getError(error))
          popUpError(error.response.status, error.response.statusText)
        })
        console.log(promises)
    }
      console.log(dataOrder)
  }

  // console.log(msgError)

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
      title: 'Indisponible',
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
                  onClick={() => {
                    setQty(null)
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
                      null,
                      0,
                      0
                    )
                  }}
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
        <Container className='text-center mt-3'>
          <AlertIsError title={`Erreur : ${codeError}`} msg={msgError} />
        </Container>
      ) : isLoading ? (
        <Container className='text-center mt-3'>
          <Placeholder as='p' animation='glow'>
            <Placeholder xs={12} className='py-4 rounded-pill' />
          </Placeholder>
          <Placeholder as='p' animation='glow'>
            <Placeholder xs={12} className='py-4 rounded-pill' />
          </Placeholder>
          <Placeholder as='p' animation='glow'>
            <Placeholder xs={12} className='py-4 rounded-pill' />
          </Placeholder>
          <Placeholder as='p' animation='glow'>
            <Placeholder xs={12} className='py-4 rounded-pill' />
          </Placeholder>
          <Placeholder as='p' animation='glow'>
            <Placeholder xs={12} className='py-4 rounded-pill' />
          </Placeholder>
          <Placeholder as='p' animation='glow'>
            <Placeholder xs={12} className='py-4 rounded-pill' />
          </Placeholder>
          <Placeholder as='p' animation='glow'>
            <Placeholder xs={12} className='py-4 rounded-pill' />
          </Placeholder>
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
                  setAvailableSlot(locker.available)
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
                        locker?.slot.temperatureZone?.myKey,
                        locker?.slot?.size,
                        0,
                        0
                      )
                    : noDispoModal()
                }}
              >
                <Row className='py-2'>
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
                      {locker?.slot?.temperatureZone?.locker?.location
                        ?.toUpperCase()
                        .slice(0, 30)}{' '}
                      -{' '}
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
                  <Col xs={1} className='me-4'>
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
                    orderStore.keyTemp,
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
                {availableSlot < parseInt(qty) && (
                  <>
                    {/* <AlertIsError title={"Attention"} msg={"Vous n'avez pas assez de casiers disponibles dans la zone choisie"} /> */}
                    <Alert variant='danger' className='rounded-0'>
                      <Alert.Heading className='text-center'>
                        <i className='ri-error-warning-fill text-danger align-middle fs-3'></i>
                        <span className='align-middle'> Attention</span>
                      </Alert.Heading>
                      <div className='text-center font-75 '>
                        Vous n'avez pas assez de casiers disponibles dans la zone choisie.
                        Réduisez le nombre de panier
                      </div>
                    </Alert>
                  </>
                )}
                <FormGroup className='mb-3 text-muted' controlId='formBasicCheckbox'>
                  <FormCheck
                    type='checkbox'
                    label="Restriction d'âge"
                    checked={ageRestriction}
                    onChange={() => setAgeRestriction(!ageRestriction)}
                  />
                </FormGroup>
                <div className='w-100 text-end'>
                  <Button
                    type='submit'
                    variant='info'
                    className={`rounded-pill text-light ${!isSlotAvailable ? 'disabled' : ''}`}
                  >
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
