import React from 'react'

import { Container, Row, Col, Button, Alert, Table } from 'react-bootstrap'
// import { QrReader } from 'react-qr-reader'
import BackButton from './BackButton'
import BadgedIcon from './BadgedIcon'
const ScanBl = ({ scanPageProps }: any) => {
  ////////////////////
  //Props & store
  ///////////////////
  const { selectedOrder, setOrderData, setSelectedOrder, newStatus } = scanPageProps

  const [startScan, setStartScan] = React.useState(false)
  const [isDetail, setIsDetail] = React.useState(false)

  const goScan = () => {
    setStartScan(!startScan)
    // setTimeout(() => setLoadingScan(false), 200)
  }

  return (
    <Container fluid className='pb-5'>
      {!isDetail ? (
        <>
          <Container className='my-2 px-0'>
            <Container className='px- py-0 bg-secondary rounded-pill shadow my-auto '>
              <Row>
                <Col
                  xs={2}
                  md={5}
                  lg={5}
                  className='m-auto py-0'
                  onClick={() => setSelectedOrder('')}
                >
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
                  <span className='fw-bold font-85'>Scannez le qrcode</span>
                </Col>
              </Row>
            </Container>
          </Container>
          <Container className='bg-light p-2 w-75  border'>
            {startScan && (
              <>
                {/* <QrReader
                  onResult={(result: any, error: any) => {
                    if (result && result.text !== 'No result') {
                      let resultStr = result.text.toString()
                      if (selectedOrder?.barcode === resultStr) {
                        setStartScan(false)
                        setIsDetail(true)
                      } else {
                        alert('no good')
                      }
                      // redirectionOnScan(resultStr)
                    }
                  }}
                  constraints={{ facingMode: 'environment' }}
                /> */}
              </>
            )}
          </Container>
          <Container className='text-center'>
            <div>
              <Button variant='outline-secondary' className='px-1' onClick={() => goScan()}>
                {startScan ? 'Arrêter le scanner' : 'Lancer le scanner'}
              </Button>
            </div>
          </Container>

          <Container className='text-center mt-4 px-0'>
            <Alert variant='secondary' className='border-2 border-secondary'>
              Saisie manuelle :
              <p className='text-info fw-bold m-0'>
                {newStatus === 'receive' && selectedOrder.multiOrderCode
                  ? selectedOrder?.multiOrderCode
                  : newStatus === 'receive' && !selectedOrder.multiOrderCode
                  ? selectedOrder?.receiveCode
                  : selectedOrder?.barcode}
              </p>
            </Alert>
          </Container>
        </>
      ) : (
        <Container fluid className='text-center'>
          <p>
            Détails de la commande <br /> n° {selectedOrder?.barcode}
          </p>
          <Table>
            <thead>
              <tr>
                <th className='col-xs-6'>Libellé_produit</th>
                <th className='col-xs-1'>Montant</th>
                {/* ))} */}
              </tr>
            </thead>
            <tbody>
              {selectedOrder?.products.map((prod: any, index: any) => (
                <tr key={index}>
                  <td>{prod?.detail}</td>
                  <td>{prod?.detail}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Container className='text-end mt-4'>
          <Button className='bg-warning rounded-pill border-warning text-light ms-3' type='submit'
              variant='danger'
              onClick={() => {
                setIsDetail(false)
                
                setSelectedOrder('')
              }}
            >
              Annuler
            </Button>

            <Button className='bg-info rounded-pill border-info text-light ms-3' type='submit'>
              Valider
            </Button>
          </Container>
        </Container>
      )}
    </Container>
  )
}

export default ScanBl
