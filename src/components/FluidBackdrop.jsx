import { useEffect, useRef } from 'react'

const vertexShaderSource = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const fragmentShaderSource = `
precision highp float;

varying vec2 v_uv;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform float u_time;
uniform float u_intensity;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

mat2 rotate2d(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;

  for (int index = 0; index < 5; index += 1) {
    value += amplitude * noise(p);
    p = rotate2d(0.72) * p * 2.02 + vec2(16.7, 9.2);
    amplitude *= 0.5;
  }

  return value;
}

float ridge(float value) {
  value = abs(value);
  value = 0.62 - value;
  return value * value;
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 centered = uv - 0.5;
  centered.x *= aspect;

  vec2 pointer = u_pointer - 0.5;
  pointer.x *= aspect;

  float t = u_time * 0.08;

  vec2 baseFlow = centered * 1.9;
  vec2 warpA = vec2(
    fbm(baseFlow + vec2(t * 1.4, -t * 0.6)),
    fbm(rotate2d(1.4) * baseFlow + vec2(-t * 0.8, t * 1.2))
  );
  vec2 warpB = vec2(
    fbm(baseFlow * 1.8 - warpA * 2.2 + vec2(t * 0.7, t * 0.25)),
    fbm(rotate2d(-1.0) * baseFlow * 1.6 + warpA * 1.6 - vec2(t * 0.35, t * 0.9))
  );

  vec2 flow = baseFlow + (warpA - 0.5) * 1.1 + (warpB - 0.5) * 0.9;
  float pointerFalloff = exp(-length(centered - pointer) * 4.5);
  flow += normalize(centered - pointer + vec2(0.001)) * pointerFalloff * 0.12 * sin(t * 6.0);

  float marble = fbm(flow * 2.6);
  float contour = fbm(flow * 4.8 + marble * 2.0 + t);
  float ribbons = ridge(contour - 0.5) * 6.0;
  ribbons = smoothstep(0.03, 0.38, ribbons);
  float smoke = fbm(flow * 3.4 - vec2(t * 0.5, -t * 0.9));
  float cavities = smoothstep(0.18, 0.82, marble * 0.55 + smoke * 0.65);

  vec2 distortion = flow / vec2(max(aspect, 1.0), 1.0) * (0.02 + u_intensity * 0.015);
  vec2 sampleUv = clamp(uv + distortion, 0.0, 1.0);
  vec3 base = texture2D(u_texture, sampleUv).rgb;

  vec3 deep = vec3(0.04, 0.015, 0.09);
  vec3 plum = vec3(0.18, 0.06, 0.32);
  vec3 violet = vec3(0.44, 0.17, 0.67);
  vec3 glow = vec3(0.78, 0.45, 0.98);
  vec3 coral = vec3(0.92, 0.49, 0.56);

  vec3 fluid = mix(deep, plum, cavities);
  fluid = mix(fluid, violet, smoothstep(0.3, 0.95, marble));
  fluid += glow * ribbons * 0.85;
  fluid += coral * pow(max(ribbons - 0.72, 0.0), 2.0) * 1.6;

  float pooled = smoothstep(1.25, 0.12, length(centered + (warpB - 0.5) * 0.24));
  vec3 combined = mix(base * 0.3, fluid, 0.68 * pooled);
  combined += base * 0.16;
  combined += ribbons * 0.06;

  float vignette = smoothstep(1.4, 0.2, length(centered));
  combined *= mix(0.58, 1.08, vignette);

  gl_FragColor = vec4(combined, 1.0);
}
`

function createShader(gl, type, source) {
  const shader = gl.createShader(type)

  if (!shader) {
    return null
  }

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader)

    gl.deleteShader(shader)
    throw new Error(error || 'Shader compilation failed')
  }

  return shader
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram()

  if (!program) {
    return null
  }

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const error = gl.getProgramInfoLog(program)

    gl.deleteProgram(program)
    throw new Error(error || 'Program link failed')
  }

  return program
}

export default function FluidBackdrop({ backgroundSrc }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return undefined
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lowPowerDevice =
      (typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4) ||
      (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4)
    const dprCap = prefersReducedMotion || lowPowerDevice ? 1 : 1.35
    const targetFrameMs = prefersReducedMotion || lowPowerDevice ? 1000 / 30 : 1000 / 60
    const intensity = prefersReducedMotion || lowPowerDevice ? 0.45 : 1

    let gl = null

    try {
      gl =
        canvas.getContext('webgl', {
          alpha: true,
          antialias: false,
          depth: false,
          stencil: false,
          powerPreference: lowPowerDevice ? 'low-power' : 'high-performance',
          premultipliedAlpha: false,
        }) ||
        canvas.getContext('experimental-webgl')
    } catch {
      gl = null
    }

    if (!gl) {
      canvas.style.backgroundImage = `url(${backgroundSrc})`
      canvas.style.backgroundPosition = 'center'
      canvas.style.backgroundRepeat = 'no-repeat'
      canvas.style.backgroundSize = 'cover'
      return undefined
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

    if (!vertexShader || !fragmentShader) {
      return undefined
    }

    const program = createProgram(gl, vertexShader, fragmentShader)

    if (!program) {
      return undefined
    }

    const positionBuffer = gl.createBuffer()
    const texture = gl.createTexture()

    if (!positionBuffer || !texture) {
      return undefined
    }

    const positionLocation = gl.getAttribLocation(program, 'a_position')
    const timeLocation = gl.getUniformLocation(program, 'u_time')
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
    const pointerLocation = gl.getUniformLocation(program, 'u_pointer')
    const textureLocation = gl.getUniformLocation(program, 'u_texture')
    const intensityLocation = gl.getUniformLocation(program, 'u_intensity')

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    )

    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([7, 9, 18, 255]),
    )

    const image = new Image()
    const pointer = { currentX: 0.5, currentY: 0.5, targetX: 0.5, targetY: 0.5 }

    let imageLoaded = false
    let rafId = 0
    let lastFrameTime = 0

    image.decoding = 'async'
    image.src = backgroundSrc
    image.addEventListener('load', () => {
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
      imageLoaded = true
    })

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap)

      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    function handlePointerMove(event) {
      pointer.targetX = event.clientX / window.innerWidth
      pointer.targetY = 1 - event.clientY / window.innerHeight
    }

    function handlePointerLeave() {
      pointer.targetX = 0.5
      pointer.targetY = 0.5
    }

    function render(now) {
      if (now - lastFrameTime < targetFrameMs) {
        rafId = window.requestAnimationFrame(render)
        return
      }

      lastFrameTime = now

      pointer.currentX += (pointer.targetX - pointer.currentX) * 0.06
      pointer.currentY += (pointer.targetY - pointer.currentY) * 0.06

      gl.useProgram(program)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.enableVertexAttribArray(positionLocation)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, texture)

      if (textureLocation) {
        gl.uniform1i(textureLocation, 0)
      }

      if (timeLocation) {
        gl.uniform1f(timeLocation, now * 0.001)
      }

      if (resolutionLocation) {
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
      }

      if (pointerLocation) {
        gl.uniform2f(pointerLocation, pointer.currentX, pointer.currentY)
      }

      if (intensityLocation) {
        gl.uniform1f(intensityLocation, intensity)
      }

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      if (!imageLoaded) {
        gl.flush()
      }

      rafId = window.requestAnimationFrame(render)
    }

    resizeCanvas()
    rafId = window.requestAnimationFrame(render)

    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)

      gl.deleteBuffer(positionBuffer)
      gl.deleteTexture(texture)
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
    }
  }, [backgroundSrc])

  return <canvas ref={canvasRef} className="fluid-backdrop-canvas" aria-hidden="true"></canvas>
}
