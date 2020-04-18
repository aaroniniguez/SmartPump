import axios from "axios";
const instance = axios.create({
  baseURL: `http://${process.env.HOST}:${process.env.SERVER_PORT}/`,
  timeout: 1000,
});

const loginPage = `http://${process.env.HOST}:${process.env.CLIENT_PORT}/login`;
const accountPage = `http://${process.env.HOST}:${process.env.CLIENT_PORT}/account`

function useConfig() {
    let config = {
        withCredentials: true
    }
    return config;
}

export const isLoggedIn = async() => {
    let returnVal = await instance.get(`account`, useConfig())
        .then(response => {
            return true;
        })
        .catch((e) => {
            return false;
        })
    return returnVal;
}

export const getUserData = (onSuccess, onFail) => {
    instance.get(`account`, useConfig())
        .then(response => {
            onSuccess && onSuccess(response)
        })
        .catch((e) => {
            window.location.replace(loginPage)
            onFail && onFail(e)
        })
}

export const login = (payload, onSuccess, onFail) => {
    instance.post("login", payload, useConfig())
        .then(response => {
            onSuccess && onSuccess(response)
            window.location.replace(accountPage);
        })
        .catch((e) => {
            onFail && onFail(e)
        })
}

export const logout = (onSuccess, onFail) => {
    instance.get("logout", useConfig())
        .then(response => {
            onSuccess && onSuccess(response)
        })
        .catch((e) => {
            onFail && onFail(e)
        })
}
export const signup = (payload, onSuccess, onFail) =>  {
    instance.post("account", payload)
    .then(response => {
        onSuccess && onSuccess(response)
    })
    .catch(e => {
        onFail && onFail(e)
    })
}

export const update = (payload, onSuccess, onFail) =>  {
    instance.put("account", payload, useConfig())
    .then(response => {
        onSuccess && onSuccess(response)
    })
    .catch(e => {
        onFail && onFail(e)
    })
}
