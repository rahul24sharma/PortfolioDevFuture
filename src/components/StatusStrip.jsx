import { startTransition, useEffect, useState } from 'react'
import { portfolioData as D } from '../data/portfolioData'

function formatRelative(iso) {
  if (!iso) return ''
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) return ''
  const diff = Date.now() - t
  const m = Math.floor(diff / 60000)
  const h = Math.floor(m / 60)
  const d = Math.floor(h / 24)
  if (d > 14) return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  if (d >= 1) return `${d}d ago`
  if (h >= 1) return `${h}h ago`
  if (m >= 1) return `${m}m ago`
  return 'just now'
}

export function StatusStrip() {
  const repo = D.status?.githubRepo
  const buildTime = typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : null
  const [repoPushed, setRepoPushed] = useState(null)
  const [repoLoaded, setRepoLoaded] = useState(false)
  const [repoErr, setRepoErr] = useState(false)
  /** Wrong path, private repo, or deleted — GitHub returns 404 without auth. */
  const [repoNotFound, setRepoNotFound] = useState(false)

  useEffect(() => {
    if (!repo) return
    const [owner, name] = repo.split('/').filter(Boolean)
    if (!owner || !name) return
    const ac = new AbortController()
    startTransition(() => {
      setRepoErr(false)
      setRepoNotFound(false)
      setRepoPushed(null)
      setRepoLoaded(false)
    })
    fetch(`https://api.github.com/repos/${owner}/${name}`, {
      signal: ac.signal,
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then(async (r) => {
        if (r.status === 404) {
          setRepoNotFound(true)
          return
        }
        if (!r.ok) {
          setRepoErr(true)
          return
        }
        const data = await r.json()
        setRepoPushed(data.pushed_at || null)
        setRepoLoaded(true)
      })
      .catch(() => setRepoErr(true))
    return () => ac.abort()
  }, [repo])

  const buildLabel = buildTime
    ? new Date(buildTime).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  return (
    <div className="status-strip" role="status" aria-live="polite">
      <div className="status-strip__inner">
        <span className="status-strip__cluster">
          <span className="status-strip__dot" aria-hidden />
          <span className="status-strip__label">Site</span>
          <span className="status-strip__value">
            {buildLabel ? <>built {buildLabel}</> : <>build time unavailable</>}
          </span>
        </span>
        <span className="status-strip__sep" aria-hidden>
          ·
        </span>
        <span className="status-strip__cluster">
          <span className="status-strip__label">Repo</span>
          <span className="status-strip__value">
            {!repo ? (
              <>set <code className="status-strip__code">status.githubRepo</code></>
            ) : repoNotFound ? (
              <>not found (private or wrong path)</>
            ) : repoErr ? (
              <>API unavailable</>
            ) : !repoLoaded ? (
              <>loading…</>
            ) : repoPushed ? (
              <>
                pushed {formatRelative(repoPushed)}
                <a
                  className="status-strip__link"
                  href={`https://github.com/${repo}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              </>
            ) : (
              <>
                no commits yet ·{' '}
                <a
                  className="status-strip__link"
                  href={`https://github.com/${repo}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              </>
            )}
          </span>
        </span>
      </div>
    </div>
  )
}
