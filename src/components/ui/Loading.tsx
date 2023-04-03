import React from 'react'
import { Spinner } from 'react-bootstrap'

const Loading = ({variant} :any) => {
  return (
    <div>
    <Spinner variant={variant} animation="border" role="status" />
    <div className="ms-3 text-secondary">Loading...</div>
  </div>
  )
}

export default Loading