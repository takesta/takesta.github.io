import React, { useEffect } from 'react'
import ContactSection from './ContactSection'

function Contact() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.08 }
    )
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="container page-content">
      <div className="fade-up">
        <ContactSection />
      </div>
    </div>
  )
}

export default Contact
