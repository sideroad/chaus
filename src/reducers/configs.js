
const LOAD_START = 'configs/LOAD';
const LOAD_SUCCESS = 'configs/LOAD_SUCCESS';
const LOAD_FAIL = 'configs/LOAD_FAIL';
const SAVE_START = 'configs/SAVE';
const SAVE_SUCCESS = 'configs/SAVE_SUCCESS';
const SAVE_FAIL = 'configs/SAVE_FAIL';

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
        data: action.res.body
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.err
      };
    case SAVE_START:
      return state; // 'saving' flag handled by redux-form
    case SAVE_SUCCESS:
      return {
        ...state,
        editing: false,
        data: action.res
      };
    case SAVE_FAIL:
      return {
        ...state,
        name: action.err
      };
    default:
      return state;
  }
}
