const LOAD_START = 'models/LOAD';
const LOAD_SUCCESS = 'models/LOAD_SUCCESS';
const LOAD_FAIL = 'models/LOAD_FAIL';
const SAVE_START = 'models/SAVE';
const SAVE_SUCCESS = 'models/SAVE_SUCCESS';
const SAVE_FAIL = 'models/SAVE_FAIL';
const REMOVE_START = 'models/REMOVE';
const REMOVE_SUCCESS = 'models/REMOVE_SUCCESS';
const REMOVE_FAIL = 'models/REMOVE_FAIL';

const EDITING = 'models/EDITING';
const CANCEL = 'models/CANCEL';

const initialState = {
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
        data: action.res.body.items
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
        editing: false
      };
    case SAVE_FAIL:
      return {
        ...state,
        name: action.res.body.name
      };
    case REMOVE_START:
      return state; // 'saving' flag handled by redux-form
    case REMOVE_SUCCESS:
      return {
        ...state,
        editing: false
      };
    case REMOVE_FAIL:
      return {
        ...state,
        name: action.res.body.name
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
