import React, { useState, useEffect } from 'react'
import ContactSection from './ContactSection'

function Home() {
  const [content, setContent] = useState(null)

  useEffect(() => {
    fetch('/data/content.json')
      .then(r => r.json())
      .then(setContent)
  }, [])

  const home = content?.home

  return (
    <div>
      <section className="hero">
        <div className="hero-text">
          <h2>{home?.heroTitle ?? '慶應義塾體育會ゴルフ部'}</h2>
          <p>{home?.heroSubtitle ?? 'KEIO UNIVERSITY GOLF TEAM'}</p>
        </div>
      </section>

      <main className="container">
        <p>{home?.description}</p>
        <ContactSection />
      </main>
    </div>
  )
}

export default Home
