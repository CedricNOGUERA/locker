import React from 'react'
import { Container, Row, Col, Dropdown } from 'react-bootstrap'
import userDataStore from "../../store/userDataStore";
import imag from "../../styles/kangourou.png";

interface headerProps {
  title: string
}

const Header: React.FC<headerProps> = ({title}: any) => {

    const dataStore = userDataStore((state: any) => state);
    const authLogout = userDataStore((state: any) => state.authLogout)
    const [selectedStore, setSelectedStore] = React.useState<string>("");


    console.log(selectedStore)

  return (
    <Container
      fluid={"md"}
      className="top-menu sticky-top bg-secondary py-2 text-light shadow"
    >
      <Row className="align-middle">
        <Col className="ff-agency m-auto fs-5">
          <img alt="Kangaroo icon" src={imag} style={{ height: "32px" }} />
          {/* <img
            alt="Kangaroo icon"
            src="https://img.icons8.com/external-others-inmotus-design/32/external-Kangaroo-animal-faces-others-inmotus-design-2.png"
          /> */}
          {/* <i className="ri-truck-fill fs-3 m-auto text-info"></i> {' '} */}

          {title}
        </Col>
        <Col
          xs={3}
          className="align-middle animate__animated animate__bounceIn top-menu border-start "
        >
          <Dropdown className="">
            <Dropdown.Toggle
              variant="secondary"
              id="dropdown-basic"
              style={{ width: "65px" }}
            >
              <i className="ri-user-fill text-secondary bg-light rounded-circle p-1 me-2"></i>
              {/* <span className="pb-1 user-name">{dataStore.firstname}</span> */}
            </Dropdown.Toggle>

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