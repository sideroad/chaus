const LOAD_START = 'models/LOAD';
const LOAD_SUCCESS = 'models/LOAD_SUCCESS';
const LOAD_FAIL = 'models/LOAD_FAIL';
const SAVE_START = 'models/SAVE';
const SAVE_SUCCESS = 'models/SAVE_SUCCESS';
const SAVE_FAIL = 'models/SAVE_FAIL';
const DELETE_START = 'models/DELETE';
const DELETE_SUCCESS = 'models/DELETE_SUCCESS';
const DELETE_FAIL = 'models/DELETE_FAIL';

const EDITING = 'models/EDITING';
const CANCEL = 'models/CANCEL';

const initialState = {
  err: undefined
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_START:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.res.body.items,
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
    case SAVE_START:
      return state; // 'saving' flag handled by redux-form
    case SAVE_SUCCESS:
      return {
        ...state,
        editing: false,
        err: undefined,
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
      };
    case DELETE_FAIL:
      return {
        ...state,
        err: action.body
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.models && globalState.models.data;
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
