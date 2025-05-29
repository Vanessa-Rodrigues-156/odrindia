"use client"

import { useState } from "react"
import { ArrowRight, Building, Check, HelpCircle, Mail, MapPin, Phone } from "lucide-react"
import { motion } from "framer-motion" // Added framer-motion import

import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
            backgroundImage: "url('/contact-hero.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay",
            backgroundColor: "rgba(10, 30, 66, 0.85)",
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
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-2xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-4"
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
                Have questions about ODR India? Reach out to our team and we&apos;ll get back to you shortly.
              </motion.p>
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
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  variants={fadeInUp}
                >
                  <Card>
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="bg-blue-50 p-2 rounded-full">
                        <Mail className="h-6 w-6 text-[#0a1e42]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">Email</h3>
                        <p className="text-gray-600">info@odrindia.org</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="bg-blue-50 p-2 rounded-full">
                        <Phone className="h-6 w-6 text-[#0a1e42]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">Phone</h3>
                        <p className="text-gray-600">+91 98765 43210</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Card>
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="bg-blue-50 p-2 rounded-full">
                        <MapPin className="h-6 w-6 text-[#0a1e42]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">Address</h3>
                        <p className="text-gray-600">
                          ODR India Foundation<br />
                          123, Tech Park<br />
                          Bandra Kurla Complex<br />
                          Mumbai, Maharashtra 400051<br />
                          India
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Card>
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="bg-blue-50 p-2 rounded-full">
                        <Building className="h-6 w-6 text-[#0a1e42]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">Working Hours</h3>
                        <p className="text-gray-600">
                          Monday - Friday: 9:00 AM - 6:00 PM<br />
                          Saturday: 10:00 AM - 2:00 PM<br />
                          Sunday: Closed
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Contact Form */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <motion.h2 
                  className="text-3xl font-bold text-[#0a1e42] mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Send Us a Message
                </motion.h2>

                <Card>
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

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div 
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="text-center mb-12"
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
                <p className="text-gray-600">
                  Find quick answers to common questions about ODR India.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-left font-medium">
                      What is Online Dispute Resolution (ODR)?
                    </AccordionTrigger>
                    <AccordionContent>
                      Online Dispute Resolution (ODR) is the use of technology to facilitate the resolution of disputes between parties. It integrates traditional Alternative Dispute Resolution (ADR) methods with modern digital tools, making the process more accessible, efficient, and affordable.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-left font-medium">
                      How can I get involved with ODRLab?
                    </AccordionTrigger>
                    <AccordionContent>
                      You can get involved with ODRLab by joining our community, participating in workshops and conferences, contributing to research, or partnering with us on projects. Please contact us through this form or send an email to info@ODRLab.org to explore collaboration opportunities.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-left font-medium">
                      What services does ODRLab provide?
                    </AccordionTrigger>
                    <AccordionContent>
                      ODRLab provides a range of services including ODR platform development, training for mediators and arbitrators in online tools, research on ODR best practices, policy advocacy, and educational resources on effective dispute resolution techniques in the digital environment.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-left font-medium">
                      Is ODR legally binding inLab?
                    </AccordionTrigger>
                    <AccordionContent>
                      The legal status of ODR outcomes depends on the method used. Arbitration awards from ODR processes are generally enforceable under the Arbitration and Conciliation Act. Mediation settlements can be made binding through proper documentation. The Indian judiciary has been increasingly supportive of ODR initiatives to reduce court backlogs.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionTrigger className="text-left font-medium">
                      How secure is the ODR process?
                    </AccordionTrigger>
                    <AccordionContent>
                      Security is a top priority in ODR. Our recommended platforms use encryption, secure authentication, and data protection measures compliant with privacy regulations. We advocate for platforms that maintain confidentiality throughout the dispute resolution process and implement secure document handling procedures.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  )
}
