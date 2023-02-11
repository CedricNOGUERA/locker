import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import "../App.css";
import Loading from "../components/ui/Loading";
import { commandes } from "../data/commandes";
import userDataStore from "../store/userDataStore";
import "animate.css";
import Orderslist from "../components/ui/Orderslist";

const OrdersDelivered = () => {
  const isLogged = userDataStore((state: any) => state.isLogged);
  const dataStore = userDataStore((state: any) => state);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (commandes) {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="cde App bg-secondary">
      {!isLogged && <Navigate to="/connexion" />}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Container fluid className="bg-secondary py-3 text-light">
            <Row>
              <Col>Commandes déposées</Col>
              <Col
                xs={5}
                className="align-middle animate__animated animate__bounceIn"
              >
                <i className="ri-user-fill text-secondary fs-5 bg-light rounded-circle p-1 me-2"></i>
                <span className="pb-1">
                  {dataStore.firstname} {dataStore.lastname}
                </span>
              </Col>
            </Row>
          </Container>
          <Container className="bg-success animate__animated animate__bounceInUp">
            <Row>
              {commandes &&
                commandes?.map((cde: any) => (
                  <Col key={cde?.id} xs={12} className="ms-3 py-2">
                    <Orderslist cde={cde} />
                  </Col>
                ))}
            </Row>
          </Container>
        </>
      )}
    </div>
  );
};

export default OrdersDelivered;
