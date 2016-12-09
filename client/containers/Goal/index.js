import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as habitActions from '../../actions/goal-habits'
import { Link } from 'react-router'

import {pinkA200, transparent} from 'material-ui/styles/colors'
import {List, ListItem} from 'material-ui/List'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import { HABIT_ITERATION_DAILY, HABIT_ITERATION_WEEKLY, HABIT_ITERATION_BIWEEKLY, HABIT_ITERATION_MONTHLY } from '../../constants/constants'

class Goal extends Component {
  render() {
    const { goal, habits, actions, params, children } = this.props
    return (
      <div>
        <h1>{goal.name}</h1>
        <Link to={'/dreams/'+goal.dreamID+'/'}>Back</Link>
        <hr/>
        <AddHabit goal={goal} actions={actions}/>
        <ul>
          {habits.map((habit) =>
            <li key={habit.ID}>
              <Link to={'/habits/'+habit.ID+'/'}>{habit.name}</Link>
              <small>- {habit.timesPerIteration} / {habit.iterationType}</small>
            </li>
          )}
        </ul>

        {children}

      </div>
    )
  }
}

class AddHabit extends Component {
  constructor(props) {
    super(props);
    const now = new Date()
    const threeMonthsFromNow = new Date()
    threeMonthsFromNow.setMonth(now.getMonth() + 3)
    this.state = {
      name: '',
      starts: now,
      ends: threeMonthsFromNow,
      timesPerIteration: 3,
      iterationType: HABIT_ITERATION_WEEKLY
    }
  }
  handleNameFieldChange(e) {
    this.setState({name: e.target.value})
  }
  handleStartsFieldChange(e, newDate) {
    this.setState({starts: newDate})
  }

  handleEndsFieldChange(e, newDate) {
    this.setState({ends: newDate})
  }

  handleTimesPerIterationFieldChange(e, index, value) {
    this.setState({timesPerIteration: value})
  }

  handleIterationTypeFieldChange(e, index, value) {
    this.setState({iterationType: value})
  }

  render() {
    const { goal, actions } = this.props;
    return (
      <div>
        <h2>Add habit</h2>
        <TextField
          hintText="Name your habit, be specific!"
          id="habit_name"
          fullWidth={true}
          onChange={this.handleNameFieldChange.bind(this)}
        />
        <DatePicker hintText="Starts"
          onChange={this.handleStartsFieldChange.bind(this)}
          defaultDate={this.state.starts}
        />
        <DatePicker hintText="Ends"
          onChange={this.handleEndsFieldChange.bind(this)}
          defaultDate={this.state.ends}
        />

        <SelectField value={this.state.timesPerIteration} onChange={this.handleTimesPerIterationFieldChange.bind(this)}>
          <MenuItem value={1} primaryText="1 time" />
          <MenuItem value={2} primaryText="2 times" />
          <MenuItem value={3} primaryText="3 times" />
          <MenuItem value={4} primaryText="4 times" />
          <MenuItem value={5} primaryText="5 times" />
          <MenuItem value={6} primaryText="6 times" />
        </SelectField>

        <SelectField value={this.state.iterationType} onChange={this.handleIterationTypeFieldChange.bind(this)}>
          <MenuItem value={HABIT_ITERATION_DAILY} primaryText="a day" />
          <MenuItem value={HABIT_ITERATION_WEEKLY} primaryText="a week" />
          <MenuItem value={HABIT_ITERATION_BIWEEKLY} primaryText="every other week" />
          <MenuItem value={HABIT_ITERATION_MONTHLY} primaryText="a month" />
        </SelectField>

        <FloatingActionButton
          onClick={() => actions.addGoalHabit({
            name: this.state.name,
            goalID: goal.ID,
            starts: this.state.starts,
            ends: this.state.ends,
            timesPerIteration: this.state.timesPerIteration,
            iterationType: this.state.iterationType
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

const getHabitsForGoal = (habits, goalID) => {
  return habits ? habits.filter(h => h.goalID === goalID): [];
}

const getGoalFromId = (goals, goalID) => {
  return goals.filter(g => {return g.ID === goalID})[0];
}

function mapStateToProps(state, props) {
  const goalID = parseInt(props.routeParams.goalID, 10)
  const goal = getGoalFromId(state.goals, goalID)
  return {
    goal,
    habits: getHabitsForGoal(state.goalHabits, goalID)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(habitActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Goal)
