import React from 'react';

function useModal() {

    const modalContentDefault = {
        message: null, 
        status: null
    }

    const [isOpen, setIsOpen] = React.useState(false);
    const [modalContent, SetModalContent] =React.useState(modalContentDefault)

    function toggle() {
        setIsOpen(!isOpen)
    }

    function setModalContent(status, message) {
        SetModalContent({status, message})
    }

    return {
        isOpen, 
        toggle,
        modalContent, 
        setModalContent
    };
}

export default useModal;
