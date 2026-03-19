import React, { useState, useEffect } from 'react'

function About() {
  const [content, setContent] = useState(null)

  useEffect(() => {
    fetch('/data/content.json')
      .then(r => r.json())
      .then(setContent)
  }, [])

  return (
    <div className="container">
      <div id="philosophy">
        <h2>理念</h2>
        <p>{content?.about?.philosophy}</p>
      </div>
    </div>
  )
}

export default About
