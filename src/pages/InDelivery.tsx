import React, { useRef } from 'react';
import { Navigate, useOutletContext } from 'react-router-dom'
import userDataStore from '../store/userDataStore'
import { message } from 'antd'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { _searchWithRegex } from '../utils/functions'
import SearchBar from '../components/ui/SearchBar'
import AlertIsError from '../components/ui/warning/AlertIsError'
import PlaceHolder from '../components/ui/loading/PlaceHolder'
import '../App.css'
import 'animate.css'
import OrdersService from '../service/Orders/OrdersService'
import OrderList from '../components/ui/OrderList';
import OrderDetail from '../components/ui/OrderDetail';
import jsQR from 'jsqr';
import noOrder from '../styles/astro.png'
import BackButton from '../components/ui/BackButton';
import DeliveryDetail from '../components/ui/DeliveryDetail';




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
  const [isScanning, setIsScanning] = React.useState<boolean>(false)
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanCode, SetScanCode] = React.useState<string>('')

  const [isAnomalie, setIsAnomalie] = React.useState<boolean>(false)
  const [anomalyMsg, setanomalyMsg] = React.useState<any>("")
  const [anomalyMsgSecondary, setAnomalyMsgSecondary] = React.useState<any>("")

  let videoStream: MediaStream | null = null;

  const newStatus = 'operin'

  const orderByStatus = orderData['hydra:member']?.filter(
    (order: any) =>
      order?.status === 'picked_up' &&
      order?.bookingSlot?.slot?.temperatureZone?.locker &&
      order?.bookingSlot?.slot?.temperatureZone?.locker['@id'] === selectedStore
      &&
      order?.shippedBy &&
      order?.shippedBy['@id'] === `/api/users/${dataStore.id}`
  )


  //////////////////////////
  // UseEffect
  /////////////////////////
  React.useEffect(() => {
    if (isScan) {
      const scanInterval = setInterval(() => {
        scanQRCode();
      }, 1500);

      return () => {
        clearInterval(scanInterval);
      };
    }
  }, [isScan]);


  React.useEffect(() => {
    setIsLoading(true)
    setSelectedItem('progress')
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
    _searchWithRegex(searchOrder, orderByStatus, setFilteredOrder)
  }, [searchOrder])

  React.useEffect(() => {
    setStoreName(
      allSlot?.['hydra:member']
        && allSlot?.['hydra:member']?.filter((locker: any)=> 
        
        locker?.slot?.temperatureZone?.locker['@id'] === selectedStore
        )
        
    )
  }, [selectedStore])

  const handleScan = () => {
    setIsAnomalie(false)
    if (videoRef.current) {
      navigator?.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        videoStream = stream
        videoRef.current!.srcObject = stream
        videoRef.current!.play()
        requestAnimationFrame(scanQRCode)
        setIsScan(true)
        })
        .catch((error) => console.error('Error accessing camera:', error));
    }
  };

  const stopScan = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      videoStream = null;
      setIsScan(false)
    }
  };


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
          SetScanCode(code.data)
          if (code.data === '') {
            setIsAnomalie(false)
            setIsScan(false)
          } else {
            const myScan: any = orderData['hydra:member']?.filter(
              (order: any) =>
                order?.barcode === code?.data || order?.id === parseInt(code?.data)
            )
            console.log(myScan)
            if (myScan.length === 0) {
              //commande inexistante
              setIsAnomalie(true)
              setanomalyMsg(_getScanMsg(myScan[0]?.status, ''))
              setSelectedOrder('')
              console.log('object anomalie')
            } else if (
              myScan &&
              myScan[0].bookingSlot?.slot?.temperatureZone?.locker['@id'] !== selectedStore
            ) {
              //commande appartenant à point de dépôt différent de celui sélectionné
              setIsAnomalie(true)
              setanomalyMsg(`Attention, cette commande est pour un autre point de vente!!!  `)
              setAnomalyMsgSecondary(
                `${myScan[0].bookingSlot?.slot?.temperatureZone?.locker?.location}`
              )
              setSelectedOrder('')
            } else if (myScan && myScan[0].status === 'picked_up' && !myScan[0]?.shippedBy) {
              //Aucun livreur assigné
              setIsAnomalie(true)
              setanomalyMsg(_getScanMsg(myScan[0]?.status, ''))
              setSelectedOrder('')
            } else if (
              myScan &&
              myScan[0].status === 'picked_up' &&
              myScan[0]?.shippedBy &&
              myScan[0]?.shippedBy['@id'] !== `/api/users/${dataStore.id}`
            ) {
              //commande assignée à un autre livreur
              setIsAnomalie(true)
              setanomalyMsg(
                _getScanMsg(
                  myScan[0]?.status,
                  `${myScan[0]?.shippedBy?.firstName} ${myScan[0]?.shippedBy?.lastName}`
                )
              )
              setSelectedOrder('')
            } else {
              //ok
              setIsAnomalie(false)
              setSelectedOrder(myScan[0])
            }
          }
          stopScan()
        }
      }
      requestAnimationFrame(scanQRCode)
    }
  }

  const _getScanMsg = (status: any, msg: any) => {
    if (status === 'created') {
      return "Cette commande est toujours en préparation"
    }
    else if (status === 'ready_for_delivery') {
      return "Cette commande sensée être sur le quai de livraison"
    }
    else if (status === 'picked_up') {
        if(msg !== ""){
            return `Cette commande est prise en charge par ${msg}`
        } else{
            return `Cette commande n'est assignée à aucun livreur`
        } 
    }
    else if (status === 'operin') {
      return `Cette commande a déjà été déposée par ${msg}`
    } else if (status === 'reminder') {
      return "Cette commande en 1er Rappel"
    } else if (status === 'overtimedue') {
      return "Cette commande est en 2è Rappel"
    } else if (status === 'overtime') {
      return "Cette commande est expirée"
    } else if (status === 'operout') {
      return `Cette commande a été sortie par le coursier ${{msg}}`
    } else if (status === 'receive') {
      return "Cette commande a été récupérée le client"
    } else if (status === 'left_for_customer_service') {
      return "Cette commande a été déposée au service client"
    } else if (status === 'return') {
      return "Retour???"
    } else{
      return "Cette commande n'existe pas"
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
  }



  return (
    <>
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
            {isAnomalie ? (
              <Container fluid className='pb-5'>
                <Container className='my-2 px-0'>
                  <Container className='py-0 bg-secondary rounded-pill shadow my-auto mt-3'>
                    <Row>
                      <Col
                        xs={2}
                        md={5}
                        lg={5}
                        className='m-auto py-0'
                        onClick={() => setIsAnomalie(false)}
                      >
                        <BackButton />
                      </Col>
                      <Col className='m-auto text-light text-center ps-1 pe-2 py-0'>
                        <span className='fw-bold font-85'>{scanCode}</span>
                      </Col>
                      <Col
                        xs={2}
                        md={5}
                        lg={5}
                        className='m-auto text-light text-start ps-1 pe-2 py-0'
                      >
                        <i className='ri-question-line text-warning fs-3 bg-secondary rounded-pill'></i>
                      </Col>
                    </Row>
                  </Container>

                  <Container className='text-center mt-3'>
                    <p>Une anomalie est survenue...</p>
                    <p>
                      <b>{anomalyMsg}</b>
                    </p>
                    <p>{anomalyMsgSecondary}</p>
                    <img src={noOrder} alt='no-order' style={{ height: '256px' }} />
                    <p className='mt-3'>
                      Réessayez le scan ou recherchez d'où vient l'anomalie
                    </p>
                  </Container>
                </Container>
              </Container>
            ) : !selectedOrder ? (
              <>
                <div className='col-12 pb-0 text-center font-75'>
                  {storeName && storeName[0]?.slot?.temperatureZone?.locker?.location}
                </div>
                <SearchBar searchBarProps={searchBarProps} />
                <OrderList orderListProps={orderListProps} />
              </>
            ) : (
              <DeliveryDetail scanPageProps={scanPageProps} />
            )}
          </>
        )}
      </Container>
      {isScan && (
        <div
          style={{
            width: '100%',
            height: 'auto',
            position: 'fixed',
            bottom: '125px',
            zIndex: 500,
          }}
        >
          <video ref={videoRef} />
        </div>
      )}
      <div className='fab2'>
        {isScan && (
          <Button
            size='sm'
            className='rounded-pill border-0 bg-warning'
            onClick={() => {
              stopScan()
            }}
          >
            Stop
          </Button>
        )}
      </div>
      {(!selectedOrder) && (
          <Button
          className='fab rounded-circle bg-info border-0'
          onClick={() => {
            handleScan()
            setIsScanning(true)
            setIsScan(true)
          }}
          style={{ width: 55, height: 55 }}
          >
          <i className='ri-qr-code-line text-light align-bottom fs-2'></i>
        </Button>
      )}
    </>
  )
}

export default InDelivery
