import React, { useState, useEffect, useRef, useCallback } from 'react'
import { BrowserRouter as Router, Route, Routes, NavLink, useLocation } from 'react-router-dom'
import Home from './components/Home'
import Team from './components/Team'
import About from './components/About'
import ScheduleResults from './components/ScheduleResults'
import Prospective from './components/Prospective'
import Contact from './components/Contact'
import content from '../content/content.json'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

function NavLinks({ items, onClick }) {
  return items.map(({ to, label }) => (
    <li key={to}>
      <NavLink to={to} end={to === '/'} onClick={onClick}>
        {label}
      </NavLink>
    </li>
  ))
}

function AppInner() {
  const { siteTitle, nav, footer, contact } = content
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  const hamburgerRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 60)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Focus first element when menu opens; return focus to hamburger when it closes
  useEffect(() => {
    if (menuOpen && menuRef.current) {
      const first = menuRef.current.querySelector(FOCUSABLE_SELECTOR)
      first?.focus()
    }
  }, [menuOpen])

  // Focus trap + Escape key handler
  useEffect(() => {
    if (!menuOpen || !menuRef.current) return

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        hamburgerRef.current?.focus()
        return
      }
      if (e.key !== 'Tab') return

      const focusable = Array.from(menuRef.current.querySelectorAll(FOCUSABLE_SELECTOR))
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    hamburgerRef.current?.focus()
  }, [])

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
      <header className={`App-header${scrolled || !isHome ? ' scrolled' : ''}`}>
        <div className="container">
          <div className="logo">
            <h1>
              <NavLink to="/">{siteTitle}</NavLink>
            </h1>
          </div>

          {/* Desktop nav */}
          <nav className="nav-desktop" aria-label="メインナビゲーション">
            <ul>
              <NavLinks items={navItems} />
            </ul>
          </nav>

          {/* Hamburger button */}
          <button
            ref={hamburgerRef}
            className={`hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <nav
        id="mobile-menu"
        ref={menuRef}
        className={`mobile-menu${menuOpen ? ' open' : ''}`}
        aria-label="モバイルナビゲーション"
        aria-hidden={!menuOpen}
        inert={!menuOpen ? '' : undefined}
      >
        <ul>
          <NavLinks items={navItems} onClick={closeMenu} />
        </ul>
      </nav>
      {menuOpen && (
        <div
          className="mobile-overlay"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

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
                  <li key={to}>
                    <NavLink to={to} end={to === '/'}>
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-social">
              <h4>Follow Us</h4>
              <div className="footer-social-links">
                {contact.socialLinks.map((link) => (
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
