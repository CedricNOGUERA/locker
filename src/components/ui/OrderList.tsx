import React from 'react'
import { Container } from 'react-bootstrap'
import ItemList from './ItemList'

const OrderList = ({orderTab, filteredOrder, setSelectedOrder, searchOrder, setSearchOrder, images}:  any) => {
  return (
    <Container className="animate__animated animate__backInLeft  ">
    {orderTab.length > 0 ? (
      filteredOrder.length > 0 ? (
        filteredOrder?.map((cde: any) => (
          <ItemList
            key={Math.random()}
            cde={cde}
            setSelectedOrder={setSelectedOrder}
            setSearchOrder={setSearchOrder}
          />
        ))
      ) : filteredOrder.length === 0 && searchOrder.length > 2 ? (
        <div className=" text-center mt-5 pt-5">
          <div className="user-name fs-3 fw-bold text-secondary">
            Aucune commande trouvée 🔍
          </div>
          <img
            className=""
            alt="Galleryicon"
            src={images}
            style={{ height: "256px" }}
          />
        </div>
      ) : (
        orderTab?.map((cde: any) => (
          <ItemList
            key={Math.random()}
            cde={cde}
            setSelectedOrder={setSelectedOrder}
            setSearchOrder={setSearchOrder}
          />
        ))
      )
    ) : (
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