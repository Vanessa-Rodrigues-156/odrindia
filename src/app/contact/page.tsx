"use client"

import { useState } from "react"
import { ArrowRight, Building, Check, HelpCircle, Mail, MapPin, Phone } from "lucide-react"
import { motion } from "framer-motion" // Added framer-motion import

import { Button } from "@/components/ui/button"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "submitted">("idle")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus("submitting")
    
    // Simulate form submission
    setTimeout(() => {
      setFormStatus("submitted")
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col">

      <main className="flex-1">
        {/* Hero Section */}
        <motion.section
          className="relative bg-[#0a1e42] py-20 text-white overflow-hidden"
          style={{
            backgroundImage: "linear-gradient(rgba(10, 30, 66, 0.85), rgba(10, 30, 66, 0.9)), url('/contact-hero.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Animated background elements */}
          <motion.div 
            className="absolute top-20 left-10 w-60 h-60 rounded-full bg-blue-300/10"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-sky-200/10"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div 
            className="absolute top-40 right-20 w-40 h-40 rounded-full bg-indigo-200/10"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.15, 0.25, 0.15]
            }}
            transition={{ duration: 7, repeat: Infinity, delay: 1 }}
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-2xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="inline-block mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
              >
                <div className="p-3 bg-blue-500/20 rounded-full">
                  <Mail className="h-8 w-8 text-blue-200" />
                </div>
              </motion.div>
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Get in Touch
              </motion.h1>
              <motion.p 
                className="text-lg opacity-90 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Have questions about ODR? Reach out to our team and we&apos;ll get back to you shortly.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 h-auto rounded-md text-lg transition-all shadow-md hover:shadow-lg"
                  onClick={() => {
                    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Contact Us Now
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Contact Info & Form Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <motion.div 
                className="space-y-8"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.h2 
                  className="text-3xl font-bold text-[#0a1e42] mb-6"
                  variants={fadeInUp}
                >
                  Contact Information
                </motion.h2>

                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-5"
                  variants={fadeInUp}
                >
                  <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-xl p-5 group hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 backdrop-blur-sm">
                    <div className="flex items-start gap-4 relative">
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50/50 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-xl"></div>
                      <div className="bg-blue-100/80 p-3 rounded-full group-hover:bg-blue-200/80 transition-colors duration-300 shadow-sm">
                        <Mail className="h-6 w-6 text-blue-700" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-blue-800 transition-colors">Facilitator</h3>
                        <p className="text-gray-700 font-medium">chittu@odrlab.com</p>
                        <p className="text-sm text-gray-500 mt-2 italic">Connect for Mentor / Student/ Institution Collaborations</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-xl p-5 group hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 backdrop-blur-sm">
                    <div className="flex items-start gap-4 relative">
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50/50 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-xl"></div>
                      <div className="bg-blue-100/80 p-3 rounded-full group-hover:bg-blue-200/80 transition-colors duration-300 shadow-sm">
                        <Mail className="h-6 w-6 text-blue-700" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-blue-800 transition-colors">Facilitator</h3>
                        <p className="text-gray-700 font-medium">suman@odrlab.com</p>
                        <p className="text-sm text-gray-500 mt-2 italic">Connect for Mentor / Student/ Institution Collaborations</p>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 bg-gradient-to-br from-white to-blue-50/30 rounded-xl p-5 group hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 backdrop-blur-sm">
                    <div className="flex items-start gap-4 relative">
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50/50 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-xl"></div>
                      <div className="bg-blue-100/80 p-3 rounded-full group-hover:bg-blue-200/80 transition-colors duration-300 shadow-sm">
                        <Mail className="h-6 w-6 text-blue-700" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-blue-800 transition-colors">Student Ambassadors</h3>
                        <p className="text-gray-700 font-medium">contact@odrlab.com</p>
                        <p className="text-sm text-gray-500 mt-2 italic">For student inquiries and general questions</p>
                      </div>
                    </div>
                  </div>                
                </motion.div>

              </motion.div>

              {/* Contact Form */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                id="contact-form"
              >
                <motion.h2 
                  className="text-3xl font-bold text-[#0a1e42] mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Send Us a Message
                </motion.h2>

                <Card className="border border-blue-100 shadow-md overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                  <CardContent className="p-6 pt-6">
                    {formStatus === "submitted" ? (
                      <motion.div 
                        className="text-center py-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                      >
                        <motion.div 
                          className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        >
                          <Check className="h-8 w-8 text-green-600" />
                        </motion.div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                        <p className="text-gray-600 mb-6">
                          Thank you for contacting us. We&apos;ll get back to you as soon as possible.
                        </p>
                        <Button 
                          onClick={() => setFormStatus("idle")} 
                          variant="outline"
                        >
                          Send Another Message
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.form 
                        onSubmit={handleSubmit} 
                        className="space-y-4"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                      >
                        <motion.div variants={fadeInUp}>
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" placeholder="Your name" className="mt-1" />
                        </motion.div>
                        <motion.div variants={fadeInUp}>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="Your email address" className="mt-1" />
                        </motion.div>
                        <motion.div variants={fadeInUp}>
                          <Label htmlFor="subject">Subject</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General Inquiry</SelectItem>
                              <SelectItem value="support">Technical Support</SelectItem>
                              <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </motion.div>
                        <motion.div variants={fadeInUp}>
                          <Label htmlFor="message">Message</Label>
                          <Textarea 
                            id="message" 
                            placeholder="Your message" 
                            className="mt-1 min-h-[150px]" 
                          />
                        </motion.div>
                        <motion.div variants={fadeInUp}>
                          <Button 
                            type="submit"
                            className="w-full bg-[#0a1e42] hover:bg-[#162d5a]"
                            disabled={formStatus === "submitting"}
                          >
                            {formStatus === "submitting" ? (
                              <motion.span
                                className="inline-flex items-center"
                                initial={{ opacity: 0.8 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3, repeat: Infinity, repeatType: "reverse" }}
                              >
                                Sending...
                              </motion.span>
                            ) : (
                              <>
                                Send Message <ArrowRight className="ml-2 h-4 w-4" />
                              </>
                            )}
                          </Button>
                        </motion.div>
                      </motion.form>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Coming Soon Section */}
        <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <motion.div 
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="text-center mb-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="inline-block p-3 bg-blue-50 rounded-full mb-4"
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <HelpCircle className="h-6 w-6 text-[#0a1e42]" />
                </motion.div>
                <h2 className="text-3xl font-bold text-[#0a1e42] mb-3">
                  Frequently Asked Questions
                </h2>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="max-w-lg mx-auto"
              >
                <div className="bg-white rounded-xl border border-blue-100 shadow-lg overflow-hidden">
                  <div className="p-8 relative">
                    {/* Decorative elements */}
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-100 rounded-full opacity-40"></div>
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-indigo-100 rounded-full opacity-30"></div>
                    
                    <div className="relative z-10 text-center">
                      <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                        <HelpCircle className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-blue-800 mb-4">FAQs Coming Soon</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        We&apos;re currently compiling a comprehensive list of frequently asked questions about ODR India and our services.
                      </p>
                      <div className="pt-2">
                        <Button 
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-base transition-all shadow-sm hover:shadow"
                          onClick={() => window.location.href = '#contact-form'}
                        >
                          Ask a Question
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  )
}
