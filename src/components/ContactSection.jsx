import React from 'react'
import content from '../../content/content.json'

function ContactSection() {
  const { contact } = content
  return (
    <section id="contact">
      <div className="section-heading">
        <h2>{contact.title}</h2>
        <div className="section-heading-divider"><span /></div>
      </div>
      <p style={{ textAlign: 'center', color: 'var(--gray-600)', marginBottom: '2rem' }}>
        {contact.description}
      </p>
      <div className="social-links">
        {contact.socialLinks.map(link => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link-card"
          >
            <span className="social-link-label">{link.label}</span>
            <span className="social-link-handle">{link.handle}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

export default ContactSection
