import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter,Route, Switch} from 'react-router-dom';
import NotFound from "./Pages/NotFound";
import Signup from "./Pages/Signup";
import UserAccount from "./Pages/UserAccount";
import { isLoggedIn } from "../api/apiService.js";
import PrivateRoute from "./PrivateRoute.js";
import {Fade} from "./Fade.js"
ReactDOM.render(
        <BrowserRouter>
          <Switch>
                <Route exact path = "/login">
                    <App/>
                </Route>
                <Route exact path = "/signup">
                    <Signup/>
                </Route>
                    <PrivateRoute exact path="/account" component={UserAccount} />
                <Route path="*">
                    <NotFound/>
                </Route>
            </Switch>
        </BrowserRouter>,
    document.getElementById('root')
  );
  