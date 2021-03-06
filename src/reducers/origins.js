
const LOAD_START = 'origins/LOAD';
const LOAD_SUCCESS = 'origins/LOAD_SUCCESS';
const LOAD_FAIL = 'origins/LOAD_FAIL';
const SAVE_START = 'origins/SAVE';
const SAVE_SUCCESS = 'origins/SAVE_SUCCESS';
const SAVE_FAIL = 'origins/SAVE_FAIL';
const VALIDATES_FAIL = 'origins/VALIDATES_FAIL';

const initialState = {
  err: undefined,
  index: 0,
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
        err: action.err
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
    case VALIDATES_FAIL:
      return {
        ...state,
        err: action.body,
        index: action.body.index,
      };
    default:
      return state;
  }
}
