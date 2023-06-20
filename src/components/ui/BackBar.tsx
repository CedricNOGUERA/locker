import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import BackButton from './BackButton'
import { _imgFilter } from '../../utils/functions'

const BackBar = ({ setSelectedOrder, selectedOrder }: any) => {
  return (
    <Container className='px- py-0 bg-secondary rounded-pill shadow my-auto '>
      <Row>
        <Col xs={2} md={5} lg={5} className='py-0' onClick={() => setSelectedOrder('')}>
          <BackButton />
        </Col>
        <Col className='m-auto text-light text-start ps-1 pe-2 py-0'>
          <img
            alt='Temp icon'
            src={
              'https://img.icons8.com/color/42/' +
              _imgFilter(selectedOrder?.bookingSlot?.slot.temperatureZone?.keyTemp) +
              '.png'
            }
            style={{ width: '30px', height: '30px' }}
            className='align-middle me-2'
          />
          {selectedOrder?.bookingSlot?.slot?.size} - {' '}
          <span className='fw-bold font-85'>Présentez le qrcode au locker</span>
        </Col>
      </Row>
    </Container>
  )
}

export default BackBar
