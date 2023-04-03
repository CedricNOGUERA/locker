import { Card, Form, Container, Alert, Spinner, InputGroup } from 'react-bootstrap'
import { Navigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import userDataStore from '../store/userDataStore'
import { useEffect, useState } from 'react'
import Loading from './ui/Loading'
import '../App.css'
import AuthService from '../service/Auth/AuthService'
import UserService from '../service/UserService'
import InfoAlert from './ui/warning/InfoAlert'

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
  const [token, setToken] = useState<any>([])
  const [formData, setFormData] = useState<any>([])
  const [myData, setMyData] = useState<any>([])

  useEffect(() => {
    if (token && token.length > 0) {
      getMyData(token)
      
    }
  }, [token])

  useEffect(() => {
    if (token && token.length > 0) {
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



  const signUp: SubmitHandler<Inputs> = (dataz: any, e: any) => {
    e.preventDefault()

    AuthService.login(
      dataz.userName,
      dataz.pass,
      setToken,
      setMsgError,
      setIsError,
      setIsLoadingAuth
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
    <Container className='col-11 col-lg-4 mt-5'>
      {isLogged && (
        <Navigate to='/in-progress' />
      )}
      {isLoading ? (
        <Loading variant='info' />
      ) : (
        <Card className='shadow mt-md-5 animate__animated animate__fadeIn'>
          <Card.Body>
            <div className='text-center '>
              <img
                alt='Conteneur'
                src={'https://img.icons8.com/ios-filled/128/exercise.png'}
                width={64}
                height={64}
              />
            </div>
            <div className='text-center'>
              <h4>Locker</h4>
            </div>
            <Form onSubmit={handleSubmit(signUp)}>
              <Form.Group className='mb-3' controlId='formBasicEmail'>
                <Form.Label>Identifiant</Form.Label>
                <Form.Control
                  className='shadow'
                  type='text'
                  placeholder='Entrez votre identifiant'
                  {...register('userName', { required: true })}
                />
                {errors.userName && (
                  <Alert variant='danger' className='mt-2 py-0 text-center'>
                    <InfoAlert
                      icon='ri-error-warning-line'
                      iconColor='danger'
                      message={'Ce champ est obligatoire'}
                      fontSize='font-75'
                    />
                  </Alert>
                )}
              </Form.Group>
              <Form.Group className='mb-3' controlId='formBasicPassword'>
                <Form.Label>Mot de passe</Form.Label>
                <InputGroup className='mb-3'>
                  <Form.Control
                    className='shadow'
                    style={{ position: 'relative' }}
                    type={!isView ? 'password' : 'text'}
                    placeholder='Entrez votre mot de passe'
                    {...register('pass', { required: true })}
                  />
                  <InputGroup.Text id='eyeOrNot' onClick={() => setIsView(!isView)}>
                    {' '}
                    <i
                      className={
                        !isView
                          ? 'ri-eye-fill text-secondary ms-1 '
                          : 'ri-eye-off-fill text-secondary ms-1 '
                      }
                    ></i>
                  </InputGroup.Text>
                </InputGroup>
                {errors.pass && (
                  <Alert variant='danger' className='mt-2 py-0 text-center'>
                    <InfoAlert
                      icon='ri-error-warning-line'
                      iconColor='danger'
                      message={'Ce champ est obligatoire'}
                      fontSize='font-75'
                    />
                  </Alert>
                )}
              </Form.Group>
              {isError && (
                <>
                  <Alert variant='danger' className='py-2 px-1 text-center'>
                    <InfoAlert
                      icon='ri-error-warning-line'
                      iconColor='danger'
                      message={msgError}
                      fontSize='font-65'
                    />
                  </Alert>
                </>
              )}

              <button
                type='submit'
                id=""
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
