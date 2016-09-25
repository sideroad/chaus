

const initialState = {
  msg: {},
  loaded: false
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    default:
      return state;
  }
}

export function load( _i18n ) {
  initialState.msg = _i18n.msg;
}
