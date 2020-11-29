import React, { useEffect } from 'react'

import Maybe from 'crocks/Maybe'

import constant from 'crocks/combinators/constant'
import flip from 'crocks/combinators/flip'
import applyTo from 'crocks/combinators/applyTo'

import pipe from 'crocks/helpers/pipe'
import binary from 'crocks/helpers/binary'
import getPropOr from 'crocks/helpers/getPropOr'
import unit from 'crocks/helpers/unit'

import ifElse from 'crocks/logic/ifElse'
import when from 'crocks/logic/when'

import isTrue from 'crocks/predicates/isTrue'
import isFalse from 'crocks/predicates/isFalse'

import equals from 'crocks/pointfree/equals'

import eitherFromBoolean from './helpers/eitherFromBoolean'
import makeScramble from './domain/makeScramble'

import './App.css'

const subtract = (x) => (y) => x - y
const toSeconds = (ms) => ms / 1000
const getProp = getPropOr()

const setIntervalCurried = flip(binary(setInterval))

const isSpaceBarPressed = (event) => equals(32)(getProp('keyCode')(event))

const { Just, Nothing } = Maybe

function App() {
  const [scramble, setScramble] = React.useState(makeScramble())
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [startTime, setStartTime] = React.useState(Nothing)
  const [endTime, setEndTime] = React.useState(Nothing)

  const handleStart = () => {
    const now = Just(Date.now())

    setIsPlaying(true)
    setStartTime(now)
    setEndTime(now)
  }

  const handleStop = () => {
    setIsPlaying(false)
    setEndTime(Maybe.of(Date.now()))
    setScramble(makeScramble([]))
  }

  const handleKeyUp =
    when(
      isSpaceBarPressed,
      ifElse(constant(isPlaying), handleStop, handleStart)
    )

  const renderStart = () => <button onClick={handleStart}>Start</button>
  const renderStop = () => <button onClick={handleStop}>Stop</button>
  const renderScramble = () => <p>{scramble.join(' ')}</p>
  const renderButton = ifElse(isTrue, renderStop, renderStart)

  const renderTime = () => {
    return Maybe
      .of(subtract)
      .ap(endTime)
      .ap(startTime)
      .map(toSeconds)
      .either(unit, (time) => <span>{time}</span>)
  }

  useEffect(() => {
    const handleInterval = () => applyTo(pipe(Date.now, Maybe.of), setEndTime)

    const intervalId =
      eitherFromBoolean(isPlaying)
        .map(constant(handleInterval))
        .map(setIntervalCurried(50))

    return () => intervalId.either(unit, clearInterval)
  }, [isPlaying, setEndTime])

  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp)

    return () => window.removeEventListener('keyup', handleKeyUp)
  }, [handleKeyUp])

  return (
    <div className="App">
      <header className="App-header">
        {when(isFalse, renderScramble)(isPlaying)}

        {renderTime()}

        {renderButton(isPlaying)}
      </header>
    </div>
  );
}

export default App;
