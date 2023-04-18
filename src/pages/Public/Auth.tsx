import { Card, Form, Container, Alert, Spinner, InputGroup } from 'react-bootstrap'
import { Navigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import userDataStore from '../../store/userDataStore'
import { useEffect, useState } from 'react'
import Loading from '../../components/ui/Loading'
import '../../App.css'
import AuthService from '../../service/Auth/AuthService'
import UserService from '../../service/UserService'
import InfoAlert from '../../components/ui/warning/InfoAlert'
import AlertIsError from '../../components/ui/warning/AlertIsError'
import imag from '../../styles/g1348.png'

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
  const isLogged = userDataStore((state: any) => state.isLogged)
  const dataStore = userDataStore((state: any) => state)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [isView, setIsView] = useState<boolean>(false)
  const [msgError, setMsgError] = useState<string>('')
  const [codeError, setCodeError] = useState<any>()

  const [token, setToken] = useState<any>([])
  const [formData, setFormData] = useState<any>([])
  const [myData, setMyData] = useState<any>([])

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
      if(dataStore.company_name === null){
        setIsError(true)
        setMsgError("Vous n'êtes affilié à aucune companie, contacté votre adminitrateur")
      }
    }
  }, [myData])

  



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
    setFormData(dataz)
  }
  const getMyData = (token: any) => {
    UserService.me(token).then((response: any) => {
      setMyData(response.data)
    })
  }


  return (
    <Container fluid className='auth-cont   col-12 col-lg-4 px-0 bg-secondary'>
      {dataStore.token && dataStore.company_name && <Navigate to='/in-progress' />}
      {isLoading ? (
        <Loading variant='info' />
      ) : (
        <Card className='auth-form  bg-secondary shadow animate__animated animate__fadeIn rounded-0 border-0 vh-100'>
          <Card.Body>
            <div className='text-center text-light'>
              {/* <img
                alt='Conteneur'
                src={'https://img.icons8.com/ios-filled/128/exercise.png'}
                width={64}
                height={64}*
                 height={64}
              /> */}
              <img
                alt='Conteneur'
                src={imag}
                width={64}
                height={64}
              />
              {/* <i className="ri-settings-6-line fs-1 align-bottom"></i>{' '} */}
            </div>
            <div className='text-center mb-5 text-light'>
              <h4>Locker</h4>
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
              {isError && <AlertIsError title={`Erruer : ${codeError}`} msg={msgError} />}

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
    </Container>
  )
}

export default Auth
