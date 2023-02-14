import { Container, Nav } from "react-bootstrap";

const BottomNavBar = () => {
  return (
    <Container fluid className="bottom-navbar bg-secondary py-1">
      <Nav className="justify-content-evenly" activeKey="/home">
      <Nav.Item className="nav-item text-center">
          <Nav.Link
            href="orders-to-retrieve"
            eventKey="link-2"
            className="text-info py-1"
          >
          <i className="ri-inbox-unarchive-line fs-4 text-center"></i>
          <br/>
            A récupérer
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className="nav-item text-center">
          <div className="text-center ">
          </div>
          <Nav.Link href="/in-progress" className="text-info py-1">
            <i className="ri-file-list-line fs-4 "></i>
            {/* <i className="ri-dropbox-line fs-4 "></i> */}
            <br/>
            En cours
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className="nav-item text-center">
     
          <Nav.Link
            href="/orders-delivered"
            eventKey="link-1"
            className="text-info py-1"
          >
            {/* <i className="ri-inbox-archive-fill me-2 fs-4"></i> */}
            <i className="ri-inbox-archive-line fs-4"></i>
            <br/>
            Déposées
          </Nav.Link>
        </Nav.Item>
    
      </Nav>
    </Container>
  );
};

export default BottomNavBar;
