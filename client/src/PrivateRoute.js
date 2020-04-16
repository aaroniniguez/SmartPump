import {isLoggedIn} from "../api/apiService";
import React from "react";
import {Redirect, Route} from 'react-router-dom';
import { Spinner } from 'reactstrap';
export default class PrivateRoute extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        loading: true,
        isAuthenticated: false
      }
    }
    componentDidMount() {
        isLoggedIn().then((isAuthenticated) => {
            //give it a little pause so it transitions nicely
            setTimeout(() => {
                this.setState({
                    loading: false,
                    isAuthenticated
                })
            }, 300)
      })
    }
    
    render() {
      const { component: Component, ...rest } = this.props
      return (
        <Route
          {...rest}
          render={props =>
            this.state.isAuthenticated ? (
              <Component {...props} />
            ) : (
                this.state.loading ? (
                    <div style={{height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <Spinner color="primary" />
                    </div>
                ) : (
                    <Redirect to={{ pathname: '/login', state: { from: this.props.location } }} />
                  )
              )
          }
        />
      )
    }
  }