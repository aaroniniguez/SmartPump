import React from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody
} from 'reactstrap';
import "./ApiModal.css";

function ApiModal(props) {
    const {open, status, message} = props;
    const [toggle, setToggle] = React.useState(open)
    console.log("toggleVal: ", toggle, props)
    return (
        <Modal isOpen={toggle} toggle={() => setToggle((oldState) => !oldState)}>
          <ModalHeader toggle={() => setToggle((oldState) => !oldState)}>
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