import { motion, useReducedMotion } from 'framer-motion'

const line = {
  hidden: { opacity: 0, x: -12 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.85 + i * 0.12, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
}

const defaultData = {
  fileName: 'engineer.sh',
  whoami: 'software.engineer',
  catCommand: 'cat ./values.txt',
  stackLine: 'clarity · reliability · velocity',
}

export function HeroTerminal({ data = defaultData }) {
  const reduce = useReducedMotion()
  const d = { ...defaultData, ...data }

  return (
    <motion.div
      className="hero-terminal"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      role="img"
      aria-label="Decorative terminal output"
    >
      <div className="hero-terminal__chrome">
        <span className="hero-terminal__dots" aria-hidden>
          <span />
          <span />
          <span />
        </span>
        <span className="hero-terminal__title">{d.fileName}</span>
      </div>
      <div className="hero-terminal__body">
        <motion.div className="hero-terminal__line" variants={line} custom={0} initial="hidden" animate="visible">
          <span className="hero-terminal__prompt">$</span>
          <span className="hero-terminal__cmd"> whoami</span>
        </motion.div>
        <motion.div
          className="hero-terminal__line hero-terminal__line--out"
          variants={line}
          custom={1}
          initial="hidden"
          animate="visible"
        >
          {d.whoami}
        </motion.div>
        <motion.div className="hero-terminal__line" variants={line} custom={2} initial="hidden" animate="visible">
          <span className="hero-terminal__prompt">$</span>
          <span className="hero-terminal__cmd"> {d.catCommand}</span>
        </motion.div>
        <motion.div
          className="hero-terminal__line hero-terminal__line--out"
          variants={line}
          custom={3}
          initial="hidden"
          animate="visible"
        >
          {d.stackLine}
        </motion.div>
        <motion.span
          className="hero-terminal__cursor"
          aria-hidden
          animate={reduce ? { opacity: 1 } : { opacity: [1, 0, 1] }}
          transition={reduce ? {} : { duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        >
          ▋
        </motion.span>
      </div>
    </motion.div>
  )
}
