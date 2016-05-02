
const LOAD = 'app/LOAD';
const LOAD_SUCCESS = 'app/LOAD_SUCCESS';
const LOAD_FAIL = 'app/LOAD_FAIL';
const ADD = 'app/ADD';
const ADD_SUCCESS = 'app/ADD_SUCCESS';
const ADD_FAIL = 'app/ADD_FAIL';
const REMOVE = 'app/REMOVE';
const REMOVE_SUCCESS = 'app/REMOVE_SUCCESS';
const REMOVE_FAIL = 'app/REMOVE_FAIL';

const EDITING = 'app/EDITING';
const CANCEL = 'app/CANCEL';
const PREV = 'app/PREV';
const NEXT = 'app/NEXT';

const initialState = {
  data: [],
  loaded: false
};
export default function reducer(state = initialState, action = {}) {
  let index;
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        query: action.query,
        loading: true
      };
    case LOAD_SUCCESS:
      const items = action.result;
      return {
        ...state,
        loading: false,
        loaded: true,
        data: items,
        candidate: items.length ? items[0].id : '',
        index: 0
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error,
        selected: undefined
      };
    case PREV:
      index = state.index > 0 ? state.index - 1 : 0;
      return {
        ...state,
        index,
        candidate: state.data.length ? state.data[index].id : ''
      };
    case NEXT:
      index = state.index < state.data.length - 1 ? state.index + 1 : state.index;
      return {
        ...state,
        index,
        candidate: state.data.length ? state.data[index].id : ''
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

export function next() {
  return {
    type: NEXT
  };
}
export function prev() {
  return {
    type: PREV
  };
}

export function isLoaded(globalState) {
  return globalState.apps && globalState.apps.loaded;
}

export function load(name) {
  return {
    query: name,
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => {
      return new Promise((appsResolve) => {
        client
          .fetchJSON('/admin/api/apps', 'GET', name ? {
            name: name + '*'
          } : {})
          .then((apps) => {
            appsResolve(apps.items);
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

export function save(name) {
  return {
    types: [ADD, ADD_SUCCESS, ADD_FAIL],
    promise: (client) =>
      client
        .fetchJSON('/admin/api/apps', 'POST', {name})
        .then(()=>{
          return load().promise(client);
        })
  };
}

export function remove(name) {
  return {
    types: [REMOVE, REMOVE_SUCCESS, REMOVE_FAIL],
    promise: (client) =>
      client
        .fetchJSON('/admin/api/apps/' + name, 'DELETE')
        .then(()=>{
          return client.fetchJSON('/admin/api/attributes', 'DELETE', {app: name});
        })
        .then(()=>{
          return load().promise(client);
        })
  };
}
