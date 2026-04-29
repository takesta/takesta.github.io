import React from 'react'
import ContactSection from './ContactSection'
import content from '../../content/content.json'

function Home() {
  const { home } = content
  return (
    <div>
      <section className="hero">
        <div className="hero-text">
          <h2>{home.heroTitle}</h2>
          <p>{home.heroSubtitle}</p>
        </div>
      </section>

      <main className="container">
        <p>{home.description}</p>
        <ContactSection />
      </main>
    </div>
  )
}

export default Home
