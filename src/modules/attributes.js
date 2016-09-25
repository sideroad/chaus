
const LOAD_START = 'attributes/LOAD';
const LOAD_SUCCESS = 'attributes/LOAD_SUCCESS';
const LOAD_FAIL = 'attributes/LOAD_FAIL';
const SAVE_START = 'attributes/SAVE';
const SAVE_SUCCESS = 'attributes/SAVE_SUCCESS';
const SAVE_FAIL = 'attributes/SAVE_FAIL';
const FAIL_INDEX = 'attributes/FAIL_INDEX';

const initialState = {
  data: {},
  loaded: false,
  loading: false
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_START:
      return {
        ...state,
        loading: true,
        loaded: false
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.res.items,
        err: undefined
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        err: action.err
      };
    case SAVE_START:
      return state; // 'saving' flag handled by redux-form
    case SAVE_SUCCESS:
      return {
        ...state,
        editing: false,
        err: undefined,
        success: true
      };
    case SAVE_FAIL:
      return {
        ...state,
        success: false,
        err: action.err
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

export function failIndex(index) {
  return {
    type: FAIL_INDEX,
    index
  };
}

export function isLoaded(globalState) {
  return globalState.attributes && globalState.attributes.loaded;
}
