import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import QrCode from '../QrCode';

const ScanPage = ({selectedOrder, setSelectedOrder, updateStatus}: any) => {
  return (
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
  )
}

export default ScanPage