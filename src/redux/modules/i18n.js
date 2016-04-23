

const initialState = {
  msg: {},
  loaded: false
};
export default function i18n(state = initialState, action = {}) {
  console.log(state);
  switch (action.type) {
    default:
      return state;
  }
}

export function load( _i18n ) {
  initialState.msg = _i18n.msg;
}
