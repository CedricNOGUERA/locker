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
import {  Navigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import userDataStore from '../../store/userDataStore'
import { useEffect, useRef, useState } from 'react'
import Loading from '../../components/ui/Loading'
import '../../App.css'
import AuthService from '../../service/Auth/AuthService'
import UserService from '../../service/UserService'
import InfoAlert from '../../components/ui/warning/InfoAlert'
import imag from '../../styles/logo512.png'
import Swal from 'sweetalert2'
import emailjs from '@emailjs/browser'
import { _strRandom } from '../../utils/functions'
import AuthForm from '../../components/ui/auth/AuthForm'

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
  const [forgotToken, setForgotToken] = useState<any>('')
  

   ////////////////////
  //Forgot modal states
  ///////////////////
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const myToken = _strRandom('popopopopop').toLocaleUpperCase()



   ////////////////////
  //UseEffect
  ///////////////////
  useEffect(() => {
    if (token && token?.length > 0) {
      getMyData(token)
    }
  }, [token])

  useEffect(() => {
    // if (token && token?.length > 0) {
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

      )
    // }
  }, [authLogin, myData, token])

  useEffect(() => {
    if (myEmail) {
      setIsNotEmail(false)
    }
  }, [myEmail])

console.log(myData)

   ////////////////////
  //events
  ///////////////////

  if (dataStore.company_name === undefined) {
    setIsError(true)
    setMsgError("Vous n'êtes affilié à aucune companie, contacté votre adminitrateur")
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
      setCodeError
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
          setForgotToken(response.data.token)
          authLogin(false, null, null, null, null, null, null, response.data.token)

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

     
      // sendEmail()
      handleClose()
      setMyEmail('')
      // authLogin(false, null, null, null, null, null, null, myToken)
    }
  }

  const sendEmail = () => {
    console.log(form.current.email?.value)

    emailjs
      .sendForm('invoiceitl_service', 'template_pnr0mid', form?.current, 'GivYhKQYsq1vBus6G')
      .then(
        (result) => {
          console.log(form?.current)
          console.log(result)
        },
        (error) => {
          console.log(error.text)
          alert(error.text)
        }
      )
  }


  const formProps = {handleSubmit, register, errors, signUp, isView, setIsView, handleShow, isError, codeError, msgError, isLoadingAuth}

  return (
    <Container fluid className='auth-cont-sup col-12 px-0 py-0 bg-'>
   
   <Container fluid className='auth-cont col-12 col-md-12 col-lg-6 px-0 bg-secondary'>
      {dataStore.token && dataStore.company_name && <Navigate to='/dashboard' />}
      {isLoading ? (
        <Loading variant='info' />
      ) : (
        <Card className='auth-form  bg-secondary shadow animate__animated animate__fadeIn rounded-0 border-0 vh-100'>
          <Card.Body className=''>
            <div className='logo-app text-center text-light animate__animated animate__rotateIn'>
              {/* <img alt='Conteneur' src={imag} width={80} height={80} /> */}
            </div>
            <div className='teko text-center mb-5 text-light animate__animated animate__fadeInUp'>
              OVER BOX{/* DRIVE BOX */}
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
            {/* <Link to="/forgot-pass/myLongToken"> */}
             Fermer
             {/* </Link> */}
            </Button>
            <Button type='submit'  variant='info' className='text-light'>
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
