import { Provider } from 'react-redux'
import React from 'react'
import TodoList from './TodoList'

export default ({ store }) =>
  <Provider store={store}>
    <TodoList />
  </Provider>
