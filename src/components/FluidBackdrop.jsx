import { useEffect, useRef } from 'react'

const particlePalette = [
  { core: 'rgba(206, 113, 255, 0.48)', edge: 'rgba(206, 113, 255, 0)' },
  { core: 'rgba(101, 216, 255, 0.46)', edge: 'rgba(101, 216, 255, 0)' },
  { core: 'rgba(255, 122, 224, 0.34)', edge: 'rgba(255, 122, 224, 0)' },
]

const ripplePalette = [
  'rgba(184, 101, 255, 0.38)',
  'rgba(84, 198, 255, 0.34)',
  'rgba(255, 118, 227, 0.26)',
]

const trailPalette = [
  'rgba(111, 228, 255, 0.24)',
  'rgba(194, 120, 255, 0.24)',
  'rgba(255, 132, 230, 0.22)',
]

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function drawCoverImage(context, image, canvasWidth, canvasHeight, offsetX, offsetY, scale) {
  if (!image || !image.naturalWidth || !image.naturalHeight) {
    return
  }

  const sourceRatio = image.naturalWidth / image.naturalHeight
  const targetRatio = canvasWidth / canvasHeight

  let sourceWidth = image.naturalWidth
  let sourceHeight = image.naturalHeight

  if (sourceRatio > targetRatio) {
    sourceHeight = image.naturalHeight
    sourceWidth = sourceHeight * targetRatio
  } else {
    sourceWidth = image.naturalWidth
    sourceHeight = sourceWidth / targetRatio
  }

  const cropX = (image.naturalWidth - sourceWidth) * 0.5 + offsetX
  const cropY = (image.naturalHeight - sourceHeight) * 0.5 + offsetY
  const safeCropX = Math.max(0, Math.min(cropX, image.naturalWidth - sourceWidth))
  const safeCropY = Math.max(0, Math.min(cropY, image.naturalHeight - sourceHeight))
  const drawWidth = canvasWidth * scale
  const drawHeight = canvasHeight * scale
  const drawX = (canvasWidth - drawWidth) * 0.5
  const drawY = (canvasHeight - drawHeight) * 0.5

  context.drawImage(
    image,
    safeCropX,
    safeCropY,
    sourceWidth,
    sourceHeight,
    drawX,
    drawY,
    drawWidth,
    drawHeight,
  )
}

export default function FluidBackdrop({ backgroundSrc }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return undefined
    }

    const context = canvas.getContext('2d')

    if (!context) {
      return undefined
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lowPowerDevice =
      (typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4) ||
      (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4)
    const useLightMode = prefersReducedMotion || lowPowerDevice

    const particles = []
    const ripples = []
    const trails = []
    const pointer = {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.55,
      prevX: window.innerWidth * 0.5,
      prevY: window.innerHeight * 0.55,
      time: performance.now(),
      down: false,
      inside: true,
    }

    let rafId = 0
    let lastEmission = 0
    let dpr = 1
    let disposed = false
    let backgroundImage = null
    const image = new Image()

    image.decoding = 'async'
    image.src = backgroundSrc
    image.addEventListener('load', () => {
      if (!disposed) {
        backgroundImage = image
      }
    })

    function resizeCanvas() {
      dpr = useLightMode ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function addTrail(x1, y1, x2, y2, speed, pointerDown, hoverBoost = 0) {
      trails.push({
        x1,
        y1,
        x2,
        y2,
        lineWidth: (pointerDown ? 26 : 22) + speed * 14 + hoverBoost * 10,
        life: (pointerDown ? 0.16 : 0.13) + hoverBoost * 0.035,
        fade: pointerDown ? 0.007 : Math.max(0.0068, 0.0082 - hoverBoost * 0.0012),
        color: randomFrom(trailPalette),
      })
    }

    function pushEffects(x, y, speed, pointerDown, hoverBoost = 0) {
      const primaryRadius = (pointerDown ? 16 : 12) + speed * 8 + hoverBoost * 4
      const primaryGrowth = (pointerDown ? 3 : 2.3) + hoverBoost * 0.8
      const primaryLife = (pointerDown ? 0.34 : 0.23) + hoverBoost * 0.07
      const primaryFade = Math.max(pointerDown ? 0.013 : 0.0115, 0.017 - hoverBoost * 0.0045)

      ripples.push({
        x,
        y,
        radius: primaryRadius,
        growth: primaryGrowth,
        life: primaryLife,
        fade: primaryFade,
        color: randomFrom(ripplePalette),
        lineWidth: (pointerDown ? 2.6 : 2.05) + hoverBoost * 0.55,
      })

      if (!pointerDown && hoverBoost > 0.2) {
        const ghostX = x - (x - pointer.prevX) * 0.42
        const ghostY = y - (y - pointer.prevY) * 0.42

        ripples.push({
          x: ghostX,
          y: ghostY,
          radius: primaryRadius * 0.72,
          growth: primaryGrowth * 0.94,
          life: primaryLife * 0.82,
          fade: primaryFade * 1.08,
          color: randomFrom(ripplePalette),
          lineWidth: 1.5 + hoverBoost * 0.45,
        })
      }

      if (useLightMode) {
        return
      }

      const totalParticles = pointerDown ? 5 : Math.min(6, 4 + Math.round(hoverBoost * 2))

      for (let index = 0; index < totalParticles; index += 1) {
        const angle = Math.random() * Math.PI * 2
        const burst = 0.38 + Math.random() * 0.86 + speed * 0.74 + hoverBoost * 0.4

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * burst * 0.68,
          vy: Math.sin(angle) * burst * 0.35 - (0.28 + Math.random() * 0.75),
          radius: 11 + Math.random() * 14 + speed * 5 + hoverBoost * 4,
          life: 1,
          fade: 0.015 + Math.random() * 0.014,
          drift: 0.004 + Math.random() * 0.01,
          color: randomFrom(particlePalette),
        })
      }

      addTrail(pointer.prevX, pointer.prevY, x, y, speed, pointerDown, hoverBoost)

      if (!pointerDown && hoverBoost > 0.28) {
        addTrail(
          pointer.prevX + (x - pointer.prevX) * 0.22,
          pointer.prevY + (y - pointer.prevY) * 0.22,
          x,
          y,
          speed * 0.92,
          false,
          hoverBoost * 0.7,
        )
      }
    }

    function handlePointerMove(event) {
      const now = performance.now()
      const dx = event.clientX - pointer.x
      const dy = event.clientY - pointer.y
      const dt = Math.max(now - pointer.time, 16)
      const speed = Math.min(Math.hypot(dx, dy) / dt, 2.2)
      const hoverBoost = Math.min(1.2, 0.28 + speed * 1.55)

      pointer.prevX = pointer.x
      pointer.prevY = pointer.y
      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.time = now
      pointer.inside = true

      const emissionDelay = useLightMode ? 48 : 14

      if (now - lastEmission > emissionDelay) {
        pushEffects(pointer.x, pointer.y, speed, event.buttons > 0 || pointer.down, hoverBoost)
        lastEmission = now
      }
    }

    function handlePointerDown(event) {
      pointer.down = true
      pointer.prevX = event.clientX
      pointer.prevY = event.clientY
      pointer.x = event.clientX
      pointer.y = event.clientY
      pushEffects(pointer.x, pointer.y, 1.2, true, 0.8)
    }

    function handlePointerUp() {
      pointer.down = false
    }

    function handlePointerLeave() {
      pointer.inside = false
      pointer.down = false
    }

    function drawGlow(x, y, radius, alpha, color) {
      const gradient = context.createRadialGradient(x, y, 0, x, y, radius)

      gradient.addColorStop(0, color.core.replace(/[\d.]+\)$/, `${alpha})`))
      gradient.addColorStop(1, color.edge)

      context.fillStyle = gradient
      context.beginPath()
      context.arc(x, y, radius, 0, Math.PI * 2)
      context.fill()
    }

    function drawTrail(trail) {
      context.save()
      context.strokeStyle = trail.color.replace(/[\d.]+\)$/, `${trail.life})`)
      context.lineWidth = trail.lineWidth
      context.lineCap = 'round'
      context.lineJoin = 'round'
      context.shadowBlur = 24
      context.shadowColor = trail.color.replace(/[\d.]+\)$/, `${Math.max(trail.life * 0.9, 0)})`)
      context.beginPath()
      context.moveTo(trail.x1, trail.y1)
      context.quadraticCurveTo(
        (trail.x1 + trail.x2) * 0.5,
        Math.min(trail.y1, trail.y2) - trail.lineWidth * 0.24,
        trail.x2,
        trail.y2,
      )
      context.stroke()
      context.restore()
    }

    function render(now) {
      const canvasWidth = window.innerWidth
      const canvasHeight = window.innerHeight
      const driftX = useLightMode ? 0 : Math.sin(now * 0.00011) * 22
      const driftY = useLightMode ? 0 : Math.cos(now * 0.00008) * 16

      context.clearRect(0, 0, window.innerWidth, window.innerHeight)

      if (backgroundImage) {
        drawCoverImage(context, backgroundImage, canvasWidth, canvasHeight, driftX, driftY, 1.04)
      } else {
        const fallback = context.createLinearGradient(0, 0, 0, canvasHeight)
        fallback.addColorStop(0, '#081327')
        fallback.addColorStop(0.55, '#122347')
        fallback.addColorStop(1, '#14091f')
        context.fillStyle = fallback
        context.fillRect(0, 0, canvasWidth, canvasHeight)
      }

      const skyGlow = context.createRadialGradient(
        canvasWidth * 0.52,
        canvasHeight * 0.28,
        0,
        canvasWidth * 0.52,
        canvasHeight * 0.28,
        canvasWidth * 0.48,
      )
      skyGlow.addColorStop(0, useLightMode ? 'rgba(116, 196, 255, 0.14)' : 'rgba(116, 196, 255, 0.18)')
      skyGlow.addColorStop(0.4, 'rgba(78, 93, 255, 0.06)')
      skyGlow.addColorStop(1, 'rgba(5, 10, 20, 0)')
      context.fillStyle = skyGlow
      context.fillRect(0, 0, canvasWidth, canvasHeight)

      const edgeShade = context.createLinearGradient(0, 0, 0, canvasHeight)
      edgeShade.addColorStop(0, 'rgba(1, 6, 16, 0.1)')
      edgeShade.addColorStop(0.58, 'rgba(1, 6, 18, 0.22)')
      edgeShade.addColorStop(1, 'rgba(1, 4, 10, 0.54)')
      context.fillStyle = edgeShade
      context.fillRect(0, 0, canvasWidth, canvasHeight)

      for (let index = ripples.length - 1; index >= 0; index -= 1) {
        const ripple = ripples[index]

        ripple.radius += ripple.growth
        ripple.life -= ripple.fade

        if (ripple.life <= 0) {
          ripples.splice(index, 1)
          continue
        }

        context.save()
        context.beginPath()
        context.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2)
        context.strokeStyle = ripple.color.replace(/[\d.]+\)$/, `${ripple.life})`)
        context.lineWidth = ripple.lineWidth
        context.shadowBlur = useLightMode ? 16 : 22
        context.shadowColor = ripple.color.replace(/[\d.]+\)$/, `${Math.max(ripple.life * 0.9, 0)})`)
        context.stroke()
        context.restore()
      }

      context.save()
      context.globalCompositeOperation = 'screen'

      for (let index = trails.length - 1; index >= 0; index -= 1) {
        const trail = trails[index]

        trail.life -= trail.fade

        if (trail.life <= 0) {
          trails.splice(index, 1)
          continue
        }

        drawTrail(trail)
      }

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index]

        particle.x += particle.vx
        particle.y += particle.vy
        particle.vy -= particle.drift
        particle.vx *= 0.992
        particle.life -= particle.fade

        if (particle.life <= 0) {
          particles.splice(index, 1)
          continue
        }

        drawGlow(particle.x, particle.y, particle.radius, particle.life * 0.34, particle.color)
      }

      context.restore()

      if (!useLightMode && pointer.inside && Math.random() > 0.66) {
        pushEffects(pointer.x, pointer.y, 0.2, false, 0.16)
      }

      rafId = window.requestAnimationFrame(render)
    }

    resizeCanvas()
    render(performance.now())

    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      disposed = true
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [backgroundSrc])

  return <canvas ref={canvasRef} className="fluid-backdrop-canvas" aria-hidden="true"></canvas>
}
