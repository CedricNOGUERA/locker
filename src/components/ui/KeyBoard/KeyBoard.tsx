import { Row, Col, Button } from "react-bootstrap";

const KeyBoard: React.FC<any> = ({ handleClick }) => {
  /* State
   *************************************************************/
  const keys = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "clear",
    "0",
    "del",
  ];

  /* Render
   *************************************************************/
  return (
    <Row style={{ width: "250px" }} className="mx-auto">
      {keys.map((value: any) => (
        <Col className="col-4 text-center fs-2 p-1" key={Math.random()}>
          <Button
            variant="outline-secondary py-4"
            onClick={() => handleClick(value)}
          >
            {value === "clear" ? (
              <i className="fal fa-times-circle"></i>
            ) : value === "del" ? (
              <i className="fal fa-backspace"></i>
            ) : (
              value
            )}
          </Button>
        </Col>
      ))}
    </Row>
  );
};

export { KeyBoard };
