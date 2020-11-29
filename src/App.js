import React, { useEffect } from 'react'

import Maybe from 'crocks/Maybe'

import constant from 'crocks/combinators/constant'
import flip from 'crocks/combinators/flip'
import applyTo from 'crocks/combinators/applyTo'
import pipe from 'crocks/helpers/pipe'
import binary from 'crocks/helpers/binary'
import unit from 'crocks/helpers/unit'
import ifElse from 'crocks/logic/ifElse'
import when from 'crocks/logic/when'
import isFalse from 'crocks/predicates/isFalse'
import isTrue from 'crocks/predicates/isTrue'

import Timer from './components/Timer'
import ActionButton from './components/ActionButton'
import Scramble from './components/Scramble'
import HistoryTable from './components/HistoryTable'

import classes from './App.module.scss'
import useTimer from './hooks/useTimer'
import booleanToEither from './helpers/booleanToEither'
import { isNotEmpty } from './helpers/predicates'

const setIntervalCurried = flip(binary(setInterval))

function App() {
  const {
    history,
    scramble,
    isPlaying,
    startTime,
    endTime,
    setEndTime,
    handleStop,
    handleStart,
    handleKeyDown,
    handleKeyUp,
  } = useTimer()

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
