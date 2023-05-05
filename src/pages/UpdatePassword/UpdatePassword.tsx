import React from 'react'
import { Alert, Card, Container, InputGroup, Form, Spinner } from 'react-bootstrap'
import InfoAlert from '../../components/ui/warning/InfoAlert'
import AlertIsError from '../../components/ui/warning/AlertIsError'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import userDataStore from '../../store/userDataStore'
import axios from 'axios'

const UpdatePassword = () => {

  const API_URL = process.env.REACT_APP_END_POINT

  //////////////////////////
  // booleans States
  /////////////////////////

  const [isLoadingPass, setIsLoadingPass] = React.useState<boolean>(false)
  const [isError, setIsError] = React.useState<boolean>(false)
  const [isView, setIsView] = React.useState<boolean>(false)
  const [isView1, setIsView1] = React.useState<boolean>(false)
  const [isView2, setIsView2] = React.useState<boolean>(false)
  const [msgError, setMsgError] = React.useState<string>('')
  const [codeError, setCodeError] = React.useState<any>('')

  //////////////////////////
  // states
  /////////////////////////

  const token = 'myLongToken'

  const [pass, setPass] = React.useState('')
  const [pass1, setPass1] = React.useState('')
  const [pass2, setPass2] = React.useState('')

  const dataStore = userDataStore((state: any) => state)

  const navigate = useNavigate()
  
  const changePassword = (e: any) => {
    setIsLoadingPass(true)
    setIsError(false)
    e.preventDefault()
    if (pass1 === pass2) {
      let data = {
        currentPassword: pass,
        newPassword: pass1,
        newPasswordRetyped: pass2,
      }

      let config = {
        method: 'patch',
        maxBodyLength: Infinity,
        url: API_URL + 'users/' + dataStore.id + '/update-password',
        headers: {
          'Content-Type': 'application/merge-patch+json',
          'Authorization': 'Bearer ' + dataStore.token,
        },
        data: data,
      }

      axios
        .request(config)
        .then((response) => {
          Swal.fire({
            position: 'top-end',
            toast: true,
            icon: 'success',
            title: 'Modification du mot de passe effectué',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
              setTimeout(() => {
                navigate('/dashboard')
              }, 3000)
            },
          })
          setIsLoadingPass(false)
          setIsError(false)
        })
        .catch((error) => {
            console.log(error)
            setIsLoadingPass(false)
            setIsError(true)
            setCodeError(error.response.status)
            setMsgError(error.response.data["hydra:description"])
            
        })
    // UserService.updatePassword(dataStore.token, dataStore.id, data)
    //   .then((response) => {
    //     Swal.fire({
    //       position: 'top-end',
    //       toast: true,
    //       icon: 'success',
    //       title: 'Modification du mot de passe effectué',
    //       showConfirmButton: false,
    //       timer: 3000,
    //       timerProgressBar: true,
    //       didOpen: () => {
    //         setTimeout(() => {
    //           navigate('/in-progress')
    //         }, 3000)
    //       },
    //     })
    //     setIsLoadingPass(false)
    //     setIsError(false)
    //   })
    //   .catch((error) => {
    //     console.log(error)
    //     setIsLoadingPass(false)
    //     setIsError(true)
    //     setCodeError(error.response.status)
    //     setMsgError(error.response.data['hydra:description'])
    //   })
    }
  }


  return (
    <Container fluid className='cde App px-0'>
      <Card className='auth-for bg-secondary shadow animate__animated animate__fadeIn rounded-0 border-0 vh-100'>
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
          <div className=' text-center my-5 text-light animate__animated animate__fadeInUp'>
            <h3>Réinitialisé votre mot de passe</h3>
          </div>
          <Form onSubmit={changePassword}>
            <Form.Group className='mb-5' controlId='formBasicEmail'>
              <Form.Label className='d-none'>nouveau password</Form.Label>
              <InputGroup className='mb-3'>
                <InputGroup.Text id='basic-addon1' className='rounded-0 border-0'>
                  <i className='ri-lock-fill text-muted'></i>
                </InputGroup.Text>
                <Form.Control
                  className='shadow rounded-0 border-0'
                  type={isView ? 'text' : 'password'}
                  placeholder='Mot de passe actuel'
                  name='pass'
                  value={pass}
                  onChange={(e) => setPass(e.currentTarget.value)}
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
                      !isView ? 'ri-eye-off-fill text-secondary' : 'ri-eye-fill text-secondary'
                    }
                  ></i>
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group className='mb-3' controlId='formBasicPass1'>
              <Form.Label className='d-none'>nouveau password</Form.Label>
              <InputGroup className='mb-3'>
                <InputGroup.Text id='basic-addon1' className='rounded-0 border-0'>
                  <i className='ri-lock-unlock-fill text-muted'></i>
                </InputGroup.Text>
                <Form.Control
                  className='shadow rounded-0 border-0'
                  type={isView1 ? 'text' : 'password'}
                  placeholder='Nouveau mot de passe'
                  name='pass1'
                  value={pass1}
                  onChange={(e) => setPass1(e.currentTarget.value)}
                  required
                />
                <InputGroup.Text
                  id='eyeOrNot'
                  className='rounded-0 border-0'
                  onClick={() => setIsView1(!isView1)}
                >
                  {' '}
                  <i
                    className={
                      !isView1
                        ? 'ri-eye-off-fill text-secondary'
                        : 'ri-eye-fill text-secondary'
                    }
                  ></i>
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group className='mb-3' controlId='formBasicPassword'>
              <Form.Label className='d-none'>Mot de passe de confirmation</Form.Label>
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
                title={`Erreur : ${codeError}`}
                msg={msgError}
                colorIcon='danger'
              />
            )}
            <button
              type='submit'
              id=''
              className='button-auth rounded  w-100 py-2 mt-4 text-light shadow'
              disabled={pass1 && pass2 && pass1 !== pass2 ? true : false}
            >
              {isLoadingPass ? <Spinner variant='light' size='sm' /> : <>Réinitialiser</>}
            </button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default UpdatePassword
