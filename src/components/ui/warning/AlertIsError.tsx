import React from 'react'
import { Alert } from 'react-bootstrap'

interface AlertIsErrorProps {
  title: string
  msg: string
  colorIcon: string
}

const AlertIsError: React.FC<AlertIsErrorProps> = ({ title, msg, colorIcon }: any) => {
  return (
    <Alert variant='danger' className='rounded-0 border-2'>
      <Alert.Heading className='text-center'>
        <i className={`ri-error-warning-line text-${colorIcon} align-middle fs-3`}></i>
        <span className={`align-middle`}> {title}</span>
      </Alert.Heading>
      <div className='text-center font-75'>{msg}</div>
    </Alert>
  )
}

export default AlertIsError
