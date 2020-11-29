import React, { useEffect, useState } from 'react'

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

import isFalse from 'crocks/predicates/isFalse'
import isTrue from 'crocks/predicates/isTrue'

import equals from 'crocks/pointfree/equals'

import scrambleDomain from './domain/scramble'
import historyDomain from './domain/history'

import Timer from './components/Timer'
import ActionButton from './components/ActionButton'
import Scramble from './components/Scramble'
import HistoryTable from './components/HistoryTable'

import classes from './App.module.scss'
import subtract from './helpers/subtract'
import preventDefault from './helpers/preventDefault'
import booleanToEither from './helpers/booleanToEither'
import { isNotEmpty } from './helpers/predicates'

const getProp = getPropOr()

const setIntervalCurried = flip(binary(setInterval))

const isSpaceBarPressed = (event) => equals(32)(getProp('keyCode')(event))

const { Just, Nothing } = Maybe

function App() {
  const [history, setHistory] = useState(historyDomain.list())
  const [scramble, setScramble] = useState(scrambleDomain.generate([]))
  const [isPlaying, setIsPlaying] = useState(false)
  const [startTime, setStartTime] = useState(Nothing)
  const [endTime, setEndTime] = useState(Nothing)

  const handleStart = (event) => {
    event.preventDefault()

    const maybeNow = Just(Date.now())

    setIsPlaying(true)
    setStartTime(maybeNow)
    setEndTime(maybeNow)
  }

  const handleStop = (event) => {
    event.preventDefault()

    const maybeEndTime = Maybe.of(Date.now())

    setIsPlaying(false)
    setEndTime(maybeEndTime)
    setScramble(scrambleDomain.generate([]))

    Maybe
      .of(subtract)
      .ap(maybeEndTime)
      .ap(startTime)
      .map(historyDomain.save)
      .map(setHistory)
  }

  const handleKeyUp =
    when(
      isSpaceBarPressed,
      ifElse(constant(isPlaying), handleStop, handleStart)
    )

  const handleKeyDown =  when(isSpaceBarPressed, preventDefault)

  const renderScramble = () => <Scramble className={classes.scramble} moves={scramble} />

  const renderStartHelperText = () => (
    <span className={classes.helperText}>
      Or hold <code>space</code> then leave it to start.
    </span>
  )

  const renderStopHelperText = () => (
    <span className={classes.helperText}>
      Press <code>space</code> to stop the timer.
    </span>
  )

  const renderHelperText = () => ifElse(isTrue, renderStopHelperText, renderStartHelperText)(isPlaying)

  const renderHistoryTable = (history) => <HistoryTable history={history} />

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

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className={classes.root}>

      <main className={classes.main}>
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

        {renderHelperText()}
      </main>


      {when(isNotEmpty, renderHistoryTable)(history)}
    </div>
  );
}

export default App;
