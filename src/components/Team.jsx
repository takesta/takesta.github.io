import React, { useMemo } from 'react'
import content from '../../content/content.json'
import membersData from '../../content/members.json'

const YEARS = ['4年', '3年', '2年', '1年']

function normalize(name) {
  return name.replace(/\s/g, '')
}

function Team() {
  const { team } = content
  const { captains } = membersData

  const titleMap = useMemo(() => {
    const map = {}
    map[normalize(captains.menCaptain)] = team.captainLabel
    map[normalize(captains.menViceCaptain)] = team.viceCaptainLabel
    map[normalize(captains.menManager)] = team.managerLabel
    map[normalize(captains.womenCaptain)] = team.captainLabel
    map[normalize(captains.womenViceCaptain)] = team.viceCaptainLabel
    map[normalize(captains.womenManager)] = team.managerLabel
    return map
  }, [captains, team])

  const grouped = useMemo(() => {
    const map = {}
    for (const year of YEARS) map[year] = { male: [], female: [] }
    for (const m of membersData.members) {
      const bucket = map[m.year]
      if (bucket && bucket[m.gender]) bucket[m.gender].push(m)
    }
    return map
  }, [])

  function MemberCard({ m }) {
    const title = titleMap[normalize(m.name)]
    return (
      <div className="team-member-card">
        <div className="member-photo-wrap">
          {m.photo
            ? <img src={`/assets/members/${m.photo}`} alt={m.name} className="member-photo" />
            : <div className="member-photo-placeholder" />
          }
        </div>
        {title && <span className="member-title-badge">{title}</span>}
        <p className="member-name">{m.name}</p>
      </div>
    )
  }

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
            <div className="members-grid">
              {men.map((m, i) => <MemberCard key={i} m={m} />)}
            </div>

            <h4>{team.womenLabel}</h4>
            <div className="members-grid">
              {women.map((m, i) => <MemberCard key={i} m={m} />)}
            </div>
          </div>
        )
      })}
    </section>
  )
}

export default Team
