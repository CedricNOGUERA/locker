import moment from 'moment'
import React from 'react'
import { _getStatus, _getStatusMsg } from '../../utils/functions'

const DetailHistory = ({selectedOrder}: any) => {
    
  return (
    <div className='history-tl-container animate__animated animate__backInLeft pb-5'>
    <ul className='tl d-flex flex-column-reverse '>
      {selectedOrder &&
        selectedOrder?.history?.length > 0 &&
        selectedOrder?.history?.map((order: any) => (
          <li
            key={Math.random()}
            className='tl-item'
            ng-repeat='item in retailer_history'
          >
            {
            order.status === 'created' ? (
              <div className='timestamp'>
                {moment(selectedOrder.createdAt).format('DD/MM/YY')}
                <br /> {moment(selectedOrder.createdAt).format('HH:mm:ss')}
              </div>
            ) 
            : (
              <div className='timestamp'>
                {moment(order.createdAt).format('DD/MM/YY')}
                <br /> {moment(order.createdAt).format('HH:mm:ss')}
              </div>
             
            )
            }
            <div className='item-title'>{_getStatus(order.status)}</div>
            <div className='item-detail'> {_getStatusMsg(order.status)}</div>
          </li>
        ))}

      {selectedOrder && (
        <li className='tl-item-current' ng-repeat='item in retailer_histor'>
          <div className='timestamp-current fw-bold'>
            {selectedOrder?.history?.length > 0
              ? moment(
                  selectedOrder?.history[selectedOrder?.history?.length ]?.updatedAt
                ).format('DD/MM/YY')
              : moment(selectedOrder?.createdAt).format('DD/MM/YY')}
            <br />{' '}
            {selectedOrder?.history?.length > 0
              ? moment(
                  // selectedOrder?.history[selectedOrder?.history?.length]?.updatedAt
                  selectedOrder?.updatedAt
                ).format('HH:mm:ss')
              : moment(selectedOrder?.createdAt).format('HH:mm:ss')}
          </div>
          <div className='item-title-current'>{_getStatus(selectedOrder.status)}</div>

          <div className='item-detail-current fw-bold'>
            {' '}
            {_getStatusMsg(selectedOrder.status)}
          </div>
        </li>
      )}
    </ul>
  </div>
  )
}

export default DetailHistory