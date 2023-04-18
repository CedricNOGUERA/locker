import { Container } from 'react-bootstrap'
import ItemList from './ItemList'
import images from "../../styles/no-order-min.png";


const OrderList = ({orderListProps}:  any) => {
  const {orderData, filteredOrder, setSelectedOrder, searchOrder, setSearchOrder, allSlot, orderByStatus} = orderListProps

return (
    <Container className="order-list animate__animated animate__backInLeft">
    {orderByStatus && orderByStatus?.length > 0 ? (
      filteredOrder && filteredOrder?.length > 0 ? (
        filteredOrder?.map((liv: any, indx: any) => (
          <ItemList
            key={Math.random()}
            liv={liv}
            indx={indx}
            setSelectedOrder={setSelectedOrder}
            setSearchOrder={setSearchOrder}
          />
        ))
      ) : filteredOrder?.length === 0 && searchOrder?.length > 2 ? (
        <div className=" text-center mt-5 pt-5">
          <div className="user-name fs-3 fw-bold text-secondary">
          < i className="ri-search-line me-1 align-bottom"></i> Aucune commande trouvée
          </div>
          <img
            className=""
            alt="icon"
            src={images}
            style={{ height: "256px" }}
          />
        </div>
      ) : (
        orderByStatus?.map((liv: any, indx: any) => (
          <ItemList
            key={Math.random()}
            liv={liv}
            indx={indx}
            setSelectedOrder={setSelectedOrder}
            setSearchOrder={setSearchOrder}
            allSlot={allSlot}
          />
        )))
      ) : (
    // ) : (
      <div className=" text-center mt-5 pt-5">
        <img
          className=""
          alt="Galleryicon"
          src={images}
          style={{ height: "256px" }}
        />
        <div className="user-name fs-3 fw-bold text-secondary">
          Aucune commande
        </div>
      </div>
    )}
  </Container>
  )
}

export default OrderList