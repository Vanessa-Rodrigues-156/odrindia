"use client"

import Image from "next/image"
import { ArrowRight, Award, Clock, Globe, Target, Users, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section
          className="relative bg-[#0a1e42] py-20 text-white"
          style={{
            backgroundImage: "url('/about-hero.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay",
            backgroundColor: "rgba(10, 30, 66, 0.85)",
          }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
                About <span className="text-sky-400">ODR</span> Labs
              </h1>
              <p className="mx-auto mt-4 max-w-[800px] text-lg text-gray-200 md:text-xl">
              Connect, Collaborate, and Create innovative ODR systems — Shaping access to Justice
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 md:grid-cols-2">
              <Card className="border-2 border-transparent transition-all hover:border-[#0a1e42]/10 hover:shadow-lg">
                <CardHeader className="pb-2">
                  <div className="mb-2 w-fit rounded-full bg-[#0a1e42]/10 p-2">
                    <Target className="h-6 w-6 text-[#0a1e42]" />
                  </div>
                  <CardTitle className="text-[#0a1e42]">Our Mission</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    To democratize access to justice through innovative online dispute resolution technologies and 
                    services, making conflict resolution more accessible, efficient, and affordable for all Indians 
                    regardless of location or economic status.
                  </p>
                  <p className="text-gray-600">
                    We strive to reduce the burden on traditional courts while providing high-quality ADR services 
                    that meet the unique needs of our diverse population.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-transparent transition-all hover:border-[#0a1e42]/10 hover:shadow-lg">
                <CardHeader className="pb-2">
                  <div className="mb-2 w-fit rounded-full bg-[#0a1e42]/10 p-2">
                    <Zap className="h-6 w-6 text-[#0a1e42]" />
                  </div>
                  <CardTitle className="text-[#0a1e42]">Our Vision</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    To create a future where justice is not confined to courtrooms but is readily available online to everyone,
                    anywhere, anytime.
                  </p>
                  <p className="text-gray-600">
                    We envision a World where disputes are resolved swiftly, fairly, and without the traditional barriers of 
                    cost, distance, and procedural complexity that often deter people from seeking resolution.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-2 text-3xl font-bold tracking-tight text-[#0a1e42] md:text-4xl">Our Story</h2>
              <p className="mx-auto max-w-[700px] text-gray-600">
                The journey of ODR from concept to reality
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="relative aspect-square overflow-hidden rounded-lg shadow-xl">
                <Image
                  src="/placeholder.svg?height=500&width=500"
                  alt="ODR Origin Story"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#0a1e42]" />
                    <h3 className="text-xl font-semibold text-[#0a1e42]">Our Beginning</h3>
                  </div>
                  <p className="text-gray-600">
                    Founded in 2018 by a group of legal technologists and ADR experts, ODR began with a simple mission: to bring 
                    the benefits of technology to dispute resolution in a country facing massive judicial backlogs.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-[#0a1e42]" />
                    <h3 className="text-xl font-semibold text-[#0a1e42]">Growth & Impact</h3>
                  </div>
                  <p className="text-gray-600">
                    From handling a few cases monthly to becoming India&apos;s leading ODR provider, we&apos;ve expanded our reach to 20+ 
                    countries, working with courts, businesses, and individuals to resolve disputes efficiently online.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-[#0a1e42]" />
                    <h3 className="text-xl font-semibold text-[#0a1e42]">Recognition</h3>
                  </div>
                  <p className="text-gray-600">
                    Our innovative approach has earned recognition from legal institutions worldwide, including awards for 
                    technological innovation in justice delivery and excellence in online dispute resolution.
                  </p>
                </div>

                <Button className="w-fit bg-[#0a1e42] hover:bg-[#263e69]">
                  Learn More About Our Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-2 text-3xl font-bold tracking-tight text-[#0a1e42] md:text-4xl">Student Ambassadors</h2>
              <p className="mx-auto max-w-[700px] text-gray-600">
                Industry Academia Team 
              </p>
            </div>
            <div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 justify-center mx-auto">
              {[1, 2].map((i) => (
                <Card key={i} className="overflow-hidden border-none shadow-md max-w-xs">
                  <div className="relative h-64 w-full">
                    <Image 
                      src={`/placeholder.svg?height=300&width=300&text=Team Member ${i}`} 
                      alt={`Team Member ${i}`} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <CardHeader className="bg-white pb-2">
                    <CardTitle className="text-[#0a1e42]">Team Member {i}</CardTitle>
                    <CardDescription>Position/Title</CardDescription>
                  </CardHeader>
                  <CardContent className="bg-white">
                    <p className="text-gray-600">
                      Brief description about this team member&apos;s expertise and contribution to ODR India.
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-[#0a1e42] py-16 text-white">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-2 text-3xl font-bold md:text-4xl">Our Core Values</h2>
              <p className="mx-auto max-w-[700px] text-gray-200">
                The principles that guide our work and relationships
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: <Users className="h-8 w-8" />, title: "Accessibility", description: "Making justice accessible to all" },
                { icon: <Globe className="h-8 w-8" />, title: "Innovation", description: "Constantly improving our technology and processes" },
                { icon: <Award className="h-8 w-8" />, title: "Integrity", description: "Upholding the highest ethical standards" },
                { icon: <Target className="h-8 w-8" />, title: "Efficiency", description: "Delivering timely and effective solutions" },
                { icon: <Zap className="h-8 w-8" />, title: "Empathy", description: "Understanding the human aspects of disputes" },
                { icon: <Clock className="h-8 w-8" />, title: "Persistence", description: "Committed to finding resolutions" },
              ].map((value, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="mb-4 rounded-full bg-white/10 p-4">
                    {value.icon}
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{value.title}</h3>
                  <p className="text-gray-200">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-lg">
              <div className="text-center">
                <h2 className="mb-4 text-3xl font-bold tracking-tight text-[#0a1e42] md:text-4xl">Join Our Mission</h2>
                <p className="mb-8 text-gray-600">
                  Whether you&apos;re a legal professional, tech enthusiast, or organization seeking to implement ODR, 
                  we&apos;d love to connect with you.
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <Button className="bg-[#0a1e42] hover:bg-[#263e69]">
                    <a href="/contact">Contact Us</a>
                  </Button>
                  <Button variant="outline" className="border-[#0a1e42] text-[#0a1e42] hover:bg-[#0a1e42] hover:text-white">
                    View Careers
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
