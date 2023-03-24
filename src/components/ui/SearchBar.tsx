import React from 'react'
import { Container, Row, Col, Dropdown } from 'react-bootstrap'

const SearchBar = ({searchBarProps}: any) => {
  
  const {searchOrder, setSearchOrder, selectedStore, setSelectedStore, allSlot } = searchBarProps

  return (
    
      <Container className="mt-2 text-center">
      <Container
        fluid
        className=" text-info ps-2 pe-4 py-0 bg-secondary rounded-pill shadow my-auto "
      >
        <Dropdown>
            <Container fluid className="px-0">
              <Row className="align-middle">
                <Col className="m-auto text-start">
                  <div className="input-group">
                  
                    <input
                      type="text"
                      className="form-control rounded-pill"
                      placeholder="N° Commande..."
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      style={{ height: "25px" }}
                      value={searchOrder}
                      onChange={(e) =>
                        setSearchOrder(e.currentTarget.value)
                      }
                    />
                  </div>
                </Col>
                <Col xs={1} className="m-auto text-start text-md-end">
                  <i className="ri-store-2-line fs-5 "></i>{" "}
                </Col>
                <Col xs={4} md={2} className="text-start text-md-end">
                  <Dropdown.Toggle
                    variant=""
                    id="dropdown-basic"
                    className="text-light"
                  >
                    <span className="py-0" >{allSlot?.slot?.temperatureZone?.locker?.city}</span>
                  </Dropdown.Toggle>
                </Col>
              </Row>
            </Container>
          <Dropdown.Menu className="shadow">
            <Dropdown.Item  title={allSlot?.slot?.temperatureZone?.locker?.location} onClick={() => setSelectedStore(allSlot?.slot?.temperatureZone?.locker?.city)}>
              <Row className="">
                <Col xs={3}>
                  {" "}
                  <i className="ri-store-2-line fs-5"></i>
                </Col>{" "}
                <Col className="m-auto user-name">Faa'a</Col>
              </Row>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Container>
    </Container>
  )
}

export default SearchBar