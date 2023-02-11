import React from 'react'
import { Spinner } from 'react-bootstrap'

const Loading = ({variant} :any) => {
  return (
    <div>
    <Spinner variant={variant} animation="border" role="status" />
    <span className="ms-3">Loading...</span>
  </div>
  )
}

export default Loading