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

const HabitDashboard = ({habitsData, actions, children}) => {
  return (<div>
    <h1>{habitsData.length} going on</h1>
    {habitsData.map((habitData) =>
      <div>
        <hr/>
        <h2>{habitData.name}</h2>
        <p>{habitData.goalName} ({habitData.dreamName})</p>
      </div>
    )}

  </div>)
};

function mapStateToProps(state, props) {
  /*
   Dag-progress (iterationPercent)
   Dag 7 av 7 raknas procentuellt som 6/7
   Dag 1 av 7 raknas procentuellt som 0/7

   dayPercent = (currentDay-1 / totalDays)
   daysLeft = totalDays - (currentDay - 1)
   timesPercent = (done / goal)
   timesLeft = goal - done

   (Red:) timesLeft <= daysLeft
   (Yellow:) timesPercent < daysPercent/2
   (LightGreen:) timesPercent < daysPercent
   Green: timesPercent >= daysPercent

   Grön: timesProcent <= iterationPercent (e.x. första dagen 0% (0/7) <= inget gjort 0% (0/3), ändå grön)
   Gul: timesProcent > iterationPercent (ex andra dag 14% (1/7) < inget gjort 0% (0/3)
   Röd: timesProcent > 50 % && iterationPercent

   */
  const habitsData = [
    {
      dreamName: 'My dream',
      goalName: 'My goal',
      iterationLength: 7, // days,
      iterationCurrent: 3, // current day
      iterationPercent: 2/7, //
      timesPerIterationGoal: 3,
      timesReachedCurrent: 1,
      timesPercent: 1/3,

    }
  ]

  return {
    habitsData
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
