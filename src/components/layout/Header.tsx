import { Container, Row, Col, Dropdown } from 'react-bootstrap'
import userDataStore from "../../store/userDataStore";


const Header = ({title}: any) => {

    const dataStore = userDataStore((state: any) => state);
    const authLogout = userDataStore((state: any) => state.authLogout)

  return (
    <Container fluid={"md"} className="sticky-top bg-secondary py-3 text-light ">
      <Row>
        <Col className="title-header m-auto fs-3">{title}</Col>
        <Col
          xs={4}
          className="align-middle animate__animated animate__bounceIn top-menu "
        >
          <Dropdown >
            <Dropdown.Toggle variant="secondary" id="dropdown-basic" >
              <i className="ri-user-fill text-secondary fs-5 bg-light rounded-circle p-1 me-2"></i>
              <span className="pb-1">{dataStore.firstname}</span>
            </Dropdown.Toggle>

            <Dropdown.Menu className='shadow'>
              <Dropdown.Item onClick={authLogout}>
                <Row className="">
                  <Col xs={3}>
                    {" "}
                    <i className="ri-logout-box-r-line fs-5"></i>
                  </Col>{" "}
                  <Col className="m-auto"> Log out</Col>
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