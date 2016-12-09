import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as goalActions from '../../actions/goals'
import style from './style.css'
import { Link } from 'react-router'

import {pinkA200, transparent} from 'material-ui/styles/colors'
import {List, ListItem} from 'material-ui/List'
import TextField from 'material-ui/TextField'
import DatePicker from 'material-ui/DatePicker'
import FloatingActionButton from 'material-ui/FloatingActionButton'

const getGoalsForDream = (goals, dreamID) => {
  return goals.filter(g => g.dreamID === dreamID);
}

class Dream extends Component {
  render() {
    const { dreams, goals, actions, params, children } = this.props
    const dream = dreams.filter(d => {return d.ID = params.dreamID})[0];
    return (
      <div className={style.normal}>
        <h1>{dream.name}</h1>
        <Link to="/">Back</Link>
        <p><i>{dream.why}</i></p>
        <hr/>
        <AddGoal actions={actions} dream={dream}/>
        <GoalList goals={goals} />

        {children}

      </div>
    )
  }
}

class GoalList extends Component {
  render() {
    const { goals } = this.props
    return (
      <ul>
        {goals.map((g) =>
          <li key={g.ID}>
            <Link to={'/goals/'+g.ID+'/'}>{g.name}</Link>
          </li>
        )}
      </ul>
    )
  }
}

class AddGoal extends Component {
  constructor(props) {
    super(props);
    const now = new Date()
    const threeMonthsFromNow = new Date()
    threeMonthsFromNow.setMonth(now.getMonth() + 3)
    this.state = {name: '', starts: now, ends: threeMonthsFromNow}
  }
  handleNameFieldChange(e) {
    this.setState({name: e.target.value})
  }
  handleStartsFieldChange(e) {
    this.setState({starts: e.target.value})
  }

  handleEndsFieldChange(e) {
    this.setState({ends: e.target.value})
  }

  render() {
    const { dream, actions } = this.props
    return (
      <div>
        <h2>Add goal</h2>
        <TextField
          hintText="Name your goal, make it quantifiable if possible!"
          id="goal_name"
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

        <FloatingActionButton
          onClick={() => actions.addGoal({
            name: this.state.name,
            dreamID: dream.ID,
            starts: this.state.starts,
            ends: this.state.ends
          })}
        >
          <div style={style.center}>
            <i className="fa fa-plus"></i>
          </div>
        </FloatingActionButton>
      </div>
    )
  }
}




function mapStateToProps(state, props) {
  const dreamID = parseInt(props.routeParams.dreamID, 10)
  return {
    dreams: state.dreams,
    goals: getGoalsForDream(state.goals, dreamID)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(goalActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dream)
