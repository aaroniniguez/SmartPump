import React from 'react';
import {
  Row, Container, Col, Form,
  FormGroup, Label, Input, FormFeedback,
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
} from 'reactstrap';
import {signup} from "../../../api/apiService"
import '../../App.css';
import LoadingButton from '../../Buttons/LoadingButton';
import useModal from "../../hooks/useModal"
import ApiModal from '../../Modals/ApiModal';
import {Link} from "react-router-dom"; 
import useFormValidation from '../../hooks/useFormValidation';

function Signup(props) {
    const {
        isOpen,
        toggle,
        modalContent,
        setModalContent
    } = useModal();

    const {
        formValidation,
        validateEmail,
        validateEmpty,
        hasValidationErrors
    } = useFormValidation()

    const userObjectDefault = {
        email: '',
        password: '',
        company: '',
        phone: '',
        address: '',
        firstName: '',
        lastName: '',
        age: '',
        eyeColor: '',
    }

    const [userObject, setUserObject] = React.useState(userObjectDefault);
    const [dropdownOpen, setDropDownOpen] = React.useState(false)
    const [buttonProcessing, setButtonProcessing] = React.useState(false)

    const handleEyeColorDropDown = (e) => {
        let value = e.target.innerText;
        setUserObject((oldState) => {
            return {
                ...oldState,
                eyeColor: value
            }
        })
    }
    
  const handleSignup = () => {
      validateEmail(userObject.email)
      validateEmpty({target: {name: "password", value: userObject.password}})
      if(hasValidationErrors())
        return;
      setButtonProcessing(true)
      function signupSuccess(response) {
        let status = response.data.status;
        let message = response.data.message;
        setButtonProcessing(false);
        if(status === "Success") {
          message = <Link className="signUpLink" to="/login">Go to Login</Link>
            setModalContent(status, message);
            toggle()
        } else {
            setModalContent(status, message);
            toggle()
        }
      }
      signup(userObject, signupSuccess);
  }

    const handleChange = async (event) => {
        const { target } = event;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const { name } = target;
        await setUserObject((oldUserObject) => {
            return {
                ...oldUserObject,
                [name]: value
            }
        })
    }

    return (
      <Container className="App container">
        <ApiModal
            isOpen={isOpen}
            status={modalContent.status}
            message={modalContent.message}
            toggle={toggle}
        >
        </ApiModal>
        <Col xs={{size: 5, offset: 4}} style={{textAlign: "center"}}>
            <img style={{width: "40%", height: "40%"}} src="/assets/logo.png"></img>
            <h2 style={{marginTop: "30px", marginBottom: "30px"}}>Smart Pump Signup</h2>
        </Col>
        <Form className="form" onSubmit={ (e) => e.preventDefault()}>
            <Row>
          <Col xs={{size: 5, offset: 4}}>
          <FormGroup>
              <Label>Email <span className="requiredInput">*</span></Label>
              <Input
                type="email"
                name="email"
                id="exampleEmail"
                placeholder="Email"
                valid={ formValidation.email === 'valid' }
                invalid={ formValidation.email === 'invalid' }
                onChange={ (e) => {
                    handleChange(e) 
                    validateEmail(e.target.value)
                }}

              />
              <FormFeedback valid>
                  Valid Email
              </FormFeedback>
              <FormFeedback>
                  Email must be a valid email
              </FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label for="password">Password <span className="requiredInput">*</span></Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="********"
                onChange={ (e) => {
                    handleChange(e) 
                    validateEmpty(e)
                }}
                valid={ formValidation.password === 'valid' }
                invalid={ formValidation.password === 'invalid' }
            />
              <FormFeedback>
                  Password cannot be empty
              </FormFeedback>
            </FormGroup>
          </Col>
            </Row>
            <Row>
                <Col xs={{size: 5, offset: 4}}>
                    <Label for="company">Company</Label>
                    <Input
                        type="text"
                        name="company"
                        id="company"
                        onChange={handleChange}
                    />
                </Col>
            </Row>
            <Row>
                <Col xs={{size: 5, offset: 4}}>
                    <Label for="phone">Phone</Label>
                    <Input
                        type="text"
                        name="phone"
                        id="phone"
                        onChange={handleChange}
                    />
                </Col>
            </Row>
            <Row>
                <Col xs={{size: 5, offset: 4}}>
                    <Label for="address">Address</Label>
                    <Input
                        type="text"
                        name="address"
                        id="address"
                        onChange={handleChange}
                    />
                </Col>
            </Row>
            <Row>
                <Col xs={{size: 2, offset: 4}}>
                    <Label for="firstName">First Name</Label>
                    <Input 
                        type="text"
                        name="firstName"
                        id="firstName"
                        onChange={handleChange}
                    />
                </Col>
                <Col xs={{size: 2}}>
                    <Label for="lastName">Last Name</Label>
                    <Input 
                        type="text"
                        name="lastName"
                        id="lastName"
                        onChange={handleChange}
                    />
                </Col>
            </Row>
            <Row>
                <Col xs={{size: 2, offset: 4}}>
                <Label for="age">Age</Label>
                    <Input 
                        type="number"
                        name="age"
                        id="age"
                        onChange={handleChange}
                    />
                </Col>
                <Col xs={{size: 2}}>
                    <Label>Eye Color</Label>
                    <Dropdown direction="right" style={{marginTop: "5px"}} isOpen={dropdownOpen} toggle={() => setDropDownOpen((oldState) => !oldState)}>
                    <DropdownToggle caret>
                        {(userObject.eyeColor)? userObject.eyeColor : "Select"}
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem onClick={handleEyeColorDropDown}>Black</DropdownItem>
                        <DropdownItem onClick={handleEyeColorDropDown}>Blue</DropdownItem>
                        <DropdownItem onClick={handleEyeColorDropDown}>Brown</DropdownItem>
                        <DropdownItem onClick={handleEyeColorDropDown}>Gray</DropdownItem>
                        <DropdownItem onClick={handleEyeColorDropDown}>Green</DropdownItem>
                        <DropdownItem onClick={handleEyeColorDropDown}>Hazel</DropdownItem>
                        <DropdownItem onClick={handleEyeColorDropDown}>Brown</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </Col>
            </Row>
            <Row style={{marginTop: "20px"}}>
                <Col style={{textAlign: "center"}} xs={{size: 5, offset: 5}}>
                  <LoadingButton
                      text="Sign Up!"
                      onClick={handleSignup}
                      loading={buttonProcessing}
                  />
                </Col>
            </Row>
      </Form>
      </Container>
    );
}

export default Signup;