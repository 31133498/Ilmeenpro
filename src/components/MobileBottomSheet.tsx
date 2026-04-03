import { X } from 'lucide-react'
import type { WordEntry } from '../services/translate'

interface Props {
  entry: WordEntry | null
  onClose: () => void
}

const TYPE_COLORS: Record<string, string> = {
  verb: '#C9A84C',
  noun: '#4A90D9',
  adjective: '#7B68EE',
  particle: '#888',
}

export default function MobileBottomSheet({ entry, onClose }: Props) {
  if (!entry) return null

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.2)' }}
      />
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 301,
        background: '#fff', borderRadius: '20px 20px 0 0',
        padding: '24px 24px 40px',
        boxShadow: '0 -4px 32px rgba(26,22,17,0.12)',
        border: '1px solid rgba(201,168,76,0.2)',
        animation: 'slideUp 0.22s ease',
      }}>
        <style>{`@keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }`}</style>
        <div style={{ width: 40, height: 4, background: '#e0d8cc', borderRadius: 2, margin: '0 auto 20px' }} />
        <div dir="rtl" style={{ fontFamily: "'Noto Naskh Arabic', serif", fontSize: '32px', fontWeight: 600, color: '#1A1611', marginBottom: 8 }}>
          {entry.word}
        </div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '18px', color: '#1A1611', fontWeight: 500, marginBottom: 6 }}>
          {entry.meaning}
        </div>
        {entry.root && (
          <div style={{ fontFamily: "'Noto Naskh Arabic', serif", fontSize: '20px', color: '#C9A84C', direction: 'rtl', marginBottom: 8 }}>
            Root: {entry.root}
          </div>
        )}
        <span style={{
          display: 'inline-block', fontSize: '12px', fontWeight: 600,
          letterSpacing: '0.5px', textTransform: 'uppercase',
          color: TYPE_COLORS[entry.type] ?? '#888',
          background: `${TYPE_COLORS[entry.type] ?? '#888'}18`,
          borderRadius: '6px', padding: '3px 10px',
        }}>
          {entry.type}
        </span>
      </div>
    </>
  )
}
