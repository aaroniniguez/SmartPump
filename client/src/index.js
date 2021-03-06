import React from "react";
import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter,Route, Switch} from 'react-router-dom';
import NotFound from "./Pages/NotFound";
import Signup from "./Pages/Signup";
import SignIn from "./Pages/SignIn/index.js";
import UserAccount from "./Pages/UserAccount";
import PrivateRoute from "./PrivateRoute.js";
ReactDOM.render(
        <BrowserRouter>
          <Switch>
                <Route exact path = "/login">
                    <SignIn/>
                </Route>
                <Route exact path = "/signup">
                    <Signup/>
                </Route>
                <PrivateRoute exact path="/account" component={UserAccount} />
                <Route path="*">
                    <NotFound homePage="/login"/>
                </Route>
            </Switch>
        </BrowserRouter>,
    document.getElementById('root')
  );
  