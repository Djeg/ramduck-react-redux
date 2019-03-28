import { action1, createReducer, init, whenAction } from 'ramduck-redux'
import { dissoc, evolve, mergeLeft, not, objOf } from 'ramda'


const initialState = {}


export const addTodo = action1('TodoList: Add a todo', objOf('todo'))


export const toggleTodo = action1('TodoList: Toggle todo', objOf('id'))


export const removeTodo = action1('TodoList: Remove a todo', objOf('id'))


export default createReducer('todos', [
  init(initialState),
  whenAction(addTodo, ({ todo }) => mergeLeft({ [todo.id]: todo })),
  whenAction(toggleTodo, ({ id }) => evolve({
    [id]: evolve({ 'toggled': not })
  })),
  whenAction(removeTodo, ({ id }) => dissoc(id)),
])
