Ramduck React Redux
===================

Tired of creating containers, of mapping your state to some props. Looking
for a more meaningfull approach ?

This little project brings the power ramduck redux to react redux

## Previously

```js
// src/components/TodoList.js
import React from 'react'
import { changeTodo, addTodo, toggleTodo, removeTodo } from '../some/reducer/todo'
import { connect } from 'react-redux'

const TodoList = ({
  list = [],
  newTodo = '',
  changeTodo,
  addTodo,
  toggleTodo,
  removeTodo,
}) =>
  <div className="todo list">
    {list.map(todo =>
      <div
        key={todo.id}
        className="todo ${todo.checked ? 'checked' : ''}"
        onClick={toggleTodo(todo.id)}
      >
        <p>{todo.text}</p>
        <i className="ico close" onClick={removeTodo(todo.id)} />
      </div>
    )}
    <input type="text" onChange={changeTodo} value={newTodo} />
    <button onClick={addTodo(newTodo)}>Add todo</button>
  </div>

export default connect(
  state => state.todos,
  dispatch => ({
    changeTodo: event => dispatch(changeTodo(event.target.value)),
    addTodo: text => event => dispatch(addTodo(text)),
    toggleTodo: id => event => dispatch(toggleTodo(id)),
    removeTodo: id => event => dispatch(removeTodo(id)),
  })
)
```


## With ramduck-react-redux (assuming that you are using ramduck redux)

```js
import { map } from 'ramda'
import TodoList, { addTodo, removeTodo, toggleTodo, changeTodo } from '../some/reducer/todos'
import React from 'react'
import { useData, useAction, useActionEff } from 'ramduck-react-redux'

export default () =>
  <div className="todo list">
    {map(todo =>
      <div
        key={todo.id}
        className="todo ${todo.checked ? 'checked' : ''}"
        onClick={useAction(toggleTodo(todo.id))}
      >
        <p>{todo.text}</p>
        <i className="ico close" onClick={useAction(removeTodo(todo.id))} />
      </div>
    ) (useData(TodoList, 'list'))}
    <input
      type="text"
      onChange={useActionEff(event => changeTodo(event.target.value))} 
      value={newTodo}
    />
    <button onClick={useAction(addTodo(useData(TodoList, 'newTodo')))}>Add todo</button>
  </div>
```

## Installation


with npm: `npm i ramduck-react-redux --save`

with yarn: `yarn add ramduck-react-redux`

## Api

This module is using [React 16.8 hooks](https://reactjs.org/docs/hooks-reference.html), you must have
a version compatible before using this library.


### `useData :: (String, String) -> a`

Use a given dot path for a given state name

```js
import { useData } from 'ramduck-react-redux'

useData('myRootReducer', 'a.b.c') // will invoke store.getState().myRootReducer.a.b.c
```

If you are using [ramduck redux](https://www.npmjs.com/package/ramduck-redux) `createReducer` function
it will automatically add a `toString` method over your reducer allowing you to use
your reducer directly inside `useData`:

```js
import { createReducer, init } from 'ramduck-redux'
import { useData } from 'ramduck-react-redux'

const reducer = createReducer('user', [
  init({ id: '', username: 'anonymous' })
])


useData(reducer, 'username') // 'anonymous'
```

### `useState :: (String, (a -> b)) -> b`

```js
import { useState } from 'ramduck-react-redux'

useState('myRootReducer', state => state.a.b);
// will invoke store.getState().myRootReducer.a.b
```

### `useDataOr :: (a, String, String) -> a`

```js
import { useDataOr } from 'ramduck-react-redux'

useDataOr('No friend', 'user', 'friends.0.username')
// 'No friend' if store.getState().user.friends[0].username is not set
```

### `useAction :: Action | (* -> Action) | Functor (Action | (* -> Action)) -> React.SyntheticEvent -> *`

Perform a dispatch effect of the given action:

```js
<button onClick={useAction(changeUsername(newUsermane))}>Change username</button>

// It also support action creator with no arguments:
<button onClick={useAction(submit)}>Submit</button>


// You can pass any functor to the function:
<button onClick={useAction([
  submit,
  [ toggleTodo(id), Maybe.just(addTodo(id)) ]
])}>Do more stuff</button>
```

### `useActionEff :: (React.SyntheticEvent -> Action | (* -> Action) | Functor (Action | (* -> Action)) -> React.SyntheticEvent -> *`

Allow the usage of the synthetic event when creating actions

```js
import { safe, isString } from 'crocks'


<input type="text" onChange={useActionEff(event =>
  changeTodo(event.currentTarget.value)
)} />

// This will perform an add todo only if the target value is
// a valid String (thanks to the `Maybe` functor from crocks).
<input type="text" onChange={useActionEff(event =>
  event.target.value
  |> safe(isString)
  |> map(addTodo)
)}>Add todo</button>
```
