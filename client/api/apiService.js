import axios from "axios";
const instance = axios.create({
  baseURL: `http://${process.env.HOST}:${process.env.SERVER_PORT}/`,
  timeout: 1000,
  headers: {
    'X-Custom-Header': 'foobar', 
}
});

const loginPage = `http://${process.env.HOST}:${process.env.CLIENT_PORT}/login`;
const accountPage = `http://${process.env.HOST}:${process.env.CLIENT_PORT}/account`

function useConfig() {
    let config = {
        headers: {
          Authorization: localStorage.getItem("jwt")
        }
    }
    return config;
}

export const getUserData = (onSuccess, onFail) => {
    instance.get(`account`, useConfig())
        .then(response => {
            console.log("success", response);
            onSuccess && onSuccess(response)
        })
        .catch((e) => {
            window.location.replace(loginPage)
            onFail && onFail(e)
        })
}

export const login = (payload, onSuccess, onFail) => {
    instance.post("accounts/login", payload)
        .then(response => {
            console.log("success", response);
            //get userId from token
            localStorage.setItem("jwt", response.data.token);
            onSuccess && onSuccess(response)
            //now redirect to user page
            window.location.replace(accountPage);
        })
        .catch((e) => {
            console.log("error:"+accountPage, e)
            onFail && onFail(e)
        })
}

export const signup = (payload, onSuccess, onFail) =>  {
    instance.post("accounts/register", payload)
    .then(response => {
        console.log("success", response)
        onSuccess && onSuccess(response)
    })
    .catch(e => {
        console.log("error", e)
        onFail && onFail(e)
    })
}

export const update = (payload, onSuccess, onFail) =>  {
    instance.post("accounts/update", payload, useConfig())
    .then(response => {
        console.log("success", response)
        onSuccess && onSuccess(response)
    })
    .catch(e => {
        console.log("error", e)
        onFail && onFail(e)
    })
}
