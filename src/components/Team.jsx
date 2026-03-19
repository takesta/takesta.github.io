import React, { useState, useEffect, useMemo } from 'react'

function Team() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/data/members.json')
      .then(r => r.json())
      .then(setData)
  }, [])

  const membersByYear = useMemo(() => {
    if (!data) return {}
    return data.members.reduce((acc, member) => {
      const { year } = member
      if (!acc[year]) acc[year] = { men: [], women: [] }
      if (member.gender === 'male') {
        acc[year].men.push(member)
      } else {
        acc[year].women.push(member)
      }
      return acc
    }, {})
  }, [data])

  const years = useMemo(
    () => Object.keys(membersByYear).sort((a, b) => parseInt(b) - parseInt(a)),
    [membersByYear]
  )

  const captains = data?.captains

  if (!data) return null

  return (
    <section id="team" className="container">
      <h2>部員紹介</h2>
      {years.map(year => (
        <div key={year} className="year-section">
          <h3>{year}</h3>
          <h4>男子</h4>
          {year === '3年' && captains && (
            <>
              <h4><span className="captain-manager">主将 {captains.menCaptain}</span></h4>
              <h4><span className="captain-manager">主務 {captains.menManager}</span></h4>
            </>
          )}
          <div className="members-grid">
            {membersByYear[year].men.map((member, i) => (
              <div key={i} className="team-member-card">
                <p>{member.name}</p>
              </div>
            ))}
          </div>
          <h4>女子</h4>
          {year === '3年' && captains && (
            <>
              <h4><span className="captain-manager">主将 {captains.womenCaptain}</span></h4>
              <h4><span className="captain-manager">主務 {captains.womenManager}</span></h4>
            </>
          )}
          <div className="members-grid">
            {membersByYear[year].women.map((member, i) => (
              <div key={i} className="team-member-card">
                <p>{member.name}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

export default Team
