import React from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import Home from './components/Home'
import Team from './components/Team'
import About from './components/About'
import ScheduleResults from './components/ScheduleResults'
import Prospective from './components/Prospective'
import Contact from './components/Contact'
import content from '../content/content.json'

function App() {
  const { siteTitle, nav, footer } = content
  return (
    <Router>
      <div className="App">
        <header className="App-header">
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
            <p>{footer.copyright}</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
