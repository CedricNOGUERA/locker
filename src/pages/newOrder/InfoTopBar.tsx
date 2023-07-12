import React from 'react'
import { Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import BackButton from '../../components/ui/BackButton'

const InfoTopBar = ({ infoToBarProps }: any) => {
  const {
    chosenLocker,
    trigger,
    trigger2,
    handleFirstStepClick,
    handleSecondStepClick,
    handleThirdStepClick,
  } = infoToBarProps
// console.log(chosenLocker[0].slot.temperatureZone.locker.location)
  return (
    <>
      <Col
        xs={2}
        md={5}
        lg={5}
        className='py-0'
        onClick={
          !trigger
            ? handleFirstStepClick
            : !trigger2
            ? handleSecondStepClick
            : handleThirdStepClick
        }
      >
        {chosenLocker?.length === 0 ? (
          <Link to='/in-progress' className='text-decoration-none'>
            <BackButton />
          </Link>
        ) : (
          <BackButton />
        )}
      </Col>
      <Col className='m-auto text-light text-start pe-4 py-0'>
        {chosenLocker?.length === 0 ? (
          <>
            <i className='ri-inbox-fill align-bottom me-2'></i>
            <span className='fw-bold'>sélectionnez un locker</span>
          </>
        ) : !trigger ? (
          <>
            <i className='ri-shopping-basket-2-line align-bottom me-2'></i>
            {/* <span className='fw-bold'>{chosenLocker && chosenLocker[0]?.slot?.temperatureZone?.locker?.city}</span> */}
            <span className='fw-bold'>Nombre de panier nécessaire</span>
          </>
        ) : !trigger2 ? (
          <>
            <i className='ri-temp-cold-line align-bottom me-2'></i>
            <span className='fw-bold'>Température & produits</span>
          </>
        ) : (
          <>
            <i className='ri-user-line align-bottom me-2'></i>
            <span className='fw-bold'>Informations client</span>
          </>
        )}
      </Col>
    </>
  )
}

export default InfoTopBar
