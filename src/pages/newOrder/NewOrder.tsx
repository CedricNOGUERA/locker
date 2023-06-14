import React from 'react'
import {
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
import images from '../../styles/no-order-min.png'
import InfoAlert from '../../components/ui/warning/InfoAlert'
import { useForm } from 'react-hook-form'
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

const NewOrder: React.FC = () => {
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
    selectedItem,
    setSelectedItem,
  ] = useOutletContext<any>()

  const [qty, setQty] = React.useState<any>("")
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
  const [globalDispo, setGlobalDispo] = React.useState<any>(null)

  const [bookingSlotIds, setBookingSlotIds] = React.useState<any>([])
  const [tempZones, setTempZones] = React.useState<any>([])
  const [slotSizes, setSlotSizes] = React.useState<any>([])
  const [products, setProducts] = React.useState<string>('')

  const [ageRestriction, setAgeRestriction] = React.useState<boolean>(false)
  const [restrictionAge, setRestrictionAge] = React.useState<any>(null)
  const [availableSelect, setAvailableSelect] = React.useState<any>([])

  const [availableSlot, setAvailableSlot] = React.useState<any>()
  const [msgError, setMsgError] = React.useState<any>()
  const [codeError, setCodeError] = React.useState<any>()

  const [allSlot, setAllSlot] = React.useState<any>([])
  const [trigger, setTrigger] = React.useState<any>(false)

  const {
    formState: { errors },
  } = useForm<Inputs>()

  React.useEffect(() => {
    getallOrders(dataStore.token)
    getClients(dataStore.token)
    getBookingAllSlot(dataStore.token)
  }, [])

  React.useEffect(() => {
   
    if(chosenLocker){
       if(chosenLocker?.length > availableSelect?.length) {
        chosenLocker?.map((locker: any) => 
         availableSelect?.push(locker.available)
        )
       }
    }
   if(qty === 0 || qty === null || qty === undefined || qty === ""){
     setAvailableSelect([])
   }


  }, [qty])

  console.log(availableSelect)

  React.useEffect(() => {
    const bookingLocker: any = allSlot?.['hydra:member']?.map(
      (locker: any) => locker?.slot?.temperatureZone?.locker
    )

    const deduplicate: any = [...new Set(bookingLocker?.map((locker: any) => locker.location))]
    setUniqueTab(deduplicate)
  }, [allSlot])

  React.useEffect(() => {
    _searchWithRegex(clientName, autoCompletTab['hydra:member'], setFilteredName)
  }, [clientName])

  React.useEffect(() => {
    _searchWithRegex2(clientEmail, autoCompletTab['hydra:member'], setFilteredEmail)
  }, [clientEmail])
  React.useEffect(() => {
    _searchWithRegex2(clientPhone, autoCompletTab['hydra:member'], setFilteredPhone)
  }, [clientPhone])

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
    setTempZones([])
    setSlotSizes([])
    setBookingSlotIds([])
  }

  const createNewOrder = () => {
    function entierAleatoire(min: any, max: any) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }
    const multiOrderCode = _strRandom('popopopp').toLocaleUpperCase()
    // const receiveCodeAlt = entierAleatoire(10000000, 99999999)
    const randomCode = _strRandom('popopop').toLocaleUpperCase() + entierAleatoire(1, 9)
    const randomCodeMultiOrder = _strRandom('popopop').toLocaleUpperCase()
    const receiveCode = entierAleatoire(10000000, 99999999)
 

    setIsOrderCreate(true)

    let dataOrder: any =
      parseInt(qty) === 1
        ? {
            service: 'B2C',
            barcode: dataStore.cleveronCompany_id + '-' + randomCode,
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
            products: products?.split(','),
          }
        : Array.from({ length: parseInt(qty) }).map((_, indx) => ({
            service: 'B2C',
            
            barcode: dataStore.cleveronCompany_id + '-' + randomCodeMultiOrder + (indx + 1),

            destination: {
              apm: orderStore?.lockerId,
            },
            // slotSize: slotSizes[indx],
            receiveCode: `${receiveCode}`,

            multiOrder: {
              code: multiOrderCode,
              itemCount: parseInt(qty),
            },
            // extra: {
            //   receiveCodeAlt: receiveCodeAlt,
            //   companyId: orderStore.companyId,
            // },
            // dropOff: {
            //   code: randomCodeMultiOrder + (indx + 1),
            //   type: 'SEND',
            // },
            changesTimestamp: new Date(Date.now()).toISOString(),
            bookingSlot: bookingSlotIds[indx],
            // temperatureZonePredefined: tempZones[indx],
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
            totalSlot: parseInt(qty)/parseInt(qty),
            products: products?.split(','),
          }))

     if(ageRestriction === true){
      if(parseInt(qty) === 1){
        dataOrder.ageRestriction = 18
      }else{
        Array.from({ length: parseInt(qty) }).map((_, indx)=> 
        dataOrder[indx].ageRestriction = 18
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
          setAgeRestriction(false)
          Swal.fire({
            position: 'top-end',
            toast: true,
            icon: 'success',
            title: 'Commande validée',
            text:
            dataStore.cleveronCompany_id +
              '-' +
              randomCode,
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
          setQty('')
          setTrigger(false)
          setChosenLocker([])
          setIsOrderCreate(false)
          setIsValid(false)
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
          console.log(getError(error))
          console.log(error.message)
          console.log(error)
          logCatcher(error.response.statusText)
          setMsgError(getError(error))
          popUpError(error.response.status, error.response.statusText)
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
    console.log(dataOrder)
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
        // timerProgressBar: true,
      })
      newOrderDelete()
      setTempZones([])
      setSlotSizes([])
      setBookingSlotIds([])

      setQty('')
      setTrigger(false)
      setProducts('')
      setClientName('')
      setClientEmail('')
      setChoosedName('')
      setChoosedEmail('')
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
  const _searchWithRegex3 = (searchOrder: any, orderByStatus: any, setFilteredOrder: any) => {
    function escapeRegExp(str: string) {
      return str?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }

    const escapedSearchOrder = escapeRegExp(searchOrder)

    setFilteredOrder(
      orderByStatus?.filter((order: any) => {
        if (escapedSearchOrder?.length > 2) {
          return order?.phone?.match(new RegExp(escapedSearchOrder, 'i'))
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
        null,
        // orderStore.bookingSlot,
        orderStore.companyId,
        orderStore.companyName,
        orderStore.lockerType,
        orderStore.delivererId,
        tempZones,
        null,
        // orderStore.tempZone,
        orderStore.keyTemp,
        null,
        // orderStore.slotSize,
        slotSizes,
        parseInt(qty),
        ageRestriction === true ? 18 : 0
      )
    }
  }

  const filteredLocker = (locker: any) => {
    setChosenLocker(
      allSlot['hydra:member'].filter(
        (slots: any) => slots.slot.temperatureZone.locker.location === locker
      )
    )
  }

  const changeAvailable = (index: any, zone: any, indx: any) => {

     console.log(zone)
    const newData: any = [...availableSelect]
    newData[index] = zone - 1
    setAvailableSelect(newData)
    
  }
  console.log(availableSelect)

  const handleChangeSelect = (e: any, indx: any) => {
    const zone = JSON.parse(e.currentTarget.value)
    
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
      zone.slot.temperatureZone.locker['@id'],
      zone.slot.temperatureZone.locker.location,
      bookingSlotIds,
      zone.company['@id'],
      zone.company.name,
      zone.slot.temperatureZone.locker.type,
      dataStore.id,
      tempZones,
      zone.slot?.temperatureZone?.myKey,
      slotSizes,
      parseInt(qty),
      ageRestriction === true ? 18 : 0
      )
    }
  const imgFilter = (data: any) => {
    const imge =
      data === 'FRESH'
        ? 'organic-food'
        : data === 'FREEZE'
        ? 'winter'
        : data === 'NORMAL'
        ? 'dry'
        : 'nada'
    return imge
  }
console.log(chosenLocker)
  return (
    <div>
      {(!isLogged || !dataStore.token) && <Navigate to='/connexion' />}
      <Container className='my-2'>
        <Container className='px-3 py-0 bg-secondary rounded-pill shadow my-auto '>
          <Row>
            {chosenLocker?.length === 0 ? (
              <>
                <Col xs={2} md={5} lg={5} className='py-0'>
                  <Link
                    to='/in-progress'
                    className='text-decoration-none'
                    onClick={() => {
                      newOrderDelete()
                      setTempZones([])
                      setSlotSizes([])
                      setBookingSlotIds([])
                    }}
                  >
                    <BackButton />
                  </Link>
                </Col>
                <Col className='m-auto text-light text-start pe-4 py-0'>
                  <i className='ri-inbox-fill align-bottom me-2'></i>{' '}
                  <span className='fw-bold'>sélectionnez un locker</span>
                </Col>
              </>
            ) : trigger ? (
              <>
                <Col
                  xs={2}
                  md={5}
                  lg={5}
                  className='py-0'
                  onClick={() => {
                    setTrigger(false)
                    setQty(undefined)
                  }}
                >
                  <BackButton />
                </Col>
                <Col className='m-auto text-light text-start pe-2 py-0'>
                  <i className='ri-temp-cold-line align-bottom me-2'></i>{' '}
                  <span className='fw-bold'>Température & info client</span>
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
                    setChosenLocker([])
                    setProducts('')
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
        {chosenLocker?.length === 0 ? (
          <Container>
            <Row>
              <Col className='border-bottom-3 border-warning px-3 mx-3'></Col>
              <Col className='border-bottom-3 border-secondary px-3 mx-3'></Col>
              <Col className='border-bottom-3 border-secondary px-3 mx-3'></Col>
            </Row>
          </Container>
        ) : !trigger ? (
          <Container>
            <Row>
              <Col className='border-bottom-3 border-info px-3 mx-3'></Col>
              <Col className='border-bottom-3 border-warning px-3 mx-3'></Col>
              <Col className='border-bottom-3 border-secondary px-3 mx-3'></Col>
            </Row>
          </Container>
        ) : (
          trigger && (
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
        <Container className='pb-5 mb-5'>
          {allSlot && allSlot['hydra:member']?.length < 0 ? (
            <div className=' text-center mt-5 pt-5'>
              <img className='' alt='no slot' src={images} style={{ height: '256px' }} />
              <div className='user-name fs-3 fw-bold text-secondary'>Aucune réservation</div>
            </div>
          ) : chosenLocker?.length === 0 ? (
            <div>
              {uniqueTab?.map((locker: any, indx: any) => (
                <Container
                  key={Math.random()}
                  className='text-light py-1 mb-3 border-0 rounded bg-secondary animate__animated'
                  onClick={() => {
                    filteredLocker(locker)
                    setAvailableSlot(locker.available)
                  }}
                >
                  <Row className='px-0'>
                    <Col className='m-auto font-75 ps-1 px-0'>{locker}</Col>
                    <Col xs={5}>
                      <Row>
                        {allSlot?.['hydra:member']
                          ?.filter(
                            (lockers: any) =>
                              lockers?.slot?.temperatureZone?.locker?.location === locker
                          )
                          ?.map((slots: any) => (
                            <>
                              <Col xs={2} className='px-0 ms-2'>
                                <img
                                  alt='Temp icon'
                                  src={
                                    'https://img.icons8.com/color/512/' +
                                    imgFilter(slots?.slot.temperatureZone?.keyTemp) +
                                    '.png'
                                  }
                                  style={{ width: '22px' }}
                                />
                              </Col>
                              <Col xs={1} className='px-0 font-85'>
                                <span className='badge badges2 rounded-pill bg-info border-2 border-secondary'>
                                  {slots.available}
                                </span>
                              </Col>
                            </>
                          ))}
                      </Row>
                    </Col>
                  </Row>
                </Container>
              ))}
            </div>
          ) : !trigger ? (
            <div>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setTrigger(true)
                }}
              >
                <InputGroup>
                  <InputGroup.Text className='border-end-0 bg-secondary-500'>
                    <i className='ri-inbox-archive-line text-secondary'></i>
                  </InputGroup.Text>
                  <Form.Control
                    as='textarea'
                    aria-label='textarea'
                    placeholder='Saisie des produits...'
                    value={products}
                    onChange={(e) => setProducts(e.currentTarget.value)}
                    required
                  />
                </InputGroup>
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
                      min={1}
                      placeholder='Nombre de panier*'
                      value={qty}
                      onChange={(e) => {
                        setQty(e.currentTarget.value)
                      }}
                      required
                    />
                  </InputGroup>
                  <Button
                    className='bg-info rounded-pill border-info text-light'
                    type='submit'
                  >
                    Valider
                  </Button>
                </div>{' '}
              </form>
            </div>
          ) : (
            <div>
              {/* {globalDispo > qty ? ( */}
              <form onSubmit={validOrder}>
                {Array.from({ length: parseInt(qty) }).map((_, indx) => (
                  <Form.Select
                    onChange={(e) => {
                      handleChangeSelect(e, indx)
                    }}
                    aria-label='zone'
                    className='my-2'
                    required
                    key={indx * 10}
                  >
                    <option>Panier n°{indx + 1}</option>
                    {chosenLocker?.map((lockers: any, index: any) => (
                      <option
                        key={index}
                        value={JSON.stringify(lockers)}
                        className={`${
                          lockers?.slot?.temperatureZone?.keyTemp === 'FRESH' ||
                          lockers?.slot.temperatureZone?.myKey === 'C'
                            ? 'bg-success'
                            : lockers?.slot?.temperatureZone.keyTemp === 'FREEZE' ||
                              lockers?.slot.temperatureZone?.myKey === 'F'
                            ? 'bg-info'
                            : (lockers?.slot?.temperatureZone.keyTemp === 'NORMAL' ||
                                lockers?.slot.temperatureZone?.myKey === 'CA') &&
                              'bg-warning'
                        }`}
                        disabled={lockers.available < 1 ? true : false}
                      >
                        {lockers?.slot?.temperatureZone?.keyTemp === 'FRESH' ||
                        lockers?.slot.temperatureZone?.myKey === 'C'
                          ? 'Zone Fraîche'
                          : lockers?.slot?.temperatureZone.keyTemp === 'FREEZE' ||
                            lockers?.slot.temperatureZone?.myKey === 'F'
                          ? 'Zone Congelée'
                          : (lockers?.slot?.temperatureZone.keyTemp === 'NORMAL' ||
                              lockers?.slot.temperatureZone?.myKey === 'CA') &&
                            'Zone Ambiante'}{' '}
                        {/* - {lockers?.slot.size}- {availableSelect[index]}{' '} */}
                        - {lockers?.slot.size}- {lockers?.available}{' '}
                        {lockers.available > 1 ? 'casiers' : 'casier'}
                      </option>
                    ))}
                  </Form.Select>
                ))}
                <InputGroup className='mb-3'>
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
                      id='input-group-dropdown-2'
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
                <InputGroup className='mb-3'>
                  <InputGroup.Text id='basic-addon1' className='border-end-0 bg-secondary-500'>
                    <i className='ri-phone-line text-secondary'></i>
                  </InputGroup.Text>
                  <Form.Control
                    aria-label='Text input with dropdown button'
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
                            setChoosedPhone(user.Phone)
                            setFilteredPhone([])
                          }}
                        >
                          {user.Phone}
                        </Dropdown.Item>
                      ))}
                    </DropdownButton>
                  )}
                </InputGroup>
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
                  Conchez la case, s'il y a des produits alcoolisés dans la commande.
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
              {/* ) : (
                <Alert variant='danger'>
                  <InfoAlert
                    icon='ri-error-warning-line'
                    iconColor='danger'
                    message={
                      'Vous ne pourrez pas finaliser votre commande, vos casiers disponibles ne sont pas suffisant'
                    }
                    fontSize='font-75'
                  />
                </Alert>
              )} */}
            </div>
          )}
        </Container>
      )}
    </div>
  )
}

export default NewOrder
