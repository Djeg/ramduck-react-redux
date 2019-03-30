import { action1, createReducer, init, whenAction } from 'ramduck-redux'
import { assoc, dissoc, evolve, mergeLeft, not, objOf, prop } from 'ramda'


const initialState = {
  list: {},
  newTodo: '',
}


export const addTodo = action1('TodoList: Add a todo', text => ({
  todo: {
    id: String(new Date().getTime()),
    checked: false,
    text,
  }
}))


export const toggleTodo = action1('TodoList: Toggle todo', objOf('id'))


export const removeTodo = action1('TodoList: Remove a todo', objOf('id'))


export const changeNewTodo = action1('TodoList: Change new todo', objOf('newTodo'))


export default createReducer('todos', [
  init(initialState),
  whenAction(addTodo, ({ todo }) => evolve({
    list: mergeLeft({ [todo.id]: todo })
  })),
  whenAction(toggleTodo, ({ id }) => evolve({
    list: evolve({
      [id]: evolve({ 'toggled': not })
    })
  })),
  whenAction(removeTodo, ({ id }) => evolve({
    list: dissoc(id)
  })),
  whenAction(changeNewTodo, ({ newTodo }) => assoc('newTodo', newTodo))
])
