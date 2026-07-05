import { Link } from 'wouter'
import { motion } from 'framer-motion'
import { Home, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 hero-glow pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#7C4DFF]/5 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-lg"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-8xl font-black gradient-text mb-4"
        >
          404
        </motion.div>
        <h1 className="text-3xl font-black text-white mb-3">Page Not Found</h1>
        <p className="text-white/40 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <motion.span
              whileHover={{ scale: 1.04 }}
              className="inline-flex items-center gap-2 gradient-bg text-black font-bold px-6 py-3 rounded-2xl cursor-pointer"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </motion.span>
          </Link>
          <Link href="/contact">
            <motion.span
              whileHover={{ scale: 1.03 }}
              className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-6 py-3 rounded-2xl hover:bg-white/5 cursor-pointer"
            >
              Contact Us
              <ArrowRight className="h-4 w-4" />
            </motion.span>
          </Link>
        </div>
      </motion.div>
    </main>
  )
}
