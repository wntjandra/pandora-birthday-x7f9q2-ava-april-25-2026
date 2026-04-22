import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, Volume2, VolumeX } from 'lucide-react'
import './App.css'

const MotionMain = motion.main

const pageSpreads = [
  {
    left: {
      eyebrow: 'Moonrise',
      title: 'The forest woke up first.',
      body: 'Starlight slipped through the mist, the ferns began to glow, and every bright little thing in the valley leaned closer like it already knew this night belonged to you.',
      footer: 'A birthday opening scene for Ava',
    },
    right: {
      eyebrow: 'Page One',
      title: 'Happy Birthday, Ava.',
      body: 'If a whole world could gather itself into a feeling, it would look something like this: luminous, cinematic, and quietly full of wonder the second you arrive.',
      footer: 'Click anywhere on the book to turn the page',
    },
  },
  {
    left: {
      eyebrow: 'Bioluminescent Grove',
      title: 'Everything is glowing on purpose.',
      body: 'The floating spores, the rivers of blue light, the towering silhouettes, the warm gold drifting through the leaves. It all feels like the kind of magic that only shows up when someone special walks in.',
      footer: 'Some nights feel larger than themselves',
    },
    right: {
      eyebrow: 'Birthday Wish',
      title: 'I hope this year feels cinematic.',
      body: 'Not just busy, not just full, but vivid. More adventures worth remembering, more laughter that arrives fast, and more moments that make you stop and think, yes, this is exactly my life.',
      footer: 'Turn again',
    },
  },
  {
    left: {
      eyebrow: 'Hidden Clearing',
      title: 'A little storybook promise.',
      body: 'Whenever things feel ordinary, I hope something unexpected glows at the edge of the frame and reminds you that wonder is still around, waiting for you to notice it again.',
      footer: 'The best gifts linger after the first reveal',
    },
    right: {
      eyebrow: 'For Ava',
      title: 'You make bright things brighter.',
      body: 'So this page, this night forest, and this impossible little moonlit world are all here to do one simple job: celebrate you with as much atmosphere as possible.',
      footer: 'One more page',
    },
  },
  {
    left: {
      eyebrow: 'Last Spread',
      title: 'Keep the glow with you.',
      body: 'May this next chapter be full of beautiful detours, unforgettable views, and the kind of joy that shows up suddenly and stays long enough to change the whole color of the evening.',
      footer: 'The jungle does not hurry, but it still shines',
    },
    right: {
      eyebrow: 'Encore',
      title: 'And if you want, the whole night can begin again.',
      body: 'One more click restarts the pages, like opening the book beneath the stars all over again.',
      footer: 'Click to loop back to the beginning',
    },
  },
]

const stars = [
  { left: '8%', top: '10%', size: '6px', delay: '0s', duration: '4.8s' },
  { left: '14%', top: '18%', size: '4px', delay: '1.2s', duration: '5.4s' },
  { left: '22%', top: '12%', size: '7px', delay: '0.6s', duration: '6.1s' },
  { left: '31%', top: '7%', size: '5px', delay: '1.9s', duration: '5.2s' },
  { left: '42%', top: '16%', size: '4px', delay: '2.6s', duration: '4.4s' },
  { left: '53%', top: '8%', size: '7px', delay: '1.1s', duration: '5.8s' },
  { left: '63%', top: '13%', size: '5px', delay: '0.4s', duration: '5s' },
  { left: '74%', top: '6%', size: '6px', delay: '2.8s', duration: '6.3s' },
  { left: '86%', top: '14%', size: '4px', delay: '1.5s', duration: '4.9s' },
  { left: '93%', top: '9%', size: '8px', delay: '0.7s', duration: '5.6s' },
  { left: '11%', top: '28%', size: '4px', delay: '2.1s', duration: '4.7s' },
  { left: '27%', top: '24%', size: '5px', delay: '1.4s', duration: '5.3s' },
  { left: '58%', top: '27%', size: '4px', delay: '2.4s', duration: '4.5s' },
  { left: '79%', top: '23%', size: '6px', delay: '0.9s', duration: '5.9s' },
]

const motes = [
  { left: '10%', bottom: '16%', size: '16px', delay: '0s', duration: '10s' },
  { left: '18%', bottom: '22%', size: '12px', delay: '2.2s', duration: '8.8s' },
  { left: '30%', bottom: '14%', size: '18px', delay: '1.2s', duration: '10.6s' },
  { left: '44%', bottom: '20%', size: '14px', delay: '3.1s', duration: '9.4s' },
  { left: '57%', bottom: '12%', size: '20px', delay: '2.7s', duration: '11.2s' },
  { left: '68%', bottom: '18%', size: '12px', delay: '1.7s', duration: '8.4s' },
  { left: '81%', bottom: '15%', size: '17px', delay: '0.8s', duration: '9.8s' },
  { left: '90%', bottom: '24%', size: '13px', delay: '2.9s', duration: '8.9s' },
]

const trunks = [
  { left: '5%', width: '14%', height: '62%', rotate: '-8deg', delay: '0.1s' },
  { left: '18%', width: '10%', height: '54%', rotate: '6deg', delay: '0.4s' },
  { left: '72%', width: '12%', height: '57%', rotate: '-5deg', delay: '0.2s' },
  { left: '84%', width: '15%', height: '64%', rotate: '7deg', delay: '0.5s' },
]

const fronds = [
  { left: '1%', width: '18%', height: '38%', rotate: '-14deg', delay: '0s', duration: '9s' },
  { left: '10%', width: '15%', height: '30%', rotate: '9deg', delay: '1.2s', duration: '8.4s' },
  { left: '18%', width: '18%', height: '34%', rotate: '-8deg', delay: '0.8s', duration: '8.8s' },
  { left: '69%', width: '16%', height: '28%', rotate: '12deg', delay: '0.5s', duration: '7.8s' },
  { left: '77%', width: '19%', height: '36%', rotate: '-10deg', delay: '1.8s', duration: '8.6s' },
  { left: '88%', width: '15%', height: '31%', rotate: '14deg', delay: '0.9s', duration: '8.1s' },
]

const openNotes = [392, 523.25, 659.25, 783.99]
const turnNotes = [523.25, 659.25, 783.99]

function playTone(context, frequency, startAt, duration = 0.22) {
  const oscillator = context.createOscillator()
  const gain = context.createGain()

  oscillator.type = 'triangle'
  oscillator.frequency.setValueAtTime(frequency, startAt)

  gain.gain.setValueAtTime(0.0001, startAt)
  gain.gain.exponentialRampToValueAtTime(0.12, startAt + 0.04)
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration)

  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start(startAt)
  oscillator.stop(startAt + duration)
}

function PaperSide({ page, side, countText }) {
  return (
    <section className={`paper-side paper-side-${side}`}>
      <p className="paper-eyebrow">{page.eyebrow}</p>
      <h2>{page.title}</h2>
      <p className="paper-body">{page.body}</p>
      <div className="paper-footer-row">
        <p className="paper-footer">{page.footer}</p>
        {countText ? <span className="paper-count">{countText}</span> : null}
      </div>
    </section>
  )
}

function App() {
  const [bookVisible, setBookVisible] = useState(false)
  const [bookOpen, setBookOpen] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)
  const [turningPage, setTurningPage] = useState(false)
  const [turnToken, setTurnToken] = useState(0)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const audioContextRef = useRef(null)

  const currentSpread = pageSpreads[pageIndex]
  const nextIndex = (pageIndex + 1) % pageSpreads.length
  const nextSpread = pageSpreads[nextIndex]
  const pageCountLabel = `${String(pageIndex + 1).padStart(2, '0')} / ${String(
    pageSpreads.length,
  ).padStart(2, '0')}`

  useEffect(() => {
    const showBookTimer = window.setTimeout(() => setBookVisible(true), 1300)
    const openBookTimer = window.setTimeout(() => setBookOpen(true), 2450)

    return () => {
      window.clearTimeout(showBookTimer)
      window.clearTimeout(openBookTimer)
    }
  }, [])

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

  function playSequence(notes) {
    const context = audioContextRef.current

    if (!context || context.state !== 'running') {
      return
    }

    const startAt = context.currentTime + 0.05

    notes.forEach((note, index) => {
      playTone(context, note, startAt + index * 0.09)
    })
  }

  async function handleAudioToggle() {
    if (!audioEnabled) {
      const isReady = await ensureAudioContext()

      if (!isReady) {
        return
      }

      setAudioEnabled(true)
      playSequence(openNotes)
      return
    }

    if (audioContextRef.current) {
      await audioContextRef.current.suspend()
    }

    setAudioEnabled(false)
  }

  async function handleTurnPage() {
    if (!bookOpen || turningPage) {
      return
    }

    const isReady = audioEnabled ? await ensureAudioContext() : false

    setTurningPage(true)
    setTurnToken((token) => token + 1)

    window.setTimeout(() => {
      setPageIndex(nextIndex)
    }, 340)

    window.setTimeout(() => {
      setTurningPage(false)
    }, 920)

    if (isReady) {
      playSequence(turnNotes)
    }
  }

  return (
    <MotionMain
      className="page-shell"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
    >
      <div className="night-gradient" aria-hidden="true"></div>
      <div className="upper-haze upper-haze-left" aria-hidden="true"></div>
      <div className="upper-haze upper-haze-right" aria-hidden="true"></div>

      <section className="scene-backdrop" aria-hidden="true">
        <div className="starfield">
          {stars.map((star) => (
            <span
              key={`${star.left}-${star.top}`}
              className="scene-star"
              style={{
                '--star-left': star.left,
                '--star-top': star.top,
                '--star-size': star.size,
                '--star-delay': star.delay,
                '--star-duration': star.duration,
              }}
            ></span>
          ))}
        </div>

        <div className="light-columns">
          <span className="light-column light-column-one"></span>
          <span className="light-column light-column-two"></span>
          <span className="light-column light-column-three"></span>
        </div>

        <div className="mist mist-back"></div>

        <div className="trunk-layer">
          {trunks.map((trunk) => (
            <span
              key={`${trunk.left}-${trunk.height}`}
              className="scene-trunk"
              style={{
                '--trunk-left': trunk.left,
                '--trunk-width': trunk.width,
                '--trunk-height': trunk.height,
                '--trunk-rotate': trunk.rotate,
                '--trunk-delay': trunk.delay,
              }}
            ></span>
          ))}
        </div>

        <div className="mote-layer">
          {motes.map((mote) => (
            <span
              key={`${mote.left}-${mote.bottom}`}
              className="scene-mote"
              style={{
                '--mote-left': mote.left,
                '--mote-bottom': mote.bottom,
                '--mote-size': mote.size,
                '--mote-delay': mote.delay,
                '--mote-duration': mote.duration,
              }}
            ></span>
          ))}
        </div>

        <div className="mist mist-front"></div>

        <div className="frond-layer">
          {fronds.map((frond) => (
            <span
              key={`${frond.left}-${frond.height}`}
              className="scene-frond"
              style={{
                '--frond-left': frond.left,
                '--frond-width': frond.width,
                '--frond-height': frond.height,
                '--frond-rotate': frond.rotate,
                '--frond-delay': frond.delay,
                '--frond-duration': frond.duration,
              }}
            ></span>
          ))}
        </div>

        <div className="forest-floor"></div>
      </section>

      <motion.header
        className="scene-intro"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.25, ease: 'easeOut' }}
      >
        <p className="scene-kicker">Pandora-inspired birthday night</p>
        <h1>A glowing jungle appears, then a storybook opens for Ava.</h1>
        <p className="scene-copy">
          The scene starts on its own. Once the cover swings open, click the book
          to flip through the pages.
        </p>
      </motion.header>

      <AnimatePresence>
        {bookVisible ? (
          <motion.section
            className="book-zone"
            initial={{ opacity: 0, y: 120, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.2, 0.9, 0.2, 1] }}
          >
            <div className="book-stack-shadow" aria-hidden="true"></div>

            <div className="storybook">
              <div className="storybook-back" aria-hidden="true"></div>

              <div className="storybook-pages">
                <div className="paper-spread">
                  <PaperSide page={currentSpread.left} side="left" />
                  <div className="paper-spine" aria-hidden="true"></div>
                  <PaperSide
                    page={currentSpread.right}
                    side="right"
                    countText={pageCountLabel}
                  />
                </div>

                <AnimatePresence initial={false}>
                  {turningPage ? (
                    <motion.div
                      key={turnToken}
                      className="page-turn-sheet"
                      initial={{ rotateY: 0 }}
                      animate={{ rotateY: -178 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.92, ease: [0.35, 0.02, 0.2, 1] }}
                    >
                      <div className="page-turn-face page-turn-front">
                        <p className="page-turn-label">{currentSpread.right.eyebrow}</p>
                        <div className="page-turn-glow"></div>
                      </div>
                      <div className="page-turn-face page-turn-back">
                        <p className="page-turn-label">{nextSpread.left.eyebrow}</p>
                        <div className="page-turn-glow"></div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <button
                  type="button"
                  className="book-hitarea"
                  onClick={handleTurnPage}
                  disabled={!bookOpen || turningPage}
                  aria-label="Turn the page"
                >
                  <span className="sr-only">Turn the page</span>
                </button>
              </div>

              <motion.div
                className={`storybook-cover ${bookOpen ? 'is-open' : ''}`}
                initial={false}
                animate={{ rotateY: bookOpen ? -166 : 0 }}
                transition={{ duration: 1.35, ease: [0.2, 0.9, 0.2, 1] }}
              >
                <div className="cover-glow"></div>
                <div className="cover-rings"></div>
                <p className="cover-kicker">Ava&apos;s Birthday Journal</p>
                <p className="cover-name">AVA</p>
                <p className="cover-date">April 25, 2026</p>
                <p className="cover-copy">
                  Opened beneath a night sky full of glowing leaves and drifting
                  stars.
                </p>
              </motion.div>
            </div>

            <motion.div
              className="control-rail"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.65, ease: 'easeOut' }}
            >
              <button type="button" className="sound-pill" onClick={handleAudioToggle}>
                {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                {audioEnabled ? 'Forest chime on' : 'Enable forest chime'}
              </button>

              <p className="turn-hint">
                <Sparkles size={14} />
                {bookOpen
                  ? 'Click the open book to turn the page.'
                  : 'The cover is opening on its own.'}
              </p>
            </motion.div>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </MotionMain>
  )
}

export default App
