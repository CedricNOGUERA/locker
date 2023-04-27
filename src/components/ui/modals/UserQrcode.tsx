import React from 'react'
import { Modal, Container, Col, Button, Alert } from 'react-bootstrap'
import QrCode from '../../QrCode'
import userDataStore from '../../../store/userDataStore'
import BackBar from '../BackBar'

const UserQrcode = ({show, handleClose, setSelectedOrder}: any) => {
    const dataStore = userDataStore((state: any) => state)
  return (
    <Modal show={show} onHide={handleClose} animation={true} centered>
    <Modal.Header closeButton>
      <Modal.Title className='text-secondary'>
        {dataStore.firstname} - ({dataStore.id})
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Container fluid className='pb-1'>
      <Container className='text-center mt-4 px-0'>
        <Alert variant="secondary" className='border-2 border-secondary py-1'>
        <span className='font-85 text-secondary mb-0' >Présentez le qrcode au locker pour authentifier</span>
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
        <Container className='bg-light p-2    animate__animated animate__fadeInDown'>
          <Col xs={12} sm={5} md={7} lg={5} className='m-auto'>
            <QrCode data={`${dataStore.id}`} />
          </Col>
        </Container>
        <Container className='text-center text-warning font-85'>
          <small>
            Respectez le sens du qrcode lors du scan
          </small>
        </Container>
      </Container>
    </Modal.Body>
    <Container className='text-end'>
      <Button variant='info' className='text-light w-25 m-3' onClick={handleClose}>
        Fermer
      </Button>
    </Container>
  </Modal>
  )
}

export default UserQrcode
