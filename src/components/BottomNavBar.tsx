import React from "react";
import { Container, Nav } from "react-bootstrap";

const BottomNavBar = () => {
  return (
    <Container className="bottom-navbar bg-light py-1">
      <Nav className="justify-content-evenly" activeKey="/home">
        <Nav.Item className="nav-item text-center">
          <div className="text-center ">
            <i className="ri-dropbox-fill me-2 fs-4 "></i>
          </div>
          <Nav.Link href="/" className="text-info py-1">
            En cours
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className="nav-item text-center">
          <i className="ri-inbox-archive-fill me-2 fs-4"></i>
          <Nav.Link
            href="/orders-delivered"
            eventKey="link-1"
            className="text-info py-1"
          >
            Déposées
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className="nav-item text-center">
          <i className="ri-inbox-unarchive-line me-2 fs-4 text-center"></i>
          <Nav.Link
            href="/orders-to-retrieve"
            eventKey="link-2"
            className="text-info py-1"
          >
            A récupérer
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </Container>
  );
};

export default BottomNavBar;
