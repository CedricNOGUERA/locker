import { Button, Col, Row } from "react-bootstrap";

const ItemList = ({ cde, setSelectedOrder, setSearchOrder, indx, myData, allSlot }: any) => {
  

  const tempZone = allSlot?.slot?.temperatureZone?.keyTemp === "NORMAL" ? "dry" : cde?.slot?.temperatureZone?.keyTemp === "FRESH" ? "organic-food" : "winter"

  return (
    <div className='my-3 px-3 py-0 bg-white rounded-pill shadow'>
      <Row className='py-1'>
        <Col xs={4} className='m-auto'>
          <span key={Math.random()}>
            <img
              alt='Refroidissement icon'
              src={'https://img.icons8.com/color/512/' + tempZone + '.png'}
              style={{ width: '20px' }}
            />{' '}
          </span>
        </Col>
        <Col className='text-secondary align-middle m-auto'>{cde?.barcode}</Col>
        <Col xs={3} className='m-auto'>
          <Button
            variant='outline-info'
            onClick={() => {
              setSearchOrder('')
              setSelectedOrder(cde)
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
