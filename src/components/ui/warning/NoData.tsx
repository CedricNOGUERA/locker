import React from 'react'

const NoData = ({images, isFilteredOrders, msg, msg2}: any ) => {


  return (
    <div className='text-center mt-0 pt-0 mt-md-5 pt-md-5'>
      <img className='' alt='no order' src={images} style={{ height: '216px' }} />
      {isFilteredOrders ? (
        <div className='user-name fs-3 fw-bold text-secondary'>
          <i className='ri-search-line me-1 align-bottom'></i> Aucune commande trouvée
        </div>
      ) : (
        <div className='user-name fs-3 fw-bold text-secondary'>Aucune commande</div>
      )}
    </div>
  )
}

export default NoData
