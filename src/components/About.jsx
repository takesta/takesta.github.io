import React from 'react'
import { Helmet } from 'react-helmet-async'
import content from '../../content/content.json'
import scheduleData from '../../content/schedule.json'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

function About() {
  const { about, schedule: labels } = content
  const { schedule } = scheduleData
  useScrollAnimation()

  return (
    <div className="container page-content">
      <Helmet>
        <title>部について | 慶應義塾體育會ゴルフ部</title>
        <meta name="description" content="慶應義塾體育會ゴルフ部の理念と活動方針。1922年創部、関東大学対抗戦Aブロック復帰を目指して日々精進しています。" />
        <link rel="canonical" href="https://keiogolf.com/about" />
      </Helmet>
      <section id="philosophy" className="fade-up">
        <div className="section-heading">
          <h2>{about.title}</h2>
          <div className="section-heading-divider"><span /></div>
        </div>
        <div className="description-block">
          {about.philosophy}
        </div>
      </section>

      <section id="schedule" className="fade-up" style={{ marginTop: '3rem' }}>
        <div className="section-heading">
          <h2>{labels.title}</h2>
          <div className="section-heading-divider"><span /></div>
        </div>
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
      </section>
    </div>
  )
}

export default About
