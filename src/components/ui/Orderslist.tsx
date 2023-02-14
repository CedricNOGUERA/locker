import { Button, Col, Row } from "react-bootstrap";

const Orderslist = ({ cde, setSelectedOrder }: any) => {
  return (
    <Col
      key={cde?.id}
      xs={11}
      className="my-2 py-1 bg-white rounded-pill shadow"
      // onClick={() => setSelectedOrder(cde?.orderNum)}
    >
      <Row>
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
              className="ri-arrow-right-line"
              onClick={() => setSelectedOrder(cde?.orderNum)}
            ></i>
          </Button>
        </Col>
      </Row>
    </Col>
  );
};

export default Orderslist;
