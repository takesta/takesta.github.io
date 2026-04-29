import React, { useMemo } from 'react'
import content from '../../content/content.json'
import membersData from '../../content/members.json'

const YEARS = ['4年', '3年', '2年', '1年']

function Team() {
  const { team } = content
  const { captains } = membersData

  const grouped = useMemo(() => {
    const map = {}
    for (const year of YEARS) map[year] = { male: [], female: [] }
    for (const m of membersData.members) {
      const bucket = map[m.year]
      if (bucket && bucket[m.gender]) bucket[m.gender].push(m)
    }
    return map
  }, [])

  return (
    <section id="team" className="container">
      <h2>{team.title}</h2>

      {YEARS.map(year => {
        const { male: men, female: women } = grouped[year]
        if (men.length === 0 && women.length === 0) return null
        return (
          <div key={year} className="year-section">
            <h3>{year}</h3>

            <h4>{team.menLabel}</h4>
            {year === '4年' && (
              <>
                <h4><span className="captain-manager">{team.captainLabel} {captains.menCaptain}</span></h4>
                <h4><span className="captain-manager">{team.viceCaptainLabel} {captains.menViceCaptain}</span></h4>
                <h4><span className="captain-manager">{team.managerLabel} {captains.menManager}</span></h4>
              </>
            )}
            <div className="members-grid">
              {men.map((m, i) => (
                <div key={i} className="team-member-card"><p>{m.name}</p></div>
              ))}
            </div>

            <h4>{team.womenLabel}</h4>
            {year === '4年' && (
              <>
                <h4><span className="captain-manager">{team.captainLabel} {captains.womenCaptain}</span></h4>
                <h4><span className="captain-manager">{team.viceCaptainLabel} {captains.womenViceCaptain}</span></h4>
                <h4><span className="captain-manager">{team.managerLabel} {captains.womenManager}</span></h4>
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
