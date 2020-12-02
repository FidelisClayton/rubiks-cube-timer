import { useState, useEffect } from 'react'

import Maybe from 'crocks/Maybe'

import constant from 'crocks/combinators/constant'
import flip from 'crocks/combinators/flip'
import applyTo from 'crocks/combinators/applyTo'

import pipe from 'crocks/helpers/pipe'
import binary from 'crocks/helpers/binary'
import unit from 'crocks/helpers/unit'

import ifElse from 'crocks/logic/ifElse'
import when from 'crocks/logic/when'

import propEq from 'crocks/predicates/propEq'

import scrambleDomain from '../domain/scramble'
import historyDomain from '../domain/history'

import subtract from '../helpers/subtract'
import preventDefault from '../helpers/preventDefault'
import booleanToEither from '../helpers/booleanToEither'

const setIntervalCurried = flip(binary(setInterval))

const isSpaceBarPressed = propEq('keyCode', 32)

const { Just } = Maybe

const maybeInitialTime = Maybe.of(Date.now())

const useTimer = () => {
  const [history, setHistory] = useState(historyDomain.list())
  const [scramble, setScramble] = useState(scrambleDomain.generate([]))
  const [isPlaying, setIsPlaying] = useState(false)
  const [startTime, setStartTime] = useState(maybeInitialTime)
  const [endTime, setEndTime] = useState(maybeInitialTime)

  const handleStart = () => {
    const maybeNow = Just(Date.now())

    setIsPlaying(true)
    setStartTime(maybeNow)
    setEndTime(maybeNow)
  }

  const handleStop = () => {
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

  const handleKeyUp = when(isSpaceBarPressed, ifElse(constant(isPlaying), handleStop, handleStart))
  const handleKeyDown =  when(isSpaceBarPressed, preventDefault)

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

  return {
    history,
    scramble,
    isPlaying,
    setIsPlaying,
    startTime,
    endTime,
    handleStart,
    handleStop,
  }
}

export default useTimer