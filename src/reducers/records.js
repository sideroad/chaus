
const LOAD_START = 'records/LOAD_START';
const LOAD_SUCCESS = 'records/LOAD_SUCCESS';
const LOAD_FAIL = 'records/LOAD_FAIL';
const CREATE_START = 'records/CREATE_START';
const CREATE_SUCCESS = 'records/CREATE_SUCCESS';
const CREATE_FAIL = 'records/CREATE_FAIL';
const UPDATE_START = 'records/UPDATE_START';
const UPDATE_SUCCESS = 'records/UPDATE_SUCCESS';
const UPDATE_FAIL = 'records/UPDATE_FAIL';
const DELETE_START = 'records/DELETE_START';
const DELETE_SUCCESS = 'records/DELETE_SUCCESS';
const DELETE_FAIL = 'records/DELETE_FAIL';
const FAIL_INDEX = 'records/FAIL_INDEX';

const ADD = 'records/ADD';
const POP = 'records/POP';

const initialState = {
  data: [],
  loaded: false,
  loading: false
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_START:
      return {
        ...state,
        loading: true,
        loaded: false,
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.res.body.items,
        err: undefined,
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: [],
        err: action.err,
        success: false
      };
    case ADD:
      return {
        ...state,
        data: state.data.concat([{}])
      };
    case POP:
      return {
        ...state,
        data: state.data.slice(0, state.data.length - 1)
      };
    case CREATE_START:
      return state; // 'saving' flag handled by redux-form
    case CREATE_SUCCESS:
      return {
        ...state,
        editing: false,
        success: true,
        err: undefined
      };
    case CREATE_FAIL:
      return {
        ...state,
        success: false,
        err: action.body,
      };
    case UPDATE_START:
      return state; // 'saving' flag handled by redux-form
    case UPDATE_SUCCESS:
      return {
        ...state,
        editing: false,
        success: true,
        err: undefined
      };
    case UPDATE_FAIL:
      return {
        ...state,
        success: false,
        err: action.body,
      };
    case DELETE_START:
      return state; // 'saving' flag handled by redux-form
    case DELETE_SUCCESS:
      return {
        ...state,
        editing: false,
        success: true,
        err: undefined
      };
    case DELETE_FAIL:
      return {
        ...state,
        success: false,
        err: action.body,
      };
    case FAIL_INDEX:
      return {
        ...state,
        index: action.index
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.records && globalState.records.loaded;
}

export function add() {
  return {
    type: ADD
  };
}

export function pop() {
  return {
    type: POP
  };
}

export function failIndex(index) {
  return {
    type: FAIL_INDEX,
    index
  };
}
