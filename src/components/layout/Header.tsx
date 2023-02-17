import React from 'react'
import { Container, Row, Col, Dropdown } from 'react-bootstrap'
import userDataStore from "../../store/userDataStore";
import imag from "../../styles/kangourou.png";
import farerata from "../../styles/farerata.png";

interface headerProps {
  title: string
}

const Header: React.FC<headerProps> = ({title}: any) => {

    const dataStore = userDataStore((state: any) => state);
    const authLogout = userDataStore((state: any) => state.authLogout)



  return (
    <Container
      fluid={"lg"}
      className="top-menu sticky-top bg-secondary py-2 text-light shadow"
    >
      <Row className="align-middle">
        <Col className="ff-agency m-auto fs-5">
          <img alt="Kangaroo icon" src={imag} style={{ height: "32px" }} />
          {title}
        </Col>
        <Col
          xs={3}
          md={2}
          className="text-center align-middle animate__animated animate__bounceIn top-menu border-start "
        >
          <Dropdown className="">
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              {/* <i className="ri-user-fill text-secondary bg-light rounded-circle p-1 me-2"></i> */}
              <img
                alt="Kangaroo icon"
                src={farerata}
                style={{ height: "36px" }}
              />
            </Dropdown.Toggle>
                {/* <b className="user-name">{dataStore.firstname}</b> */}
            <Dropdown.Menu className="shadow">
              <Container>
                <b>{dataStore.firstname}</b>
              </Container>
              <Dropdown.Item onClick={authLogout}>
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
  );
}

export default Header