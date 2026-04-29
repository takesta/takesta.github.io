import React from 'react'
import content from '../../content/content.json'

function ContactSection() {
  const { contact } = content
  return (
    <section id="contact">
      <h2>{contact.title}</h2>
      <p>{contact.description}</p>
      {contact.socialLinks.map(link => (
        <p key={link.url}>
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            {link.label}: {link.handle}
          </a>
        </p>
      ))}
    </section>
  )
}

export default ContactSection
