import React from 'react'
import {
  Alert,
  Badge,
  Button,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Form,
  FormCheck,
  FormGroup,
  InputGroup,
  Row,
  Spinner,
} from 'react-bootstrap'
import { Link, Navigate, useOutletContext } from 'react-router-dom'
import BookingSlotservice from '../../service/BookingSlot/BookingSlotservice'
import newOrderDataStore from '../../store/newOrderDataStore'
import userDataStore from '../../store/userDataStore'
import Swal from 'sweetalert2'
import bookingStore from '../../store/bookingStore'
import logsStore from '../../store/logsStore'
import { _strRandom } from '../../utils/functions'
import axios from 'axios'
import OrdersService from '../../service/Orders/OrdersService'
import AlertIsError from '../../components/ui/warning/AlertIsError'
import { getError } from '../../utils/errors/GetError'
import PlaceHolder from '../../components/ui/loading/PlaceHolder'
import images from '../../styles/no-order-min.png'
// import { AutoComplete } from 'primereact/autocomplete';
import InfoAlert from '../../components/ui/warning/InfoAlert'
import { SubmitHandler, useForm } from 'react-hook-form'

type Inputs = {
  // qty: number
  clientName: any
  clientEmail: any
}


const NewOrder = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isOrderCreate, setIsOrderCreate] = React.useState<boolean>(false)
  const [isError, setIsError] = React.useState<boolean>(false)
  const [isMsgErrorQty, setIsMsgErrorQty] = React.useState<boolean>(false)
  const [isMsgErrorName, setIsMsgErrorName] = React.useState<boolean>(false)
  const [isMsgErrorEmail, setIsMsgErrorEmail] = React.useState<boolean>(false)


  const isLogged = userDataStore((state: any) => state.isLogged)
  const dataStore = userDataStore((state: any) => state)
  const newOrderRegister = newOrderDataStore((state: any) => state.newOrderRegister)
  const newOrderDelete = newOrderDataStore((state: any) => state.newOrderDelete)
  const orderStore = newOrderDataStore((state: any) => state)
  const bookingSet = bookingStore((state: any) => state.bookingSet)

  const logs = logsStore((state: any) => state)
  const logCatcher = logsStore((state: any) => state.logCatcher)

  const now: any = Date.now()

  console.log(logs.logApp)

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
  const [clientEmail, setClientEmail] = React.useState<any>()
  const [clientName, setClientName] = React.useState<any>()
  const [filteredEmail, setFilteredEmail] = React.useState<any>()
  const [filteredName, setFilteredName] = React.useState<any>([])
  const [isShowName, setIsShowName] = React.useState<boolean>(false)

  const [ageRestriction, setAgeRestriction] = React.useState<boolean>(false)

  const [availableSlot, setAvailableSlot] = React.useState<any>()
  const [msgError, setMsgError] = React.useState<any>()
  const [codeError, setCodeError] = React.useState<any>()

  const [allSlot, setAllSlot] = React.useState<any>([])

  const isSlotAvailable = availableSlot >= parseInt(qty)


  const autoCompletTab = [
    { email: 'grout@mail.pf', name: "Grout" },
    { email: 'fred.fred@miel.pf', name: "grog" },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()


  React.useEffect(() => {
    getBookingAllSlot(dataStore.token)
  }, [dataStore.token])

  React.useEffect(() => {
    _searchWithRegex(clientName, autoCompletTab, setFilteredName)
    
  }, [clientName])
  
  React.useEffect(() => {
    _searchWithRegex2(clientEmail, autoCompletTab, setFilteredEmail)
    
  }, [clientEmail])
console.log(filteredName)
console.log(clientName)
console.log(qty)

  React.useEffect(() => {
    if(filteredName && filteredName?.length > 0 ){
      setIsShowName(true)
    }else{
      setIsShowName(false)
    }
  }, [clientName])



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
    newOrderDelete()
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

    setIsOrderCreate(true)
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
            temperatureZonePredefined: orderStore.keyTemp,

            changesTimestamp: new Date(Date.now()).toISOString(),
            bookingSlot: orderStore.bookingSlotId,
            clientEmail: clientEmail?.email ? clientEmail?.email : clientEmail,
            clientName: clientName?.name ? clientName?.name : clientName,

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
            clientEmail: clientEmail?.email ? clientEmail?.email : clientEmail,
            clientName: clientName?.name ? clientName?.name : clientName,

            totalSlot: parseInt(qty),
          }))

    if (parseInt(qty) === 1) {
      let config = {
        method: 'post',
        url: 'http://192.168.1.250:8000/api/orders',
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
          setIsOrderCreate(false)

          Swal.fire({
            position: 'top-end',
            toast: true,
            icon: 'success',
            title: 'Commande validée',
            text: orderStore.companyName + '-' + randomCode,
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
          })
        })
        .catch((error) => {
          console.log(getError(error))
          console.log(error.message)
          setMsgError(getError(error))
          if (logs.logApp) {
            logCatcher(logs.logApp + ' / date :' + now + '-' + error.response.statusText)
          } else {
            logCatcher('date :' + now + '-' + error.response.statusText)
          }

          popUpError(error.response.status, error.response.statusText)
        })
    } else {
      let config: any = {
        method: 'post',
        url: 'http://192.168.1.250:8000/api/orders',
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
          setIsOrderCreate(false)

          Swal.fire({
            position: 'top-end',
            toast: true,
            icon: 'success',
            title: 'Commande(s) validée(s)',
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
          })
        })
        .catch((error) => {
          console.log(getError(error))
          console.log(error.message)
          console.log(error)
          logCatcher(error.response.statusText)
          setMsgError(getError(error))
          popUpError(error.response.status, error.response.statusText)
          if (logs.logApp) {
            logCatcher(logs.logApp + ' / date :' + now + '-' + error.response.statusText)
          } else {
            logCatcher('date :' + now + '-' + error.response.statusText)
          }
        })
    }
    console.log(dataOrder)
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
        title: 'Commande non finalisée',
        showConfirmButton: false,
        timer: 3000,
        // timerProgressBar: true,
      })
      newOrderDelete()
      setQty(null)
      setAgeRestriction(false)
      if (logs.logApp) {
        logCatcher(logs.logApp + ' / date :' + now + '-' + 'Commande non finalisée')
      } else {
        logCatcher('date :' + now + '-' + 'Commande non finalisée')
      }
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
        title: 'finalisée',
        showConfirmButton: false,
        timer: 3000,
      })
      if (logs.logApp) {
        logCatcher(logs.logApp + " / date :" + now + " - Aucun casier n'est disponible")
      } else {
        logCatcher("date :" + now + "- Aucun casier n'est disponible")
      }
    }
  }


  const _searchWithRegex = (searchOrder: any, orderByStatus: any, setFilteredOrder: any ) => {
    function escapeRegExp(str: string) {
      return str?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
  
    const escapedSearchOrder = escapeRegExp(searchOrder);
  
    setFilteredOrder(orderByStatus?.filter((order: any) => {
      if (escapedSearchOrder?.length > 2) {
        return order?.name?.match(new RegExp(escapedSearchOrder, "i"));
      }
        return undefined;
      

    }))
  }

  const _searchWithRegex2 = (searchOrder: any, orderByStatus: any, setFilteredOrder: any ) => {
    function escapeRegExp(str: string) {
      return str?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
  
    const escapedSearchOrder = escapeRegExp(searchOrder);
  
    setFilteredOrder(orderByStatus?.filter((order: any) => {
      if (escapedSearchOrder?.length > 2) {
        return order?.email?.match(new RegExp(escapedSearchOrder, "i"));
      }
        return undefined;
      

    }))
  }

  const search = (event: any) => {
        let _filteredCountries;

        if (!event.query.trim().length) {
            _filteredCountries = [...autoCompletTab];
        }
        else {
            _filteredCountries = autoCompletTab.filter((country: any) => {
                return country.email.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }

        setFilteredEmail(_filteredCountries);
}
  const search2 = (event: any) => {
        let _filteredCountries;

        if (!event.query.trim().length) {
            _filteredCountries = [...autoCompletTab];
        }
        else {
            _filteredCountries = autoCompletTab.filter((country: any) => {
                return country.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }

        setFilteredName(_filteredCountries);
}

const validOrder = (e: any) => {
    e.preventDefault()

    if(!clientName){
      setIsMsgErrorName(true)
      console.log("object")
    }
    if(!clientEmail){
      setIsMsgErrorEmail(true)
    }
    if(!qty){
      setIsMsgErrorQty(true)
    }
    
    if(clientName && clientEmail && qty){

      setIsError(false)
      setIsMsgErrorQty(false)
      setIsMsgErrorName(false)
      setIsMsgErrorEmail(false)
      setQty(null)
      setClientName("")
      setClientEmail("")
      
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
                <Col className='m-auto text-light text-start pe-2'>
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
          <AlertIsError
            title={`Erreur : ${codeError === undefined ? '' : codeError}`}
            msg={msgError}
            colorIcon='danger'
          />
        </Container>
      ) : isLoading ? (
        <Container className='text-center mt-3'>
          <PlaceHolder paddingYFirst='4' />
        </Container>
      ) : (
        <Container className='pb-5'>
          {orderStore.lockerId === null &&
            allSlot['hydra:member']?.map((locker: any, indx: any) =>
              locker?.active === true ? (
                <Container
                  key={locker?.id}
                  className='my-3 px-2 py-2 bg-white rounded shadow w-100'
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
                  <Row className='py-2 justify-content-around text-secondary'>
                    <Col className='m-auto  pe-0'>
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
                        style={{ width: '40px' }}
                      />{' '}
                      {locker?.slot.size} -{' '}
                    </Col>
                    <Col xs={7} className='px-0 m-auto text-center'>
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
                    <Col xs={1} className='me-4 m-auto'>
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
              ) : (
                indx === 0 && (
                  <div className=' text-center mt-5 pt-5'>
                    <img className='' alt='no slot' src={images} style={{ height: '256px' }} />
                    <div className='user-name fs-3 fw-bold text-secondary'>
                      Aucune réservation
                    </div>
                  </div>
                )
              )
            )}
          {orderStore?.slotSize !== null && (
            <Container>
              <div className='mb-3 mt-4 text-secondary '></div>
              <form
                onSubmit={validOrder}
                // onSubmit={(e) => {
                //   newOrderModal(e)
                //   newOrderRegister(
                //     orderStore.lockerId,
                //     orderStore.location,
                //     orderStore.bookingSlot,
                //     orderStore.companyId,
                //     orderStore.companyName,
                //     orderStore.lockerType,
                //     orderStore.delivererId,
                //     orderStore.tempZone,
                //     orderStore.keyTemp,
                //     orderStore.slotSize,
                //     parseInt(qty),
                //     ageRestriction === true ? 18 : 0
                //   )
                // }}
              >
                <input
                  className='form-control mb-3 py-2'
                  type='number'
                  min={1}
                  placeholder='Nombre de panier*'
                  value={qty}
                  onChange={(e) => setQty(e.currentTarget.value)}
                  required
                  // {...register('qty', { required: true })}
                />
                {isMsgErrorQty && (
                  <Alert variant='danger' className='mt-2 py-0'>
                    <InfoAlert
                      icon='ri-error-warning-line'
                      iconColor='danger'
                      message={'Ce champ est obligatoire'}
                      fontSize='font-75'
                    />
                  </Alert>
                )}
                <InputGroup className='mb-3'>
                  <Form.Control
                    aria-label='Text input with dropdown button'
                    value={clientName}
                    onChange={(e: any) => {
                      setClientName(e.currentTarget.value)
                    }}
                    placeholder='Nom du client*'
                    required
                    
                  />
                  {filteredName && filteredName?.length > 0 &&
                  <DropdownButton
                  variant='secondary'
                  title=''
                  className=''
                  id='input-group-dropdown-2'
                  align='end'
                  show={true}
                  >
                    {filteredName?.map((user: any) => (
                      <Dropdown.Item onClick={() => {
                        setFilteredName([])
                        setClientName(user.name)}}>{user.name}</Dropdown.Item>
                      ))}
                  </DropdownButton>
                    }
                </InputGroup>
                {isMsgErrorName && (
                  <Alert variant='danger' className='mt-2 py-0'>
                    <InfoAlert
                      icon='ri-error-warning-line'
                      iconColor='danger'
                      message={'Ce champ est obligatoire'}
                      fontSize='font-75'
                    />
                  </Alert>
                )}
                  <InputGroup className='mb-3'>
                  <Form.Control
                    aria-label='Text input with dropdown button'
                    value={clientEmail}
                    onChange={(e: any) => {
                      setClientEmail(e.currentTarget.value)
                    }}
                    placeholder='Email du client*'
                    required
                    
                  />
                  {filteredEmail && filteredEmail?.length > 0 &&
                  <DropdownButton
                  variant=''
                  title=''
                  className=''
                  id='input-group-dropdown-2'
                  align='end'
                  show={true}
                  >
                    {filteredEmail?.map((user: any) => (
                      <Dropdown.Item onClick={() => {
                        setFilteredEmail([])
                        setClientEmail(user.email)}}>{user.email}</Dropdown.Item>
                      ))}
                  </DropdownButton>
                    }
                </InputGroup>
                {/* <AutoComplete
                  inputClassName='custom-dropdown'
                  className=' mb-3 text-base text-color surface-overlay border-0 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full'
                  field='name'
                  value={clientName}
                  suggestions={filteredName}
                  completeMethod={search2}
                  onChange={(e: any) => setClientName(e.value)}
                  placeholder='Nom du client*'
                />
                {(isMsgErrorName || (clientName && clientName?.length < 1)) && (
                  <Alert variant='danger' className='mt-2 py-0 '>
                    <InfoAlert
                      icon='ri-error-warning-line'
                      iconColor='danger'
                      message={'Ce champ est obligatoire'}
                      fontSize='font-75'
                    />
                  </Alert>
                )}
                <AutoComplete
                  inputClassName='custom-dropdown'
                  className=' mb-3 text-base text-color surface-overlay border-0 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full'
                  field='email'
                  value={clientEmail}
                  suggestions={filteredEmail}
                  completeMethod={search}
                  onChange={(e: any) => setClientEmail(e.value)}
                  placeholder='Email du client*'
                /> */}
                {(isMsgErrorEmail || (clientName && clientName?.length < 1)) && (
                  <Alert variant='danger' className='mt-2 py-0 '>
                    <InfoAlert
                      icon='ri-error-warning-line'
                      iconColor='danger'
                      message={'Ce champ est obligatoire'}
                      fontSize='font-75'
                    />
                  </Alert>
                )}
                {availableSlot < parseInt(qty) && (
                  <AlertIsError
                    title={'Attention'}
                    msg={
                      "Vous n'avez pas assez de casiers disponibles dans la zone choisie. Réduisez le nombre de panier"
                    }
                    colorIcon='danger'
                  />
                )}
                <FormGroup className='mb- text-muted w-auto' controlId='formBasicCheckbox'>
                  <FormCheck
                    type='checkbox'
                    label="Restriction d'âge"
                    checked={ageRestriction}
                    onChange={() => setAgeRestriction(!ageRestriction)}
                  />
                </FormGroup>
                <i
                  className='ri-error-warning-line align-bottom text-warning'
                  title='avez-vous 18 ans '
                ></i>{' '}
                <span className='font-75 text-muted'>
                  Avez-vous 18 ans? Pour tout achat d'alcool vous devez être majeur.
                </span>
                <div className='w-100 text-end'>
                  <Button
                    type='submit'
                    className={`button-auth rounded-pill text-light ${
                      !isSlotAvailable ? 'disabled' : ''
                    }`}
                  >
                    {isOrderCreate && <Spinner size='sm' className='me-1' />}
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
