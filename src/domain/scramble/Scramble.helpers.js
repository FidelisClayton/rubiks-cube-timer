import when from 'crocks/logic/when'

import getRandomInt from '../../helpers/getRandomInt'

const moves = ["F", "R", "U", "B", "L", "D", "F2", "R2", "U2", "B2", "L2", "D2", "F'", "R'", "U'", "B'", "L'", "D'"]

export const isForbiddenMove = (currentMove) => (nextMove) => {
  if (!currentMove) return false

  const moveName = currentMove.replace(/['2]/g, '')
  const forbiddenMoves = [moveName, `${moveName}'`, `${moveName}2`]

  return forbiddenMoves.includes(nextMove)
}

export const hasCorrectSize = (array) => array.length === 20

export const getNextMove = (previousMove) => {
  const nextMove = moves[getRandomInt(moves.length)]
  const ensureItsValid = when(isForbiddenMove(previousMove), () => getNextMove(previousMove))

  return ensureItsValid(nextMove)
}