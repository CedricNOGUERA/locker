import { Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Map = () => {

    // const [latitude, setLatitude] = React.useState(null);
    // const [longitude, setLongitude] = React.useState(null);
  
    // React.useEffect(() => {
    //   navigator.geolocation.getCurrentPosition(
    //     (position: any) => {
    //       setLatitude(position.coords.latitude);
    //       setLongitude(position.coords.longitude);
    //     },
    //     (error) => {
    //       console.log(error);
    //     }
    //   );
    // }, []);

    // console.log(latitude + ' - '+ longitude)
  
  return (
    <div className=''>
        <Container className='px-3 py-0 bg-secondary rounde shadow my-auto '>
          <Row>
           
                <Col xs={2} md={5} lg={5}>
                  <Link to='/in-progress' className='text-decoration-none'>
                    <i className='ri-arrow-left-line text-info ms-2 fs-3 bg-secondary rounded-pill'></i>{' '}
                  </Link>
                </Col>
                <Col className='m-auto text-light text-center pe-4'>
                
                    <i className='ri-inbox-fill align-bottom'></i>{' '}
                    <span className='fw-bold'>Carte des livraisons</span>
                  
                </Col>
                <Col xs={2} md={5} lg={5}>
                  
                </Col>
            
            
          </Row>
        </Container>
      <iframe title="Tahitian Map" src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d86053.27328914723!2d-149.52482969481656!3d-17.600202854550552!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfr!2sfr!4v1680657543486!5m2!1sfr!2sfr" width={800}  style={{border:0, width: '100vw', height: '100vh'}}  loading="lazy" ></iframe>
    
    </div>
  )
}

export default Map
