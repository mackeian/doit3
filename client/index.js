
import { Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import App from './containers/App'
import Dream from './containers/Dream'
import Goal from './containers/Goal'
import configure from './store'

const store = configure()
const history = syncHistoryWithStore(browserHistory, store)

store.subscribe(() => {
  const state = store.getState()
  localStorage.setItem('reduxState', JSON.stringify({
     dreams: state.dreams,
     goals: state.goals,
     goalHabits: state.goalHabits,
     habitActivities: state.habitActivitites
  }))
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
        <Route path="/dreams/:dreamId/" component={Dream} />
        <Route path="/goals/:goalId/" component={Goal} />

      </Router>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
)
