import { Container, Row, Col } from "react-bootstrap";
import QrCode from "../QrCode";
import userDataStore from "../../store/userDataStore";
import axios from "axios";
import OrdersService from "../../service/Orders/OrdersService";

const ScanPage = ({ scanPageProps }: any) => {
  const dataStore = userDataStore((states: any) => states)
  const {
    
    selectedOrder,
  
    setOrderData,
    messageApi,
    setSelectedOrder,
    objectif,
  } = scanPageProps

  console.log(selectedOrder.id)

  const getallOrders = (token: any) =>{
    OrdersService.allOrders(token)
    .then((response: any) => {
      setOrderData(response.data)
    })
  }



  const changeStatus = () =>{
    let data = {
      "status": objectif
    };
    
    let config = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: 'http://192.168.1.250:8000/api/orders/' + selectedOrder.id,
      headers: { 
        'Content-Type': 'application/merge-patch+json', 
        'Authorization': 'Bearer ' + dataStore.token
      },
      data : data
    };
    
    axios.request(config)
    .then((response: any) => {
      console.log(response.data);
      getallOrders(dataStore.token)
      setSelectedOrder(null)

    })
    .catch((error: any) => {
      console.log(error);
    });
  }


  return (
    <Container fluid className="pb-5">
      <Container className="my-2">
        <Container className="px-3 py-0 bg-secondary rounded-pill shadow my-auto ">
          <Row>
            <Col xs={2} md={5} lg={5}>
              <i
                className="ri-arrow-left-line text-info ms-2 fs-3 bg-secondary rounded-pill"
                onClick={() => setSelectedOrder("")}
              ></i>{" "}
            </Col>
            <Col className="fw-bold m-auto text-light text-center pe-4">
              {selectedOrder?.barcode}
            </Col>
          </Row>
        </Container>
      </Container>
      <Container className="text-center text-danger py-0  m-auto opacity-75">
        <span className="align-middle">
          <i className="ri-error-warning-line fs-5"></i>
        </span>{" "}
        <small className="fw-bold align-middle ">haut du qrcode</small>{" "}
        <div className="bounced-arrow justify-content-around">
          <i className="ri-arrow-up-fill "></i>
          <i className="ri-arrow-up-fill "></i>
          <i className="ri-arrow-up-fill "></i>
        </div>
      </Container>
      <Container
        className="bg-light p-2 w-75   animate__animated animate__fadeInDown"
        onClick={() => {
          changeStatus()
        }}
      >
        <Col xs={12} sm={5} md={7} lg={3} className="m-auto" >
          <QrCode data={`${selectedOrder?.barcode}`} />
        </Col>
      </Container>
      <Container className="text-center text-warning">
        <small>
          <b>Respectez le sens du qrcode lors du scan</b>
        </small>
      </Container>
      <Container className="px-2 text-center mt-4">
        <div className="bg-secondary text-light rounded-pill shadow">
          Saisie manuelle : 
          <p className="text-info fw-bold">{selectedOrder?.barcode}</p>
        </div>
      </Container>
    </Container>
  );
};

export default ScanPage;
