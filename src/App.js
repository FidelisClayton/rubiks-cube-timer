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

import { generate as generateScramble } from './domain/scramble'
import booleanToEither from './helpers/booleanToEither'

import Timer from './components/Timer'
import ActionButton from './components/ActionButton'
import Scramble from './components/Scramble'

import classes from './App.module.scss'

const getProp = getPropOr()

const setIntervalCurried = flip(binary(setInterval))

const isSpaceBarPressed = (event) => equals(32)(getProp('keyCode')(event))

const { Just, Nothing } = Maybe

function App() {
  const [scramble, setScramble] = React.useState(generateScramble([]))
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [startTime, setStartTime] = React.useState(Nothing)
  const [endTime, setEndTime] = React.useState(Nothing)

  const handleStart = () => {
    const maybeNow = Just(Date.now())

    setIsPlaying(true)
    setStartTime(maybeNow)
    setEndTime(maybeNow)
  }

  const handleStop = () => {
    setIsPlaying(false)
    setEndTime(Maybe.of(Date.now()))
    setScramble(generateScramble([]))
  }

  const handleKeyUp =
    when(
      isSpaceBarPressed,
      ifElse(constant(isPlaying), handleStop, handleStart)
    )

  const renderScramble = () => <Scramble className={classes.scramble} moves={scramble} />

  useEffect(() => {
    const handleInterval = () => applyTo(pipe(Date.now, Maybe.of), setEndTime)

    const intervalId =
      booleanToEither(isPlaying)
        .map(constant(handleInterval))
        .map(setIntervalCurried(50))

    return () => intervalId.either(unit, clearInterval)
  }, [isPlaying, setEndTime])

  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp)

    return () => window.removeEventListener('keyup', handleKeyUp)
  }, [handleKeyUp])

  return (
    <div className={classes.root}>
      {when(isFalse, renderScramble)(isPlaying)}

      <Timer
        className={classes.timer}
        startTime={startTime}
        endTime={endTime}
        isPlaying={isPlaying}
      />

      <ActionButton
        onStart={handleStart}
        onStop={handleStop}
        isPlaying={isPlaying}
      />
    </div>
  );
}

export default App;
