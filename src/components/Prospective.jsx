import React, { useState, useEffect } from 'react'

function Prospective() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/data/prospective.json')
      .then(r => r.json())
      .then(setData)
  }, [])

  if (!data) return null

  const { year, orientationSession, line, requiredFields, timeline } = data

  return (
    <div className="container">
      <h2>{year}年度 新歓のお知らせ</h2>

      <p>
        慶應義塾體育會ゴルフ部では、{year}年度の新入部員を募集しております。
        ゴルフ経験者はもちろん、大学からゴルフを始めたい方のご参加も歓迎いたします。
      </p>

      <p>
        {orientationSession.date}{orientationSession.startTime}から{orientationSession.endTime}にかけて、
        {orientationSession.format}にて入部説明会を開催いたします。
      </p>

      <p>
        説明会への参加を希望される方は、LINE公式アカウント「{line.accountName}」（LINE ID：{line.id}）を
        追加のうえ、{line.deadline}までに以下の項目をご送信ください。
      </p>
      <ul>
        {requiredFields.map(field => (
          <li key={field}>{field}</li>
        ))}
      </ul>

      <p>
        なお、入部を希望される方は入部説明会への参加が必須となります。
        やむを得ず説明会に参加できない場合は、別日程での対応を検討いたしますので、その旨を必ずご連絡ください。
      </p>

      <p>※説明会のZoom URLは、LINE公式アカウントを通じてご案内いたします。</p>

      <h3>入部までの流れ</h3>
      {timeline.map(step => (
        <p key={step.label}>
          <strong>{step.label}</strong><br />
          {step.date}
          {step.time && <><br />{step.time}</>}
          {step.note && <><br />※{step.note}</>}
        </p>
      ))}

      <p>
        ご不明点やご質問等がございましたら、LINE公式アカウントまたはInstagramのDMよりお気軽にお問い合わせください。
      </p>
    </div>
  )
}

export default Prospective
