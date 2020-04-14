import React from 'react';

function useFormValidation(formValidationDefault) {
    if(!formValidationDefault) {
        formValidationDefault = {
            email: "",
            password: ""
        } 
    }
    const [formValidation, setFormValidation] = React.useState(formValidationDefault)
    const validateEmail = (email) => {
        const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (emailRex.test(email)) {
            setFormValidation(oldState => {
                return {...oldState, email: 'valid'}
            })
        } else {
            setFormValidation(oldState => {
                return {...oldState, email: 'invalid'}
            })
        }
    }
    const validateEmpty = (event) => {
        let vInput = (event.target.value === "") ? "invalid" : "valid";
        let targetName = event.target.name;
        setFormValidation(oldState => {
            return {...oldState, [targetName]: vInput}
        })
    }
    const hasValidationErrors = () => {
        let inputsNeedingValidation = Object.keys(formValidation)
        let validationErrors = false;
        inputsNeedingValidation.forEach(input => {
        if(formValidation[input] !== "valid")
            validationErrors = true;
        });
        return validationErrors;
    }
    return {
        formValidation,
        validateEmail,
        validateEmpty,
        hasValidationErrors
    };
}

export default useFormValidation;