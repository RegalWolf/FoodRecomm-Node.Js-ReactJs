import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = (token) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token
  };
};

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error
  };
};

export const auth = (username, password) => {
  return async dispatch => {
    dispatch(authStart());
    const authData = {
      username,
      password
    };
    const url = '/api/admin/login';
    await axios.post(url, authData)
      .then(response => {
        localStorage.setItem('token', response.data.token);
        dispatch(authSuccess(response.data.token));
      })
      .catch(error => {
        dispatch(authFail(error.response.data));
      });
  }
};

export const logout = () => {
  // remove local storage
  localStorage.removeItem('token');

  return {
    type: actionTypes.AUTH_LOGOUT
  };
};