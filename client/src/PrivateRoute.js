
import {isLoggedIn} from "../api/apiService";
import React from "react";
import {Redirect, Route} from 'react-router-dom';
import { Spinner } from 'reactstrap';

function PrivateRoute(props) {
  const [loading, setLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  React.useEffect(() =>{
        isLoggedIn().then((isAuthenticated) => {
            //give it a little pause so it transitions nicely
            setTimeout(() => {
             setIsAuthenticated(isAuthenticated);
             setLoading(false);
            }, 300)
      })
  }, [])

  const { component: Component, ...rest } = props
  return (
    <Route
          {...rest}
          render={props =>
            isAuthenticated ? (
              <Component {...props} />
            ) : (
                loading ? (
                    <div style={{height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <Spinner color="primary" />
                    </div>
                ) : (
                    <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                  )
              )
          }
    />
  );
}

export default PrivateRoute;