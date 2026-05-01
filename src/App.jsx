import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import Home from './components/Home'
import Team from './components/Team'
import About from './components/About'
import ScheduleResults from './components/ScheduleResults'
import Prospective from './components/Prospective'
import Contact from './components/Contact'
import content from '../content/content.json'

function App() {
  const { siteTitle, nav, footer, contact } = content
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <Router>
      <div className="App">
        <header className={`App-header${scrolled ? ' scrolled' : ''}`}>
          <div className="container">
            <div className="logo">
              <h1><Link to="/">{siteTitle}</Link></h1>
            </div>
            <nav>
              <ul>
                <li><Link to="/">{nav.home}</Link></li>
                <li><Link to="/about">{nav.about}</Link></li>
                <li><Link to="/team">{nav.team}</Link></li>
                <li><Link to="/schedule-results">{nav.schedule}</Link></li>
                <li><Link to="/prospective">{nav.prospective}</Link></li>
                <li><Link to="/contact">{nav.contact}</Link></li>
              </ul>
            </nav>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
          <Route path="/schedule-results" element={<ScheduleResults />} />
          <Route path="/prospective" element={<Prospective />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>

        <footer>
          <div className="container">
            <div className="footer-grid">
              <div className="footer-brand">
                <h3>{siteTitle}</h3>
                <div className="footer-gold-line" />
                <p>1922年創部。日本最初の大学ゴルフ部として、技術の向上とゴルフ精神の涵養に励んでいます。</p>
              </div>

              <div className="footer-nav">
                <h4>Navigation</h4>
                <ul>
                  <li><Link to="/">{nav.home}</Link></li>
                  <li><Link to="/about">{nav.about}</Link></li>
                  <li><Link to="/team">{nav.team}</Link></li>
                  <li><Link to="/schedule-results">{nav.schedule}</Link></li>
                  <li><Link to="/prospective">{nav.prospective}</Link></li>
                  <li><Link to="/contact">{nav.contact}</Link></li>
                </ul>
              </div>

              <div className="footer-social">
                <h4>Follow Us</h4>
                <div className="footer-social-links">
                  {contact.socialLinks.map(link => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-social-link"
                    >
                      {link.label}：{link.handle}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <p>{footer.copyright}</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
