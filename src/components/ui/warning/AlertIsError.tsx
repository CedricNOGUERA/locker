import React from 'react'
import { Alert } from 'react-bootstrap'

const AlertIsError = ({title, msg}: any) => {
  return (
    <Alert variant='danger'>
      <Alert.Heading>
        <i className='ri-error-warning-fill text-warning align-bottom fs-2'></i> {title}
      </Alert.Heading>
      {msg}
    </Alert>
  )
}

export default AlertIsError
