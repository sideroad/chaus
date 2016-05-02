
const LOAD = 'config/LOAD';
const LOAD_SUCCESS = 'config/LOAD_SUCCESS';
const LOAD_FAIL = 'config/LOAD_FAIL';
const SAVE = 'config/SAVE';
const SAVE_SUCCESS = 'config/SAVE_SUCCESS';
const SAVE_FAIL = 'config/SAVE_FAIL';

const initialState = {
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
        data: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case SAVE:
      return state; // 'saving' flag handled by redux-form
    case SAVE_SUCCESS:
      return {
        ...state,
        editing: false,
        data: action.result
      };
    case SAVE_FAIL:
      return {
        ...state,
        name: action.result.name
      };
    default:
      return state;
  }
}

export function load(app) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) =>
      client
        .fetchJSON('/admin/api/apps/' + encodeURIComponent( app ), 'GET')
        .then((config) => {
          return client
                   .fetchJSON('/admin/api/origins', 'GET', {
                     app
                   })
                   .then((origins) => {
                     config.urls = origins.items.map((origin) => origin.url);
                     return config;
                   });
        })
  };
}

export function save(app, values) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    promise: (client) =>
      client
       .fetchJSON('/admin/api/apps/' + encodeURIComponent( app ), 'POST', {
         description: values.description
       })
       .then(()=>{
         return client.fetchJSON('/admin/api/origins', 'DELETE', {
           app
         });
       })
       .then(()=>{
         return new Promise((resolve, reject) => {
           const urls = values.urls;

           function post() {
             if (urls.length) {
               const url = urls.shift();
               client.fetchJSON('/admin/api/origins', 'POST', {
                 url,
                 app
               })
               .then(
                 ()=>post(),
                 (err)=> reject({
                   err
                 })
               );
             } else {
               resolve();
             }
           }
           post();
         });
       })
       .then(()=> {
         return load(app).promise(client);
       })
  };
}
