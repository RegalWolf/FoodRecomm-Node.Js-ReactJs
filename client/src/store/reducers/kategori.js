import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  kategori: [],
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

const fetchKategoriStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true
  });
};

const fetchKategoriSuccess = (state, action) => {
  return updateObject(state, {
    kategori: action.kategori,
    error: null,
    loading: false
  });
};

const fetchKategoriFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.error
  });
};

const postKategoriStart = (state, action) => {
  return updateObject(state, {
    loading: true,
    add: {
      error: null,
      sukses: null
    }
  });
};

const postKategoriSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    add: {
      sukses: action.sukses
    }
  });
};

const postKategoriFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    add: {
      error: action.error
    }
  });
};

const deleteKategoriStart = (state, action) => {
  return updateObject(state, {
    loading: true,
    delete: {
      error: null,
      sukses: null
    }
  });
};

const deleteKategoriSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    delete: {
      sukses: action.sukses
    }
  });
};

const deleteKategoriFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    delete: {
      error: action.error
    }
  });
};

const updateKategoriStart = (state, action) => {
  return updateObject(state, {
    loading: true,
    update: {
      error: null,
      sukses: null
    }
  });
};

const updateKategoriSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    update: {
      sukses: action.sukses
    }
  });
};

const updateKategoriFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    update: {
      error: action.error
    }
  });
};

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case actionTypes.FETCH_KATEGORI_START:
      return fetchKategoriStart(state, action);
    case actionTypes.FETCH_KATEGORI_SUCCESS:
      return fetchKategoriSuccess(state, action);
    case actionTypes.FETCH_KATEGORI_FAIL:
      return fetchKategoriFail(state, action);
    case actionTypes.POST_KATEGORI_START:
      return postKategoriStart(state, action);
    case actionTypes.POST_KATEGORI_SUCCESS:
      return postKategoriSuccess(state, action);
    case actionTypes.POST_KATEGORI_FAIL:
      return postKategoriFail(state, action);
    case actionTypes.DELETE_KATEGORI_START:
      return deleteKategoriStart(state, action);
    case actionTypes.DELETE_KATEGORI_SUCCESS:
      return deleteKategoriSuccess(state, action);
    case actionTypes.DELETE_KATEGORI_FAIL:
      return deleteKategoriFail(state, action);
    case actionTypes.UPDATE_KATEGORI_START:
      return updateKategoriStart(state, action);
    case actionTypes.UPDATE_KATEGORI_SUCCESS:
      return updateKategoriSuccess(state, action);
    case actionTypes.UPDATE_KATEGORI_FAIL:
      return updateKategoriFail(state, action);
    default:
      return state;
  }
};

export default reducer;