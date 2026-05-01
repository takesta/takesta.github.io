import React, { useEffect } from 'react'
import content from '../../content/content.json'
import scheduleData from '../../content/schedule.json'

function ScheduleResults() {
  const { schedule: labels } = content
  const { schedule } = scheduleData

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.08 }
    )
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="container page-content">
      <div className="section-heading fade-up">
        <h2>{labels.title}</h2>
        <div className="section-heading-divider"><span /></div>
      </div>

      <div className="fade-up">
        <h3 style={{ color: 'var(--navy)', marginBottom: '1.5rem', fontSize: '1.1rem', letterSpacing: '0.05em' }}>
          {labels.annualHeading}
        </h3>
        <table className="schedule-table">
          <thead>
            <tr>
              <th>月</th>
              <th>試合・イベント</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map(({ month, events }) => (
              <tr key={month}>
                <td className="schedule-month">{month}</td>
                <td className="schedule-events">
                  {events.length > 0 ? events.join('、') : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ScheduleResults
