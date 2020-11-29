import safe from 'crocks/Maybe/safe'
import isDate from 'crocks/predicates/isDate'
import ifElse from 'crocks/logic/ifElse'
import identity from 'crocks/combinators/identity'
import constant from 'crocks/combinators/constant'

import Result from 'crocks/Result'

const { Ok, Err } = Result

const format = (date) => {
  const invalidErr = constant(Err('Invalid date'))

  const safeDate =
    ifElse(isDate, Ok, invalidErr)(new Date(date))

  const format = (date) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`
  }

  return safeDate
    .either(identity, format)
}

export default {
  format
}