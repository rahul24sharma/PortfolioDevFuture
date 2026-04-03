import { motion } from 'framer-motion'
import { portfolioData as D } from '../data/portfolioData'

const VIEWPORT_REVEAL = { once: true, amount: 0.12, margin: '-48px 0px' }

export function InsightsSection({ reduceMotion }) {
  const ins = D.insights
  if (!ins) return null

  return (
    <section id="insights" className="section insights-section">
      <div className="insights-section-intro">
        <p className="eyebrow section-eyebrow">{ins.eyebrow}</p>
        <h2 className="insights-page-title">{ins.title}</h2>
        <p className="insights-page-lede">{ins.lede}</p>
      </div>

      <motion.div
        className="insights-grid"
        {...(!reduceMotion
          ? {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: VIEWPORT_REVEAL,
              transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
            }
          : { initial: false })}
      >
        <article className="insights-card insights-card--decisions">
          <h3 className="insights-card__title">{ins.decisionLog.title}</h3>
          <ul className="insights-decisions">
            {ins.decisionLog.items.map((row) => (
              <li key={row.decision} className="insights-decisions__item">
                <span className="insights-decisions__choice">{row.decision}</span>
                <span className="insights-decisions__reason">{row.reason}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="insights-card insights-card--lesson">
          <h3 className="insights-card__title">{ins.lesson.title}</h3>
          <blockquote className="insights-lesson">
            <p>{ins.lesson.body}</p>
          </blockquote>
        </article>

        <article className="insights-card insights-card--reading">
          <h3 className="insights-card__title">{ins.readingStack.title}</h3>
          <ul className="insights-reading">
            {ins.readingStack.items.map((item) => (
              <li key={item.title} className="insights-reading__item">
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noreferrer" className="insights-reading__link">
                    {item.title}
                  </a>
                ) : (
                  <span className="insights-reading__book">{item.title}</span>
                )}
                {item.note ? <span className="insights-reading__note">{item.note}</span> : null}
              </li>
            ))}
          </ul>
        </article>
      </motion.div>
    </section>
  )
}
