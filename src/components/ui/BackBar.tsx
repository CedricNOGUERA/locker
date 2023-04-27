import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import BackButton from './BackButton'

const BackBar = ({ setSelectedOrder }: any) => {
  return (
    <Container className='px- py-0 bg-secondary rounded-pill shadow my-auto '>
      <Row>
        <Col xs={2} md={5} lg={5} className='py-0' onClick={() => setSelectedOrder('')}>
          <BackButton />
        </Col>
        <Col className='m-auto text-light text-start pe-2 py-0'>
          <i className='ri-qr-code-fill align-bottom me-2'></i>{' '}
          <span className='fw-bold font-85'>Présentez le qrcode au locker</span>
        </Col>
      </Row>
    </Container>
  )
}

export default BackBar
