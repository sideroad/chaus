import pluralize from 'pluralize';

const LOAD = 'record/LOAD';
const LOAD_SUCCESS = 'record/LOAD_SUCCESS';
const LOAD_FAIL = 'record/LOAD_FAIL';
const ADD = 'record/ADD';
const SAVE = 'record/SAVE';
const SAVE_SUCCESS = 'record/SAVE_SUCCESS';
const SAVE_FAIL = 'record/SAVE_FAIL';
const REMOVE = 'record/REMOVE';
const REMOVE_SUCCESS = 'record/REMOVE_SUCCESS';
const REMOVE_FAIL = 'record/REMOVE_FAIL';

const initialState = {
  data: [],
  loaded: false,
  loading: false
};
export default function record(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true,
        loaded: false,
        saveSuccess: false
      };
    case LOAD_SUCCESS:
      console.log(action.result);
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result.items,
        error: undefined,
        saveSuccess: false
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error,
        saveSuccess: false
      };
    case ADD:
      return {
        ...state,
        data: state.data.concat([{}])
      };
    case SAVE:
      return state; // 'saving' flag handled by redux-form
    case SAVE_SUCCESS:
      return {
        ...state,
        editing: false,
        data: action.result.items,
        saveSuccess: true,
        error: undefined
      };
    case SAVE_FAIL:
      return {
        ...state,
        saveSuccess: false,
        error: action.error,
      };
    case REMOVE:
      return state; // 'saving' flag handled by redux-form
    case REMOVE_SUCCESS:
      return {
        ...state,
        editing: false,
        data: action.result.items,
        saveSuccess: true,
        error: undefined
      };
    case REMOVE_FAIL:
      return {
        ...state,
        saveSuccess: false,
        error: action.error,
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.records && globalState.records.loaded;
}

export function load(model) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.fetchJSON('/' + pluralize(model), 'GET')
  };
}

export function add() {
  return {
    type: ADD
  };
}

export function save(model, id, values) {
  console.log(values);
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    promise: (client) =>
      new Promise((resolve, reject) =>
        client.fetchJSON('/' + pluralize(model) + ( id ? '/' + id : '' ), 'POST', {
          ...values
        })
        .then(
          () => {},
          (err) => reject({
            err: err,
            id: id
          })
        )
        .then(()=>load(model).promise(client).then((res)=>resolve(res)))
      )
  };
}

export function remove(model, id) {
  return {
    types: [REMOVE, REMOVE_SUCCESS, REMOVE_FAIL],
    promise: (client) =>
      new Promise((resolve) => {
        if ( id ) {
          client.fetchJSON('/' + pluralize(model) + '/' + id, 'DELETE')
          .then(
            ()=>load(model)
                .promise(client)
                .then((res)=>resolve(res))
          );
        } else {
          load(model)
          .promise(client)
          .then((res)=>resolve(res));
        }
      }
      )
  };
}
