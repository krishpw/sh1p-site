import React, { useRef, useEffect, useState } from "react"

interface ParticleGridProps {
  embedded?: boolean
}

export function ParticleGrid({ embedded = false }: ParticleGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const scrollOffsetRef = useRef(0)
  const isTouchingRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const updateCanvasSize = () => {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      setIsMobile(window.innerWidth < 768)
    }

    updateCanvasSize()

    let particles: {
      x: number
      y: number
      baseX: number
      baseY: number
      size: number
      color: string
      scatteredColor: string
      life: number
    }[] = []

    let textImageData: ImageData | null = null

    function createShipImage() {
      if (!ctx || !canvas) return 0

      ctx.fillStyle = "white"
      ctx.save()

      const shipWidth = isMobile ? 250 : embedded ? 420 : 500
      const shipHeight = isMobile ? 145 : embedded ? 245 : 290
      const scale = shipWidth / 500

      // Adjusted Y offset from +20 to -80 to move the ship up
      ctx.translate(canvas.width / 2 - shipWidth / 2, canvas.height / 2 - shipHeight / 2 - 80)
      ctx.scale(scale, scale)

      ctx.beginPath()

      // Hull outline
      ctx.moveTo(10, 320)
      ctx.lineTo(490, 320)
      ctx.quadraticCurveTo(510, 315, 500, 300)
      ctx.lineTo(480, 290)
      ctx.lineTo(460, 280)
      ctx.lineTo(450, 260)
      ctx.lineTo(440, 260)
      ctx.lineTo(440, 240)
      ctx.lineTo(420, 240)
      ctx.lineTo(420, 220)

      // Mast 1 (right)
      ctx.lineTo(400, 220)
      ctx.lineTo(400, 180)
      ctx.lineTo(395, 180)
      ctx.lineTo(395, 120)
      ctx.lineTo(390, 120)
      ctx.lineTo(390, 60)
      ctx.lineTo(385, 60)
      ctx.lineTo(385, 30)
      ctx.lineTo(380, 30)
      ctx.lineTo(380, 60)
      ctx.lineTo(375, 60)
      ctx.lineTo(375, 120)
      ctx.lineTo(370, 120)
      ctx.lineTo(370, 180)
      ctx.lineTo(365, 180)
      ctx.lineTo(365, 220)

      // Middle section
      ctx.lineTo(340, 220)
      ctx.lineTo(340, 200)
      ctx.lineTo(320, 200)
      ctx.lineTo(320, 180)
      ctx.lineTo(300, 180)
      ctx.lineTo(300, 140)
      ctx.lineTo(280, 140)
      ctx.lineTo(280, 110)
      ctx.lineTo(260, 110)
      ctx.lineTo(260, 90)

      // Mast 2 (center)
      ctx.lineTo(250, 90)
      ctx.lineTo(250, 70)
      ctx.lineTo(240, 70)
      ctx.lineTo(240, 55)
      ctx.lineTo(235, 55)
      ctx.lineTo(235, 70)
      ctx.lineTo(225, 70)
      ctx.lineTo(225, 90)
      ctx.lineTo(215, 90)
      ctx.lineTo(215, 110)
      ctx.lineTo(195, 110)
      ctx.lineTo(195, 140)
      ctx.lineTo(175, 140)
      ctx.lineTo(175, 180)

      ctx.lineTo(155, 180)
      ctx.lineTo(155, 200)
      ctx.lineTo(140, 200)
      ctx.lineTo(140, 220)

      // Mast 3 (left)
      ctx.lineTo(125, 220)
      ctx.lineTo(125, 180)
      ctx.lineTo(120, 180)
      ctx.lineTo(120, 100)
      ctx.lineTo(115, 100)
      ctx.lineTo(115, 50)
      ctx.lineTo(110, 50)
      ctx.lineTo(110, 20)
      ctx.lineTo(105, 20)
      ctx.lineTo(105, 50)
      ctx.lineTo(100, 50)
      ctx.lineTo(100, 100)
      ctx.lineTo(95, 100)
      ctx.lineTo(95, 180)
      ctx.lineTo(90, 180)
      ctx.lineTo(90, 220)

      ctx.lineTo(75, 220)
      ctx.lineTo(75, 240)
      ctx.lineTo(60, 240)
      ctx.lineTo(60, 260)
      ctx.lineTo(50, 260)
      ctx.lineTo(45, 280)
      ctx.lineTo(30, 290)

      ctx.lineTo(15, 300)
      ctx.quadraticCurveTo(0, 310, 10, 320)

      ctx.closePath()
      ctx.fill()

      // Crow's nest
      ctx.beginPath()
      ctx.arc(237, 80, 18, 0, Math.PI * 2)
      ctx.fill()

      // Flags
      ctx.fillRect(106, 5, 3, 20)
      ctx.fillRect(100, 12, 15, 3)
      ctx.fillRect(381, 15, 3, 20)
      ctx.fillRect(375, 22, 15, 3)

      // Deck details
      ctx.fillRect(200, 120, 75, 12)
      ctx.fillRect(210, 145, 55, 10)
      ctx.fillRect(285, 150, 25, 8)
      ctx.fillRect(165, 150, 25, 8)
      ctx.fillRect(80, 270, 340, 8)

      ctx.restore()

      textImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      return scale
    }

    function createParticle(scale: number) {
      if (!ctx || !canvas || !textImageData) return null

      const data = textImageData.data

      for (let attempt = 0; attempt < 100; attempt++) {
        const x = Math.floor(Math.random() * canvas.width)
        const y = Math.floor(Math.random() * canvas.height)

        if (data[(y * canvas.width + x) * 4 + 3] > 128) {
          const centerY = canvas.height / 2
          const relativeY = (y - centerY) / (canvas.height * 0.3)

          // Amber/gold color palette for cartographic theme
          let scatteredColor: string
          if (relativeY > 0.4) {
            scatteredColor = "#8B4513" // Saddle brown for hull bottom
          } else if (relativeY > 0.2) {
            scatteredColor = "#CD853F" // Peru for hull upper
          } else if (relativeY > -0.1) {
            scatteredColor = "#DAA520" // Goldenrod for deck
          } else if (relativeY > -0.4) {
            scatteredColor = "#D4AF37" // Gold for bridge
          } else {
            scatteredColor = "#FFD700" // Bright gold for masts/flags
          }

          return {
            x: x,
            y: y,
            baseX: x,
            baseY: y,
            size: Math.random() * 1.8 + 0.8,
            // Updated to be more transparent (0.3 opacity)
            color: "rgba(212, 165, 116, 0.3)", 
            scatteredColor: scatteredColor,
            life: Math.random() * 100 + 50,
          }
        }
      }

      return null
    }

    function createInitialParticles(scale: number) {
      if (!canvas) return
      const baseParticleCount = embedded ? 8000 : 10000
      const particleCount = Math.floor(baseParticleCount * Math.sqrt((canvas.width * canvas.height) / (1920 * 1080)))
      for (let i = 0; i < particleCount; i++) {
        const particle = createParticle(scale)
        if (particle) particles.push(particle)
      }
    }

    let animationFrameId: number

    function animate(scale: number) {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const { x: mouseX, y: mouseY } = mousePositionRef.current
      const maxDistance = 180

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const dx = mouseX - p.x
        const dy = mouseY - p.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Apply parallax offset
        const parallaxY = scrollOffsetRef.current * 0.15

        if (distance < maxDistance && (isTouchingRef.current || !("ontouchstart" in window))) {
          const force = (maxDistance - distance) / maxDistance
          const angle = Math.atan2(dy, dx)
          const moveX = Math.cos(angle) * force * 50
          const moveY = Math.sin(angle) * force * 50
          p.x = p.baseX - moveX
          p.y = p.baseY - moveY + parallaxY

          ctx.fillStyle = p.scatteredColor
        } else {
          p.x += (p.baseX - p.x) * 0.1
          p.y += (p.baseY + parallaxY - p.y) * 0.1
          ctx.fillStyle = p.color
        }

        ctx.fillRect(p.x, p.y, p.size, p.size)

        p.life--
        if (p.life <= 0) {
          const newParticle = createParticle(scale)
          if (newParticle) {
            particles[i] = newParticle
          } else {
            particles.splice(i, 1)
            i--
          }
        }
      }

      const baseParticleCount = embedded ? 8000 : 10000
      const targetParticleCount = Math.floor(
        baseParticleCount * Math.sqrt((canvas.width * canvas.height) / (1920 * 1080)),
      )
      while (particles.length < targetParticleCount) {
        const newParticle = createParticle(scale)
        if (newParticle) particles.push(newParticle)
      }

      animationFrameId = requestAnimationFrame(() => animate(scale))
    }

    const scale = createShipImage()
    createInitialParticles(scale)
    animate(scale)

    const handleResize = () => {
      updateCanvasSize()
      const newScale = createShipImage()
      particles = []
      createInitialParticles(newScale)
    }

    const handleScroll = () => {
      scrollOffsetRef.current = window.scrollY
    }

    const handleMove = (x: number, y: number) => {
      const rect = canvas.getBoundingClientRect()
      mousePositionRef.current = { x: x - rect.left, y: y - rect.top }
    }

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    const handleTouchStart = () => {
      isTouchingRef.current = true
    }

    const handleTouchEnd = () => {
      isTouchingRef.current = false
      mousePositionRef.current = { x: 0, y: 0 }
    }

    const handleMouseLeave = () => {
      if (!("ontouchstart" in window)) {
        mousePositionRef.current = { x: 0, y: 0 }
      }
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("scroll", handleScroll, { passive: true })
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true })
    canvas.addEventListener("mouseleave", handleMouseLeave)
    canvas.addEventListener("touchstart", handleTouchStart)
    canvas.addEventListener("touchend", handleTouchEnd)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", handleScroll)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("touchmove", handleTouchMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      canvas.removeEventListener("touchstart", handleTouchStart)
      canvas.removeEventListener("touchend", handleTouchEnd)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isMobile, embedded])

  return (
    <div ref={containerRef} className="absolute inset-0 z-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full block touch-none mix-blend-screen"
        aria-label="Interactive particle effect showing a ship silhouette"
      />
      {!embedded && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center z-10">
          <p className="font-mono text-amber-700/50 text-xs tracking-widest uppercase">Move cursor to scatter</p>
        </div>
      )}
    </div>
  )
}
