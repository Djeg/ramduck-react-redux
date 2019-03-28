import { addTodo, removeTodo } from './test/State/TodoList'
import { boot } from './test'
import TestRenderer from 'react-test-renderer'
import TodoList from './test/Component/TodoList'

it('can useData', () => {
  const { store, element } = boot()
  const inspector = TestRenderer.create(element)

  store.dispatch(addTodo({ id: 1, text: 'Do you like FRP ?', checked: false }))

  const todos = inspector.root.findAllByProps({ className: 'todo' })

  expect(todos.length).toBe(1)

  const text = inspector.root.findByProps({ className: 'todo' }).findByType('p')

  expect(text.children).toEqual([ 'Do you like FRP ?' ])

  store.dispatch(removeTodo(1))

  inspector.update(element)

  const todos2 = inspector.root.findAllByProps({ className: 'todo' })

  expect(todos2.length).toBe(0)
});
