
const LOAD = 'model/LOAD';
const LOAD_SUCCESS = 'model/LOAD_SUCCESS';
const LOAD_FAIL = 'model/LOAD_FAIL';
const ADD = 'model/ADD';
const ADD_SUCCESS = 'model/ADD_SUCCESS';
const ADD_FAIL = 'model/ADD_FAIL';
const REMOVE = 'model/REMOVE';
const REMOVE_SUCCESS = 'model/REMOVE_SUCCESS';
const REMOVE_FAIL = 'model/REMOVE_FAIL';

const EDITING = 'model/EDITING';
const CANCEL = 'model/CANCEL';

const initialState = {
  data: [],
  loaded: false
};
export default function model(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case EDITING:
      return {
        ...state,
        editing: true
      };
    case CANCEL:
      return {
        ...state,
        editing: false
      };
    case ADD:
      return state; // 'saving' flag handled by redux-form
    case ADD_SUCCESS:
      return {
        ...state,
        data: action.result,
        editing: false
      };
    case ADD_FAIL:
      return {
        ...state,
        name: action.result.name
      };
    case REMOVE:
      return state; // 'saving' flag handled by redux-form
    case REMOVE_SUCCESS:
      return {
        ...state,
        data: action.result,
        editing: false
      };
    case REMOVE_FAIL:
      return {
        ...state,
        name: action.result.name
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.models && globalState.models.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => {
      return new Promise((modelsResolve) => {
        client
          .fetchJSON('/admin/api/models', 'GET')
          .then((models) => {
            modelsResolve(models.items);
          });
      });
    }
  };
}

export function add() {
  return {
    type: EDITING
  };
}

export function cancel() {
  return {
    type: CANCEL
  };
}

export function saveAdd(name) {
  return {
    types: [ADD, ADD_SUCCESS, ADD_FAIL],
    promise: (client) => client.fetchJSON('/admin/api/models', 'POST', {name})
                               .then(()=>{
                                 return load().promise(client);
                               })
  };
}

export function remove(name) {
  return {
    types: [REMOVE, REMOVE_SUCCESS, REMOVE_FAIL],
    promise: (client) => client.fetchJSON('/admin/api/models', 'DELETE', {name})
                               .then(()=>{
                                 return client.fetchJSON('/admin/api/attributes', 'DELETE', {model: name});
                               })
                               .then(()=>{
                                 return load().promise(client);
                               })
  };
}
