import React from 'react'

import clsx from 'clsx'

import isArray from 'crocks/predicates/isArray'
import unit from 'crocks/helpers/unit'
import map from 'crocks/pointfree/map'
import safe from 'crocks/Maybe/safe'
import either from 'crocks/pointfree/either'

import classes from './Scramble.module.scss'

const Scramble = ({ moves, className }) => {
  const safeMoves = safe(isArray, moves)

  const renderMove = (move) => <span className={classes.move}>{move}</span>

  return (
    <div className={clsx(classes.root, className)}>
      {either(unit, map(renderMove))(safeMoves)}
    </div>
  )
}

export default Scramble