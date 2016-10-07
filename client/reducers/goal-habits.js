import { handleActions } from 'redux-actions'
import {addGoalHabit} from '../actions/goal-habits'
import { HABIT_ITERATION_TYPES } from '../constants/constants'

const initialState = [];

export default handleActions({
  'ADD_GOAL_HABIT': (state, action) => {
    return [
      ...state, {
        id: Math.max(state.reduce((maxId, dream) => Math.max(dream.id, maxId), -1) + 1, 1),
        name: action.payload.name,
        starts: action.payload.start,
        ends: action.payload.start,
        timesPerIteration: action.payload.timesPerIteration,
        iterationType: HABIT_ITERATION_TYPES.indexOf(action.payload.iterationType) >= 0 ? action.payload.iterationType : HABIT_ITERATION_TYPES[0],
        goalId: action.payload.goalId,
        active: true
      }
    ]
  }
}, initialState)
