import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'reactstrap';
import "./NotFound.css"
const NotFound = (props) => {
    const {homePage} = props
    return (<Container className="notFoundContainer">
        <h3>404 Not Found</h3>
        <div>
            <Link to={homePage}>
                Return to Home Page
            </Link>
        </div>
    </Container>
)};
export default NotFound;