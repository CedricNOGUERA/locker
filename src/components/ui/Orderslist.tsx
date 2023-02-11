import { Col } from "react-bootstrap";

const Orderslist = ({ cde }: any) => {
  return (
    <Col key={cde?.id} xs={12} className="ms-3 py-2">
      <span className="me-4">
        <img
          alt="delivery-icon"
          src="https://img.icons8.com/stickers/256/in-transit.png"
          style={{ width: "48px", height: "48px" }}
        />
      </span>
      <span className="text-light">{cde?.orderNum}</span>
    </Col>
  );
};

export default Orderslist;
