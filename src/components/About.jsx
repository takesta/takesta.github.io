import React from 'react'
import content from '../../content/content.json'

function About() {
  const { about } = content
  return (
    <div className="container">
      <div id="philosophy">
        <h2>{about.title}</h2>
        <p>{about.philosophy}</p>
      </div>
    </div>
  )
}

export default About
