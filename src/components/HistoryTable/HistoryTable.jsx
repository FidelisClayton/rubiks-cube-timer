import React from 'react'

import msToSeconds from '../../helpers/msToSeconds'
import date from '../../helpers/date'

import classes from './HistoryTable.module.scss'

const HistoryTable = ({ history }) => {
  const renderHistoryItem = (item, index) => (
    <tr key={index}>
      <td className={classes.date}>{date.format(item.date)}</td>
      <td className={classes.time}>{msToSeconds(item.time)}s</td>
    </tr>
  )

  return (
    <div className={classes.root}>
      <h2 className={classes.title}>History</h2>

      <table className={classes.table}>
        <thead>
          <tr>
            <th className={classes.date}>Date</th>
            <th className={classes.time}>Time</th>
          </tr>
        </thead>
  
        <tbody>
          {history.map(renderHistoryItem)}
        </tbody>
      </table>
    </div>
  )
}

export default HistoryTable