
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as DreamActions from '../../actions/dreams'
import style from './style.css'
import { Link } from 'react-router'

import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ActionGrade from 'material-ui/svg-icons/action/grade'
import {pinkA200, transparent} from 'material-ui/styles/colors'
import {List, ListItem} from 'material-ui/List'


class App extends Component {

  handleNameFieldChange(e) {
    this.setState({name: e.target.value})
  }
  handleWhyFieldChange(e) {
    this.setState({why: e.target.value})
  }

  render() {
    const { dreams, actions, children } = this.props
    return (
      <div className={style.normal}>
        <h1>Dreams</h1>
        <TextField
          hintText="Name your dream, make it inspirational!"
          id="dream_name"
          fullWidth={true}
          onChange={this.handleNameFieldChange.bind(this)}
        ></TextField>
        <TextField
          hintText="Why do you have this dream? Why do you want it so bad?"
          id="dream_why"
          fullWidth={true}
          multiLine={true}
          onChange={this.handleWhyFieldChange.bind(this)}
        >
        </TextField>
        <FloatingActionButton
          onClick={() => actions.addDream({
            name: this.state.name,
            why: this.state.why
          })}
        >
          <div style={style.center}>
            <i className="fa fa-plus"></i>
          </div>
        </FloatingActionButton>
        <ul>
        {dreams.map(dream =>
          <li key={dream.id}>
            <Link to="/dreams/1/">{dream.name}</Link><br/>
            <small>
              {dream.why}
            </small>

          </li>
        )}
        </ul>

        {children}

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    dreams: state.dreams
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(DreamActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
