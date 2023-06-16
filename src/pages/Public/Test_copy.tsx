import axios from 'axios';
import React from 'react'
import { Col, Container, Form, Row, Table } from 'react-bootstrap';

const Test2 = () => {

    const [order, setOrder] = React.useState<any>([]);
    const [dataOrder, setDataOrder] = React.useState<any>([]);




    React.useEffect(() => {
        
    getAllOrder()
        
    }, []);


    
    const getAllOrder = () => {
      let data = new FormData()

      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://prestashop.itahitilab.io/api/order_details/?output_format=JSON&ws_key=GAQVK8PIT3GLV3XBBHNR3EGR9EWJSHUB',
        headers: {
          Cookie:
            'PrestaShop-1b5a073e13c19294c471fb581e4724a2=def50200369329de66cc586fbf4d1b6509dfd7b057371a05af56874fc128bacc226bf303b228ea7c523760580b8695135eded839eacfa9f60fe4c2945b7f88aacad2f34af80c085488e0ed23ed463a92a7d97cbe6af6eb1b58379dbfc8a9b3c235bb0a62e198097ef5eca677eebf2db8839203312b9b1a13fbe10b952985f06669094e4d0068ed8df36dc0605f305fdb625d3a83dca7b5949fb6d318c50e68c5512107',
          // ...data.getHeaders()
        },
        data: data,
      }

      axios
        .request(config)
        .then((response) => {
          setOrder(response.data)
        })
        .catch((error) => {
          console.log(error)
        })
    }


    const getPrestaOrder = () => {
        let config: any = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://prestashop.itahitilab.io/api/order_details/?output_format=JSON&ws_key=GAQVK8PIT3GLV3XBBHNR3EGR9EWJSHUB',
            headers: {
              Cookie:
                'PrestaShop-1b5a073e13c19294c471fb581e4724a2=def50200369329de66cc586fbf4d1b6509dfd7b057371a05af56874fc128bacc226bf303b228ea7c523760580b8695135eded839eacfa9f60fe4c2945b7f88aacad2f34af80c085488e0ed23ed463a92a7d97cbe6af6eb1b58379dbfc8a9b3c235bb0a62e198097ef5eca677eebf2db8839203312b9b1a13fbe10b952985f06669094e4d0068ed8df36dc0605f305fdb625d3a83dca7b5949fb6d318c50e68c5512107',
              // ...data.getHeaders()
            },
          }
    
          let promises = []
    
          for (let i = 0; i < dataOrder?.length; i++) {
            config.data = dataOrder[i]
            promises.push(axios.request(config))
          }
    
          Promise.all(promises)
            .then((responses: any) => {
              setDataOrder(responses)
              console.log(responses)
            })
            .catch((error) => {
             
              console.log(error)
             
            })
    }


console.log(dataOrder)
  return (
    <Container>
    <Container
                  // key={indx * Math.random()}
                  className='text-light py-1 mb-3 border-0 rounded bg-secondary animate__animated'
                  // onClick={() => {
                  //   filteredLocker(locker)
                  //   setAvailableSlot(locker.available)
                  // }}
                >
                  <Row className='px-0'>
                    <Col className='m-auto font-75 ps-1 px-0'>Puna</Col>
                    <Col xs={5}>
                      <Row>
                        {/* {allSlot?.['hydra:member']
                          ?.filter(
                            (lockers: any) =>
                              lockers?.slot?.temperatureZone?.locker?.location === locker
                          )
                          ?.map((slots: any, indx: any) => (
                            <React.Fragment key={indx}> */}
                              <Col xs={2} className='px-0 ms-2'>
                                <img
                                  alt='Temp icon'
                                  src={
                                    'https://img.icons8.com/color/512/organic-food.png'
                                  }
                                  style={{ width: '22px' }}
                                />
                                <p className='font-65 ms-2 mb-0'>M</p>
                              </Col>
                              <Col xs={1} className='px-0 font-85 pb-0'>
                                <span className='badge badges2 rounded-pill bg-info border-2 border-secondary'>
                                  10
                                </span>
                              </Col>
                              <Col xs={2} className='px-0 ms-2'>
                                <img
                                  alt='Temp icon'
                                  src={
                                    'https://img.icons8.com/color/512/organic-food.png'
                                  }
                                  style={{ width: '22px' }}
                                />
                                <p className='font-65 ms-2 mb-0'>M</p>
                              </Col>
                              <Col xs={1} className='px-0 font-85 pb-0'>
                                <span className='badge badges2 rounded-pill bg-info border-2 border-secondary'>
                                  10
                                </span>
                              </Col>
                              <Col xs={2} className='px-0 ms-2'>
                                <img
                                  alt='Temp icon'
                                  src={
                                    'https://img.icons8.com/color/512/organic-food.png'
                                  }
                                  style={{ width: '22px' }}
                                />
                                <p className='font-65 ms-2 mb-0'>M</p>
                              </Col>
                              <Col xs={1} className='px-0 font-85 pb-0'>
                                <span className='badge badges2 rounded-pill bg-info border-2 border-secondary'>
                                  10
                                </span>
                              </Col>
                              <Col xs={2} className='px-0 ms-2'>
                                <img
                                  alt='Temp icon'
                                  src={
                                    'https://img.icons8.com/color/512/organic-food.png'
                                  }
                                  style={{ width: '22px' }}
                                />
                                <p className='font-65 ms-2 mb-0'>M</p>
                              </Col>
                              <Col xs={1} className='px-0 font-85 pb-0'>
                                <span className='badge badges2 rounded-pill bg-info border-2 border-secondary'>
                                  10
                                </span>
                              </Col>
                            {/* </React.Fragment>
                          ))} */}
                      </Row>
                    </Col>
                  </Row>
                </Container>



                <Form.Select
                      // onChange={(e) => {
                      //   handleChangeSelect(e, indx)
                      // }}
                      aria-label='zone'
                      className='my-2'
                      required
                    >
                      <option className=''>Panier n°{1}</option>
                      {/* {chosenLocker?.map((lockers: any, index: any) => ( */}
                        <option
                          // key={index}
                          value="trucs"
                          className='text-dark bg-warning'
                         
                       
                        >
                            Zone Fraîche M 10 casiers
                        </option>
                    </Form.Select>



    </Container>
  )
}

export default Test2
