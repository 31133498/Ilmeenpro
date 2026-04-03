import { Camera, Sparkles, Volume2, BookOpen, Play, Search, Zap, Repeat1 } from 'lucide-react'

interface Props {
  onEnterApp: () => void
}

const CSS = `
.ilmeen-lp *, .ilmeen-lp *::before, .ilmeen-lp *::after { box-sizing: border-box; margin: 0; padding: 0; }
.ilmeen-lp {
  --lp-gold: #C9A84C;
  --lp-gold-light: #E8C97A;
  --lp-gold-pale: #F5EDD8;
  --lp-cream: #FDFBF7;
  --lp-white: #FFFFFF;
  --lp-ink: #1A1611;
  --lp-ink-soft: #3D3428;
  --lp-ink-muted: #7A6E62;
  --lp-glass-bg: rgba(255,255,255,0.65);
  --lp-glass-border: rgba(201,168,76,0.18);
  --lp-shadow-soft: 0 4px 32px rgba(26,22,17,0.06);
  --lp-shadow-card: 0 2px 24px rgba(26,22,17,0.08);
  --lp-radius-sm: 12px;
  --lp-radius-md: 20px;
  --lp-radius-lg: 32px;
  font-family: 'DM Sans', sans-serif;
  background-color: var(--lp-cream);
  color: var(--lp-ink);
  overflow-x: hidden;
  min-height: 100vh;
  position: relative;
}

.ilmeen-lp html { scroll-behavior: smooth; }

/* Background mesh */
.ilmeen-lp .lp-bg-mesh { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
.ilmeen-lp .lp-bg-mesh::before { content: ''; position: absolute; top: -20%; right: -10%; width: 700px; height: 700px; border-radius: 50%; background: radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 70%); }
.ilmeen-lp .lp-bg-mesh::after { content: ''; position: absolute; bottom: -10%; left: -10%; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%); }
.ilmeen-lp .lp-bg-orb-mid { position: fixed; top: 40%; left: 30%; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(ellipse, rgba(201,168,76,0.05) 0%, transparent 70%); pointer-events: none; z-index: 0; }

/* Nav */
.ilmeen-lp .lp-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 20px 48px; display: flex; align-items: center; justify-content: space-between; background: rgba(253,251,247,0.72); backdrop-filter: blur(24px); border-bottom: 1px solid rgba(201,168,76,0.12); }
.ilmeen-lp .lp-nav-logo { display: flex; align-items: center; gap: 12px; }
.ilmeen-lp .lp-nav-arabic { font-family: 'Noto Naskh Arabic', serif; font-size: 26px; font-weight: 700; color: var(--lp-ink); letter-spacing: -0.5px; direction: rtl; }
.ilmeen-lp .lp-nav-dot { width: 6px; height: 6px; background: var(--lp-gold); border-radius: 50%; }
.ilmeen-lp .lp-nav-latin { font-family: 'Playfair Display', serif; font-size: 17px; font-weight: 400; color: var(--lp-ink-muted); letter-spacing: 0.5px; }
.ilmeen-lp .lp-nav-links { display: flex; align-items: center; gap: 36px; list-style: none; }
.ilmeen-lp .lp-nav-links a { text-decoration: none; font-size: 14px; font-weight: 400; color: var(--lp-ink-muted); letter-spacing: 0.3px; transition: color 0.2s; }
.ilmeen-lp .lp-nav-links a:hover { color: var(--lp-ink); }
.ilmeen-lp .lp-nav-cta { background: var(--lp-ink); color: var(--lp-cream) !important; padding: 10px 22px; border-radius: 100px; font-weight: 500 !important; font-size: 13px !important; transition: background 0.2s, transform 0.15s !important; }
.ilmeen-lp .lp-nav-cta:hover { background: var(--lp-ink-soft) !important; transform: translateY(-1px); }

/* Hero */
.ilmeen-lp .lp-hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 140px 24px 80px; }
.ilmeen-lp .lp-badge { display: inline-flex; align-items: center; gap: 8px; background: var(--lp-glass-bg); backdrop-filter: blur(20px); border: 1px solid var(--lp-glass-border); border-radius: 100px; padding: 8px 18px; margin-bottom: 40px; font-size: 12px; font-weight: 500; color: var(--lp-ink-soft); letter-spacing: 1px; text-transform: uppercase; animation: lpFadeUp 0.6s ease both; }
.ilmeen-lp .lp-badge-dot { width: 6px; height: 6px; background: var(--lp-gold); border-radius: 50%; animation: lpPulseDot 2s infinite; }
.ilmeen-lp .lp-hero-arabic { font-family: 'Noto Naskh Arabic', serif; font-size: clamp(72px, 12vw, 140px); font-weight: 700; line-height: 1.0; color: var(--lp-ink); direction: rtl; margin-bottom: 8px; letter-spacing: -2px; animation: lpFadeUp 0.6s 0.1s ease both; }
.ilmeen-lp .lp-hero-latin { font-family: 'Playfair Display', serif; font-size: clamp(16px, 3vw, 24px); font-weight: 400; font-style: italic; color: var(--lp-gold); letter-spacing: 4px; margin-bottom: 36px; text-transform: uppercase; animation: lpFadeUp 0.6s 0.2s ease both; }
.ilmeen-lp .lp-hero-tagline { font-size: clamp(16px, 2.5vw, 22px); font-weight: 300; color: var(--lp-ink-muted); max-width: 560px; line-height: 1.7; margin-bottom: 52px; animation: lpFadeUp 0.6s 0.3s ease both; }
.ilmeen-lp .lp-hero-tagline strong { color: var(--lp-ink); font-weight: 500; }
.ilmeen-lp .lp-hero-actions { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; justify-content: center; animation: lpFadeUp 0.6s 0.4s ease both; }
.ilmeen-lp .lp-hero-demo { margin-top: 80px; width: 100%; max-width: 860px; animation: lpFadeUp 0.6s 0.5s ease both; }

/* Buttons */
.ilmeen-lp .lp-btn-primary { display: inline-flex; align-items: center; gap: 10px; background: var(--lp-ink); color: var(--lp-cream); padding: 16px 32px; border-radius: 100px; font-size: 15px; font-weight: 500; text-decoration: none; transition: all 0.2s; letter-spacing: 0.2px; border: none; cursor: pointer; }
.ilmeen-lp .lp-btn-primary:hover { background: var(--lp-ink-soft); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(26,22,17,0.15); }
.ilmeen-lp .lp-btn-secondary { display: inline-flex; align-items: center; gap: 10px; background: var(--lp-glass-bg); backdrop-filter: blur(20px); border: 1px solid var(--lp-glass-border); color: var(--lp-ink); padding: 16px 32px; border-radius: 100px; font-size: 15px; font-weight: 400; text-decoration: none; transition: all 0.2s; cursor: pointer; }
.ilmeen-lp .lp-btn-secondary:hover { border-color: var(--lp-gold); transform: translateY(-2px); }

/* Demo card */
.ilmeen-lp .lp-demo-card { background: var(--lp-glass-bg); backdrop-filter: blur(20px); border: 1px solid rgba(201,168,76,0.15); border-radius: var(--lp-radius-lg); padding: 40px; box-shadow: var(--lp-shadow-soft), 0 0 0 1px rgba(255,255,255,0.8) inset; position: relative; overflow: hidden; }
.ilmeen-lp .lp-demo-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent); }
.ilmeen-lp .lp-demo-steps { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; align-items: start; gap: 0; }
.ilmeen-lp .lp-demo-step { text-align: center; padding: 0 16px; }
.ilmeen-lp .lp-demo-step-icon { width: 52px; height: 52px; border-radius: var(--lp-radius-sm); background: var(--lp-white); border: 1px solid rgba(201,168,76,0.2); display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; box-shadow: var(--lp-shadow-card); }
.ilmeen-lp .lp-demo-step-label { font-size: 13px; font-weight: 500; color: var(--lp-ink); margin-bottom: 4px; }
.ilmeen-lp .lp-demo-step-sub { font-size: 12px; color: var(--lp-ink-muted); font-weight: 300; }
.ilmeen-lp .lp-demo-arrow { color: var(--lp-gold-light); font-size: 20px; padding-top: 14px; user-select: none; }
.ilmeen-lp .lp-arabic-showcase { margin-top: 20px; padding: 28px; background: var(--lp-white); border-radius: var(--lp-radius-md); border: 1px solid rgba(201,168,76,0.12); text-align: center; }
.ilmeen-lp .lp-arabic-sample { font-family: 'Noto Naskh Arabic', serif; font-size: 32px; font-weight: 600; direction: rtl; color: var(--lp-ink); line-height: 1.8; margin-bottom: 10px; }
.ilmeen-lp .lp-arabic-translit { font-family: 'Playfair Display', serif; font-size: 14px; font-style: italic; color: var(--lp-gold); letter-spacing: 1px; }

/* Section commons */
.ilmeen-lp .lp-section { padding: 120px 24px; position: relative; }
.ilmeen-lp .lp-container { max-width: 1100px; margin: 0 auto; }
.ilmeen-lp .lp-section-label { font-size: 11px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: var(--lp-gold); margin-bottom: 16px; }
.ilmeen-lp .lp-section-title { font-family: 'Playfair Display', serif; font-size: clamp(32px, 5vw, 52px); font-weight: 700; color: var(--lp-ink); line-height: 1.15; margin-bottom: 20px; }
.ilmeen-lp .lp-section-sub { font-size: 17px; font-weight: 300; color: var(--lp-ink-muted); max-width: 520px; line-height: 1.75; }

/* How it works */
.ilmeen-lp .lp-how-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; margin-top: 72px; }
.ilmeen-lp .lp-steps-list { display: flex; flex-direction: column; gap: 32px; }
.ilmeen-lp .lp-step-item { display: flex; gap: 20px; align-items: flex-start; }
.ilmeen-lp .lp-step-num { width: 36px; height: 36px; border-radius: 50%; background: var(--lp-gold-pale); border: 1px solid rgba(201,168,76,0.25); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 500; color: var(--lp-gold); flex-shrink: 0; margin-top: 2px; }
.ilmeen-lp .lp-step-content h3 { font-size: 16px; font-weight: 500; color: var(--lp-ink); margin-bottom: 6px; }
.ilmeen-lp .lp-step-content p { font-size: 14px; font-weight: 300; color: var(--lp-ink-muted); line-height: 1.7; }
.ilmeen-lp .lp-phone-mockup { background: var(--lp-glass-bg); backdrop-filter: blur(20px); border: 1px solid var(--lp-glass-border); border-radius: 36px; padding: 32px 24px; box-shadow: var(--lp-shadow-soft), 0 0 0 1px rgba(255,255,255,0.8) inset; max-width: 320px; margin: 0 auto; }
.ilmeen-lp .lp-phone-top { width: 60px; height: 6px; background: rgba(26,22,17,0.1); border-radius: 3px; margin: 0 auto 28px; }
.ilmeen-lp .lp-phone-camera { background: var(--lp-white); border-radius: var(--lp-radius-md); padding: 20px; margin-bottom: 16px; border: 1px dashed rgba(201,168,76,0.3); text-align: center; position: relative; overflow: hidden; }
.ilmeen-lp .lp-scan-line { position: absolute; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--lp-gold), transparent); animation: lpScan 2s ease-in-out infinite; }
.ilmeen-lp .lp-phone-result { background: var(--lp-white); border-radius: var(--lp-radius-md); padding: 20px; border: 1px solid rgba(201,168,76,0.15); margin-bottom: 16px; }
.ilmeen-lp .lp-phone-arabic { font-family: 'Noto Naskh Arabic', serif; font-size: 20px; font-weight: 500; direction: rtl; text-align: right; color: var(--lp-ink); line-height: 2; margin-bottom: 8px; }
.ilmeen-lp .lp-phone-tag { display: inline-flex; align-items: center; gap: 4px; background: var(--lp-gold-pale); color: var(--lp-gold); font-size: 11px; font-weight: 500; padding: 4px 10px; border-radius: 100px; letter-spacing: 0.5px; }
.ilmeen-lp .lp-phone-play-btn { background: var(--lp-ink); color: var(--lp-cream); border: none; border-radius: 100px; padding: 14px 24px; font-size: 14px; font-weight: 500; width: 100%; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; }
.ilmeen-lp .lp-phone-play-btn:hover { background: var(--lp-ink-soft); }

/* Features */
.ilmeen-lp .lp-features-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; margin-top: 64px; }
.ilmeen-lp .lp-feature-card { background: var(--lp-glass-bg); backdrop-filter: blur(20px); border: 1px solid var(--lp-glass-border); border-radius: var(--lp-radius-md); padding: 32px 28px; box-shadow: var(--lp-shadow-card); transition: all 0.25s; position: relative; overflow: hidden; }
.ilmeen-lp .lp-feature-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(201,168,76,0.35), transparent); }
.ilmeen-lp .lp-feature-card:hover { transform: translateY(-4px); box-shadow: var(--lp-shadow-soft); border-color: rgba(201,168,76,0.3); }
.ilmeen-lp .lp-feature-icon { width: 48px; height: 48px; border-radius: var(--lp-radius-sm); background: var(--lp-gold-pale); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
.ilmeen-lp .lp-feature-title { font-size: 16px; font-weight: 500; color: var(--lp-ink); margin-bottom: 10px; }
.ilmeen-lp .lp-feature-desc { font-size: 14px; font-weight: 300; color: var(--lp-ink-muted); line-height: 1.75; }

/* Arabic section */
.ilmeen-lp .lp-arabic-section { text-align: center; }
.ilmeen-lp .lp-quran-showcase { margin-top: 64px; background: var(--lp-glass-bg); backdrop-filter: blur(20px); border: 1px solid var(--lp-glass-border); border-radius: var(--lp-radius-lg); padding: 64px 48px; box-shadow: var(--lp-shadow-soft); position: relative; overflow: hidden; }
.ilmeen-lp .lp-quran-ornament { font-size: 28px; color: var(--lp-gold-light); margin-bottom: 32px; letter-spacing: 8px; }
.ilmeen-lp .lp-quran-verse { font-family: 'Noto Naskh Arabic', serif; font-size: clamp(28px,5vw,48px); font-weight: 600; direction: rtl; color: var(--lp-ink); line-height: 2; margin-bottom: 24px; }
.ilmeen-lp .lp-quran-translation { font-family: 'Playfair Display', serif; font-size: 16px; font-style: italic; color: var(--lp-ink-muted); max-width: 500px; margin: 0 auto 8px; line-height: 1.8; }
.ilmeen-lp .lp-quran-ref { font-size: 12px; color: var(--lp-gold); letter-spacing: 1px; font-weight: 500; text-transform: uppercase; }

/* CTA */
.ilmeen-lp .lp-cta-section { text-align: center; padding-bottom: 160px; }
.ilmeen-lp .lp-cta-card { background: var(--lp-ink); border-radius: var(--lp-radius-lg); padding: 80px 48px; position: relative; overflow: hidden; }
.ilmeen-lp .lp-cta-card::before { content: ''; position: absolute; top: -50%; right: -10%; width: 500px; height: 500px; background: radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 70%); border-radius: 50%; }
.ilmeen-lp .lp-cta-label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--lp-gold); margin-bottom: 20px; font-weight: 500; }
.ilmeen-lp .lp-cta-title { font-family: 'Playfair Display', serif; font-size: clamp(32px,5vw,52px); font-weight: 700; color: var(--lp-white); margin-bottom: 20px; line-height: 1.15; }
.ilmeen-lp .lp-cta-arabic { font-family: 'Noto Naskh Arabic', serif; font-size: clamp(24px,4vw,40px); font-weight: 600; color: var(--lp-gold-light); direction: rtl; display: block; margin-bottom: 8px; }
.ilmeen-lp .lp-cta-sub { font-size: 16px; font-weight: 300; color: rgba(255,255,255,0.55); margin-bottom: 48px; line-height: 1.7; }

/* Footer */
.ilmeen-lp .lp-footer { border-top: 1px solid rgba(201,168,76,0.12); padding: 40px 48px; display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 1; }
.ilmeen-lp .lp-footer-logo { font-family: 'Noto Naskh Arabic', serif; font-size: 22px; font-weight: 700; direction: rtl; color: var(--lp-ink); }
.ilmeen-lp .lp-footer-text { font-size: 13px; color: var(--lp-ink-muted); font-weight: 300; }
.ilmeen-lp .lp-footer-links { display: flex; gap: 24px; }
.ilmeen-lp .lp-footer-links a { font-size: 13px; color: var(--lp-ink-muted); text-decoration: none; font-weight: 300; transition: color 0.2s; }
.ilmeen-lp .lp-footer-links a:hover { color: var(--lp-gold); }

/* Animations */
@keyframes lpFadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
@keyframes lpPulseDot { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.7); } }
@keyframes lpScan { 0% { top: 10%; opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { top: 90%; opacity: 0; } }

/* Responsive */
@media (max-width: 768px) {
  .ilmeen-lp .lp-nav { padding: 16px 20px; }
  .ilmeen-lp .lp-nav-links { display: none; }
  .ilmeen-lp .lp-how-grid { grid-template-columns: 1fr; }
  .ilmeen-lp .lp-features-grid { grid-template-columns: 1fr; }
  .ilmeen-lp .lp-demo-steps { grid-template-columns: 1fr; gap: 16px; }
  .ilmeen-lp .lp-demo-arrow { transform: rotate(90deg); }
  .ilmeen-lp .lp-footer { flex-direction: column; gap: 16px; text-align: center; }
  .ilmeen-lp .lp-quran-showcase { padding: 40px 24px; }
  .ilmeen-lp .lp-cta-card { padding: 48px 24px; }
}
`

export default function LandingPage({ onEnterApp }: Props) {
  return (
    <div className="ilmeen-lp">
      <style>{CSS}</style>

      <div className="lp-bg-mesh" />
      <div className="lp-bg-orb-mid" />

      <nav className="lp-nav">
        <div className="lp-nav-logo">
          <span className="lp-nav-arabic">إلمين</span>
          <div className="lp-nav-dot" />
          <span className="lp-nav-latin">Ilmeen</span>
        </div>
        <ul className="lp-nav-links">
          <li><a href="#lp-how">How it works</a></li>
          <li><a href="#lp-features">Features</a></li>
          <li><a href="#lp-arabic">Arabic</a></li>
          <li><a href="#lp-cta" className="lp-nav-cta" onClick={onEnterApp}>Try Ilmeen</a></li>
        </ul>
      </nav>

      <main>
        {/* Hero */}
        <section className="lp-hero">
          <div className="lp-badge">
            <div className="lp-badge-dot" />
            Now in early access
          </div>
          <h1 className="lp-hero-arabic">إلمين</h1>
          <p className="lp-hero-latin">Ilmeen</p>
          <p className="lp-hero-tagline">
            Snap your Arabic textbook. Get the <strong>full text with diacritics</strong>. Hear it read aloud with perfect tajweed. Finally, a tool built for how you actually learn.
          </p>
          <div className="lp-hero-actions">
            <button className="lp-btn-primary" onClick={() => document.getElementById('lp-how')?.scrollIntoView({ behavior: 'smooth' })}>
              See how it works ↓
            </button>
            <button className="lp-btn-secondary" onClick={onEnterApp}>
              Get early access
            </button>
          </div>
          <div className="lp-hero-demo">
            <div className="lp-demo-card">
              <div className="lp-demo-steps">
                <div className="lp-demo-step">
                  <div className="lp-demo-step-icon">
                    <Camera size={22} strokeWidth={2.5} />
                  </div>
                  <div className="lp-demo-step-label">Snap</div>
                  <div className="lp-demo-step-sub">Photo your page</div>
                </div>
                <div className="lp-demo-arrow">→</div>
                <div className="lp-demo-step">
                  <div className="lp-demo-step-icon">
                    <Sparkles size={22} strokeWidth={2.5} />
                  </div>
                  <div className="lp-demo-step-label">Extract</div>
                  <div className="lp-demo-step-sub">AI adds harakat</div>
                </div>
                <div className="lp-demo-arrow">→</div>
                <div className="lp-demo-step">
                  <div className="lp-demo-step-icon">
                    <Volume2 size={22} strokeWidth={2.5} />
                  </div>
                  <div className="lp-demo-step-label">Listen</div>
                  <div className="lp-demo-step-sub">Perfect audio</div>
                </div>
              </div>
              <div className="lp-arabic-showcase">
                <div className="lp-arabic-sample">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </div>
                <div className="lp-arabic-translit">Bismillāhi r-raḥmāni r-raḥīm</div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="lp-how" className="lp-section">
          <div className="lp-container">
            <div className="lp-how-grid">
              <div>
                <p className="lp-section-label">The process</p>
                <h2 className="lp-section-title">From page to audio in seconds</h2>
                <p className="lp-section-sub">Three intelligent steps that turn your printed Arabic into a full listening and reading experience.</p>
                <div className="lp-steps-list" style={{ marginTop: 48 }}>
                  <div className="lp-step-item">
                    <div className="lp-step-num">1</div>
                    <div className="lp-step-content">
                      <h3>Snap your textbook</h3>
                      <p>Point your camera at any Arabic text. Even old books, poor lighting, or handwriting. Our vision AI handles the rest.</p>
                    </div>
                  </div>
                  <div className="lp-step-item">
                    <div className="lp-step-num">2</div>
                    <div className="lp-step-content">
                      <h3>AI restores the diacritics</h3>
                      <p>The model reads the context and adds full tashkeel — every fathah, kasrah, and shaddah in its correct place. No guessing.</p>
                    </div>
                  </div>
                  <div className="lp-step-item">
                    <div className="lp-step-num">3</div>
                    <div className="lp-step-content">
                      <h3>Listen and repeat</h3>
                      <p>High-quality Arabic TTS reads the diacritized text at your pace. Loop any passage. Memorize with your ears, not just your eyes.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="lp-phone-mockup">
                  <div className="lp-phone-top" />
                  <div className="lp-phone-camera">
                    <div className="lp-scan-line" />
                    <BookOpen size={32} style={{ marginBottom: 8 }} />
                    <div style={{ fontSize: 12, color: '#7A6E62', fontWeight: 300 }}>Point at Arabic text</div>
                  </div>
                  <div className="lp-phone-result">
                    <div className="lp-phone-arabic">واللهُ يَعْلَمُ مَا فِيْ قُلُوْبِكُمْ</div>
                    <span className="lp-phone-tag">✦ Tashkeel added</span>
                  </div>
                  <button className="lp-phone-play-btn" onClick={onEnterApp}>
                    <Play size={16} /> Play recitation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="lp-features" className="lp-section">
          <div className="lp-container">
            <p className="lp-section-label">Features</p>
            <h2 className="lp-section-title">Built for serious students</h2>
            <div className="lp-features-grid">
              <div className="lp-feature-card">
                <div className="lp-feature-icon">
                  <Search size={22} strokeWidth={2.5} />
                </div>
                <div className="lp-feature-title">High-accuracy OCR</div>
                <p className="lp-feature-desc">Powered by frontier vision models. Extracts Arabic characters with precision even from aged or low-contrast pages.</p>
              </div>
              <div className="lp-feature-card">
                <div className="lp-feature-icon">
                  حركات
                </div>
                <div className="lp-feature-title">Diacritics restoration</div>
                <p className="lp-feature-desc">Tashkeel is inferred from linguistic context, not lookup tables. The model understands meaning, so harakat placement is accurate.</p>
              </div>
              <div className="lp-feature-card">
                <div className="lp-feature-icon">
                  <Volume2 size={22} strokeWidth={2.5} />
                </div>
                <div className="lp-feature-title">Natural Arabic audio</div>
                <p className="lp-feature-desc">Neural TTS with Arabic-native pronunciation. Respects the restored diacritics for correct vowelling throughout.</p>
              </div>
              <div className="lp-feature-card">
                <div className="lp-feature-icon">
                  <Repeat1 size={22} strokeWidth={2.5} />
                </div>
                <div className="lp-feature-title">Loop and repeat</div>
                <p className="lp-feature-desc">Play back individual sentences or full passages. Loop mode lets you listen until a passage is committed to memory.</p>
              </div>
              <div className="lp-feature-card">
                <div className="lp-feature-icon">
                  <BookOpen size={22} strokeWidth={2.5} />
                </div>
                <div className="lp-feature-title">Save your library</div>
                <p className="lp-feature-desc">Every extracted passage is saved with the original image, the text, and the audio. Build a personal review library.</p>
              </div>
              <div className="lp-feature-card">
                <div className="lp-feature-icon">
                  <Zap size={22} strokeWidth={2.5} />
                </div>
                <div className="lp-feature-title">Offline audio</div>
                <p className="lp-feature-desc">Generated audio files are cached locally. Review your saved passages on the bus with zero signal, no problem.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Arabic showcase */}
        <section id="lp-arabic" className="lp-section lp-arabic-section">
          <div className="lp-container">
            <p className="lp-section-label">The Arabic language</p>
            <h2 className="lp-section-title">Every word deserves<br/>to be heard correctly</h2>
            <div className="lp-quran-showcase">
              <div className="lp-quran-ornament">✦ ❧ ✦</div>
              <div className="lp-quran-verse">
                إِنَّا أَنزَلْنَاهُ قُرْآنًا عَرَبِيًّا لَّعَلَّكُمْ تَعْقِلُونَ
              </div>
              <div className="lp-quran-translation">"Indeed, We have sent it down as an Arabic Qur'an that you might understand."</div>
              <div className="lp-quran-ref">Surah Yusuf · 12:2</div>
              <div style={{ margin: '48px 0 0', paddingTop: 48, borderTop: '1px solid rgba(201,168,76,0.15)' }}>
                <p style={{ fontSize: 11, fontWeight: 500, color: '#7A6E62', marginBottom: 24, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  What Ilmeen restores
                </p>
                <div className="lp-tashkeel-compare">
                  <div className="lp-tashkeel-item">
                    <div className="lp-tashkeel-arabic" style={{ color: '#7A6E62' }}>كتب</div>
                    <div className="lp-tashkeel-label" style={{ color: '#7A6E62' }}>Without tashkeel</div>
                  </div>
                  <div className="lp-tashkeel-sep">→</div>
                  <div className="lp-tashkeel-item">
                    <div className="lp-tashkeel-arabic" style={{ color: '#1A1611' }}>كَتَبَ</div>
                    <div className="lp-tashkeel-label" style={{ color: '#C9A84C' }}>He wrote</div>
                  </div>
                  <div className="lp-tashkeel-sep">·</div>
                  <div className="lp-tashkeel-item">
                    <div className="lp-tashkeel-arabic" style={{ color: '#1A1611' }}>كُتُبٌ</div>
                    <div className="lp-tashkeel-label" style={{ color: '#C9A84C' }}>Books</div>
                  </div>
                  <div className="lp-tashkeel-sep">·</div>
                  <div className="lp-tashkeel-item">
                    <div className="lp-tashkeel-arabic" style={{ color: '#1A1611' }}>كُتِبَ</div>
                    <div className="lp-tashkeel-label" style={{ color: '#C9A84C' }}>It was written</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="lp-cta" className="lp-section lp-cta-section">
          <div className="lp-container">
            <div className="lp-cta-card">
              <p className="lp-cta-label">Early access · Free to start</p>
              <h2 className="lp-cta-title">
                <span className="lp-cta-arabic">ابدأ رحلتك اليوم</span>
                Start your journey today
              </h2>
              <p className="lp-cta-sub">Join students who are memorizing faster, reading deeper, and finally hearing Arabic the way it was meant to sound.</p>
              <button className="lp-btn-gold" onClick={onEnterApp}>
                Get early access ✦
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-footer-logo">إلمين</div>
        <span className="lp-footer-text">© 2025 Ilmeen. All rights reserved.</span>
        <div className="lp-footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  )
}
