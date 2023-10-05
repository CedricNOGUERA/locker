import moment from 'moment'
import { Col, Row } from 'react-bootstrap'
import { _getStatus, _shortLocation } from '../../utils/functions'
import BadgedIcon from '../ui/BadgedIcon'
import 'moment/locale/fr'
import age18 from '../../styles/alcool.webp'

const ItemList = ({ liv, setSelectedOrder, setSearchOrder, trigger }: any) => {
  const formattedDate = (dateStr: any) => {
    moment.locale('fr')
    const formattedDate = moment(dateStr).format('D MMM yy')
    return formattedDate
  }

  return (
    <div className='list-item  ps-2 pe-3  rounded mb-3'>
      <Row
        onClick={() => {
          setSearchOrder('')
          setSelectedOrder(liv)
        }}
      >
        <Col xs={2} md={1} className='m-auto py-0 '>
          <span key={Math.random()}>
            <BadgedIcon slot={liv?.bookingSlot} borderColor='darkGray' imgSize='30px' />
          </span>
        </Col>
        <Col className='text-yellow text-start align-bottom m-auto py-0 pe-0 ps-3 ps-md-4  my-0'>
          <small className='ff-agency font-75 '>{liv?.barcode}</small>
          {trigger !== 'history' && (
            <small className='font-65'> - {formattedDate(liv?.createdAt)}</small>
          )}
          <p className='font-75 mb-0'>
            {trigger === 'history' ? (
              <>
                <span className='text-green fw-bold'>{_getStatus(liv?.status)}</span> - {''}
                <span className='text-light'>
                  {_shortLocation(liv?.bookingSlot?.slot?.temperatureZone?.locker["@id"])}
                </span>{' '}
                {liv?.ageRestriction === 18 && (
                  <img src={age18} alt='+18ans' width={24} /> 
                )}
              </>
            ) : (
              <>
                <span className='text-green fw-bold'>
                  {liv?.bookingSlot?.slot?.temperatureZone?.locker["@id"] === '/api/lockers/1' ? 'Côté mer' : liv?.bookingSlot?.slot?.temperatureZone?.locker["@id"] === '/api/lockers/2' ? 'Côté mont.' : liv?.bookingSlot?.slot?.temperatureZone?.locker["@id"] === '/api/lockers/4' ? "Faa'a" : 'Arue'}
                </span>
                
                {' '}
                {liv?.ageRestriction === 18 && (
                  <img src={age18} alt='+18ans' width={24} height={24} />
                )}
              </>
            )}
          </p>
        </Col>
        {trigger === 'history' ? (
          <Col xs={2} className='font-65 m-auto me-2 p-0 text-end text-yellow'>
            {formattedDate(liv?.createdAt)}
          </Col>
        ) : trigger === 'preparations' ? (
          <Col xs={2} className='m-auto py-0 text-end'>
            <i className='ri-checkbox-line fs-2 text-light'></i>
          </Col>
        ) : trigger === 'livraisons' ? (
          <Col xs={2} className='m-auto  py-0 text-end'>
            <span className='rounded  px-2 py-1 border border-green border-2'>
              <i className='ri-truck-line text-light align-bottom'></i>
            </span>
          </Col>
        ) : (
          <Col xs={2} className='m-auto  py-0 text-end'>
            <span className='rounded  px-2 py-1 border border-green border-2'>
              <i className='ri-inbox-unarchive-line text-light align-bottom'></i>
            </span>
          </Col>
        )}
      </Row>
    </div>
  )
}

export default ItemList
