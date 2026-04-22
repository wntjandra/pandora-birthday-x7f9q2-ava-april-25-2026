import { forwardRef, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import HTMLFlipBook from 'react-pageflip'
import Tilt from 'react-parallax-tilt'
import backgroundPandora from './assets/BackgroundPandora.png'
import bushes1 from './assets/Bushes1.png'
import bushes2 from './assets/Bushes2.png'
import pageFlipNoise from './assets/pageFlipNoise.mp3'
import childOfTwoWorlds from './music/03. Child of Two Worlds.mp3'
import theWildwoods from './music/04. The Wildwoods.mp3'
import songOfTheSarentu from './music/12. Song of the Sarentu.mp3'
import theHollows from './music/13. The Hollows.mp3'
import beneathTheKinglorNest from './music/14. Beneath the Kinglor Nest.mp3'
import FluidBackdrop from './components/FluidBackdrop.jsx'
import './App.css'

const MotionMain = motion.main
const soundtrack = [
  childOfTwoWorlds,
  theWildwoods,
  songOfTheSarentu,
  theHollows,
  beneathTheKinglorNest,
]

const pageSpreads = [
  {
    left: {
      eyebrow: 'Prologue',
      title: 'The Light',
      blocks: [
        "Ava didn't remember falling asleep.",
        "But when she opened her eyes, the world was already different. It wasn't bright or blinding. It was soft, alive, like the world itself was glowing from within.",
        'She was no longer in her room. She was somewhere else. Somewhere mysterious, enchanting, and breathtaking...',
      ],
      footer: 'A dream opened in the glow',
    },
    right: {
      eyebrow: 'The Awakening',
      title: 'First Steps',
      blocks: [
        'She lay on a forest floor that shimmered beneath her, each breath sending blue and violet ripples through the moss.',
        'Particles drifted like slow stars. Towering trees rose above her, braided with glowing vines that swayed as if they were breathing.',
      ],
      footer: 'First step into the unknown',
    },
  },
  {
    left: {
      eyebrow: 'The Awakening',
      title: null,
      className: 'continuation',
      blocks: [
        'Ava stood barefoot and stepped forward. The ground lit up beneath her.',
        'Soft waves of color spread outward from where her foot touched, like the forest was responding to her presence.',
        'Everything felt calm. Beautiful. Alive.',
      ],
      footer: 'The world noticed her arrival',
    },
    right: {
      eyebrow: 'Living World',
      title: 'Luminous World',
      blocks: [
        'Massive mushroom-like forestry rose in the distance, their glowing caps casting halos through the mist in pinks, purples, and blues.',
        'A nearby stream carried light inside it. When Ava dipped her hand into the water, the glow gathered around her fingers as if it recognized her.',
        'The air, almost as if aware of her arrival, shifted slowly around her.',
      ],
      footer: 'The world glowed back',
    },
  },
  {
    left: {
      eyebrow: 'The Others',
      title: 'Familiar Faces',
      className: 'compact',
      blocks: [
        'Two figures stepped softly from between the glowing trees, their presence woven into the same quiet radiance that breathed through the forest.',
        'They felt familiar. Like they belonged to this place, like something in her knew them.',
        '"You\'ve arrived," one said gently, as though the moment had been long expected. "We\'ve been waiting," the other added, her voice calm and certain, like the world itself speaking through her. They turned, already knowing she would follow. "Come. There is more for you to see."',
      ],
      footer: 'Some friendships arrive gently',
    },
    right: {
      eyebrow: 'A World of Wonder',
      title: 'Following the Light',
      blocks: [
        'They walked beneath enormous canopies where strands of light brushed their shoulders like silk.',
        'They climbed roots that pulsed under their touch and crossed wide clearings where the sky shimmered with drifting color instead of stars.',
        'At a high ridge, Ava looked out over an endless forest flowing in blue, violet, and pink like a living ocean.',
      ],
      footer: 'The forest kept unfolding',
    },
  },
  {
    left: {
      eyebrow: 'The Bond',
      title: 'Sky Creatures',
      className: 'compact',
      blocks: [
        'One of the them lifted their hand toward the heavens, where rivers of blue, violet, and rose light drifted above the ridge like living silk.',
        '"The sky never keeps the same dream for long," they said softly.',
        'Ava watched the colors move across the mist and the endless forest below until it felt less like weather and more like the whole world was breathing above her.',
      ],
      footer: 'Wonder kept moving',
    },
    right: {
      eyebrow: 'The Bond',
      title: null,
      className: 'compact continuation',
      blocks: [
        'A distant cry echoed overhead. A creature soared through the glowing sky, its wings long and elegant, trailing pale strokes of light behind it.',
        'It circled once. Then again, lower this time, hovering above them without landing and without leaving, as if it were deciding something only the sky understood.',
        'The air around them grew still.',
      ],
      footer: 'Watchful presence remained overhead',
    },
  },
  {
    left: {
      eyebrow: 'The Bond',
      title: null,
      className: 'compact continuation',
      blocks: [
        'Ava stepped forward... then stopped. Not because she was afraid, but because she felt that this moment mattered.',
        'The creature hovered, watching her back. Not suspicious. Not gentle either. Only careful, like it was listening for something deeper than movement.',
        'Before it ever touched the ground, she felt the pull of it inside her: quiet, certain, and impossible to ignore.',
      ],
      footer: 'The sky answered back',
    },
    right: {
      eyebrow: 'Tsaheylu',
      title: 'Chosen',
      className: 'compact',
      blocks: [
        'At last the creature lowered itself. Ava touched the long strand of hair that felt different, and she understood.',
        'Through Tsaheylu, beings in this world could share thought, feeling, and sense directly.',
        'The instant they connected, she felt rushing wind, endless sky, the ache of flying alone for so long, and then the deep relief of being found. The creature gave a soft, resonant call.',
      ],
      footer: 'A bond made in trust',
    },
  },
  {
    left: {
      eyebrow: 'Tree of Connection',
      title: 'World Tree',
      blocks: [
        'As twilight deepened, Ava felt another pull, gentle and certain.',
        'She followed glowing roots and drifting lights until she stood before a tree brighter than anything she had seen.',
        'Its roots spread wide like a heartbeat beneath the world, and long luminous strands moved through the still air.',
      ],
      footer: 'Something sacred called her forward',
    },
    right: {
      eyebrow: 'The Tree',
      title: 'Connection',
      className: 'compact',
      blocks: [
        'The others stayed behind while Ava stepped closer, breathing more slowly until her rhythm matched the tree.',
        'This was the place where all life connected to Eywa, the living consciousness woven through every creature, plant, and stream.',
        'She reached back and gently connected.',
      ],
      footer: 'The whole world listened',
    },
  },
  {
    left: {
      eyebrow: 'Eywa',
      title: 'World and Everything',
      className: 'compact',
      blocks: [
        'She felt the roots beneath the ground, the trees stretching upward, the movement of creatures, the flow of water, and the quiet rhythm of life.',
        'She was no longer only in the world. She was part of it.',
        'And within that vast living presence, something understood her completely. In return, Eywa gave her something.',
      ],
      footer: 'The forest knew her fully',
    },
    right: {
      eyebrow: null,
      title: null,
      className: 'verse',
      blocks: [
        {
          type: 'verse',
          text:
            'You walked your path where shadows lay,\nAnd chose to rise another day.\n\nThrough quiet strength and unseen fight,\nYou learned to carry your own light.\n\nAnd now you stand where worlds can see,\nThe beauty grown so silently.\n\nNot given, no. This glow you wear,\nWas built from all you chose to bear.\n\nSo rest, and know, without a doubt\nThe light you seek was always reaching out.',
        },
      ],
      footer: 'A gift carried home',
    },
  },
  {
    left: {
      eyebrow: 'The Return',
      title: 'The Light Began to Fade',
      blocks: [
        'The forest softened into twilight, its glow dimming into something quieter, more distant.',
        'Ava turned. The two figures stood a little farther now, already becoming part of the light they came from.',
        'They met her gaze and smiled—soft, knowing, like nothing needed to be said.',
        'And then, gently, they were gone.',
      ],
      footer: 'Not everything that fades is gone',
    },
    right: {
      eyebrow: 'Awakening',
      title: 'She Opened Her Eyes at Home',
      blocks: [
        'Her room was still and quiet, exactly as she had left it.',
        'Ava sat up slowly, the world unchanged—but not the same.',
        'She looked at her hands for a moment, then smiled.',
      ],
      footer: 'She brought the light with her',
    },
  },
  {
    left: {
      eyebrow: 'Afterglow',
      title: 'The Light Stayed',
      blocks: [
        'Back in her room, the calm of that glowing forest remained.',
        'What Eywa gave her was not something new. It was the certainty that her light had been there all along.',
        'The luminous world had not vanished. It had become part of her.',
      ],
      footer: 'She woke up different',
    },
    right: {
      eyebrow: 'Final Line',
      title: 'Because Somewhere Deep, She Knew',
      className: 'closing',
      blocks: [{ type: 'quote', text: 'The Luminous World Was Still Alive' }],
      footer: 'New world, new dream',
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

const totalStoryPages = pageSpreads.length * 2
const storyPages = pageSpreads.flatMap((spread, spreadIndex) => [
  {
    key: `spread-${spreadIndex}-left`,
    kind: 'story',
    side: 'left',
    pageNumber: spreadIndex * 2 + 1,
    ...spread.left,
  },
  {
    key: `spread-${spreadIndex}-right`,
    kind: 'story',
    side: 'right',
    pageNumber: spreadIndex * 2 + 2,
    ...spread.right,
  },
])

const bookPages = [
  { key: 'cover-front', kind: 'cover-front' },
  ...storyPages,
  { key: 'cover-back', kind: 'cover-back' },
]

function renderPageBlock(block, index) {
  if (typeof block === 'string') {
    return (
      <p key={index} className="paper-body">
        {block}
      </p>
    )
  }

  if (block.type === 'verse') {
    return (
      <p key={index} className="paper-verse">
        {block.text}
      </p>
    )
  }

  if (block.type === 'quote') {
    return (
      <p key={index} className="paper-quote">
        {block.text}
      </p>
    )
  }

  return null
}

const FlipBookPage = forwardRef(function FlipBookPage({ page }, ref) {
  if (page.kind === 'cover-front') {
    return (
      <article ref={ref} className="flip-book-page flip-book-page-cover" data-density="hard">
        <div className="cover-glow"></div>
        <div className="cover-rings"></div>
        <h1 className="cover-title" aria-label="Ava-tar Into the Luminous World">
          <span className="cover-title-word">
            <span className="cover-title-ava">Ava</span>
            <span className="cover-title-rest">tar</span>
          </span>
          <span className="cover-title-subtitle">Into the Luminous World</span>
        </h1>
        <p className="cover-copy cover-copy-front">
          Opened beneath a glowing canopy where the night never stops shimmering.
        </p>
      </article>
    )
  }

  if (page.kind === 'cover-back') {
    return (
      <article
        ref={ref}
        className="flip-book-page flip-book-page-cover flip-book-page-cover-back"
        data-density="hard"
      >
        <div className="cover-glow"></div>
        <div className="cover-rings"></div>
        <p className="cover-kicker cover-kicker-back">FOR AVA</p>
        <h2 className="back-cover-title">Happy 20th Birthday</h2>
        <p className="cover-copy cover-copy-back">
          The whole luminous world is still glowing for you.
        </p>
      </article>
    )
  }

  const storyPageClassName = [
    'flip-book-page',
    'flip-book-page-story',
    `flip-book-page-story-${page.side}`,
    ...(page.className
      ? page.className
          .split(' ')
          .filter(Boolean)
          .map((className) => `flip-book-page-story-${className}`)
      : []),
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <article ref={ref} className={storyPageClassName} data-density="soft">
      <div className="flip-book-page-inner">
        {page.eyebrow ? <p className="paper-eyebrow">{page.eyebrow}</p> : null}
        {page.title ? <h2>{page.title}</h2> : null}
        <div className="paper-content">{page.blocks.map(renderPageBlock)}</div>
        {page.footer ? (
          <div className="paper-footer-row">
            <p className="paper-footer">{page.footer}</p>
            <span className="paper-count">
              {String(page.pageNumber).padStart(2, '0')} /{' '}
              {String(totalStoryPages).padStart(2, '0')}
            </span>
          </div>
        ) : null}
      </div>
    </article>
  )
})

function App() {
  const [bookVisible, setBookVisible] = useState(false)
  const [bookReady, setBookReady] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [bookState, setBookState] = useState('read')
  const storybookShellRef = useRef(null)
  const flipBookRef = useRef(null)
  const flipAudioRef = useRef(null)
  const musicAudioRef = useRef(null)
  const soundtrackIndexRef = useRef(0)

  useEffect(() => {
    const showBookTimer = window.setTimeout(() => setBookVisible(true), 1050)

    return () => {
      window.clearTimeout(showBookTimer)
    }
  }, [])

  useEffect(() => {
    const audio = new Audio(pageFlipNoise)

    audio.preload = 'auto'
    audio.volume = 0.45
    flipAudioRef.current = audio

    return () => {
      audio.pause()
      flipAudioRef.current = null
    }
  }, [])

  useEffect(() => {
    const music = new Audio(soundtrack[0])

    music.preload = 'auto'
    music.volume = 0.25
    musicAudioRef.current = music
    soundtrackIndexRef.current = 0

    function stopInteractionListeners() {
      window.removeEventListener('pointerdown', attemptMusicPlayback)
      window.removeEventListener('keydown', attemptMusicPlayback)
      window.removeEventListener('touchstart', attemptMusicPlayback)
    }

    function playCurrentTrack() {
      const currentMusic = musicAudioRef.current

      if (!currentMusic) {
        return
      }

      currentMusic.volume = 0.25

      const playPromise = currentMusic.play()

      if (playPromise?.then) {
        playPromise.then(stopInteractionListeners).catch(() => {})
      }
    }

    function handleTrackEnded() {
      const currentMusic = musicAudioRef.current

      if (!currentMusic) {
        return
      }

      soundtrackIndexRef.current = (soundtrackIndexRef.current + 1) % soundtrack.length
      currentMusic.src = soundtrack[soundtrackIndexRef.current]
      currentMusic.currentTime = 0
      playCurrentTrack()
    }

    function attemptMusicPlayback() {
      playCurrentTrack()
    }

    music.addEventListener('ended', handleTrackEnded)
    music.load()
    attemptMusicPlayback()
    window.addEventListener('pointerdown', attemptMusicPlayback)
    window.addEventListener('keydown', attemptMusicPlayback)
    window.addEventListener('touchstart', attemptMusicPlayback)

    return () => {
      stopInteractionListeners()
      music.removeEventListener('ended', handleTrackEnded)
      music.pause()
      musicAudioRef.current = null
    }
  }, [])

  function setBookPose(normalizedX, normalizedY) {
    const shell = storybookShellRef.current

    if (!shell) {
      return
    }

    shell.style.setProperty('--book-tilt-x', `${(-normalizedY * 4.2).toFixed(2)}deg`)
    shell.style.setProperty('--book-tilt-y', `${(normalizedX * 5.4).toFixed(2)}deg`)
    shell.style.setProperty('--book-shift-x-sm', `${(normalizedX * 4.5).toFixed(2)}px`)
    shell.style.setProperty('--book-shift-y-sm', `${(normalizedY * 3.2).toFixed(2)}px`)
    shell.style.setProperty('--book-shift-x-md', `${(normalizedX * 8).toFixed(2)}px`)
    shell.style.setProperty('--book-shift-y-md', `${(normalizedY * 5.4).toFixed(2)}px`)
  }

  function resetBookPose() {
    setBookPose(0, 0)
  }

  function playFlipNoise() {
    const audio = flipAudioRef.current

    if (!audio) {
      return
    }

    audio.currentTime = 0
    audio.play().catch(() => {})
  }

  function handleBookFlip(event) {
    setCurrentPage(event.data)
  }

  function handleBookInit(event) {
    setBookReady(true)
    setCurrentPage(event?.data?.page ?? 0)
  }

  function handleTurnPage(direction) {
    const pageFlip = flipBookRef.current?.pageFlip?.()

    if (!pageFlip || bookState === 'flipping') {
      return
    }

    playFlipNoise()

    if (direction === 'forward') {
      pageFlip.flipNext('bottom')
      return
    }

    pageFlip.flipPrev('bottom')
  }

  return (
    <MotionMain
      className="page-shell"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
    >
      <div className="night-gradient" aria-hidden="true"></div>

      <section className="scene-backdrop" aria-hidden="true">
        <FluidBackdrop backgroundSrc={backgroundPandora} />
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
              tiltMaxAngleX={5}
              tiltMaxAngleY={7}
              scale={1.004}
              transitionSpeed={320}
              glareEnable={true}
              glareMaxOpacity={0.05}
              glareColor="#b8f7ff"
              glareBorderRadius="26px"
              onMove={({ tiltAngleXPercentage = 0, tiltAngleYPercentage = 0 }) => {
                setBookPose(tiltAngleYPercentage / 100, tiltAngleXPercentage / 100)
              }}
              onLeave={resetBookPose}
            >
              <div ref={storybookShellRef} className="storybook-shell">
                <div className="flip-book-shell">
                  <HTMLFlipBook
                    ref={flipBookRef}
                    width={390}
                    height={560}
                    size="stretch"
                    minWidth={280}
                    maxWidth={390}
                    minHeight={400}
                    maxHeight={560}
                    drawShadow={true}
                    maxShadowOpacity={0.24}
                    showCover={true}
                    mobileScrollSupport={true}
                    swipeDistance={24}
                    flippingTime={900}
                    startZIndex={10}
                    useMouseEvents={false}
                    className="flip-book"
                    onInit={handleBookInit}
                    onFlip={handleBookFlip}
                    onChangeState={(event) => setBookState(event.data)}
                  >
                    {bookPages.map((page) => (
                      <FlipBookPage key={page.key} page={page} />
                    ))}
                  </HTMLFlipBook>

                  <button
                    type="button"
                    className="book-hitarea book-hitarea-left"
                    onClick={() => handleTurnPage('backward')}
                    disabled={!bookReady || bookState === 'flipping' || currentPage <= 0}
                    aria-label="Turn the book backward"
                  >
                    <span className="sr-only">Turn the book backward</span>
                  </button>

                  <button
                    type="button"
                    className="book-hitarea book-hitarea-right"
                    onClick={() => handleTurnPage('forward')}
                    disabled={
                      !bookReady || bookState === 'flipping' || currentPage >= bookPages.length - 1
                    }
                    aria-label="Turn the book forward"
                  >
                    <span className="sr-only">Turn the book forward</span>
                  </button>
                </div>
              </div>
            </Tilt>

            <p className="book-hint">
              {currentPage <= 0
                ? 'Tap the right page to open the story.'
                : currentPage >= bookPages.length - 1
                  ? 'Tap the left page to revisit the story.'
                  : 'Tap the right page to continue or the left page to go back.'}
            </p>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </MotionMain>
  )
}

export default App
