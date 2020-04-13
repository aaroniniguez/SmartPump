import React from 'react';
import { getUserData } from '../../../api/apiService';
import {
  Row, Container, Col, Form,
  FormGroup, Label, Input, FormFeedback,
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
  Modal, ModalHeader, ModalBody
} from 'reactstrap';
import {update} from "../../../api/apiService"
import '../../App.css';
import LoadingButton from '../../Buttons/LoadingButton';
import {Link} from "react-router-dom"; 

function UserAccount(props) {
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
        balance: ''
    }

    const modalDefaultState = {
        open: false,
        message: null,
        status: null
    }

    const formValidationDefault = {
        email: 'has-success',
        password: 'has-success'
    }

    const [formValidation, setFormValidation] = React.useState(formValidationDefault)
    const [userObject, setUserObject] = React.useState(userObjectDefault);
    const [submittedModal, setSubmittedModal] = React.useState(modalDefaultState);
    const [dropdownOpen, setDropDownOpen] = React.useState(false)
    const [buttonProcessing, setButtonProcessing] = React.useState(false)

    const handleLogout = () => {
        localStorage.removeItem("jwt");
    }
    
    const handleEyeColorDropDown = (e) => {
        let value = e.target.innerText;
        setUserObject((oldState) => {
            return {
                ...oldState,
                eyeColor: value
            }
        })
    }
    
    const validateEmail = (email) => {
        const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (emailRex.test(email)) {
            setFormValidation(oldState => {
                return {...oldState, email: 'has-success'}
            })
        } else {
            setFormValidation(oldState => {
                return {...oldState, email: 'invalid'}
            })
        }
    }

    const validateEmpty = (event) => {
        let vInput = (event.target.value === "") ? "invalid" : "has-success";
        let targetName = event.target.name;
        setFormValidation(oldState => {
            return {...oldState, [targetName]: vInput}
        })
    }

    const hasValidationErrors = () => {
        let inputsNeedingValidation = Object.keys(formValidation)
        let validationErrors = false;
        inputsNeedingValidation.forEach(input => {
        if(formValidation[input] !== "has-success")
            validationErrors = true;
        });
        return validationErrors;
    }

    const handleUpdate = () => {
        validateEmail(userObject.email)
        validateEmpty({target: {name: "password", value: userObject.password}})
        if(hasValidationErrors())
            return;
        setButtonProcessing(true)
        console.log(userObject)
        update(userObject, (response) => {
            setButtonProcessing(false)
            toggleModal("success","Successfully updated!");
        });
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

    const toggleModal = (status = null, message = null) => {
        setSubmittedModal((oldState) => {
          return {
              open: !oldState.open,
              message,
              status
          }
        });
    }

    React.useEffect(() => {
        //get user data here
        getUserData((response)=> {
            let firstName = response.data.name.first;
            let lastName = response.data.name.last;
            setUserObject(oldState => {
                return {
                    ...oldState,
                    ...response.data,
                    firstName,
                    lastName
                }
            });
        })
    }, []);

    return (
      <Container className="App container">
        <div style={{textAlign: "right"}}>
            <Link onClick={() => handleLogout()} to="/login">
                Logout
            </Link>
        </div>
        <Modal toggle={() => toggleModal()} isOpen={submittedModal.open}>
          <ModalHeader toggle={() => toggleModal()}>
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
            <h2 style={{marginTop: "30px", marginBottom: "30px"}}>Smart Pump Account Info</h2>
        </Col>
        <Form className="form" onSubmit={ (e) => e.preventDefault()}>
            <Row>
          <Col xs={{size: 5, offset: 4}}>
              <Label>Balance: </Label>
              <Input
                type="text"
                name="balance"
                id="balance"
                placeholder=""
                value={ userObject.balance }
                onChange={ (e) => {
                    handleChange(e) 
                    validateEmpty(e)
                }}
              />
            <FormGroup>
              <Label>Email <span className="requiredInput">*</span></Label>
              <Input
                type="email"
                name="email"
                id="exampleEmail"
                placeholder="Email"
                value={ userObject.email }
                valid={ formValidation.email === 'has-success' }
                invalid={ formValidation.email === 'invalid' }
                disabled
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
                value={ userObject.password }
                onChange={ (e) => {
                    handleChange(e) 
                    validateEmpty(e)
                }}
                valid={ formValidation.password === 'has-success' }
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
                        value={userObject.company}
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
                        value={userObject.phone}
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
                        value={userObject.address}
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
                        value={userObject.firstName}
                    />
                </Col>
                <Col xs={{size: 2}}>
                    <Label for="lastName">Last Name</Label>
                    <Input 
                        type="text"
                        name="lastName"
                        id="lastName"
                        onChange={handleChange}
                        value={userObject.lastName}
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
                        value={userObject.age}
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
                      text="Update"
                      onClick={handleUpdate}
                      loading={buttonProcessing}
                  />
                </Col>
            </Row>
      </Form>
      </Container>
    );
}

export default UserAccount;
