import React from "react";
import { Col, Container, Dropdown, Row } from "react-bootstrap";
import { Navigate, useOutletContext  } from "react-router-dom";
import Loading from "../components/ui/Loading";
import { commandes } from "../data/commandes";
import userDataStore from "../store/userDataStore";
import Orderslist from "../components/ui/Orderslist";
import QrCode from "../components/QrCode";
import "../App.css";
import "animate.css";
import { message, notification } from "antd";
import type { NotificationPlacement } from "antd/es/notification/interface";
import images from "../styles/no-order.png";



const InProgress: React.FC = () => {
  const isLogged = userDataStore((state: any) => state.isLogged);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [orderData, setOrderData] = React.useState<any>([]);
  const [selectedOrder, setSelectedOrder] = React.useState<any>("");
  const [selectedStore, setSelectedStore] = useOutletContext<any>();

  const [api, contextHolderr] = notification.useNotification();
  const [messageApi, contextHolder] = message.useMessage();

  React.useEffect(() => {
    if (commandes) {
      setIsLoading(false);
      setOrderData(commandes);
    }
  }, []);

  const notif = (id: any) => {
    messageApi.open({
      type: 'success',
      content: `Commande # ${id} déposée`,
    });
    setSelectedOrder("")
  };

  const openNotification = (placement: NotificationPlacement) => {
    api.success({
      message: "Commande déposée",
      description: 'Cette commande vient de changer de status : "Déposée',
      placement,
    });

  };

  const updateStatus = (id: any) => {
    const indx = orderData?.findIndex((order: any) => order.id === id);
    const filteredOrder = orderData?.filter((order: any) => order.id === id);

    const newTab = [...orderData];
    const newStatus = {
      id: filteredOrder[0].id,
      orderNum: filteredOrder[0].orderNum,
      temp: filteredOrder[0].temp,
      numbContainer: filteredOrder[0].numbContainer,
      firstNameCustom: filteredOrder[0].firstNameCustom,
      LastNameCustom: filteredOrder[0].LastNameCustom,
      detailOrder: filteredOrder[0].detailOrder,
      status: "delivered",
    };
    newTab[indx] = newStatus;

    setOrderData(newTab);

    if(filteredOrder.length > 0){
      
      notif(filteredOrder[0].id)
    }else{
      alert('Erreur')
    }
    // openNotification("top");
  };

  const orderTab = orderData.filter(
    (order: any) => order.status === "inProgress" && order.location === selectedStore
  );

  console.log(orderTab);

  return (
    <div className="cde App">
      {contextHolderr}
      {contextHolder}
      {!isLogged && <Navigate to="/connexion" />}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Container className="mt-2 text-center ">
            <Container className=" text-info px-3 py-0 bg-secondary rounded-pill shadow my-auto ">
              <Dropdown>
                <Container className="">
                  <Row className="align-middle">
                    <Col className="m-auto text-start">
                      <i className="ri-store-2-line fs-5 "></i>{" "}
                    </Col>
                    <Col xs={4} className="text-start">
                      <Dropdown.Toggle
                        variant=""
                        id="dropdown-basic"
                        className="text-light"
                        // style={{ width: "65px" }}
                      >
                        <span className="py-0 ">{selectedStore}</span>
                      </Dropdown.Toggle>
                    </Col>
                  </Row>
                </Container>

                <Dropdown.Menu className="shadow">
                  <Dropdown.Item onClick={() => setSelectedStore("Punaauia")}>
                    <Row className="">
                      <Col xs={3}>
                        {" "}
                        <i className="ri-store-2-line fs-5"></i>
                      </Col>{" "}
                      <Col className="m-auto user-name">Punaauia</Col>
                    </Row>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedStore("Faa'a")}>
                    <Row className="">
                      <Col xs={3}>
                        {" "}
                        <i className="ri-store-2-line fs-5"></i>
                      </Col>{" "}
                      <Col className="m-auto user-name">Faa'a</Col>
                    </Row>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedStore("Arue")}>
                    <Row className="">
                      <Col xs={3}>
                        {" "}
                        <i className="ri-store-2-line fs-5"></i>
                      </Col>{" "}
                      <Col className="m-auto user-name">Arue</Col>
                    </Row>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Container>
          </Container>
          {!selectedOrder ? (
            <Container className="animate__animated animate__backInLeft  ">
              {/* <Row className="list-cde ps-3 pb-3"> */}
              {orderTab.length ? (
                orderTab?.map((cde: any) => (
                  <Orderslist
                    key={Math.random()}
                    cde={cde}
                    setSelectedOrder={setSelectedOrder}
                  />
                ))
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
              {/* </Row> */}
            </Container>
          ) : (
            <>
              <Container className="my-2">
                <Row>
                  <Col xs={4} md={5} lg={5}>
                    <i
                      className="ri-arrow-left-line text-light fs-4 bg-secondary rounded-pill"
                      onClick={() => setSelectedOrder("")}
                    ></i>{" "}
                  </Col>
                  <Col className="fw-bold"># {selectedOrder?.id}</Col>
                </Row>
              </Container>

              <Container className="">
                <div className="bg-secondary text-center text-light rounded shadow-lg py-1">
                  <i className="ri-temp-cold-line fs-4 align-middle"></i> :{" "}
                  <small className="align-middle">
                    {selectedOrder?.temp?.map((t: any) => (
                      <span key={Math?.random()}>{t} / </span>
                    ))}
                  </small>
                  <br />
                  <i className="ri-shopping-basket-2-line fs-4 align-middle"></i>{" "}
                  :{" "}
                  <small className="align-middle"> 1 frais et 1 ambiant</small>
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
              <Container
                className="bg-light p-2 w-75   animate__animated animate__fadeInDown"
                onClick={() => {
                  notif("789456");
                  updateStatus(selectedOrder?.id);
                }}
              >
                <QrCode orderNum={selectedOrder?.orderNum} />
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

export default InProgress;
