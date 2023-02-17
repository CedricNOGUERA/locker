import React from "react";
import { Container, Row } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import Loading from "../components/ui/Loading";
import { commandes } from "../data/commandes2";
import userDataStore from "../store/userDataStore";
import Orderslist from "../components/ui/Orderslist";
import "../App.css";
import "animate.css";
import  images from "../styles/no-order.png";


const OrdersDelivered = () => {
  const isLogged = userDataStore((state: any) => state.isLogged);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [orderData, setOrderData] = React.useState<any>([]);
  // const [selectedOrder, setSelectedOrder] = React.useState<any>("");


  React.useEffect(() => {
    if (commandes) {
      setIsLoading(false);
      setOrderData(commandes);
    }
  }, []);

  const orderTab = orderData.filter((order: any) => (order.status === "delivered"))

  return (
    <div className="cde">
      {!isLogged && <Navigate to="/connexion" />}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Container className=" animate__animated animate__bounceInUp">
            <Row className="list-cde ps-3 pb-3">
              {orderTab.length > 0 ? (
                orderData?.map((cde: any) =>
                  cde?.status === "delivered" ? (
                    <Orderslist key={cde?.id} cde={cde} />
                  ) : null
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
            </Row>
          </Container>
        </>
      )}
    </div>
  );
};

export default OrdersDelivered;
