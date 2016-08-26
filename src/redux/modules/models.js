import uris from '../../uris';

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
};
export default function reducer(state = initialState, action = {}) {
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
        data: action.result.items
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
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
        editing: false,
        data: action.result.items
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
        editing: false,
        data: action.result.items
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
  return globalState.models && globalState.models.data;
}

export function load(app) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => {
      return new Promise(resolve => {
        client
          .fetchJSON(uris.admin.models, 'GET', {
            app,
            limit: 10000
          })
          .then((models) => {
            resolve({
              app: app,
              items: models.items
            });
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

export function saveAdd(app, name) {
  return {
    types: [ADD, ADD_SUCCESS, ADD_FAIL],
    promise: (client) =>
      client
        .fetchJSON(uris.admin.models, 'POST', {app, name})
        .then(()=>
          load(app).promise(client)
        )
  };
}

export function remove(app, name) {
  return {
    types: [REMOVE, REMOVE_SUCCESS, REMOVE_FAIL],
    promise: (client) =>
      client
        .fetchJSON(uris.admin.models, 'DELETE', {app, name})
        .then(()=>
          client
            .fetchJSON(uris.admin.attributes, 'DELETE', {app, model: name})
        )
        .then(()=>
          load(app).promise(client)
        )
  };
}
