import React from 'react'

interface infoAlertProps {
  icon: string
  iconColor: string
  message: string
  fontSize: string
}

const InfoAlert: React.FC<infoAlertProps> = ({ icon, iconColor, message, fontSize }) => {
  return (
    <>
      <i className={icon + ' fs-3 align-middle text-' + iconColor + ' me-1'}></i>
      <small className={fontSize}>{message}</small>
    </>
  )
}

export default InfoAlert
