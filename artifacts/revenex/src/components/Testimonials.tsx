import React from 'react'
import { motion } from 'framer-motion'

const testimonials = [
  {
    quote: 'REVENEX transformed our school operations — attendance, fees, and communication are effortless now.',
    name: 'Asha Sharma',
    title: 'Principal, Bright Future School',
  },
  {
    quote: 'The platform is reliable and the support team helped us migrate without any downtime.',
    name: 'Saket Rao',
    title: 'Administrator, Greenfield Academy',
  },
  {
    quote: 'Excellent reporting and analytics — data-driven decisions are now simple for our leadership.',
    name: 'Nidhi Patel',
    title: 'Vice Principal, Skyline International',
  },
]

export default function Testimonials() {
  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h3 className="text-sm font-black uppercase tracking-widest text-white/50">Trusted By Schools</h3>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white mt-3">What our customers say</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.blockquote
              key={t.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="glass-card p-6 rounded-2xl border border-white/6"
            >
              <p className="text-white/80 leading-relaxed mb-4">“{t.quote}”</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/6 flex items-center justify-center text-white/90 font-bold">{t.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                <div>
                  <div className="text-sm font-bold text-white">{t.name}</div>
                  <div className="text-xs text-white/50">{t.title}</div>
                </div>
              </div>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
