import React from 'react'

import { Container, Row, Col, Button, Alert, Table } from 'react-bootstrap'
// import { QrReader } from 'react-qr-reader'
import BackButton from './BackButton'
import BadgedIcon from './BadgedIcon'
import userDataStore from '../../store/userDataStore'
import OrdersService from '../../service/Orders/OrdersService'
import axios from 'axios'
const ScanBl = ({ scanPageProps }: any) => {
  ////////////////////
  //Props & store
  ///////////////////
  const { selectedOrder, setOrderData, setSelectedOrder, newStatus } = scanPageProps

  const dataStore: any = userDataStore((states: any) => states)

  const [startScan, setStartScan] = React.useState(false)
  const [isDetail, setIsDetail] = React.useState(false)

  

 const myOrder =  {

    "order": {

        "id": 114,

        "id_address_delivery": "5313",

        "id_address_invoice": "5313",

        "id_cart": "128",

        "id_currency": "3",

        "id_lang": "1",

        "id_customer": "2",

        "id_carrier": "64",

        "current_state": "0",

        "module": "osb",

        "invoice_number": "0",

        "invoice_date": "0000-00-00 00:00:00",

        "delivery_number": "0",

        "delivery_date": "0000-00-00 00:00:00",

        "valid": "0",

        "date_add": "2023-07-28 09:37:25",

        "date_upd": "2023-07-28 09:37:25",

        "shipping_number": "",

        "id_shop_group": "1",

        "id_shop": "1",

        "secure_key": "5c9607ec1430704df19f452ce0a241e5",

        "payment": "Carte bancaire",

        "recyclable": "0",

        "gift": "0",

        "gift_message": "",

        "mobile_theme": "0",

        "total_discounts": "0.000000",

        "total_discounts_tax_incl": "0.000000",

        "total_discounts_tax_excl": "0.000000",

        "total_paid": "42340.000000",

        "total_paid_tax_incl": "42340.000000",

        "total_paid_tax_excl": "36188.000000",

        "total_paid_real": "42340.000000",

        "total_products": "36188.000000",

        "total_products_wt": "42340.000000",

        "total_shipping": "0.000000",

        "total_shipping_tax_incl": "0.000000",

        "total_shipping_tax_excl": "0.000000",

        "carrier_tax_rate": "0.000",

        "total_wrapping": "0.000000",

        "total_wrapping_tax_incl": "0.000000",

        "total_wrapping_tax_excl": "0.000000",

        "round_mode": "3",

        "round_type": "1",

        "conversion_rate": "1.000000",

        "reference": "114",

        "associations": {

            "order_rows": [

                {

                    "id": "165",

                    "product_id": "200",

                    "product_attribute_id": "0",

                    "product_quantity": "3",

                    "product_name": "Bouilloire Proline 1L",

                    "product_reference": "test63",

                    "product_ean13": "5698845135421",

                    "product_isbn": "",

                    "product_upc": "16",

                    "product_price": "2094.017093",

                    "id_customization": "0",

                    "unit_price_tax_incl": "2449.999999",

                    "unit_price_tax_excl": "2094.017093"

                },

                {

                    "id": "166",

                    "product_id": "179",

                    "product_attribute_id": "0",

                    "product_quantity": "1",

                    "product_name": "Téléviseur QLED 48\" 4K",

                    "product_reference": "test195",

                    "product_ean13": "9876543219513",

                    "product_isbn": "",

                    "product_upc": "",

                    "product_price": "29905.982906",

                    "id_customization": "0",

                    "unit_price_tax_incl": "34990.000000",

                    "unit_price_tax_excl": "29905.982906"

                }

            ]

        }

    }

}

  const goScan = () => {
    setStartScan(!startScan)
    // setTimeout(() => setLoadingScan(false), 200)
  }


  const getallOrders = (token: any) => {
    OrdersService.allOrders(token).then((response: any) => {
      setOrderData(response.data)
    })
  }



  const changeStatus = () => {
    let data = {
      status: newStatus,
      shippedBy: 'api/users/' + dataStore.id,
    }
    let config = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: process.env.REACT_APP_END_POINT + 'orders/' + selectedOrder.id,
      headers: {
        'Content-Type': 'application/merge-patch+json',
        Authorization: 'Bearer ' + dataStore.token,
      },
      data: data,
    }

    axios
      .request(config)
      .then((response: any) => {
        if (newStatus === 'operin') {
          console.log(selectedOrder?.client?.email)
        }
        console.log(response.data)
        getallOrders(dataStore.token)
        setSelectedOrder(null)
      })
      .catch((error: any) => {
        console.log(error)
      })
  }

  

  return (
    <Container fluid className='pb-5'>
      {/* {!isDetail ? ( */}
      {!selectedOrder ? (
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
        <div className='text-center'>
          <p className='col-12 pb-0 text-center font-75'>Détails de la commande</p>
          <Container className=' bg-secondary rounded-pill shadow my-auto '>
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
              <Col className='m-auto text-light text-start ps-3 pe-2 py-0'>
                <span className='fw-bold font-85'>n° {selectedOrder?.barcode}</span>
              </Col>
            </Row>
          </Container>
          <Table striped className='mt-3'>
            <thead>
              <tr>
                <th className='col-xs-1 text-start text-secondary'>Qté</th>
                <th className='col-xs-6 text-start text-secondary'>Libellé produit</th>
                <th className='col-xs-1 text-end text-secondary'>Montant</th>
              </tr>
            </thead>
            <tbody>
              {myOrder?.order?.associations?.order_rows.map((prod: any, index: any) => (
                <tr key={index}>
                  <td className='text-center font-85'>{prod?.product_quantity}</td>
                  <td className='text-start font-85'>{prod?.product_name}</td>
                  <td className='text-end font-85'>{(parseFloat(prod?.product_price) * parseInt(prod?.product_quantity)).toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={2} className='text-end font-85'>Total HT</td>
                <td className='text-end font-85'>{parseInt(myOrder.order.total_products).toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={2} className='text-end font-85'>Montant TVA</td>
                <td className='text-end font-85'>{(parseInt(myOrder.order.total_products_wt) - parseInt(myOrder.order.total_products)).toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={2} className='text-end font-85'>Total TTC</td>
                <td className='text-end font-85'><b>{parseInt(myOrder.order.total_products_wt).toFixed(2)}</b></td>
              </tr>
            </tbody>
          </Table>

          <Container className='text-end mt-4'>
            <p className='text-start font-85'>Voulez-vous prendre en charge cette commande?</p>
            <Button
              className='bg-warning rounded-pill border-warning text-light ms-3'
              type='submit'
              variant='danger'
              onClick={() => {
                setIsDetail(false)

                setSelectedOrder('')
              }}
            >
              Annuler
            </Button>

            <Button
              className='bg-info rounded-pill border-info text-light ms-3'
              type='submit'
              onClick={() => changeStatus()}
            >
              Valider
            </Button>
          </Container>
        </div>
      )}
    </Container>
  )
}

export default ScanBl
