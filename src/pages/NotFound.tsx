import React from 'react'
import { Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import imag from '../styles/astro.png'

const NotFound = () => {

    const navigate = useNavigate()

  return (
    <div>
      <div className='text-center mt-5'>
        <img src={imag} alt='not found' id="notfound-image" />
      </div>
      <div className='text-center text-secondary'>
        <h3>Vous vous êtes perdu ?</h3>
        <Button variant='outline-secondary'  size='sm' onClick={() => navigate('/preparations')}>
          {/* <Link to='/preparations' className='text-decoration-none text-secondary '> */}
             Retour
          {/* </Link> */}
        </Button>
      </div>
    </div>
  )
}

export default NotFound
