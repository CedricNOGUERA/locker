import React from 'react'
import { Alert, Form, InputGroup, Spinner } from 'react-bootstrap'
import InfoAlert from '../warning/InfoAlert'
import AlertIsError from '../warning/AlertIsError'

const ForgotForm = ({ formProps }: any) => {
  const {
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
    isLoadingAuth,
  } = formProps

  return (
    <Form onSubmit={updatePass}>
      <Form.Group className='mb-3' controlId='formBasicEmail'>
        <Form.Label className='d-none'>nouveau password</Form.Label>
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
            <i className={`ri-${!isView ? 'eye-off-fill' : 'eye-fill'} text-secondary`}></i>
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
            min={8}
            onChange={(e) => setPass2(e.currentTarget.value)}
            required
          />
          <InputGroup.Text
            id='eyeOrNot'
            className='rounded-0 border-0'
            onClick={() => setIsView2(!isView2)}
          >
            {' '}
            <i className={`ri-${!isView2 ? 'eye-off-fill' : 'eye-fill'} text-secondary`}></i>
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
          msg={'Les mots de passe ne sont pas les mêmes'}
          colorIcon='danger'
        />
      )}
      <button
        type='submit'
        id=''
        className='button-auth rounded  w-100 py-2 mt-4 text-light shadow'
        disabled={pass1 && pass2 && pass1 !== pass2 ? true : false}
      >
        {isLoadingAuth && <Spinner variant='light' size='sm' />}
        {/* <Link to="/connexion"> */}
        Réinitialiser
        {/* </Link>   */}
      </button>
    </Form>
  )
}

export default ForgotForm
