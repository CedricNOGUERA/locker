import React from 'react'
import { Container, Row, Col, Dropdown, Modal, Button } from 'react-bootstrap'
import userDataStore from "../../store/userDataStore";
import imag from "../../styles/kangourou.png";
import farerata from "../../styles/farerata.png";
import QrCode from '../QrCode';
import AuthService from '../../service/Auth/AuthService';

interface headerProps {
  title: string
}

const Header: React.FC<headerProps> = ({title}: any) => {

    const dataStore = userDataStore((state: any) => state);
    const authLogout = userDataStore((state: any) => state.authLogout)

    const [show, setShow] = React.useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


  return (
    <>
      <Modal show={show} onHide={handleClose} animation={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>{dataStore.firstname} - ({dataStore.id})</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container fluid className="pb-5">
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
            <Container className="bg-light p-2    animate__animated animate__fadeInDown">
              <Col xs={12} sm={5} md={7} lg={5} className="m-auto">
                <QrCode orderNum={`${dataStore.id}`} />
              </Col>
            </Container>
            <Container className="text-center text-warning">
              <small>
                <b>Respectez le sens du qrcode lors du scan</b>
              </small>
            </Container>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="info" className='text-light' onClick={handleClose}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      <Container
        fluid={"lg"}
        className="top-nav sticky-top bg-secondary py-2 text-light shadow"
      >
        <Row className="align-middle">
          <Col className="ff-agency m-auto ">
            <img alt="Kangaroo icon" src={imag} style={{ height: "24px" }} />
            {title}
          </Col>
          <Col
            xs={3}
            md={2}
            className="text-center align-middle animate__animated animate__bounceIn top-menu border-start "
          >
            <Dropdown className=""  >
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              
              {dataStore.company_name}
                {/* <img
                  alt="Kangaroo icon"
                  src={farerata}
                  style={{ height: "36px" }}
                /> */}
              </Dropdown.Toggle>
              <Dropdown.Menu className="shadow" style={{width: '210px'}}>
                <Container>
                  <b>{dataStore.firstname}</b>
                </Container>
                <Dropdown.Item  onClick={handleShow}>
                  <Row className="">
                    <Col xs={3}>
                      {" "}
                      <i className="ri-qr-code-line fs-5"></i>
                    </Col>{" "}
                    <Col className="m-auto user-name">identification</Col>
                  </Row>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => {
                  authLogout()
                  AuthService.logout()}}>
                  <Row className="">
                    <Col xs={3}>
                      {" "}
                      <i className="ri-logout-box-r-line fs-5"></i>
                    </Col>{" "}
                    <Col className="m-auto user-name"> Log out</Col>
                  </Row>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Header