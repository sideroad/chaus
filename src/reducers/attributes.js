
const LOAD_START = 'attributes/LOAD_START';
const LOAD_SUCCESS = 'attributes/LOAD_SUCCESS';
const LOAD_FAIL = 'attributes/LOAD_FAIL';
const SAVE_START = 'attributes/SAVE_START';
const SAVE_SUCCESS = 'attributes/SAVE_SUCCESS';
const SAVE_FAIL = 'attributes/SAVE_FAIL';
const FAIL_INDEX = 'attributes/FAIL_INDEX';

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
        success: false,
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.res.body.items,
        err: undefined
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        err: action.body
      };
    case SAVE_START:
      return {
        ...state,
        success: false,
        err: undefined,
      };
    case SAVE_SUCCESS:
      return {
        ...state,
        editing: false,
        success: true,
        err: undefined,
      };
    case SAVE_FAIL:
      return {
        ...state,
        success: false,
        err: action.body
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
