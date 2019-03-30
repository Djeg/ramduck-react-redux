import { ReactReduxContext } from 'react-redux'
import { T, bind, cond, map, path, pathOr, split, uncurryN } from 'ramda'
import { useContext } from 'react'


// useData :: String -> String -> a
export const useData = (name, dotPath) => {
  const { store } = useContext(ReactReduxContext)
  const state = store.getState()
  const paths = dotPath
    ? split('.', `${name}.${dotPath}`)
    : [ `${name}` ]

  return path(paths, state)
}


// useDataOr :: a -> String -> String -> a
export const useDataOr = (defaultValue, name, dotPath) => {
  const { store } = useContext(ReactReduxContext)
  const state = store.getState()
  const paths = dotPath
    ? split('.', `${name}.${dotPath}`)
    : [ `${name}` ]

  return pathOr(defaultValue, paths, state)
}


// useState :: String -> (a -> b) -> b
export const useState = (name, extractor) => {
  const { store } = useContext(ReactReduxContext)
  const state = store.getState()

  return extractor(state[name])
}


// useAction :: Functor a => a -> () -> *
export const useAction = functor => {
  const { store } = useContext(ReactReduxContext)
  const dispatch = bind(store.dispatch, store)

  return () => dispatchAction(dispatch, functor)
}


// useActionEff :: Functor a => (React.SyntheticEvent -> a) -> React.SyntheticEvent -> *
export const useActionEff = eff => {
  const { store } = useContext(ReactReduxContext)
  const dispatch = bind(store.dispatch, store)

  return event => dispatchAction(dispatch, eff(event))
}


// dispatchAction :: (Action a -> *) -> b -> *
const dispatchAction = uncurryN(2, dispatch => cond([
  [ isFunction, creator => dispatchAction(dispatch, creator()) ],
  [ isFunctor, map(action => dispatchAction(dispatch, action)) ],
  [ T, dispatch ]
]))


// isFunction :: a -> Boolean
const isFunction = f => 'function' === typeof f


// isFunctor :: a -> Boolean
const isFunctor = f => undefined !== f.map && 'function' === typeof f.map
