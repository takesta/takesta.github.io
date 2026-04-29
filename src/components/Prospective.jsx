import React from 'react'
import data from '../../content/prospective.json'

function Prospective() {
  const { orientationSession, line } = data
  return (
    <div className="container">
      <h2>{data.pageTitle}</h2>

      <p>{data.intro}</p>

      <p>
        {orientationSession.date}
        {orientationSession.startTime}から{orientationSession.endTime}にかけて、
        {orientationSession.format}にて入部説明会を開催いたします。
      </p>

      <p>
        説明会への参加を希望される方は、LINE公式アカウント「{line.accountName}」（LINE ID：{line.id}）を
        追加のうえ、{line.deadline}までに以下の項目をご送信ください。
      </p>
      <ul>
        {data.requiredFields.map(field => (
          <li key={field}>{field}</li>
        ))}
      </ul>

      <p>{data.mandatoryNote}</p>

      <p>{data.formNote}</p>

      <h3>{data.timelineHeading}</h3>
      {data.timeline.map((step, i) => (
        <p key={i}>
          <strong>{step.label}</strong><br />
          {step.date}
          {step.time && <><br />{step.time}</>}
          {step.note && <><br />※{step.note}</>}
        </p>
      ))}

      <p>{data.closing}</p>
    </div>
  )
}

export default Prospective
