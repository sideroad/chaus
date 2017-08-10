import config from '../config';

const SET = 'user/SET';

const initialState = {
  item: {
    id: config.github.enabled ? '' : 'anonymous'
  }
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET:
      return {
        ...state,
        item: action.item
      };
    default:
      return state;
  }
}

export function set(item) {
  return {
    type: SET,
    item
  };
}
