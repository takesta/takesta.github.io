import React from 'react'
import { Helmet } from 'react-helmet-async'
import content from '../../content/content.json'
import scheduleData from '../../content/schedule.json'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

function ScheduleResults() {
  const { schedule: labels } = content
  const { schedule } = scheduleData
  useScrollAnimation(0.08)

  return (
    <div className="container page-content">
      <Helmet>
        <title>年間スケジュール | 慶應義塾體育會ゴルフ部</title>
        <meta name="description" content="慶應義塾體育會ゴルフ部の年間試合スケジュール・結果一覧です。" />
        <link rel="canonical" href="https://keiogolf.com/schedule-results" />
      </Helmet>
      <div className="section-heading fade-up">
        <h2>{labels.title}</h2>
        <div className="section-heading-divider"><span /></div>
      </div>

      <div className="fade-up">
        <h3 style={{ color: 'var(--navy)', marginBottom: '1.5rem', fontSize: '1.1rem', letterSpacing: '0.05em' }}>
          {labels.annualHeading}
        </h3>
        <div className="schedule-table-wrapper">
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
    </div>
  )
}

export default ScheduleResults
