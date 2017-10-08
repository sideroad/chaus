
const LOAD_START = 'apps/LOAD_START';
const LOAD_SUCCESS = 'apps/LOAD_SUCCESS';
const LOAD_FAIL = 'apps/LOAD_FAIL';
const SAVE_START = 'apps/SAVE_START';
const SAVE_SUCCESS = 'apps/SAVE_SUCCESS';
const SAVE_FAIL = 'apps/SAVE_FAIL';
const DELETE_START = 'apps/DELETE_START';
const DELETE_SUCCESS = 'apps/DELETE_SUCCESS';
const DELETE_FAIL = 'apps/DELETE_FAIL';

const QUERY = 'apps/QUERY';
const EDITING = 'apps/EDITING';
const CANCEL = 'apps/CANCEL';
const PREV = 'apps/PREV';
const NEXT = 'apps/NEXT';

const initialState = {
  data: [],
  loaded: false,
  err: undefined,
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
        index: 0,
        err: undefined,
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        err: action.body,
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
    case SAVE_START:
      return state; // 'saving' flag handled by redux-form
    case SAVE_SUCCESS:
      return {
        ...state,
        editing: false,
        err: undefined,
        query: '',
      };
    case SAVE_FAIL:
      return {
        ...state,
        err: action.body,
      };
    case DELETE_START:
      return state; // 'saving' flag handled by redux-form
    case DELETE_SUCCESS:
      return {
        ...state,
        editing: false,
        err: undefined,
        query: '',
      };
    case DELETE_FAIL:
      return {
        ...state,
        err: action.body,
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
