import { handleActions } from 'redux-actions'
import {addGoalHabit} from '../actions/goal-habits'
import { HABIT_ITERATION_TYPES } from '../constants/constants'

const initialState = [];

export default handleActions({
  'ADD_GOAL_HABIT': (state, action) => {
    return [
      ...state, {
        ID: Math.max(state.reduce((maxId, habit) => Math.max(habit.ID, maxId), -1) + 1, 1),
        name: action.payload.name,
        starts: action.payload.start,
        ends: action.payload.start,
        timesPerIteration: action.payload.timesPerIteration,
        iterationType: HABIT_ITERATION_TYPES.indexOf(action.payload.iterationType) >= 0 ? action.payload.iterationType : HABIT_ITERATION_TYPES[0],
        goalID: action.payload.goalID,
        active: true
      }
    ]
  }
}, initialState)
