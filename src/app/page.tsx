"use client"
import "./globals.css"
import Image from "next/image"
import { ArrowRight, Award, BarChart, Globe, MessageSquare, Scale } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"


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
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-gray-200 bg-[#0a1e42] text-white hover:bg-white/10" onClick={() => window.location.href = '/about'}>
                Learn More
              </Button>
            </div>
            </div>
              {/* <div className="flex items-center justify-center">
            <div className="relative h-[300px] w-full max-w-[500px] overflow-hidden rounded-lg shadow-xl md:h-[400px]">
              <Image
                src="/hero.jpg"
                alt="ODR Platform"
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
              <h2 className="mb-2 text-3xl font-bold tracking-tight text-[#0a1e42] md:text-4xl">LET&apos;S COLLABORATE FOR</h2>
              <p className="mx-auto max-w-[700px] text-gray-600">
                Innovative solutions advancing the future of dispute resolution
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-2 border-transparent transition-all hover:border-[#0a1e42]/10 hover:shadow-lg">
                <CardHeader className="pb-2">
                  <div className="mb-2 rounded-full bg-[#0a1e42]/10 p-2 w-fit">
                    <MessageSquare className="h-6 w-6 text-[#0a1e42]" />
                  </div>
                  <CardTitle className="text-[#0a1e42]">Designing Dispute Resolution Systems</CardTitle>
                  <CardDescription>Custom solutions for complex dispute scenarios</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We create comprehensive dispute resolution systems tailored to specific industries, combining technology and human expertise.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-transparent transition-all hover:border-[#0a1e42]/10 hover:shadow-lg">
                <CardHeader className="pb-2">
                  <div className="mb-2 rounded-full bg-[#0a1e42]/10 p-2 w-fit">
                    <Globe className="h-6 w-6 text-[#0a1e42]" />
                  </div>
                  <CardTitle className="text-[#0a1e42]">Predictive Justice Technologies</CardTitle>
                  <CardDescription>AI-powered solutions for better outcomes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Our advanced algorithms analyze case patterns to predict outcomes and suggest fair resolutions based on historical data.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-transparent transition-all hover:border-[#0a1e42]/10 hover:shadow-lg">
                <CardHeader className="pb-2">
                  <div className="mb-2 rounded-full bg-[#0a1e42]/10 p-2 w-fit">
                    <Scale className="h-6 w-6 text-[#0a1e42]" />
                  </div>
                  <CardTitle className="text-[#0a1e42]">Legal Tech Solutions for Court Integration</CardTitle>
                  <CardDescription>Bridging traditional and digital justice</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We develop seamless interfaces between conventional court systems and modern ODR platforms to enhance judicial efficiency.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-transparent transition-all hover:border-[#0a1e42]/10 hover:shadow-lg">
                <CardHeader className="pb-2">
                  <div className="mb-2 rounded-full bg-[#0a1e42]/10 p-2 w-fit">
                    <BarChart className="h-6 w-6 text-[#0a1e42]" />
                  </div>
                  <CardTitle className="text-[#0a1e42]">Developing Automated Mediation Platforms</CardTitle>
                  <CardDescription>AI-assisted conflict resolution</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Our intelligent platforms guide parties through structured mediation processes with automated suggestions and assistance.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-transparent transition-all hover:border-[#0a1e42]/10 hover:shadow-lg">
                <CardHeader className="pb-2">
                  <div className="mb-2 rounded-full bg-[#0a1e42]/10 p-2 w-fit">
                    <Scale className="h-6 w-6 text-[#0a1e42]" />
                  </div>
                  <CardTitle className="text-[#0a1e42]">Designing Case-Specific Online Arbitration Processes</CardTitle>
                  <CardDescription>Customized digital arbitration solutions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We create specialized arbitration workflows adapted to specific dispute types, industries, and regulatory requirements.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-transparent transition-all hover:border-[#0a1e42]/10 hover:shadow-lg">
                <CardHeader className="pb-2">
                  <div className="mb-2 rounded-full bg-[#0a1e42]/10 p-2 w-fit">
                    <Award className="h-6 w-6 text-[#0a1e42]" />
                  </div>
                  <CardTitle className="text-[#0a1e42]">Creating Personalized Dispute Resolution Pathways</CardTitle>
                  <CardDescription>Tailored experiences for unique needs</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Our adaptive platforms create custom resolution journeys based on dispute characteristics and party preferences.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-transparent transition-all hover:border-[#0a1e42]/10 hover:shadow-lg">
                <CardHeader className="pb-2">
                  <div className="mb-2 rounded-full bg-[#0a1e42]/10 p-2 w-fit">
                    <Globe className="h-6 w-6 text-[#0a1e42]" />
                  </div>
                  <CardTitle className="text-[#0a1e42]">Building Multilingual Dispute Resolution Platforms</CardTitle>
                  <CardDescription>Breaking language barriers in ODR</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We develop inclusive platforms that support multiple languages to facilitate cross-border and cross-cultural dispute resolution.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Video Section
        <section className="bg-[#0a1e42] py-16 text-white">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="flex flex-col justify-center space-y-6">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  See how ODR is transforming dispute resolution
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
                  alt="ODR Video"
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
        </section> */}

        {/* Stats Section */}
        {/* <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-2 text-3xl font-bold tracking-tight text-[#0a1e42] md:text-4xl">
                ODR in Numbers
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
        </section> */}

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
              <h2 className="mb-2 text-3xl font-bold tracking-tight text-[#0a1e42] md:text-4xl">What&apos;s New</h2>
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

            {/* <div className="mt-8 text-center">
              <Button variant="outline" className="border-[#0a1e42] text-[#0a1e42] hover:bg-[#0a1e42] hover:text-white">
                View All News
              </Button>
            </div> */}
          </div>
        </section>
      </main>
    </div>
  )
}
