const styles = require('./style.css')

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as habitActivityActions from '../../actions/habit-activities'
import { Link } from 'react-router'
import classNames from 'classnames'

import {pinkA200, transparent} from 'material-ui/styles/colors'
import {List, ListItem} from 'material-ui/List'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton'

import { HABIT_ITERATION_DAILY, HABIT_ITERATION_WEEKLY, HABIT_ITERATION_BIWEEKLY, HABIT_ITERATION_MONTHLY } from '../../constants/constants'

const HabitDashboard = ({habitsData, actions, children}) => {
  const dateToUTCdate = (date) => {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  }

  const getNow = () => {
    let now = new Date()
    now.setHours(0, 0, 0, 0);
    return now;
  }

  const getHabitElement = (habitData) => {
    let habitClass
    switch(habitData.statusLevel) {
      case 1:
        habitClass = styles.class1;
        break;
      case 2:
        habitClass = styles.class2;
        break;
      case 3:
        habitClass = styles.class3;
        break;
    }

    return <div key={habitData.habitID} className={styles.habitProgress}>
        <Card className={habitClass}>
          <CardHeader
            title={'Habit:' + habitData.habitName}
          >
          </CardHeader>

          <CardText>
            <FloatingActionButton
              onClick={() => actions.addHabitActivity({
                habitID: habitData.habitID,
                datetime: dateToUTCdate(getNow()).toISOString()
              })}
              className={styles.addActivity}
            >
              <div>
                <i className="fa fa-plus"></i>
              </div>
            </FloatingActionButton>
            {
              habitData.activityIndicators.map((indicator, index) => {
                return <FloatingActionButton key={index} disabled={!indicator.reached} secondary={indicator.exceeded} mini={true}>{indicator.label}</FloatingActionButton>
              })
            }
            <p>{habitData.activitiesReached} out of {habitData.activitiesPerIterationGoal} this iteration.</p>
            <hr/>
            <p>Your goal: <strong>{habitData.goal.name} - ({habitData.dream && habitData.dream.name})</strong></p>
          </CardText>
        </Card>
      </div>
  }

  return (<div>
    <Link to={'/'}>Back</Link>
    <h1>{habitsData.length} ongoing habits</h1>
    {habitsData.map((habitData) =>
      getHabitElement(habitData)
    )}

  </div>)
};

function mapStateToProps(state, props) {
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

  const getCurrentIterationPosition = (habit) => {
    /*
     Where in current iteration we should count against,
     i.e. if it's Sunday in a week iteration, we only count 6 of 7 since sunday is not done yet.
     */
    if (habit.iterationType === HABIT_ITERATION_WEEKLY) {
      const SUNDAY = 0;
      var dayOfWeek = new Date().getDay();
      if (dayOfWeek === SUNDAY) {
        dayOfWeek = 7;
      }
      return Math.max(0, dayOfWeek);
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
      let iterationStart = getMonday(new Date());
      iterationStart.setHours(0, 0, 0, 0);
      let iterationEnd = addDays(iterationStart, 7);
      iterationEnd.setHours(0, 0, 0, 0);
      console.log('Getting activities between', iterationStart, iterationEnd);
      const activitiesInIteration = activities.filter(a => {
        return new Date(a.datetime) <= iterationEnd && new Date(a.datetime) >= iterationStart
      });
      return activitiesInIteration;
    }
    throw new Exception('Not implemented:' + habit.iterationType);
  }

  const getWeekdayShortName = (dateString) => {
    var date = new Date(dateString);
    var weekday = new Array(7);
    weekday[0] =  "Sun";
    weekday[1] = "Mon";
    weekday[2] = "Tue";
    weekday[3] = "Wed";
    weekday[4] = "Thu";
    weekday[5] = "Fri";
    weekday[6] = "Sat";
    return weekday[date.getDay()];
  }

  const habitsData = state.goalHabits.map((habit) => {
    const activities = getActivitiesForHabitId(state.habitActivities, habit.ID)
    const goal = getGoalById(state.goals, habit.goalID)
    const dream = getDreamById(state.dreams, goal.dreamID)

    const iterationLength = getIterationLength(habit)
    const currentIterationPosition = 7 //getCurrentIterationPosition(habit)
    const currentIterationPercentReached = getIterationPercent(currentIterationPosition, iterationLength)
    const activitiesPerIterationGoal = habit.timesPerIteration
    const activitiesInIteration = getActivitiesThisIteration(habit, activities)
    const activitiesReached = activitiesInIteration.length
    const activitiesPercentReached = activitiesReached / activitiesPerIterationGoal
    const unitLeftsInIteration = iterationLength - currentIterationPosition

    let activityIndicators = [];
    for (var i = 1; i <= Math.max(activitiesReached, activitiesPerIterationGoal); i++) {
      let indicator = {
        exceeded: false,
        reached: false,
        label: ''
      };
      if (i <= activitiesReached) {
        indicator.reached = true;
        indicator.label = getWeekdayShortName(activitiesInIteration[i-1].datetime);
        if (i > activitiesPerIterationGoal) {
          indicator.exceeded = true;
        }
      }
      activityIndicators.push(indicator);
    }

    var level;
    if (activitiesPercentReached >= currentIterationPercentReached) {
      // Green, number times, ahead of iteration time passed
      level = 1
    } else if (currentIterationPercentReached > 0.50 && activitiesPercentReached < currentIterationPercentReached) {
      // Red, more than half of time passed and behind in time
      level = 3
    } else if (activitiesPercentReached < currentIterationPercentReached) {
      // Yellow, behind in time
      level = 2;
    }

    /*
    Grön: timesProcent <= iterationPercent (e.x. första dagen 0% (0/7) <= inget gjort 0% (0/3), ändå grön)
   Gul: timesProcent > iterationPercent (ex andra dag 14% (1/7) < inget gjort 0% (0/3)
   Röd: timesProcent > 50 % && iterationPercent
     */
    console.log('Iteration percent:', currentIterationPercentReached);
    console.log('Activity percent:', activitiesPercentReached);
    return {
      habitID: habit.ID,
      habitName: habit.name,
      activities,
      goal,
      dream,
      iterationLength,
      currentIterationPosition,
      currentIterationPercentReached,
      activitiesReached,
      activitiesPerIterationGoal,
      activitiesPercentReached,
      activityIndicators,
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
