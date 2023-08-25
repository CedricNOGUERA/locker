import {
  Card,
  Form,
  Container,
  Alert,
  InputGroup,
  Modal,
  Button,
} from 'react-bootstrap'
import axios from 'axios'
import { Navigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import userDataStore from '../../store/userDataStore'
import React, { useEffect, useRef, useState } from 'react'
import Loading from '../../components/ui/Loading'
import '../../App.css'
import AuthService from '../../service/Auth/AuthService'
import UserService from '../../service/UserService'
import InfoAlert from '../../components/ui/warning/InfoAlert'
import Swal from 'sweetalert2'
import { _strRandom } from '../../utils/functions'
import AuthForm from '../../components/ui/auth/AuthForm'
import useWebInstallPrompt from '../../hooks/useWebInstallPrompt';
import PwaInstallModal from '../../components/ui/modals/PwaInstallModal'
// @ts-ignore
import PWAPrompt from 'react-ios-pwa-prompt'

type Inputs = {
  userName: string
  pass: string
}

const Auth = () => {
  ////////////////////
  //form States
  ///////////////////
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()
  const form: any = useRef()

  const API_URL = process.env.REACT_APP_END_POINT

  ////////////////////
  //States
  ///////////////////
  const authLogin = userDataStore((state: any) => state.authLogin)
  const dataStore = userDataStore((state: any) => state)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [isView, setIsView] = useState<boolean>(false)
  const [msgError, setMsgError] = useState<string>('')
  const [codeError, setCodeError] = useState<string>('')

  const [token, setToken] = useState<any>([])
  const [myData, setMyData] = useState<any>([])
  
  ////////////////////
  //Forgot pass States
  ///////////////////
  const [isNotEmail, setIsNotEmail] = useState<boolean>(false)
  const [myEmail, setMyEmail] = useState<any>('')
  

   ////////////////////
  //Forgot modal states
  ///////////////////
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const myToken = _strRandom('popopopopop').toLocaleUpperCase()

  const [showModal, setShowModal] = React.useState<boolean>(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  
  const isAndroid = /Android/i.test(navigator.userAgent);

  const [webInstallPrompt, handleWebInstallDeclined, handleWebInstallAccepted] = useWebInstallPrompt();
 
  const [isOnline, setIsOnline] = React.useState(window.navigator.onLine);

  const handleOnline = () => {
    setIsOnline(true);
  };

  const handleOffline = () => {
    setIsOnline(false);
    alert('Connexion perdue, reconnectez-vous')
  };

  React.useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
 
 
 
  ////////////////////
  //UseEffect
  ///////////////////

console.log(myData.roles)

  React.useEffect(() => {
    const handleBeforeInstallPrompt: any = (event:any) => {
      event.preventDefault();
      if (event?.displayMode !== 'browser') {
        if ( isAndroid) {
        handleShowModal()
          }
        }
      };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

   useEffect(() => {
    if (token && token?.length > 0) {
      getMyData(token)
    }
  }, [token])

  React.useEffect(() => {
      authLogin(
        true,
        myData.id,
        myData.firstName,
        myData?.memberOf ? myData?.memberOf[0]?.id : null,
        myData?.memberOf ? myData?.memberOf[0]?.cleveronCompanyId : null,
        myData?.memberOf ? myData?.memberOf[0]?.name : null,
        token,
        null,
        myData.apmAccessCode,
        myData.roles,

      )
      handleClearCache()
    
  }, [authLogin, myData, token])
  
  useEffect(() => {
    if (myEmail) {
      setIsNotEmail(false)
    }
  }, [myEmail])
  
   ////////////////////
  //events
  ///////////////////

      /////
      //Fonction qui vide le cache
      ////
    const handleClearCache = () => {
      if ('caches' in window) {
        // Vider le cache du navigateur
        caches.keys().then(cacheNames => {
          cacheNames.forEach(cacheName => {
            caches.delete(cacheName);
          });
          console.log('Le cache a été vidé avec succès.');
        });
      } else {
        console.log('Impossible de vider le cache. Votre navigateur ne prend pas en charge cette fonctionnalité.');
      }
    };
  

  
  if (dataStore.company_name === undefined) {
    setIsError(true)
    setMsgError("Vous n'êtes affilié à aucune companie, contacté votre adminitrateur")
  }

  const getMsgError = (msg: any) => {
    if(msg === 'Invalid credentials.'){
      setMsgError("Vos données sont érronées, réessayez.")
    } else if(msg === 'Internal error server'){
      setMsgError("Erreur interne du serveur, réessayez de vous connecter")
    }
  }



  const signUp: SubmitHandler<Inputs> = (dataz: any, e: any) => {
    e.preventDefault()
    setIsError(false)
    AuthService.login(
      dataz.userName,
      dataz.pass,
      setToken,
      setMsgError,
      setIsError,
      setIsLoadingAuth,
      setCodeError,
      getMsgError
    )

    setIsLoading(false)
  }

  const getMyData = (token: any) => {
    UserService.me(token).then((response: any) => {
      setMyData(response.data)
    })
   
  }

  const forgot = (e: any) => {
    e.preventDefault()

    if (!myEmail) {
      setIsNotEmail(true)
    } else {
     
      let data = JSON.stringify({
        email: myEmail,
      })

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: API_URL + 'forgot-password',
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      }

      axios
        .request(config)
        .then((response: any) => {
          console.log((response.data.token))
          authLogin(false, null, null, null, null, null, null, response.data.token, null)

          Swal.fire({
            position: 'top-end',
            toast: true,
            icon: 'success',
            title: 'Email de réinitilisation',
            text: 'Envoi en cours',
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
          })

        })
          .catch((error: any) => {
            console.log(error)
        })

      handleClose()
      setMyEmail('')
    }
  }

  const formProps = {handleSubmit, register, errors, signUp, isView, setIsView, handleShow, isError, codeError, msgError, isLoadingAuth}

  const pwaInstallModalProps = { showModal, handleCloseModal, webInstallPrompt, handleWebInstallDeclined, handleWebInstallAccepted}

  return (
    <Container fluid className='auth-cont-sup px-0 py-0'>
      <PwaInstallModal pwaInstallModalProps={pwaInstallModalProps} />
      <PWAPrompt
        promptOnVisit={1}
        timesToShow={3}
        copyClosePrompt='Close'
        permanentlyHideOnDismiss={false}
      />
      <Container fluid className='auth-cont col-12 col-md-12 col-lg-6 px-0 bg-secondary'>
        {dataStore.token && dataStore.company_name && <Navigate to='/preparations' />}
        {isLoading ? (
          <Loading variant='info' />
        ) : (
          <Card className='auth-form  bg-secondary shadow animate__animated animate__fadeIn rounded-0 border-0 vh-100'>
            <Card.Body className=''>
              <div className='logo-app text-center text-light animate__animated animate__rotateIn'></div>
              <div
               className='teko text-center mb-5 text-light animate__animated animate__fadeInUp'>

                OVER BOX
              </div>
              <AuthForm formProps={formProps} />
            </Card.Body>
          </Card>
           
        )}
        <Modal show={show} onHide={handleClose} centered className='rounded-0'>
          <Modal.Header className='border-bottom-0'>
            <Modal.Title>Mot de passe oublié</Modal.Title>
          </Modal.Header>
          <Form ref={form} onSubmit={forgot}>
            <Modal.Body>
              <input type='hidden' name='my_token' value={myToken} />
              <Form.Group className='mb-3' controlId='formBasicEmail'>
                <Form.Label className='d-none'>email</Form.Label>
                <InputGroup className='mb-3'>
                  <InputGroup.Text id='basic-addon1' className='rounded-0 border'>
                    <i className='ri-at-line text-muted'></i>
                  </InputGroup.Text>
                  <Form.Control
                    className=' rounded-0 border'
                    type='email'
                    name='user_email'
                    placeholder='email'
                    value={myEmail}
                    onChange={(e) => setMyEmail(e.currentTarget.value)}
                  />
                </InputGroup>
                {isNotEmail && (
                  <Alert variant='danger' className='mt-2 py-0 text-cente'>
                    <InfoAlert
                      icon='ri-error-warning-line'
                      iconColor='danger'
                      message={'Saisissez votre email'}
                      fontSize='font-75'
                    />
                  </Alert>
                )}
              </Form.Group>
              <Alert variant='warning' className='border-2 border-warning py-1 rounded-0'>
                <i className='ri-information-line text-warning align-bottom'></i>{' '}
                <span className=' font-75 text-secondary mb-0'>
                  Suivez les instructions qui vous seront envoyées pour réinitialiser votre mot
                  de passe.
                </span>
              </Alert>
            </Modal.Body>
            <Modal.Footer className='text-light border-top-0'>
              <Button variant='warning' onClick={handleClose} className='text-light'>
                Fermer
              </Button>
              <Button type='submit' variant='info' className='text-light'>
                Envoyer
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </Container>
  )
}

export default Auth
