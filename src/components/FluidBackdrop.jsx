import { useEffect, useRef } from 'react'

const ripplePalette = [
  'rgba(184, 101, 255, 0.28)',
  'rgba(84, 198, 255, 0.24)',
  'rgba(255, 118, 227, 0.18)',
]

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)]
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

    const ripples = []
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lowPowerDevice =
      (typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4) ||
      (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4)

    let rafId = 0
    let emissionCooldown = 0
    let dpr = 1

    function resizeCanvas() {
      dpr = prefersReducedMotion || lowPowerDevice ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function addRipple(x, y, isPrimary = false) {
      ripples.push({
        x,
        y,
        radius: isPrimary ? 14 : 10,
        growth: isPrimary ? 2.6 : 2,
        life: isPrimary ? 0.3 : 0.22,
        fade: isPrimary ? 0.011 : 0.014,
        color: randomFrom(ripplePalette),
        lineWidth: isPrimary ? 2.4 : 1.6,
      })

      if (!rafId) {
        rafId = window.requestAnimationFrame(render)
      }
    }

    function handlePointerMove(event) {
      if (prefersReducedMotion || lowPowerDevice) {
        return
      }

      const now = performance.now()

      if (now - emissionCooldown < 72) {
        return
      }

      emissionCooldown = now
      addRipple(event.clientX, event.clientY)
    }

    function handlePointerDown(event) {
      addRipple(event.clientX, event.clientY, true)
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
        context.shadowBlur = 18
        context.shadowColor = ripple.color.replace(/[\d.]+\)$/, `${Math.max(ripple.life * 0.9, 0)})`)
        context.stroke()
        context.restore()
      }

      if (ripples.length > 0) {
        rafId = window.requestAnimationFrame(render)
      } else {
        rafId = 0
      }
    }

    resizeCanvas()

    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerdown', handlePointerDown, { passive: true })

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [])

  return (
    <div className="fluid-backdrop" aria-hidden="true">
      <div className="fluid-backdrop-image" style={{ backgroundImage: `url(${backgroundSrc})` }}></div>
      <canvas ref={canvasRef} className="fluid-backdrop-canvas"></canvas>
    </div>
  )
}
