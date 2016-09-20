
import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import todos from './todos'
import dreams from './dreams'

export default combineReducers({
  routing,
  todos,
  dreams
})
