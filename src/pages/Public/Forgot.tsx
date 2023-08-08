import { Card, Container } from 'react-bootstrap'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import '../../App.css'
import Swal from 'sweetalert2'
import ForgotForm from '../../components/ui/auth/ForgotForm'
import axios from 'axios'
import userDataStore from '../../store/userDataStore'

const Forgot = () => {
  const API_URL = process.env.REACT_APP_END_POINT
  //////////////////////////
  // booleans States
  /////////////////////////
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(false)
  const [isError, setIsError] = React.useState<boolean>(false)
  const [isView, setIsView] = useState<boolean>(false)
  const [isView2, setIsView2] = useState<boolean>(false)

  //////////////////////////
  // states
  /////////////////////////

  const dataStore = userDataStore((state: any) => state)
  const token = dataStore.subToken

  const [pass1, setPass1] = React.useState('')
  const [pass2, setPass2] = React.useState('')

  const params = useParams()
  const navigate = useNavigate()

  //////////////////////////
  // Useeffect
  /////////////////////////
  useEffect(() => {
    if (pass1 === pass2) {
      setIsError(false)
    }
  }, [pass1, pass2])

  //////////////////////////
  // Event
  /////////////////////////
  const updatePass = (e: any) => {
    e.preventDefault()
    setIsLoadingAuth(true)

    if (pass1 === pass2) {
      let data = JSON.stringify({
        "newPassword": pass1,
        "newPasswordRetyped": pass2
      });
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: API_URL + 'forgot-password/' + params.token,
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
      
      axios.request(config)
      .then((response) => {
        console.log((response.data));
        setIsLoadingAuth(false)
        setIsError(false)
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
              navigate('/livraisons')
            }, 5000)
          },
        })
      })
      .catch((error) => {
        console.log(error);
      });



     
     
    } else {
      console.log('error')
      setIsLoadingAuth(false)
      setIsError(true)
    }
  }

  const formProps = {
    updatePass,
    isView,
    setIsView,
    isView2,
    setIsView2,
    pass1,
    setPass1,
    pass2,
    setPass2,
    isError,
    isLoadingAuth
  }

  return (
    <Container fluid className='auth-cont col-12 col-lg-4 px-0 bg-secondary'>
      {token === params.token ? (
        <Card className='auth-form  bg-secondary shadow animate__animated animate__fadeIn rounded-0 border-0 vh-100'>
          <Card.Body>
            <div className='logo-app text-center text-light animate__animated animate__rotateIn'>
              <img
                src='https://img.icons8.com/?size=512&amp;id=11320&amp;format=png'
                alt='Déverrouiller 2 icon'
                style={{
                  width: '120px',
                  height: '120px',
                  filter:
                    'invert(99%) sepia(0%) saturate(0%) hue-rotate(168deg) brightness(102%) contrast(102%)',
                }}
              />
            </div>
            <div className=' text-center my-5 text-light animate__animated animate__fadeInUp'>
              <h3>Réinitialisé votre mot de passe</h3>
            </div>
            <ForgotForm formProps={formProps} />
          </Card.Body>
        </Card>
      ) : (
        <Navigate to='/connexion' />
      )}
    </Container>
  )
}

export default Forgot
