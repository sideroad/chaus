const LOAD = 'attribute/LOAD';
const LOAD_SUCCESS = 'attribute/LOAD_SUCCESS';
const LOAD_FAIL = 'attribute/LOAD_FAIL';
const SAVE = 'attribute/SAVE';
const SAVE_SUCCESS = 'attribute/SAVE_SUCCESS';
const SAVE_FAIL = 'attribute/SAVE_FAIL';
const DRAG = 'attributes/DRAG';
const DROP = 'attributes/DROP';
const REPLACE = 'redux-form/SWAP_ARRAY_VALUES';

const initialState = {
  data: {},
  loaded: false,
  loading: false
};
export default function attribute(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true,
        loaded: false
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        saveSuccess: false,
        data: action.result.items
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        saveSuccess: false,
        error: action.error
      };
    case SAVE:
      return state; // 'saving' flag handled by redux-form
    case SAVE_SUCCESS:
      return {
        ...state,
        editing: false,
        error: undefined,
        saveSuccess: true,
        data: action.result.items
      };
    case SAVE_FAIL:
      return {
        ...state,
        saveSuccess: false,
        error: action.error
      };
    case REPLACE:
      return {
        ...state,
        from: action.indexA,
        to: action.indexB
      };
    case DRAG:
      return {
        ...state,
        from: action.from,
        to: null
      };
    case DROP:
      return {
        ...state,
        from: null,
        to: action.to
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.attributes && globalState.attributes.loaded;
}

export function load(app) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => {
      return new Promise((resolve, reject) => {
        client
          .fetchJSON('/admin/api/attributes', 'GET', {
            app
          })
          .then((attributes) => {
            const items = {};
            attributes.items.map((_attribute)=>{
              _attribute.uniq = _attribute.uniq === 'true' ? true : false;
              _attribute.required = _attribute.required === 'true' ? true : false;
              _attribute.relation = _attribute.relation;
              if ( !items[_attribute.model] ) {
                items[_attribute.model] = [];
              }
              items[_attribute.model].push(_attribute);
            });
            resolve({
              items: items
            });
          }, ()=> {
            reject();
          });
      });
    }
  };
}

export function drag(from) {
  return {
    from,
    type: DRAG
  };
}

export function drop(to) {
  return {
    to,
    type: DROP
  };
}


export function save(app, model, values) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    promise: (client) =>
      new Promise((resolve, reject) =>
        client.fetchJSON('/admin/api/attributes', 'DELETE', {app, model})
          .then(()=>{
            return new Promise((_resolve, _reject) => {
              const attributes = values.attributes;

              function post(index) {
                if (attributes.length) {
                  const _attribute = attributes.shift();
                  client.fetchJSON('/admin/api/attributes', 'POST', {
                    ..._attribute,
                    type: _attribute.type ? _attribute.type : 'string',
                    uniq: _attribute.uniq === true ? 'true' : 'false',
                    required: _attribute.required === true ? 'true' : 'false',
                    model,
                    app
                  })
                  .then(
                    ()=>post(index + 1),
                    (err)=> _reject({
                      err,
                      index
                    })
                  );
                } else {
                  _resolve();
                }
              }
              post(0);
            });
          })
          .then(
            ()=>load(app).promise(client).then((res)=>resolve(res)),
            (err) => reject(err)
          )
      )
  };
}
