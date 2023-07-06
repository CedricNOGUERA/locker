import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import imagLogo from '../../../styles/appModal.png'
import useWebInstallPrompt from '../../../hooks/useWebInstallPrompt';

const PwaInstallModal = ({pwaInstallModalProps}: any) => {

    const {showModal, handleCloseModal, webInstallPrompt, handleWebInstallDeclined, handleWebInstallAccepted} = pwaInstallModalProps

    

    // if (!webInstallPrompt) {
    //   return null;
    // }
  return (
    <Modal show={showModal} onHide={handleCloseModal} centered>
      <Modal.Header className='text-center'>
        <div
        className=''
          style={{
            height: '60px',
            width: '100%',
            borderWidth: 2,
            marginTop: '-50px',
          }}
        >
          <img
            src={imagLogo}
            alt='1euro = 10 points'
            className='border-3'
            width={80}
            style={{
              borderTopRightRadius: '30%',
              borderTopLeftRadius: '30%',
              borderBottomRightRadius: '30%',
              borderBottomLeftRadius: '30%',
              borderColor: '#fff',
            }}
          />
        </div>
      </Modal.Header>
      <Modal.Body className='text-center'>
       ⭐{' '}
        Installer l'application sur l'écran d'accueil
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant='info'
          className='text-light'
          onClick={() => {
            handleWebInstallAccepted()
            handleCloseModal()
          }}
        >
          ✔  Installer
        </Button>
        <Button
          variant='secondary'
          onClick={() => {
            handleWebInstallDeclined()
            handleCloseModal()
          }}
        >
          ✖ Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default PwaInstallModal
