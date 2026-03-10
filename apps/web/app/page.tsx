import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { ProblemSolution } from '@/components/problem-solution'
import { Features } from '@/components/features'
import { ToolCatalog } from '@/components/tool-catalog'
import { HowItWorks } from '@/components/how-it-works'
import { CodeExample } from '@/components/code-example'
import { Testimonial } from '@/components/testimonial'
import { CTA } from '@/components/cta'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <ProblemSolution />
      <Features />
      <ToolCatalog />
      <HowItWorks />
      <CodeExample />
      <Testimonial />
      <CTA />
      <Footer />
    </>
  )
}
