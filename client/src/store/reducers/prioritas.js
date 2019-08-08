import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  prioritas: [],
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

const fetchPrioritasStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true
  });
};

const fetchPrioritasSuccess = (state, action) => {
  return updateObject(state, {
    prioritas: action.prioritas,
    error: null,
    loading: false
  });
};

const fetchPrioritasFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.error
  });
};

const postPrioritasStart = (state, action) => {
  return updateObject(state, {
    loading: true,
    add: {
      error: null,
      sukses: null
    }
  });
};

const postPrioritasSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    add: {
      sukses: action.sukses
    }
  });
};

const postPrioritasFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    add: {
      error: action.error
    }
  });
};

const deletePrioritasStart = (state, action) => {
  return updateObject(state, {
    loading: true,
    delete: {
      error: null,
      sukses: null
    }
  });
};

const deletePrioritasSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    delete: {
      sukses: action.sukses
    }
  });
};

const deletePrioritasFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    delete: {
      error: action.error
    }
  });
};

const updatePrioritasStart = (state, action) => {
  return updateObject(state, {
    loading: true,
    update: {
      error: null,
      sukses: null
    }
  });
};

const updatePrioritasSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    update: {
      sukses: action.sukses
    }
  });
};

const updatePrioritasFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    update: {
      error: action.error
    }
  });
};

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case actionTypes.FETCH_PRIORITAS_START:
      return fetchPrioritasStart(state, action);
    case actionTypes.FETCH_PRIORITAS_SUCCESS:
      return fetchPrioritasSuccess(state, action);
    case actionTypes.FETCH_PRIORITAS_FAIL:
      return fetchPrioritasFail(state, action);
    case actionTypes.POST_PRIORITAS_START:
      return postPrioritasStart(state, action);
    case actionTypes.POST_PRIORITAS_SUCCESS:
      return postPrioritasSuccess(state, action);
    case actionTypes.POST_PRIORITAS_FAIL:
      return postPrioritasFail(state, action);
    case actionTypes.DELETE_PRIORITAS_START:
      return deletePrioritasStart(state, action);
    case actionTypes.DELETE_PRIORITAS_SUCCESS:
      return deletePrioritasSuccess(state, action);
    case actionTypes.DELETE_PRIORITAS_FAIL:
      return deletePrioritasFail(state, action);
    case actionTypes.UPDATE_PRIORITAS_START:
      return updatePrioritasStart(state, action);
    case actionTypes.UPDATE_PRIORITAS_SUCCESS:
      return updatePrioritasSuccess(state, action);
    case actionTypes.UPDATE_PRIORITAS_FAIL:
      return updatePrioritasFail(state, action);
    default:
      return state;
  }
};

export default reducer;