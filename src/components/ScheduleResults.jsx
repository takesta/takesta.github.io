import React, { useState, useEffect } from 'react'

function ScheduleResults() {
  const [schedule, setSchedule] = useState([])

  useEffect(() => {
    fetch('/data/schedule.json')
      .then(r => r.json())
      .then(setSchedule)
  }, [])

  return (
    <div className="container">
      <h2>試合日程・結果</h2>
      <h3>年間予定</h3>
      <ul>
        {schedule.map(item => (
          <li key={item.month}>
            {item.month}{item.events.length > 0 ? `　　${item.events.join('、')}` : ''}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ScheduleResults
