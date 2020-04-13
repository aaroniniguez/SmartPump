import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'reactstrap';
import "./NotFound.css"
const NotFound = () => (
    <Container className="notFoundContainer">
        <h3>404 Not Found</h3>
        <div>
            <Link to="/login">
                Return to Home Page
            </Link>
        </div>
    </Container>
);
export default NotFound;