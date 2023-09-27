import React from 'react'
import { Modal, Container, Button, Alert } from 'react-bootstrap'
import QrCode from '../../QrCode'
import userDataStore from '../../../store/userDataStore'

const UserQrcode = ({show, handleClose, setSelectedOrder}: any) => {
    const dataStore = userDataStore((state: any) => state)
  return (
    <Modal show={show} onHide={handleClose} animation={true} centered>
      <Modal.Header closeButton>
        <Modal.Title className='text-secondary'>
         Livreur : {dataStore.firstname}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='py-0'>
        <Container fluid>
          <Container className='text-center mt-2 px-0'>
            <Alert variant='secondary' className='border-2 border-secondary py-1'>
              <span className='font-85 text-secondary mb-0'>
                Présentez le qrcode au locker pour vous identifier
              </span>
            </Alert>
          </Container>
          <Container className='text-center text-danger py-0  m-auto opacity-75'>
            <span className='align-middle'>
              <i className='ri-error-warning-line fs-5'></i>
            </span>{' '}
            <small className='fw-bold align-middle '>haut du qrcode</small>{' '}
            <div className='bounced-arrow justify-content-around'>
              <i className='ri-arrow-up-fill '></i>
              <i className='ri-arrow-up-fill '></i>
              <i className='ri-arrow-up-fill '></i>
            </div>
          </Container>
          <Container className='m-auto bg-light p-2    animate__animated animate__fadeInDown'>
            <div  className=' text-cente'>
              <QrCode data={`${dataStore.apm_access_code}`} />
            </div>
          </Container>
          <Container className='text-center text-warning font-85'>
            <small>Respectez le sens du qrcode lors du scan</small>
            
            <Alert variant='info' className='border-2 border-info py-1'>
              Code pin : {dataStore?.apm_access_code}</Alert>
          </Container>
        </Container>
      </Modal.Body>
      <Container className='text-end'>
        <Button className='bg-green border-green text-light w-25 m-3 mt-1' onClick={handleClose}>
          Fermer
        </Button>
      </Container>
    </Modal>
  )
}

export default UserQrcode
