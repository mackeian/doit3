
import { Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import App from './containers/App'
import Dream from './containers/Dream'
import Goal from './containers/Goal'
import Habit from './containers/Habit'
import HabitDashboard from './containers/HabitDashboard'
import configure from './store'

const store = configure()
const history = syncHistoryWithStore(browserHistory, store)

store.subscribe(() => {
  const state = store.getState()
  const stringifiedState = JSON.stringify({
     dreams: state.dreams,
     goals: state.goals,
     goalHabits: state.goalHabits,
     habitActivities: state.habitActivities
  })
  localStorage.setItem('reduxState', stringifiedState)
})

import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider>
      <Router history={history}>
        <Route path="/" component={App} />
        <Route path="/dreams/:dreamID/" component={Dream} />
        <Route path="/goals/:goalID/" component={Goal} />
        <Route path="/habits/:habitID/" components={Habit} />
        <Route path="/dashboard/" components={HabitDashboard} />

      </Router>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
)
