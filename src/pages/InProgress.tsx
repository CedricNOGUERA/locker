import React from "react";
import { Container, Row } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import Loading from "../components/ui/Loading";
import { commandes } from "../data/commandes";
import userDataStore from "../store/userDataStore";
import Orderslist from "../components/ui/Orderslist";
import QrCode from "../components/QrCode";
import "../App.css";
import "animate.css";

const InProgress = () => {

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
    <div className="cde App">
      {!isLogged && <Navigate to="/connexion" />}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {!selectedOrder ? (
            <Container className=" animate__animated animate__backInLeft  ">
              <Row className="list-cde ps-3 pb-3">
                {orderData &&
                  orderData?.map((cde: any) => (
                    <Orderslist
                      key={Math.random()}
                      cde={cde}
                      setSelectedOrder={setSelectedOrder}
                    />
                  ))}
              </Row>
            </Container>
          ) : (
            <>
              <Container className="my-2">
                <i
                  className="ri-arrow-left-line text-light fs-4 bg-secondary rounded-pill"
                  onClick={() => setSelectedOrder("")}
                ></i>
              </Container>

              <Container className="">
                {/* Pour cette commande il y a: */}
                <div className="bg-secondary text-center text-light rounded shadow-lg py-1">
                  <i className="ri-temp-cold-line fs-4 align-middle"></i> : <small className="align-middle">frais & ambiant</small>
                  <br />
                  <i className="ri-shopping-basket-2-line fs-4 align-middle"></i> : <small className="align-middle"> 1 frais et 1
                  ambiant</small>
                </div>
                <div className="bg-light text-center"></div>
              </Container>

              <Container className="text-center py-0 ">
                <small className="text-danger">haut du qrcode</small>{" "}
                <div className="bounced-arrow justify-content-around">
                  <i className="ri-arrow-up-fill "></i>
                  <i className="ri-arrow-up-fill "></i>
                  <i className="ri-arrow-up-fill "></i>
                </div>
              </Container>
              <Container className="bg-light p-2 w-75   animate__animated animate__fadeInDown">
                <QrCode orderNum={selectedOrder} />
              </Container>
              <Container className="text-center text-danger">
                <small>Respectez le sens du qrcode lors du scan</small>
              </Container>
              <Container className="px-2 text-center mt-4">
                <div className="bg-secondary text-light rounded-pill shadow">
                  Saisie manuelle :{" "}
                  <p className="text-info fw-bold">{selectedOrder}</p>
                </div>
              </Container>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default InProgress;
