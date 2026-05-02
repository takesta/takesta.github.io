import React, { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import content from '../../content/content.json'
import membersData from '../../content/members.json'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const YEARS = ['4年', '3年', '2年', '1年']

function normalize(name) {
  return name.replace(/\s/g, '')
}

function Team() {
  const { team } = content
  const { captains } = membersData

  useScrollAnimation(0.08)

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
    <section id="team" className="container page-content">
      <Helmet>
        <title>部員紹介 | 慶應義塾體育會ゴルフ部</title>
        <meta name="description" content="慶應義塾體育會ゴルフ部の部員紹介。男子・女子、各学年の部員一覧です。" />
        <link rel="canonical" href="https://keiogolf.com/team" />
      </Helmet>
      <div className="section-heading fade-up">
        <h2>{team.title}</h2>
        <div className="section-heading-divider"><span /></div>
      </div>

      {YEARS.map(year => {
        const { male: men, female: women } = grouped[year]
        if (men.length === 0 && women.length === 0) return null
        return (
          <div key={year} className="year-section fade-up">
            <div className="year-badge">
              <span className="year-badge-label">{year}</span>
              <div className="year-badge-line" />
            </div>

            {men.length > 0 && (
              <div className="gender-section">
                <div className="gender-label">{team.menLabel}</div>
                <div className="members-grid">
                  {men.map((m, i) => <MemberCard key={i} m={m} />)}
                </div>
              </div>
            )}

            {women.length > 0 && (
              <div className="gender-section">
                <div className="gender-label">{team.womenLabel}</div>
                <div className="members-grid">
                  {women.map((m, i) => <MemberCard key={i} m={m} />)}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </section>
  )
}

export default Team
