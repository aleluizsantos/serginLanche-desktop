const axios = require("axios");

const host =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_HOST_URL_DEVELOPMENT
    : process.env.REACT_APP_HOST_URL;

const api = axios.create({
  baseURL: host,
});
api.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

module.exports = api;
