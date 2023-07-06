import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import imagLogo from '../../../styles/logo512.png'
import useWebInstallPrompt from '../../../hooks/useWebInstallPrompt';

const PwaInstallModal = ({pwaInstallModalProps}: any) => {

    const {showModal, handleCloseModal, webInstallPrompt, handleWebInstallDeclined, handleWebInstallAccepted} = pwaInstallModalProps

    

    if (!webInstallPrompt) {
      return null;
    }
  return (
    <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header className='text-center'>
        <div
          style={{
            height: '60px',
            width: '100%',
            borderTopRightRadius: '50%',
            borderTopLeftRadius: '50%',
            marginTop: '-50px',
          }}
        >
          <img
            src={imagLogo}
            alt='1euro = 10 points'
            className='Fidelity-messageMacaroon'
            width={80}
            style={{
              borderTopRightRadius: '50%',
              borderTopLeftRadius: '50%',
              borderColor: "#aaa",
              backgroundColor: '#fff',
            }}
          />
          </div>
        </Modal.Header>
        <Modal.Body>Installer l'application sur votre téléphone!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {handleWebInstallDeclined()
          handleCloseModal()
          }}>
            Fermer
          </Button>
          <Button variant="primary" onClick={() => {handleWebInstallAccepted()
          handleCloseModal()
          }}>
            Installer
          </Button>
        </Modal.Footer>
      </Modal>
  )
}

export default PwaInstallModal
