import { handleActions } from 'redux-actions'
import { addGoal } from '../actions/goals'

const initialState = [];

export default handleActions({
  'ADD_GOAL': (state, action) => {
    return [
      ...state, {
        id: Math.max(state.reduce((maxId, goal) => Math.max(goal.id, maxId), -1) + 1, 1),
        name: action.payload.name,
        starts: action.payload.starts,
        ends: action.payload.ends,
        dreamId: parseInt(action.payload.dreamId, 10),
        active: true
      }
    ]
  }
}, initialState)
