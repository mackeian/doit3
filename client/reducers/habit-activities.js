import { handleActions } from 'redux-actions'
import {addHabitActivity} from '../actions/habit-activities'

const initialState = [];

export default handleActions({
  'ADD_HABIT_ACTIVITY': (state, action) => {
    return [
      ...state, {
        id: state.reduce((maxId, activity) => Math.max(activity.id, maxId), -1) + 1,
        habitId: action.payload.habitId,
        datetime: new Date()
      }
    ]
  }
}, initialState)
