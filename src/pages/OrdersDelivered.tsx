import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import Loading from "../components/ui/Loading";
import { commandes } from "../data/commandes";
import userDataStore from "../store/userDataStore";
import Orderslist from "../components/ui/Orderslist";
import "../App.css";
import "animate.css";

const OrdersDelivered = () => {
  const isLogged = userDataStore((state: any) => state.isLogged);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [orderData, setOrderData] = React.useState<any>([]);
  const [selectedOrder, setSelectedOrder] = React.useState<any>("");


  React.useEffect(() => {
    if (commandes) {
      setIsLoading(false);
      setOrderData(commandes);
    }
  }, []);

  return (
    <div className="cde App bg-secondary">
      {!isLogged && <Navigate to="/connexion" />}
      {isLoading ? (
        <Loading />
      ) : (
        <>
       
          
          <Container className="bg-success animate__animated animate__bounceInUp">
            <Row className="list-cde ps-3 pb-3">
              {orderData &&
                orderData?.map((cde: any) => (
                    <Orderslist key={cde?.id} cde={cde} />
                ))}
            </Row>
          </Container>
        </>
      )}
    </div>
  );
};

export default OrdersDelivered;
