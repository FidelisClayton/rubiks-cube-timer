import ifElse from 'crocks/logic/ifElse'
import identity from 'crocks/combinators/identity'

import { getNextMove, hasCorrectSize } from './Scramble.helpers'

export const generate = (currentScramble = []) => {
  const [lastMove] = [...currentScramble].reverse()
  const nextMove = getNextMove(lastMove)

  const newScramble = [...currentScramble, nextMove]

  const ensureSize = ifElse(hasCorrectSize, identity, generate)

  return ensureSize(newScramble)
}