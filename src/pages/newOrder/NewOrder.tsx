import React from 'react'
import {
  Accordion,
  Alert,
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
import Badge from 'react-bootstrap/Badge'
import { Link, Navigate, useOutletContext } from 'react-router-dom'
import BookingSlotservice from '../../service/BookingSlot/BookingSlotservice'
import newOrderDataStore from '../../store/newOrderDataStore'
import userDataStore from '../../store/userDataStore'
import Swal from 'sweetalert2'
import bookingStore from '../../store/bookingStore'
import logsStore from '../../store/logsStore'
import { _imgFilter, _searchAnythingWithRegex, _strRandom } from '../../utils/functions'
import axios from 'axios'
import OrdersService from '../../service/Orders/OrdersService'
import AlertIsError from '../../components/ui/warning/AlertIsError'
import { getError } from '../../utils/errors/GetError'
import images from '../../styles/no-order-min.png'
import InfoAlert from '../../components/ui/warning/InfoAlert'
import BackButton from '../../components/ui/BackButton'
import DashBoardLoader from '../../components/ui/loading/DashBoardLoader'
import ClientService from '../../service/Client/ClientService'
import imagLogo from '../../styles/carrefour-logo.png'
import InfoTopBar from './InfoTopBar'

const NewOrder = () => {
  //////////////////////////
  // booleans States
  /////////////////////////
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isOrderCreate, setIsOrderCreate] = React.useState<boolean>(false)
  const [isError, setIsError] = React.useState<boolean>(false)
  const [isMsgErrorQty, setIsMsgErrorQty] = React.useState<boolean>(false)
  const [isMsgErrorName, setIsMsgErrorName] = React.useState<boolean>(false)
  const [isMsgErrorEmail, setIsMsgErrorEmail] = React.useState<boolean>(false)
  const [isValid, setIsValid] = React.useState<boolean>(false)
  const [trigger, setTrigger] = React.useState<boolean>(false)
  const [trigger2, setTrigger2] = React.useState<boolean>(false)
  const [isValidPhone, setIsValidPhone] = React.useState<boolean>(true)
  const [isValidPhone2, setIsValidPhone2] = React.useState<boolean>(true)

  //////////////////////////
  // Store & context state
  /////////////////////////
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
    allSlot,
    setAllSlot,
    selectedItem,
    setSelectedItem,
  ] = useOutletContext<any>()

  //////////////////////////
  // States
  /////////////////////////

  const [qty, setQty] = React.useState<any>('')
  const [clientEmail, setClientEmail] = React.useState<any>('')
  const [clientName, setClientName] = React.useState<any>('')
  const [clientPhone, setClientPhone] = React.useState<any>('')
  const [filteredEmail, setFilteredEmail] = React.useState<any>([])
  const [filteredName, setFilteredName] = React.useState<any>([])
  const [filteredPhone, setFilteredPhone] = React.useState<any>([])
  const [autoCompletTab, setAutoCompletTab] = React.useState<any>([])
  const [choosedName, setChoosedName] = React.useState<any>('')
  const [choosedEmail, setChoosedEmail] = React.useState<any>('')
  const [choosedPhone, setChoosedPhone] = React.useState<any>('')
  const [uniqueTab, setUniqueTab] = React.useState<any>([])
  const [chosenLocker, setChosenLocker] = React.useState<any>([])

  const [bookingSlotIds, setBookingSlotIds] = React.useState<any>([])
  const [tempZones, setTempZones] = React.useState<any>([])
  const [slotSizes, setSlotSizes] = React.useState<any>([])
  const [products, setProducts] = React.useState<string>('')
  const [productDetail, setProductDetail] = React.useState<any>([])

  const [ageRestriction, setAgeRestriction] = React.useState<boolean>(false)
  const [availableSelect, setAvailableSelect] = React.useState<any>([])

  const [availableSlot, setAvailableSlot] = React.useState<any>()
  const [msgError, setMsgError] = React.useState<any>()
  const [codeError, setCodeError] = React.useState<any>()

  ////////////////////////
  //Regex pour vérifier que le numéro de téléphone du client commence par 87 ou 88 ou 89
  ///////////////////////
  const regex = /^(87|89|88)\d+$/

  //////////////////////////
  // UseEffect
  /////////////////////////
  React.useEffect(() => {
    getClients(dataStore.token)
  }, [])

  React.useEffect(() => {
    setIsValidPhone(regex.test(choosedPhone ? choosedPhone : clientPhone))

    if (clientPhone === '') {
      setIsValidPhone2(true)
      setIsValidPhone(true)
    }
  }, [clientPhone])

  React.useEffect(() => {
    if (chosenLocker) {
      if (chosenLocker?.length > availableSelect?.length) {
        chosenLocker?.map((locker: any) => (
          <span key={Math.random()}>availableSelect?.push(locker.available)</span>
        ))
      }
    }
    if (qty === 0 || qty === null || qty === undefined || qty === '') {
      setAvailableSelect([])
    }
  }, [qty])

  React.useEffect(() => {
    const bookingLocker: any = allSlot?.['hydra:member']?.map(
      (locker: any) => locker?.slot?.temperatureZone?.locker
    )
    const deduplicate: any = [
      ...new Set(bookingLocker?.map((locker: any) => locker?.location)),
    ]
    setUniqueTab(deduplicate)
  }, [allSlot])

  React.useEffect(() => {
    _searchAnythingWithRegex(
      clientName,
      autoCompletTab['hydra:member'],
      setFilteredName,
      'name'
    )
  }, [clientName])

  React.useEffect(() => {
    _searchAnythingWithRegex(
      clientEmail,
      autoCompletTab['hydra:member'],
      setFilteredEmail,
      'email'
    )
  }, [clientEmail])

  React.useEffect(() => {
    _searchAnythingWithRegex(
      clientPhone,
      autoCompletTab['hydra:member'],
      setFilteredPhone,
      'phone'
    )
  }, [clientPhone])

  //////////////////////////
  // Events
  /////////////////////////

  const getClients = (token: any) => {
    ClientService.allClients(token)
      .then((response: any) => {
        setAutoCompletTab(response.data)
      })
      .catch((error) => {
        setIsError(true)
        setMsgError(getError(error))
        setCodeError(error.status)
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
        setCodeError(error.status)
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
        setCodeError(error.status)
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
    setTempZones([])
    setSlotSizes([])
    setBookingSlotIds([])
    setQty('')
    setTrigger(false)
    setChosenLocker([])
    setClientName('')
    setClientEmail('')
    setChoosedName('')
    setChoosedEmail('')
    setClientPhone('')
    setAgeRestriction(false)
  }

  const createNewOrder = () => {
    function entierAleatoire(min: any, max: any) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }
    const multiOrderCode = _strRandom('popopopp').toLocaleUpperCase()
    const randomCode = _strRandom('popopop').toLocaleUpperCase() + entierAleatoire(1, 9)
    const randomCodeMultiOrder = _strRandom('popopop').toLocaleUpperCase()
    const receiveCode = entierAleatoire(10000000, 99999999)

    setIsOrderCreate(true)

    let dataOrder: any =
      parseInt(qty) === 1
        ? {
            service: 'B2C',
            barcode: chosenLocker[0]?.company?.cleveronCompanyId + '-' + randomCode,
            bookingSlot: bookingSlotIds[0],
            destination: {
              apm: orderStore?.lockerId,
            },
            slotSize: slotSizes[0],
            receiveCode: `${receiveCode}`,
            temperatureZonePredefined: tempZones[0],

            changesTimestamp: new Date(Date.now()).toISOString(),
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
            clientPhone: choosedPhone
              ? choosedPhone
              : clientPhone?.phone
              ? clientPhone?.phone
              : clientPhone,
            shippedBy: 'api/users/' + dataStore.id,
            totalSlot: parseInt(qty),
            products: [productDetail],
          }
        : Array.from({ length: parseInt(qty) }).map((_, indx) => ({
            service: 'B2C',

            barcode:
              chosenLocker[0]?.company?.cleveronCompanyId +
              '-' +
              randomCodeMultiOrder +
              (indx + 1),

            destination: {
              apm: orderStore?.lockerId,
            },
            receiveCode: `${receiveCode}`,

            multiOrder: {
              code: multiOrderCode,
              itemCount: parseInt(qty),
            },

            changesTimestamp: new Date(Date.now()).toISOString(),
            bookingSlot: bookingSlotIds[indx],
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
            clientPhone: choosedPhone
              ? choosedPhone
              : clientPhone?.phone
              ? clientPhone?.phone
              : clientPhone,
            shippedBy: 'api/users/' + dataStore.id,
            totalSlot: parseInt(qty) / parseInt(qty),
            products: [productDetail[indx]],
          }))

    if (ageRestriction === true) {
      if (parseInt(qty) === 1) {
        dataOrder.ageRestriction = 18
      } else {
        Array.from({ length: parseInt(qty) }).map(
          (_, indx) => (dataOrder[indx].ageRestriction = 18)
        )
      }
    }

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
          console.log(response)
          newOrderDelete()
          setTempZones([])
          setSlotSizes([])
          setBookingSlotIds([])
          setQty('')
          getallOrders(dataStore.token)
          getBookingAllSlot(dataStore.token)
          setIsOrderCreate(false)
          setIsValid(false)
          setTrigger(false)
          setChosenLocker([])
          setClientName('')
          setClientEmail('')
          setChoosedName('')
          setChoosedEmail('')
          setTrigger2(false)
          setClientPhone('')
          setChoosedPhone('')
          setAgeRestriction(false)
          Swal.fire({
            position: 'top-end',
            toast: true,
            icon: 'success',
            title: 'Commande validée',
            text: chosenLocker[0]?.company?.cleveronCompanyId + '-' + randomCode,
            showConfirmButton: false,
            timer: 7000,
            timerProgressBar: true,
          })
        })
        .catch((error) => {
          console.log(error)
          setMsgError(getError(error))
          setIsValid(false)
          setQty('')
          setTrigger(false)
          setChosenLocker([])
          setIsOrderCreate(false)
          setIsValid(false)
          setClientName('')
          setClientEmail('')
          setChoosedName('')
          setChoosedEmail('')
          setTrigger2(false)
          setClientPhone('')
          setChoosedPhone('')
          setAgeRestriction(false)
          if (logs.logApp) {
            logCatcher(logs.logApp + ' / date :' + now + '-' + error.response.statusText)
          } else {
            logCatcher('date :' + now + '-' + error.response.statusText)
          }

          popUpError(error.response.status, error.response.data['hydra:description'])
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
          setTempZones([])
          setSlotSizes([])
          setBookingSlotIds([])

          setQty('')
          getallOrders(dataStore.token)
          getBookingAllSlot(dataStore.token)
          setIsOrderCreate(false)
          setClientName('')
          setClientEmail('')
          setChoosedName('')
          setChoosedEmail('')
          setAgeRestriction(false)
          setTrigger(false)
          setChosenLocker([])
          Swal.fire({
            position: 'top-end',
            toast: true,
            icon: 'success',
            title: 'Commande(s) validée(s)',
            text: `${numOrder}`,
            showConfirmButton: false,
            timer: 7000,
            timerProgressBar: true,
          })
        })
        .catch((error) => {
          // console.log(error)
          logCatcher(error.response.statusText)
          setMsgError(getError(error))
          popUpError(error.response.status, error.response.data['hydra:description'])
          setIsOrderCreate(false)
          setQty('')
          setTrigger(false)
          setChosenLocker([])
          setClientName('')
          setClientEmail('')
          setChoosedName('')
          setChoosedEmail('')
          setAgeRestriction(false)
          if (logs.logApp) {
            logCatcher(logs.logApp + ' / date :' + now + '-' + error.response.statusText)
          } else {
            logCatcher('date :' + now + '-' + error.response.statusText)
          }
        })
    }
  }

  const newOrderModal = async (e: any) => {
    e.preventDefault()

    const { value: accept } = await Swal.fire({
      icon: 'question',
      title: 'Voulez-vous valider la commande ?',
      inputValue: 1,
      showCancelButton: true,
      confirmButtonText: 'Continuer',
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
      })
      newOrderDelete()
      setTempZones([])
      setSlotSizes([])
      setBookingSlotIds([])
      setQty('')
      setTrigger(false)
      setTrigger2(false)

      setProducts('')
      setClientName('')
      setClientEmail('')
      setChoosedName('')
      setChoosedEmail('')
      setClientPhone('')
      setChoosedPhone('')
      setChosenLocker([])
      setAgeRestriction(false)
      setIsValid(false)
      if (logs.logApp) {
        logCatcher(logs.logApp + ' / date :' + now + '- Commande non finalisée')
      } else {
        logCatcher('date :' + now + '- Commande non finalisée')
      }
    }
  }

  const validOrder = (e: any) => {
    e.preventDefault()

    if (!qty) {
      setIsMsgErrorQty(true)
    }

    if (qty) {
      setIsError(false)
      setIsMsgErrorQty(false)
      setIsMsgErrorName(false)
      setIsMsgErrorEmail(false)

      setIsValid(true)

      newOrderRegister(
        orderStore.lockerId,
        orderStore.location,
        null,
        orderStore.companyId,
        orderStore.companyName,
        orderStore.lockerType,
        orderStore.delivererId,
        tempZones,
        null,
        orderStore.keyTemp,
        null,
        slotSizes,
        parseInt(qty),
        ageRestriction === true ? 18 : 0
      )
      setTrigger2(true)
    }
  }

  const filteredLocker = (locker: any) => {
    setChosenLocker(
      allSlot['hydra:member'].filter(
        (slots: any) => slots?.slot?.temperatureZone?.locker?.location === locker
      )
    )
  }


  const handleChangeSelect = (e: any, indx: any) => {
    const zone: any = JSON.parse(e.currentTarget.value)

    const newTab: any = [...tempZones]
    newTab[indx] = zone?.slot?.temperatureZone?.myKey
    setTempZones(newTab)

    const newTabSize: any = [...slotSizes]
    newTabSize[indx] = zone.slot?.size
    setSlotSizes(newTabSize)

    const newTabBooking: any = [...bookingSlotIds]
    newTabBooking[indx] = zone['@id']
    setBookingSlotIds(newTabBooking)
    newOrderRegister(
      zone?.slot?.temperatureZone?.locker['@id'],
      zone?.slot?.temperatureZone?.locker?.location,
      bookingSlotIds,
      zone?.company['@id'],
      zone?.company?.name,
      zone?.slot?.temperatureZone?.locker?.type,
      dataStore?.id,
      tempZones,
      zone?.slot?.temperatureZone?.myKey,
      slotSizes,
      parseInt(qty),
      ageRestriction === true ? 18 : 0
    )
  }
 

  const handleAddCart = (qty: any) => {
    const newTab = Array.from({ length: parseInt(qty) }).map((_, indx) => ({
      panier: indx + 1,
      detail: '',
      // "tempZone": '',
      // "size": '',
      // "amount": 0,
    }))
    setProductDetail((prevProductDetail: any) => [...prevProductDetail, ...newTab])
  }

  const _handleChangeProduct = (
    e: any,
    indx: any,
    key: any,
    productDetail: any,
    setProductDetail: any
  ) => {
    const newProduits: any = [...productDetail]
    newProduits[indx][key] = key === 'qty' ? parseInt(e.target?.value) : e.target?.value
    setProductDetail(newProduits)
  }


  const borderClasses = ['border-info', 'border-warning', 'border-secondary']

  let rowClasses: any = []

  if (chosenLocker?.length === 0) {
    rowClasses = [borderClasses[1], borderClasses[2], borderClasses[2], borderClasses[2]]
  } else if (!trigger) {
    rowClasses = [borderClasses[0], borderClasses[1], borderClasses[2], borderClasses[2]]
  } else if (!trigger2) {
    rowClasses = [borderClasses[0], borderClasses[0], borderClasses[1], borderClasses[2]]
  } else {
    rowClasses = [borderClasses[0], borderClasses[0], borderClasses[0], borderClasses[1]]
  }

  const handleFirstStepClick = () => {
    setChosenLocker([]);
    setProducts('');
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
    );
  };
  
  const handleSecondStepClick = () => {
    
    setTrigger(false);
    setQty(undefined);
    setProductDetail([]);
  };
  
  const handleThirdStepClick = () => {
    setTrigger2(false);
    setProductDetail([]);
    setClientPhone('');
    setChoosedPhone('');

  };



  const slotLocationTab = (location: any) => {
    const filteredData = allSlot?.['hydra:member']?.filter(
      (lockers: any) => lockers?.slot?.temperatureZone?.locker?.location === location
    )
    return filteredData
  }

  const uniqueTempTab = (locker: any) => {
    const newTab = [
      ...new Set(
        slotLocationTab(locker)?.map((lock: any) => lock?.slot?.temperatureZone?.keyTemp)
      ),
    ]
    return newTab
  }

  const lockerAvailability = allSlot?.['hydra:member']
    ?.filter(
      (lockers: any) =>
        lockers?.slot?.temperatureZone?.locker['@id'] ===
        chosenLocker[0]?.slot?.temperatureZone?.locker['@id']
    )
    ?.reduce((acc: any, current: any) => acc + current.available, 0)

const infoToBarProps =  {chosenLocker, trigger, trigger2, handleFirstStepClick, handleSecondStepClick, handleThirdStepClick}


  return (
    <div>
      {(!isLogged || !dataStore.token) && <Navigate to='/connexion' />}
      <Container className='my-2'>
        <Container className='px-3 py-0 bg-secondary rounded-pill shadow my-auto '>
          <Row>
            <InfoTopBar infoToBarProps={infoToBarProps} />
          </Row>
        </Container>
        <Container>
          <Row>
            {rowClasses.map((borderClass: any, index: any) => (
              <Col key={index} className={`border-bottom-3 ${borderClass} px-3 mx-2`}></Col>
            ))}
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
          <DashBoardLoader />
        </Container>
      ) : (
        <Container className='pb-5 mb-5'>
          {allSlot && allSlot['hydra:member']?.length < 0 ? (
            <div className=' text-center mt-5 pt-5'>
              <img className='' alt='no slot' src={images} style={{ height: '256px' }} />
              <div className='user-name fs-3 fw-bold text-secondary'>Aucune réservation</div>
            </div>
          ) : chosenLocker?.length === 0 ? (
            <div className='mt-4'>
              {uniqueTab?.map((locker: any, indx: any) => (
                <Container
                  key={indx * Math.random()}
                  className='text-light pt-1 pe-4 pe-sm-2 pe-md-2 mb-3 border-0 rounded bg-secondary animate__animated'
                  onClick={() => {
                    filteredLocker(locker)
                    setAvailableSlot(locker?.available)
                  }}
                >
                  <Row className='px-1 px-sm-3 pt-'>
                    <Col
                      xs={
                        allSlot?.['hydra:member']
                          ?.filter(
                            (lockers: any) =>
                              lockers?.slot?.temperatureZone?.locker?.location === locker
                          )
                          ?.filter(
                            (lock: any) =>
                              lock?.slot?.temperatureZone?.keyTemp ===
                              slotLocationTab(locker)[indx]?.slot?.temperatureZone?.keyTemp
                          )?.length === 3
                          ? 5
                          : allSlot?.['hydra:member']
                              ?.filter(
                                (lockers: any) =>
                                  lockers?.slot?.temperatureZone?.locker?.location === locker
                              )
                              ?.filter(
                                (lock: any) =>
                                  lock?.slot?.temperatureZone?.keyTemp ===
                                  slotLocationTab(locker)[indx]?.slot?.temperatureZone?.keyTemp
                              )?.length === 2
                          ? 7
                          : 8
                      }
                      className='m-auto ms-md-3 font-75 ps-1 px-0 text-sm-center'
                    >
                      <Row>
                        <Col xs={2}>
                          <div className=' m-auto'>
                            <img src={imagLogo} alt='logo' width={35} />
                          </div>
                        </Col>
                        <Col>{locker}</Col>
                      </Row>
                    </Col>
                    <Col>
                      {uniqueTempTab(locker)?.map((slots: any, indx: any) => (
                        <div
                          key={indx}
                          className='pb-1'
                          style={{ display: 'flex', flexDirection: 'row' }}
                        >
                          <img
                            alt='Temp icon'
                            src={
                              'https://img.icons8.com/color/512/' +
                              _imgFilter(
                                slotLocationTab(locker)[indx].slot?.temperatureZone?.keyTemp
                              ) +
                              '.png'
                            }
                            style={{ width: '32px' }}
                          />
                          <span className='font-65 pt-2 ms-1 '>
                            <i className='ri-arrow-right-line'></i>
                          </span>

                          {slotLocationTab(locker)
                            ?.filter(
                              (lock: any) =>
                                lock?.slot?.temperatureZone?.keyTemp ===
                                slotLocationTab(locker)[indx]?.slot?.temperatureZone?.keyTemp
                            )
                            ?.map((temp: any) => (
                              <div key={Math.random()} className='badge-hoster px-0 ms-1 pt-1'>
                                <span className='font-75 fw-bold ms-2 mb-0 bg-warning rounded-pill  px-2'>
                                  {temp?.slot?.size}
                                </span>
                                <div className='my-badge px-0 font-75 pb-0'>
                                  <Badge className=' rounded-pill bg-info border-2 border-secondary'>
                                    {temp?.available}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                        </div>
                      ))}
                    </Col>
                  </Row>
                </Container>
              ))}
            </div>
          ) : !trigger ? (
            <div className='mt-5'>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setTrigger(true)
                  handleAddCart(qty)
                }}
              >
                <div>
                  <InputGroup className='my-3'>
                    <InputGroup.Text
                      id='basic-addon1'
                      className='border-end-0 bg-secondary-500'
                    >
                      <i className='ri-shopping-basket-2-line text-secondary'></i>
                    </InputGroup.Text>
                    <Form.Control
                      aria-label='panier'
                      aria-describedby='basic-addon1'
                      className='border-start-0'
                      type='number'
                      max={allSlot?.['hydra:member']
                        ?.filter(
                          (lockers: any) =>
                            lockers?.slot?.temperatureZone?.locker['@id'] ===
                            chosenLocker[0]?.slot?.temperatureZone?.locker['@id']
                        )
                        ?.reduce((acc: any, current: any) => acc + current?.available, 0)}
                      placeholder='Nombre de panier*'
                      value={qty}
                      onChange={(e) => {
                        setQty(e.currentTarget.value)
                      }}
                      required
                    />
                  </InputGroup>
                  {lockerAvailability < qty && (
                    <Alert variant='danger' className='mt-2 py-0 text-cente'>
                      <InfoAlert
                        icon='ri-error-warning-line'
                        iconColor='danger'
                        message={`Vous disposé de ${lockerAvailability} paniers, vous ne pouvez pas en sélectionner plus`}
                        fontSize='font-75'
                      />
                    </Alert>
                  )}
                  <Button
                    className='bg-info rounded-pill border-info text-light'
                    type='submit'
                  >
                    Valider
                  </Button>
                </div>{' '}
              </form>
            </div>
          ) : !trigger2 ? (
            <div className='mt-4'>
              <form onSubmit={validOrder}>
                <Accordion defaultActiveKey='0'>
                  {Array.from({ length: parseInt(qty) }).map((_, indx) => (
                    <React.Fragment key={indx * 10}>
                      <Accordion.Item eventKey={`${indx}`}>
                        <Accordion.Header>Choix n°{indx + 1}</Accordion.Header>
                        <Accordion.Body>
                          <Form.Select
                            onChange={(e) => {
                              handleChangeSelect(e, indx)
                            }}
                            aria-label='zone'
                            className='my-2'
                            required
                          >
                            <option value=''>Panier n°{indx + 1}</option>
                            {chosenLocker?.map((lockers: any, index: any) => (
                              <option
                                key={index}
                                value={JSON.stringify(lockers)}
                                className={`text-light ${
                                  lockers?.slot?.temperatureZone?.keyTemp === 'FRESH' ||
                                  lockers?.slot?.temperatureZone?.myKey === 'MT'
                                    ? 'bg-succes'
                                    : lockers?.slot?.temperatureZone.keyTemp === 'FREEZE' ||
                                      lockers?.slot?.temperatureZone?.myKey === 'LT'
                                    ? 'bg-inf'
                                    : (lockers?.slot?.temperatureZone.keyTemp === 'NORMAL' ||
                                        lockers?.slot?.temperatureZone?.myKey === 'CA') &&
                                      'bg-warnin'
                                }`}
                                disabled={lockers.available < 1 ? true : false}
                              >
                                {lockers?.slot?.temperatureZone?.keyTemp === 'FRESH' ||
                                lockers?.slot?.temperatureZone?.myKey === 'MT'
                                  ? 'Zone Fraîche'
                                  : lockers?.slot?.temperatureZone.keyTemp === 'FREEZE' ||
                                    lockers?.slot?.temperatureZone?.myKey === 'LT'
                                  ? 'Zone Congelée'
                                  : (lockers?.slot?.temperatureZone.keyTemp === 'NORMAL' ||
                                      lockers?.slot?.temperatureZone?.myKey === 'CA') &&
                                    'Zone Ambiante'}{' '}
                                {lockers?.slot.size}- {lockers?.available}{' '}
                                {lockers?.available > 1 ? 'casiers' : 'casier'}
                              </option>
                            ))}
                          </Form.Select>
                          <InputGroup className='mb-4'>
                            <InputGroup.Text className='border-end-0 bg-secondary-500'>
                              <i className='ri-inbox-archive-line text-secondary'></i>
                            </InputGroup.Text>
                            <Form.Control
                              as='textarea'
                              aria-label='textarea'
                              placeholder={`Produits du panier n° ${indx + 1}`}
                              value={productDetail[indx]?.detail}
                              onChange={(e) =>
                                _handleChangeProduct(
                                  e,
                                  indx,
                                  'detail',
                                  productDetail,
                                  setProductDetail
                                )
                              }
                              required
                            />
                          </InputGroup>
                        </Accordion.Body>
                      </Accordion.Item>
                    </React.Fragment>
                  ))}
                </Accordion>

                <div className='w-100 text-end mt-3'>
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
            </div>
          ) : (
            <div>
              <form
                onSubmit={(e) => {
                  newOrderModal(e)
                  if (
                    (clientPhone?.length !== 8 && choosedPhone === '') ||
                    (choosedPhone?.length !== 8 && clientPhone === '')
                  ) {
                    e.preventDefault()
                    setIsValidPhone2(false)
                  } else {
                    newOrderModal(e)
                    setIsValidPhone(true)
                    setIsValidPhone2(true)
                  }
                }}
              >
                <InputGroup className='mb-3 mt-2'>
                  <InputGroup.Text id='basic-addon1' className='border-end-0 bg-secondary-500'>
                    <i className='ri-user-line text-secondary'></i>
                  </InputGroup.Text>
                  <Form.Control
                    aria-label='Text input with dropdown button'
                    value={choosedName ? choosedName : clientName}
                    onChange={(e: any) => {
                      choosedName
                        ? setChoosedName(e.currentTarget.value)
                        : setClientName(e.currentTarget.value)
                      newOrderRegister(
                        orderStore.lockerId,
                        orderStore.location,
                        bookingSlotIds,
                        orderStore.companyId,
                        orderStore.companyName,
                        orderStore.lockerType,
                        dataStore.id,
                        tempZones,
                        orderStore.keyTemp,
                        slotSizes,
                        parseInt(qty),
                        ageRestriction === true ? 18 : 0
                      )
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
                      id='input-group-dropdown-3'
                      align='end'
                      show={true}
                    >
                      {filteredName?.map((user: any) => (
                        <Dropdown.Item
                          key={Math.random() * 4}
                          onClick={() => {
                            setChoosedName(user.name)
                            setChoosedEmail(user.email)
                            setChoosedPhone(user.phone)
                            setFilteredName([])
                            setFilteredEmail([])
                            setFilteredPhone([])
                          }}
                        >
                          <i className='ri-user-line'></i> {user.name} - {user.email} -{' '}
                          {user?.phone}
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
                  <InputGroup.Text id='basic-addon1' className='border-end-0 bg-secondary-500'>
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
                      id='input-group-dropdown-1'
                      align='end'
                      show={true}
                    >
                      {filteredEmail?.map((user: any) => (
                        <Dropdown.Item
                          key={Math.random()}
                          onClick={() => {
                            setChoosedName(user.name)
                            setChoosedEmail(user.email)
                            setChoosedPhone(user.phone)
                            setFilteredName([])
                            setFilteredEmail([])
                            setFilteredPhone([])
                          }}
                        >
                          <i className='ri-user-line'></i> {user.name} - {user.email} -{' '}
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
                <InputGroup className='mb-3'>
                  <InputGroup.Text id='basic-addon1' className='border-end-0 bg-secondary-500'>
                    <i className='ri-phone-line text-secondary'></i>
                  </InputGroup.Text>
                  <Form.Control
                    aria-label='Text input with dropdown button'
                    type='number'
                    value={choosedPhone ? choosedPhone : clientPhone}
                    onChange={(e: any) => {
                      choosedPhone
                        ? setChoosedPhone(e.currentTarget.value)
                        : setClientPhone(e.currentTarget.value)
                    }}
                    placeholder='Téléphone du client*'
                    required
                    className='border-start-0'
                  />
                  {filteredPhone && filteredPhone?.length > 0 && (
                    <DropdownButton
                      variant=''
                      title=''
                      className=''
                      id='input-group-dropdown-2'
                      align='end'
                      show={true}
                    >
                      {filteredPhone?.map((user: any) => (
                        <Dropdown.Item
                          key={Math.random()}
                          onClick={() => {
                            setChoosedName(user.name)
                            setChoosedEmail(user.email)
                            setChoosedPhone(user.phone)
                            setFilteredName([])
                            setFilteredEmail([])
                            setFilteredPhone([])
                          }}
                        >
                          <i className='ri-user-line'></i> {user.name} - {user.email} -{' '}
                          {user.phone}
                        </Dropdown.Item>
                      ))}
                    </DropdownButton>
                  )}
                </InputGroup>
                {!isValidPhone && clientPhone?.length > 2 && (
                  <Alert variant='danger' className='mt-2 py-0 '>
                    <InfoAlert
                      icon='ri-error-warning-line'
                      iconColor='danger'
                      message={'Ce champ doit commencer par "87" ou "88" ou "89" '}
                      fontSize='font-75'
                    />
                  </Alert>
                )}
                {!isValidPhone2 && (
                  <Alert variant='danger' className='mt-2 py-0 '>
                    <InfoAlert
                      icon='ri-error-warning-line'
                      iconColor='danger'
                      message={'Ce champ doit être composé de 8 chiffres"'}
                      fontSize='font-75'
                    />
                  </Alert>
                )}
                {
                  // isMsgErrorPhone &&
                  clientName &&
                    clientName?.length < 1 &&
                    choosedPhone &&
                    choosedPhone?.length < 1 && (
                      <Alert variant='danger' className='mt-2 py-0 '>
                        <InfoAlert
                          icon='ri-error-warning-line'
                          iconColor='danger'
                          message={'Ce champ est obligatoire'}
                          fontSize='font-75'
                        />
                      </Alert>
                    )
                }
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
                  Cochez la case, s'il y a des produits alcoolisés dans la commande.
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
            </div>
          )}
        </Container>
      )}
    </div>
  )
}

export default NewOrder
