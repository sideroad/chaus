import uris from '../../uris';
const LOAD = 'network/LOAD';
const LOAD_SUCCESS = 'network/LOAD_SUCCESS';
const LOAD_FAIL = 'network/LOAD_FAIL';

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
        data: action.result.network
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

export function load(app) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: client =>
      client
        .fetchJSON(uris.normalize(uris.admin.network, { app }), 'GET', {
          app,
          limit: 10000
        })
  };
}
