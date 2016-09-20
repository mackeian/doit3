
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as DreamActions from '../../actions/dreams'
import style from './style.css'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ActionGrade from 'material-ui/svg-icons/action/grade'
import {pinkA200, transparent} from 'material-ui/styles/colors'
import {List, ListItem} from 'material-ui/List'


class App extends Component {
  render() {
    const { dreams, actions, children } = this.props
    return (
      <MuiThemeProvider>
        <div className={style.normal}>
          <h1>Dreams</h1>
          <TextField
            hintText="Name your dream, make it inspirational!"
            id="dream_name"
            fullWidth={true}
            ref={(input) => this._input_name = input}
          ></TextField>
          <TextField
            hintText="Why do you have this dream? Why do you want it so bad?"
            id="dream_why"
            fullWidth={true}
            multiLine={true}
            ref={(input) => this._input_why = input}
          >
          </TextField>
          <FloatingActionButton
            onClick={actions.addGoal(this._input_name, this._input_why)}
          >
            <div style={style.center}>
              <i className="fa fa-plus"></i>
            </div>
          </FloatingActionButton>

          <List>
            {dreams.map(function(dream) {
              <ListItem
                leftAvatar={<ActionGrade color={pinkA200} />}
                primaryText={dream.name}
                secondaryText={
                  <p>
                    {dream.why}
                  </p>
                }
                secondaryTextLines={2}
              />
            })}
          </List>

          {children}

        </div>
      </MuiThemeProvider>
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
