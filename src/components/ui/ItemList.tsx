import moment from "moment";
import { Button, Col, Row } from "react-bootstrap";
import { _getStatus } from "../../utils/functions";

const ItemList = ({ liv, setSelectedOrder, setSearchOrder, trigger }: any) => {

  const tempZone = (liv?.bookingSlot.slot.temperatureZone?.keyTemp === "FRESH" || liv?.bookingSlot.slot.temperatureZone?.myKey === "C" ) ? "organic-food" : (liv?.bookingSlot.slot.temperatureZone?.keyTemp === "FREEZE" || liv?.bookingSlot.slot.temperatureZone?.myKey === "F") ? "winter"  : (liv?.bookingSlot.slot.temperatureZone?.keyTemp === "NORMAL" || liv?.bookingSlot.slot.temperatureZone?.myKey === "CA") ? "dry" : ""

  return (
    <div className='list-item  ps-2 pe-3  bg-white rounded mb-3'>
      <Row
        onClick={() => {
          //  if (trigger === "history") {
          setSearchOrder('')
          setSelectedOrder(liv)
          //   } else {
          // return undefined
          //   }
        }}
      >
        <Col xs={2} md={1} className='m-auto py-0 '>
          <span key={Math.random()}>
            <img
              alt='Temp icon'
              src={'https://img.icons8.com/color/52/' + tempZone + '.png'}
              style={{ width: '40px', height: '40px' }}
            />{' '}
          </span>
        </Col>
        <Col className='text-secondary text-start align-bottom m-auto py-0 my-0'>
          <small className='ff-agency font-75 '>{trigger === 'history' && liv?.bookingSlot?.slot?.temperatureZone.locker.location}  {liv?.barcode}</small>
          <p className='font-75 mb-0'>
            {liv?.client?.email}
            {trigger === 'history' && (
              <span>
                {' '}
                - <span className='text-info fw-bold'>{_getStatus(liv?.status)}</span>
              </span>
            )}
          </p>
        </Col>
        {trigger !== 'history' ? (
          <Col xs={1} className='m-auto me-5 me-md-2 py-0 text-end'>
            <Button
              variant='outline-info'
              onClick={() => {
                setSearchOrder('')
                setSelectedOrder(liv)
              }}
              className='ms-2 rounded  px-2 py-0 border border-info border-2'
            >
              <i className='ri-qr-code-line text-secondary'></i>
            </Button>
          </Col>
        ) : (
          <Col xs={1} className='font-75 m-auto me-2 p-0 text-end text-secondary'>
            {moment(liv?.createdAt).format('D MMM')}
          </Col>
        )}
      </Row>
    </div>
  )
};

export default ItemList;
