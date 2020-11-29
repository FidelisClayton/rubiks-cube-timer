import ifElse from 'crocks/logic/ifElse'
import when from 'crocks/logic/when'
import identity from 'crocks/combinators/identity'

const moves = ["F", "R", "U", "B", "L", "D", "F2", "R2", "U2", "B2", "L2", "D2", "F'", "R'", "U'", "B'", "L'", "D'"]

const isForbiddenMove = (currentMove) => (nextMove) => {
  if (!currentMove) return false

  const moveName = currentMove.replace(/['2]/g, '')
  const forbiddenMoves = [moveName, `${moveName}'`, `${moveName}2`]

  return forbiddenMoves.includes(nextMove)
}

const hasCorrectSize = (array) => array.length === 20

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max))
}

const getNextMove = (previousMove) => {
  const nextMove = moves[getRandomInt(moves.length)]
  const ensureItsValid = when(isForbiddenMove(previousMove), () => getNextMove(previousMove))

  return ensureItsValid(nextMove)
}

const makeScramble = (currentScramble = []) => {
  const [lastMove] = [...currentScramble].reverse()
  const nextMove = getNextMove(lastMove)

  const newCurrentScramble = [...currentScramble, nextMove]

  const ensureSize = ifElse(hasCorrectSize, identity, makeScramble)

  return ensureSize(newCurrentScramble)
}

export default makeScramble