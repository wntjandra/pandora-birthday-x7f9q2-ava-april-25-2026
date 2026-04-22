import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronRight,
  Gift,
  Heart,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react'
import './App.css'

const messageMoments = [
  {
    title: 'Happy Birthday, Ava',
    body: 'This little universe was made to glow the way you do: warm, bright, and impossible to ignore.',
  },
  {
    title: 'A soft surprise',
    body: 'Every tap unlocks another note, another spark, and another reason today deserves to feel magical.',
  },
  {
    title: 'A wish for your year',
    body: 'More joy that arrives unexpectedly, more adventures worth retelling, and more moments that feel exactly like yours.',
  },
  {
    title: 'Pandora energy',
    body: 'Tiny treasures, shimmering details, and a keepsake feeling you can reopen whenever you need a reminder.',
  },
]

const wishTokens = [
  'glowing particles',
  'tap-to-reveal message',
  'mobile-safe chime',
  'storybook animation',
  'GitHub Pages ready',
]

const particles = [
  { left: '8%', top: '14%', size: '12px', delay: '0s', duration: '9s' },
  { left: '18%', top: '72%', size: '10px', delay: '1.2s', duration: '8.2s' },
  { left: '30%', top: '22%', size: '14px', delay: '2.1s', duration: '10s' },
  { left: '42%', top: '80%', size: '8px', delay: '0.6s', duration: '7.6s' },
  { left: '58%', top: '16%', size: '11px', delay: '1.8s', duration: '8.8s' },
  { left: '70%', top: '64%', size: '13px', delay: '2.6s', duration: '9.4s' },
  { left: '82%', top: '28%', size: '9px', delay: '1.4s', duration: '7.9s' },
  { left: '90%', top: '74%', size: '12px', delay: '3s', duration: '10.4s' },
]

const notePattern = [523.25, 659.25, 783.99, 880, 1046.5]

function playTone(context, frequency, startAt, duration = 0.18) {
  const oscillator = context.createOscillator()
  const gain = context.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(frequency, startAt)
  oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.999, startAt + duration)

  gain.gain.setValueAtTime(0.0001, startAt)
  gain.gain.exponentialRampToValueAtTime(0.18, startAt + 0.03)
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration)

  oscillator.connect(gain)
  gain.connect(context.destination)

  oscillator.start(startAt)
  oscillator.stop(startAt + duration)
}

function App() {
  const [opened, setOpened] = useState(false)
  const [revealedCount, setRevealedCount] = useState(0)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const audioContextRef = useRef(null)
  const MotionMain = motion.main

  const visibleMessages = messageMoments.slice(0, revealedCount)
  const allMessagesVisible = revealedCount === messageMoments.length

  async function ensureAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext

    if (!AudioContextClass) {
      return false
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass()
    }

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume()
    }

    return audioContextRef.current.state === 'running'
  }

  function playSequence(frequencies) {
    const context = audioContextRef.current

    if (!context || context.state !== 'running') {
      return
    }

    const sequenceStart = context.currentTime + 0.04

    frequencies.forEach((frequency, index) => {
      playTone(context, frequency, sequenceStart + index * 0.08)
    })
  }

  async function handleAudioToggle() {
    if (!audioEnabled) {
      const isReady = await ensureAudioContext()

      if (!isReady) {
        return
      }

      setAudioEnabled(true)
      playSequence(notePattern.slice(0, 4))
      return
    }

    if (audioContextRef.current) {
      await audioContextRef.current.suspend()
    }

    setAudioEnabled(false)
  }

  async function handleOpenCard() {
    const isReady = audioEnabled ? await ensureAudioContext() : false

    setOpened(true)
    setRevealedCount(1)

    if (isReady) {
      playSequence(notePattern)
    }
  }

  async function handleRevealNext() {
    if (!opened || allMessagesVisible) {
      return
    }

    const nextCount = Math.min(revealedCount + 1, messageMoments.length)
    const isReady = audioEnabled ? await ensureAudioContext() : false

    setRevealedCount(nextCount)

    if (isReady) {
      playSequence([notePattern[(nextCount - 1) % notePattern.length]])
    }
  }

  return (
    <div className="page-shell">
      <div className="aurora aurora-one" aria-hidden="true"></div>
      <div className="aurora aurora-two" aria-hidden="true"></div>

      <div className="particle-field" aria-hidden="true">
        {particles.map((particle) => (
          <span
            key={`${particle.left}-${particle.top}`}
            className="particle"
            style={{
              '--particle-left': particle.left,
              '--particle-top': particle.top,
              '--particle-size': particle.size,
              '--particle-delay': particle.delay,
              '--particle-duration': particle.duration,
            }}
          ></span>
        ))}
      </div>

      <MotionMain
        className="card-frame"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <section className="hero-panel">
          <div className="hero-copy">
            <span className="eyebrow">
              <Sparkles size={16} />
              Pandora-style birthday reveal
            </span>
            <h1>For Ava, with all the glow an April 25 birthday deserves.</h1>
            <p className="hero-text">
              A tiny keepsake page filled with shimmering particles, soft motion,
              a tap-to-play chime, and a message that unfolds one bright moment
              at a time.
            </p>

            <div className="token-cloud" aria-label="Birthday card features">
              {wishTokens.map((token) => (
                <span key={token} className="token">
                  {token}
                </span>
              ))}
            </div>
          </div>

          <div className="hero-actions">
            <button className="primary-button" onClick={handleOpenCard}>
              <Gift size={18} />
              {opened ? 'Replay the opening' : 'Open the card'}
            </button>

            <button className="secondary-button" onClick={handleAudioToggle}>
              {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              {audioEnabled ? 'Birthday chime on' : 'Enable birthday chime'}
            </button>

            <div className="status-card">
              <p className="status-title">How it works</p>
              <p>
                Audio starts only after a tap, which keeps it friendly for iPhone
                and Android browsers. The build also ships with a `404.html`
                fallback so GitHub Pages can serve this as a single-page app.
              </p>
            </div>
          </div>
        </section>

        <section className="experience-grid">
          <article className="panel message-panel">
            <div className="panel-heading">
              <Heart size={18} />
              <span>Birthday note</span>
            </div>

            {!opened ? (
              <div className="sealed-note">
                <p className="sealed-note-title">The message is still wrapped.</p>
                <p>
                  Tap <strong>Open the card</strong> to let the first wish appear.
                </p>
              </div>
            ) : null}

            <div className="message-stack" aria-live="polite">
              <AnimatePresence initial={false}>
                {visibleMessages.map((message, index) => (
                  <motion.div
                    key={message.title}
                    className={`message-card ${
                      index === visibleMessages.length - 1 && allMessagesVisible
                        ? 'is-finale'
                        : ''
                    }`}
                    initial={{ opacity: 0, y: 26, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                  >
                    <p className="message-label">{message.title}</p>
                    <p>{message.body}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <button
              className="ghost-button"
              onClick={handleRevealNext}
              disabled={!opened || allMessagesVisible}
            >
              {allMessagesVisible ? 'Every wish is glowing' : 'Reveal the next wish'}
              <ChevronRight size={18} />
            </button>
          </article>

          <aside className="panel details-panel">
            <div className="panel-heading">
              <Sparkles size={18} />
              <span>Little details</span>
            </div>

            <div className="detail-card">
              <p className="detail-title">A keepsake feel</p>
              <p>
                The glassy panels, warm metallic glow, and floating particles are
                tuned to feel closer to a jewelry-box reveal than a plain web page.
              </p>
            </div>

            <div className="detail-card">
              <p className="detail-title">Built to share</p>
              <p>
                Vite serves everything from the repository subpath, so images,
                scripts, styles, and future media files will load correctly on
                GitHub Pages.
              </p>
            </div>

            <div className="detail-card">
              <p className="detail-title">Ready for mobile</p>
              <p>
                Buttons stay thumb-friendly, the layout collapses cleanly, and the
                audio is gated behind a tap so mobile browsers won&apos;t block it.
              </p>
            </div>
          </aside>
        </section>
      </MotionMain>
    </div>
  )
}

export default App
