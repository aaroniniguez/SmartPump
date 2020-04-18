import React, { useState } from 'react';
import {
  Row, Container, Col, Form,
  FormGroup, Label, Input,
  FormFeedback,
} from 'reactstrap';
import {Link} from "react-router-dom"; 
import {login} from "../../../api/apiService"
import '../../App.css';
import LoadingButton from '../../Buttons/LoadingButton';
import ApiModal from '../../Modals/ApiModal';
import useModal from "../../hooks/useModal"
import useFormValidation from "../../hooks/useFormValidation"

function SignIn(props) {
    const [buttonProcessing, setButtonProcessing] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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

  const handleLogin = () => {
      validateEmail(email)
      validateEmpty({target: {name: "password", value: password}})
      if(hasValidationErrors())
        return;
      setButtonProcessing(true)

      let loginPayload = {
          email,
          password
      };
      login(loginPayload, () => {
          setButtonProcessing(false)
      }, (e) => {
          setButtonProcessing(false)
          setModalContent("Error", "Invalid Username/Pasword combination")
          toggle()
      });
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
        <Col xs={{size: 6, offset: 3}} style={{textAlign: "center"}}>
            <img style={{width: "40%", height: "40%"}} src="/assets/logo.png"></img>
        </Col>
        <Form className="form" onSubmit={ (e) => e.preventDefault()}>
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
                valid={ formValidation.email === 'valid' }
                invalid={ formValidation.email === 'invalid' }
                onChange={ (e) => {
                    validateEmail(e.target.value)
                    setEmail(e.target.value)
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
                    setPassword(e.target.value)
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
                <Col style={{display: "flex", alignItems: "center", textAlign: "center"}} xs={{size: 4, offset: 4}}>
                    <LoadingButton
                      text="Login"
                      loading={buttonProcessing}
                      onClick={handleLogin}
                      style={{flex: "1"}}
                    />
                    <Link className="signUpLink" to="/signup">Sign Up Now!</Link>
                </Col>
            </Row>
      </Form>
      </Container>
    );
}
export default SignIn;