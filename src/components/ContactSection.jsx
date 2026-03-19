import React, { useState, useEffect } from 'react'

function ContactSection() {
  const [content, setContent] = useState(null)

  useEffect(() => {
    fetch('/data/content.json')
      .then(r => r.json())
      .then(setContent)
  }, [])

  const contact = content?.contact

  return (
    <section id="contact">
      <h2>お問い合わせ</h2>
      <p>{contact?.description ?? 'ご質問やご入部に関するお問い合わせは、InstagramのDMまでご連絡ください。'}</p>
      {contact?.socialLinks?.map(link => (
        <p key={link.label}>
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            {link.label}: {link.handle}
          </a>
        </p>
      ))}
    </section>
  )
}

export default ContactSection
