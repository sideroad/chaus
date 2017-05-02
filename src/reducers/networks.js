const LOAD_START = 'networks/LOAD';
const LOAD_SUCCESS = 'networks/LOAD_SUCCESS';
const LOAD_FAIL = 'networks/LOAD_FAIL';

const initialState = {
  data: '',
  loading: false
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
        loaded: true,
        data: action.res.body.network
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    default:
      return state;
  }
}
