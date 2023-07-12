import moment from "moment";
import { Button, Col, Row } from "react-bootstrap";
import { _getStatus } from "../../utils/functions";
import BadgedIcon from '../ui/BadgedIcon'
import 'moment/locale/fr';


const ItemList = ({ liv, setSelectedOrder, setSearchOrder, trigger }: any) => {

  const formattedDate = (dateStr: any) => {
    moment.locale('fr');
    const formattedDate = moment(dateStr).format('D MMM yy');
    return formattedDate;
  };

  return (
    <div className='list-item  ps-2 pe-3  bg-white rounded mb-3'>
      <Row
        onClick={() => {
          setSearchOrder('')
          setSelectedOrder(liv)
        }}
      >
        <Col xs={2} md={1} className='m-auto py-0 '>
          <span key={Math.random()}>
            <BadgedIcon slot={liv?.bookingSlot} borderColor='light' imgSize='40px' />
          </span>
        </Col>
        <Col className='text-secondary text-start align-bottom m-auto py-0 pe-0 ps-3 my-0'>
          <small className='ff-agency font-75 '>{liv?.barcode}</small>
          <p className='font-75 mb-0'>
            {liv?.client?.email}
            {trigger === 'history' ? (
              <>
                {' '}
                - <span className='text-info fw-bold'>{_getStatus(liv?.status)}</span>
              </>
            ) : (
              <>
                {' '}
                -{' '}
                <span className='text-info fw-bold'>
                  {liv?.bookingSlot?.slot?.temperatureZone?.locker?.city}
                </span>
              </>
            )}
          </p>
        </Col>
        {trigger === 'history' ? (
          <Col xs={2} className='font-65 m-auto me-2 p-0 text-end text-secondary'>
            {/* { moment(liv?.createdAt).format('D MMM')} */}
            { formattedDate(liv?.createdAt)}
          </Col>
        ) : (
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
        )}
      </Row>
    </div>
  )
};

export default ItemList;
