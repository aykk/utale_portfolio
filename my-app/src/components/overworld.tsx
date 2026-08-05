'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { VT323 } from 'next/font/google'

const vt323 = VT323({ weight: '400', subsets: ['latin'] })

/* ---------------------------------------------------------------------------
 * The room is drawn in a fixed 640x480 space, the same window size Undertale
 * uses, and the whole stage is scaled up by an integer-ish factor to fit the
 * viewport. Everything below is in room pixels.
 * ------------------------------------------------------------------------- */

const W = 640
const H = 480
const TILE = 20

// Ruins palette
const C = {
  void: '#000000',
  wallDark: '#1d0c22',
  wallMid: '#432046',
  wallLight: '#5d3062',
  wallEdge: '#7b4180',
  floorDark: '#120813',
  floorMid: '#1b0d1f',
  floorLine: '#261230',
  star: '#ffd53d',
  starDim: '#c79c14',
  white: '#ffffff',
}

const WALL_TOP = 100
const WALL_SIDE = 40
const WALL_BOTTOM = 40

type Dir = 'down' | 'left' | 'right' | 'up'

type Interactable = {
  id: string
  x: number
  y: number
  w: number
  h: number
  kind: 'npc' | 'sign' | 'save'
  label?: string
  lines: string[]
  href?: string
}

type Door = {
  id: string
  x: number
  w: number
  label: string
  route: string
}

const DOORS: Door[] = [
  { id: 'about', x: 130, w: 60, label: 'ABOUT ME', route: '/aboutme' },
  { id: 'projects', x: 290, w: 60, label: 'PROJECTS', route: '/projects' },
  { id: 'contact', x: 450, w: 60, label: 'CONTACT', route: '/contact' },
]

const RESUME_URL =
  'https://drive.google.com/file/d/1Me_lqwDOnApaN0UxzWP5DByBj_EweOu4/view?usp=sharing'

const FLOWEY_LINES = [
  "* Howdy! I'm Andrew!",
  '* Welcome to my digital portfolio!',
  "* I'm a software engineer in Washington, D.C., and a 2026 Computer Science grad from Virginia Tech.",
  '* I love making fun, interactive things like the room you are standing in.',
  "* These days I'm a founding engineer at sakas.io, building a low-code platform for automating multi-step workflows.",
  '* Before that I shipped web3 and DeFi frontends at Aerostrategy, and interned at J.B. Hunt and Widelity.',
  "* I build a lot at hackathons, too! HackViolet 2026, PatriotHacks 2026, VTHacks 2025, HooHacks 2024, Startup Sprint 2023.",
  '* Walk through the doorways to see more. The golden star saves... I mean, shows my resume.',
  "* This place was built with Next.js, React, TypeScript, and a lot of determination.",
  '* Thanks for visiting! :)',
]

const INTERACTABLES: Interactable[] = [
  {
    id: 'flowey',
    x: 292,
    y: 196,
    w: 56,
    h: 60,
    kind: 'npc',
    lines: FLOWEY_LINES,
  },
  {
    id: 'save',
    x: 508,
    y: 300,
    w: 24,
    h: 24,
    kind: 'save',
    lines: [
      '* (The sight of a finished resume fills you with determination.)',
      '* (Opening it in a new tab...)',
    ],
    href: RESUME_URL,
  },
  {
    id: 'sign',
    x: 400,
    y: 386,
    w: 56,
    h: 34,
    kind: 'sign',
    lines: [
      '* (The sign is carved into the wall.)',
      '* (Arrow keys or WASD to move. Z or SPACE to check things. C for your stats.)',
      '* (Walk into a doorway to go there.)',
    ],
  },
]

const SOLIDS: { x: number; y: number; w: number; h: number }[] = [
  // side walls and bottom wall
  { x: 0, y: 0, w: WALL_SIDE, h: H },
  { x: W - WALL_SIDE, y: 0, w: WALL_SIDE, h: H },
  { x: 0, y: H - WALL_BOTTOM, w: W, h: WALL_BOTTOM },
  // top wall, split around the three doorways
  { x: 0, y: 0, w: DOORS[0].x, h: WALL_TOP },
  { x: DOORS[0].x + DOORS[0].w, y: 0, w: DOORS[1].x - (DOORS[0].x + DOORS[0].w), h: WALL_TOP },
  { x: DOORS[1].x + DOORS[1].w, y: 0, w: DOORS[2].x - (DOORS[1].x + DOORS[1].w), h: WALL_TOP },
  { x: DOORS[2].x + DOORS[2].w, y: 0, w: W - (DOORS[2].x + DOORS[2].w), h: WALL_TOP },
  // objects you cannot walk through
  ...INTERACTABLES.map((o) => ({ x: o.x, y: o.y + o.h - 14, w: o.w, h: 14 })),
]

// Frisk's collision box sits at his feet, like Undertale's
const FRISK_W = 30
const FRISK_H = 45
const FEET_W = 22
const FEET_H = 10
const SPEED = 115 // px per second
const TYPE_MS = 50 // matches the site's typewriter cadence

function rectsOverlap(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number }
) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
}

/* --- room painting ------------------------------------------------------- */

function paintRoom(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = C.void
  ctx.fillRect(0, 0, W, H)

  // floor
  for (let y = WALL_TOP; y < H - WALL_BOTTOM; y += TILE) {
    for (let x = WALL_SIDE; x < W - WALL_SIDE; x += TILE) {
      const alt = ((x / TILE) + (y / TILE)) % 2 === 0
      ctx.fillStyle = alt ? C.floorDark : C.floorMid
      ctx.fillRect(x, y, TILE, TILE)
      ctx.fillStyle = C.floorLine
      ctx.fillRect(x, y, TILE, 1)
      ctx.fillRect(x, y, 1, TILE)
    }
  }

  const brick = (x: number, y: number, w: number, h: number) => {
    ctx.fillStyle = C.wallMid
    ctx.fillRect(x, y, w, h)
    ctx.fillStyle = C.wallLight
    ctx.fillRect(x, y, w, 2)
    ctx.fillStyle = C.wallDark
    ctx.fillRect(x, y + h - 2, w, 2)
    ctx.fillRect(x + w - 2, y, 2, h)
  }

  // brick courses, offset every other row like the Ruins
  const wall = (x0: number, y0: number, x1: number, y1: number) => {
    let row = 0
    for (let y = y0; y < y1; y += TILE) {
      const offset = row % 2 === 0 ? 0 : -TILE / 2
      for (let x = x0 + offset; x < x1; x += TILE * 2) {
        const bx = Math.max(x, x0)
        const bw = Math.min(x + TILE * 2, x1) - bx
        if (bw > 0) brick(bx, y, bw, Math.min(TILE, y1 - y))
      }
      row += 1
    }
  }

  wall(0, 0, W, WALL_TOP)
  wall(0, WALL_TOP, WALL_SIDE, H)
  wall(W - WALL_SIDE, WALL_TOP, W, H)
  wall(0, H - WALL_BOTTOM, W, H)

  // doorways punched through the top wall
  for (const d of DOORS) {
    ctx.fillStyle = C.void
    ctx.fillRect(d.x, 0, d.w, WALL_TOP)
    ctx.fillStyle = C.wallEdge
    ctx.fillRect(d.x - 4, 0, 4, WALL_TOP)
    ctx.fillRect(d.x + d.w, 0, 4, WALL_TOP)
    ctx.fillRect(d.x - 4, WALL_TOP - 6, d.w + 8, 6)
    ctx.fillStyle = C.wallLight
    ctx.fillRect(d.x - 4, WALL_TOP - 6, d.w + 8, 2)
    // a little light spilling onto the floor
    ctx.fillStyle = 'rgba(163, 73, 164, 0.10)'
    ctx.fillRect(d.x, WALL_TOP, d.w, 26)
  }

  // pillars
  const pillar = (x: number, y: number) => {
    ctx.fillStyle = C.wallMid
    ctx.fillRect(x, y, 24, 52)
    ctx.fillStyle = C.wallLight
    ctx.fillRect(x, y, 24, 4)
    ctx.fillRect(x - 3, y, 3, 52)
    ctx.fillStyle = C.wallDark
    ctx.fillRect(x + 21, y, 3, 52)
    ctx.fillRect(x, y + 48, 24, 4)
  }
  pillar(72, 132)
  pillar(544, 132)

}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, twinkle: boolean) {
  const c = twinkle ? C.star : C.starDim
  ctx.fillStyle = c
  // blocky four-point star, 20x20
  ctx.fillRect(x + 8, y, 4, 20)
  ctx.fillRect(x, y + 8, 20, 4)
  ctx.fillRect(x + 6, y + 6, 8, 8)
  ctx.fillRect(x + 4, y + 4, 4, 4)
  ctx.fillRect(x + 12, y + 4, 4, 4)
  ctx.fillRect(x + 4, y + 12, 4, 4)
  ctx.fillRect(x + 12, y + 12, 4, 4)
  if (twinkle) {
    ctx.fillStyle = C.white
    ctx.fillRect(x + 8, y + 8, 4, 4)
  }
}

/* --- social icons --------------------------------------------------------
 * Hand-drawn 16x16 bitmaps rather than an icon set: lucide's rounded strokes
 * would be the only non-pixel geometry on the page. Each row is one scanline,
 * '#' is an on pixel, and horizontal runs are merged into single rects.
 * ----------------------------------------------------------------------- */

const ICON_X = [
  '##...........###',
  '###.........####',
  '.###.......###..',
  '..###.....###...',
  '...###...###....',
  '....###.###.....',
  '.....#####......',
  '......###.......',
  '.....#####......',
  '....###.###.....',
  '...###...###....',
  '..###.....###...',
  '.###.......###..',
  '###.........###.',
  '##...........##.',
  '................',
]

const ICON_GITHUB = [
  '.##..........##.',
  '.###........###.',
  '.####......####.',
  '..############..',
  '.##############.',
  '################',
  '###..######..###',
  '###..######..###',
  '################',
  '################',
  '.##############.',
  '..############..',
  '..##..####..##..',
  '..##..####..##..',
  '..##........##..',
  '................',
]

const ICON_LINKEDIN = [
  '################',
  '#..............#',
  '#..##..........#',
  '#..##..........#',
  '#..............#',
  '#..##...####...#',
  '#..##..##..##..#',
  '#..##..##..##..#',
  '#..##..##..##..#',
  '#..##..##..##..#',
  '#..##..##..##..#',
  '#..##..##..##..#',
  '#..............#',
  '################',
  '................',
  '................',
]

const SOCIALS = [
  { id: 'x', label: 'X / Twitter', handle: '@tanpoporamen', href: 'https://x.com/tanpoporamen', rows: ICON_X },
  { id: 'github', label: 'GitHub', handle: '/aykk', href: 'https://github.com/aykk', rows: ICON_GITHUB },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    handle: '/jungmink623',
    href: 'https://linkedin.com/in/jungmink623',
    rows: ICON_LINKEDIN,
  },
]

function PixelIcon({ rows, size = 32 }: { rows: string[]; size?: number }) {
  const rects: React.ReactElement[] = []
  rows.forEach((row, y) => {
    let run = 0
    for (let x = 0; x <= row.length; x += 1) {
      if (row[x] === '#') {
        run += 1
        continue
      }
      if (run > 0) {
        rects.push(<rect key={`${y}-${x}`} x={x - run} y={y} width={run} height={1} />)
        run = 0
      }
    }
  })
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="currentColor"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {rects}
    </svg>
  )
}

function drawSign(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = C.wallDark
  ctx.fillRect(x, y, 56, 34)
  ctx.fillStyle = C.wallLight
  ctx.fillRect(x, y, 56, 3)
  ctx.fillRect(x, y, 3, 34)
  ctx.fillStyle = C.wallMid
  ctx.fillRect(x + 6, y + 8, 44, 3)
  ctx.fillRect(x + 6, y + 16, 44, 3)
  ctx.fillRect(x + 6, y + 24, 30, 3)
}

/* --- sound --------------------------------------------------------------- */

function makeBlip() {
  let ctxRef: AudioContext | null = null
  return (muted: boolean) => {
    if (muted) return
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!ctxRef) ctxRef = new AC()
      const ac = ctxRef
      if (ac.state === 'suspended') void ac.resume()
      const osc = ac.createOscillator()
      const gain = ac.createGain()
      osc.type = 'square'
      osc.frequency.value = 320
      gain.gain.setValueAtTime(0.045, ac.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.05)
      osc.connect(gain).connect(ac.destination)
      osc.start()
      osc.stop(ac.currentTime + 0.05)
    } catch {
      /* audio is a nicety, never a requirement */
    }
  }
}

/* --- splash -------------------------------------------------------------- */

function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const handleAnyInput = () => onComplete()
    window.addEventListener('keydown', handleAnyInput)
    window.addEventListener('mousedown', handleAnyInput)
    return () => {
      window.removeEventListener('keydown', handleAnyInput)
      window.removeEventListener('mousedown', handleAnyInput)
    }
  }, [onComplete])

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-black ${vt323.className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/name.png"
        alt="ANDREW KIM pixelated text"
        width={576}
        height={144}
        className="mb-12"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="text-gray-500 animate-pulse text-4xl">[press any button]</div>
    </div>
  )
}

/* --- the room ------------------------------------------------------------ */

export function Overworld({
  initialSkipSplash = false,
  from = null,
}: {
  initialSkipSplash?: boolean
  from?: string | null
}) {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)

  const [showSplash, setShowSplash] = useState(!initialSkipSplash)
  const [scale, setScale] = useState(1)
  const [muted, setMuted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [fading, setFading] = useState(false)
  const [dialogue, setDialogue] = useState<{
    lines: string[]
    index: number
    shown: string
    source: string
  } | null>(null)
  const [hint, setHint] = useState<string | null>(null)
  const dialogueRef = useRef<typeof dialogue>(null)

  useEffect(() => {
    dialogueRef.current = dialogue
  }, [dialogue])

  // Flowey animates only while his own line is still typing itself out
  const talkingRef = useRef(false)
  useEffect(() => {
    talkingRef.current = Boolean(
      dialogue &&
        dialogue.source === 'flowey' &&
        dialogue.shown.length < dialogue.lines[dialogue.index].length
    )
  }, [dialogue])

  // coming back from a sub-page puts you under the doorway you walked through
  const spawnDoor = DOORS.find((d) => d.route === `/${from ?? ''}`)
  const player = useRef({
    x: spawnDoor ? spawnDoor.x + spawnDoor.w / 2 - FRISK_W / 2 : 305,
    y: spawnDoor ? WALL_TOP + 30 : 330,
    dir: (spawnDoor ? 'down' : 'up') as Dir,
    frame: 0,
    animTime: 0,
    moving: false,
  })
  const keys = useRef<Record<string, boolean>>({})
  const roomRef = useRef<HTMLCanvasElement | null>(null)
  const spritesRef = useRef<{ frisk?: HTMLImageElement; flowey?: HTMLImageElement }>({})
  const blip = useRef(makeBlip())
  const mutedRef = useRef(false)
  const busyRef = useRef(false) // dialogue / menu / fade all pause the player
  const navigatingRef = useRef(false)

  useEffect(() => {
    mutedRef.current = muted
  }, [muted])

  useEffect(() => {
    busyRef.current = Boolean(dialogue) || menuOpen || fading || showSplash
  }, [dialogue, menuOpen, fading, showSplash])

  /* scale the 640x480 stage to the viewport */
  useEffect(() => {
    const fit = () => {
      const k = Math.min(window.innerWidth / W, window.innerHeight / H)
      setScale(Math.max(0.5, Math.floor(k * 2) / 2))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  /* prebake the room and load sprites */
  useEffect(() => {
    const room = document.createElement('canvas')
    room.width = W
    room.height = H
    const rctx = room.getContext('2d')
    if (rctx) paintRoom(rctx)
    roomRef.current = room

    const load = (src: string) =>
      new Promise<HTMLImageElement>((resolve) => {
        const img = new window.Image()
        img.src = src
        img.onload = () => resolve(img)
      })

    let alive = true
    void Promise.all([
      load('/images/frisk-sheet.png'),
      load('/images/flowey.png'),
    ]).then(([frisk, flowey]) => {
      if (!alive) return
      spritesRef.current = { frisk, flowey }
    })
    return () => {
      alive = false
    }
  }, [])

  const startDialogue = useCallback((source: string, lines: string[]) => {
    setDialogue({ lines, index: 0, shown: '', source })
  }, [])

  const enterDoor = useCallback(
    (route: string) => {
      if (navigatingRef.current) return
      navigatingRef.current = true
      setFading(true)
      window.setTimeout(() => router.push(route), 260)
    },
    [router]
  )

  /* typewriter */
  useEffect(() => {
    if (!dialogue) return
    const full = dialogue.lines[dialogue.index]
    if (dialogue.shown.length >= full.length) return
    const t = window.setTimeout(() => {
      setDialogue((d) => {
        if (!d) return d
        const line = d.lines[d.index]
        const next = line.slice(0, d.shown.length + 1)
        const ch = next[next.length - 1]
        if (ch && ch !== ' ') blip.current(mutedRef.current)
        return { ...d, shown: next }
      })
    }, TYPE_MS)
    return () => window.clearTimeout(t)
  }, [dialogue])

  const advance = useCallback(() => {
    const d = dialogueRef.current
    if (!d) return
    const full = d.lines[d.index]
    if (d.shown.length < full.length) {
      setDialogue({ ...d, shown: full })
      return
    }
    if (d.index < d.lines.length - 1) {
      setDialogue({ ...d, index: d.index + 1, shown: '' })
      return
    }
    // the last line just closed out
    if (d.source === 'save') window.open(RESUME_URL, '_blank', 'noopener,noreferrer')
    setDialogue(null)
  }, [])

  const interact = useCallback(() => {
    const p = player.current
    const probe = { x: p.x + 2, y: p.y + FRISK_H - FEET_H, w: FEET_W, h: FEET_H }
    const reach = 14
    if (p.dir === 'up') probe.y -= reach
    if (p.dir === 'down') probe.y += reach
    if (p.dir === 'left') probe.x -= reach
    if (p.dir === 'right') probe.x += reach

    const target = INTERACTABLES.find((o) => rectsOverlap(probe, o))
    if (!target) return
    startDialogue(target.id, target.lines)
  }, [startDialogue])

  /* input */
  useEffect(() => {
    if (showSplash) return
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'w', 'a', 's', 'd'].includes(k)) {
        e.preventDefault()
      }
      keys.current[k] = true

      if (k === 'm') setMuted((m) => !m)
      if (k === 'z' || k === 'enter' || k === ' ') {
        if (menuOpen) return
        if (dialogue) advance()
        else interact()
      }
      if (k === 'c' || k === 'shift') {
        if (!dialogue) setMenuOpen((m) => !m)
      }
      if (k === 'x' || k === 'escape') {
        setMenuOpen(false)
      }
    }
    const up = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false
    }
    // tabbing away mid-stride would otherwise leave Frisk walking forever
    const clear = () => {
      keys.current = {}
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', clear)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', clear)
    }
  }, [showSplash, dialogue, menuOpen, advance, interact])

  /* game loop */
  useEffect(() => {
    if (showSplash) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.imageSmoothingEnabled = false

    let raf = 0
    let last = performance.now()

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const p = player.current
      const k = keys.current

      if (!busyRef.current) {
        let dx = 0
        let dy = 0
        if (k.arrowleft || k.a) dx -= 1
        if (k.arrowright || k.d) dx += 1
        if (k.arrowup || k.w) dy -= 1
        if (k.arrowdown || k.s) dy += 1

        if (dx && dy) {
          dx *= Math.SQRT1_2
          dy *= Math.SQRT1_2
        }
        p.moving = dx !== 0 || dy !== 0
        if (p.moving) {
          // Undertale keeps facing the last pressed axis; vertical wins ties
          if (dy < 0) p.dir = 'up'
          else if (dy > 0) p.dir = 'down'
          if (dx < 0 && !dy) p.dir = 'left'
          if (dx > 0 && !dy) p.dir = 'right'

          const feet = (nx: number, ny: number) => ({
            x: nx + (FRISK_W - FEET_W) / 2,
            y: ny + FRISK_H - FEET_H,
            w: FEET_W,
            h: FEET_H,
          })
          const tryX = p.x + dx * SPEED * dt
          if (!SOLIDS.some((s) => rectsOverlap(feet(tryX, p.y), s))) p.x = tryX
          const tryY = p.y + dy * SPEED * dt
          if (!SOLIDS.some((s) => rectsOverlap(feet(p.x, tryY), s))) p.y = tryY

          p.animTime += dt
          if (p.animTime > 0.12) {
            p.animTime = 0
            p.frame = (p.frame + 1) % 4
          }

          // doorways: walking into the opening takes you there
          if (p.y < WALL_TOP - 12) {
            const cx = p.x + FRISK_W / 2
            const door = DOORS.find((d) => cx > d.x && cx < d.x + d.w)
            if (door) enterDoor(door.route)
          }
        } else {
          p.frame = 0
          p.animTime = 0
        }
      } else {
        p.moving = false
      }

      // --- draw
      const room = roomRef.current
      if (room) ctx.drawImage(room, 0, 0)

      const { frisk, flowey } = spritesRef.current
      const t = now / 1000

      // everything in the room is drawn back-to-front by its feet, so Frisk
      // passes behind whatever he is standing above
      const drawables: { bottom: number; paint: () => void }[] = []

      for (const o of INTERACTABLES) {
        if (o.id === 'flowey') {
          if (!flowey) continue
          drawables.push({
            bottom: o.y + o.h,
            paint: () => {
              if (talkingRef.current) {
                // squash and stretch on the syllable, the way the game's
                // sprites bounce while their text types
                const beat = Math.sin(t * 16) > 0
                const squash = beat ? 3 : 0
                ctx.drawImage(
                  flowey,
                  o.x - squash,
                  o.y + squash * 2,
                  o.w + squash * 2,
                  o.h - squash * 2
                )
              } else {
                ctx.drawImage(flowey, o.x, o.y + Math.round(Math.sin(t * 2)), o.w, o.h)
              }
            },
          })
        } else if (o.kind === 'save') {
          drawables.push({
            bottom: o.y + o.h,
            paint: () => drawStar(ctx, o.x, o.y, Math.sin(t * 4) > -0.3),
          })
        } else if (o.kind === 'sign') {
          drawables.push({ bottom: o.y + o.h, paint: () => drawSign(ctx, o.x, o.y) })
        }
      }

      if (frisk) {
        const rows: Dir[] = ['down', 'left', 'right', 'up']
        const row = rows.indexOf(p.dir)
        const cycle = [0, 1, 0, 2]
        const col = p.moving ? cycle[p.frame] : 0
        drawables.push({
          bottom: p.y + FRISK_H,
          paint: () =>
            ctx.drawImage(
              frisk,
              col * FRISK_W,
              row * FRISK_H,
              FRISK_W,
              FRISK_H,
              Math.round(p.x),
              Math.round(p.y),
              FRISK_W,
              FRISK_H
            ),
        })
      }

      drawables.sort((a, b) => a.bottom - b.bottom)
      for (const d of drawables) d.paint()

      raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [showSplash, enterDoor])

  /* proximity hint, so a first-time visitor knows Z does something */
  useEffect(() => {
    if (showSplash) return
    const id = window.setInterval(() => {
      if (busyRef.current) {
        setHint(null)
        return
      }
      const p = player.current
      const near = INTERACTABLES.find((o) =>
        rectsOverlap({ x: p.x - 12, y: p.y - 12, w: FRISK_W + 24, h: FRISK_H + 24 }, o)
      )
      setHint(near ? 'Z' : null)
    }, 120)
    return () => window.clearInterval(id)
  }, [showSplash])

  const touchPress = (key: string, isDown: boolean) => {
    keys.current[key] = isDown
  }

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />
  }

  return (
    <div
      className={`relative min-h-screen w-full bg-black overflow-hidden ${vt323.className}`}
    >
      <style jsx global>{`
        .ut-stage {
          image-rendering: pixelated;
        }
        .ut-box {
          background: #000000;
          border: 5px solid #ffffff;
          color: #ffffff;
        }
        .ut-placard {
          color: #ffffff;
          letter-spacing: 1px;
        }
        .ut-touch {
          background: #000000;
          border: 3px solid #ffffff;
          color: #ffffff;
        }
        .ut-social {
          color: #ffffff;
          background: #000000;
          padding: 3px;
          display: inline-flex;
          transition: all 0.3s ease;
        }
        .ut-social:hover {
          background: #ffffff;
          color: #000000;
        }
      `}</style>

      <div
        ref={stageRef}
        className="absolute left-1/2 top-1/2 ut-stage"
        style={{
          width: W,
          height: H,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        <canvas ref={canvasRef} width={W} height={H} className="absolute inset-0 ut-stage" />

        {/* door placards */}
        {DOORS.map((d) => (
          <div
            key={d.id}
            className="absolute ut-placard text-center"
            style={{
              left: d.x - 40,
              top: WALL_TOP + 2,
              width: d.w + 80,
              fontSize: 20,
              whiteSpace: 'nowrap',
            }}
          >
            {d.label}
          </div>
        ))}

        {/* interaction hint */}
        {hint && !dialogue && !menuOpen && (
          <div
            className="absolute text-center"
            style={{
              left: 0,
              right: 0,
              bottom: 6,
              fontSize: 18,
              color: '#ffffff',
              opacity: 0.75,
            }}
          >
            [ Z ] check
          </div>
        )}

        {/* stat menu */}
        {menuOpen && (
          <div
            className="absolute ut-box"
            style={{ left: 40, top: 120, width: 260, padding: 14, fontSize: 22, lineHeight: 1.15 }}
          >
            <p>ANDREW KIM</p>
            <p>LV 1</p>
            <p className="mb-2">HP 20 / 20</p>
            <p>AT 10 (FULL-STACK)</p>
            <p>DF 8 (TYPESCRIPT)</p>
            <p className="mt-2">EXP: 4 YEARS</p>
            <p>NEXT: YOUR TEAM</p>
            <p className="mt-3">* CELL</p>
            {SOCIALS.map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:bg-white hover:text-black"
                style={{ paddingLeft: 12 }}
              >
                {s.label.toUpperCase()} {s.handle}
              </a>
            ))}
            <p className="mt-3" style={{ opacity: 0.7 }}>
              [ X ] close
            </p>
          </div>
        )}

        {/* dialogue box */}
        {dialogue && (
          <div
            className="absolute ut-box"
            style={{ left: 32, top: 316, width: W - 64, height: 132, padding: 16, fontSize: 24, lineHeight: 1.2 }}
            onClick={advance}
          >
            <p style={{ whiteSpace: 'pre-wrap' }}>{dialogue.shown}</p>
            <span
              className="absolute animate-pulse"
              style={{ right: 14, bottom: 8, fontSize: 18, opacity: 0.7 }}
            >
              [ Z ]
            </span>
          </div>
        )}

        {/* fade-out on doorways */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: '#000000',
            opacity: fading ? 1 : 0,
            transition: 'opacity 260ms linear',
          }}
        />
      </div>

      {/* chrome, not room: socials and the sound toggle live outside the stage */}
      <div className="absolute left-3 bottom-2 select-none">
        <div className="flex items-center gap-2 mb-1">
          {SOCIALS.map((s) => (
            <a
              key={s.id}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="ut-social"
              aria-label={`${s.label} ${s.handle}`}
              title={`${s.label} ${s.handle}`}
            >
              <PixelIcon rows={s.rows} />
            </a>
          ))}
        </div>
        <div style={{ fontSize: 18, color: '#ffffff', opacity: 0.55 }}>
          [ M ] sound {muted ? 'off' : 'on'}
        </div>
      </div>

      {/* touch controls, hidden on anything with a keyboard-sized screen */}
      <div className="absolute right-4 bottom-4 md:hidden select-none" style={{ touchAction: 'none' }}>
        <div className="flex justify-center">
          <button
            className="ut-touch w-14 h-14"
            onTouchStart={() => touchPress('arrowup', true)}
            onTouchEnd={() => touchPress('arrowup', false)}
            aria-label="Up"
          >
            ^
          </button>
        </div>
        <div className="flex">
          <button
            className="ut-touch w-14 h-14"
            onTouchStart={() => touchPress('arrowleft', true)}
            onTouchEnd={() => touchPress('arrowleft', false)}
            aria-label="Left"
          >
            &lt;
          </button>
          <button
            className="ut-touch w-14 h-14"
            onClick={() => (dialogue ? advance() : interact())}
            aria-label="Check"
          >
            Z
          </button>
          <button
            className="ut-touch w-14 h-14"
            onTouchStart={() => touchPress('arrowright', true)}
            onTouchEnd={() => touchPress('arrowright', false)}
            aria-label="Right"
          >
            &gt;
          </button>
        </div>
        <div className="flex justify-center">
          <button
            className="ut-touch w-14 h-14"
            onTouchStart={() => touchPress('arrowdown', true)}
            onTouchEnd={() => touchPress('arrowdown', false)}
            aria-label="Down"
          >
            v
          </button>
        </div>
      </div>
    </div>
  )
}
