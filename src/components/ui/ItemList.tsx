import { Button, Col, Row } from "react-bootstrap";

const ItemList = ({ liv, setSelectedOrder, setSearchOrder, indx, allSlot }: any) => {
  

  const tempZone = allSlot?.slot?.temperatureZone?.keyTemp === "NORMAL" ? "dry" : liv?.slot?.temperatureZone?.keyTemp === "FRESH" ? "organic-food" : "winter"

  return (
    <div className='my-3 px-3 py-2 bg-white rounded-pill shadow'>
      <Row className='py-1'>
        <Col xs={2} className='m-auto'>
          <span key={Math.random()}>
            <img
              alt='Refroidissement icon'
              src={'https://img.icons8.com/color/512/' + tempZone + '.png'}
              style={{ width: '20px' }}
            />{' '}
          </span>
        </Col>
        <Col className='text-secondary text-center align-middle m-auto'>{liv?.barcode}</Col>
        <Col xs={3} className='m-auto'>
          <Button
            variant='outline-info'
            onClick={() => {
              setSearchOrder('')
              setSelectedOrder(liv)
            }}
            className='ms-2 rounded text-center px-2 py-0 border border-info border-2'
          >
            <i className='ri-qr-code-line text-secondary'></i>
          </Button>
        </Col>
      </Row>
    </div>
  )
};

export default ItemList;
