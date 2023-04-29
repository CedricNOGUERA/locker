import {
  Card,
  Form,
  Container,
  Alert,
  Spinner,
  InputGroup,
  Modal,
  Button,
} from 'react-bootstrap'
import { Link, Navigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import userDataStore from '../../store/userDataStore'
import { useEffect, useState } from 'react'
import Loading from '../../components/ui/Loading'
import '../../App.css'
import AuthService from '../../service/Auth/AuthService'
import UserService from '../../service/UserService'
import InfoAlert from '../../components/ui/warning/InfoAlert'
import AlertIsError from '../../components/ui/warning/AlertIsError'
import imag from '../../styles/logo512.png'

type Inputs = {
  userName: string
  pass: string
}

const Auth = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const authLogin = userDataStore((state: any) => state.authLogin)
  const dataStore = userDataStore((state: any) => state)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [isView, setIsView] = useState<boolean>(false)
  const [msgError, setMsgError] = useState<string>('')
  const [codeError, setCodeError] = useState<any>()

  const [token, setToken] = useState<any>([])
  const [myData, setMyData] = useState<any>([])

  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  useEffect(() => {
    if (token && token?.length > 0) {
      getMyData(token)
    }
  }, [token])

  useEffect(() => {
    if (token && token?.length > 0) {
      authLogin(
        true,
        myData.id,
        myData.firstName,
        myData?.memberOf ? myData?.memberOf[0]?.id : null,
        myData?.memberOf ? myData?.memberOf[0]?.cleveronCompanyId : null,
        myData?.memberOf ? myData?.memberOf[0]?.name : null,
        token
      )
    }
  }, [myData])

  if (dataStore.company_name === undefined) {
    setIsError(true)
    setCodeError(402)
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

  return (
    <Container fluid className='auth-cont   col-12 col-lg-4 px-0 bg-secondary'>
      {dataStore.token && dataStore.company_name && <Navigate to='/dashboard' />}
      {isLoading ? (
        <Loading variant='info' />
      ) : (
        <Card className='auth-form  bg-secondary shadow animate__animated animate__fadeIn rounded-0 border-0 vh-100'>
          <Card.Body>
            <div className='logo-app text-center text-light animate__animated animate__rotateIn'>
              <img alt='Conteneur' src={imag} width={120} height={120} />
            </div>
            <div className='teko text-center mb-5 text-light animate__animated animate__fadeInUp'>
              Locker
            </div>
            <Form onSubmit={handleSubmit(signUp)}>
              <Form.Group className='mb-3' controlId='formBasicEmail'>
                <Form.Label className='d-none'>Identifiant</Form.Label>
                <InputGroup className='mb-3'>
                  <InputGroup.Text id='basic-addon1' className='rounded-0 border-0'>
                    <i className='ri-user-fill text-muted'></i>
                  </InputGroup.Text>
                  <Form.Control
                    className='shadow rounded-0 border-0'
                    type='text'
                    placeholder='Identifiant'
                    {...register('userName', { required: true })}
                  />
                </InputGroup>
                {errors.userName && (
                  <Alert variant='danger' className='mt-2 py-0 text-cente'>
                    <InfoAlert
                      icon='ri-error-warning-line'
                      iconColor='danger'
                      message={'Saisissez votre identifiant'}
                      fontSize='font-75'
                    />
                  </Alert>
                )}
              </Form.Group>
              <Form.Group className='mb-3' controlId='formBasicPassword'>
                <Form.Label className='d-none'>Mot de passe</Form.Label>
                <InputGroup className='mb-3'>
                  <InputGroup.Text id='basic-addon1' className='rounded-0 border-0'>
                    <i className='ri-lock-2-fill text-muted'></i>
                  </InputGroup.Text>
                  <Form.Control
                    className='shadow border-0'
                    style={{ position: 'relative' }}
                    type={!isView ? 'password' : 'text'}
                    placeholder='Mot de passe'
                    {...register('pass', { required: true })}
                  />
                  <InputGroup.Text
                    id='eyeOrNot'
                    className='rounded-0 border-0'
                    onClick={() => setIsView(!isView)}
                  >
                    {' '}
                    <i
                      className={
                        !isView
                          ? 'ri-eye-fill text-secondary'
                          : 'ri-eye-off-fill text-secondary'
                      }
                    ></i>
                  </InputGroup.Text>
                </InputGroup>
                {errors.pass && (
                  <Alert variant='danger' className='mt-2 py-0 text-cente'>
                    <InfoAlert
                      icon='ri-error-warning-line'
                      iconColor='danger'
                      message={'Saisissez votre mot de passe'}
                      fontSize='font-75'
                    />
                  </Alert>
                )}
              </Form.Group>
              {isError && (
                <AlertIsError
                  title={`Erreur : ${codeError}`}
                  msg={msgError}
                  colorIcon='danger'
                />
              )}
              <p className='text-light text-end font-75' onClick={handleShow}>
                <u>Mot de passe oublié ?</u>
              </p>

              <button
                type='submit'
                id=''
                className='button-auth rounded  w-100 py-2 mt-4 text-light shadow'
              >
                {isLoadingAuth && <Spinner variant='light' size='sm' />} Valider
              </button>
            </Form>
          </Card.Body>
        </Card>
      )}
      <Modal show={show} onHide={handleClose} centered className='rounded-0'>
        <Modal.Header className='border-bottom-0'>
          <Modal.Title>Mot de passe oublié</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className='mb-3' controlId='formBasicEmail'>
            <Form.Label className='d-none'>email</Form.Label>
            <InputGroup className='mb-3'>
              <InputGroup.Text id='basic-addon1' className='rounded-0 border'>
                <i className='ri-at-line text-muted'></i>
              </InputGroup.Text>
              <Form.Control
                className=' rounded-0 border'
                type='text'
                placeholder='email'
                {...register('userName', { required: true })}
              />
            </InputGroup>
          </Form.Group>
          <Alert variant="warning" className='border-2 border-warning py-1 rounded-0'>
                <i className='ri-information-line text-warning align-bottom'></i> {' '}
        <span className=' font-75 text-secondary mb-0' >Suivez les instructions qui vous seront envoyées pour réinitialiser votre mot de passe.</span>
        </Alert>
        </Modal.Body>
        <Modal.Footer className='text-light border-top-0'>
          <Button variant='warning' onClick={handleClose} className='text-light'>
            Fermer
          </Button>
          <Button variant='info' onClick={handleClose} className='text-light'>
            Envoyer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Auth
