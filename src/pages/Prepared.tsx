import React, { useRef, useEffect, useState } from 'react';
import { Navigate, useOutletContext } from 'react-router-dom'
import userDataStore from '../store/userDataStore'
import { message } from 'antd'
import { Container } from 'react-bootstrap'
import { _searchWithRegex } from '../utils/functions'
import SearchBar from '../components/ui/SearchBar'
import AlertIsError from '../components/ui/warning/AlertIsError'
import PlaceHolder from '../components/ui/loading/PlaceHolder'
import '../App.css'
import 'animate.css'
import OrdersService from '../service/Orders/OrdersService'
import ScanBl from '../components/ui/ScanBl'
import OrderList from '../components/ui/OrderList';
import OrderDetail from '../components/ui/OrderDetail';
//@ts-ignore
import QrCodeReader from 'qrcode-reader';
type QRCodeType = "text" | "url" | "email" | "phone" | "contact" | "unknown";




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

  const videoRef = useRef<HTMLVideoElement>(null);
  const [scannedData, setScannedData] = React.useState<string>("");
  const [scannedType, setScannedType] = React.useState<QRCodeType>("unknown");
  const [cameraStarted, setCameraStarted] = React.useState<boolean>(false);


  const trigger ="preparations"

  // const newStatus = ' '
  const newStatus = 'picked_delivery'

  const orderByStatus = orderData['hydra:member']?.filter(
    (order: any) =>
      // order?.status === 'created' &&
      order?.status === 'ready_for_delivery' &&
      order?.bookingSlot?.slot?.temperatureZone?.locker['@id'] === selectedStore


  )

  console.log(orderByStatus)




  //////////////////////////
  // UseEffect
  /////////////////////////

  useEffect(() => {
    if (cameraStarted && videoRef.current) {
      // const qrCodeDetector = new (window as any).QRCodeDetector();
      const scanInterval = setInterval(() => {
        scanQrCode();
      }, 1000);

      return () => {
        clearInterval(scanInterval);
      };
    }
  }, [cameraStarted]);



  React.useEffect(() => {
    setIsLoading(true)
    setSelectedItem('preparations')
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

  const startCamera = () => {
    if (!cameraStarted && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
          videoRef.current!.srcObject = stream;
          videoRef.current!.play();
          setCameraStarted(true);
        })
        .catch(error => console.error('Error accessing camera: ', error));
    }
  };


  const scanQrCode = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
  
    if (videoRef.current && context) {
      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;
  
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
  
      const imageData = context.getImageData(0, 0, videoWidth, videoHeight);
  
      const qrCodeReader = new QrCodeReader();
      if(qrCodeReader){

        qrCodeReader?.decode(imageData)
        .then((result: any) => {
          if (result && result?.result) {
            setScannedData(result?.result);
          } else {
            setScannedData("");
          }
        })
        .catch((error: any) => {
          console.error('Error detecting QR code: ', error);
          setScannedData("");
        });
      }
    }
  };






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
    storeName,
    trigger
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
          {!selectedOrder ? (
            <>
              <div className='col-12 pb-0 text-center font-75'>
                {storeName && storeName[0]?.slot?.temperatureZone?.locker?.location}
              </div>
              <SearchBar searchBarProps={searchBarProps} />
              <OrderList orderListProps={orderListProps} />
              <video ref={videoRef} style={{ width: "100%", maxWidth: 400 }} />
      {!cameraStarted && <button onClick={startCamera}>Démarrer la caméra</button>}
      {scannedData && <div>
        <p>Type: {scannedType}</p>
        <p>Data: {scannedData}</p>
      </div>}
            </>
          ) : (
            <OrderDetail scanPageProps={scanPageProps} />
          )}


        </>
      )}
    </Container>
  )
}

export default Prepared
