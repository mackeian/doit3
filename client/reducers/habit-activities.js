import { handleActions } from 'redux-actions'
import { addHabitActivity } from '../actions/habit-activities'

const initialState = [];

const areDatesOnlyEqual = (date1, date2) => {
  if (typeof date1 === "string") {
    date1 = new Date(date1)
  }
  if (typeof date2 === "string") {
    date2 = new Date(date2)
  }
  const d1_y = date1.getFullYear()
  const d1_m = date1.getMonth()
  const d1_d = date1.getDate()

  const d2_y = date2.getFullYear()
  const d2_m = date2.getMonth()
  const d2_d = date2.getDate()

  return (d1_y === d2_y && d1_m === d2_m && d1_d === d2_d)
}

export default handleActions({
  'ADD_HABIT_ACTIVITY': (state, action) => {
    let shouldAdd = true
    const habitID = action.payload.habitID
    let now = new Date()
    now.setHours(0, 0, 0, 0)
    const datetime = action.payload.datetime || now.toISOString()

    state.map((activity) => {
      if (activity.habitID === habitID && areDatesOnlyEqual(activity.datetime, datetime)) {
        shouldAdd = false
        return
      }
    })
    if (!shouldAdd) {
      console.log('Already activity on that date, skipping.')
      return state
    }

    return [
      ...state, {
        ID: Math.max(state.reduce((maxId, activity) => Math.max(activity.ID, maxId), -1) + 1, 1),
        habitID: habitID,
        datetime: datetime
      }
    ]
  },
  'REMOVE_HABIT_ACTIVITY': (state, action) => {
    const newState = state.reduce((activities, activity) => {
      if (activity.ID !== action.ID) {
        [...activities, activity]
      }
      return activities
    }, [])
    return newState
  }
}, initialState)
