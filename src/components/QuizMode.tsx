import { useRef, useState } from 'react'
import { X } from 'lucide-react'
import speakArabic from '../services/tts'

interface Props {
  diacritized: string
  onClose: () => void
}

type WordState = { word: string; blanked: boolean; userInput: string; revealed: boolean; shake: boolean }

function buildQuiz(text: string, ratio: number): WordState[] {
  const words = text.split(/(\s+)/)
  return words.map(w => {
    const isWord = /\S/.test(w)
    const blanked = isWord && Math.random() < ratio
    return { word: w, blanked, userInput: '', revealed: false, shake: false }
  })
}

export default function QuizMode({ diacritized, onClose }: Props) {
  const [difficulty, setDifficulty] = useState(0.4)
  const [states, setStates] = useState<WordState[]>(() => buildQuiz(diacritized, 0.4))
  const [revealAll, setRevealAll] = useState(false)
  const inputRefs = useRef<Map<number, HTMLInputElement>>(new Map())

  const restart = (d: number) => {
    setDifficulty(d)
    setStates(buildQuiz(diacritized, d))
    setRevealAll(false)
  }

  const handleTapBlank = async (i: number) => {
    if (navigator.vibrate) navigator.vibrate(30)
    try { await speakArabic(states[i].word) } catch {}
    inputRefs.current.get(i)?.focus()
  }

  const handleInput = (i: number, val: string) => {
    setStates(prev => prev.map((s, idx) => idx === i ? { ...s, userInput: val } : s))
  }

  const handleSubmit = (i: number) => {
    const s = states[i]
    const correct = s.userInput.trim() === s.word.trim()
    if (correct) {
      setStates(prev => prev.map((st, idx) => idx === i ? { ...st, revealed: true } : st))
    } else {
      setStates(prev => prev.map((st, idx) => idx === i ? { ...st, shake: true } : st))
      setTimeout(() => setStates(prev => prev.map((st, idx) => idx === i ? { ...st, shake: false } : st)), 500)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 600, background: '#FDFBF7', overflowY: 'auto', padding: '80px 24px 120px' }}>
      <style>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
        .shake { animation: shake 0.4s ease }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#1A1611' }}>Quiz Mode</h2>
        <button onClick={onClose} style={{ fontSize: 14, color: '#7A6E62', background: 'none', border: 'none', cursor: 'pointer', minHeight: 44, padding: '0 8px' }}><X className="w-4 h-4" /> Close</button>
      </div>

      {/* Difficulty */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <span style={{ fontSize: 13, color: '#7A6E62' }}>Easy</span>
        <input type="range" min={0.2} max={0.6} step={0.2} value={difficulty}
          onChange={e => restart(parseFloat(e.target.value))}
          style={{ flex: 1, accentColor: '#C9A84C' }} />
        <span style={{ fontSize: 13, color: '#7A6E62' }}>Hard</span>
        <span style={{ fontSize: 12, color: '#C9A84C', fontWeight: 600, minWidth: 40 }}>
          {difficulty === 0.2 ? 'Easy' : difficulty === 0.4 ? 'Medium' : 'Hard'}
        </span>
      </div>

      {/* Text */}
      <div dir="rtl" style={{ fontFamily: "'Noto Naskh Arabic', serif", fontSize: 26, lineHeight: 2.4, textAlign: 'right' }}>
        {states.map((s, i) => {
          if (!s.blanked || /^\s+$/.test(s.word)) return <span key={i}>{s.word}</span>
          if (s.revealed || revealAll) {
            return <span key={i} style={{ color: '#C9A84C', fontWeight: 600 }}>{s.word}</span>
          }
          return (
            <span key={i} className={s.shake ? 'shake' : ''} style={{ display: 'inline-block', position: 'relative', margin: '0 2px' }}>
              <span
                onClick={() => handleTapBlank(i)}
                style={{ display: 'inline-block', minWidth: 60, borderBottom: '2px solid #C9A84C', cursor: 'pointer', textAlign: 'center', color: 'transparent', userSelect: 'none' }}
              >
                {s.word}
              </span>
              <input
                ref={el => { if (el) inputRefs.current.set(i, el) }}
                value={s.userInput}
                onChange={e => handleInput(i, e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit(i)}
                dir="rtl"
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  background: 'transparent', border: 'none', outline: 'none',
                  fontFamily: "'Noto Naskh Arabic', serif", fontSize: 26,
                  textAlign: 'center', color: '#1A1611', width: '100%',
                }}
              />
            </span>
          )
        })}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, marginTop: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => setRevealAll(true)}
          style={{ padding: '12px 24px', borderRadius: 100, background: '#1A1611', color: '#FDFBF7', fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer', minHeight: 44 }}
        >
          Reveal all
        </button>
        <button
          onClick={() => restart(difficulty)}
          style={{ padding: '12px 24px', borderRadius: 100, background: 'transparent', color: '#1A1611', fontSize: 14, border: '1px solid rgba(201,168,76,0.4)', cursor: 'pointer', minHeight: 44 }}
        >
          Retry
        </button>
      </div>
    </div>
  )
}
