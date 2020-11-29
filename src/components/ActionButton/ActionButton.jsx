import React from 'react'

import ifElse from 'crocks/logic/ifElse'
import isTrue from 'crocks/predicates/isTrue'

import classes from './ActionButton.module.scss'

const ActionButton = ({ isPlaying, onStart, onStop }) => {
  const renderStart = () => <button className={classes.root} onClick={onStart}>Start</button>
  const renderStop = () => <button className={classes.root} onClick={onStop}>Stop</button>
  
  return ifElse(isTrue, renderStop, renderStart)(isPlaying)
}

export default ActionButton