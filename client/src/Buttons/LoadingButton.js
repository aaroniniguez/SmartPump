import React from 'react';
import {Button, Spinner} from 'reactstrap';
import "./LoadingButton.css";

function LoadingButton(props) {
    const {text, loading, onClick, style} = props;
    return (
        <Button className="loadingButton" onClick={onClick} color="primary" style={style}>
            <div style={{flex: "1"}}>
                {text}
            </div>
            {(loading ? (
            <Spinner size="sm" color="white"></Spinner>
            ) : null)}
        </Button>
    );
}

export default LoadingButton;