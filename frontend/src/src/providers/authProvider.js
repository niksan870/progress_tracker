import { BASE_API_AUTH_URL } from "../../constants";
const axios = require('axios');
var qs = require('qs');

export default {
  login: ({ username, password }) => {
    const request = new Request(`${BASE_API_AUTH_URL}`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(({ access, refresh }) => {
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
      });
  },
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return Promise.resolve();
  },
  checkError: (error) => {
    // ...
  },
  checkAuth: () => {
    let refreshToken = localStorage.getItem("refreshToken")
    let data = qs.stringify({
      'refresh': refreshToken
    });
    let config = {
      method: 'post',
      url: `${BASE_API_AUTH_URL}refresh/?`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        localStorage.setItem('accessToken', response.data.access)
      })
      .catch(function (error) {
        console.log(error);
      });

    return localStorage.getItem("accessToken")
      ? Promise.resolve()
      : Promise.reject();
  },
  getPermissions: () => {
    const role = localStorage.getItem("permissions");
    return role ? Promise.resolve(role) : Promise.reject();
  },
};
