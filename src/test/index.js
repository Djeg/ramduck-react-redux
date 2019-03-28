import { reduce } from 'ramda'
import React from 'react'
import App from './Component/App'
import configureStore from 'redux-mock-store'
import rootReducer from './State'
import TestRenderer from 'react-test-renderer'


export const boot = () => {
  const store = configureStore([])(() => {
    const actions = store.getActions();

    return reduce(rootReducer, rootReducer({}, {}), actions);
  })
  const element = <App store={store} />

  return { store, element }
}
