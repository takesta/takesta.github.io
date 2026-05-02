import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import ContactSection from './ContactSection'
import content from '../../content/content.json'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

function Home() {
  const { home, about } = content
  useScrollAnimation()

  useEffect(() => {
    const heroImg = document.querySelector('.hero-bg')
    if (!heroImg) return

    const update = () => {
      const progress = Math.min(window.scrollY / window.innerHeight, 1)
      const scale = 1.12 - 0.12 * progress
      heroImg.style.transform = `scale(${scale})`
    }

    update()

    let raf = null
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        update()
        raf = null
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
      heroImg.style.transform = ''
    }
  }, [])

  return (
    <div>
      <Helmet>
        <title>慶應義塾體育會ゴルフ部 公式サイト</title>
        <meta name="description" content="慶應義塾體育會ゴルフ部の公式サイトです。1922年創部。試合結果、部員紹介、入部案内はこちらをご覧ください。" />
        <link rel="canonical" href="https://keiogolf.com/" />
      </Helmet>
      <section className="hero page-content-hero">
        <picture>
          <source
            type="image/webp"
            srcSet="/assets/hero-image-768.webp 768w, /assets/hero-image-1280.webp 1280w, /assets/hero-image-1920.webp 1920w"
            sizes="100vw"
          />
          <img
            src="/assets/hero-image-1920.jpg"
            alt=""
            className="hero-bg"
            width="1920"
            height="1280"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="hero-text">
          <p className="hero-eyebrow">Since 1922</p>
          <h2>{home.heroTitle}</h2>
          <div className="hero-gold-line" />
          <p>{home.heroSubtitle}</p>
        </div>
        <div className="scroll-indicator">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      <main>
        <div className="container">
          <section className="fade-up">
            <div className="section-heading">
              <h2>{about.title}</h2>
              <div className="section-heading-divider"><span /></div>
            </div>
            <div className="description-block">
              {home.description}
            </div>
          </section>

          <section className="fade-up">
            <ContactSection />
          </section>
        </div>
      </main>
    </div>
  )
}

export default Home
