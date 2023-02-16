import { Button, Col, Row } from "react-bootstrap";

const Orderslist = ({ cde, setSelectedOrder }: any) => {
  return (
    // <Col
    //   key={cde?.id}
    //   xs={12}
    //   className="my-2 py-1 bg-white rounded-pill shadow"
    // >
    <div className="my-3 px-3 py-1 bg-white rounded-pill shadow ">

      <Row className="">
        <Col xs={3} className="">
          <img
            alt="delivery-icon"
            src="https://img.icons8.com/stickers/256/in-transit.png"
            style={{ width: "48px", height: "48px" }}
          />
        </Col>
        <Col className="text-secondary align-middle m-auto">
          {cde?.orderNum}
        </Col>
        <Col xs={3}>
          <Button
            variant="outline-info"
            className="mt-2 ms-2 rounded text-center px-2 py-0 border border-info border-2"
          >
            <i
              className="ri-qr-code-line text-secondary"
              // className="ri-arrow-right-line"
              onClick={() => setSelectedOrder(cde)}
            ></i>
          </Button>
        </Col>
      </Row>
    </div>
    // </Col>
  );
};

export default Orderslist;
