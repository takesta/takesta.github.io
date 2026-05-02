import React from 'react'
import { Helmet } from 'react-helmet-async'
import data from '../../content/prospective.json'
import ContactSection from './ContactSection'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

function Prospective() {
  useScrollAnimation(0.08)

  const helmetMeta = (
    <Helmet>
      <title>入部希望の方へ | 慶應義塾體育會ゴルフ部</title>
      <meta name="description" content="慶應義塾體育會ゴルフ部への入部案内。説明会情報・入部フローをご確認ください。" />
      <link rel="canonical" href="https://keiogolf.com/prospective" />
    </Helmet>
  )

  if (data.closed) {
    return (
      <div className="container page-content">
        {helmetMeta}
        <div className="section-heading fade-up">
          <h2>{data.pageTitle}</h2>
          <div className="section-heading-divider"><span /></div>
        </div>

        <div className="fade-up">
          <div className="info-box" style={{ textAlign: 'center', padding: '2.5rem 2rem' }}>
            <p style={{ fontSize: '1.15rem', fontWeight: '600', color: 'var(--navy)', marginBottom: '1rem' }}>
              {data.closedMessage}
            </p>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.95rem' }}>{data.closedNote}</p>
          </div>
        </div>

        <div className="fade-up" style={{ marginTop: '3rem' }}>
          <ContactSection />
        </div>
      </div>
    )
  }

  const { orientationSession, line } = data

  return (
    <div className="container page-content">
      {helmetMeta}
      <div className="section-heading fade-up">
        <h2>{data.pageTitle}</h2>
        <div className="section-heading-divider"><span /></div>
      </div>

      <div className="fade-up">
        <div className="description-block">{data.intro}</div>

        <div className="info-box">
          <p>
            <strong>{orientationSession.date}</strong>、{orientationSession.startTime}〜{orientationSession.endTime}に
            {orientationSession.format}にて入部説明会を開催いたします。
          </p>
          <p>
            参加希望の方はLINE公式アカウント「<strong>{line.accountName}</strong>」（LINE ID：{line.id}）を
            追加のうえ、<strong>{line.deadline}</strong>までに以下の項目をご送信ください。
          </p>
          <ul style={{ margin: '12px 0 0', paddingLeft: '1.4rem' }}>
            {data.requiredFields.map(field => (
              <li key={field} style={{ marginBottom: '4px' }}>{field}</li>
            ))}
          </ul>
        </div>

        <p style={{ color: 'var(--gray-600)', fontSize: '0.95rem' }}>{data.mandatoryNote}</p>
        <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', fontStyle: 'italic' }}>{data.formNote}</p>
      </div>

      <div className="fade-up">
        <h3 style={{ color: 'var(--navy)', fontSize: '1.2rem', margin: '3rem 0 1.5rem', letterSpacing: '0.04em' }}>
          {data.timelineHeading}
        </h3>
        <div className="timeline">
          {data.timeline.map((step, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-dot" />
              <p className="timeline-label">{step.label}</p>
              <p className="timeline-date">{step.date}</p>
              {step.time && <p className="timeline-date" style={{ color: 'var(--gray-600)', fontSize: '0.95rem' }}>{step.time}</p>}
              {step.note && <p className="timeline-note">※{step.note}</p>}
            </div>
          ))}
        </div>

        <div className="info-box" style={{ marginTop: '2rem' }}>
          <p>{data.closing}</p>
        </div>
      </div>
    </div>
  )
}

export default Prospective
