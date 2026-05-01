import React, { useEffect } from 'react'
import content from '../../content/content.json'

function About() {
  const { about } = content

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="container page-content">
      <section id="philosophy" className="fade-up">
        <div className="section-heading">
          <h2>{about.title}</h2>
          <div className="section-heading-divider"><span /></div>
        </div>
        <div className="description-block">
          {about.philosophy}
        </div>
      </section>
    </div>
  )
}

export default About
