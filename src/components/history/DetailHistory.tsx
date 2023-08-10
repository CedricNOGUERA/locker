import moment from 'moment'
import { _getStatus, _getStatusMsg } from '../../utils/functions'

const DetailHistory = ({ selectedOrder }: any) => {
  ///sort history function
  const sortedHistory = selectedOrder.history.sort((a: any, b: any) => {
    const dateA: any = new Date(a.createdAt);
    const dateB: any = new Date(b.createdAt);
    return dateA - dateB;
  });
  
  return (
    <div className='history-tl-container animate__animated animate__backInLeft pb-5'>
      <ul className='tl d-flex flex-column-reverse '>
        {selectedOrder &&
          selectedOrder?.history?.length > 0 &&
          selectedOrder?.history?.map((order: any) => (
            <li key={Math.random()} className='tl-item' ng-repeat='item in retailer_history'>
              {order.status === 'created' ? (
                <div className='timestamp'>
                  {moment(selectedOrder.createdAt).format('DD/MM/YY')}
                  <br /> {moment(selectedOrder.createdAt).format('HH:mm:ss')}
                </div>
              ) : (
                <div className='timestamp'>
                  {moment(order.createdAt).format('DD/MM/YY')}
                  <br /> {moment(order.createdAt).format('HH:mm:ss')}
                </div>
              )}
              <div className='item-title'>{_getStatus(order.status)}</div>
              <div className='item-detail'> {_getStatusMsg(order.status)}</div>
              <div className='item-detail'>
                {' '}
                {(order.status === 'picked_up' || order.status === 'operin') && (
                  <p>
                    Livreur : {selectedOrder?.shippedBy?.firstName}{' '}
                    {selectedOrder?.shippedBy?.lastName}
                  </p>
                )}{' '}
              </div>
            </li>
          ))}

        {selectedOrder && (
          <li className='tl-item-current' ng-repeat='item in retailer_histor'>
            <div className='timestamp-current fw-bold'>
              {selectedOrder?.history?.length > 0
                ? moment(
                    selectedOrder?.history[selectedOrder?.history?.length]?.updatedAt
                  ).format('DD/MM/YY')
                : moment(selectedOrder?.createdAt).format('DD/MM/YY')}
              <br />{' '}
              {selectedOrder?.history?.length > 0
                ? moment(selectedOrder?.updatedAt).format('HH:mm:ss')
                : moment(selectedOrder?.createdAt).format('HH:mm:ss')}
            </div>
            <div className='item-title-current'>{_getStatus(selectedOrder.status)}</div>

            <div className='item-detail-current fw-bold'>
              {' '}
              {_getStatusMsg(selectedOrder.status)}
            </div>
            {(selectedOrder.status === 'picked_up' || selectedOrder.status === 'operin') && (
              <div className='item-detail'>
                Livreu : {selectedOrder?.shippedBy?.firstName}{' '}
                {selectedOrder?.shippedBy?.lastName}
              </div>
            )}
          </li>
        )}
      </ul>
    </div>
  )
}

export default DetailHistory
