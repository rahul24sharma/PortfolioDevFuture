import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState } from 'react'
import { useAppPreferences } from '../contexts/AppPreferencesContext.jsx'
import { HeroScene } from './HeroScene'

const HERO_BG = { dark: '#020617', light: '#f1f5f9' }

function heroFallbackBackground(isLight) {
  return isLight
    ? 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(37, 99, 235, 0.16), transparent 55%), radial-gradient(circle at 70% 20%, rgba(34, 211, 238, 0.07), transparent 40%), #f1f5f9'
    : 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(37, 99, 235, 0.25), transparent 55%), radial-gradient(circle at 70% 20%, rgba(34, 211, 238, 0.12), transparent 40%), #020617'
}

function FallbackBackdrop() {
  const { resolvedTheme } = useAppPreferences()
  const isLight = resolvedTheme === 'light'
  return (
    <div
      className="hero-fallback"
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        background: heroFallbackBackground(isLight),
      }}
    />
  )
}

function HeroCanvas() {
  const { simpleMode, resolvedTheme } = useAppPreferences()
  const heroBg = HERO_BG[resolvedTheme === 'light' ? 'light' : 'dark']
  const [reducedMotion, setReducedMotion] = useState(false)
  /** Pause WebGL when the hero is off-screen — saves GPU/CPU during long scroll sessions. */
  const [heroVisible, setHeroVisible] = useState(true)
  /** Cap pixel ratio on small / low-power viewports for smoother scrolling site-wide. */
  const [dpr, setDpr] = useState(() => [1, 2])
  /** WebGL context ready — hides boot overlay. */
  const [glReady, setGlReady] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const el = document.getElementById('hero-visual')
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => setHeroVisible(e.isIntersecting),
      { root: null, rootMargin: '120px 0px', threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const mqCoarse = window.matchMedia('(pointer: coarse)')
    const mqNarrow = window.matchMedia('(max-width: 768px)')
    const update = () => {
      const cap = mqCoarse.matches || mqNarrow.matches ? 1.35 : 2
      setDpr([1, Math.min(window.devicePixelRatio || 1, cap)])
    }
    update()
    mqCoarse.addEventListener('change', update)
    mqNarrow.addEventListener('change', update)
    window.addEventListener('resize', update)
    return () => {
      mqCoarse.removeEventListener('change', update)
      mqNarrow.removeEventListener('change', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  if (reducedMotion || simpleMode) {
    return <FallbackBackdrop />
  }

  return (
    <div className="hero-canvas-wrap">
      <div
        className={`hero-canvas-boot ${glReady ? 'hero-canvas-boot--ready' : ''}`}
        role="status"
        aria-live="polite"
        aria-busy={!glReady}
        aria-hidden={glReady}
      >
        <span className="visually-hidden">{glReady ? 'Scene ready' : 'Initializing WebGL'}</span>
        <div className="hero-canvas-loader hero-canvas-loader--compact" aria-hidden>
          <span className="hero-canvas-loader__ring" />
          <span className="hero-canvas-loader__label">Starting scene…</span>
        </div>
      </div>
      <Canvas
        aria-hidden
        camera={{ position: [0.65, 0.15, 7.2], fov: 40 }}
        dpr={dpr}
        frameloop={heroVisible ? 'always' : 'never'}
        onCreated={() => setGlReady(true)}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
      >
        <color attach="background" args={[heroBg]} />
        <fog attach="fog" args={[heroBg, 5.5, 16]} />
        <Suspense fallback={null}>
          <HeroScene paused={!heroVisible} />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default HeroCanvas
