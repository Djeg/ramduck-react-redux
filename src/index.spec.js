import { addTodo, changeNewTodo, removeTodo } from './test/State/TodoList'
import { boot } from './test'
import { head, keys, map, prop } from 'ramda'
import { mount } from 'enzyme'
import TodoList from './test/Component/TodoList'


let store, inspector


beforeEach(() => {
  const { store: storage, element } = boot()
  store = storage
  inspector = mount(element)
});


it('can use data', () => {
  store.dispatch(addTodo('Do you like FRP ?'))

  inspector.update()

  const todos = inspector.find('.todo')

  expect(todos.length).toBe(1)

  const text = inspector.find('.todo p').first()

  expect(text).toHaveText('Do you like FRP ?')

  const id = store.getState().todos.list
    |> keys
    |> head

  store.dispatch(removeTodo(id))

  inspector.update()

  const todos2 = inspector.find('.todo')

  expect(todos2.length).toBe(0)
});


it('can use action effect', () => {
  const input = inspector.find('input[type="text"]').first()
  input.simulate('change', { target: { value: 'Do you like chocolate ?' } })

  inspector.update()

  inspector.find('button').first().simulate('click')

  inspector.update()

  expect(store.getActions().length).toBe(2)
  expect(map(prop('type'), store.getActions())).toEqual([
    String(changeNewTodo),
    String(addTodo),
  ])

  const todo = inspector.find('.todo p').first()

  expect(todo).toHaveText('Do you like chocolate ?')
});


it('can use state', () => {
  const input = inspector.find('input[type="text"]').first()
  input.simulate('change', { target: { value: 'Do you like chocolate ?' } })

  inspector.update()

  const p = inspector.find('.new-todo p').first()

  expect(p).toHaveText('Do you like chocolate ?')
});
