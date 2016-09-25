const LOAD = 'relation/LOAD';
const LOAD_SUCCESS = 'relation/LOAD_SUCCESS';
const LOAD_FAIL = 'relation/LOAD_FAIL';

const initialState = {
  data: {},
  loading: false
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: {
          ...state.data,
          [action.result.model]: action.result.items
        }
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

export function isLoaded(globalState) {
  return globalState.relations && globalState.relations.data[globalState.model];
}
