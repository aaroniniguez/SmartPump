import React from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody
} from 'reactstrap';
import "./ApiModal.css";

function ApiModal(props) {
    const {isOpen, status, message, toggle} = props;
    return (
        <Modal isOpen={isOpen} toggle={toggle}>
          <ModalHeader toggle={toggle}>
          {(status === "Error") ? (
            <span className="modalError">{status}</span>
          ) : (
            <span className="modalSuccess">{status}</span>
          )}
          </ModalHeader>
          <ModalBody>
            {message}
            {props.children}
          </ModalBody>
        </Modal>
    );
}

export default ApiModal;