import React, { useEffect, useRef } from 'react'
import ContactSection from './ContactSection'
import content from '../../content/content.json'

function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.12 }
    )
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

function Home() {
  const { home, about } = content
  useScrollAnimation()

  return (
    <div>
      <section className="hero page-content-hero">
        <div className="hero-text">
          <p className="hero-eyebrow">Since 1922</p>
          <h2>{home.heroTitle}</h2>
          <div className="hero-gold-line" />
          <p>{home.heroSubtitle}</p>
        </div>
        <div className="scroll-indicator">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      <main>
        <div className="container">
          <section className="fade-up">
            <div className="section-heading">
              <h2>{about.title}</h2>
              <div className="section-heading-divider"><span /></div>
            </div>
            <div className="description-block">
              {home.description}
            </div>
          </section>

          <section className="fade-up">
            <ContactSection />
          </section>
        </div>
      </main>
    </div>
  )
}

export default Home
