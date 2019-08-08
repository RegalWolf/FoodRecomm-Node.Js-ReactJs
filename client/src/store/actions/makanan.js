import * as actionTypes from './actionTypes';
import axios from 'axios';
import qs from 'qs';

export const fetchMakananStart = () => {
  return {
    type: actionTypes.FETCH_MAKANAN_START
  };
};

export const fetchMakananSuccess = makanan => {
  return {
    type: actionTypes.FETCH_MAKANAN_SUCCESS,
    makanan
  };
};

export const fetchMakananFail = error => {
  return {
    type: actionTypes.FETCH_MAKANAN_FAIL,
    error
  };
};

export const fetchMakanan = token => {
  return dispatch => {
    dispatch(fetchMakananStart());
    const url = `/api/makanan/all`;
    const options = {
      method: 'GET',
      headers: { 
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': token
      },
      url
    };
    axios(options)
      .then(response => {
        dispatch(fetchMakananSuccess(response.data));
      })
      .catch(error => {
        dispatch(fetchMakananFail(error.response.data));
      });
  }
};

export const postMakananStart = () => {
  return {
    type: actionTypes.POST_MAKANAN_START,
  };
};

export const postMakananSuccess = sukses => {
  return {
    type: actionTypes.POST_MAKANAN_SUCCESS,
    sukses
  };
};

export const postMakananFail = error => {
  return {
    type: actionTypes.POST_MAKANAN_FAIL,
    error
  };
};

export const postMakanan = (makanan, token) => {
  return async dispatch => {
    dispatch(postMakananStart());
    const url = `/api/makanan`;
    const options = {
      method: 'POST',
      headers: { 
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': token
      },
      data: qs.stringify(makanan),
      url
    };
    await axios(options)
      .then(response => {
        dispatch(postMakananSuccess(response.data.success));
      })
      .catch(error => {
        dispatch(postMakananFail(error.response.data))
      });
  }
};

export const deleteMakananStart = () => {
  return {
    type: actionTypes.DELETE_MAKANAN_START
  };
};

export const deleteMakananSuccess = sukses => {
  return {
    type: actionTypes.DELETE_MAKANAN_SUCCESS,
    sukses
  };
};

export const deleteMakananFail = error => {
  return {
    type: actionTypes.DELETE_MAKANAN_FAIL,
    error
  };
};

export const deleteMakanan = (makanan_id, token) => {
  return async dispatch => {
    dispatch(deleteMakananStart());
    const url = `/api/makanan?makanan_id=${makanan_id}`;
    const options = {
      method: 'DELETE',
      headers: { 
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': token
      },
      url
    };
    await axios(options)
      .then(response => {
        dispatch(deleteMakananSuccess(response.data.success));
      })
      .catch(error => {
        dispatch(deleteMakananFail(error.response.data))
      });
  }
};

export const updateMakananStart = () => {
  return {
    type: actionTypes.UPDATE_MAKANAN_START
  };
};

export const updateMakananSuccess = sukses => {
  return {
    type: actionTypes.UPDATE_MAKANAN_SUCCESS,
    sukses,
  };
};

export const updateMakananFail = error => {
  return {
    type: actionTypes.UPDATE_MAKANAN_FAIL,
    error
  };
};

export const updateMakanan = (makanan_id, token, makanan) => {
  return async dispatch => {
    dispatch(updateMakananStart());
    const url = `/api/makanan/update?makanan_id=${makanan_id}`;
    const options = {
      method: 'POST',
      headers: { 
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': token
      },
      data: qs.stringify(makanan),
      url
    };
    await axios(options)
      .then(response => {
        dispatch(updateMakananSuccess(response.data.success));
      })
      .catch(error => {
        dispatch(updateMakananFail(error.response.data))
      });
  }
};
