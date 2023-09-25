import moment from 'moment'
import { Button, Col, Row } from 'react-bootstrap'
import { _getStatus } from '../../utils/functions'
import BadgedIcon from '../ui/BadgedIcon'
import 'moment/locale/fr'
import age18 from '../../styles/alcool.png'

const ItemList = ({ liv, setSelectedOrder, setSearchOrder, trigger }: any) => {
  const formattedDate = (dateStr: any) => {
    moment.locale('fr')
    const formattedDate = moment(dateStr).format('D MMM yy')
    return formattedDate
  }

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
            <BadgedIcon slot={liv?.bookingSlot} borderColor='light' imgSize='30px' />
          </span>
        </Col>
        <Col className='text-secondary text-start align-bottom m-auto py-0 pe-0 ps-3 ps-md-4  my-0'>
          <small className='ff-agency font-75 '>{liv?.barcode}</small>
          {trigger !== 'history' && (
            <small className='font-65'> - {formattedDate(liv?.createdAt)}</small>
          )}
          <p className='font-75 mb-0'>
            {trigger === 'history' ? (
              <>
                <span className='text-secondary fw-bold'>{liv?.externalOrderId}</span> - {''}
                <span className='text-green fw-bold'>{_getStatus(liv?.status)}</span>
                {liv?.ageRestriction === 18 && (
                  <img src={age18} alt='+18ans' width={24} /> 
                )}
              </>
            ) : (
              <>
                <span className='text-secondary fw-bold'>{liv?.externalOrderId}</span>{' '}{liv?.externalOrderId && "-" } {' '}
                <span className='text-green fw-bold'>
                  {liv?.bookingSlot?.slot?.temperatureZone?.locker?.city}
                  
                </span>{' '}
                {liv?.ageRestriction === 18 && (
                  <img src={age18} alt='+18ans' width={24} />
                )}
              </>
            )}
          </p>
        </Col>
        {trigger === 'history' ? (
          <Col xs={2} className='font-65 m-auto me-2 p-0 text-end text-secondary'>
            {formattedDate(liv?.createdAt)}
          </Col>
        ) : trigger === 'preparations' ? (
          <Col xs={2} className='m-auto py-0 text-end'>
            <i className='ri-checkbox-line fs-2 text-secondary'></i>
          </Col>
        ) : (
          <Col xs={2} className='m-auto  py-0 text-end'>
            <span className='rounded  px-2 py-1 border border-green border-2'>
              <i className='ri-qr-code-line text-secondary align-bottom'></i>
            </span>
          </Col>
        )}
      </Row>
    </div>
  )
}

export default ItemList
