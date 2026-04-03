import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useState } from 'react'
import { useMainReadTime } from '../hooks/useMainReadTime'
import { portfolioData as D } from '../data/portfolioData'

/**
 * Top reading-progress bar + fixed HUD: depth % and estimated read time for #main.
 */
export function ReadingProgressHud() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.05], [0.4, 1])
  const wpm = D.readTime?.wordsPerMinute ?? 200
  const minutes = useMainReadTime(wpm)
  const [depthPct, setDepthPct] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setDepthPct(Math.round(Math.min(1, Math.max(0, v)) * 100))
  })

  if (reduce) {
    return (
      <div className="read-hud read-hud--solo" aria-live="polite">
        <span className="read-hud__label">Est. read</span> ~{minutes} min
      </div>
    )
  }

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress, opacity }} aria-hidden />
      <div className="read-hud" aria-live="polite">
        <span className="read-hud__depth">{depthPct}%</span>
        <span className="read-hud__sep" aria-hidden>
          ·
        </span>
        <span className="read-hud__meta">
          ~{minutes} min read
        </span>
      </div>
    </>
  )
}
