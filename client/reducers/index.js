
import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import dreams from './dreams'
import goals from './goals'
import goalHabits from './goal-habits'
import habitActivities from './habit-activities'

export default combineReducers({
  routing,
  dreams,
  goals,
  goalHabits,
  habitActivities
})
