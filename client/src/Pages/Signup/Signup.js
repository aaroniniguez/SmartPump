import React, { Component } from 'react';
import {
  Row, Container, Col, Form,
  FormGroup, Label, Input, FormFeedback,
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
  Modal, ModalHeader, ModalBody
} from 'reactstrap';
import {signup} from "../../../api/apiService"
import '../../App.css';
import LoadingButton from '../../Buttons/LoadingButton';
import {Link} from "react-router-dom"; 

class Signup extends Component {
  constructor(props) {
      super(props);
      this.state = {
        submittedModal: {
          open: false,
          message: null,
          status: null
        },
        buttonProcessing: false,
        dropdownOpen: false,
        email: '',
        password: '',
        company: '',
        phone: '',
        address: '',
        firstName: '',
        age: '',
        lastName: '',
        eyeColor: '',
        validate: {
            email: '',
            password: '',
        },
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.handleEyeColorDropDown = this.handleEyeColorDropDown.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleDropDown() {
    this.setState((oldState) => {
        let newState = {
            dropdownOpen: !oldState.dropdownOpen
        };
        return newState;
    }) 
  }

  handleEyeColorDropDown(e) {
      let value = e.target.innerText;
      this.setState({
          eyeColor: value,
      });
  }

  validateEmail(email) {
    const { validate } = this.state
    const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(email)) {
        validate.email = 'has-success';
    } else {
        validate.email = 'invalid';
    }
    this.setState({ validate })
  }

  validateEmpty(event) {
    let vInput = (event.target.value === "") ? "invalid" : "has-success";
    let targetName = event.target.name;
    this.setState((oldState) => {
        const newState = {...oldState};
        newState.validate[targetName] = vInput;
        return newState;
    })
}

  hasValidationErrors() {
    let inputsNeedingValidation = Object.keys(this.state.validate)
    let validationErrors = false;
    inputsNeedingValidation.forEach(input => {
      if(this.state.validate[input] !== "has-success")
        validationErrors = true;
    });
    return validationErrors;
  }

  handleSignup() {
      this.validateEmail(this.state.email)
      this.validateEmpty({target: {name: "password", value: this.state.password}})
      if(this.hasValidationErrors())
        return;
      this.setState({buttonProcessing: true})
      signup(this.state, (response) => {
        let status = response.data.status;
        let message = response.data.message;
        this.setState({buttonProcessing: false})
        if(status === "Success") {
          message = <Link className="signUpLink" to="/login">Go to Login</Link>
        }
        this.toggleModal(status, message);
      });
      console.log(this.state)
  }

  handleChange = async (event) => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    await this.setState({
      [ name ]: value,
    });
  }

  submitForm(e) {
    e.preventDefault()
  }

  toggleModal(status = null, message = null) {
    this.setState((oldState) => {
      return {
        submittedModal: {
          open: !oldState.submittedModal.open,
          message,
          status
        }
      }
    });
  }

  render() {
    const {
        email,
        password,
        dropdownOpen,
        submittedModal
    } = this.state;
    return (
      //passin in isOpen, status, message...
      <Container className="App container">
        <Modal isOpen={submittedModal.open} toggle={() => this.toggleModal()}>
          <ModalHeader toggle={() => this.toggleModal()}>
          {(submittedModal.status === "Error") ? (
            <span className="modalError">{submittedModal.status}</span>
          ) : (
            <span className="modalSuccess">{submittedModal.status}</span>
          )}
          </ModalHeader>
          <ModalBody>
            {submittedModal.message}
          </ModalBody>
        </Modal>

        <Col xs={{size: 5, offset: 4}} style={{textAlign: "center"}}>
            <img style={{width: "40%", height: "40%"}} src="/assets/logo.png"></img>
            <h2 style={{marginTop: "30px", marginBottom: "30px"}}>Smart Pump Signup</h2>
        </Col>
        <Form className="form" onSubmit={ (e) => this.submitForm(e) }>
            <Row>
          <Col xs={{size: 5, offset: 4}}>
            <FormGroup>
              <Label>Email <span className="requiredInput">*</span></Label>
              <Input
                type="email"
                name="email"
                id="exampleEmail"
                placeholder="Email"
                value={ email }
                valid={ this.state.validate.email === 'has-success' }
                invalid={ this.state.validate.email === 'invalid' }
                onChange={ (e) => {
                            this.validateEmail(e.target.value)
                            this.handleChange(e)
                          } }
              />
              <FormFeedback valid>
                  Valid Email
              </FormFeedback>
              <FormFeedback>
                  Email must be a valid email
              </FormFeedback>
            </FormGroup>
          </Col>
            </Row>
            <Row>
          <Col xs={{size: 5, offset: 4}}>
            <FormGroup>
              <Label for="password">Password <span className="requiredInput">*</span></Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="********"
                value={ password }
                onChange={ (e) => {
                    this.handleChange(e) 
                    this.validateEmpty(e)
                }}
                valid={ this.state.validate.password === 'has-success' }
                invalid={ this.state.validate.password === 'invalid' }
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
                        onChange={this.handleChange}
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
                        onChange={this.handleChange}
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
                        placeholder="1234 Main St"
                        onChange={this.handleChange}
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
                        onChange={this.handleChange}
                    />
                </Col>
                <Col xs={{size: 2}}>
                    <Label for="lastName">Last Name</Label>
                    <Input 
                        type="text"
                        name="lastName"
                        id="lastName"
                        onChange={this.handleChange}
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
                        onChange={this.handleChange}
                    />
                </Col>
                <Col xs={{size: 2}}>
                    <Label>Eye Color</Label>
                    <Dropdown direction="right" style={{marginTop: "5px"}} isOpen={dropdownOpen} toggle={this.toggleDropDown}>
                    <DropdownToggle caret>
                        {(this.state.eyeColor)? this.state.eyeColor : "Select"}
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem onClick={this.handleEyeColorDropDown}>Black</DropdownItem>
                        <DropdownItem onClick={this.handleEyeColorDropDown}>Blue</DropdownItem>
                        <DropdownItem onClick={this.handleEyeColorDropDown}>Brown</DropdownItem>
                        <DropdownItem onClick={this.handleEyeColorDropDown}>Gray</DropdownItem>
                        <DropdownItem onClick={this.handleEyeColorDropDown}>Green</DropdownItem>
                        <DropdownItem onClick={this.handleEyeColorDropDown}>Hazel</DropdownItem>
                        <DropdownItem onClick={this.handleEyeColorDropDown}>Brown</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </Col>
            </Row>
            <Row style={{marginTop: "20px"}}>
                <Col style={{textAlign: "center"}} xs={{size: 5, offset: 5}}>
                  <LoadingButton
                      text="Sign Up!"
                      onClick={this.handleSignup}
                      loading={this.state.buttonProcessing}
                  />
                </Col>
            </Row>
      </Form>
      </Container>
    );
  }
}
export default Signup;
