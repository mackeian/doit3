import { handleActions } from 'redux-actions'
import { addGoal } from '../actions/goals'

const initialState = [];

export default handleActions({
  'ADD_GOAL': (state, action) => {
    return [
      ...state, {
        ID: Math.max(state.reduce((maxId, goal) => Math.max(goal.ID, maxId), -1) + 1, 1),
        name: action.payload.name,
        starts: action.payload.starts,
        ends: action.payload.ends,
        dreamID: parseInt(action.payload.dreamID, 10),
        active: true
      }
    ]
  }
}, initialState)
