import { Button, Col, Row } from "react-bootstrap";

const ItemList = ({ cde, setSelectedOrder, setSearchOrder }: any) => {
  return (
    <div
      className="my-3 px-3 py-0 bg-white rounded-pill shadow"
      // style={{ height: "145" }}
    >
      <Row className="py-1">
        <Col xs={4} className="m-auto">
          {cde?.temp?.map((temps: any) => (
            <span key={Math.random()}>
              <img
                alt="Refroidissement icon"
                src={`https://img.icons8.com/officel/512/${temps?.icon}.png`}
                // src={`http0://img.icons8.com/ultraviolet/512/${temps?.icon}.png`}
                style={{ width: "20px" }}
              />{" "}
            </span>
          ))}
        </Col>
        <Col className="text-secondary align-middle m-auto">
          {cde?.orderNum}
        </Col>
        <Col xs={3} className="m-auto">
          <Button
            variant="outline-info"
            onClick={() => {
              setSearchOrder("");
              setSelectedOrder(cde);
            }}
            className="ms-2 rounded text-center px-2 py-0 border border-info border-2"
          >
            <i className="ri-qr-code-line text-secondary"></i>
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ItemList;
