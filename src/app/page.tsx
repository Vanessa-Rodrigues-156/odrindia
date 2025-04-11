"use client"
import "./globals.css"
import Image from "next/image"
import { ArrowRight, Award, BarChart, Globe, MessageSquare, Scale } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import StatsCounter from "@/components/stats-counter"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
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
              An <span className="text-sky-400">ALTERNATIVE</span> world of{" "}
              <span className="text-sky-400">ONLINE</span> dispute resolution
            </h1>
            <p className="max-w-[600px] text-lg text-gray-200 md:text-xl">
              Providing innovative online solutions for Alternative Dispute Resolution (ADR) practices and justice.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="bg-sky-500 hover:bg-sky-600" >
                <a href="/signin">
                Get Started
                </a>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-gray-200 bg-[#0a1e42] text-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
            </div>
              {/* <div className="flex items-center justify-center">
            <div className="relative h-[300px] w-full max-w-[500px] overflow-hidden rounded-lg shadow-xl md:h-[400px]">
              <Image
                src="/hero.jpg"
                alt="ODR india Platform"
                fill
                className="object-cover"
                priority
              />
            </div>
              </div> */}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-2 text-3xl font-bold tracking-tight text-[#0a1e42] md:text-4xl">Our ODR Services</h2>
              <p className="mx-auto max-w-[700px] text-gray-600">
                Comprehensive online dispute resolution solutions for various needs
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-2 border-transparent transition-all hover:border-[#0a1e42]/10 hover:shadow-lg">
                <CardHeader className="pb-2">
                  <div className="mb-2 rounded-full bg-[#0a1e42]/10 p-2 w-fit">
                    <MessageSquare className="h-6 w-6 text-[#0a1e42]" />
                  </div>
                  <CardTitle className="text-[#0a1e42]">Online Negotiations</CardTitle>
                  <CardDescription>We help deals made & issues settled online</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Our platform provides a secure environment for parties to negotiate and reach agreements efficiently
                    without the need for physical meetings.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-transparent transition-all hover:border-[#0a1e42]/10 hover:shadow-lg">
                <CardHeader className="pb-2">
                  <div className="mb-2 rounded-full bg-[#0a1e42]/10 p-2 w-fit">
                    <Globe className="h-6 w-6 text-[#0a1e42]" />
                  </div>
                  <CardTitle className="text-[#0a1e42]">Online Mediation</CardTitle>
                  <CardDescription>We make cross-border disputes easy to solve</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Our mediation services bridge geographical gaps, allowing parties from different countries to
                    resolve disputes with professional mediators.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-transparent transition-all hover:border-[#0a1e42]/10 hover:shadow-lg">
                <CardHeader className="pb-2">
                  <div className="mb-2 rounded-full bg-[#0a1e42]/10 p-2 w-fit">
                    <Scale className="h-6 w-6 text-[#0a1e42]" />
                  </div>
                  <CardTitle className="text-[#0a1e42]">Online Arbitration</CardTitle>
                  <CardDescription>We introduce web solutions to arbitration cases</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Our arbitration platform provides a formal dispute resolution process with legally binding decisions
                    delivered entirely online.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-transparent transition-all hover:border-[#0a1e42]/10 hover:shadow-lg">
                <CardHeader className="pb-2">
                  <div className="mb-2 rounded-full bg-[#0a1e42]/10 p-2 w-fit">
                    <BarChart className="h-6 w-6 text-[#0a1e42]" />
                  </div>
                  <CardTitle className="text-[#0a1e42]">ODR in Consumer Disputes</CardTitle>
                  <CardDescription>We provide e-resolving to e-shopping disputes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Specialized solutions for e-commerce disputes, helping consumers and businesses resolve issues
                    quickly and fairly.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-transparent transition-all hover:border-[#0a1e42]/10 hover:shadow-lg">
                <CardHeader className="pb-2">
                  <div className="mb-2 rounded-full bg-[#0a1e42]/10 p-2 w-fit">
                    <Scale className="h-6 w-6 text-[#0a1e42]" />
                  </div>
                  <CardTitle className="text-[#0a1e42]">ODR in Courts of Justice</CardTitle>
                  <CardDescription>We contribute to the innovation of Justice</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Working with courts to implement ODR solutions that improve access to justice and streamline legal
                    processes.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-transparent transition-all hover:border-[#0a1e42]/10 hover:shadow-lg">
                <CardHeader className="pb-2">
                  <div className="mb-2 rounded-full bg-[#0a1e42]/10 p-2 w-fit">
                    <Award className="h-6 w-6 text-[#0a1e42]" />
                  </div>
                  <CardTitle className="text-[#0a1e42]">ODR Platforms & Apps</CardTitle>
                  <CardDescription>We bring ODR technology one click closer</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Developing cutting-edge platforms and applications that make dispute resolution accessible on any
                    device.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section className="bg-[#0a1e42] py-16 text-white">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="flex flex-col justify-center space-y-6">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  See how ODR India is transforming dispute resolution
                </h2>
                <p className="text-gray-200">
                  Watch our video to learn how our online dispute resolution services are making justice more
                  accessible, efficient, and effective.
                </p>
                <Button className="w-fit bg-white text-[#0a1e42] hover:bg-gray-100">Watch Video</Button>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-lg shadow-xl">
                <Image
                  src="/placeholder.svg?height=315&width=560"
                  alt="ODR India Video"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-white/90 p-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-8 w-8 text-[#0a1e42]"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-2 text-3xl font-bold tracking-tight text-[#0a1e42] md:text-4xl">
                ODR India in Numbers
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-600">
                Our impact on the world of online dispute resolution
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-white p-6 shadow-md">
                <p className="mb-2 text-sm font-medium text-gray-500">Monthly Website Visitors</p>
                <StatsCounter end={6000} prefix="+" className="text-3xl font-bold text-[#0a1e42]" />
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#dce5f3]">
                  <div className="h-full w-[85%] rounded-full bg-[#0a1e42]" />
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-md">
                <p className="mb-2 text-sm font-medium text-gray-500">e-presence in Countries</p>
                <StatsCounter end={20} prefix="+" className="text-3xl font-bold text-[#0a1e42]" />
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#dce5f3]">
                  <div className="h-full w-[65%] rounded-full bg-[#0a1e42]" />
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-md">
                <p className="mb-2 text-sm font-medium text-gray-500">Hours of ODR Experience</p>
                <StatsCounter end={4500} prefix="+" className="text-3xl font-bold text-[#0a1e42]" />
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#dce5f3]">
                  <div className="h-full w-[75%] rounded-full bg-[#0a1e42]" />
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-md">
                <p className="mb-2 text-sm font-medium text-gray-500">Connected Businesses & Entities</p>
                <StatsCounter end={1200} prefix="+" className="text-3xl font-bold text-[#0a1e42]" />
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#dce5f3]">
                  <div className="h-full w-[80%] rounded-full bg-[#0a1e42]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-2 text-3xl font-bold tracking-tight text-[#0a1e42] md:text-4xl">
                How We Can Work Together
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-600">
                Explore the different ways we can collaborate to resolve disputes
              </p>
            </div>

            <Tabs defaultValue="partnerships" className="mx-auto max-w-3xl">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="partnerships">Partnerships</TabsTrigger>
                <TabsTrigger value="innovation">Innovation</TabsTrigger>
              </TabsList>
              <TabsContent value="partnerships" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Valuable Partnerships</CardTitle>
                    <CardDescription>Join our network of partners to expand the reach of ODR services</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      We collaborate with courts, legal professionals, businesses, and organizations to implement
                      effective ODR solutions. Our partnerships are built on shared values of accessibility, efficiency,
                      and justice.
                    </p>
                    <ul className="ml-6 list-disc space-y-2">
                      <li>Partner with courts and tribunals</li>
                      <li>Collaborate with legal tech companies</li>
                      <li>Work with e-commerce platforms</li>
                      <li>Connect with legal professionals</li>
                    </ul>
                    <Button className="mt-4 bg-[#0a1e42] hover:bg-[#263e69]">Become a Partner</Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="innovation" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Open to Ideas</CardTitle>
                    <CardDescription>Contribute to the future of online dispute resolution</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      We're constantly looking for innovative approaches to improve ODR. Share your ideas, research, or
                      technology to help us advance the field and make justice more accessible to all.
                    </p>
                    <ul className="ml-6 list-disc space-y-2">
                      <li>Propose new ODR methodologies</li>
                      <li>Suggest technological improvements</li>
                      <li>Share research findings</li>
                      <li>Collaborate on pilot projects</li>
                    </ul>
                    <Button className="mt-4 bg-[#0a1e42] hover:bg-[#263e69]">Submit Your Idea</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#0a1e42] py-16 text-white">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Ready to Resolve Disputes Online?</h2>
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
              <h2 className="mb-2 text-3xl font-bold tracking-tight text-[#0a1e42] md:text-4xl">Latest News</h2>
              <p className="mx-auto max-w-[700px] text-gray-600">Stay updated with the latest developments in ODR</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image src="/placeholder.svg?height=200&width=400" alt="News Image" fill className="object-cover" />
                </div>
                <CardHeader>
                  <CardTitle className="text-[#0a1e42]">ODR India at the 2023 ODR Conference</CardTitle>
                  <CardDescription>May 15, 2023</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Our team presented the latest innovations in online dispute resolution at the annual ODR Conference.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image src="/placeholder.svg?height=200&width=400" alt="News Image" fill className="object-cover" />
                </div>
                <CardHeader>
                  <CardTitle className="text-[#0a1e42]">New Partnership with Indian Courts</CardTitle>
                  <CardDescription>April 3, 2023</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    ODR India has signed a new agreement to provide ODR services to several Indian courts.
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image src="/placeholder.svg?height=200&width=400" alt="News Image" fill className="object-cover" />
                </div>
                <CardHeader>
                  <CardTitle className="text-[#0a1e42]">Launch of New ODR Platform</CardTitle>
                  <CardDescription>March 12, 2023</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We're excited to announce the launch of our new and improved ODR platform with enhanced features.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 text-center">
              <Button variant="outline" className="border-[#0a1e42] text-[#0a1e42] hover:bg-[#0a1e42] hover:text-white">
                View All News
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
