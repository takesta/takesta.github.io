import React, { useState, useEffect } from 'react'

function Team() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/data/members.json')
      .then(r => r.json())
      .then(setData)
  }, [])

  if (!data) return <section id="team" className="container"><p>読み込み中...</p></section>

  const { captains, members } = data
  const years = ['4年', '3年', '2年', '1年']

  return (
    <section id="team" className="container">
      <h2>部員紹介</h2>

      {years.map(year => {
        const men = members.filter(m => m.year === year && m.gender === 'male')
        const women = members.filter(m => m.year === year && m.gender === 'female')
        if (men.length === 0 && women.length === 0) return null
        return (
          <div key={year} className="year-section">
            <h3>{year}</h3>

            <h4>男子</h4>
            {year === '4年' && (
              <>
                <h4><span className="captain-manager">主将 {captains.menCaptain}</span></h4>
                <h4><span className="captain-manager">主務 {captains.menManager}</span></h4>
              </>
            )}
            <div className="members-grid">
              {men.map((m, i) => (
                <div key={i} className="team-member-card"><p>{m.name}</p></div>
              ))}
            </div>

            <h4>女子</h4>
            {year === '4年' && (
              <>
                <h4><span className="captain-manager">主将 {captains.womenCaptain}</span></h4>
                <h4><span className="captain-manager">主務 {captains.womenManager}</span></h4>
              </>
            )}
            <div className="members-grid">
              {women.map((m, i) => (
                <div key={i} className="team-member-card"><p>{m.name}</p></div>
              ))}
            </div>
          </div>
        )
      })}
    </section>
  )
}

export default Team
