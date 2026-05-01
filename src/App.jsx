import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom'
import Home from './components/Home'
import Team from './components/Team'
import About from './components/About'
import ScheduleResults from './components/ScheduleResults'
import Prospective from './components/Prospective'
import Contact from './components/Contact'
import content from '../content/content.json'

function NavLinks({ items, onClick }) {
  return items.map(({ to, label }) => (
    <li key={to}>
      <Link to={to} onClick={onClick}>{label}</Link>
    </li>
  ))
}

function AppInner() {
  const { siteTitle, nav, footer, contact } = content
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navItems = [
    { to: '/', label: nav.home },
    { to: '/about', label: nav.about },
    { to: '/team', label: nav.team },
    { to: '/schedule-results', label: nav.schedule },
    { to: '/prospective', label: nav.prospective },
    { to: '/contact', label: nav.contact },
  ]

  return (
    <div className="App">
      <header className={`App-header${(scrolled || !isHome) ? ' scrolled' : ''}`}>
        <div className="container">
          <div className="logo">
            <h1><Link to="/">{siteTitle}</Link></h1>
          </div>

          {/* Desktop nav */}
          <nav className="nav-desktop">
            <ul>
              <NavLinks items={navItems} />
            </ul>
          </nav>

          {/* Hamburger button */}
          <button
            className={`hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        <nav>
          <ul>
            <NavLinks items={navItems} onClick={() => setMenuOpen(false)} />
          </ul>
        </nav>
      </div>
      {menuOpen && <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />}

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
                {navItems.map(({ to, label }) => (
                  <li key={to}><Link to={to}>{label}</Link></li>
                ))}
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
  )
}

function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  )
}

export default App
