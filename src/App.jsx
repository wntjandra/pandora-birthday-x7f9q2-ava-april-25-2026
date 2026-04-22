import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Tilt from 'react-parallax-tilt'
import backgroundPandora from './assets/BackgroundPandora.png'
import bushes1 from './assets/Bushes1.png'
import bushes2 from './assets/Bushes2.png'
import FluidBackdrop from './components/FluidBackdrop.jsx'
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
      footer: 'Click the right page to move forward',
    },
  },
  {
    left: {
      eyebrow: 'Bioluminescent Grove',
      title: 'Everything is glowing on purpose.',
      body: 'The floating spores, the rivers of blue light, and the violet flare around every fern make the whole place feel alive enough to celebrate with you.',
      footer: 'Click the left page to go back',
    },
    right: {
      eyebrow: 'Birthday Wish',
      title: 'I hope this year feels cinematic.',
      body: 'Not just busy, not just full, but vivid. More adventures worth remembering, more laughter that arrives fast, and more moments that make you stop and think, yes, this is exactly my life.',
      footer: 'Right page keeps the story moving',
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
      footer: 'Turn either way from here',
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
      body: 'One more right-page turn loops back to the beginning, and one left-page turn lets you revisit the spread just before this one.',
      footer: 'The book now flips both directions',
    },
  },
]

const stars = [
  { left: '8%', top: '8%', size: '5px', delay: '0s', duration: '4.8s' },
  { left: '15%', top: '15%', size: '4px', delay: '1.2s', duration: '5.4s' },
  { left: '24%', top: '12%', size: '6px', delay: '0.6s', duration: '6.1s' },
  { left: '33%', top: '7%', size: '5px', delay: '1.9s', duration: '5.2s' },
  { left: '44%', top: '14%', size: '4px', delay: '2.6s', duration: '4.4s' },
  { left: '55%', top: '6%', size: '6px', delay: '1.1s', duration: '5.8s' },
  { left: '67%', top: '12%', size: '5px', delay: '0.4s', duration: '5s' },
  { left: '77%', top: '5%', size: '6px', delay: '2.8s', duration: '6.3s' },
  { left: '88%', top: '11%', size: '4px', delay: '1.5s', duration: '4.9s' },
  { left: '94%', top: '8%', size: '7px', delay: '0.7s', duration: '5.6s' },
  { left: '11%', top: '24%', size: '4px', delay: '2.1s', duration: '4.7s' },
  { left: '29%', top: '20%', size: '5px', delay: '1.4s', duration: '5.3s' },
  { left: '58%', top: '23%', size: '4px', delay: '2.4s', duration: '4.5s' },
  { left: '82%', top: '19%', size: '6px', delay: '0.9s', duration: '5.9s' },
]

const motes = [
  { left: '10%', top: '34%', size: '14px', delay: '0.3s', duration: '11s' },
  { left: '19%', top: '68%', size: '11px', delay: '1.4s', duration: '9.4s' },
  { left: '30%', top: '56%', size: '16px', delay: '2.2s', duration: '12.2s' },
  { left: '42%', top: '72%', size: '13px', delay: '0.7s', duration: '10s' },
  { left: '57%', top: '64%', size: '18px', delay: '2.8s', duration: '10.8s' },
  { left: '70%', top: '38%', size: '12px', delay: '1.1s', duration: '8.9s' },
  { left: '82%', top: '58%', size: '15px', delay: '2.5s', duration: '9.7s' },
  { left: '90%', top: '74%', size: '11px', delay: '1.9s', duration: '8.8s' },
]

const vines = [
  { left: '8%', top: '-5%', height: '58%', rotate: '-3deg', delay: '0s', duration: '11s' },
  { left: '17%', top: '-8%', height: '62%', rotate: '4deg', delay: '1.2s', duration: '12.6s' },
  { left: '28%', top: '-6%', height: '56%', rotate: '-5deg', delay: '0.8s', duration: '10.8s' },
  { left: '63%', top: '-9%', height: '52%', rotate: '5deg', delay: '0.6s', duration: '11.4s' },
  { left: '74%', top: '-5%', height: '60%', rotate: '-4deg', delay: '1.1s', duration: '10.4s' },
  { left: '86%', top: '-8%', height: '66%', rotate: '6deg', delay: '2.2s', duration: '12.8s' },
]

const leafBurstParticles = [
  { x: -138, y: -78, size: 14, delay: 0.02, rotate: -34, hue: 'purple' },
  { x: -110, y: -122, size: 18, delay: 0.08, rotate: -8, hue: 'blue' },
  { x: -88, y: -58, size: 12, delay: 0.12, rotate: 20, hue: 'purple' },
  { x: -54, y: -132, size: 14, delay: 0.18, rotate: -14, hue: 'blue' },
  { x: -18, y: -92, size: 10, delay: 0.24, rotate: 28, hue: 'purple' },
  { x: 16, y: -144, size: 15, delay: 0.1, rotate: -18, hue: 'blue' },
  { x: 46, y: -76, size: 12, delay: 0.16, rotate: 34, hue: 'purple' },
  { x: 82, y: -128, size: 14, delay: 0.22, rotate: -26, hue: 'blue' },
  { x: 116, y: -84, size: 13, delay: 0.28, rotate: 16, hue: 'purple' },
  { x: 142, y: -118, size: 17, delay: 0.34, rotate: -10, hue: 'blue' },
  { x: -66, y: -170, size: 11, delay: 0.36, rotate: 12, hue: 'purple' },
  { x: 74, y: -176, size: 10, delay: 0.4, rotate: -20, hue: 'blue' },
]

const turnNotesForward = [523.25, 659.25, 783.99]
const turnNotesBackward = [...turnNotesForward].reverse()

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
  const [turnDirection, setTurnDirection] = useState('forward')
  const [turnToken, setTurnToken] = useState(0)
  const audioContextRef = useRef(null)
  const storybookShellRef = useRef(null)

  const pageCountLabel = `${String(pageIndex + 1).padStart(2, '0')} / ${String(
    pageSpreads.length,
  ).padStart(2, '0')}`
  const currentSpread = pageSpreads[pageIndex]
  const nextIndex = (pageIndex + 1) % pageSpreads.length
  const previousIndex = (pageIndex - 1 + pageSpreads.length) % pageSpreads.length
  const nextSpread = pageSpreads[nextIndex]
  const previousSpread = pageSpreads[previousIndex]

  useEffect(() => {
    const showBookTimer = window.setTimeout(() => setBookVisible(true), 1050)
    const openBookTimer = window.setTimeout(() => setBookOpen(true), 2080)

    return () => {
      window.clearTimeout(showBookTimer)
      window.clearTimeout(openBookTimer)
    }
  }, [])

  function setBookPose(normalizedX, normalizedY) {
    const shell = storybookShellRef.current

    if (!shell) {
      return
    }

    shell.style.setProperty('--book-tilt-x', `${(-normalizedY * 8).toFixed(2)}deg`)
    shell.style.setProperty('--book-tilt-y', `${(normalizedX * 10).toFixed(2)}deg`)
    shell.style.setProperty('--book-shift-x-sm', `${(normalizedX * 8).toFixed(2)}px`)
    shell.style.setProperty('--book-shift-y-sm', `${(normalizedY * 6).toFixed(2)}px`)
    shell.style.setProperty('--book-shift-x-md', `${(normalizedX * 14).toFixed(2)}px`)
    shell.style.setProperty('--book-shift-y-md', `${(normalizedY * 10).toFixed(2)}px`)
  }

  function resetBookPose() {
    setBookPose(0, 0)
  }

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

  async function handleTurnPage(direction) {
    if (!bookOpen || turningPage) {
      return
    }

    const targetIndex = direction === 'forward' ? nextIndex : previousIndex
    const isReady = await ensureAudioContext()

    setTurnDirection(direction)
    setTurningPage(true)
    setTurnToken((token) => token + 1)

    window.setTimeout(() => {
      setPageIndex(targetIndex)
    }, 360)

    window.setTimeout(() => {
      setTurningPage(false)
    }, 940)

    if (isReady) {
      playSequence(direction === 'forward' ? turnNotesForward : turnNotesBackward)
    }
  }

  const turningFrontPage =
    turnDirection === 'forward' ? currentSpread.right : currentSpread.left
  const turningBackPage =
    turnDirection === 'forward' ? nextSpread.left : previousSpread.right

  return (
    <MotionMain
      className="page-shell"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
    >
      <div className="night-gradient" aria-hidden="true"></div>

      <section className="scene-backdrop" aria-hidden="true">
        <motion.img
          className="pandora-backdrop"
          src={backgroundPandora}
          alt=""
          draggable={false}
          initial={{ opacity: 0, scale: 1.08, y: 28 }}
          animate={{ opacity: 1, scale: 1.02, y: 0 }}
          transition={{ duration: 1.6, ease: [0.2, 0.85, 0.25, 1] }}
        />

        <div className="backdrop-veil"></div>

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

        <FluidBackdrop />

        <div className="vine-layer">
          {vines.map((vine) => (
            <span
              key={`${vine.left}-${vine.height}`}
              className="scene-vine"
              style={{
                '--vine-left': vine.left,
                '--vine-top': vine.top,
                '--vine-height': vine.height,
                '--vine-rotate': vine.rotate,
                '--vine-delay': vine.delay,
                '--vine-duration': vine.duration,
              }}
            ></span>
          ))}
        </div>

        <div className="bush-cluster bush-cluster-left">
          <motion.img
            className="bush-layer"
            src={bushes2}
            alt=""
            draggable={false}
            initial={{ opacity: 0, y: 170, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.25, delay: 0.86, ease: [0.2, 0.9, 0.22, 1] }}
          />

          <div className="bush-burst">
            {leafBurstParticles.map((particle, index) => (
              <span
                key={`burst-left-${index}`}
                className={`leaf-burst leaf-burst-${particle.hue}`}
                style={{
                  '--leaf-x': `${particle.x * 0.92}px`,
                  '--leaf-y': `${particle.y * 0.92}px`,
                  '--leaf-size': `${particle.size}px`,
                  '--leaf-delay': `${particle.delay}s`,
                  '--leaf-rotate': `${particle.rotate}deg`,
                }}
              ></span>
            ))}
          </div>
        </div>

        <div className="bush-cluster bush-cluster-right">
          <motion.img
            className="bush-layer"
            src={bushes1}
            alt=""
            draggable={false}
            initial={{ opacity: 0, y: 210, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.35, delay: 1.06, ease: [0.2, 0.9, 0.22, 1] }}
          />

          <div className="bush-burst">
            {leafBurstParticles.map((particle, index) => (
              <span
                key={`burst-right-${index}`}
                className={`leaf-burst leaf-burst-${particle.hue}`}
                style={{
                  '--leaf-x': `${particle.x * 0.84}px`,
                  '--leaf-y': `${particle.y * 0.88}px`,
                  '--leaf-size': `${particle.size}px`,
                  '--leaf-delay': `${particle.delay + 0.14}s`,
                  '--leaf-rotate': `${particle.rotate * -1}deg`,
                }}
              ></span>
            ))}
          </div>
        </div>

        <div className="mote-layer">
          {motes.map((mote) => (
            <span
              key={`${mote.left}-${mote.top}`}
              className="scene-mote"
              style={{
                '--mote-left': mote.left,
                '--mote-top': mote.top,
                '--mote-size': mote.size,
                '--mote-delay': mote.delay,
                '--mote-duration': mote.duration,
              }}
            ></span>
          ))}
        </div>

        <div className="mist mist-back"></div>
        <div className="mist mist-front"></div>
      </section>

      <AnimatePresence>
        {bookVisible ? (
          <motion.section
            className="book-zone"
            initial={{ opacity: 0, y: 120, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.12, ease: [0.2, 0.9, 0.2, 1] }}
          >
            <div className="book-aura" aria-hidden="true"></div>
            <div className="book-stack-shadow" aria-hidden="true"></div>

            <Tilt
              className="storybook-tilt"
              perspective={1800}
              tiltMaxAngleX={10}
              tiltMaxAngleY={14}
              scale={1.01}
              transitionSpeed={220}
              glareEnable={true}
              glareMaxOpacity={0.08}
              glareColor="#b8f7ff"
              glareBorderRadius="26px"
              onMove={({ tiltAngleXPercentage = 0, tiltAngleYPercentage = 0 }) => {
                setBookPose(tiltAngleYPercentage / 100, tiltAngleXPercentage / 100)
              }}
              onLeave={resetBookPose}
            >
              <div ref={storybookShellRef} className="storybook-shell">
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
                          className={`page-turn-sheet page-turn-sheet-${turnDirection}`}
                          initial={{ rotateY: 0 }}
                          animate={{ rotateY: turnDirection === 'forward' ? -178 : 178 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.92, ease: [0.35, 0.02, 0.2, 1] }}
                        >
                          <div className="page-turn-face page-turn-front">
                            <p className="page-turn-label">{turningFrontPage.eyebrow}</p>
                            <p className="page-turn-title">{turningFrontPage.title}</p>
                            <div className="page-turn-glow"></div>
                          </div>
                          <div className="page-turn-face page-turn-back">
                            <p className="page-turn-label">{turningBackPage.eyebrow}</p>
                            <p className="page-turn-title">{turningBackPage.title}</p>
                            <div className="page-turn-glow"></div>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>

                    <button
                      type="button"
                      className="book-hitarea book-hitarea-left"
                      onClick={() => handleTurnPage('backward')}
                      disabled={!bookOpen || turningPage}
                      aria-label="Turn the book backward"
                    >
                      <span className="sr-only">Turn the book backward</span>
                    </button>

                    <button
                      type="button"
                      className="book-hitarea book-hitarea-right"
                      onClick={() => handleTurnPage('forward')}
                      disabled={!bookOpen || turningPage}
                      aria-label="Turn the book forward"
                    >
                      <span className="sr-only">Turn the book forward</span>
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
                      Opened beneath a glowing canopy where the night never stops
                      shimmering.
                    </p>
                  </motion.div>
                </div>
              </div>
            </Tilt>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </MotionMain>
  )
}

export default App
