"use client"
import "../globals.css"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import HowToCard from "@/components/howtocard"
import { LetsCollaborate } from "@/components/letscolaborate"
import { HeroSection } from "@/components/hero-section"
import { InnovationSection } from "@/components/innovation-section"
import { FAQ } from "@/components/Faq"

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* How It Works Section */}
        <HowToCard />

        {/* Lets Collaborate Section */}
        <LetsCollaborate />

        {/* Innovation Section */}
        <InnovationSection />

        {/* FAQ Section */}
        <FAQ />
      </main>
    </div>
  )
}
