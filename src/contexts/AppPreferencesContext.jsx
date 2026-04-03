import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_THEME = 'portfolio-theme'
const STORAGE_SIMPLE = 'portfolio-simple'

/** @typedef {'system' | 'light' | 'dark'} ThemeMode */

const AppPreferencesContext = createContext(null)

export function AppPreferencesProvider({ children }) {
  const [themeMode, setThemeModeState] = useState(() => {
    try {
      const v = localStorage.getItem(STORAGE_THEME)
      if (v === 'light' || v === 'dark' || v === 'system') return v
    } catch {
      /* ignore */
    }
    return 'system'
  })

  const [simpleMode, setSimpleModeState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_SIMPLE) === '1'
    } catch {
      return false
    }
  })

  const [systemPrefersDark, setSystemPrefersDark] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : true,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const fn = () => setSystemPrefersDark(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])

  const resolvedTheme = useMemo(() => {
    if (themeMode === 'light') return 'light'
    if (themeMode === 'dark') return 'dark'
    return systemPrefersDark ? 'dark' : 'light'
  }, [themeMode, systemPrefersDark])

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute('content', resolvedTheme === 'light' ? '#f1f5f9' : '#020617')
    }
  }, [resolvedTheme])

  useEffect(() => {
    if (simpleMode) document.body.classList.add('simple-mode')
    else document.body.classList.remove('simple-mode')
    try {
      localStorage.setItem(STORAGE_SIMPLE, simpleMode ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [simpleMode])

  const setThemeMode = useCallback((mode) => {
    setThemeModeState(mode)
    try {
      localStorage.setItem(STORAGE_THEME, mode)
    } catch {
      /* ignore */
    }
  }, [])

  const setSimpleMode = useCallback((v) => {
    setSimpleModeState((prev) => (typeof v === 'function' ? v(prev) : Boolean(v)))
  }, [])

  const toggleSimpleMode = useCallback(() => {
    setSimpleModeState((s) => !s)
  }, [])

  const cycleTheme = useCallback(() => {
    setThemeModeState((prev) => {
      const next = prev === 'system' ? 'light' : prev === 'light' ? 'dark' : 'system'
      try {
        localStorage.setItem(STORAGE_THEME, next)
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      themeMode,
      setThemeMode,
      resolvedTheme,
      cycleTheme,
      simpleMode,
      setSimpleMode,
      toggleSimpleMode,
    }),
    [themeMode, setThemeMode, resolvedTheme, cycleTheme, simpleMode, setSimpleMode, toggleSimpleMode],
  )

  return <AppPreferencesContext.Provider value={value}>{children}</AppPreferencesContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook colocated with provider
export function useAppPreferences() {
  const ctx = useContext(AppPreferencesContext)
  if (!ctx) throw new Error('useAppPreferences must be used within AppPreferencesProvider')
  return ctx
}
