import { useEffect, useRef, useState } from 'react'
import { Play, Repeat } from 'lucide-react'
import speakArabic from '../services/tts'

export default function SelectionBar() {
  const [bar, setBar] = useState<{ x: number; y: number; text: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const isMobileRef = useRef(false)

  useEffect(() => {
    isMobileRef.current = window.innerWidth < 768
  }, [])

  useEffect(() => {
    const onSelectionChange = () => {
      const sel = window.getSelection()
      const text = sel?.toString().trim() ?? ''
      if (!text || !sel?.rangeCount) { setBar(null); return }
      const range = sel.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      // Use viewport-relative coords for position:fixed
      const rawX = rect.left + rect.width / 2
      // Clamp so the pill never clips the screen edges (approx pill half-width 110px)
      const x = Math.max(110, Math.min(window.innerWidth - 110, rawX))
      const y = rect.top  // we'll translate(-50%, -100%) and add a gap below
      setBar({ x, y, text })
    }

    document.addEventListener('selectionchange', onSelectionChange)
    document.addEventListener('mouseup', onSelectionChange)
    return () => {
      document.removeEventListener('selectionchange', onSelectionChange)
      document.removeEventListener('mouseup', onSelectionChange)
    }
  }, [])

  const dismiss = () => {
    window.getSelection()?.removeAllRanges()
    setBar(null)
  }

  const listen = async () => {
    if (!bar || busy) return
    setBusy(true)
    try {
      const src = await speakArabic(bar.text)
      await new Promise<void>(res => { src.onended = () => res() })
    } finally { setBusy(false) }
  }

  const repeatX3 = async () => {
    if (!bar || busy) return
    setBusy(true)
    try {
      for (let i = 0; i < 3; i++) {
        const src = await speakArabic(bar.text)
        await new Promise<void>(res => { src.onended = () => res() })
        if (i < 2) await new Promise(res => setTimeout(res, 800))
      }
    } finally { setBusy(false) }
  }

  if (!bar) return null

  // ── Mobile: slide-up bottom sheet ────────────────────────────────────────
  if (isMobileRef.current) {
    return (
      <>
        {/* backdrop — dismiss on outside tap */}
        <div
          onClick={dismiss}
          style={{ position: 'fixed', inset: 0, zIndex: 450, background: 'transparent' }}
        />
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 451,
          background: '#1A1611',
          borderRadius: '20px 20px 0 0',
          padding: '16px 20px calc(env(safe-area-inset-bottom) + 16px)',
          display: 'flex', gap: 10,
          boxShadow: '0 -4px 32px rgba(0,0,0,0.3)',
          animation: 'selBarUp 0.22s ease',
        }}>
          <style>{`@keyframes selBarUp { from { transform:translateY(100%) } to { transform:translateY(0) } }`}</style>
          <button
            onClick={listen} disabled={busy}
            style={{
              flex: 1, minHeight: 52, borderRadius: 14, border: 'none', cursor: 'pointer',
              background: 'rgba(201,168,76,0.15)', color: '#E8C97A',
              fontSize: 15, fontWeight: 600,
            }}
          >▶ Listen</button>
          <button
            onClick={repeatX3} disabled={busy}
            style={{
              flex: 1, minHeight: 52, borderRadius: 14, border: 'none', cursor: 'pointer',
              background: 'rgba(201,168,76,0.15)', color: '#E8C97A',
              fontSize: 15, fontWeight: 600,
            }}
          >🔁 Repeat ×3</button>
          <button
            onClick={dismiss}
            style={{
              minWidth: 52, minHeight: 52, borderRadius: 14, border: 'none', cursor: 'pointer',
              background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)',
              fontSize: 18,
            }}
          >✕</button>
        </div>
      </>
    )
  }

  // ── Desktop: floating pill above selection ────────────────────────────────
  return (
    <>
      {/* invisible backdrop to catch outside clicks */}
      <div
        onClick={dismiss}
        style={{ position: 'fixed', inset: 0, zIndex: 398, background: 'transparent' }}
      />
      <div
        style={{
          position: 'fixed',
          left: bar.x,
          top: bar.y,
          transform: 'translate(-50%, calc(-100% - 10px))',
          zIndex: 399,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: '#1A1611',
          borderRadius: 100,
          padding: '6px 12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.28)',
          whiteSpace: 'nowrap',
        }}
      >
        <button
          onClick={listen} disabled={busy}
          style={{ color: '#E8C97A', fontSize: 13, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', minHeight: 44 }}
        >▶ Listen</button>
        <div style={{ width: 1, background: 'rgba(255,255,255,0.15)', alignSelf: 'stretch', margin: '4px 0' }} />
        <button
          onClick={repeatX3} disabled={busy}
          style={{ color: '#E8C97A', fontSize: 13, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', minHeight: 44 }}
        >🔁 Repeat ×3</button>
        <div style={{ width: 1, background: 'rgba(255,255,255,0.15)', alignSelf: 'stretch', margin: '4px 0' }} />
        <button
          onClick={dismiss}
          style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', minHeight: 44 }}
        >✕</button>
      </div>
    </>
  )
}
