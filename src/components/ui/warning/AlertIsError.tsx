import React from 'react'
import { Alert } from 'react-bootstrap'

const AlertIsError = ({title, msg}: any) => {
  return (
    <Alert variant='danger' className="rounded-0">
      <Alert.Heading className='text-center'>
        <i className='ri-error-warning-fill text-warning align-middle fs-3'></i><span className='align-middle'> {title}</span>
      </Alert.Heading>
      {msg}
    </Alert>
  )
}

export default AlertIsError
