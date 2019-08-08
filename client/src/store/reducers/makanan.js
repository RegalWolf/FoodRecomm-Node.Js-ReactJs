import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  makanan: [],
  error: null,
  loading: false,
  add: {
    error: null,
    sukses: null
  },
  delete: {
    error: null,
    sukses: null
  },
  update: {
    error: null,
    sukses: null
  }
};

const fetchMakananStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true
  });
};

const fetchMakananSuccess = (state, action) => {
  return updateObject(state, {
    makanan: action.makanan,
    error: null,
    loading: false
  });
};

const fetchMakananFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.error
  });
};

const postMakananStart = (state, action) => {
  return updateObject(state, {
    loading: true,
    add: {
      error: null,
      sukses: null
    }
  });
};

const postMakananSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    add: {
      sukses: action.sukses
    }
  });
};

const postMakananFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    add: {
      error: action.error
    }
  });
};

const deleteMakananStart = (state, action) => {
  return updateObject(state, {
    loading: true,
    delete: {
      error: null,
      sukses: null
    }
  });
};

const deleteMakananSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    delete: {
      sukses: action.sukses
    }
  });
};

const deleteMakananFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    delete: {
      error: action.error
    }
  });
};

const updateMakananStart = (state, action) => {
  return updateObject(state, {
    loading: true,
    update: {
      error: null,
      sukses: null
    }
  });
};

const updateMakananSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    update: {
      sukses: action.sukses
    }
  });
};

const updateMakananFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    update: {
      error: action.error
    }
  });
};

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case actionTypes.FETCH_MAKANAN_START:
      return fetchMakananStart(state, action);
    case actionTypes.FETCH_MAKANAN_SUCCESS:
      return fetchMakananSuccess(state, action);
    case actionTypes.FETCH_MAKANAN_FAIL:
      return fetchMakananFail(state, action);
    case actionTypes.POST_MAKANAN_START:
      return postMakananStart(state, action);
    case actionTypes.POST_MAKANAN_SUCCESS:
      return postMakananSuccess(state, action);
    case actionTypes.POST_MAKANAN_FAIL:
      return postMakananFail(state, action);
    case actionTypes.DELETE_MAKANAN_START:
      return deleteMakananStart(state, action);
    case actionTypes.DELETE_MAKANAN_SUCCESS:
      return deleteMakananSuccess(state, action);
    case actionTypes.DELETE_MAKANAN_FAIL:
      return deleteMakananFail(state, action);
    case actionTypes.UPDATE_MAKANAN_START:
      return updateMakananStart(state, action);
    case actionTypes.UPDATE_MAKANAN_SUCCESS:
      return updateMakananSuccess(state, action);
    case actionTypes.UPDATE_MAKANAN_FAIL:
      return updateMakananFail(state, action);
    default:
      return state;
  }
};

export default reducer;