import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import BackButton from './BackButton'
import BadgedIcon from './BadgedIcon'
import userDataStore from '../../store/userDataStore'

const BackBar = ({ setSelectedOrder, selectedOrder, getallOrders }: any) => {
  const dataStore: any = userDataStore((states: any) => states)

  return (
    <Container className='px- py-0 bg-secondary rounded-pill shadow my-auto '>
      <Row>
        <Col xs={2} md={5} lg={5} className='m-auto py-0' onClick={() =>{
          setSelectedOrder('')
          getallOrders(dataStore.token)
          }}>
          <BackButton />
        </Col>
        <Col xs={2} className='m-auto text-light text-start ps-1 pe-2 py-0'>
          <BadgedIcon
            slot={selectedOrder?.bookingSlot}
            borderColor='secondary'
            imgSize='30px'
          />
        </Col>
        <Col className='m-auto text-light text-start ps-1 pe-2 py-0'>
          <span className='fw-bold font-85'>Présentez le qrcode au locker</span>
        </Col>
      </Row>
    </Container>
  )
}

export default BackBar
