import React from "react";
import { Form, Col, Container, Dropdown, Row } from "react-bootstrap";
import { Navigate, useOutletContext } from "react-router-dom";
import Loading from "../components/ui/Loading";
import userDataStore from "../store/userDataStore";
import Orderslist from "../components/ui/Orderslist";
import QrCode from "../components/QrCode";
import "../App.css";
import "animate.css";
import { message } from "antd";
import images from "../styles/no-order.png";
import { _notif } from "../utils/functions";

const InProgress: React.FC = () => {
  const isLogged = userDataStore((state: any) => state.isLogged);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isSearch, setIsSearch] = React.useState<boolean>(true);

  const [selectedOrder, setSelectedOrder] = React.useState<any>("");
  const [searchOrder, setSearchOrder] = React.useState<any>("");
  const [listOrder, setListOrder] = React.useState<any>([]);
  const [selectedStore, setSelectedStore, orderData, setOrderData] =
    useOutletContext<any>();

  const [messageApi, contextHolder] = message.useMessage();

  React.useEffect(() => {
    if (orderData) {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if(filteredOrder && filteredOrder.length > 0){
      setListOrder(filteredOrder)
    }
    // if(filteredOrder.length === 0){
    //   setlistOrder(orderTab)
    // }
    if(searchOrder === ""){
      setListOrder(orderTab)
    }
    if(searchOrder.length > 2 && filteredOrder.length === 0){
      setIsSearch(false)
    }
  
    
  }, [searchOrder]);




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
      status: "delivered",
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
      order.status === "inProgress" && order.location === selectedStore
  );

  const filteredOrder = orderTab.filter((order: any) => {
    if(searchOrder.length > 2){
      return order?.orderNum?.match(new RegExp(searchOrder, 'i'));
    }
  });

  console.log(filteredOrder);
  console.log(isSearch);

  return (
    <div className="cde App">
      {contextHolder}
      {!isLogged && <Navigate to="/connexion" />}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {!selectedOrder ? (
            <>
              <Container className="mt-2 text-center">
                <Container
                  fluid
                  className=" text-info ps-2 pe-4 py-0 bg-secondary rounded-pill shadow my-auto "
                >
                  <Dropdown>
                    <Container fluid className="px-0">
                      <Row className="align-middle">
                        <Col className="m-auto text-start">
                          <div className="input-group">
                            {/* <span
                              className="input-group-text rounded-start"
                              id="basic-addon1"
                              style={{ height: "25px" }}
                            >
                              <i className="ri-search-line text-secondary fs-5 fw-bold"></i>
                            </span> */}
                            <input
                              type="text"
                              className="form-control rounded-pill"
                              placeholder="N° Commande..."
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                              style={{ height: "25px" }}
                              value={searchOrder}
                              onChange={(e) =>
                                setSearchOrder(e.currentTarget.value)
                              }
                            />
                          </div>
                        </Col>
                        <Col xs={1} className="m-auto text-start text-md-end">
                          <i className="ri-store-2-line fs-5 "></i>{" "}
                        </Col>
                        <Col xs={4} md={2} className="text-start text-md-end">
                          <Dropdown.Toggle
                            variant=""
                            id="dropdown-basic"
                            className="text-light"
                          >
                            <span className="py-0 ">{selectedStore}</span>
                          </Dropdown.Toggle>
                        </Col>
                      </Row>
                    </Container>

                    <Dropdown.Menu className="shadow">
                      <Dropdown.Item
                        onClick={() => setSelectedStore("Punaauia")}
                      >
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
              <Container className="animate__animated animate__backInLeft  ">
                {orderTab.length > 0 ? (
                  filteredOrder.length > 0 ? (
                    filteredOrder?.map((cde: any) => (
                      <Orderslist
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
                      {/* <img alt="Info icon" src="https://img.icons8.com/external-photo3ideastudio-gradient-photo3ideastudio/256/external-info-digital-business-photo3ideastudio-gradient-photo3ideastudio.png"/> */}
                    </div>
                  ) : (
                    orderTab?.map((cde: any) => (
                      <Orderslist
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
            </>
          ) : (
            <Container fluid className="pb-5">
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

              {/* 
              info commande : température et nbres bacs
              <Container className="">
                <div className="bg-secondary text-light rounded shadow-lg py-1 px-2 px-md-4 ">
                  <Row className="justify-content-between">
                    <Col
                      xs={12}
                      sm={6}
                      md={6}
                      className="text-center text-sm-start text-md-start"
                    >
                      <i className="ri-temp-cold-line fs-4 align-middle"></i>
                      <small className="align-middle">
                        : {selectedOrder?.temp?.join(" / ")}
                      </small>
                    </Col>
                    <Col className="text-center text-sm-end text-md-end">
                      <i className="ri-shopping-basket-2-line fs-4 align-middle"></i>{" "}
                      <small className="align-middle">
                        : 1 frais et 1 ambiant
                      </small>
                    </Col>
                  </Row>
                </div>
              </Container> */}

              <Container className="text-center text-danger py-0  m-auto opacity-75">
                <span className="align-middle">

                  <i className="ri-error-warning-line fs-5"></i>
                </span>{' '}
                <small className="fw-bold align-middle ">
                   haut du qrcode
                </small>{" "}
                <div className="bounced-arrow justify-content-around">
                  <i className="ri-arrow-up-fill "></i>
                  <i className="ri-arrow-up-fill "></i>
                  <i className="ri-arrow-up-fill "></i>
                </div>
              </Container>
              <Container
                className="bg-light p-2 w-75   animate__animated animate__fadeInDown"
                onClick={() => {
                  updateStatus(selectedOrder?.id);
                }}
              >
                <Col xs={12} sm={5} md={7} lg={3} className="m-auto">
                  <QrCode orderNum={selectedOrder?.orderNum} />
                </Col>
              </Container>
              <Container className="text-center text-warning">
                <small>
                  <b>Respectez le sens du qrcode lors du scan</b>
                </small>
              </Container>
              <Container className="px-2 text-center mt-4">
                <div className="bg-secondary text-light rounded-pill shadow">
                  Saisie manuelle :{" "}
                  <p className="text-info fw-bold">{selectedOrder?.orderNum}</p>
                </div>
              </Container>
            </Container>
          )}
        </>
      )}
    </div>
  );
};

export default InProgress;
