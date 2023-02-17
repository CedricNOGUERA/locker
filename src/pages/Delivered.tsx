import React from "react";
import { Col, Container, Dropdown, Row } from "react-bootstrap";
import { Navigate, useOutletContext } from "react-router-dom";
import Loading from "../components/ui/Loading";
import userDataStore from "../store/userDataStore";
import ItemList from "../components/ui/ItemList";
import QrCode from "../components/QrCode";
import "../App.css";
import "animate.css";
import { message, notification } from "antd";
import type { NotificationPlacement } from "antd/es/notification/interface";
import images from "../styles/no-order.png";
import { _notif } from "../utils/functions";
import SearchBar from "../components/ui/SearchBar";
import OrderList from "../components/ui/OrderList";
const Delivered = () => {
  const isLogged = userDataStore((state: any) => state.isLogged);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = React.useState<any>("");
  const [selectedStore, setSelectedStore, orderData, setOrderData] =
    useOutletContext<any>();
  const [searchOrder, setSearchOrder] = React.useState<any>("");

  const [api, contextHolderr] = notification.useNotification();
  const [messageApi, contextHolder] = message.useMessage();

  React.useEffect(() => {
    if (orderData) {
      setIsLoading(false);
    }
  }, []);

  const updateStatus = (id: any) => {
    const indx = orderData?.findIndex((order: any) => order.id === id);
    const filteredOrder = orderData?.filter((order: any) => order.id === id);

    const newTab = [...orderData];
    const newStatus = {
      id: filteredOrder[0].id,
      location: filteredOrder[0].location,
      orderNum: filteredOrder[0].orderNum,
      temp: filteredOrder[0].temp,
      numbContainer: filteredOrder[0].numbContainer,
      firstNameCustom: filteredOrder[0].firstNameCustom,
      LastNameCustom: filteredOrder[0].LastNameCustom,
      detailOrder: filteredOrder[0].detailOrder,
      status: "completed",
    };
    newTab[indx] = newStatus;

    setOrderData(newTab);
    _notif(filteredOrder[0].id, messageApi, setSelectedOrder);

    if (filteredOrder.length > 0) {
      _notif(filteredOrder[0].id, messageApi, setSelectedOrder);
    } else {
      alert("Erreur");
    }
    // openNotification("top");
  };

  const orderTab = orderData.filter(
    (order: any) =>
      order.status === "delivered" && order.location === selectedStore
  );

  console.log(orderTab);

  const filteredOrder = orderTab.filter((order: any) => {
    if (searchOrder.length > 2) {
      return order?.orderNum?.match(new RegExp(searchOrder, "i"));
    }
  });

  return (
    <div className="cde App">
      {contextHolderr}
      {contextHolder}
      {!isLogged && <Navigate to="/connexion" />}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {!selectedOrder ? (
            <>
              <SearchBar
                searchOrder={searchOrder}
                setSearchOrder={setSearchOrder}
                selectedStore={selectedStore}
                setSelectedStore={setSelectedStore}
              />

              
              <OrderList orderTab={orderTab} filteredOrder={filteredOrder} setSelectedOrder={setSelectedOrder} searchOrder={searchOrder} setSearchOrder={setSearchOrder} images={images}/>

            </>
          ) : (
            <>
              <Container className="my-2">
                <Container className="px-3 py-0 bg-secondary rounded-pill shadow my-auto ">
                  <Row>
                    <Col xs={4} md={5} lg={5}>
                      <i
                        className="ri-arrow-left-line text-info ms-2 fs-3 bg-secondary rounded-pill"
                        onClick={() => setSelectedOrder("")}
                      ></i>{" "}
                    </Col>
                    <Col className="fw-bold m-auto text-light text-end pe-4">
                      # {selectedOrder?.id}
                    </Col>
                  </Row>
                </Container>
              </Container>

              {/* <Container className="">
              <div className="bg-secondary text-center text-light rounded shadow-lg py-1">
               <Row>
                <Col>

                <i className="ri-temp-cold-line fs-4 align-middle"></i> :{" "}
                <small className="align-middle">
                  {selectedOrder?.temp?.map((t: any) => (
                    <span key={Math?.random()}>{t} / </span>
                    ))}
                </small>
                    </Col>
                    <Col>
                
                <i className="ri-shopping-basket-2-line fs-4 align-middle"></i>{" "}
                :{" "}
                <small className="align-middle"> 1 frais et 1 ambiant</small>
                    </Col>
                    </Row>
              </div>
            </Container> */}

              <Container className="text-center py-0 ">
                <small className="text-danger">haut du qrcode</small>{" "}
                <div className="bounced-arrow justify-content-around">
                  <i className="ri-arrow-up-fill "></i>
                  <i className="ri-arrow-up-fill "></i>
                  <i className="ri-arrow-up-fill "></i>
                </div>
              </Container>
              <Container className="bg-light p-2 w-75   animate__animated animate__fadeInDown">
                <Col
                  xs={12}
                  sm={5}
                  md={7}
                  lg={3}
                  className="m-auto"
                  onClick={() => {
                    updateStatus(selectedOrder?.id);
                  }}
                >
                  <QrCode orderNum={selectedOrder?.orderNum} />
                </Col>
              </Container>
              <Container className="text-center text-danger">
                <small>Respectez le sens du qrcode lors du scan</small>
              </Container>
              <Container className="px-2 text-center mt-4">
                <div className="bg-secondary text-light rounded-pill shadow">
                  Saisie manuelle :{" "}
                  <p className="text-info fw-bold">{selectedOrder?.orderNum}</p>
                </div>
              </Container>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Delivered;
