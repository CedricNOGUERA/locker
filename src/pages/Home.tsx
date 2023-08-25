import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import imag from '../styles/logo512.png'
import imagSign from '../styles/logo-admin-crf.jpg'

const Home = () => {
  return (
    <Container className='home-container text-center m-auto py-3 bg-secondar'>
        <h2>E-Tools</h2>
      <Row>
        <Col xs={4} className='p-3 text-light'>
          <div className='bg-secondary rounded'>
            <div className='bg-secondary rounded'>
              <a href='https://crf-flash-dev01.itahitilab.io/punaauia/admin244gvslcm/index.php'>
                <img src={imag} alt='logo' width={50} />
              </a>
              <p>Préparations</p>
            </div>
          </div>
        </Col>
        <Col xs={4} className='p-3 text-light'>
          <div className='bg-secondary rounded'>
          <a href='https://crf-flash-dev01.itahitilab.io/punaauia/admin244gvslcm/index.php'>

              <img src={imagSign} alt='logo' width={70} />
            </a>
            <p>Signatures</p>
          </div>
        </Col>
        <Col xs={4} className=' p-3 text-light'>
          <div className='bg-secondary rounded'>
            <a href='/connexion'>
              <img src={imag} alt='logo' width={50} />
            </a>
            <p>Over box</p>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Home
