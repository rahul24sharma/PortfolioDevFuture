import { lazy, Suspense, useEffect, useId, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { HeroTerminal } from './components/HeroTerminal'
import { CommandPalette } from './components/CommandPalette'
import { InsightsSection } from './components/InsightsSection'
import { ReadingProgressHud } from './components/ReadingProgressHud'
import { StatusStrip } from './components/StatusStrip'
import { IconArrowUpRight, IconGithub, IconGlobe, IconLinkedIn } from './components/ContactIcons'
import { useAppPreferences } from './contexts/AppPreferencesContext.jsx'
import { portfolioData as D } from './data/portfolioData'
import './App.css'

const HeroCanvas = lazy(() => import('./components/HeroCanvas'))

function CanvasFallback() {
  const { resolvedTheme } = useAppPreferences()
  const isLight = resolvedTheme === 'light'
  const background = isLight
    ? 'radial-gradient(ellipse 80% 60% at 55% 40%, rgba(37, 99, 235, 0.18), transparent 55%), radial-gradient(circle at 80% 20%, rgba(34, 211, 238, 0.08), transparent 40%), #f1f5f9'
    : 'radial-gradient(ellipse 80% 60% at 55% 40%, rgba(37, 99, 235, 0.3), transparent 55%), radial-gradient(circle at 80% 20%, rgba(34, 211, 238, 0.14), transparent 40%), #020617'
  return (
    <div
      className="hero-fallback hero-fallback--loading"
      role="status"
      aria-live="polite"
      aria-busy="true"
      style={{
        position: 'absolute',
        inset: 0,
        background,
      }}
    >
      <span className="visually-hidden">Loading hero scene</span>
      <div className="hero-canvas-loader" aria-hidden>
        <span className="hero-canvas-loader__ring" />
        <span className="hero-canvas-loader__label">Loading scene…</span>
      </div>
    </div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  }),
}

const wordReveal = {
  hidden: { opacity: 0, y: 32, rotateX: -22 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: 0.055 * (typeof custom === 'number' ? custom : 0),
      duration: 0.58,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

function WordLine({ words, className, startIndex = 0 }) {
  const reduce = useReducedMotion()
  const variants = reduce
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, y: 0, rotateX: 0 },
      }
    : wordReveal

  return (
    <span className={`word-line ${className || ''}`.trim()}>
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          className="word-line__word"
          initial="hidden"
          animate="visible"
          variants={variants}
          custom={startIndex + i}
        >
          {w}
        </motion.span>
      ))}
    </span>
  )
}

/** Graceful placeholder when `/public/images/...` is missing or fails to load (e.g. before deploy). */
function ProjectCardThumb({ src }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return <div className="project-card__image project-card__image--fallback" aria-hidden />
  }
  return (
    <img
      src={src}
      alt=""
      className="project-card__image"
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}

const marqueeItems = [...D.loadingMarquee, ...D.loadingMarquee]

/** Tighter `amount` + margin = fewer observer callbacks; `once` avoids repeat work. */
const VIEWPORT_REVEAL = { once: true, amount: 0.12, margin: '-48px 0px' }

const NAV_SECTIONS = [
  { href: '#about', label: 'About' },
  { href: '#work', label: 'Work' },
  { href: '#what-i-do', label: 'What I do' },
  { href: '#career', label: 'Career' },
  { href: '#insights', label: 'Craft' },
  { href: '#contact', label: 'Contact' },
]

function NavPrefs() {
  const { cycleTheme, themeMode, simpleMode, toggleSimpleMode } = useAppPreferences()
  const themeLabel =
    themeMode === 'system' ? 'System theme' : themeMode === 'light' ? 'Light theme' : 'Dark theme'

  return (
    <div className="top-nav__prefs">
      <button
        type="button"
        className="nav-pref-btn"
        onClick={cycleTheme}
        title={`${themeLabel} — click to cycle`}
        aria-label={`${themeLabel}. Click to cycle system, light, and dark.`}
      >
        <span className="nav-pref-btn__glyph" aria-hidden>
          {themeMode === 'light' ? '☀' : themeMode === 'dark' ? '☽' : '◐'}
        </span>
      </button>
      <button
        type="button"
        className={`nav-pref-btn ${simpleMode ? 'nav-pref-btn--active' : ''}`}
        onClick={toggleSimpleMode}
        title="Simple mode: static hero, lighter motion"
        aria-pressed={simpleMode}
        aria-label={
          simpleMode
            ? 'Simple mode on. Click to restore full visuals.'
            : 'Simple mode off. Click for static hero and lighter motion.'
        }
      >
        <span className="nav-pref-btn__glyph" aria-hidden>
          Aa
        </span>
      </button>
    </div>
  )
}

function App() {
  const mobileNavId = useId()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    document.title = D.siteTitle
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', D.metaDescription)
  }, [])

  useEffect(() => {
    if (!mobileNavOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileNavOpen])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMobileNavOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const reduceMotion = useReducedMotion()
  const hero = D.hero
  const closeMobileNav = () => setMobileNavOpen(false)

  return (
    <div className="shell">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <motion.header
        className="top-nav"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <a href="#main" className="brand">
          <span className="brand-initials" aria-hidden>
            {D.navbar.initials}
          </span>
          <span className="brand-name">{D.navbar.nameShort}</span>
        </a>
        <nav className="nav-links" aria-label="Primary">
          {NAV_SECTIONS.map(({ href, label }) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="top-nav__end">
          <div className="top-nav__prefs top-nav__prefs--header">
            <NavPrefs />
          </div>
          <button
            type="button"
            className="nav-mobile-toggle"
            aria-expanded={mobileNavOpen}
            aria-controls={mobileNavId}
            id={`${mobileNavId}-toggle`}
            onClick={() => setMobileNavOpen((o) => !o)}
          >
            <span className="visually-hidden">{mobileNavOpen ? 'Close menu' : 'Open menu'}</span>
            <svg
              className="nav-mobile-toggle__icon nav-mobile-toggle__icon--menu"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              className="nav-mobile-toggle__icon nav-mobile-toggle__icon--close"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <motion.a
            className="nav-cta nav-cta--premium nav-cta--header"
            href={D.navbar.connectUrl}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <IconLinkedIn className="nav-cta__icon" />
            <span className="nav-cta__text">LinkedIn</span>
            <IconArrowUpRight className="nav-cta__arrow" />
          </motion.a>
        </div>
      </motion.header>

      {mobileNavOpen ? (
        <div
          id={mobileNavId}
          className="nav-mobile"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${mobileNavId}-title`}
          onClick={closeMobileNav}
        >
          <nav
            className="nav-mobile__panel"
            aria-label="Primary"
            onClick={(e) => e.stopPropagation()}
          >
            <p id={`${mobileNavId}-title`} className="nav-mobile__title">
              Jump to section
            </p>
            <ul className="nav-mobile__list">
              {NAV_SECTIONS.map(({ href, label }) => (
                <li key={href}>
                  <a href={href} className="nav-mobile__link" onClick={closeMobileNav}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="nav-mobile__footer">
              <p className="nav-mobile__title">Appearance</p>
              <div className="nav-mobile__prefs">
                <NavPrefs />
              </div>
              <a
                href={D.navbar.connectUrl}
                className="nav-mobile__cta"
                target="_blank"
                rel="noreferrer"
                onClick={closeMobileNav}
              >
                <IconLinkedIn className="nav-mobile__cta-icon" />
                <span>LinkedIn</span>
                <IconArrowUpRight className="nav-mobile__cta-arrow" />
              </a>
            </div>
          </nav>
        </div>
      ) : null}

      <div className="marquee" aria-hidden>
        <div className="marquee__track">
          {marqueeItems.map((t, i) => (
            <span key={`${t}-${i}`} className="marquee__item">
              {t}
            </span>
          ))}
        </div>
      </div>

      <StatusStrip />

      <CommandPalette navSections={NAV_SECTIONS} />

      <main id="main">
        <section className="hero hero--engineer" aria-labelledby="hero-heading">
          <div className="hero-backdrop">
            <div className="hero-stage" id="hero-visual">
              <Suspense fallback={<CanvasFallback />}>
                <HeroCanvas />
              </Suspense>
            </div>
            <div className="hero-overlay hero-overlay--engineer" />
            <div className="hero-vignette" aria-hidden />
            <div className="hero-noise" aria-hidden />
            <div className="hero-grid hero-grid--engineer" aria-hidden />
          </div>

          <div className="hero-content">
            <div className="hero-copy">
              <motion.p
                className="eyebrow hero-greeting"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={0}
              >
                {hero.greeting}
              </motion.p>

              <h1 id="hero-heading" className="hero-title hero-title--engineer hero-title--perspective">
                <span className="hero-title__block">
                  <WordLine words={[hero.firstName]} startIndex={0} />
                </span>
                <span className="hero-title__block hero-title__block--accent">
                  <WordLine words={[hero.lastName]} startIndex={1} />
                </span>
              </h1>

              <motion.p
                className="hero-role"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={1}
              >
                <span className="hero-role__primary">
                  {hero.rolePrefix} {hero.rolePrimary}
                </span>
                <span className="hero-role__sep" aria-hidden>
                  ·
                </span>
                <span className="hero-role__secondary">{hero.roleSecondary}</span>
              </motion.p>

              <motion.div
                className="hero-meta"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={2}
              >
                <span className="hero-status">
                  <span className="hero-status__dot" aria-hidden />
                  Available for roles
                </span>
                <span className="hero-meta__sep" aria-hidden>
                  ·
                </span>
                <span className="hero-meta__muted">{hero.statusLine}</span>
              </motion.div>

              <motion.p
                className="hero-lede"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={3}
              >
                {hero.intro}
              </motion.p>

              <motion.ul
                className="hero-pills"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={4}
                aria-label="Focus areas"
              >
                {hero.focusPills.map((label) => (
                  <li key={label}>{label}</li>
                ))}
              </motion.ul>

              <HeroTerminal data={D.heroTerminal} />

              <motion.div
                className="hero-actions"
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={5}
              >
                <motion.a
                  className="btn btn-primary btn--hero"
                  href="#work"
                  whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(56, 189, 248, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  View projects
                </motion.a>
                <motion.a
                  className="btn btn-ghost btn--hero"
                  href={D.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  whileTap={{ scale: 0.98 }}
                >
                  <IconGithub className="btn--hero__icon" />
                  GitHub
                </motion.a>
                <motion.a
                  className="btn btn-ghost btn--hero"
                  href={D.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  whileTap={{ scale: 0.98 }}
                >
                  <IconLinkedIn className="btn--hero__icon" />
                  LinkedIn
                </motion.a>
                <motion.a
                  className="btn btn-ghost btn--hero"
                  href={D.socialLinks.resume}
                  target="_blank"
                  rel="noreferrer"
                  whileTap={{ scale: 0.98 }}
                >
                  Résumé
                </motion.a>
              </motion.div>
            </div>
          </div>

          <motion.div
            className="hero-scroll"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1.35, duration: 0.6 }}
          >
            <span className="hero-scroll-line" />
            <span className="hero-scroll-label">Scroll</span>
          </motion.div>
        </section>

        <section id="about" className="section about-section about-premium">
          <div className="about-section-intro">
            <p className="eyebrow section-eyebrow">Profile</p>
            <h2 className="about-page-title">{D.about.title}</h2>
            <p className="about-page-lede">{D.about.subtitle}</p>
          </div>

          <motion.div
            className="about-shell"
            {...(!reduceMotion
              ? {
                  initial: { opacity: 0, y: 24 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: VIEWPORT_REVEAL,
                  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                }
              : { initial: false })}
          >
            <div className="about-shell__border" aria-hidden />
            <div className="about-shell__inner">
              <div className="about-highlights">
                {D.about.highlights.map((h) => (
                  <div key={h.label} className="about-highlight">
                    <span className="about-highlight__label">{h.label}</span>
                    <span className="about-highlight__value">{h.value}</span>
                  </div>
                ))}
              </div>
              <div className="about-prose">
                {D.about.paragraphs.map((para, idx) => {
                  const isPull =
                    idx === D.about.paragraphs.length - 1 && D.about.paragraphs.length === 2
                  return (
                    <p key={idx} className={isPull ? 'about-pullquote' : undefined}>
                      {para}
                    </p>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </section>

        <section id="work" className="section work">
          <div className="section-head section-head--wide">
            <p className="eyebrow section-eyebrow">{D.work.title}</p>
            <h2 className="section-title">{D.work.subtitle}</h2>
          </div>
          <ul className="project-grid">
            {D.work.projects.map((p, i) => (
              <motion.li
                key={p.title}
                className="project-card"
                {...(!reduceMotion
                  ? {
                      initial: { opacity: 0, y: 36 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: VIEWPORT_REVEAL,
                      transition: {
                        duration: 0.55,
                        delay: i * 0.06,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    }
                  : { initial: false })}
              >
                <a
                  href={p.link}
                  className="project-card__link"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="project-card__image-wrap">
                    <ProjectCardThumb src={p.image} />
                    <span className="project-card__shine" aria-hidden />
                  </div>
                  <div className="project-card__body">
                    <p className="project-card__category">{p.category}</p>
                    <h3 className="project-card__title">{p.title}</h3>
                    <p className="project-card__tools">{p.tools}</p>
                    <span className="project-card__cta">View project →</span>
                  </div>
                </a>
              </motion.li>
            ))}
          </ul>
        </section>

        <section id="what-i-do" className="section what-section">
          <div className="section-head">
            <p className="eyebrow section-eyebrow">{D.whatIDo.title}</p>
            <h2 className="section-title">End-to-end delivery</h2>
          </div>
          <ul className="what-grid">
            {D.whatIDo.cards.map((card, i) => (
              <motion.li
                key={card.heading}
                className="what-card glass-card"
                {...(!reduceMotion
                  ? {
                      initial: { opacity: 0, y: 32 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: VIEWPORT_REVEAL,
                      transition: {
                        duration: 0.5,
                        delay: i * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      },
                      whileHover: { y: -6, transition: { duration: 0.22 } },
                    }
                  : { initial: false })}
              >
                <p className="what-card__kicker">{card.subheading}</p>
                <h3 className="what-card__title">{card.heading}</h3>
                <p className="what-card__desc">{card.description}</p>
                <ul className="tag-list">
                  {card.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </motion.li>
            ))}
          </ul>
        </section>

        <section id="career" className="section career-section career-experience">
          <div className="career-section-intro">
            <p className="eyebrow section-eyebrow">Background</p>
            <h2 className="career-page-title">{D.career.title}</h2>
            <p className="career-page-lede">{D.career.subtitle}</p>
          </div>

          <motion.div
            className="career-shell career-shell--split"
            {...(!reduceMotion
              ? {
                  initial: { opacity: 0, y: 24 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: VIEWPORT_REVEAL,
                  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                }
              : { initial: false })}
          >
            <div className="career-shell__border" aria-hidden />
            <div className="career-shell__inner career-split">
              <div className="career-split__column">
                <h3 className="career-split__heading">{D.career.experience.heading}</h3>
                <ol className="career-timeline-premium">
                  {D.career.experience.items.map((item, i, arr) => (
                    <motion.li
                      key={`exp-${item.company}-${item.period}`}
                      className="career-step"
                      {...(!reduceMotion
                        ? {
                            initial: { opacity: 0, y: 20 },
                            whileInView: { opacity: 1, y: 0 },
                            viewport: VIEWPORT_REVEAL,
                            transition: {
                              duration: 0.45,
                              delay: i * 0.07,
                              ease: [0.22, 1, 0.36, 1],
                            },
                          }
                        : { initial: false })}
                    >
                      <div className="career-step__rail" aria-hidden>
                        <span className="career-step__node" />
                        {i < arr.length - 1 ? <span className="career-step__connector" /> : null}
                      </div>
                      <div className="career-step__panel">
                        <div className="career-step__top">
                          <span className="career-step__period">{item.period}</span>
                        </div>
                        <h3 className="career-step__role">{item.role}</h3>
                        <p className="career-step__company">{item.company}</p>
                        <p className="career-step__desc">{item.description}</p>
                      </div>
                    </motion.li>
                  ))}
                </ol>
              </div>

              <div className="career-split__divider" aria-hidden />

              <div className="career-split__column">
                <h3 className="career-split__heading">{D.career.education.heading}</h3>
                <ol className="career-timeline-premium">
                  {D.career.education.items.map((item, i, arr) => (
                    <motion.li
                      key={`edu-${item.school}-${item.period}`}
                      className="career-step career-step--edu"
                      {...(!reduceMotion
                        ? {
                            initial: { opacity: 0, y: 20 },
                            whileInView: { opacity: 1, y: 0 },
                            viewport: VIEWPORT_REVEAL,
                            transition: {
                              duration: 0.45,
                              delay: i * 0.07,
                              ease: [0.22, 1, 0.36, 1],
                            },
                          }
                        : { initial: false })}
                    >
                      <div className="career-step__rail career-step__rail--edu" aria-hidden>
                        <span className="career-step__node career-step__node--edu" />
                        {i < arr.length - 1 ? (
                          <span className="career-step__connector career-step__connector--edu" />
                        ) : null}
                      </div>
                      <div className="career-step__panel career-step__panel--edu">
                        <div className="career-step__top">
                          <span className="career-step__period">{item.period}</span>
                        </div>
                        <h3 className="career-step__role">{item.degree}</h3>
                        <p className="career-step__company">{item.school}</p>
                        <p className="career-step__desc">{item.description}</p>
                      </div>
                    </motion.li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.div>
        </section>

        <InsightsSection reduceMotion={reduceMotion} />

        <section id="contact" className="section contact contact-premium">
          <div className="contact-section-intro">
            <p className="eyebrow section-eyebrow">Contact</p>
            <h2 className="contact-page-title">{D.contact.formHeading}</h2>
            <p className="contact-page-lede">{D.contact.formLede}</p>
          </div>

          <motion.div
            className="contact-shell"
            {...(!reduceMotion
              ? {
                  initial: { opacity: 0, y: 24 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: VIEWPORT_REVEAL,
                  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                }
              : { initial: false })}
          >
            <div className="contact-shell__border" aria-hidden />
            <div className="contact-shell__inner">
              <aside className="contact-aside-premium">
                <div className="contact-block">
                  <h3 className="contact-block__title">{D.contact.connectHeading}</h3>
                  <a
                    href={D.contact.connectUrl}
                    className="contact-inbound-btn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="contact-inbound-btn__icon">
                      <IconLinkedIn />
                    </span>
                    <span className="contact-inbound-btn__text">
                      <span className="contact-inbound-btn__line">{D.contact.connectLabel}</span>
                      <span className="contact-inbound-btn__sub">Opens in a new tab</span>
                    </span>
                    <IconArrowUpRight className="contact-inbound-btn__arrow" />
                  </a>
                </div>

                <div className="contact-block">
                  <h3 className="contact-block__title">{D.contact.socialHeading}</h3>
                  <div className="contact-pill-row">
                    <a
                      href={D.socialLinks.github}
                      className="contact-pill"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <IconGithub />
                      GitHub
                    </a>
                    <a
                      href={D.socialLinks.linkedin}
                      className="contact-pill"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <IconLinkedIn />
                      LinkedIn
                    </a>
                    <a
                      href={D.socialLinks.portfolio}
                      className="contact-pill"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <IconGlobe />
                      Portfolio
                    </a>
                  </div>
                </div>
              </aside>

              <div className="contact-form-panel" aria-label="Message form">
                <div className="contact-form-panel__head">
                  <span className="contact-form-panel__kicker">Inquiry</span>
                  <p className="contact-form-panel__hint">
                    For a faster reply, use LinkedIn — this form is for longer messages.
                  </p>
                </div>
                <form
                  className="contact-form-premium"
                  onSubmit={(e) => e.preventDefault()}
                  aria-label="Contact form"
                >
                  <div className="contact-form-premium__row">
                    <label className="field field--premium">
                      <span className="field-label">Name</span>
                      <input
                        type="text"
                        name="name"
                        autoComplete="name"
                        placeholder="e.g. Rahul Sharma"
                      />
                    </label>
                    <label className="field field--premium">
                      <span className="field-label">Email</span>
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="name@company.com"
                      />
                    </label>
                  </div>
                  <label className="field field--premium field-full">
                    <span className="field-label">Message</span>
                    <textarea
                      name="message"
                      rows={5}
                      placeholder="Project context, timeline, stack — whatever helps."
                    />
                  </label>
                  <motion.button
                    type="submit"
                    className="btn-submit-premium"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <span>Send message</span>
                    <IconArrowUpRight />
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <ReadingProgressHud />

      <footer className="footer">
        <p className="footer-copy">
          {D.contact.creditPrefix}{' '}
          <span className="brand-name">{D.contact.creditName}</span>
        </p>
        <p className="footer-meta">
          © {D.contact.copyrightYear} · {D.siteTitle.split('—')[0].trim()}
        </p>
      </footer>
    </div>
  )
}

export default App
