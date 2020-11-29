import tryCatch from 'crocks/Result/tryCatch'
import unary from 'crocks/helpers/unary'
import identity from 'crocks/combinators/identity'
import constant from 'crocks/combinators/constant'

import isString from 'crocks/predicates/isString'
import isArray from 'crocks/predicates/isArray'
import ifElse from 'crocks/logic/ifElse'
import tap from 'crocks/helpers/tap'

import maybeToResult from 'crocks/Result/maybeToResult'
import safe from 'crocks/Maybe/safe'

const localStorageKey = 'history'

// setItem : String -> a -> a
const setItem = (key) => (value) => {
  safe(isString, value)
    .coalesce(constant(JSON.stringify(value)), identity)
    .map((value) => window.localStorage.setItem(key, value))

  return value
}

// setHistory : a -> ()
const setHistory = setItem(localStorageKey)

// getHistory : () -> Maybe String
const getHistory = () =>
  safe(isString, window.localStorage.getItem(localStorageKey))

// addEntry : number -> List { time: number, date: Date }
const addEntry = (time) => (entries) => {
  const newEntry = { time, date: new Date() }

  return safe(isArray, entries)
    .coalesce(constant([newEntry]), (safeEntries) => [newEntry, ...safeEntries])
}

// save : number -> Result (List { time: number: date: Date })
const save = (time) => {
  return addEntry(time)(list())
    .map(setHistory)
    .option([])
}

// list : () -> List { time: number, date: Date }
const list = () => {
  return maybeToResult(constant('History not found'), getHistory())
    .chain(tryCatch(unary(JSON.parse)))
    .map(ifElse(isArray, identity, constant([])))
    .either(constant([]), identity)
}

export default { save, list }