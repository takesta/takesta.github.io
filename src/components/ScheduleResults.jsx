import React from 'react'
import content from '../../content/content.json'
import scheduleData from '../../content/schedule.json'

function ScheduleResults() {
  const { schedule: labels } = content
  const { schedule } = scheduleData

  return (
    <div className="container">
      <h2>{labels.title}</h2>
      <h3>{labels.annualHeading}</h3>
      <ul>
        {schedule.map(({ month, events }) => (
          <li key={month}>
            {month}{events.length > 0 ? '　　' + events.join('、') : ''}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ScheduleResults
