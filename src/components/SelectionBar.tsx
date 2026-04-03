import { useEffect, useState } from 'react'
import { Play, Repeat2, X } from 'lucide-react'
import speakArabic from '../services/tts'

export default function SelectionBar() {
  const [bar, setBar] = useState<{ x: number; y: number; text: string } | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const onSelectionChange = () => {
      const sel = window.getSelection()
      const text = sel?.toString().trim() ?? ''
      if (!text || !sel?.rangeCount) { setBar(null); return }
      const range = sel.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      setBar({ x: rect.left + rect.width / 2, y: rect.top + window.scrollY - 8, text })
    }
    document.addEventListener('selectionchange', onSelectionChange)
    document.addEventListener('mouseup', onSelectionChange)
    return () => {
      document.removeEventListener('selectionchange', onSelectionChange)
      document.removeEventListener('mouseup', onSelectionChange)
    }
  }, [])

  const dismiss = () => { window.getSelection()?.removeAllRanges(); setBar(null) }

  const listen = async () => {
    if (!bar || busy) return
    setBusy(true)
    try { await speakArabic(bar.text) } finally { setBusy(false) }
  }

  const repeatX3 = async () => {
    if (!bar || busy) return
    setBusy(true)
    try {
      for (let i = 0; i < 3; i++) {
        const result = await speakArabic(bar.text)
        await new Promise<void>(res => { result.source.onended = () => res() })
        if (i < 2) await new Promise(res => setTimeout(res, 800))
      }
    } finally { setBusy(false) }
  }

  if (!bar) return null

  return (
    <div style={{
      position: 'absolute',
      left: bar.x, top: bar.y,
      transform: 'translate(-50%, -100%)',
      zIndex: 400,
      display: 'flex', gap: 6,
      background: '#1A1611', borderRadius: 100,
      padding: '6px 12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
      whiteSpace: 'nowrap', alignItems: 'center',
    }}>
      <button
        onClick={listen} disabled={busy}
        style={{ color: '#E8C97A', fontSize: 13, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', minHeight: 44, display: 'flex', alignItems: 'center', gap: 5 }}
      >
        <Play size={13} fill="#E8C97A" /> Listen
      </button>
      <div style={{ width: 1, background: 'rgba(255,255,255,0.15)', alignSelf: 'stretch' }} />
      <button
        onClick={repeatX3} disabled={busy}
        style={{ color: '#E8C97A', fontSize: 13, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', minHeight: 44, display: 'flex', alignItems: 'center', gap: 5 }}
      >
        <Repeat2 size={13} color="#E8C97A" /> Repeat ×3
      </button>
      <div style={{ width: 1, background: 'rgba(255,255,255,0.15)', alignSelf: 'stretch' }} />
      <button
        onClick={dismiss}
        style={{ color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', minHeight: 44, display: 'flex', alignItems: 'center' }}
      >
        <X size={13} />
      </button>
    </div>
  )
}
