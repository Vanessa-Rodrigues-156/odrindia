"use client"

import Image from "next/image"
import { ArrowRight, Award, Clock, Globe, Target, Users, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"


export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
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
                ODR Lab was born from a shared vision among industry experts, passionate students, and forward-thinking academicians. It serves as a dynamic platform that bridges the gap between academia and industry, empowering innovators to connect with a global community around the design and development of Online Dispute Resolution (ODR) systems. Fueled by the eagerness of students to work on real-world challenges, the pressing societal need for more efficient justice mechanisms, and the collaborative spirit of global idea exchange, ODR Lab stands as a hub for innovation, dialogue, and impactful solutions.
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
              <div className="flex items-center justify-center">
                <Button className="w-fit bg-[#0a1e42] hover:bg-[#263e69]">
                  Learn More About Our Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
         

      

        // ... existing code ...
        {/* Our Team */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-2 text-3xl font-bold tracking-tight text-[#0a1e42] md:text-4xl">Industry Academia Team</h2>
            </div>

            {/* Industry Mentors */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-[#0a1e42] text-center mb-8">Industry & Academic Mentors</h3>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-center">
                <Card className="overflow-hidden border-none shadow-md max-w-xs mx-auto">
                  <div className="relative h-64 w-full">
                    <Image 
                      src="/chittu.jpg"
                      alt="Chittu Nagrajan" 
                      fill 
                      className="object-cover"
                      priority
                    />
                  </div>
                  <CardHeader className="bg-white pb-2">
                    <CardTitle className="text-[#0a1e42]">Chittu Nagrajan</CardTitle>
                    <CardDescription>Industry Mentor</CardDescription>
                  </CardHeader>
                  <CardContent className="bg-white">
                    <p className="text-gray-600">
                      Guiding the development of innovative ODR solutions and sharing industry expertise.
                    </p>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-none shadow-md max-w-xs mx-auto">
                  <div className="relative h-64 w-full">
                    <Image 
                      src="/suman.jpg"
                      alt="Dr Suman Kalani" 
                      fill 
                      className="object-cover"
                      priority
                    />
                  </div>
                  <CardHeader className="bg-white pb-2">
                    <CardTitle className="text-[#0a1e42]">Dr Suman Kalani</CardTitle>
                    <CardDescription>Academic Mentor</CardDescription>
                  </CardHeader>
                  <CardContent className="bg-white">
                    <p className="text-gray-600">
                      Providing academic guidance and research expertise in ODR development.
                    </p>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-none shadow-md max-w-xs mx-auto">
                  <div className="relative h-64 w-full">
                    <Image 
                      src="/aastha.jpg"
                      alt="Assistant Professor Aastha Bhatia" 
                      fill 
                      className="object-cover"
                      priority
                    />
                  </div>
                  <CardHeader className="bg-white pb-2">
                    <CardTitle className="text-[#0a1e42]">Assistant Professor Aastha Bhatia</CardTitle>
                    <CardDescription>Academic Mentor</CardDescription>
                  </CardHeader>
                  <CardContent className="bg-white">
                    <p className="text-gray-600">
                      Contributing expertise in legal technology and ODR research.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Student Ambassadors */}
            <div>
              <h3 className="text-2xl font-bold text-[#0a1e42] text-center mb-8">Student Ambassadors</h3>
              <div className="grid gap-8 sm:grid-cols-2 justify-center mx-auto">
                <Card className="overflow-hidden border-none shadow-md max-w-xs mx-auto">
                  <div className="relative h-64 w-full">
                    <Image 
                      src="/vanessa.jpg"
                      alt="Vanessa Rodrigues" 
                      fill 
                      className="object-cover"
                      priority
                    />
                  </div>
                  <CardHeader className="bg-white pb-2">
                    <CardTitle className="text-[#0a1e42]">Vanessa Rodrigues</CardTitle>
                    <CardDescription>Student Ambassador</CardDescription>
                  </CardHeader>
                  <CardContent className="bg-white">
                    <p className="text-gray-600">
                      Contributing to the development and innovation of ODR solutions.
                    </p>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-none shadow-md max-w-xs mx-auto">
                  <div className="relative h-64 w-full">
                    <Image 
                      src="/anjali.jpg"
                      alt="Anjali Singh" 
                      fill 
                      className="object-cover"
                      priority
                    />
                  </div>
                  <CardHeader className="bg-white pb-2">
                    <CardTitle className="text-[#0a1e42]">Anjali Singh</CardTitle>
                    <CardDescription>Student Ambassador</CardDescription>
                  </CardHeader>
                  <CardContent className="bg-white">
                    <p className="text-gray-600">
                      Contributing to the development and innovation of ODR solutions.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
// ... existing code ...
        {/* Values */}
        <section className="bg-[#0a1e42] py-16 text-white">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-2 text-3xl font-bold md:text-4xl">Our Core Values</h2>
              <p className="mx-auto max-w-[700px] text-gray-200">
                Core Values of Dispute Designs Systems 
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
    </div>
  )
}
