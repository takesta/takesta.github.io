import React, { useState, useEffect } from 'react'

function ScheduleResults() {
  const [schedule, setSchedule] = useState(null)

  useEffect(() => {
    fetch('/data/schedule.json')
      .then(r => r.json())
      .then(setSchedule)
  }, [])

  if (!schedule) return <div className="container"><p>読み込み中...</p></div>

  return (
    <div className="container">
      <h2>試合日程・結果</h2>
      <h3>年間予定</h3>
      <ul>
        {schedule.map(({ month, events }) => (
          <li key={month}>
            {month}{events.length > 0 ? '\u3000\u3000' + events.join('、') : ''}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ScheduleResults
