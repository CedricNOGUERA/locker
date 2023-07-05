import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import ItemList from '../../components/ui/ItemList'
import { _searchWithRegex } from '../../utils/functions'
import images from '../../styles/no-order-min.png'
import PlaceHolder from '../../components/ui/loading/PlaceHolder'
import TopSearchBar from '../../components/history/TopSearchBar'
import DetailHistory from '../../components/history/DetailHistory'
import AlertIsError from '../../components/ui/warning/AlertIsError'

const History = () => {
  //////////////////////////
  // booleans States
  /////////////////////////
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isError, setIsError] = React.useState<boolean>(false)

  //////////////////////////
  // Store & context state
  /////////////////////////
  const [
    selectedStore,
    setSelectedStore,
    orderData,
    setOrderData,
    selectedOrderCity,
    setSelectedOrderCity,
    allSlot,
    setAllSlot,
    selectedItem,
    setSelectedItem,
  ] = useOutletContext<any>()

  //////////////////////////
  // States
  /////////////////////////
  const [selectedOrder, setSelectedOrder] = React.useState<any>('')
  const [searchOrder, setSearchOrder] = React.useState<any>('')
  const [filteredOrder, setFilteredOrder] = React.useState<any>([])

  React.useEffect(() => {
    setIsLoading(true)
    setSelectedItem('user')
  }, [])

  React.useEffect(() => {
    if (
      (orderData && orderData['hydra:member']?.length > 0) ||
      (filteredOrder && filteredOrder['hydra:member']?.lenght > 0)
    ) {
      setIsLoading(false)
    } else {
      if (
        (orderData && orderData['hydra:member']?.length < 0) ||
        (filteredOrder && filteredOrder['hydra:member']?.lenght < 0)
      ) {
        setIsError(true)
        setIsLoading(false)
      }
      setIsLoading(false)
    }
  }, [orderData])

  React.useEffect(() => {
    _searchWithRegex(searchOrder, orderData['hydra:member'], setFilteredOrder)
  }, [orderData, searchOrder])

  const topSearchBarProps = { selectedOrder, setSelectedOrder, searchOrder, setSearchOrder }

  return (
    <Container className='order-list pb-5 mb-5'>
      {!isLoading && <TopSearchBar topSearchBarProps={topSearchBarProps} />}
      {selectedOrder && <DetailHistory selectedOrder={selectedOrder} />}
      {isError ? (
        <div className='my-4'>
          <AlertIsError
            title='Une erreur est survenue'
            msg='Réessayez ou contactez votre administrateur'
            colorIcon='danger'
          />
        </div>
      ) : isLoading ? (
        <Container className='text-center mt-2'>
          <PlaceHolder paddingYFirst='3' />
        </Container>
      ) : !selectedOrder &&
        filteredOrder &&
        filteredOrder.length > 0 &&
        searchOrder?.length > 2 ? (
        filteredOrder.map((liv: any, indx: any) => (
          <Container key={Math.random()} className='px-0 animate__animated animate__backInLef'>
            <ItemList
              liv={liv}
              indx={indx}
              setSelectedOrder={setSelectedOrder}
              setSearchOrder={setSearchOrder}
              trigger='history'
            />
          </Container>
        ))
      ) : !selectedOrder &&
        searchOrder?.length < 2 &&
        orderData &&
        orderData['hydra:member']?.length > 0 ? (
        orderData['hydra:member']?.map((liv: any, indx: any) => (
          <Container
            key={Math.random()}
            className='px-0 animate__animated animate__backInLeft'
          >
            <ItemList
              key={Math.random()}
              liv={liv}
              indx={indx}
              setSelectedOrder={setSelectedOrder}
              setSearchOrder={setSearchOrder}
              allSlot={allSlot}
              trigger='history'
            />
          </Container>
        ))
      ) : (searchOrder && filteredOrder && filteredOrder.length === 0) ||
        (orderData && orderData['hydra:member']?.length === 0) ? (
        <div className=' text-center mt-5 pt-5'>
          <img className='' alt='no order' src={images} style={{ height: '256px' }} />
          <div className='user-name fs-3 fw-bold text-secondary'>Aucune commande</div>
        </div>
      ) : null}
    </Container>
  )
}

export default History
