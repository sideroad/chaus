
const LOAD = 'i18n/LOAD';
const SET = 'i18n/SET';

const initialState = {
  msg: {},
  loaded: false
};
export default function app(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        msg: require('../../../i18n/' + action.lang).msg,
        loaded: true
      };
    case SET:
      return {
        ...state,
        msg: action.msg,
        loaded: true
      };
    default:
      return state;
  }
}

export function load(lang) {
  return {
    type: LOAD,
    lang
  };
}
