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
import OrderDetail from '../components/ui/OrderDetail'
import jsQR from 'jsqr'
import noOrder from '../styles/astro.png'
import BackButton from '../components/ui/BackButton'

const Prepared: React.FC = () => {
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
    setOrderPickedUp
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
  let videoRef = useRef<any>(null)
  const [scanCode, setScanCode] = React.useState<string>('')

  const [isAnomaly, setIsAnomaly] = React.useState<boolean>(false)
  const [msgAnomaly, setMsgAnomaly] = React.useState<any>('')
  
  const inputRef: any = useRef(null) //input de recherche
  const inputRefSearch: any = useRef(null) //input de recherche
  const [isFocus, setIsFocus] = React.useState<boolean>(false)

  let videoStream: MediaStream | null = null

  const trigger = 'preparations'
  const newStatus = 'picked_up'

  const orderByStatus = orderReady['hydra:member']?.filter(
    (order: any) =>
      order?.bookingSlot?.slot?.temperatureZone?.locker &&
      order?.bookingSlot?.slot?.temperatureZone?.locker['@id'] === selectedStore
  )

  //////////////////////////
  // UseEffect
  /////////////////////////

  React.useEffect(() => {
    setIsLoading(true)
    setSelectedItem('preparations')
    handleButtonClick()
  
    
  }, [])
  

console.log(isFocus)

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
    const myScan = orderReady['hydra:member']?.filter(
      (order: any) => order?.barcode === searchOrder || order?.externalOrderId === searchOrder
    )[0]
    console.log(myScan)
    if (myScan) {
      setScanCode(searchOrder)
      if (myScan?.status === 'picked_up') {
        if (!myScan.shippedBy) {
          setIsAnomaly(true)
          setMsgAnomaly(
            'Cette commande n\'est assignée à aucun livreur mais son statuts est "En livraison".'
          )
          setSelectedOrder(myScan)
        } else if (myScan.shippedBy.firstName === dataStore?.firstname) {
          setIsAnomaly(true)
          setMsgAnomaly(
            'Vous avez déjà prise en charge cette commande, vérifier la liste des commandes à livrer.'
          )
          setSelectedOrder(myScan)
        } else {
          setIsAnomaly(true)
          setMsgAnomaly(
            'Cette commande est déjà prise en charge par ' + myScan?.shippedBy.firstName
          )
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
          //OK
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
      console.log('object')
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
      // handleButtonClick()
    }
  }, [selectedOrder])

  React.useEffect(() => {
    if(isFocus === false){
      setInterval(handleButtonClick, 2000)
    }else{
      handleFocusSearch()
    }
  }, [isFocus])
  // React.useEffect(() => {
  //     const scannerr = new scanner(); // Remplacez ceci par le code approprié pour initialiser le scanner
  
  //     scannerr.on('scan', (barcode: any) => {
  //       // Faire quelque chose avec le barcode scanné, par exemple l'afficher dans un champ de texte
  //       inputRefSearch.value = barcode;
  //     });
  
  //     return () => {
  //       scannerr.off('scan');
  //     };
  //   }, []);
  
  
  
  const handleButtonClick = () => {
    // Focus on the input element when the button is clicked
    inputRef?.current?.focus()
  }
  const handleFocusSearch = () => {
    // Focus on the input element when the button is clicked
    inputRefSearch?.current?.focus()
  }
  // if(!isFocus){
  //   setInterval(handleButtonClick, 2000)
  // }

  const handleScan = async () => {
    setIsAnomaly(false)
    if (navigator?.mediaDevices) {
      setIsScan(true)

      console.log(videoStream)
      try {
        const stream = await navigator?.mediaDevices?.getUserMedia({
          video: { facingMode: 'environment' },
        })
        videoStream = stream
        videoRef.current.srcObject = stream
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
    videoStream?.getTracks()?.forEach((track: any) => track.stop())
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
            stopScan()
          } else {
            const myScan = orderData['hydra:member']?.filter(
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
                } else if (myScan.shippedBy.firstName === dataStore?.firstname) {
                  setIsAnomaly(true)
                  setMsgAnomaly(
                    'Vous avez déjà prise en charge cette commande, vérifier la liste des commandes à livrer.'
                  )
                  setSelectedOrder(myScan)
                } else {
                  setIsAnomaly(true)
                  setMsgAnomaly(
                    'Cette commande est déjà prise en charge par ' +
                      myScan?.shippedBy.firstName
                  )
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
                  //OK
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
    inputRef,
    inputRefSearch,
    handleButtonClick,
    setIsFocus,
    isScan,
  }

  const orderListProps = {
    filteredOrder,
    setSelectedOrder,
    searchOrder,
    setSearchOrder,
    orderByStatus,
    orderData,
    storeName,
    trigger,
  }

  const scanPageProps = {
    selectedOrder,
    setOrderData,
    messageApi,
    setSelectedOrder,
    newStatus,
    handleButtonClick,
    setOrderReady,
    setOrderPickedUp,
    setSearchOrder
  }

  console.log(selectedOrder)

  return (
    <>
      {!selectedOrder && !isAnomaly && (
        <>{allSlot?.['hydra:member']?.length > 0 && (

          <div className='col-12 pb-0 text-center font-75'>
            {storeName && storeName[0]?.slot?.temperatureZone?.locker?.location}
          </div>
            )}
          <div className={`${!isScan ? 'sticky-top pt-2 bg-light ' : 'd-none'}`} >
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
                          handleButtonClick()
                          
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
              <OrderDetail scanPageProps={scanPageProps} />
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
              isScan ? 'close-line' : 'qr-code-line'
            } text-light align-bottom fs-2`}
          ></i>
        </Button>
      )}
    </>
  )
}

export default Prepared
