import { Card, Form, Container, Alert, Spinner, InputGroup } from 'react-bootstrap'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import React, { useEffect, useRef, useState } from 'react'
import '../../App.css'
import InfoAlert from '../../components/ui/warning/InfoAlert'
import AlertIsError from '../../components/ui/warning/AlertIsError'
import Swal from 'sweetalert2'

const Forgot = () => {
  //////////////////////////
  // booleans States
  /////////////////////////
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(false)
  const [isError, setIsError] = React.useState<boolean>(false)
  const [isView, setIsView] = useState<boolean>(false)
  const [isView2, setIsView2] = useState<boolean>(false)
  const [msgError, setMsgError] = useState<string>('')
  const [codeError, setCodeError] = useState<any>()

  //////////////////////////
  // states
  /////////////////////////

  const form: any = useRef()
  const token = 'myLongToken'

  const [pass1, setPass1] = React.useState('')
  const [pass2, setPass2] = React.useState('')

  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (pass1 === pass2) {
      setIsError(false)
    }
  }, [pass1, pass2])


  const updatePass = (e: any) => {
    e.preventDefault()

    if (pass1 === pass2) {
      Swal.fire({
        position: 'top-end',
        toast: true,
        icon: 'success',
        title: 'Réinitialisation du mot de passe effectué',
        text: 'Vous allez être redirigé',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        didOpen: () => {
          setTimeout(() => {
            navigate('/in-progress')
          }, 5000)
        },
      })
      setIsError(false)
    } else {
      console.log('error')
      setIsError(true)
    }
  }

  return (
    <Container fluid className='cde App px-0'>
      {token === params.token ? (
        <Card className='auth-form  bg-secondary shadow animate__animated animate__fadeIn rounded-0 border-0 vh-100'>
          <Card.Body>
            <div className='logo-app text-center text-light animate__animated animate__rotateIn'>
              <img
                src='https://img.icons8.com/?size=512&amp;id=N459Os8TBWED&amp;format=png'
                alt='Cadenas icon'
                style={{
                  width: ' 120px',
                  height: '120px',
                  filter:
                    'invert(99%) sepia(0%) saturate(0%) hue-rotate(168deg) brightness(102%) contrast(102%)',
                }}
              />
            </div>
            <div className=' text-center mb-5 text-light animate__animated animate__fadeInUp'>
              Réinitialisé votre mot de passe
            </div>
            <Form onSubmit={updatePass}>
              <Form.Group className='mb-3' controlId='formBasicEmail'>
                <Form.Label className='d-none'>PASS1</Form.Label>
                <InputGroup className='mb-3'>
                  <InputGroup.Text id='basic-addon1' className='rounded-0 border-0'>
                    <i className='ri-lock-unlock-fill text-muted'></i>
                  </InputGroup.Text>
                  <Form.Control
                    className='shadow rounded-0 border-0'
                    type={isView ? 'text' : 'password'}
                    placeholder='Nouveau mot de passe'
                    name='pass1'
                    value={pass1}
                    onChange={(e) => setPass1(e.currentTarget.value)}
                    required
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
                          ? 'ri-eye-off-fill text-secondary'
                          : 'ri-eye-fill text-secondary'
                      }
                    ></i>
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Form.Group className='mb-3' controlId='formBasicPassword'>
                <Form.Label className='d-none'>Mot de passe</Form.Label>
                <InputGroup className='mb-3'>
                  <InputGroup.Text id='basic-addon1' className='rounded-0 border-0'>
                    <i className='ri-rotate-lock-fill text-muted'></i>
                  </InputGroup.Text>
                  <Form.Control
                    className='shadow border-0'
                    style={{ position: 'relative' }}
                    type={isView2 ? 'text' : 'password'}
                    name='pass2'
                    placeholder='Confirmez votre mot de passe'
                    value={pass2}
                    onChange={(e) => setPass2(e.currentTarget.value)}
                    required
                  />
                  <InputGroup.Text
                    id='eyeOrNot'
                    className='rounded-0 border-0'
                    onClick={() => setIsView2(!isView2)}
                  >
                    {' '}
                    <i
                      className={
                        !isView2
                          ? 'ri-eye-off-fill text-secondary'
                          : 'ri-eye-fill text-secondary'
                      }
                    ></i>
                  </InputGroup.Text>
                </InputGroup>
                {pass1 && pass2 && pass2.length > 2 && pass1 !== pass2 && (
                  <Alert variant='danger' className='mt-2 py-0 text-cente'>
                    <InfoAlert
                      icon='ri-error-warning-line'
                      iconColor='danger'
                      message={'Vous devez saisir le même mot de passe'}
                      fontSize='font-75'
                    />
                  </Alert>
                )}
              </Form.Group>
              {isError && (
                <AlertIsError
                  title={`Erreur :`}
                  msg={"Les mots de passe ne sont pas les mêmes"}
                  colorIcon='danger'
                />
              )}
              <button
                type='submit'
                id=''
                className='button-auth rounded  w-100 py-2 mt-4 text-light shadow'
                disabled={pass1 && pass2 && pass1 !== pass2 ? true : false}
              >
                {/* {isLoadingAuth && <Spinner variant='light' size='sm' />} */}
                Réinitialiser
              </button>
            </Form>
          </Card.Body>
        </Card>
      ) : (
        <Navigate to='/connexion' />
      )}
    </Container>
  )
}

export default Forgot
