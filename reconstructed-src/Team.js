import React, { useMemo } from 'react';
import { members } from './members';
import './Team.css';

function Team() {
  const membersByYear = useMemo(() => members.reduce((acc, member) => {
    const { year } = member;
    if (!acc[year]) {
      acc[year] = { men: [], women: [] };
    }
    if (member.gender === 'male') {
      acc[year].men.push(member);
    } else {
      acc[year].women.push(member);
    }
    return acc;
  }, {}), []);

  const years = useMemo(
    () => Object.keys(membersByYear).sort((a, b) => parseInt(b) - parseInt(a)),
    [membersByYear]
  );

  return (
    <section id="team" className="container">
      <h2>部員紹介</h2>
      {years.map(year => (
        <div key={year} className="year-section">
          <h3>{year}</h3>
          <h4>男子</h4>
          {year === '3年' && (
            <><h4><span className="captain-manager">主将 伊藤優希</span></h4><h4><span className="captain-manager">主務 相山武仁</span></h4></>
          )}
          
          <div className="team-grid">
            <div className="members-grid">
              {membersByYear[year].men.map((member, index) => (
                <div key={index} className="team-member-card">
                  <p>{member.name}</p>
                </div>
              ))}
            </div>
            <h4>女子</h4>
            {year === '3年' && (
              <><h4><span className="captain-manager">主将 林真衣</span></h4><h4><span className="captain-manager">主務 塩田瞳子</span></h4></>
            )}
            
            <div className="members-grid">
              {membersByYear[year].women.map((member, index) => (
                <div key={index} className="team-member-card">
                  <p>{member.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

export default Team;