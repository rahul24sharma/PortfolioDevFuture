import { useMemo } from 'react'

const DEFAULT_WPM = 200

/**
 * Estimates reading time from visible text in #main (words / wpm).
 * ReadingProgressHud is rendered after `<main id="main">` so the DOM node exists.
 */
export function useMainReadTime(wpm = DEFAULT_WPM) {
  return useMemo(() => {
    const el = document.getElementById('main')
    if (!el) return 1
    const text = el.innerText || ''
    const words = text.trim().split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.ceil(words / wpm))
  }, [wpm])
}
