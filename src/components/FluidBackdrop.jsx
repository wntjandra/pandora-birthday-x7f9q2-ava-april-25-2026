import { useEffect, useRef } from 'react'
import fluidSource from '../../vendor/pavel-fluid/script.js?raw'
import ditheringTextureUrl from '../../vendor/pavel-fluid/LDR_LLL1_0.png'

const transformedFluidSource = buildFluidSource(ditheringTextureUrl)

function buildFluidSource(textureUrl) {
  let source = fluidSource

  source = source.replace(
    /\/\/ Mobile promo section[\s\S]*?\/\/ Simulation section/,
    '// Simulation section',
  )
  source = source.replace(
    "const canvas = document.getElementsByTagName('canvas')[0];",
    'const canvas = FLUID_CANVAS;',
  )
  source = source.replace('startGUI();', '// GUI disabled in this integration')
  source = source.replace(
    "let ditheringTexture = createTextureAsync('LDR_LLL1_0.png');",
    `let ditheringTexture = createTextureAsync(${JSON.stringify(textureUrl)});`,
  )
  source = source.replace('SIM_RESOLUTION: 128,', 'SIM_RESOLUTION: 96,')
  source = source.replace('DYE_RESOLUTION: 1024,', 'DYE_RESOLUTION: 512,')
  source = source.replace('DENSITY_DISSIPATION: 1,', 'DENSITY_DISSIPATION: 2.6,')
  source = source.replace('VELOCITY_DISSIPATION: 0.2,', 'VELOCITY_DISSIPATION: 3.1,')
  source = source.replace('PRESSURE: 0.8,', 'PRESSURE: 0.12,')
  source = source.replace('PRESSURE_ITERATIONS: 20,', 'PRESSURE_ITERATIONS: 14,')
  source = source.replace('CURL: 30,', 'CURL: 18,')
  source = source.replace('SPLAT_RADIUS: 0.25,', 'SPLAT_RADIUS: 0.38,')
  source = source.replace('SPLAT_FORCE: 6000,', 'SPLAT_FORCE: 2800,')
  source = source.replace('SHADING: true,', 'SHADING: false,')
  source = source.replace('COLORFUL: true,', 'COLORFUL: false,')
  source = source.replace('TRANSPARENT: false,', 'TRANSPARENT: true,')
  source = source.replace('BLOOM_ITERATIONS: 8,', 'BLOOM_ITERATIONS: 6,')
  source = source.replace('BLOOM_RESOLUTION: 256,', 'BLOOM_RESOLUTION: 128,')
  source = source.replace('BLOOM_INTENSITY: 0.8,', 'BLOOM_INTENSITY: 0.42,')
  source = source.replace('BLOOM_THRESHOLD: 0.6,', 'BLOOM_THRESHOLD: 0.12,')
  source = source.replace('BLOOM_SOFT_KNEE: 0.7,', 'BLOOM_SOFT_KNEE: 0.85,')
  source = source.replace('SUNRAYS: true,', 'SUNRAYS: false,')
  source = source.replace(
    /function generateColor \(\) \{[\s\S]*?return c;\n\}/,
    `function generateColor () {
    const palette = [
        { r: 0.74, g: 0.28, b: 1.0 },
        { r: 0.36, g: 0.79, b: 1.0 },
        { r: 1.0, g: 0.36, b: 0.88 },
        { r: 0.54, g: 0.52, b: 1.0 }
    ];
    const chosen = palette[Math.floor(Math.random() * palette.length)];
    return {
        r: chosen.r * 0.22,
        g: chosen.g * 0.2,
        b: chosen.b * 0.22
    };
}`,
  )
  source = source.replace(
    '    requestAnimationFrame(update);',
    '    if (!window.__AVA_PAVEL_FLUID_STOP__) window.__AVA_PAVEL_FLUID_RAF__ = requestAnimationFrame(update);',
  )

  return `const ga = window.ga || (() => {});\n${source}`
}

export default function FluidBackdrop() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas || window.__AVA_PAVEL_FLUID_ACTIVE__) {
      return undefined
    }

    window.__AVA_PAVEL_FLUID_ACTIVE__ = true
    window.__AVA_PAVEL_FLUID_STOP__ = false

    try {
      const runner = new Function('FLUID_CANVAS', 'window', 'document', transformedFluidSource)
      runner(canvas, window, document)
    } catch (error) {
      console.error('Failed to initialize Pavel fluid backdrop.', error)
    }

    return () => {
      window.__AVA_PAVEL_FLUID_STOP__ = true

      if (window.__AVA_PAVEL_FLUID_RAF__) {
        window.cancelAnimationFrame(window.__AVA_PAVEL_FLUID_RAF__)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="fluid-backdrop-canvas" aria-hidden="true"></canvas>
}
