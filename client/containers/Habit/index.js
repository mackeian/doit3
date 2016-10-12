import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as habitActivityActions from '../../actions/habit-activities'
import { Link } from 'react-router'

import {pinkA200, transparent} from 'material-ui/styles/colors'
import {List, ListItem} from 'material-ui/List'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import { HABIT_ITERATION_DAILY, HABIT_ITERATION_WEEKLY, HABIT_ITERATION_BIWEEKLY, HABIT_ITERATION_MONTHLY } from '../../constants/constants'

const Habit = ({habit, habitActivities, actions, children}) => {
  return (<div>
    <h1>
      Habit {habit.name}!<br/>
      <small>- {habit.timesPerIteration} / {habit.iterationType}</small>
    </h1>
    <AddActivity habit={habit} actions={actions} />

    <h2>Activities</h2>
    <ul>
      {habitActivities.map((activity) =>
        <li key={activity.id}>{activity.id} - {activity.datetime} <Link onClick={() => actions.removeHabitActivity({'id': activity.id})}>[REMOVE]</Link></li>
      )}
    </ul>
  </div>)
};

class AddActivity extends Component {
  constructor(props) {
    super(props);
    let now = new Date()
    now.setHours(0, 0, 0, 0);
    this.state = {
      date: now
    }
  }
  dateToUTCdate(date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  }

  handleDateChange(e, newDate) {
    this.setState({date: newDate})
  }

  render() {
    const {habit, actions} = this.props
    return (
      <div>
        <h2>Add activity</h2>
        <DatePicker hintText="When did it happen?"
          onChange={this.handleDateChange.bind(this)}
          defaultDate={this.state.date}
        />
        <FloatingActionButton
            onClick={() => actions.addHabitActivity({
              habitId: habit.id,
              datetime: this.dateToUTCdate(this.state.date).toISOString()
            })}
          >
            <div>
              <i className="fa fa-plus"></i>
            </div>
          </FloatingActionButton>
      </div>
    )
  }
}


const getActivitiesForHabit = (habitActivities, habitId) => {
  return habitActivities ? habitActivities.filter(a => a.habitId === habitId): [];
}

const getHabitFromId = (habits, habitId) => {
  return habits.filter(h => {return h.id === habitId})[0];
}

function mapStateToProps(state, props) {
  const habitId = parseInt(props.routeParams.habitId, 10)
  const habit = getHabitFromId(state.goalHabits, habitId)
  return {
    habit,
    habitActivities: getActivitiesForHabit(state.habitActivities, habitId)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(habitActivityActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Habit)
