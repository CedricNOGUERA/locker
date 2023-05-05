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
import BackButton from '../../components/ui/BackButton'
import DashBoardLoader from '../../components/ui/loading/DashBoardLoader'
import ClientService from '../../service/Client/ClientService'

type Inputs = {
  qty: any
  clientName: any
  clientEmail: any
  chooseName: any
  chooseEmail: any
}

const NewOrder = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isOrderCreate, setIsOrderCreate] = React.useState<boolean>(false)
  const [isError, setIsError] = React.useState<boolean>(false)
  const [isMsgErrorQty, setIsMsgErrorQty] = React.useState<boolean>(false)
  const [isMsgErrorName, setIsMsgErrorName] = React.useState<boolean>(false)
  const [isMsgErrorEmail, setIsMsgErrorEmail] = React.useState<boolean>(false)
  const [isValid, setIsValid] = React.useState<boolean>(false)

  const isLogged = userDataStore((state: any) => state.isLogged)
  const dataStore = userDataStore((state: any) => state)
  const newOrderRegister = newOrderDataStore((state: any) => state.newOrderRegister)
  const newOrderDelete = newOrderDataStore((state: any) => state.newOrderDelete)
  const orderStore = newOrderDataStore((state: any) => state)
  const bookingSet = bookingStore((state: any) => state.bookingSet)

  const logs = logsStore((state: any) => state)
  const logCatcher = logsStore((state: any) => state.logCatcher)

  const now: any = Date.now()

  const [
    selectedStore,
    setSelectedStore,
    orderData,
    setOrderData,
    selectedOrderCity,
    setSelectedOrderCity,
  ] = useOutletContext<any>()

  const [bookingSlot, setBookingSlot] = React.useState<any>('')
  const [qty, setQty] = React.useState<any>(undefined)
  const [clientEmail, setClientEmail] = React.useState<any>('')
  const [clientName, setClientName] = React.useState<any>('')
  const [filteredEmail, setFilteredEmail] = React.useState<any>([])
  const [filteredName, setFilteredName] = React.useState<any>([])
  const [autoCompletTab, setAutoCompletTab] = React.useState<any>([])
  const [choosedName, setChoosedName] = React.useState<any>('')
  const [choosedEmail, setChoosedEmail] = React.useState<any>('')

  const [ageRestriction, setAgeRestriction] = React.useState<boolean>(false)

  const [availableSlot, setAvailableSlot] = React.useState<any>()
  const [msgError, setMsgError] = React.useState<any>()
  const [codeError, setCodeError] = React.useState<any>()

  const [allSlot, setAllSlot] = React.useState<any>([])

  const isSlotAvailable = availableSlot >= parseInt(qty)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  React.useEffect(() => {
    getBookingAllSlot(dataStore.token)
    getClients(dataStore.token)
  }, [dataStore.token])

  React.useEffect(() => {
    _searchWithRegex(clientName, autoCompletTab['hydra:member'], setFilteredName)
  }, [clientName])

  React.useEffect(() => {
    _searchWithRegex2(clientEmail, autoCompletTab['hydra:member'], setFilteredEmail)
  }, [clientEmail])

  const getClients = (token: any) => {
    ClientService.allClients(token)
      .then((response: any) => {
        setAutoCompletTab(response.data)
      })
      .catch((error) => {
        setIsError(true)
        setMsgError(getError(error))
        setCodeError(error.response.data.code)
      })
  }

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
            barcode: orderStore.companyName.toUpperCase() + '-' + randomCode,
            destination: {
              apm: orderStore?.lockerId,
            },

            receiveCode: `${receiveCode}`,
            keyTemp: orderStore.keyTemp,
            temperatureZonePredefined: orderStore.tempZone,

            changesTimestamp: new Date(Date.now()).toISOString(),
            bookingSlot: orderStore.bookingSlotId,
            clientEmail: choosedEmail
              ? choosedEmail
              : clientEmail?.email
              ? clientEmail?.email
              : clientEmail,
            clientName: choosedName
              ? choosedName
              : clientName?.name
              ? clientName?.name
              : clientName,

            totalSlot: parseInt(qty),
          }
        : Array.from({ length: parseInt(qty) }).map((_, indx) => ({
            service: 'B2C',
            ageRestriction: orderStore.ageRestriction,
            barcode:
              orderStore.companyName.toUpperCase() + '-' + randomCodeMultiOrder + (indx + 1),
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
            keyTemp: orderStore.keyTemp,
            temperatureZonePredefined: orderStore?.tempZone,
            clientEmail: choosedEmail
              ? choosedEmail
              : clientEmail?.email
              ? clientEmail?.email
              : clientEmail,
            clientName: choosedName
              ? choosedName
              : clientName?.name
              ? clientName?.name
              : clientName,

            totalSlot: parseInt(qty),
          }))

    if (parseInt(qty) === 1) {
      let config = {
        method: 'post',
        url: process.env.REACT_APP_END_POINT + 'orders',
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
          setQty('')
          getallOrders(dataStore.token)
          getBookingAllSlot(dataStore.token)
          setIsOrderCreate(false)
          setIsValid(false)
          setClientName('')
          setClientEmail('')
          setChoosedName('')
          setChoosedEmail('')
          Swal.fire({
            position: 'top-end',
            toast: true,
            icon: 'success',
            title: 'Commande validée',
            text: orderStore.companyName.toUpperCase() + '-' + randomCode,
            showConfirmButton: false,
            timer: 7000,
            timerProgressBar: true,
          })
        })
        .catch((error) => {
          console.log(getError(error))
          console.log(error.message)
          setMsgError(getError(error))
          setIsValid(false)
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
        url: process.env.REACT_APP_END_POINT + 'orders',
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
          const numOrder = responses?.map((num: any) => num?.data?.barcode)
          newOrderDelete()
          setQty('')
          getallOrders(dataStore.token)
          getBookingAllSlot(dataStore.token)
          setIsOrderCreate(false)
          setClientName('')
          setClientEmail('')
          setChoosedName('')
          setChoosedEmail('')
          console.log(responses)
          Swal.fire({
            position: 'top-end',
            toast: true,
            icon: 'success',
            title: 'Commande(s) validée(s)',
            text: orderStore.companyName.toUpperCase() + '-' + numOrder,
            showConfirmButton: false,
            timer: 7000,
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
          setIsOrderCreate(false)
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
      setQty('')
      setAgeRestriction(false)
      setIsValid(false)
      if (logs.logApp) {
        logCatcher(logs.logApp + ' / date :' + now + '- Commande non finalisée')
      } else {
        logCatcher('date :' + now + '- Commande non finalisée')
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
      // Swal.fire({
      //   position: 'top-end',
      //   toast: true,
      //   icon: 'error',
      //   title: 'Commande non finalisée',
      //   showConfirmButton: false,
      //   timer: 3000,
      // })
      if (logs.logApp) {
        logCatcher(logs.logApp + ' / date :' + now + " - Aucun casier n'est disponible")
      } else {
        logCatcher('date :' + now + "- Aucun casier n'est disponible")
      }
    }
  }

  const _searchWithRegex = (search: any, orderByStatus: any, setFilteredOrder: any) => {
    function escapeRegExp(str: string) {
      return str?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }

    const escapedSearchOrder = escapeRegExp(search)

    setFilteredOrder(
      orderByStatus?.filter((order: any) => {
        if (escapedSearchOrder?.length > 2) {
          return order?.name?.match(new RegExp(escapedSearchOrder, 'i'))
        }
        return undefined
      })
    )
  }

  const _searchWithRegex2 = (searchOrder: any, orderByStatus: any, setFilteredOrder: any) => {
    function escapeRegExp(str: string) {
      return str?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }

    const escapedSearchOrder = escapeRegExp(searchOrder)

    setFilteredOrder(
      orderByStatus?.filter((order: any) => {
        if (escapedSearchOrder?.length > 2) {
          return order?.email?.match(new RegExp(escapedSearchOrder, 'i'))
        }
        return undefined
      })
    )
  }

  const validOrder = (e: any) => {
    e.preventDefault()

    if (!clientName) {
      setIsMsgErrorName(true)
      console.log('object')
    }
    if (!clientEmail) {
      setIsMsgErrorEmail(true)
    }
    if (!qty) {
      setIsMsgErrorQty(true)
    }

    if ((clientName || choosedName) && (clientEmail || choosedEmail) && qty) {
      setIsError(false)
      setIsMsgErrorQty(false)
      setIsMsgErrorName(false)
      setIsMsgErrorEmail(false)

      setIsValid(true)

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
                <Col xs={2} md={5} lg={5} className='py-0'>
                  <Link
                    to='/in-progress'
                    className='text-decoration-none'
                    onClick={() => newOrderDelete()}
                  >
                    <BackButton />
                  </Link>
                </Col>
                <Col className='m-auto text-light text-start pe-4 py-0'>
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
                  className='py-0'
                  onClick={() => {
                    setClientName('')
                    setClientEmail('')
                    setChoosedName('')
                    setChoosedEmail('')
                    setQty('')
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
                  <BackButton />
                </Col>
                <Col className='m-auto text-light text-start pe-2 py-0'>
                  <i className='ri-shopping-basket-2-line align-bottom me-2'></i>{' '}
                  <span className='fw-bold'>Nombre de panier nécessaire</span>
                </Col>
              </>
            )}
          </Row>
        </Container>
        {orderStore.lockerId === null ? (
          <Container>
            <Row>
              <Col className='border-bottom-3 border-warning px-3 mx-3'></Col>
              <Col className='border-bottom-3 border-secondary px-3 mx-3'></Col>
              <Col className='border-bottom-3 border-secondary px-3 mx-3'></Col>
            </Row>
          </Container>
        ) : !isValid ? (
          <Container>
            <Row>
              <Col className='border-bottom-3 border-info px-3 mx-3'></Col>
              <Col className='border-bottom-3 border-warning px-3 mx-3'></Col>
              <Col className='border-bottom-3 border-secondary px-3 mx-3'></Col>
            </Row>
          </Container>
        ) : (
          isValid && (
            <Container>
              <Row>
                <Col className='border-bottom-3 border-info px-3 mx-3'></Col>
                <Col className='border-bottom-3 border-info px-3 mx-3'></Col>
                <Col className='border-bottom-3 border-warning px-3 mx-3'></Col>
              </Row>
            </Container>
          )
        )}
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
          <DashBoardLoader />
        </Container>
      ) : (
        <Container className='pb-5'>
          {orderStore.lockerId === null &&
            allSlot['hydra:member']?.map((locker: any, indx: any) =>
              locker?.active === true ? (
                <Container
                  key={Math.random()}
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
                          locker?.slot.temperatureZone?.myKey,
                          locker?.slot.temperatureZone?.keyTemp,
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
                          (locker?.slot?.temperatureZone?.keyTemp === 'FRESH' ||
                          locker?.slot.temperatureZone?.myKey === 'C'
                            ? 'organic-food'
                            : locker?.slot?.temperatureZone.keyTemp === 'FREEZE' ||
                              locker?.slot.temperatureZone?.myKey === 'F'
                            ? 'winter'
                            : (locker?.slot?.temperatureZone.keyTemp === 'NORMAL' ||
                                locker?.slot.temperatureZone?.myKey === 'CA') &&
                              'dry') +
                          '.png'
                        }
                        style={{ width: '40px' }}
                      />{' '}
                    </Col>
                    <Col className='m-auto pe-0 fw-bold'>{locker?.slot?.size}</Col>
                    <Col xs={7} className='px-0 m-auto text-center'>
                      <span className='item-locker-lis'>
                        {locker?.slot?.temperatureZone?.locker?.location?.toUpperCase()}
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
              <form onSubmit={validOrder}>
                <div>
                  <InputGroup className='mb-3'>
                    <InputGroup.Text id='basic-addon1' className='border-end-0 bg-light'>
                      <i className='ri-shopping-basket-2-line text-secondary'></i>
                    </InputGroup.Text>
                    <Form.Control
                      aria-label='panier'
                      aria-describedby='basic-addon1'
                      className='border-start-0'
                      type='number'
                      min={1}
                      placeholder='Nombre de panier*'
                      value={qty}
                      onChange={(e) => setQty(e.currentTarget.value)}
                      required
                    />
                  </InputGroup>
                </div>{' '}
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
                  <InputGroup.Text id='basic-addon1' className='border-end-0 bg-light'>
                    <i className='ri-user-line text-secondary'></i>
                  </InputGroup.Text>
                  <Form.Control
                    aria-label='Text input with dropdown button'
                    value={choosedName ? choosedName : clientName}
                    onChange={(e: any) => {
                      choosedName
                        ? setChoosedName(e.currentTarget.value)
                        : setClientName(e.currentTarget.value)
                    }}
                    placeholder='Nom du client*'
                    required
                    className='border-start-0'
                  />
                  {filteredName && filteredName?.length > 0 && (
                    <DropdownButton
                      variant='secondary'
                      title=''
                      className=''
                      id='input-group-dropdown-2'
                      align='end'
                      show={true}
                    >
                      {filteredName?.map((user: any) => (
                        <Dropdown.Item
                          key={Math.random()}
                          onClick={() => {
                            setChoosedName(user.name)
                            setChoosedEmail(user.email)
                            setFilteredName([])
                            setFilteredEmail([])
                          }}
                        >
                          <i className='ri-user-line'></i> {user.name} - {user.email}
                        </Dropdown.Item>
                      ))}
                    </DropdownButton>
                  )}
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
                  <InputGroup.Text id='basic-addon1' className='border-end-0 bg-light'>
                    <i className='ri-at-line text-secondary'></i>
                  </InputGroup.Text>
                  <Form.Control
                    aria-label='Text input with dropdown button'
                    value={choosedEmail ? choosedEmail : clientEmail}
                    onChange={(e: any) => {
                      choosedEmail
                        ? setChoosedEmail(e.currentTarget.value)
                        : setClientEmail(e.currentTarget.value)
                    }}
                    placeholder='Email du client*'
                    required
                    className='border-start-0'
                  />
                  {filteredEmail && filteredEmail?.length > 0 && (
                    <DropdownButton
                      variant=''
                      title=''
                      className=''
                      id='input-group-dropdown-2'
                      align='end'
                      show={true}
                    >
                      {filteredEmail?.map((user: any) => (
                        <Dropdown.Item
                          key={Math.random()}
                          onClick={() => {
                            setChoosedEmail(user.email)
                            setFilteredEmail([])
                          }}
                        >
                          {user.email}
                        </Dropdown.Item>
                      ))}
                    </DropdownButton>
                  )}
                </InputGroup>
                {isMsgErrorEmail &&
                  clientName &&
                  clientName?.length < 1 &&
                  choosedEmail &&
                  choosedEmail?.length < 1 && (
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
                    className={`bg-info rounded-pill border-info text-light 
                    `}
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
