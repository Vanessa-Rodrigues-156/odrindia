"use client"

import { useState } from "react"
import { ArrowRight, Building, Check, HelpCircle, Mail, MapPin, Phone } from "lucide-react"

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
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

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
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section
          className="relative bg-[#0a1e42] py-20 text-white"
          style={{
            backgroundImage: "url('/contact-hero.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay",
            backgroundColor: "rgba(10, 30, 66, 0.85)",
          }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
                Contact <span className="text-sky-400">Us</span>
              </h1>
              <p className="mx-auto mt-4 max-w-[800px] text-lg text-gray-200 md:text-xl">
                We're here to help with any questions about our online dispute resolution services.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-2 border-transparent transition-all hover:border-[#0a1e42]/10 hover:shadow-lg">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 rounded-full bg-[#0a1e42]/10 p-4">
                    <Phone className="h-6 w-6 text-[#0a1e42]" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-[#0a1e42]">Call Us</h3>
                  <p className="mb-4 text-gray-600">Our team is here to help</p>
                  <p className="font-medium text-[#0a1e42]">+91 123 456 7890</p>
                  <p className="text-gray-500">Mon-Fri: 9am to 6pm</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-transparent transition-all hover:border-[#0a1e42]/10 hover:shadow-lg">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 rounded-full bg-[#0a1e42]/10 p-4">
                    <Mail className="h-6 w-6 text-[#0a1e42]" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-[#0a1e42]">Email Us</h3>
                  <p className="mb-4 text-gray-600">We'll respond promptly</p>
                  <p className="font-medium text-[#0a1e42]">info@odrindia.com</p>
                  <p className="text-gray-500">24/7 support</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-transparent transition-all hover:border-[#0a1e42]/10 hover:shadow-lg">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 rounded-full bg-[#0a1e42]/10 p-4">
                    <MapPin className="h-6 w-6 text-[#0a1e42]" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-[#0a1e42]">Visit Us</h3>
                  <p className="mb-4 text-gray-600">Our main office location</p>
                  <p className="font-medium text-[#0a1e42]">123 Tech Park</p>
                  <p className="text-gray-500">Bangalore, Karnataka, India</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Form and Map */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-2 text-3xl font-bold tracking-tight text-[#0a1e42] md:text-4xl">Get in Touch</h2>
              <p className="mx-auto max-w-[700px] text-gray-600">
                Fill out the form below and we'll get back to you as soon as possible
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-5 lg:gap-12">
              <Card className="md:col-span-3 border-none shadow-md">
                <CardContent className="p-6">
                  {formStatus === "submitted" ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="mb-4 rounded-full bg-green-100 p-3">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="mb-2 text-xl font-semibold text-[#0a1e42]">Message Sent!</h3>
                      <p className="mb-6 text-gray-600">
                        Thank you for reaching out. We'll be in touch with you shortly.
                      </p>
                      <Button 
                        onClick={() => setFormStatus("idle")}
                        variant="outline" 
                        className="border-[#0a1e42] text-[#0a1e42] hover:bg-[#0a1e42] hover:text-white"
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" placeholder="John Doe" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="john@example.com" required />
                        </div>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" placeholder="+91 123 456 7890" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Select>
                            <SelectTrigger id="subject">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General Inquiry</SelectItem>
                              <SelectItem value="support">Technical Support</SelectItem>
                              <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                              <SelectItem value="feedback">Feedback</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" placeholder="How can we help you?" rows={5} required />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-[#0a1e42] hover:bg-[#263e69]"
                        disabled={formStatus === "submitting"}
                      >
                        {formStatus === "submitting" ? "Sending..." : "Send Message"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
              
              <div className="md:col-span-2">
                <Card className="h-full border-none shadow-md">
                  <CardContent className="p-0">
                    <div className="aspect-square h-full w-full rounded-md overflow-hidden">
                      <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.84916296526!2d77.6309395!3d12.9539974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1658134263999!5m2!1sen!2sin" 
                        style={{ border: 0, height: "100%", width: "100%" }} 
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="ODR India Location"
                      ></iframe>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Offices */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-2 text-3xl font-bold tracking-tight text-[#0a1e42] md:text-4xl">Our Offices</h2>
              <p className="mx-auto max-w-[700px] text-gray-600">
                Visit us at our locations across India
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { city: "Mumbai", address: "Bandra Kurla Complex", phone: "+91 22 1234 5678" },
                { city: "New Delhi", address: "Connaught Place", phone: "+91 11 1234 5678" },
                { city: "Bangalore", address: "Tech Park, Whitefield", phone: "+91 80 1234 5678" },
              ].map((office, i) => (
                <Card key={i} className="border-2 border-transparent transition-all hover:border-[#0a1e42]/10 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-start">
                      <Building className="mr-2 h-5 w-5 text-[#0a1e42]" />
                      <div>
                        <h3 className="font-semibold text-[#0a1e42]">{office.city}</h3>
                        <p className="text-gray-600">{office.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-5 w-5 text-[#0a1e42]" />
                      <p className="text-gray-600">{office.phone}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-2 text-3xl font-bold tracking-tight text-[#0a1e42] md:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-600">
                Find quick answers to common questions about our services
              </p>
            </div>

            <div className="mx-auto max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    question: "What is Online Dispute Resolution (ODR)?",
                    answer: "Online Dispute Resolution (ODR) is the use of technology to help parties resolve disputes without the need for physical presence. It includes negotiation, mediation, and arbitration processes conducted through secure online platforms."
                  },
                  {
                    question: "How secure is your ODR platform?",
                    answer: "Our ODR platform employs bank-level encryption and security protocols to ensure all communications and documents remain confidential and secure. We comply with global data protection standards and regularly update our security measures."
                  },
                  {
                    question: "What types of disputes can be resolved through your platform?",
                    answer: "Our platform can handle a wide range of disputes including consumer complaints, business-to-business conflicts, employment issues, family disputes, and more. We have specialized processes for different categories of disputes."
                  },
                  {
                    question: "How much does it cost to use your ODR services?",
                    answer: "Our pricing varies based on the type of service and complexity of the dispute. We offer transparent fee structures with options for both pay-per-use and subscription models for businesses. Contact us for a customized quote."
                  },
                  {
                    question: "How long does the ODR process typically take?",
                    answer: "The duration varies depending on the complexity of the dispute and the cooperation of parties involved. Simple matters can be resolved in days, while more complex disputes might take a few weeks. Our system is designed to be significantly faster than traditional court proceedings."
                  }
                ].map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger className="text-left text-[#0a1e42] hover:text-[#0a1e42]/80">
                      <div className="flex items-center">
                        <HelpCircle className="mr-2 h-5 w-5" />
                        {faq.question}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <div className="mt-8 text-center">
                <p className="mb-4 text-gray-600">
                  Still have questions? Contact our support team directly.
                </p>
                <Button className="bg-[#0a1e42] hover:bg-[#263e69]">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Support
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
