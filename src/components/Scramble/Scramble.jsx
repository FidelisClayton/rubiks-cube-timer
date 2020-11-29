import React from 'react'

import clsx from 'clsx'

import isArray from 'crocks/predicates/isArray'
import unit from 'crocks/helpers/unit'
import safe from 'crocks/Maybe/safe'
import either from 'crocks/pointfree/either'

import classes from './Scramble.module.scss'

const Scramble = ({ moves, className }) => {
  const safeMoves = safe(isArray, moves)

  const renderMove = (move, index) => <span key={index} className={classes.move}>{move}</span>

  const renderMoves = (moves) => moves.map(renderMove)

  return (
    <div className={clsx(classes.root, className)}>
      {either(unit, renderMoves)(safeMoves)}
    </div>
  )
}

export default Scramble