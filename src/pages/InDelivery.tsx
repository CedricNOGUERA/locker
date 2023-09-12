import React, { useRef } from 'react'
import { Navigate, useOutletContext } from 'react-router-dom'
import userDataStore from '../store/userDataStore'
import { message } from 'antd'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { _getStatus, _searchWithRegex } from '../utils/functions'
import SearchBar from '../components/ui/SearchBar'
import AlertIsError from '../components/ui/warning/AlertIsError'
import PlaceHolder from '../components/ui/loading/PlaceHolder'
import '../App.css'
import 'animate.css'
import OrderList from '../components/ui/OrderList'
import jsQR from 'jsqr'
import noOrder from '../styles/astro.png'
import BackButton from '../components/ui/BackButton'
import DeliveryDetail from '../components/ui/DeliveryDetail'

const InDelivery: React.FC = () => {
  //////////////////////////
  // booleans States
  /////////////////////////
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isError, setIsError] = React.useState<boolean>(false)

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

  ] = useOutletContext<any>()
  const userToken = localStorage.getItem('user')

  //////////////////////////
  // States
  /////////////////////////

  const [messageApi, contextHolder] = message.useMessage()

  const [selectedOrder, setSelectedOrder] = React.useState<any>('')
  const [searchOrder, setSearchOrder] = React.useState<any>('')
  const [filteredOrder, setFilteredOrder] = React.useState<any>([])
  const [storeName, setStoreName] = React.useState<any>([])

  const [isScan, setIsScan] = React.useState<boolean>(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [scanCode, setScanCode] = React.useState<string>('')

  const [isAnomaly, setIsAnomaly] = React.useState<boolean>(false)
  const [msgAnomaly, setMsgAnomaly] = React.useState<any>('')

  let videoStream: MediaStream | null = null

  const newStatus = 'operin'

///////////////////////////////////////////////////
////Filtrage des données par locker et par livreur
//////////////////////////////////////////////////
  const orderByStatus = orderPickedUp['hydra:member']?.filter(
    (order: any) =>
      order?.bookingSlot?.slot?.temperatureZone?.locker &&
      order?.bookingSlot?.slot?.temperatureZone?.locker['@id'] === selectedStore &&
      order?.shippedBy &&
      order?.shippedBy['@id'] === `/api/users/${dataStore.id}`
  )


  //////////////////////////
  // UseEffect
  /////////////////////////

  React.useEffect(() => {
    setIsLoading(true)
    setSelectedItem('progress')
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [])

  React.useEffect(() => {
    if (orderByStatus && orderData && orderData['hydra:member']?.length > 0) {
      setIsLoading(false)
    } else {
      if (orderData && orderData['hydra:member']?.length < 0) {
        setIsError(true)
        setIsLoading(false)
      }
      setIsLoading(false)
    }
  }, [orderData])

  React.useEffect(() => {
    const myScan = orderPickedUp['hydra:member']?.filter(
      (order: any) => order?.barcode === searchOrder || order?.externalOrderId === searchOrder
    )[0]
   
    if (myScan) {
      setScanCode(searchOrder)
      if (myScan?.status === 'picked_up') {
        if (!myScan.shippedBy) {
          setIsAnomaly(true)
          setMsgAnomaly(
            'Cette commande n\'est assignée à aucun livreur mais son statuts est "En livraison".'
          )
          setSelectedOrder(myScan)
        } else if (myScan.shippedBy.firstName !== dataStore?.firstname) {
          setIsAnomaly(true)
          setMsgAnomaly(
            'Cette commande est déjà prise en charge par ' + myScan?.shippedBy.firstName
          )
          setSelectedOrder(myScan)
        } else if (
          myScan.bookingSlot?.slot?.temperatureZone?.locker &&
          myScan.bookingSlot?.slot?.temperatureZone?.locker['@id'] !== selectedStore
        ) {
          setIsAnomaly(true)
          setMsgAnomaly(
            'Commande pour : ' + myScan?.bookingSlot?.slot?.temperatureZone?.locker?.location
          )
          setSelectedOrder(myScan)
        } else {
          //OK
          setSelectedOrder(myScan)
        }
      } else if (myScan?.status === 'created') {
        setIsAnomaly(true)
        setMsgAnomaly('Cette commande est en cours de préparation')
        setSelectedOrder(myScan)
      } else if (myScan?.status === 'ready_for_delivery') {
        if (
          myScan.bookingSlot?.slot?.temperatureZone?.locker &&
          myScan.bookingSlot?.slot?.temperatureZone?.locker['@id'] !== selectedStore
        ) {
          setIsAnomaly(true)
          setMsgAnomaly(
            'Commande pour : ' + myScan?.bookingSlot?.slot?.temperatureZone?.locker?.location
          )
          setSelectedOrder(myScan)
        } else {
          setIsAnomaly(true)
          setMsgAnomaly('Cette commande est sur le quai des livraisons')
          setSelectedOrder(myScan)
        }
      } else if (
        myScan?.status === 'operin' ||
        myScan?.status === 'reminder' ||
        myScan?.status === 'overtimedue' ||
        myScan?.status === 'overtime'
      ) {
        setIsAnomaly(true)
        setMsgAnomaly(
          'Cette commande est en status : ' +
            _getStatus(myScan?.status) +
            ", consultez l'historique. Code barre : " +
            myScan?.barcode
        )
        setSelectedOrder(myScan)
      }
    } else {
      //no exist
      _searchWithRegex(searchOrder, orderByStatus, setFilteredOrder)
    }
  }, [searchOrder])

  React.useEffect(() => {
    setStoreName(
      allSlot?.['hydra:member'] &&
        allSlot?.['hydra:member']?.filter(
          (locker: any) => locker?.slot?.temperatureZone?.locker['@id'] === selectedStore
        )
    )
  }, [selectedStore])

  React.useEffect(() => {
    if (selectedOrder === '') {
    }
  }, [selectedOrder])
  
 

  const handleScan = async () => {
    setIsAnomaly(false)
    if (navigator?.mediaDevices) {
      console.log(navigator?.mediaDevices)
      setIsScan(true)

      console.log(videoStream)
      try {
        const stream = await navigator?.mediaDevices?.getUserMedia({
          video: { facingMode: 'environment' },
        })
        videoStream = stream
        videoRef.current!.srcObject = stream
        console.log(videoRef.current!.srcObject)
        await videoRef.current!.play() // Attendre la lecture vidéo
        requestAnimationFrame(scanQRCode)
        setIsScan(true)
        console.log('success')
      } catch (error) {
        console.error('Error accessing camera:', error)
      }
    }
  }

  const stopScan = () => {
    videoStream?.getTracks().forEach((track) => track.stop())
    videoStream = null
    setIsScan(false)
  }

  const scanQRCode = () => {
    if (
      videoRef.current &&
      videoStream &&
      videoRef.current.videoWidth &&
      videoRef.current.videoHeight
    ) {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)

      const imageData = context?.getImageData(0, 0, canvas.width, canvas.height)
      if (imageData) {
        const code = jsQR(imageData.data, imageData.width, imageData.height)

        if (code) {
          console.log('QR Code detected:', code.data)
          setScanCode(code.data)
          if (code.data === '') {
            setIsAnomaly(false)
            setIsScan(false)
          } else {
            const myScan: any = orderData['hydra:member']?.filter(
              (order: any) =>
                order?.barcode === code?.data || order?.externalOrderId === code?.data
            )[0]

            if (myScan) {
              if (myScan?.status === 'picked_up') {
                if (!myScan.shippedBy) {
                  setIsAnomaly(true)
                  setMsgAnomaly(
                    'Cette commande n\'est assignée à aucun livreur mais son statuts est "En livraison".'
                  )
                  setSelectedOrder(myScan)
                } else if (myScan.shippedBy.firstName !== dataStore?.firstname) {
                  setIsAnomaly(true)
                  setMsgAnomaly(
                    'Cette commande est déjà prise en charge par ' +
                      myScan?.shippedBy.firstName
                  )
                  setSelectedOrder(myScan)
                } else if (
                  myScan.bookingSlot?.slot?.temperatureZone?.locker &&
                  myScan.bookingSlot?.slot?.temperatureZone?.locker['@id'] !== selectedStore
                ) {
                  setIsAnomaly(true)
                  setMsgAnomaly(
                    'Commande pour : ' +
                      myScan?.bookingSlot?.slot?.temperatureZone?.locker?.location
                  )
                  setSelectedOrder(myScan)
                } else {
                  //OK
                  setSelectedOrder(myScan)
                }
              } else if (myScan?.status === 'created') {
                setIsAnomaly(true)
                setMsgAnomaly('Cette commande est en cours de préparation')
                setSelectedOrder(myScan)
              } else if (myScan?.status === 'ready_for_delivery') {
                if (
                  myScan.bookingSlot?.slot?.temperatureZone?.locker &&
                  myScan.bookingSlot?.slot?.temperatureZone?.locker['@id'] !== selectedStore
                ) {
                  setIsAnomaly(true)
                  setMsgAnomaly(
                    'Commande pour : ' +
                      myScan?.bookingSlot?.slot?.temperatureZone?.locker?.location
                  )
                  setSelectedOrder(myScan)
                } else {
                  setIsAnomaly(true)
                  setMsgAnomaly('Cette commande est sur le quai des livraisons')
                  setSelectedOrder(myScan)
                }
              } else if (
                myScan?.status === 'operin' ||
                myScan?.status === 'reminder' ||
                myScan?.status === 'overtimedue' ||
                myScan?.status === 'overtime'
              ) {
                setIsAnomaly(true)
                setMsgAnomaly(
                  'Cette commande est en status : ' +
                    _getStatus(myScan?.status) +
                    ", consultez l'historique. Code barre : " +
                    myScan?.barcode
                )
                setSelectedOrder(myScan)
              }
            } else {
              //no exist
              setMsgAnomaly("Cette commande n'existe pas.")
              setIsAnomaly(true)
            }
          }
          stopScan()
        }
      }
      requestAnimationFrame(scanQRCode)
    }
  }

  //////////////////////////
  // Component Props
  /////////////////////////
  const searchBarProps = {
    searchOrder,
    setSearchOrder,
    selectedStore,
    setSelectedStore,
    selectedOrderCity,
    setSelectedOrderCity,
    allSlot,
    
  }

  const orderListProps = {
    filteredOrder,
    setSelectedOrder,
    searchOrder,
    setSearchOrder,
    orderByStatus,
    orderData,
    storeName,
  }

  const scanPageProps = {
    selectedOrder,
    setOrderData,
    messageApi,
    setSelectedOrder,
    newStatus,
    setOrderPickedUp,
    setSearchOrder,

  }
  console.log(selectedOrder)

  return (
    <>
      {!selectedOrder && !isAnomaly && (
        <>
          <div className='col-12 pb-0 text-center font-75 '>
            {storeName && storeName[0]?.slot?.temperatureZone?.locker?.location}
          </div>
          <div className={`${!isScan ? 'sticky-top pt-2 ' : 'd-none'}`}
          style={{backgroundColor : '#fff'}}
          >
            <SearchBar searchBarProps={searchBarProps} />
          </div>
        </>
      )}
      <Container fluid className='cde App px-0'>
        {contextHolder}
        {(!isLogged || !userToken || !dataStore?.company_name) && <Navigate to='/connexion' />}

        {isError ? (
          <Container className='text-center mt-5'>
            <AlertIsError
              title="Une erreur s'est produite"
              msg='Vérifiez votre connexion internet ou contactez votre administrateur.'
              colorIcon='danger'
            />
          </Container>
        ) : isLoading ? (
          <Container className='text-center mt-2'>
            <PlaceHolder paddingYFirst='3' />
          </Container>
        ) : (
          <>
            {isAnomaly ? (
              <Container fluid className='pb-5'>
                <div className='col-12 pb-0 text-center font-75'>
                  {storeName && storeName[0]?.slot?.temperatureZone?.locker?.location}
                </div>
                <Container className='my-2 px-0'>
                  <Container className='py-0 bg-secondary rounded-pill shadow my-auto mt-3'>
                    <Row>
                      <Col
                        xs={2}
                        md={2}
                        lg={2}
                        className='m-auto py-0'
                        onClick={() => {
                          setSelectedOrder('')
                          setIsAnomaly(false)
                        }}
                      >
                        <BackButton />
                      </Col>
                      <Col className='m-auto text-light text-center ps-1 pe-2 py-0'>
                        <span className='fw-bold font-85'>
                          {selectedOrder ? scanCode : 'Une anomalie est survenu'}
                        </span>
                      </Col>
                      <Col
                        xs={2}
                        md={2}
                        lg={2}
                        className='m-auto text-light text-end ps-1 pe-2 py-0'
                      >
                        <i className='ri-question-line text-warning fs-3 bg-secondary rounded-pill'></i>
                      </Col>
                    </Row>
                  </Container>

                  <Container className='text-center mt-3'>
                    <p>{selectedOrder && 'Une anomalie est survenue ...'}</p>
                    <p className='font-85'>
                      <b>{msgAnomaly}</b>
                    </p>
                    <img src={noOrder} alt='no-order' style={{ height: '256px' }} />
                    <p className='mt-3'>
                      Réessayez le scan ou recherchez d'où vient l'anomalie
                    </p>
                  </Container>
                </Container>
              </Container>
            ) : !selectedOrder ? (
                <OrderList orderListProps={orderListProps} />
            ) : (
              <DeliveryDetail scanPageProps={scanPageProps} />
            )}
          </>
        )}
      </Container>
      {isScan && (
        <div className='video-container text-center'>
          <video ref={videoRef} />
        </div>
      )}
      {!selectedOrder && (
        <Button
          aria-label='Aria Scan'
          title='scan'
          className={`fab rounded-circle ${isScan ? 'bg-warning' : 'bg-info'} border-0`}
          onClick={() => {
            if (isScan) {
              stopScan()
            } else {
              handleScan()
              setIsScan(true)
            }
          }}
          style={{ width: 55, height: 55 }}
        >
          <i
            className={`ri-${
              isScan ? 'close-line' : 'qr-scan-2-line'
            } text-light align-bottom fs-2`}
          ></i>
        </Button>
      )}
    </>
  )
}

export default InDelivery
