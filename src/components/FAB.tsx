import { useEffect, useRef, useState } from 'react'
import speakArabic from '../services/tts'

// On mobile the bottom nav bar is ~72 px; lift the FAB above it.
const isMobile = () => window.innerWidth < 768

interface Props {
  diacritized: string
}

const R = 22
const CIRC = 2 * Math.PI * R

export default function FAB({ diacritized }: Props) {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const rafRef = useRef<number>(0)

  const stopRing = () => {
    cancelAnimationFrame(rafRef.current)
    setProgress(0)
  }

  const play = async () => {
    if (loading) return
    sourceRef.current?.stop()
    stopRing()
    setLoading(true)

    try {
      const source = await speakArabic(diacritized)
      sourceRef.current = source
      setLoading(false)

      const totalWords = diacritized.split(/\s+/).filter(Boolean).length
      const estimatedMs = totalWords * 400
      const start = performance.now()

      const tick = () => {
        const elapsed = performance.now() - start
        const p = Math.min(elapsed / estimatedMs, 1)
        setProgress(p)
        if (p < 1) rafRef.current = requestAnimationFrame(tick)
        else stopRing()
      }
      rafRef.current = requestAnimationFrame(tick)

      source.onended = () => { stopRing(); sourceRef.current = null }
    } catch (e) {
      setLoading(false)
      console.error('FAB TTS error:', e)
    }
  }

  const stop = () => {
    sourceRef.current?.stop()
    sourceRef.current = null
    stopRing()
  }

  useEffect(() => () => { cancelAnimationFrame(rafRef.current) }, [])

  const isPlaying = progress > 0 && progress < 1
  const strokeDash = CIRC * (1 - progress)

  return (
    <button
      onClick={isPlaying ? stop : play}
      aria-label={isPlaying ? 'Stop' : 'Play full text'}
      style={{
        position: 'fixed', bottom: isMobile() ? 88 : 24, right: 24, zIndex: 500,
        width: 56, height: 56, borderRadius: '50%',
        background: '#C9A84C', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(201,168,76,0.45)',
        transition: 'transform 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <svg width="56" height="56" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
        <circle cx="28" cy="28" r={R} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
        <circle
          cx="28" cy="28" r={R} fill="none"
          stroke="rgba(255,255,255,0.9)" strokeWidth="3"
          strokeDasharray={CIRC}
          strokeDashoffset={strokeDash}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>
      {loading
        ? <span style={{ width: 18, height: 18, border: '2px solid #1A1611', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
        : <span style={{ color: '#1A1611', fontSize: 20, lineHeight: 1 }}>{isPlaying ? '■' : '▶'}</span>
      }
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </button>
  )
}
