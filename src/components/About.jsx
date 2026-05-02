import React from 'react'
import { Helmet } from 'react-helmet-async'
import content from '../../content/content.json'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

function About() {
  const { about } = content
  useScrollAnimation()

  return (
    <div className="container page-content">
      <Helmet>
        <title>部について | 慶應義塾體育會ゴルフ部</title>
        <meta name="description" content="慶應義塾體育會ゴルフ部の理念と活動方針。1922年創部、関東大学対抗戦Aブロック復帰を目指して日々精進しています。" />
        <link rel="canonical" href="https://keiogolf.com/about" />
      </Helmet>
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
