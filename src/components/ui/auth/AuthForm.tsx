import { Alert, Form, InputGroup, Spinner } from 'react-bootstrap'
import InfoAlert from '../warning/InfoAlert'
import AlertIsError from '../warning/AlertIsError'

const AuthForm= ({ formProps }: any) => {
  const {
    handleSubmit,
    register,
    errors,
    signUp,
    isView,
    setIsView,
    handleShow,
    isError,
    codeError,
    msgError,
    isLoadingAuth,
  } = formProps

  return (
    <Form className='auth-form' onSubmit={handleSubmit(signUp)}>
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
            <i className={`ri-${!isView ? 'eye-off-fill' : 'eye-fill'} text-secondary`}></i>
          
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
        codeError ?(

         <AlertIsError title={`Erreur : ${codeError}`} msg={msgError} colorIcon='danger' />
         ) : (
           <AlertIsError title={`Erreur est survenue : `} msg="Vérifiez votre connexion interne" colorIcon='danger' />

         )
      )}
      {/* todo: mettre en place l'envoi d'email */}
      
      {/* <p className='text-light text-end font-75' onClick={handleShow}>
        <u>Mot de passe oublié ?</u>
      </p> */}

      <button
        type='submit'
        id=''
        className='button-auth rounded  w-100 py-2 mt-4 text-light shadow'
      >
        {isLoadingAuth ? <Spinner variant='light' size='sm' /> : <>Valider</>}
      </button>
    </Form>
  )
}

export default AuthForm
