import * as actionTypes from './actionTypes';
import axios from 'axios';
import qs from 'qs';

export const fetchKategoriStart = () => {
  return {
    type: actionTypes.FETCH_KATEGORI_START
  };
};

export const fetchKategoriSuccess = kategori => {
  return {
    type: actionTypes.FETCH_KATEGORI_SUCCESS,
    kategori
  };
};

export const fetchKategoriFail = error => {
  return {
    type: actionTypes.FETCH_KATEGORI_FAIL,
    error
  };
};

export const fetchKategori = token => {
  return async dispatch => {
    dispatch(fetchKategoriStart());
    const url = '/api/kategori/all';
    const options = {
      method: 'GET',
      headers: { 
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': token
      },
      url
    };
    await axios(options)
      .then(response => {
        dispatch(fetchKategoriSuccess(response.data));
      })
      .catch(error => {
        dispatch(fetchKategoriFail(error.response.data));
      });
  }
};

export const postKategoriStart = () => {
  return {
    type: actionTypes.POST_KATEGORI_START,
  };
};

export const postKategoriSuccess = sukses => {
  return {
    type: actionTypes.POST_KATEGORI_SUCCESS,
    sukses
  };
};

export const postKategoriFail = error => {
  return {
    type: actionTypes.POST_KATEGORI_FAIL,
    error
  };
};

export const postKategori = (kategori, token) => {
  return async dispatch => {
    dispatch(postKategoriStart());
    const url = `/api/kategori`;
    const options = {
      method: 'POST',
      headers: { 
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': token
      },
      data: qs.stringify(kategori),
      url
    };
    await axios(options)
      .then(response => {
        dispatch(postKategoriSuccess(response.data.success));
      })
      .catch(error => {
        dispatch(postKategoriFail(error.response.data))
      });
  }
};

export const deleteKategoriStart = () => {
  return {
    type: actionTypes.DELETE_KATEGORI_START
  };
};

export const deleteKategoriSuccess = sukses => {
  return {
    type: actionTypes.DELETE_KATEGORI_SUCCESS,
    sukses
  };
};

export const deleteKategoriFail = error => {
  return {
    type: actionTypes.DELETE_KATEGORI_FAIL,
    error
  };
};

export const deleteKategori = (kodeKategori, token) => {
  return async dispatch => {
    dispatch(deleteKategoriStart());
    const url = `/api/kategori?kategori=${kodeKategori}`;
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
        dispatch(deleteKategoriSuccess(response.data.success));
      })
      .catch(error => {
        dispatch(deleteKategoriFail(error.response.data))
      });
  }
};

export const updateKategoriStart = () => {
  return {
    type: actionTypes.UPDATE_KATEGORI_START
  };
};

export const updateKategoriSuccess = sukses => {
  return {
    type: actionTypes.UPDATE_KATEGORI_SUCCESS,
    sukses,
  };
};

export const updateKategoriFail = error => {
  return {
    type: actionTypes.UPDATE_KATEGORI_FAIL,
    error
  };
};

export const updateKategori = (kodeKategori, token, kategori) => {
  return async dispatch => {
    dispatch(updateKategoriStart());
    const url = `/api/kategori/update?kategori=${kodeKategori}`;
    const options = {
      method: 'POST',
      headers: { 
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': token
      },
      data: qs.stringify(kategori),
      url
    };
    await axios(options)
      .then(response => {
        dispatch(updateKategoriSuccess(response.data.success));
      })
      .catch(error => {
        dispatch(updateKategoriFail(error.response.data))
      });
  }
};
