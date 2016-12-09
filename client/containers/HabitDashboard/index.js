import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as habitActivityActions from '../../actions/habit-activities'
import { Link } from 'react-router'

import {pinkA200, transparent} from 'material-ui/styles/colors'
import {List, ListItem} from 'material-ui/List'

import { HABIT_ITERATION_DAILY, HABIT_ITERATION_WEEKLY, HABIT_ITERATION_BIWEEKLY, HABIT_ITERATION_MONTHLY } from '../../constants/constants'

const HabitDashboard = ({habitsData, actions, children}) => {
  return (<div>
    <h1>{habitsData.length} going on</h1>
    {habitsData.map((habitData) =>
      <div key={habitData.habitID}>
        <hr/>
        <h2>{habitData.habitName} {habitData.activities.length}</h2>
        <p>{habitData.goal.name} ({habitData.dream && habitData.dream.name})</p>
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
  /*const habitsData = [
    {
      dreamName: 'Healthy and fit!',
      goalName: '10km in 40min, by 31 dec 2016',
      iterationLength: 7, // days,
      iterationCurrent: 3, // current day
      iterationPercent: 2/7, //
      timesPerIterationGoal: 3,
      timesReachedCurrent: 1,
      timesPercent: 1/3,
      statusLevel: 4 // 1-4 Red to Green

    }
  ]*/

  const getGoalById = (goals, goalID) => {
    return goals.filter(g => parseInt(g.ID, 10) === goalID)[0]
  }

  const getDreamById = (dreams, dreamID) => {
    return dreams.filter(d => parseInt(d.ID, 10) === dreamID)[0]
  }

  const getActivitiesForHabitId = (habitActivities, habitID) => {
      return habitActivities.filter(a => parseInt(a.habitID, 10)   === habitID)
  }

  const getIterationLength = (habit) => {
    if (habit.iterationType === HABIT_ITERATION_WEEKLY) {
      return 7;
    }
    throw new Exception('Not implemented:' + habit.iterationType);
  }

  const getIterationCurrent = (habit) => {
    const SUNDAY = 0;
    if (habit.iterationType === HABIT_ITERATION_WEEKLY) {
      var dayOfWeek = new Date().getDay();
      if (dayOfWeek === SUNDAY) {
        dayOfWeek = 7;
      }
      return dayOfWeek;
    }
    throw new Exception('Not implemented:' + habit.iterationType);
  }

  const getIterationPercent = (iterationCurrent, iterationLength) => {
    return (iterationCurrent -1) / iterationLength;
  }

  function getMonday(d) {
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }

  function addDays(date, days) {
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
  }

  const getActivitiesThisIteration = (habit, activities) => {
    if (habit.iterationType === HABIT_ITERATION_WEEKLY) {
      const iterationStart = getMonday(new Date());
      const iterationEnd = addDays(iterationStart, 7);
      const activitiesInIteration = activities.filter(a => {
        return new Date(a.datetime) <= iterationEnd && new Date(a.datetime) >= iterationStart
      });
      return activitiesInIteration;
    }
    throw new Exception('Not implemented:' + habit.iterationType);
  }

  const habitsData = state.goalHabits.map((habit) => {
    const activities = getActivitiesForHabitId(state.habitActivities, habit.ID)
    const goal = getGoalById(state.goals, habit.goalID)
    const dream = getDreamById(state.dreams, goal.dreamID)

    const iterationLength = getIterationLength(habit)
    const iterationCurrent = getIterationCurrent(habit)
    const iterationPercent = getIterationPercent(iterationCurrent, iterationLength)
    const timesPerIterationGoal = habit.timesPerIteration
    const numberTimesReached = getActivitiesThisIteration(habit, activities).length
    const numberTimesPercent = numberTimesReached / timesPerIterationGoal
    const unitLeftsInIteration = iterationLength - iterationCurrent

    var level = 0;
    if (numberTimesPercent >= iterationPercent) {
      // Green, number times, ahead of iteration time passed
      level = 1
    } else if (iterationPercent > 0.50 && numberTimesPercent < iterationPercent) {
      // Red, more than half of time passed and beyond
      level = 3
    } else if (numberTimesPercent < iterationPercent) {
      // Yellow, beyond of time
      level = 2;
    }


    /*
    Grön: timesProcent <= iterationPercent (e.x. första dagen 0% (0/7) <= inget gjort 0% (0/3), ändå grön)
   Gul: timesProcent > iterationPercent (ex andra dag 14% (1/7) < inget gjort 0% (0/3)
   Röd: timesProcent > 50 % && iterationPercent
     */

    debugger

    return {
      habitID: habit.ID,
      habitName: habit.name,
      activities,
      goal,
      dream,
      iterationLength,
      iterationCurrent,
      iterationPercent,
      numberTimesPercent,
      statusLevel: level,
      unitLeftsInIteration
    }
  });

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
)(HabitDashboard)
