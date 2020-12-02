import React from 'react'

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
import { isNotEmpty } from './helpers/predicates'

function App() {
  const {
    history,
    scramble,
    isPlaying,
    startTime,
    endTime,
    handleStop,
    handleStart,
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
