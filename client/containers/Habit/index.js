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
        <li key={activity.ID}>{activity.ID} - {activity.datetime} <Link onClick={() => actions.removeHabitActivity({'ID': activity.ID})}>[REMOVE]</Link></li>
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
              habitID: habit.ID,
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


const getActivitiesForHabit = (habitActivities, habitID) => {
  return habitActivities ? habitActivities.filter(a => a.habitID === habitID): [];
}

const getHabitFromId = (habits, habitID) => {
  return habits.filter(h => {return h.ID === habitID})[0];
}

function mapStateToProps(state, props) {
  const habitID = parseInt(props.routeParams.habitID, 10)
  const habit = getHabitFromId(state.goalHabits, habitID)
  return {
    habit,
    habitActivities: getActivitiesForHabit(state.habitActivities, habitID)
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
