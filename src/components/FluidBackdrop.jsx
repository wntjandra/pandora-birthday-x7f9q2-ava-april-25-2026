import { useEffect, useRef } from 'react'

const particlePalette = [
  { core: 'rgba(206, 113, 255, 0.44)', edge: 'rgba(206, 113, 255, 0)' },
  { core: 'rgba(101, 216, 255, 0.4)', edge: 'rgba(101, 216, 255, 0)' },
  { core: 'rgba(255, 122, 224, 0.3)', edge: 'rgba(255, 122, 224, 0)' },
]

const ripplePalette = [
  'rgba(184, 101, 255, 0.28)',
  'rgba(84, 198, 255, 0.24)',
  'rgba(255, 118, 227, 0.18)',
]

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

export default function FluidBackdrop() {
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

    const particles = []
    const ripples = []
    const pointer = {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.55,
      time: performance.now(),
      down: false,
      inside: true,
    }

    let rafId = 0
    let lastEmission = 0
    let dpr = 1

    function resizeCanvas() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function pushParticles(x, y, speed, pointerDown) {
      const total = pointerDown ? 6 : 4

      for (let index = 0; index < total; index += 1) {
        const angle = Math.random() * Math.PI * 2
        const burst = 0.35 + Math.random() * 0.8 + speed * 0.7

        particles.push({
          x,
          y,
          vx: Math.cos(angle) * burst * 0.7,
          vy: Math.sin(angle) * burst * 0.35 - (0.4 + Math.random() * 0.9),
          radius: 10 + Math.random() * 18 + speed * 6,
          life: 1,
          fade: 0.015 + Math.random() * 0.018,
          drift: 0.004 + Math.random() * 0.012,
          color: randomFrom(particlePalette),
        })
      }

      ripples.push({
        x,
        y,
        radius: pointerDown ? 16 : 10,
        growth: pointerDown ? 3.2 : 2.2,
        life: pointerDown ? 0.34 : 0.22,
        fade: pointerDown ? 0.013 : 0.017,
        color: randomFrom(ripplePalette),
        lineWidth: pointerDown ? 2.8 : 1.8,
      })
    }

    function handlePointerMove(event) {
      const now = performance.now()
      const dx = event.clientX - pointer.x
      const dy = event.clientY - pointer.y
      const dt = Math.max(now - pointer.time, 16)
      const speed = Math.min(Math.hypot(dx, dy) / dt, 2.2)

      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.time = now
      pointer.inside = true

      if (now - lastEmission > 18) {
        pushParticles(pointer.x, pointer.y, speed, event.buttons > 0 || pointer.down)
        lastEmission = now
      }
    }

    function handlePointerDown(event) {
      pointer.down = true
      pointer.x = event.clientX
      pointer.y = event.clientY
      pushParticles(pointer.x, pointer.y, 1.2, true)
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

    function render() {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight)

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
        context.shadowBlur = 24
        context.shadowColor = ripple.color.replace(/[\d.]+\)$/, `${Math.max(ripple.life * 0.9, 0)})`)
        context.stroke()
        context.restore()
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

      if (pointer.inside && Math.random() > 0.68) {
        pushParticles(pointer.x, pointer.y, 0.18, false)
      }

      rafId = window.requestAnimationFrame(render)
    }

    resizeCanvas()
    render()

    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="fluid-backdrop-canvas" aria-hidden="true"></canvas>
}
