import { useCallback, useEffect, useRef, useState } from 'react'
import { Play, Repeat2, CheckCircle, Circle, Minus, Plus } from 'lucide-react'
import type { WordEntry } from '../services/translate'
import type { Session } from '../services/storage'
import { updateMemorized } from '../services/storage'
import speakArabic from '../services/tts'
import SelectionBar from './SelectionBar'
import MobileBottomSheet from './MobileBottomSheet'

interface Props {
  session: Session
  focusMode: boolean
  onFocusLineChange?: (line: number) => void
}

const TYPE_COLORS: Record<string, string> = {
  verb: '#C9A84C', noun: '#4A90D9', adjective: '#7B68EE', particle: '#888',
}

function WordSpan({ word, entry, isMobile, onTap }: {
  word: string; entry?: WordEntry; isMobile: boolean; onTap: (e: WordEntry) => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <span style={{ position: 'relative', display: 'inline-block', margin: '0 2px' }}>
      <span
        onMouseEnter={() => { if (!isMobile && entry) setHovered(true) }}
        onMouseLeave={() => setHovered(false)}
        onTouchStart={() => { if (isMobile && entry) { onTap(entry); if (navigator.vibrate) navigator.vibrate(30) } }}
        style={{ cursor: entry ? 'pointer' : 'default', borderBottom: entry ? '1px dotted rgba(201,168,76,0.5)' : 'none' }}
      >
        {word}
      </span>
      {hovered && entry && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%',
          transform: 'translateX(-50%)', background: '#fff',
          border: '1px solid rgba(201,168,76,0.35)', borderRadius: 12,
          padding: '10px 14px', boxShadow: '0 4px 24px rgba(26,22,17,0.12)',
          zIndex: 200, minWidth: 140, pointerEvents: 'none', whiteSpace: 'nowrap',
        }}>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#1A1611', fontWeight: 500 }}>{entry.meaning}</div>
          {entry.root && <div style={{ fontFamily: "'Noto Naskh Arabic',serif", fontSize: 15, color: '#C9A84C', direction: 'rtl', marginTop: 2 }}>{entry.root}</div>}
          <span style={{
            display: 'inline-block', marginTop: 4, fontSize: 10, fontWeight: 600,
            letterSpacing: '0.5px', textTransform: 'uppercase',
            color: TYPE_COLORS[entry.type] ?? '#888',
            background: `${TYPE_COLORS[entry.type] ?? '#888'}18`,
            borderRadius: 4, padding: '1px 6px',
          }}>{entry.type}</span>
        </div>
      )}
    </span>
  )
}

export default function TextViewer({ session, focusMode, onFocusLineChange }: Props) {
  const lines = session.diacritized.split('\n').filter(l => l.trim())
  const wordIndex = useRef<Map<string, WordEntry>>(new Map())
  const [activeLine, setActiveLine] = useState<number | null>(null)
  const [memorized, setMemorized] = useState<Set<number>>(new Set(session.memorizedLines))
  const [loopLine, setLoopLine] = useState<number | null>(null)
  const [fontSize, setFontSize] = useState(28)
  const [bottomSheetEntry, setBottomSheetEntry] = useState<WordEntry | null>(null)
  const loopRef = useRef(false)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const isMobile = window.innerWidth < 768

  useEffect(() => {
    const m = new Map<string, WordEntry>()
    session.wordMap.forEach(e => m.set(e.word, e))
    wordIndex.current = m
  }, [session.wordMap])

  useEffect(() => {
    if (!focusMode) return
    const cur = activeLine ?? 0
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') navigate(Math.min(cur + 1, lines.length - 1))
      if (e.key === 'ArrowUp') navigate(Math.max(cur - 1, 0))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [focusMode, activeLine, lines.length])

  const navigate = useCallback((idx: number) => {
    setActiveLine(idx)
    onFocusLineChange?.(idx)
    playLine(idx)
  }, [lines])

  const touchStartY = useRef(0)
  const onTouchStart = (e: React.TouchEvent) => { touchStartY.current = e.touches[0].clientY }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!focusMode) return
    const dy = touchStartY.current - e.changedTouches[0].clientY
    const cur = activeLine ?? 0
    if (dy > 40) navigate(Math.min(cur + 1, lines.length - 1))
    if (dy < -40) navigate(Math.max(cur - 1, 0))
  }

  const playLine = async (idx: number) => {
    sourceRef.current?.stop()
    try {
      const result = await speakArabic(lines[idx])
      sourceRef.current = result.source
    } catch {}
  }

  const stopLoop = () => {
    loopRef.current = false
    setLoopLine(null)
    sourceRef.current?.stop()
  }

  const startLoop = async (idx: number) => {
    if (loopLine === idx) { stopLoop(); return }
    stopLoop()
    setLoopLine(idx)
    loopRef.current = true
    const run = async () => {
      while (loopRef.current) {
        try {
          const result = await speakArabic(lines[idx])
          sourceRef.current = result.source
          await new Promise<void>(res => { result.source.onended = () => res() })
          if (loopRef.current) await new Promise(res => setTimeout(res, 1500))
        } catch { break }
      }
    }
    run()
  }

  const toggleMemorized = (idx: number) => {
    setMemorized(prev => {
      const next = new Set(prev)
      next.has(idx) ? next.delete(idx) : next.add(idx)
      updateMemorized(session.id, [...next])
      return next
    })
  }

  const fontSizes = [24, 28, 32, 36]
  const nextFont = () => setFontSize(f => fontSizes[Math.min(fontSizes.indexOf(f) + 1, fontSizes.length - 1)])
  const prevFont = () => setFontSize(f => fontSizes[Math.max(fontSizes.indexOf(f) - 1, 0)])

  return (
    <div style={{ position: 'relative', touchAction: 'manipulation' }} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <SelectionBar />

      {/* Font size controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, justifyContent: 'flex-end' }}>
        <button onClick={prevFont} style={{ minWidth: 44, minHeight: 44, borderRadius: 8, border: '1px solid rgba(201,168,76,0.3)', background: 'none', cursor: 'pointer', color: '#7A6E62', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Minus size={14} />
        </button>
        <span style={{ fontSize: 12, color: '#7A6E62', minWidth: 32, textAlign: 'center' }}>{fontSize}px</span>
        <button onClick={nextFont} style={{ minWidth: 44, minHeight: 44, borderRadius: 8, border: '1px solid rgba(201,168,76,0.3)', background: 'none', cursor: 'pointer', color: '#7A6E62', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={14} />
        </button>
      </div>

      {/* Lines */}
      <div style={{ overflowY: 'auto', maxHeight: '60vh', paddingRight: 4 }}>
        {lines.map((line, idx) => {
          const isActive = activeLine === idx
          const isMemorized = memorized.has(idx)
          const isLooping = loopLine === idx
          const opacity = focusMode ? (isActive ? 1 : 0.3) : 1
          const words = line.split(' ').filter(Boolean)

          return (
            <div key={idx} data-line-index={idx} style={{ marginBottom: 4 }}>
              <div
                onClick={() => { setActiveLine(idx); onFocusLineChange?.(idx) }}
                style={{
                  fontFamily: "'Noto Naskh Arabic', serif",
                  fontSize: `${fontSize}px`, fontWeight: 500,
                  lineHeight: '2.2', direction: 'rtl', textAlign: 'right',
                  color: isMemorized ? '#2d7a4f' : '#1A1611',
                  opacity, transition: 'opacity 0.3s, background 0.2s',
                  background: isActive ? 'rgba(201,168,76,0.1)' : 'transparent',
                  borderRadius: 8, padding: '2px 8px', cursor: 'pointer',
                }}
              >
                {words.map((w, wi) => (
                  <WordSpan key={wi} word={w} entry={wordIndex.current.get(w)} isMobile={isMobile} onTap={setBottomSheetEntry} />
                ))}
                {isMemorized && <CheckCircle size={16} color="#2d7a4f" style={{ marginRight: 8, display: 'inline', verticalAlign: 'middle' }} />}
              </div>

              {isActive && (
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', padding: '4px 8px 8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => playLine(idx)}
                    style={{ minHeight: 44, padding: '6px 14px', borderRadius: 100, background: '#1A1611', color: '#FDFBF7', fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Play size={13} fill="#FDFBF7" /> Play line
                  </button>
                  <button
                    onClick={() => startLoop(idx)}
                    style={{ minHeight: 44, padding: '6px 14px', borderRadius: 100, background: isLooping ? '#C9A84C' : 'transparent', color: isLooping ? '#1A1611' : '#7A6E62', fontSize: 13, border: '1px solid rgba(201,168,76,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Repeat2 size={13} /> {isLooping ? 'Stop loop' : 'Loop'}
                  </button>
                  <button
                    onClick={() => toggleMemorized(idx)}
                    style={{ minHeight: 44, padding: '6px 14px', borderRadius: 100, background: isMemorized ? '#e6f4ed' : 'transparent', color: isMemorized ? '#2d7a4f' : '#7A6E62', fontSize: 13, border: `1px solid ${isMemorized ? '#2d7a4f' : 'rgba(201,168,76,0.4)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    {isMemorized ? <CheckCircle size={13} /> : <Circle size={13} />} Memorized
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {focusMode && activeLine !== null && (
        <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: '#7A6E62' }}>
          Line {activeLine + 1} of {lines.length}
        </div>
      )}

      <MobileBottomSheet entry={bottomSheetEntry} onClose={() => setBottomSheetEntry(null)} />
    </div>
  )
}
