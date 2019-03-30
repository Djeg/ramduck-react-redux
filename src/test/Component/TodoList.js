import { map, path, prop, values } from 'ramda'
import { useAction, useActionEff, useData, useDataOr, useState } from '../..'
import React from 'react'
import TodoList, {
  addTodo,
  changeNewTodo,
  createTodoFromText
} from '../State/TodoList'


export default () =>
  <div className="todo-list">
    {
      useData(TodoList, 'list')
      |> map(Todo)
      |> values
    }
    <input
      type="text"
      id="text"
      onChange={useActionEff(event =>
        event.target.value
        |> changeNewTodo
      )}
      value={useData(TodoList, 'newTodo')}
    />
    <button onClick={
      useData(TodoList, 'newTodo')
      |> addTodo
      |> useAction
    }>Add todo</button>
    <div className="new-todo">
      <p>{useState(TodoList, prop('newTodo'))}</p>
    </div>
    <div className="data-or">
      <p>{useDataOr('default', TodoList, 'undefined')}</p>
    </div>
  </div>


export const Todo = ({ id, text, checked }) =>
  <div className="todo" key={id}>
    <p className={checked ? 'checked' : ''}>{ text }</p>
  </div>
