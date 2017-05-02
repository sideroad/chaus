
const LOAD_START = 'apps/LOAD_START';
const LOAD_SUCCESS = 'apps/LOAD_SUCCESS';
const LOAD_FAIL = 'apps/LOAD_FAIL';
const ADD_START = 'apps/ADD_START';
const ADD_SUCCESS = 'apps/ADD_SUCCESS';
const ADD_FAIL = 'apps/ADD_FAIL';
const REMOVE_START = 'apps/REMOVE_START';
const REMOVE_SUCCESS = 'apps/REMOVE_SUCCESS';
const REMOVE_FAIL = 'apps/REMOVE_FAIL';

const QUERY = 'apps/QUERY';
const EDITING = 'apps/EDITING';
const CANCEL = 'apps/CANCEL';
const PREV = 'apps/PREV';
const NEXT = 'apps/NEXT';

const initialState = {
  data: [],
  loaded: false
};
export default function reducer(state = initialState, action = {}) {
  let index;
  switch (action.type) {
    case LOAD_START:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      const items = action.res.body.items;
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
    case QUERY:
      return {
        ...state,
        query: action.query
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
    case ADD_START:
      return state; // 'saving' flag handled by redux-form
    case ADD_SUCCESS:
      return {
        ...state,
        data: action.res.body,
        editing: false
      };
    case ADD_FAIL:
      return {
        ...state,
        name: action.error.name
      };
    case REMOVE_START:
      return state; // 'saving' flag handled by redux-form
    case REMOVE_SUCCESS:
      return {
        ...state,
        data: action.res.body,
        editing: false
      };
    case REMOVE_FAIL:
      return {
        ...state,
        name: action.error.name
      };
    default:
      return state;
  }
}

export function query(value) {
  return {
    query: value,
    type: QUERY
  };
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
