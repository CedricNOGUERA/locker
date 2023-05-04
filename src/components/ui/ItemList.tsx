import { Button, Col, Row } from "react-bootstrap";

const ItemList = ({ liv, setSelectedOrder, setSearchOrder }: any) => {
  

  const tempZone = (liv?.bookingSlot.slot.temperatureZone?.keyTemp === "FRESH" || liv?.bookingSlot.slot.temperatureZone?.myKey === "C" ) ? "organic-food" : (liv?.bookingSlot.slot.temperatureZone?.keyTemp === "FREEZE" || liv?.bookingSlot.slot.temperatureZone?.myKey === "F") ? "winter"  : (liv?.bookingSlot.slot.temperatureZone?.keyTemp === "NORMAL" || liv?.bookingSlot.slot.temperatureZone?.myKey === "CA") ? "dry" : ""
 


  return (
    <div className='my-3 px-3 py-2 bg-white rounded shadow'>
      <Row className='py-'>
        <Col xs={2} className='m-auto'>
          <span key={Math.random()}>
            <img
              alt='Temp icon'
              src={'https://img.icons8.com/color/512/' + tempZone + '.png'}
              style={{ width: '40px' }}
            />{' '}
          </span>
        </Col>
        <Col className='ff-agency text-secondary text-center align-middle m-auto py-0'><small>{liv?.barcode}</small></Col>
        <Col xs={2} className='m-auto me-3 py-0'>
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
