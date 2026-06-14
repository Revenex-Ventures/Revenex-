import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CursorGlow() {
  const cursorX = useMotionValue(-500)
  const cursorY = useMotionValue(-500)
  const [isVisible, setIsVisible] = useState(false)

  const outerX = useSpring(cursorX, { damping: 55, stiffness: 90, mass: 1.2 })
  const outerY = useSpring(cursorY, { damping: 55, stiffness: 90, mass: 1.2 })

  const midX = useSpring(cursorX, { damping: 35, stiffness: 220, mass: 0.5 })
  const midY = useSpring(cursorY, { damping: 35, stiffness: 220, mass: 0.5 })

  const tightX = useSpring(cursorX, { damping: 18, stiffness: 520, mass: 0.15 })
  const tightY = useSpring(cursorY, { damping: 18, stiffness: 520, mass: 0.15 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }
    const hide = () => setIsVisible(false)
    const show = () => setIsVisible(true)
    window.addEventListener('mousemove', move)
    document.documentElement.addEventListener('mouseleave', hide)
    document.documentElement.addEventListener('mouseenter', show)
    return () => {
      window.removeEventListener('mousemove', move)
      document.documentElement.removeEventListener('mouseleave', hide)
      document.documentElement.removeEventListener('mouseenter', show)
    }
  }, [isVisible, cursorX, cursorY])

  if (!isVisible) return null

  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-0"
        style={{ x: outerX, y: outerY, translateX: '-50%', translateY: '-50%' }}
      >
        <div
          className="rounded-full"
          style={{
            width: 900,
            height: 900,
            background: 'radial-gradient(circle, rgba(0,229,195,0.05) 0%, rgba(124,77,255,0.025) 40%, transparent 70%)',
            filter: 'blur(45px)',
          }}
        />
      </motion.div>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-0"
        style={{ x: midX, y: midY, translateX: '-50%', translateY: '-50%' }}
      >
        <div
          className="rounded-full"
          style={{
            width: 220,
            height: 220,
            background: 'radial-gradient(circle, rgba(0,229,195,0.13) 0%, rgba(0,229,195,0.04) 55%, transparent 75%)',
            filter: 'blur(14px)',
          }}
        />
      </motion.div>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[1]"
        style={{ x: tightX, y: tightY, translateX: '-50%', translateY: '-50%' }}
      >
        <div
          className="rounded-full"
          style={{
            width: 22,
            height: 22,
            background: 'radial-gradient(circle, rgba(0,229,195,0.70) 0%, rgba(0,229,195,0.2) 60%, transparent 100%)',
            filter: 'blur(3px)',
          }}
        />
      </motion.div>
    </>
  )
}
