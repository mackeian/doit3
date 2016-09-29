
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as DreamActions from '../../actions/dreams'
import style from './style.css'
import { Link } from 'react-router'

import {pinkA200, transparent} from 'material-ui/styles/colors'
import {List, ListItem} from 'material-ui/List'


class Dream extends Component {
  render() {
    const { dreams, actions, params, children } = this.props
    const dream = dreams.filter(d => {return d.id = params.dreamId})[0];
    return (
      <div className={style.normal}>
        <h1>WOHO! {dream.name}</h1>
        <Link to="/">Back</Link>
        <p><i>{dream.why}</i></p>

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
)(Dream)
