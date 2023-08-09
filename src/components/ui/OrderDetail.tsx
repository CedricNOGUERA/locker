import React from 'react'
import { Container, Row, Col, Button, Alert, Table, Modal, Spinner } from 'react-bootstrap'
import BackButton from './BackButton'
import BadgedIcon from './BadgedIcon'
import userDataStore from '../../store/userDataStore'
import OrdersService from '../../service/Orders/OrdersService'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const OrderDetail = ({ scanPageProps }: any) => {

  const navigate = useNavigate();

  ////////////////////
  //Props & store
  ///////////////////
  const { selectedOrder, setOrderData, setSelectedOrder, newStatus } = scanPageProps

  const dataStore: any = userDataStore((states: any) => states)

  const [isDetail, setIsDetail] = React.useState<boolean>(false)
  const [isErrorValid, setIsErrorValid] = React.useState<boolean>(false)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isAmount, setIsAmount] = React.useState<boolean>(true)
  const [errorMsg, setErrorMsg] = React.useState<string>('')

  const [show, setShow] = React.useState<boolean>(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const [showUpdateStatus, setShowUpdateStatus] = React.useState<boolean>(false)
  const handleCloseUpdateStatus = () => setShowUpdateStatus(false)
  const handleShowUpdateStatus = () => {
    setShowUpdateStatus(true)
    handleClose()
    setTimeout(() => {
      setSelectedOrder(null)
      handleCloseUpdateStatus()
    }, 2000)
  }

  const myOrder = {
    order: {
      id: 114,

      id_address_delivery: '5313',

      id_address_invoice: '5313',

      id_cart: '128',

      id_currency: '3',

      id_lang: '1',

      id_customer: '2',

      id_carrier: '64',

      current_state: '0',

      module: 'osb',

      invoice_number: '0',

      invoice_date: '0000-00-00 00:00:00',

      delivery_number: '0',

      delivery_date: '0000-00-00 00:00:00',

      valid: '0',

      date_add: '2023-07-28 09:37:25',

      date_upd: '2023-07-28 09:37:25',

      shipping_number: '',

      id_shop_group: '1',

      id_shop: '1',

      secure_key: '5c9607ec1430704df19f452ce0a241e5',

      payment: 'Carte bancaire',

      recyclable: '0',

      gift: '0',

      gift_message: '',

      mobile_theme: '0',

      total_discounts: '0.000000',

      total_discounts_tax_incl: '0.000000',

      total_discounts_tax_excl: '0.000000',

      total_paid: '42340.000000',

      total_paid_tax_incl: '42340.000000',

      total_paid_tax_excl: '36188.000000',

      total_paid_real: '42340.000000',

      total_products: '36188.000000',

      total_products_wt: '42340.000000',

      total_shipping: '0.000000',

      total_shipping_tax_incl: '0.000000',

      total_shipping_tax_excl: '0.000000',

      carrier_tax_rate: '0.000',

      total_wrapping: '0.000000',

      total_wrapping_tax_incl: '0.000000',

      total_wrapping_tax_excl: '0.000000',

      round_mode: '3',

      round_type: '1',

      conversion_rate: '1.000000',

      reference: '114',

      associations: {
        order_rows: [
          {
            id: '165',

            product_id: '200',

            product_attribute_id: '0',

            product_quantity: '3',

            product_name: 'Bouilloire Proline 1L',

            product_reference: 'test63',

            product_ean13: '5698845135421',

            product_isbn: '',

            product_upc: '16',

            product_price: '2094.017093',

            id_customization: '0',

            unit_price_tax_incl: '2449.999999',

            unit_price_tax_excl: '2094.017093',
          },

          {
            id: '166',

            product_id: '179',

            product_attribute_id: '0',

            product_quantity: '1',

            product_name: 'Téléviseur QLED 48" 4K',

            product_reference: 'test195',

            product_ean13: '9876543219513',

            product_isbn: '',

            product_upc: '',

            product_price: '29905.982906',

            id_customization: '0',

            unit_price_tax_incl: '34990.000000',

            unit_price_tax_excl: '29905.982906',
          },
        ],
      },
    },
  }

  const getallOrders = (token: any) => {
    OrdersService.allOrders(token).then((response: any) => {
      setOrderData(response.data)
    }).catch((error: any) => {
      
      if(error?.response?.data?.message === 'Expired JWT Token'){
        alert('Session expirée, reconnectez-vous.')
        navigate('/connexion')
      }
      if(error?.response?.data?.message === 'Invalid JWT Token'){
        navigate('/connexion')
      }
      console.log(error)
    })
  }

  const changeStatus = () => {
    setIsLoading(true)
    console.log(selectedOrder)
    if(selectedOrder?.status === 'picked_up'){
      setIsErrorValid(true)
      setIsLoading(false)
    setErrorMsg(
    'Cette commande est déja prise en charge par ' +
      selectedOrder?.shippedBy?.firstName +
      ", rafraichissez l'application"
)
    }else{

    
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
        console.log(response.data)
        getallOrders(dataStore.token)
        setIsLoading(false)
        handleShowUpdateStatus()
      })
      .catch((error: any) => {
        console.log(error)
        setIsErrorValid(true)
        setIsLoading(false)
      })
    }

  }

  return (
    <Container fluid className='pb-5'>
      <div className='text-center'>
        <p className='col-12 mb-0 text-center font-75'>Détails de la commande</p>
        <Container className='py-0 bg-secondary rounded-pill shadow my-auto '>
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
            <Col className='m-auto text-light text-center ps-1 pe-2 py-0'>
              <span className='fw-bold font-85'>
                <span className='fw-bold font-85'>n° {selectedOrder?.barcode}</span>
              </span>
            </Col>
            <Col xs={2} className='m-auto text-light text-start ps- me-3 py-0'>
              <BadgedIcon
                slot={selectedOrder?.bookingSlot}
                borderColor='secondary'
                imgSize='28px'
              />
            </Col>
          </Row>
        </Container>
        <Table striped className='mt-3'>
          <thead>
            <tr>
              <th className='text-center text-secondary'>Qté</th>
              <th className='text-center text-secondary'>Libellé produit</th>
              {!isAmount && (

                <th className='text-end text-secondary'>Montant</th>
              )}
            </tr>
          </thead>
          <tbody>
            {/* {myOrder?.order?.associations?.order_rows.map((prod: any, index: any) => ( */}
            {selectedOrder?.products?.map((prod: any, index: any) => (
              <tr key={index}>
                <td className='text-center font-85'>{prod?.quantity}</td>
                <td className='text-center font-85'>{prod?.name}</td>
                {!isAmount && (
                  <td className='text-end font-85'>
                  {(
                    parseFloat(prod?.price) * parseInt(prod?.quantity)
                  ).toFixed(0)}
                </td>
                  )}
              </tr>
            ))}
            {!isAmount && (
              <>
                <tr>
                  <td colSpan={2} className='text-end font-85'>
                    Total HT
                  </td>
                  <td className='text-end font-85'>
                    {parseInt(myOrder.order.total_products).toFixed(0)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className='text-end font-85'>
                    Montant TVA
                  </td>
                  <td className='text-end font-85'>
                    {(
                      parseInt(myOrder.order.total_products_wt) -
                      parseInt(myOrder.order.total_products)
                    ).toFixed(0)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className='text-end font-85'>
                    Total TTC
                  </td>
                  <td className='text-end font-85'>
                    <b>{parseInt(myOrder.order.total_products_wt).toFixed(0)}</b>
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </Table>
        <Container className='text-end mt-4'>
          <Button
            className='bg-info rounded-pill border-info text-light ms-3'
            type='submit'
            onClick={handleShow}
          >
            Valider
          </Button>
        </Container>
      </div>

      <Modal show={showUpdateStatus} onHide={handleCloseUpdateStatus}>
        <Modal.Body className='bg-dark rounded text-light'>
          {' '}
          {''}
          <Row className='m-auto'>
            <Col xs={2}>
              <i className='ri-checkbox-circle-line text-success fs-1 me-2 animate__animated animate__fadeInDown'></i>
            </Col>
            <Col className='m-auto'>Commande prise en charge</Col>
          </Row>
        </Modal.Body>
      </Modal>

      <Modal show={show} onHide={handleClose}>
        {isErrorValid ? (
          <>
            <Modal.Header closeButton>
              <Modal.Title><i className="ri-error-warning-line fs-2 text-warning"></i>Attention</Modal.Title>
            </Modal.Header>
            <Modal.Body>{errorMsg ? errorMsg : 'Une anomalie est survenue... Rafraichissez la page'}</Modal.Body>
            <Modal.Footer>
              <Button
                size='lg'
                className=' rounded-pill border-warning text-light ms-3 px-4'
                variant='warning'
                onClick={() => {
                  setIsDetail(false)
                  setSelectedOrder('')
                  handleClose()
                  setIsErrorValid(false)
                }}
              >
                Réessayez
              </Button>
            </Modal.Footer>
          </>
        ) : (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Préparation</Modal.Title>
            </Modal.Header>
            <Modal.Body>Voulez-vous prendre en charge cette commande ?</Modal.Body>
            <Modal.Footer>
              <Button
                size='lg'
                className=' rounded-pill border-warning text-light ms-3 px-4'
                variant='warning'
                onClick={() => {
                  setIsDetail(false)
                  setSelectedOrder('')
                  handleClose()
                }}
              >
                Non
              </Button>
              <Button
                size='lg'
                type='submit'
                className='bg-info rounded-pill border-info text-light ms-3 px-4 '
                onClick={changeStatus}
              >
                {isLoading ? <Spinner size='sm' as='span' /> : 'Oui'}
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </Container>
  )
}

export default OrderDetail
