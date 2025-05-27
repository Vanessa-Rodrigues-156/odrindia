"use client"
import "./globals.css"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion" // Added framer-motion import
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import HowToCard from "@/components/howtocard"
import { LetsCollaborate } from "@/components/letscolaborate"

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

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5 }
  }
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative bg-[#0a1e42] py-20 text-white overflow-hidden"
          style={{
            backgroundImage: "url('/hero.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Background animation elements */}
          <motion.div 
            className="absolute top-20 right-10 w-60 h-60 rounded-full bg-blue-500/10"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-sky-400/10"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid gap-8 md:grid-cols-2 md:gap-12">
              <motion.div 
                className="flex flex-col justify-center space-y-6"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.h1 
                  className="text-4xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl"
                  variants={fadeInUp}
                >
                  <motion.span 
                    className="text-sky-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    Connect, Collaborate,
                  </motion.span> and{" "} 
                  <motion.span 
                    className="text-sky-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    Create{" "}
                  </motion.span> 
                  Innovative{" "}
                  <motion.span 
                    className="text-sky-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1, duration: 0.6 }}
                  >
                    ODR{" "}
                  </motion.span>
                  Systems
                </motion.h1>
                <motion.p 
                  className="max-w-[600px] text-lg text-gray-200 md:text-xl"
                  variants={fadeInUp}
                >
                  Platform for co-creating Online Dispute Resolution systems. 
                </motion.p>
                <motion.div 
                  className="flex flex-col gap-4 sm:flex-row"
                  variants={fadeInUp}
                >
                  <Button size="lg" className="bg-sky-500 hover:bg-sky-600" onClick={() => window.location.href = '/signup'}>
                    Register as a Mentor
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline" className="border-gray-200 bg-[#0a1e42] text-white hover:bg-white/10" onClick={() => window.location.href = '/about'}>
                    Register as an Ideator
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* How It Works Section */}
        <HowToCard />

        {/* Lets Collaborate for*/}
        <LetsCollaborate />

        {/* Innovation Section */}
        <motion.section 
          className="bg-gray-50 py-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="container mx-auto px-4">
            <motion.div 
              className="mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="mb-2 text-3xl font-bold tracking-tight text-[#0a1e42] md:text-4xl"
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Contribute to the future of Online Dispute Resolution
              </motion.h2>
              <motion.p 
                className="mx-auto max-w-[700px] text-2xl text-gray-600"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Open to Ideas
              </motion.p>
            </motion.div>

            <motion.div 
              className="mx-auto max-w-3xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Card>
                  <CardContent className="space-y-4 pt-6">
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      We&apos;re constantly looking for innovative approaches to improve ODR. Share your ideas, research, or
                      technology to help us advance the field and make justice more accessible to all.
                    </motion.p>
                    <motion.ul 
                      className="ml-6 list-disc space-y-2"
                      initial="hidden"
                      whileInView="visible"
                      variants={staggerContainer}
                      viewport={{ once: true }}
                    >
                      {[
                        "Propose new ODR methodologies",
                        "Suggest technological improvements",
                        "Share research findings",
                        "Collaborate on pilot projects"
                      ].map((item, index) => (
                        <motion.li 
                          key={index}
                          variants={fadeInUp}
                        >
                          {item}
                        </motion.li>
                      ))}
                    </motion.ul>
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <Button 
                        className="mt-4 bg-[#0a1e42] hover:bg-[#263e69]" 
                        onClick={() => window.location.href = '/submit-idea'}
                      >
                        Submit Your Idea
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      </main>
    </div>
  )
}
