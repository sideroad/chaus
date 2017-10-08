const ATTRIBUTE_SAVE_SUCCESS = 'attributes/SAVE_SUCCESS';
const ATTRIBUTE_SAVE_FAIL = 'attributes/SAVE_FAIL';
const RECORD_UPDATE_SUCCESS = 'records/UPDATE_SUCCESS';
const RECORD_CREATE_SUCCESS = 'records/CREATE_SUCCESS';
const RECORD_UPDATE_FAIL = 'records/UPDATE_FAIL';
const RECORD_CREATE_FAIL = 'records/CREATE_FAIL';
const RESET = 'popup/RESET';
const MODEL_SAVE_SUCCESS = 'models/SAVE_SUCCESS';
const MODEL_SAVE_FAIL = 'models/SAVE_FAIL';
const MODEL_DELETE_SUCCESS = 'models/DELETE_SUCCESS';
const APP_SAVE_SUCCESS = 'apps/SAVE_SUCCESS';
const APP_SAVE_FAIL = 'apps/SAVE_FAIL';
const APP_DELETE_SUCCESS = 'apps/DELETE_SUCCESS';
const APP_DELETE_FAIL = 'apps/DELETE_FAIL';

const initialState = {
  messages: [],
  status: 'none',
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ATTRIBUTE_SAVE_SUCCESS:
      return {
        ...state,
        messages: ['Resource has been updated successfully'],
        status: 'success',
      };
    case RECORD_CREATE_SUCCESS:
      return {
        ...state,
        messages: ['Record has been created successfully.'],
        status: 'success',
      };
    case RECORD_UPDATE_SUCCESS:
      return {
        ...state,
        messages: ['Record has been updated successfully.'],
        status: 'success',
      };
    case MODEL_DELETE_SUCCESS:
      return {
        ...state,
        messages: ['Resource has been deleted successfully.'],
        status: 'success',
      };
    case MODEL_SAVE_SUCCESS:
      return {
        ...state,
        messages: ['Resource has been created successfully.'],
        status: 'success',
      };
    case APP_SAVE_SUCCESS:
      return {
        ...state,
        messages: ['App has been created successfully.'],
        status: 'success',
      };
    case APP_DELETE_SUCCESS:
      return {
        ...state,
        messages: ['App has been deleted successfully.'],
        status: 'success',
      };
    case APP_SAVE_FAIL:
    case MODEL_SAVE_FAIL:
      {
        const err = action.body;
        return {
          ...state,
          messages: Object.keys(err).map(key =>
            err[key]
          ),
          status: 'error',
        };
      }
    case ATTRIBUTE_SAVE_FAIL:
    case RECORD_CREATE_FAIL:
    case RECORD_UPDATE_FAIL:
    case APP_DELETE_FAIL:
      {
        const err = action.body;
        return {
          ...state,
          messages: Object.keys(err).map(key =>
            `${key}: ${err[key]}`
          ),
          status: 'error',
        };
      }
    case RESET:
      return {
        ...state,
        messages: [],
        status: 'none',
      };
    default:
      return state;
  }
}

export function reset() {
  return {
    type: RESET,
  };
}
