/* eslint-disable react/jsx-no-comment-textnodes */
import React from "react";
import { Col, Container, Dropdown, Row } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import "./App.css";
import Loading from "./components/ui/Loading";
import { commandes } from "./data/commandes";
import userDataStore from "./store/userDataStore";
import "animate.css";
import Orderslist from "./components/ui/Orderslist";

function App() {
  const isLogged = userDataStore((state: any) => state.isLogged);
  const dataStore = userDataStore((state: any) => state);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (commandes) {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="cde App bg-secondary">
      {!isLogged && <Navigate to="/connexion" />}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Container fluid className="bg-secondary py-3 text-light">
            <Row>
              <Col>Commandes en cours</Col>
              <Col
                xs={4}
                className="align-middle animate__animated animate__bounceIn "
              >
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    <i className="ri-user-fill text-secondary fs-5 bg-light rounded-circle p-1 me-2"></i>
                    <span className="pb-1">
                      {dataStore.firstname} {dataStore.lastname}
                    </span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="z-index-1">
                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">
                      Another action
                    </Dropdown.Item>
                    <Dropdown.Item href="#/action-3">
                      Something else
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
          </Container>
          <Container className="bg-warning animate__animated animate__backInLeft">
            <Row>
              {commandes &&
                commandes?.map((cde: any) => <Orderslist cde={cde} />)}
            </Row>
          </Container>
        </>
      )}
    </div>
  );
}

export default App;
