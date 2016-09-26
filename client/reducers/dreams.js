
import { handleActions } from 'redux-actions'

const initialState = [];

export default handleActions({
  'ADD_DREAM' (state, action) {
    return [
      ...state, {
      id: state.reduce((maxId, dream) => Math.max(dream.id, maxId), -1) + 1,
      name: action.payload.name,
      why: action.payload.why
      }
    ]
  },

  /*'delete todo' (state, action) {
    return state.filter(todo => todo.id !== action.payload )
  },

  'edit todo' (state, action) {
    return state.map(todo => {
      return todo.id === action.payload.id
        ? { ...todo, text: action.payload.text }
        : todo
    })
  },

  'complete todo' (state, action) {
    return state.map(todo => {
      return todo.id === action.payload
        ? { ...todo, completed: !todo.completed }
        : todo
    })
  },

  'complete all' (state, action) {
    const areAllMarked = state.every(todo => todo.completed)
    return state.map(todo => {
      return {
        ...todo,
        completed: !areAllMarked
      }
    })
  },

  'clear complete' (state, action) {
    return state.filter(todo => todo.completed === false)
  }*/
}, initialState)
