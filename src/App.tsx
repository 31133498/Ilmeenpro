import { useEffect, useState } from 'react'
import { Home, BookOpen, Crosshair, Brain, ChevronLeft } from 'lucide-react'
import { useNavigation } from './contexts/NavigationContext.tsx'
import speakArabic from './services/tts'
import ImageUploader from './components/ImageUploader'
import TextViewer from './components/TextViewer'
import FAB from './components/FAB'
import QuizMode from './components/QuizMode'
import SessionsScreen from './components/SessionsScreen'
import LandingPage from './components/LandingPage'
import { extractArabicText } from './services/ocr'
import { translateWords } from './services/translate'
import { buildSession, saveSession, type Session } from './services/storage'



type Stage = 'idle' | 'ocr' | 'translating' | 'done' | 'error'
type ContentType = 'poem' | 'prose' | 'table' | 'list' | 'mixed'


export default function App() {
  const [showLanding, setShowLanding] = useState(true)
  const [stage, setStage] = useState<Stage>('idle')
  const [session, setSession] = useState<Session | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [screen, setScreen] = useState<Screen>('main')
  const [focusMode, setFocusMode] = useState(false)
  const [focusLine, setFocusLine] = useState(0)
  const [imageFile, setImageFile] = useState<File | null>(null)

  // Show landing page on first load; skip it once user enters the app
  if (showLanding) {
    return <LandingPage onEnterApp={() => setShowLanding(false)} />
  }

  const handleFile = async (file: File) => {
    setError(null)
    setSession(null)
    setImageFile(file)
    setFocusMode(false)
    setScreen('main')

    try {
      // Step 1: OCR + diacritics
      setStage('ocr')
      const ocr = await extractArabicText(file)

      // Step 2: Batch word translation
      setStage('translating')
      const wordMap = await translateWords(ocr.diacritized)

      // Step 3: Build + save session
  const sess = await buildSession(ocr.raw, ocr.diacritized, wordMap, file)
  const ttsResult = await speakArabic(ocr.diacritized)
  const audioArrayBuffer = ttsResult.arrayBuffer
  const audioBase64 = btoa(String.fromCharCode(...new Uint8Array(audioArrayBuffer)))
  sess.audio = `data:audio/mpeg;base64,${audioBase64}`

  saveSession(sess)

      setSession(sess)
      setStage('done')
    } catch (err) {
      setStage('error')
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const loadSession = (s: Session) => {
    setSession(s)
    setStage('done')
    setScreen('main')
    setFocusMode(false)
  }

  const reset = () => {
    setStage('idle')
    setSession(null)
    setError(null)
    setImageFile(null)
    setFocusMode(false)
    setScreen('main')
  }

  const lines = session?.diacritized.split('\n').filter(l => l.trim()) ?? []

  return (
    <AppShell
      stage={stage}
      session={session}
      error={error}
      screen={screen}
      focusMode={focusMode}
      focusLine={focusLine}
      lines={lines}
      imageFile={imageFile}
      setScreen={setScreen}
      setFocusMode={setFocusMode}
      setFocusLine={setFocusLine}
      handleFile={handleFile}
      loadSession={loadSession}
      reset={reset}
    />
  )
}

// ── Separate component so hooks always run (rules-of-hooks with early return) ─
interface ShellProps {
  stage: Stage
  session: Session | null
  error: string | null
  screen: Screen
  focusMode: boolean
  focusLine: number
  lines: string[]
  imageFile: File | null
  setScreen: (s: Screen) => void
  setFocusMode: React.Dispatch<React.SetStateAction<boolean>>
  setFocusLine: (n: number) => void
  handleFile: (f: File) => void
  loadSession: (s: Session) => void
  reset: () => void
}

function AppShell({
  stage, session, error, screen, focusMode, focusLine, lines,
  setScreen, setFocusMode, setFocusLine, handleFile, loadSession, reset,
}: ShellProps) {

  // Escape key exits focus mode
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && focusMode) setFocusMode(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focusMode])

  const bottomNavItems = [
    {
      label: 'Home',
      icon: <Home size={20} strokeWidth={1.75} />,
      action: () => { setScreen('main') },
    },
    {
      label: 'Sessions',
      icon: <BookOpen size={20} strokeWidth={1.75} />,
      action: () => setScreen('sessions'),
    },
    {
      label: 'Focus',
      icon: <Crosshair size={20} strokeWidth={1.75} />,
      action: () => setFocusMode(f => !f),
    },
    {
      label: 'Quiz',
      icon: <Brain size={20} strokeWidth={1.75} />,
      action: () => stage === 'done' && setScreen('quiz'),
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF7', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px',
        background: 'rgba(253,251,247,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(201,168,76,0.12)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span dir="rtl" style={{ fontFamily: "'Noto Naskh Arabic', serif", fontSize: 24, fontWeight: 700, color: '#1A1611' }}>إلمين</span>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9A84C', display: 'inline-block' }} />
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: '#7A6E62', fontStyle: 'italic' }}>Ilmeen</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {stage === 'done' && session && (
            <>
              <button
                onClick={() => setFocusMode(f => !f)}
                style={{
                  minHeight: 44, padding: '8px 16px', borderRadius: 100, fontSize: 13, fontWeight: 500,
                  background: focusMode ? '#1A1611' : 'transparent',
                  color: focusMode ? '#FDFBF7' : '#7A6E62',
                  border: '1px solid rgba(201,168,76,0.3)', cursor: 'pointer',
                }}
              >
                {focusMode ? '✕ Focus' : '◎ Focus'}
              </button>
              <button
                onClick={() => setScreen('quiz')}
                style={{ minHeight: 44, padding: '8px 16px', borderRadius: 100, fontSize: 13, fontWeight: 500, background: 'transparent', color: '#7A6E62', border: '1px solid rgba(201,168,76,0.3)', cursor: 'pointer' }}
              >
                Quiz me
              </button>
            </>
          )}
          <button
            onClick={() => setScreen('sessions')}
            style={{ minHeight: 44, padding: '8px 16px', borderRadius: 100, fontSize: 13, fontWeight: 500, background: 'transparent', color: '#7A6E62', border: '1px solid rgba(201,168,76,0.3)', cursor: 'pointer' }}
          >
            Sessions
          </button>
          {stage !== 'idle' && (
            <button onClick={reset} style={{ minHeight: 44, padding: '8px 16px', fontSize: 13, color: '#7A6E62', background: 'none', border: 'none', cursor: 'pointer' }}>
              ← New scan
            </button>
          )}
        </div>
      </nav>

      <main style={{ paddingTop: 80, paddingBottom: 100, paddingLeft: 16, paddingRight: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>

        {/* Hero + uploader */}
        {stage === 'idle' && (
          <>
            <div style={{ textAlign: 'center', marginTop: 48, marginBottom: 8 }}>
              <h1 dir="rtl" style={{ fontFamily: "'Noto Naskh Arabic', serif", fontSize: 'clamp(56px, 10vw, 100px)', fontWeight: 700, color: '#1A1611', lineHeight: 1, marginBottom: 8 }}>إلمين</h1>
              <p style={{ fontFamily: "'Playfair Display', serif", color: '#C9A84C', fontStyle: 'italic', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 18, marginBottom: 16 }}>Ilmeen</p>
              <p style={{ color: '#7A6E62', fontWeight: 300, maxWidth: 400, margin: '0 auto', lineHeight: 1.7 }}>
                Snap Arabic text. Get full <strong style={{ color: '#1A1611', fontWeight: 500 }}>tashkeel</strong>, word-by-word translation, and audio.
              </p>
            </div>
            <ImageUploader onFile={handleFile} disabled={false} />
          </>
        )}

        {/* Loading states */}
        {(stage === 'ocr' || stage === 'translating') && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 80 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid #C9A84C', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: '#7A6E62', fontSize: 14 }}>
              {stage === 'ocr' ? 'Extracting text & adding tashkeel…' : 'Translating words…'}
            </p>
            <p dir="rtl" style={{ fontFamily: "'Noto Naskh Arabic', serif", color: '#7A6E62', fontSize: 16 }}>
              {stage === 'ocr' ? 'جارٍ استخراج النص وإضافة التشكيل…' : 'جارٍ ترجمة الكلمات…'}
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {/* Error */}
        {stage === 'error' && error && (
          <div style={{ maxWidth: 480, width: '100%', background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 16, padding: 24, textAlign: 'center' }}>
            <p style={{ color: '#c53030', fontWeight: 500, marginBottom: 8 }}>Something went wrong · حدث خطأ</p>
            <p style={{ color: '#e53e3e', fontSize: 13, marginBottom: 8 }}>{error}</p>
            <p dir="rtl" style={{ fontFamily: "'Noto Naskh Arabic', serif", color: '#fc8181', fontSize: 14, marginBottom: 16 }}>يرجى المحاولة مرة أخرى</p>
            <button onClick={reset} style={{ padding: '10px 24px', borderRadius: 100, background: '#1A1611', color: '#FDFBF7', fontSize: 14, border: 'none', cursor: 'pointer', minHeight: 44 }}>
              Try again · حاول مجدداً
            </button>
          </div>
        )}

        {/* Session loaded */}
        {stage === 'done' && session && (
          <div style={{ width: '100%', maxWidth: 720 }}>
            {/* Raw text */}
            <div style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 16, padding: '16px 20px', marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', color: '#7A6E62', marginBottom: 10 }}>Extracted · النص المستخرج</p>
              <div dir="rtl">
                {session.raw.split('\n').map((line, i) => (
                  <div key={i} style={{ fontFamily: "'Noto Naskh Arabic', serif", fontSize: 26, fontWeight: 500, lineHeight: '2.2', direction: 'rtl', textAlign: 'right', color: '#7A6E62' }}>
                    {line || '\u00A0'}
                  </div>
                ))}
              </div>
            </div>

            {/* Diacritized + interactive */}
            <div style={{ background: '#fff', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 16, padding: '16px 20px', boxShadow: '0 2px 16px rgba(26,22,17,0.06)' }}>
              <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 10 }}>
                With tashkeel · مع التشكيل
                {focusMode && <span style={{ marginLeft: 12, color: '#7A6E62', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>Line {focusLine + 1} of {lines.length}</span>}
              </p>
              <TextViewer
                session={session}
                focusMode={focusMode}
                onFocusLineChange={setFocusLine}
              />
            </div>

            <button
              onClick={reset}
              style={{ marginTop: 20, padding: '10px 24px', borderRadius: 100, border: '1px solid rgba(201,168,76,0.3)', color: '#7A6E62', background: 'none', fontSize: 13, cursor: 'pointer', minHeight: 44 }}
            >
              Scan another · مسح آخر
            </button>
          </div>
        )}
      </main>

      {/* FAB — full text playback */}
      {stage === 'done' && session && <FAB diacritized={session.diacritized} />}

      {/* Overlay screens */}
      {screen === 'sessions' && (
        <SessionsScreen onLoad={loadSession} onClose={() => setScreen('main')} />
      )}
      {screen === 'quiz' && session && (
        <QuizMode diacritized={session.diacritized} onClose={() => setScreen('main')} />
      )}

      {/* Mobile bottom nav */}
      <div
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 90,
          display: 'flex', background: 'rgba(253,251,247,0.95)', backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(201,168,76,0.12)',
          padding: '8px 0 env(safe-area-inset-bottom)',
        }}
        className="md:hidden"
      >
        {bottomNavItems.map(item => (
          <button
            key={item.label}
            onClick={item.action}
            style={{
              flex: 1, minHeight: 56,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 4,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#7A6E62',
            }}
          >
            {item.icon}
            <span style={{ fontSize: 10, fontWeight: 500 }}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
