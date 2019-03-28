import { compose, identity, map, values } from 'ramda'
import { useData } from '../..'
import React from 'react'
import TodoList from '../State/TodoList'


export default () =>
  <div className="todo-list">
    {
      TodoList
      |> useData
      |> map(Todo)
      |> values
    }
  </div>


const Todo = ({ id, text, checked }) =>
  <div className="todo" key={id}>
    <p className={checked ? 'checked' : ''}>{ text }</p>
  </div>
