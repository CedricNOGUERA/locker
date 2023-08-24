import React, {useRef} from 'react'
import { Navigate, useOutletContext } from 'react-router-dom'
import userDataStore from '../store/userDataStore'
import { message } from 'antd'
import { Container } from 'react-bootstrap'
import { _searchWithRegex } from '../utils/functions'
import SearchBar from '../components/ui/SearchBar'
import OrderList from '../components/ui/OrderList'
import ScanPage from '../components/ui/ScanPage'
import AlertIsError from '../components/ui/warning/AlertIsError'
import PlaceHolder from '../components/ui/loading/PlaceHolder'
import '../App.css'
import 'animate.css'
import OrdersService from '../service/Orders/OrdersService'
import { BrowserMultiFormatReader } from '@zxing/library';


const InProgress: React.FC = () => {
  //////////////////////////
  // booleans States
  /////////////////////////
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isError, setIsError] = React.useState<boolean>(false)

  //////////////////////////
  // Store & context state
  /////////////////////////
  const isLogged = userDataStore((state: any) => state.isLogged)
  
  const authLogout = userDataStore((state: any) => state.authLogout)
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
    expireToken, setExpireToken,

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

  const [isScanned, setIsScanned] = React.useState<boolean>(false)


  const videoRef: any = useRef(null);

  const startScan = async () => {
    setIsScanned(true)
    
    try {
      const codeReader = new BrowserMultiFormatReader();
      const constraints = {
        video: {
          facingMode: 'environment', // Utilisation de la caméra arrière
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
      codeReader?.decodeFromVideoDevice(null, videoRef.current, (result: any) => {
        if(result?.text){
          console.log('Code EAN-13 détecté:', result?.text);
          videoRef.current.srcObject = null
          stopScan()
          setIsScanned(false)
        }
        // Faites quelque chose avec le code EAN-13 détecté ici
      });
    } catch (error) {
      console.error('Erreur lors de la configuration de la caméra:', error);
    }
  };

  const stopScan = () => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track: any) => track.stop());
      videoRef.current.srcObject = null;
      setIsScanned(false)
    }
  };


  //////////////////////////
  // UseEffect
  /////////////////////////
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

  const expiredToken = (error: any) => {
    if(!expireToken){
      if(error?.response?.data?.message === 'Expired JWT Token'){
        setExpireToken(true)
        alert('Session expirée, reconnectez-vous.')
        console.log('allOrder_app')
        authLogout()
        return
      }
      if(error?.response?.data?.message === 'Invalid JWT Token'){
        setExpireToken(true)
        alert('Token invalide, reconnectez-vous.')
        authLogout()
        return
      }
    }
    }

  const getallOrders = (token: any) => {
    OrdersService.allOrders(token).then((response: any) => {
      setOrderData(response.data)
     
    }).catch((error: any) => {
      expiredToken(error)
      console.log(error?.response?.data?.message)
    })
  }

  const getOrderByPage = (token: any, page: any) => {
    OrdersService.ordersByPage(token, page)
      .then((response: any) => {
        setIsLoading(false)
        setOrderData(response.data)
      })
      .catch((error: any) => {
        setIsLoading(false)
      })
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
    getOrderByPage,
    storeName
  }

  const scanPageProps = {
    selectedOrder,
    setOrderData,
    messageApi,
    setSelectedOrder,
    newStatus,
    
  }

  return (
    <Container fluid className='cde App px-0'>
      {contextHolder}
      {(!isLogged || !userToken || !dataStore?.company_name) && <Navigate to='connexion' />}

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
         <div>
    <h1>Scanner de codes EAN-13</h1>
    {!isScanned ? (

      <button onClick={startScan}>Démarrer le scan</button>
      ) : (

        <button onClick={stopScan}>Arrêter le scan</button>
      )}
    <video
      ref={videoRef}
      style={{ width: '100%', height: 'auto', border: '1px solid #ccc' }}
      autoPlay
      playsInline
      muted
    ></video>
  </div>
          {/* {!selectedOrder ? (
            <>
              <div className='col-12 pb-0 text-center font-75'>{storeName && storeName[0]?.slot?.temperatureZone?.locker?.location}</div>
              <SearchBar searchBarProps={searchBarProps} />
              <OrderList orderListProps={orderListProps} />
            </>
          ) : (
            <ScanPage scanPageProps={scanPageProps} />
          )} */}
        </>
      )}
    </Container>
  )
}

export default InProgress
