import React from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import Home from './components/Home'
import Team from './components/Team'
import About from './components/About'
import ScheduleResults from './components/ScheduleResults'
import Prospective from './components/Prospective'
import Contact from './components/Contact'
import Admin from './components/Admin'

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="container">
            <div className="logo">
              <h1><Link to="/">慶應義塾體育會ゴルフ部</Link></h1>
            </div>
            <nav>
              <ul>
                <li><Link to="/">ホーム</Link></li>
                <li><Link to="/about">部について</Link></li>
                <li><Link to="/team">部員紹介</Link></li>
                <li><Link to="/schedule-results">試合日程・結果</Link></li>
                <li><Link to="/prospective">入部希望の方へ</Link></li>
                <li><Link to="/contact">お問い合わせ</Link></li>
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
          <Route path="/admin" element={<Admin />} />
        </Routes>

        <footer>
          <div className="container">
            <p>© 2026 慶應義塾體育會ゴルフ部</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
