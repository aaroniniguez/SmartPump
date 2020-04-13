import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter,Route, Switch} from 'react-router-dom';
import NotFound from "./Pages/NotFound";
import Signup from "./Pages/Signup";
import UserAccount from "./Pages/UserAccount";
ReactDOM.render(
        <BrowserRouter>
          <Switch>
                <Route exact path = "/login">
                    <App/>
                </Route>
                <Route exact path = "/signup">
                    <Signup/>
                </Route>
                <Route exact path = "/account">
                    <UserAccount/>
                </Route>
                <Route path="*">
                    <NotFound/>
                </Route>
            </Switch>
        </BrowserRouter>,
    document.getElementById('root')
  );
  