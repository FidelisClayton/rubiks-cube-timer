import React from 'react'

import Maybe from 'crocks/Maybe'
import unit from 'crocks/helpers/unit'
import clsx from 'clsx'

import classes from './Timer.module.scss'
import subtract from '../../helpers/subtract'
import msToSeconds from '../../helpers/msToSeconds'

const { Nothing } = Maybe

const Timer = ({
  isPlaying,
  startTime = Nothing,
  endTime = Nothing,
  className,
}) => {
  const time = 
    Maybe
      .of(subtract)
      .ap(endTime)
      .ap(startTime)
      .map(msToSeconds)
      .either(unit, (time) => <span>{time.toFixed(2).padStart(5, '0')}</span>)
  
  return (
    <div className={clsx(classes.root, className)}>
      {time}
    </div>
  )
}

export default Timer