import uris from '../../uris';

const RESTART = 'page/RESTART';
const RESTART_SUCCESS = 'page/RESTART_SUCCESS';
const RESTART_FAIL = 'page/RESTART_FAIL';

const LOADING = 'page/LOADING';
const LOADED = 'page/LOADED';

const TOGGLE_SIDEBAR = 'page/TOGGLE_SIDEBAR';
const CLOSE_SIDEBAR = 'page/CLOSE_SIDEBAR';

const initialState = {
  restarting: false,
  restarted: false,
  loading: false,
  open: false
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {

    case RESTART:
      return {
        ...state,
        restarting: true,
        restarted: false,
        loading: true
      };
    case RESTART_SUCCESS:
      return {
        ...state,
        restarting: true,
        restarted: false,
        loading: false
      };
    case RESTART_FAIL:
      return {
        ...state,
        restarting: true,
        restarted: false,
        loading: false
      };
    case LOADING:
      return {
        ...state,
        loading: true
      };
    case LOADED:
      return {
        ...state,
        loading: false
      };
    case TOGGLE_SIDEBAR:
      return {
        ...state,
        open: !state.open
      };
    case CLOSE_SIDEBAR:
      return {
        ...state,
        open: false
      };
    default:
      return state;
  }
}

export function restart() {
  return {
    types: [RESTART, RESTART_SUCCESS, RESTART_FAIL],
    promise: client =>
      client
        .fetchJSON(uris.admin.restart, 'GET')
  };
}

export function load() {
  return {
    type: LOADING
  };
}
export function finishLoad() {
  return {
    type: LOADED
  };
}
export function toggleSidebar() {
  return {
    type: TOGGLE_SIDEBAR
  };
}
export function closeSidebar() {
  return {
    type: CLOSE_SIDEBAR
  };
}
