import { handleActions } from 'redux-actions'
import {addDream} from '../actions/dreams'

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

const initialState = [];

export default handleActions({
  'ADD_DREAM': (state, action) => {
    return [
        ...state,
        {
          ID: Math.max(state.reduce((maxId, habit) => Math.max(habit.ID, maxId), -1) + 1, 1),
          name: action.payload.name,
          why: action.payload.why
        }
      ];
  }
}, initialState)
