import { useRef, useState } from 'react'
import { Trash2, X } from 'lucide-react'
import { loadSessions, deleteSession, type Session } from '../services/storage'

interface Props {
  onLoad: (session: Session) => void
  onClose: () => void
}

// Per-card swipe state
interface SwipeState {
  startX: number
  offsetX: number  // negative = swiped left
}

export default function SessionsScreen({ onLoad, onClose }: Props) {
  const [sessions, setSessions] = useState<Session[]>(() => loadSessions())
  const [query, setQuery] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const swipe = useRef<Record<string, SwipeState>>({})
  const [offsets, setOffsets] = useState<Record<string, number>>({})

  const filtered = sessions.filter(s => s.title.toLowerCase().includes(query.toLowerCase()))

  const handleDelete = (id: string) => {
    deleteSession(id)
    setSessions(loadSessions())
    setConfirmDelete(null)
    setOffsets(prev => { const next = { ...prev }; delete next[id]; return next })
  }

  // ── Swipe-to-delete touch handlers ──────────────────────────────────────
  const onTouchStart = (id: string, e: React.TouchEvent) => {
    swipe.current[id] = { startX: e.touches[0].clientX, offsetX: 0 }
  }

  const onTouchMove = (id: string, e: React.TouchEvent) => {
    const s = swipe.current[id]
    if (!s) return
    const dx = e.touches[0].clientX - s.startX
    // Only allow leftward swipe
    const clamped = Math.min(0, Math.max(-120, dx))
    swipe.current[id] = { ...s, offsetX: clamped }
    setOffsets(prev => ({ ...prev, [id]: clamped }))
  }

  const onTouchEnd = (id: string) => {
    const s = swipe.current[id]
    if (!s) return
    if (s.offsetX < -80) {
      // Swiped far enough — show confirm (snap to -96 to reveal delete button)
      setOffsets(prev => ({ ...prev, [id]: -96 }))
      setConfirmDelete(id)
    } else {
      // Snap back
      setOffsets(prev => ({ ...prev, [id]: 0 }))
    }
    swipe.current[id] = { startX: 0, offsetX: 0 }
  }

  const cancelSwipe = (id: string) => {
    setOffsets(prev => ({ ...prev, [id]: 0 }))
    setConfirmDelete(null)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 600, background: '#FDFBF7', overflowY: 'auto', padding: '80px 24px 120px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: '#1A1611' }}>Saved Sessions</h2>
          <button onClick={onClose} style={{ fontSize: 14, color: '#7A6E62', background: 'none', border: 'none', cursor: 'pointer', minHeight: 44, padding: '0 8px' }}><X className="w-4 h-4" /> Close</button>
        </div>

        {/* Search */}
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search sessions…"
          style={{
            width: '100%', padding: '12px 16px', borderRadius: 12,
            border: '1px solid rgba(201,168,76,0.3)', background: '#fff',
            fontSize: 14, color: '#1A1611', outline: 'none', marginBottom: 20,
            fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box',
          }}
        />

        {filtered.length === 0 && (
          <p style={{ color: '#7A6E62', textAlign: 'center', marginTop: 48, fontSize: 15 }}>
            {sessions.length === 0 ? 'No saved sessions yet.' : 'No results.'}
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(s => {
            const lines = s.diacritized.split('\n').filter(Boolean).length
            const date = new Date(s.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            const offset = offsets[s.id] ?? 0
            const isConfirm = confirmDelete === s.id

            return (
              <div
                key={s.id}
                style={{ position: 'relative', overflow: 'hidden', borderRadius: 16 }}
                onTouchStart={e => onTouchStart(s.id, e)}
                onTouchMove={e => onTouchMove(s.id, e)}
                onTouchEnd={() => onTouchEnd(s.id)}
              >
                {/* Delete button revealed by swipe */}
                <div style={{
                  position: 'absolute', right: 0, top: 0, bottom: 0,
                  width: 96, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#e53e3e', borderRadius: '0 16px 16px 0',
                }}>
                  {isConfirm ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                      <button
                        onClick={() => handleDelete(s.id)}
                        style={{ fontSize: 12, fontWeight: 600, color: '#fff', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', minHeight: 36 }}
                      >Delete</button>
                      <button
                        onClick={() => cancelSwipe(s.id)}
                        style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', minHeight: 30 }}
                      >Cancel</button>
                    </div>
                  ) : (
                    <Trash2 className="w-5 h-5 text-white" />
                  )}
                </div>

                {/* Card — slides left on swipe */}
                <div
                  style={{
                    background: '#fff', border: '1px solid rgba(201,168,76,0.2)',
                    borderRadius: 16, padding: '16px 20px',
                    display: 'flex', alignItems: 'center', gap: 16,
                    boxShadow: '0 2px 12px rgba(26,22,17,0.05)',
                    transform: `translateX(${offset}px)`,
                    transition: swipe.current[s.id]?.startX ? 'none' : 'transform 0.25s ease',
                    willChange: 'transform',
                  }}
                >
                  {s.image && (
                    <img
                      src={s.image} alt=""
                      style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(201,168,76,0.15)' }}
                    />
                  )}
                  <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => { cancelSwipe(s.id); onLoad(s) }}>
                    <div dir="rtl" style={{ fontFamily: "'Noto Naskh Arabic', serif", fontSize: 17, fontWeight: 600, color: '#1A1611', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: 12, color: '#7A6E62', marginTop: 3 }}>
                      {date} · {lines} line{lines !== 1 ? 's' : ''}
                    </div>
                  </div>
                  {/* Desktop trash button — still useful on non-touch */}
                  {!isConfirm && (
                    <button
                      onClick={() => setConfirmDelete(s.id)}
                      style={{ fontSize: 18, color: '#ccc', background: 'none', border: 'none', cursor: 'pointer', minHeight: 44, padding: '0 4px', flexShrink: 0 }}
                      title="Delete"
                    ><Trash2 className="w-[18px] h-[18px]" /></button>
                  )}
                  {isConfirm && (
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button onClick={() => handleDelete(s.id)} style={{ fontSize: 12, color: '#e53e3e', background: 'none', border: '1px solid #e53e3e', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', minHeight: 44 }}>Delete</button>
                      <button onClick={() => cancelSwipe(s.id)} style={{ fontSize: 12, color: '#7A6E62', background: 'none', border: '1px solid #ccc', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', minHeight: 44 }}>Cancel</button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
