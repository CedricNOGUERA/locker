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
  Modal,
  Row,
  Spinner,
} from 'react-bootstrap'
import Badge from 'react-bootstrap/Badge'
import { Navigate, useNavigate, useOutletContext } from 'react-router-dom'
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
import DashBoardLoader from '../../components/ui/loading/DashBoardLoader'
import ClientService from '../../service/Client/ClientService'
import InfoTopBar from './InfoTopBar'
import interrogation from '../../styles/interrogation.png'

const NewOrder = () => {
  const navigate = useNavigate()
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
  const authLogout = userDataStore((state: any) => state.authLogout)
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
    expireToken,
    setExpireToken,
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
  const [productDetail, setProductDetail] = React.useState<any>([])
  const [ageRestriction, setAgeRestriction] = React.useState<boolean>(false)
  const [availableSelect, setAvailableSelect] = React.useState<any>([])

  const [availableSlot, setAvailableSlot] = React.useState<any>()
  const [msgError, setMsgError] = React.useState<any>()
  const [codeError, setCodeError] = React.useState<any>()

  const [show, setShow] = React.useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  ////////////////////////
  //Regex pour vérifier que le numéro de téléphone du client commence par 87 ou 88 ou 89
  ///////////////////////
  const regex = /^(87|89|88)\d+$/

  //////////////////////////
  // UseEffect
  /////////////////////////
  React.useEffect(() => {
    if (trigger2) {
      console.log(expireToken)
      console.log(trigger2)
      getClients(dataStore.token)
      console.log('client request')
    }
  }, [trigger2])

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

  const expiredToken = (error: any) => {
    if (!expireToken) {
      if (error?.response?.data?.message === 'Expired JWT Token') {
        setExpireToken(true)
        alert('Session expirée, reconnectez-vous.')
        console.log('client_neworder')
        authLogout()
        // navigate('/connexion')
        return
      }
      if (error?.response?.data?.message === 'Invalid JWT Token') {
        setExpireToken(true)
        alert('Token invalide, reconnectez-vous.')
        authLogout()
        // navigate('/connexion')
        return
      }
    }
  }

  const getClients = (token: any) => {
    ClientService.allClients(token)
      .then((response: any) => {
        setAutoCompletTab(response.data)
      })
      .catch((error: any) => {
        setIsError(true)
        setMsgError(getError(error))
        setCodeError(error.status)
        expiredToken(error)
        console.log(error)
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
      .catch((error: any) => {
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
      .catch((error: any) => {
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
            products: productDetail[0],
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
            products: productDetail[indx],
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
        .then((response: any) => {
          console.log(response)
          handleClose()
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
        .catch((error: any) => {
          console.log(error)
          handleClose()
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
          handleClose()
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
          handleClose()
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
    handleShow()
  }
  const cancelNewOrder = () => {
    Swal.fire({
      position: 'top-end',
      toast: true,
      icon: 'error',
      title: 'Commande non finalisée',
      showConfirmButton: false,
      timer: 3000,
    })
    handleClose()
    newOrderDelete()
    setTempZones([])
    setSlotSizes([])
    setBookingSlotIds([])
    setQty('')
    setTrigger(false)
    setTrigger2(false)
    setClientName('')
    setClientEmail('')
    setChoosedName('')
    setChoosedEmail('')
    setClientPhone('')
    setChoosedPhone('')
    setChosenLocker([])
    setAgeRestriction(false)
    setIsValid(false)
    setProductDetail([])
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
    //conditions si "e.currentTarget.value" est vide
    if (e.currentTarget.value.trim() !== '') {
      try {
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
      } catch (error) {
        console.error('Erreur lors du traitement des données JSON :', error)
      }
    } else {
      console.error('Les données JSON sont vides.')
    }
  }

  const handleAddStartProduct = () => {
    const newTab = Array.from({ length: parseInt(qty) }).map((_, index) => [
      {
        id: 1,
        name: '',
        price: '',
        quantity: '',
      },
    ])
    setProductDetail((prevProductDetail: any) => [...prevProductDetail, ...newTab])
  }

  const handleAddProduct = (indx: any) => {
    let newTab: any[] = [...productDetail]
    newTab[indx][productDetail[indx].length] = {
      id: Math.random(),
      name: '',
      price: '',
      quantity: '',
    }
    setProductDetail(newTab)
  }

  const handleDeleteProduct = (indx: any, id: any) => {
    const newList = [...productDetail]
    newList[indx] = productDetail[indx]?.filter((prod: any) => prod?.id !== id)
    setProductDetail(newList)
  }

  const _handleChangeProduct = (
    e: any,
    indx: number,
    index: number,
    key: string,
    productDetail: any[][],
    setProductDetail: React.Dispatch<React.SetStateAction<any[][]>>
  ) => {
    const { value } = e.target

    const newProductDetail2 = [...productDetail]

    if (newProductDetail2[indx] && newProductDetail2[indx][index]) {
      newProductDetail2[indx][index][key] =
        key === 'quantity' || key === 'price' ? parseInt(value) : value
      setProductDetail(newProductDetail2)
    }
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
    setChosenLocker([])
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
  }

  const handleSecondStepClick = () => {
    setTrigger(false)
    setQty('')
    setProductDetail([])
  }

  const handleThirdStepClick = () => {
    setTrigger2(false)
    setClientPhone('')
    setChoosedPhone('')
  }

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
        lockers?.slot?.temperatureZone?.locker &&
        lockers?.slot?.temperatureZone?.locker['@id'] ===
          chosenLocker[0]?.slot?.temperatureZone?.locker['@id']
    )
    ?.reduce((acc: any, current: any) => acc + current.available, 0)

  const infoToBarProps = {
    chosenLocker,
    trigger,
    trigger2,
    handleFirstStepClick,
    handleSecondStepClick,
    handleThirdStepClick,
  }

  return (
    <div>
      {(!isLogged || !dataStore.token) && <Navigate to='/connexion' />}
      <Container className='my-2'>
        <div className='col-12 text-center font-75'>
          {' '}
          {chosenLocker[0]?.slot.temperatureZone.locker.location}
        </div>
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
                      md={
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
                          ? 4
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
                          ? 6
                          : 7
                      }
                      className='m-auto ms-md-3 font-75 ps-1 px-0 text-sm-cente'
                    >
                      {locker}
                    </Col>
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
                          ? 7
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
                          ? 5
                          : 4
                      }
                      md={
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
                          ? 7
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
                          ? 5
                          : 4
                      }
                    >
                      {uniqueTempTab(locker)?.map((slots: any, indx: any) => (
                        <div
                          key={indx}
                          className='pb-1'
                          style={{ display: 'flex', flexDirection: 'row' }}
                        >
                          <img
                            alt='Temp icon'
                            src={
                              'https://img.icons8.com/color/512/' + _imgFilter(slots) + '.png'
                            }
                            style={{ width: '32px' }}
                          />
                          <span className='font-65 pt-2 ms-1 '>
                            <i className='ri-arrow-right-line'></i>
                          </span>
                          {slotLocationTab(locker)
                            ?.filter(
                              (lock: any) => lock?.slot?.temperatureZone?.keyTemp === slots
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
                  handleAddStartProduct()
                }}
                className='m-auto'
              >
                <div className='bg-'>
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
                      min={1}
                      placeholder='Nombre de panier*'
                      value={parseFloat(qty) || ''}
                      onChange={(e) => {
                        setQty(e.currentTarget.value)
                      }}
                      required
                    />
                  </InputGroup>
                  {lockerAvailability < qty && (
                    <Alert variant='danger' className='mt-2 py-0'>
                      <InfoAlert
                        icon='ri-error-warning-line'
                        iconColor='danger'
                        message={`Vous disposé de ${lockerAvailability} paniers, vous ne pouvez pas en sélectionner plus`}
                        fontSize='font-75'
                      />
                    </Alert>
                  )}
                  <div className='text-end'>
                    <Button
                    title='Valider la quantité'
                      className='bg-info rounded-pill border-info text-light'
                      type='submit'
                    >
                      Valider
                    </Button>
                  </div>
                </div>{' '}
              </form>
            </div>
          ) : !trigger2 ? (
            <div className='mt-4'>
              <form onSubmit={validOrder}>
                <Accordion defaultActiveKey='0'>
                  {Array.from({ length: parseInt(qty) }).map((_, indx) => (
                    <React.Fragment key={indx * 10 + 25}>
                      <Accordion.Item eventKey={`${indx}`}>
                        <Accordion.Header>Panier n°{indx + 1}</Accordion.Header>
                        <Accordion.Body>
                          <Form.Select
                            onChange={(e) => {
                              handleChangeSelect(e, indx)
                            }}
                            aria-label='zone'
                            className='my-2'
                            required
                          >
                            <option value=''>Température du Panier n°{indx + 1}</option>
                            {chosenLocker?.map((lockers: any, index: any) => (
                              <option
                                onChange={() => console.log('index')}
                                key={index}
                                value={JSON.stringify(lockers)}
                                className={`text-light ${
                                  lockers?.slot?.temperatureZone?.keyTemp === 'FRESH'
                                    ? // ||
                                      // lockers?.slot?.temperatureZone?.myKey === 'MT'
                                      'bg-succes'
                                    : lockers?.slot?.temperatureZone.keyTemp === 'FREEZE'
                                    ? // ||
                                      // lockers?.slot?.temperatureZone?.myKey === 'LT'
                                      'bg-inf'
                                    : lockers?.slot?.temperatureZone.keyTemp === 'NORMAL' &&
                                      // ||
                                      //     lockers?.slot?.temperatureZone?.myKey === 'CA'
                                      'bg-warnin'
                                }`}
                                disabled={lockers.available < 1 ? true : false}
                              >
                                {lockers?.slot?.temperatureZone?.keyTemp === 'FRESH'
                                  ? // ||
                                    // lockers?.slot?.temperatureZone?.myKey === 'MT'
                                    '🍃 Zone Fraîche'
                                  : lockers?.slot?.temperatureZone.keyTemp === 'FREEZE'
                                  ? // ||
                                    //   lockers?.slot?.temperatureZone?.myKey === 'LT'
                                    '❄ Zone Congelée'
                                  : lockers?.slot?.temperatureZone.keyTemp === 'NORMAL' &&
                                    // ||
                                    //     lockers?.slot?.temperatureZone?.myKey === 'CA'
                                    '☀️ Zone Ambiante'}{' '}
                                ({lockers?.slot.size}) - {lockers?.available}{' '}
                                {lockers?.available > 1 ? 'casiers' : 'casier'}
                              </option>
                            ))}
                          </Form.Select>
                          <Row>
                            <Col xs={2} className='font-75 my-0 py-0'>
                              Qté
                            </Col>
                            <Col className='font-75 my-0 py-0'>Produit</Col>
                            <Col xs={3} className='font-75 my-0 py-0'>
                              Prix
                            </Col>
                          </Row>
                          {productDetail[indx] &&
                            productDetail[indx]?.map((prod: any, index: any) => (
                              <React.Fragment key={index}>
                                <Row style={{ height: 50 }}>
                                  <React.Fragment key={index}>
                                    <Col
                                      className='font-75 mx-0 px-0'
                                      xs={1}
                                      style={{ width: 5 }}
                                    >
                                      {index + 1}
                                    </Col>
                                    <Col xs={2} className='px-1'>
                                      <InputGroup className='mb-4 pe-0'>
                                        <Form.Control
                                          className='px-0 text-center'
                                          type='number'
                                          placeholder='Qté'
                                          min={1}
                                          value={parseFloat(prod?.quantity) || ''}
                                          onChange={(e) =>
                                            _handleChangeProduct(
                                              e,
                                              indx,
                                              index,
                                              'quantity',
                                              productDetail,
                                              setProductDetail
                                            )
                                          }
                                          required
                                        />
                                      </InputGroup>
                                    </Col>
                                    <Col className='px-0'>
                                      <InputGroup className='mb-4'>
                                        <Form.Control
                                          placeholder='Produit'
                                          value={prod?.name}
                                          onChange={(e) =>
                                            _handleChangeProduct(
                                              e,
                                              indx,
                                              index,
                                              'name',
                                              productDetail,
                                              setProductDetail
                                            )
                                          }
                                          required
                                        />
                                      </InputGroup>
                                    </Col>
                                    <Col xs={3} className='px-1'>
                                      <InputGroup className='mb-4'>
                                        <Form.Control
                                          type='number'
                                          placeholder='prix'
                                          min={1}
                                          value={parseFloat(prod?.price) || ''}
                                          onChange={(e) =>
                                            _handleChangeProduct(
                                              e,
                                              indx,
                                              index,
                                              'price',
                                              productDetail,
                                              setProductDetail
                                            )
                                          }
                                          required
                                        />
                                      </InputGroup>
                                    </Col>
                                    {productDetail[indx] &&
                                      productDetail[indx]?.length > 1 && (
                                        <Col
                                          xs={1}
                                          className='px-0 '
                                          onClick={() => {
                                            handleDeleteProduct(indx, prod?.id)
                                            console.log(prod)
                                          }}
                                        >
                                          <i className='ri-delete-bin-2-line fs-5 align-top text-secondary'></i>
                                          {/* <i className='ri-close-circle-line align-top text-secondary'></i> */}
                                        </Col>
                                      )}
                                  </React.Fragment>
                                </Row>
                              </React.Fragment>
                            ))}

                          <Button
                            aria-label="Aria Ajouter" title='Ajouter un produit'
                            onClick={() => {
                              handleAddProduct(indx)
                            }}
                            variant='warning'
                            className='rounded-pill text-light'
                          >
                            <i className='ri-add-fill fs-4 align-bottom'></i>
                          </Button>
                        </Accordion.Body>
                      </Accordion.Item>
                    </React.Fragment>
                  ))}
                </Accordion>

                <div className='w-100 text-end mt-3'>
                  <Button
                            aria-label="Aria Valider prod" title='Valider produit'
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
            <div className='mt-5'>
              <form
                onSubmit={(e) => {
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
                {clientName &&
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
                  Cochez la case, s'il y a des produits alcoolisés dans la commande.
                </span>
                <div className='w-100 text-end'>
                  <Button
                  aria-label="Aria commande" title='Valider commande'
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
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body>
          <div className='text-center my-3 animate__animated animate__jello'>
            <img src={interrogation} alt="point d'interrogation" width={150} />
          </div>
          <p>Voulez-vous valider cette commande ?</p>
          <div className='mt-3 text-end'>
            <Button aria-label="Aria annuler" title='Annuler commande' variant='warning' onClick={cancelNewOrder} className='me-3'>
              Annuler
            </Button>
            <Button aria-label="Aria valider" title='Valider la commande' variant='info' onClick={createNewOrder}>
              Valider
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default NewOrder
