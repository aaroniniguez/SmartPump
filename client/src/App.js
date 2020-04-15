import React, { Component } from 'react';
import {
  Row, Container, Col, Form,
  FormGroup, Label, Input,
  Button, FormText, FormFeedback,
} from 'reactstrap';
import {Link} from "react-router-dom"; 
import {login, isLoggedIn} from "../api/apiService"
import './App.css';
import LoadingButton from './Buttons/LoadingButton';

import {
  Modal, ModalHeader, ModalBody
} from 'reactstrap';

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
        submittedModal: {
          open: false,
          message: null,
          status: null
        },
        buttonProcessing: false,
        email: '',
        password: '',
        validate: {
          email: '',
          password: '',
        },
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
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

  handleLogin() {
      this.validateEmail(this.state.email)
      this.validateEmpty({target: {name: "password", value: this.state.password}})
      if(this.hasValidationErrors())
        return;
      this.setState({buttonProcessing: true})
      //now do login part...
      let loginPayload = {
          email: this.state.email,
          password: this.state.password 
      };
      login(loginPayload, () => {
        this.setState({buttonProcessing: false})
      }, (e) => {
        this.setState({buttonProcessing: false})
        this.toggleModal("Error", "Invalid Username/Pasword combination");
      });
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

  render() {
    const { email, password } = this.state;
    return (
      <Container className="App container">
        <Modal toggle={() => this.toggleModal()} isOpen={this.state.submittedModal.open}>
          <ModalHeader toggle={() => this.toggleModal()}>
          {(this.state.submittedModal.status === "Error") ? (
            <span className="modalError">{this.state.submittedModal.status}</span>
          ) : (
            <span className="modalSuccess">{this.state.submittedModal.status}</span>
          )}
          </ModalHeader>
          <ModalBody>
            {this.state.submittedModal.message}
          </ModalBody>
      </Modal>
        <Col xs={{size: 6, offset: 3}} style={{textAlign: "center"}}>
            <img style={{width: "40%", height: "40%"}} src="/assets/logo.png"></img>
        </Col>
        <Form className="form" onSubmit={ (e) => this.submitForm(e) }>
            <Row>
          <Col xs={{size: 4, offset: 4}}>
            <FormGroup>
              <Label>Username</Label>
              <Input
                type="email"
                name="email"
                id="exampleEmail"
                placeholder="Username"
                value={ email }
                valid={ this.state.validate.email === 'has-success' }
                invalid={ this.state.validate.email === 'invalid' }
                onChange={ (e) => {
                            this.validateEmail(e.target.value)
                            this.handleChange(e)
                          } }
              />
              <FormFeedback valid>
                  Valid Username
              </FormFeedback>
              <FormFeedback>
                  Username must be an email
              </FormFeedback>
            </FormGroup>
          </Col>
            </Row>
            <Row>
          <Col xs={{size: 4, offset: 4}}>
            <FormGroup>
              <Label for="examplePassword">Password</Label>
              <Input
                type="password"
                name="password"
                id="examplePassword"
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
                <Col style={{display: "flex", alignItems: "center", textAlign: "center"}} xs={{size: 4, offset: 4}}>
                    <LoadingButton
                      text="Login"
                      loading={this.state.buttonProcessing}
                      onClick={this.handleLogin}
                      style={{flex: "1"}}
                    />
                    <Link className="signUpLink" to="/signup">Sign Up Now!</Link>
                </Col>
            </Row>
      </Form>
      </Container>
    );
  }
}
export default App;