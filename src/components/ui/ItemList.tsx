import moment from "moment";
import { Button, Col, Row } from "react-bootstrap";

const ItemList = ({ liv, setSelectedOrder, setSearchOrder, trigger }: any) => {
  

  const tempZone = (liv?.bookingSlot.slot.temperatureZone?.keyTemp === "FRESH" || liv?.bookingSlot.slot.temperatureZone?.myKey === "C" ) ? "organic-food" : (liv?.bookingSlot.slot.temperatureZone?.keyTemp === "FREEZE" || liv?.bookingSlot.slot.temperatureZone?.myKey === "F") ? "winter"  : (liv?.bookingSlot.slot.temperatureZone?.keyTemp === "NORMAL" || liv?.bookingSlot.slot.temperatureZone?.myKey === "CA") ? "dry" : ""
 


  return (
    <div className='mb- px-3  bg-white rounded'  onClick={() => {
      trigger === "history" && 
      setSearchOrder('')
      setSelectedOrder(liv)
    }}>
      <Row>
        <Col xs={2} className='m-auto'>
          <span key={Math.random()}>
            <img
              alt='Temp icon'
              src={'https://img.icons8.com/color/512/' + tempZone + '.png'}
              style={{ width: '40px' }}
            />{' '}
          </span>
        </Col>
        <Col className='text-secondary text-start align-bottom m-auto py-0 pt-3'>
          <small className="ff-agency font-85 text-dar">{liv?.barcode}</small>
          <p className="font-75">{liv?.bookingSlot.slot.temperatureZone.locker.location}</p>
        </Col>
        {trigger !== "history" ? (
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
          ) : (
            <Col xs={3} className='font-75 m-auto me-3 py-0 text-end text-secondary'>
              {moment(liv?.updatedAt).format('D MMM')}
          </Col>
          )
          }
      </Row>
    </div>
  )
};

export default ItemList;
