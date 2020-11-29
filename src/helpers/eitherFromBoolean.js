import { Right, Left } from 'crocks/Either'

import isTrue from 'crocks/predicates/isTrue'
import isBoolean from 'crocks/predicates/isBoolean'
import ifElse from 'crocks/logic/ifElse'

const eitherFromBoolean =
  ifElse(isBoolean, ifElse(isTrue, Right, Left), Left)

export default eitherFromBoolean