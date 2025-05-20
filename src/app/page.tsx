"use client"
import "./globals.css"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import HowToCard from "@/components/howtocard"
import { LetsCollaborate } from "@/components/letscolaborate"


export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section
          className="relative bg-[#0a1e42] py-20 text-white"
          style={{
            backgroundImage: "url('/hero.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2 md:gap-12">
              <div className="flex flex-col justify-center space-y-6">
            <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
            <span className="text-sky-400">Connect, Collaborate,</span> and <span className="text-sky-400"> Create </span> Innovative {" "}
              <span className="text-sky-400">ODR </span>Systems
            </h1>
            <p className="max-w-[600px] text-lg text-gray-200 md:text-xl">
             Platform for co-creating Online Dispute Resolution systems. 
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="bg-sky-500 hover:bg-sky-600" onClick={() => window.location.href = '/signup'}>
                Register as a Mentor
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-gray-200 bg-[#0a1e42] text-white hover:bg-white/10" onClick={() => window.location.href = '/about'}>
                Register as an Ideator
              </Button>
            </div>
            </div>
            </div>
          </div>
        </section>
        {/* How It Works Section */}
        <HowToCard/>

        {/* Lets Collaborate for*/}
        <LetsCollaborate/>

        {/* Innovation Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-2 text-3xl font-bold tracking-tight text-[#0a1e42] md:text-4xl">
              Contribute to the future of Online Dispute Resolution
              </h2>
              < p className="mx-auto max-w-[700px] text-2xl text-gray-600">
              Open to Ideas
              </p>
            </div>

            <div className="mx-auto max-w-3xl">
              <Card>
                <CardContent className="space-y-4">
                  <p>
                    We&apos;re constantly looking for innovative approaches to improve ODR. Share your ideas, research, or
                    technology to help us advance the field and make justice more accessible to all.
                  </p>
                  <ul className="ml-6 list-disc space-y-2">
                    <li>Propose new ODR methodologies</li>
                    <li>Suggest technological improvements</li>
                    <li>Share research findings</li>
                    <li>Collaborate on pilot projects</li>
                  </ul>
                    <Button 
                    className="mt-4 bg-[#0a1e42] hover:bg-[#263e69]" 
                    onClick={() => window.location.href = '/submit-idea'}
                    >
                    Submit Your Idea
                    </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#0a1e42] py-16 text-white">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">READY TO BE  PART OF ONLINE DISPUTE RESOLUTION CREATORS GLOBAL NETWORK ?</h2>
              <p className="mb-8 text-lg text-gray-200">
                Join thousands of businesses and individuals who are already benefiting from our ODR solutions.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button size="lg" className="bg-white text-[#0a1e42] hover:bg-gray-100">
                  Get Started
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Latest News Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-2 text-3xl font-bold tracking-tight text-[#0a1e42] md:text-4xl">ODR News</h2>
            </div>

            <div  className="grid gap-6 justify-center md:grid-cols-2 lg:grid-cols-3">
              <Card className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image src="/news1.png" alt="News Image" fill className="object-cover" />
                </div>
                <CardHeader>
                  <CardTitle className="text-[#0a1e42]">25th International Forum on ODR  </CardTitle>
                  <CardDescription>29th - 30th April 2025</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                  The International Forum on Online Dispute Resolution was launched in 2001 by the National Center for Technology and Dispute Resolution at the University of Massachusetts (NCTDR) and it has since become the premiere ODR gathering for courts, providers, and academics. This year, the 25th forum will be held in London at the beautiful Old Royal Naval College, a UNESCO Heritage site.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden" onClick={() => window.location.href = ' https://icodr.org/standards/'}>
                <div className="relative h-48 w-full">
                  <Image src="/placeholder.svg?height=200&width=400" alt="News Image" fill className="object-cover" />
                </div>
                <CardHeader>
                  <CardTitle className="text-[#0a1e42]">Launch of New ODR Platform</CardTitle>
                  <CardDescription>March 12, 2023</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We&apos;re excited to announce the launch of our new and improved ODR platform with enhanced features.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
