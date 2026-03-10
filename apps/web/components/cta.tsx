'use client'

import { motion } from 'framer-motion'

export function CTA() {
  return (
    <section id="zacit" className="relative overflow-hidden bg-primary py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground md:text-5xl">
            Připraveni začít?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-primary-foreground/70">
            Jeden příkaz. Dva minuty. 60 nástrojů pro AI asistenta vašich
            lékařů.
          </p>

          <div className="mx-auto mt-10 max-w-md overflow-hidden rounded-xl border border-white/20 bg-black/20 px-6 py-4 font-mono text-sm backdrop-blur">
            <span className="text-white/50">$</span>{' '}
            <span className="text-white">pip install biomcp-python</span>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://github.com/petrsovadina/biomcp"
              target="_blank"
              rel="noopener"
              className="w-full rounded-xl bg-white px-8 py-4 text-center font-semibold text-primary shadow-lg transition hover:bg-white/90 sm:w-auto"
            >
              Zobrazit na GitHub
            </a>
            <a
              href="/docs"
              className="w-full rounded-xl border border-white/20 px-8 py-4 text-center font-semibold text-white transition hover:bg-white/10 sm:w-auto"
            >
              Dokumentace
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
