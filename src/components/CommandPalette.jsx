import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { portfolioData as D } from '../data/portfolioData'
import { useAppPreferences } from '../contexts/AppPreferencesContext.jsx'

function normalize(s) {
  return s.toLowerCase().trim()
}

/**
 * ⌘K / Ctrl+K command palette: navigate, copy email, links, theme, simple mode.
 */
export function CommandPalette({ navSections }) {
  const { cycleTheme, themeMode, simpleMode, toggleSimpleMode, setThemeMode } = useAppPreferences()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)

  const email = D.contact?.email?.trim()

  const actions = useMemo(() => {
    const navActions = navSections.map((s) => ({
      id: `go-${s.href}`,
      label: `Go to ${s.label}`,
      keywords: `${s.label} section navigate ${s.href}`,
      run: () => {
        const id = s.href.startsWith('#') ? s.href.slice(1) : s.href
        window.location.hash = `#${id}`
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      },
    }))

    const emailAction = email
      ? [
          {
            id: 'copy-email',
            label: `Copy email (${email})`,
            keywords: 'mail clipboard',
            run: async () => {
              try {
                await navigator.clipboard.writeText(email)
              } catch {
                /* ignore */
              }
            },
          },
        ]
      : []

    const list = [
      ...navActions,
      ...emailAction,
      {
        id: 'resume',
        label: 'Open résumé (PDF)',
        keywords: 'cv pdf resume',
        run: () => window.open(D.socialLinks.resume, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'github',
        label: 'Open GitHub profile',
        keywords: 'code repo',
        run: () => window.open(D.socialLinks.github, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'linkedin',
        label: 'Open LinkedIn',
        keywords: 'network',
        run: () => window.open(D.socialLinks.linkedin, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'theme',
        label: `Theme: ${themeMode} (click to cycle)`,
        keywords: 'dark light appearance color',
        run: () => cycleTheme(),
      },
      {
        id: 'theme-light',
        label: 'Set theme: Light',
        keywords: 'light mode',
        run: () => setThemeMode('light'),
      },
      {
        id: 'theme-dark',
        label: 'Set theme: Dark',
        keywords: 'dark mode',
        run: () => setThemeMode('dark'),
      },
      {
        id: 'theme-system',
        label: 'Set theme: System',
        keywords: 'system os',
        run: () => setThemeMode('system'),
      },
      {
        id: 'simple',
        label: simpleMode ? 'Disable simple mode (3D & heavy motion)' : 'Enable simple mode',
        keywords: 'accessibility reduce motion performance 3d canvas',
        run: () => toggleSimpleMode(),
      },
    ]

    return list
  }, [navSections, themeMode, simpleMode, email, cycleTheme, setThemeMode, toggleSimpleMode])

  const filtered = useMemo(() => {
    const q = normalize(query)
    if (!q) return actions
    return actions.filter((a) => {
      const hay = normalize(`${a.label} ${a.keywords}`)
      return hay.includes(q)
    })
  }, [actions, query])

  const safeActive = Math.min(active, Math.max(0, filtered.length - 1))

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setActive(0)
  }, [])

  /** Lock scroll; `position: fixed` avoids iOS Safari painting the overlay off-screen or under the chrome. */
  useEffect(() => {
    if (!open) return
    const scrollY = window.scrollY
    const prev = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
    }
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.width = '100%'
    return () => {
      document.body.style.overflow = prev.overflow
      document.body.style.position = prev.position
      document.body.style.top = prev.top
      document.body.style.left = prev.left
      document.body.style.right = prev.right
      document.body.style.width = prev.width
      window.scrollTo(0, scrollY)
    }
  }, [open])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === 'Escape') {
        setOpen(false)
        setQuery('')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => inputRef.current?.focus(), 0)
    return () => window.clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActive((i) => Math.min(i + 1, Math.max(0, filtered.length - 1)))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActive((i) => Math.max(i - 1, 0))
      }
      if (e.key === 'Enter' && filtered[safeActive]) {
        e.preventDefault()
        filtered[safeActive].run()
        close()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, filtered, safeActive, close])

  if (typeof document === 'undefined') return null

  const isApple =
    typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent)

  const node = (
    <>
      <button type="button" className="command-palette-trigger" onClick={() => setOpen(true)}>
        {isApple ? (
          <>
            <kbd className="command-palette-trigger__kbd">⌘</kbd>
            <kbd className="command-palette-trigger__kbd">K</kbd>
          </>
        ) : (
          <>
            <kbd className="command-palette-trigger__kbd">Ctrl</kbd>
            <kbd className="command-palette-trigger__kbd">K</kbd>
          </>
        )}
        <span className="command-palette-trigger__label">Commands</span>
      </button>

      {open
        ? createPortal(
            <div className="command-palette-overlay" role="dialog" aria-modal="true" aria-label="Command palette">
              <button type="button" className="command-palette-backdrop" tabIndex={-1} aria-label="Close" onClick={close} />
              <div className="command-palette-panel">
                <label className="command-palette-search">
                  <span className="visually-hidden">Search commands</span>
                  <input
                    ref={inputRef}
                    type="search"
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="Jump to section, links, theme…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <ul className="command-palette-list" role="listbox">
                  {filtered.map((item, i) => (
                    <li key={item.id} role="option" aria-selected={i === safeActive}>
                      <button
                        type="button"
                        className={`command-palette-item ${i === safeActive ? 'command-palette-item--active' : ''}`}
                        onMouseEnter={() => setActive(i)}
                        onClick={() => {
                          item.run()
                          close()
                        }}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
                {filtered.length === 0 ? (
                  <p className="command-palette-empty">No matches.</p>
                ) : null}
                <p className="command-palette-hint">
                  <kbd>↑</kbd> <kbd>↓</kbd> select · <kbd>Enter</kbd> run · <kbd>Esc</kbd> close
                </p>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )

  return node
}
