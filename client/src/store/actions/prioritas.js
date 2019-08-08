import * as actionTypes from './actionTypes';
import axios from 'axios';
import qs from 'qs';

export const fetchPrioritasStart = () => {
  return {
    type: actionTypes.FETCH_PRIORITAS_START
  };
};

export const fetchPrioritasSuccess = prioritas => {
  return {
    type: actionTypes.FETCH_PRIORITAS_SUCCESS,
    prioritas
  };
};

export const fetchPrioritasFail = error => {
  return {
    type: actionTypes.FETCH_PRIORITAS_FAIL,
    error
  };
};

export const fetchPrioritas = token => {
  return async dispatch => {
    dispatch(fetchPrioritasStart());
    const url = '/api/prioritas/all';
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
        dispatch(fetchPrioritasSuccess(response.data));
      })
      .catch(error => {
        dispatch(fetchPrioritasFail(error.response.data));
      });
  }
};

export const postPrioritasStart = () => {
  return {
    type: actionTypes.POST_PRIORITAS_START,
  };
};

export const postPrioritasSuccess = sukses => {
  return {
    type: actionTypes.POST_PRIORITAS_SUCCESS,
    sukses
  };
};

export const postPrioritasFail = error => {
  return {
    type: actionTypes.POST_PRIORITAS_FAIL,
    error
  };
};

export const postPrioritas = (prioritas, token) => {
  return async dispatch => {
    dispatch(postPrioritasStart());
    const url = `/api/prioritas`;
    const options = {
      method: 'POST',
      headers: { 
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': token
      },
      data: qs.stringify(prioritas),
      url
    };
    await axios(options)
      .then(response => {
        dispatch(postPrioritasSuccess(response.data.success));
      })
      .catch(error => {
        dispatch(postPrioritasFail(error.response.data))
      });
  }
};

export const deletePrioritasStart = () => {
  return {
    type: actionTypes.DELETE_PRIORITAS_START
  };
};

export const deletePrioritasSuccess = sukses => {
  return {
    type: actionTypes.DELETE_PRIORITAS_SUCCESS,
    sukses
  };
};

export const deletePrioritasFail = error => {
  return {
    type: actionTypes.DELETE_PRIORITAS_FAIL,
    error
  };
};

export const deletePrioritas = (kodePrioritas, token) => {
  return async dispatch => {
    dispatch(deletePrioritasStart());
    const url = `/api/prioritas?prioritas=${kodePrioritas}`;
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
        dispatch(deletePrioritasSuccess(response.data.success));
      })
      .catch(error => {
        dispatch(deletePrioritasFail(error.response.data))
      });
  }
};

export const updatePrioritasStart = () => {
  return {
    type: actionTypes.UPDATE_PRIORITAS_START
  };
};

export const updatePrioritasSuccess = sukses => {
  return {
    type: actionTypes.UPDATE_PRIORITAS_SUCCESS,
    sukses,
  };
};

export const updatePrioritasFail = error => {
  return {
    type: actionTypes.UPDATE_PRIORITAS_FAIL,
    error
  };
};

export const updatePrioritas = (prioritas, token, dataPrioritas) => {
  return async dispatch => {
    dispatch(updatePrioritasStart());
    const url = `/api/prioritas/update?prioritas=${prioritas}`;
    const options = {
      method: 'POST',
      headers: { 
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': token
      },
      data: qs.stringify(dataPrioritas),
      url
    };
    await axios(options)
      .then(response => {
        dispatch(updatePrioritasSuccess(response.data.success));
      })
      .catch(error => {
        dispatch(updatePrioritasFail(error.response.data))
      });
  }
};
