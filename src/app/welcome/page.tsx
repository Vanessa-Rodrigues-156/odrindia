"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { ArrowRight, Scale, Users, Lightbulb, MessageSquare, BarChart3 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Create a client-only component for particles
const AnimatedParticles = dynamic(
  () => Promise.resolve(() => {
    const particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2,
      size: i < 25 ? 1 : 2,
    }));

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute bg-[#f6ece3] rounded-full animate-shimmer opacity-60 ${
              particle.size === 1 ? 'w-1 h-1' : 'w-2 h-2'
            }`}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>
    );
  }),
  { ssr: false } // This prevents server-side rendering
);

export default function WelcomePage() {
  const [isClient, setIsClient] = useState(false);
  const [particles, setParticles] = useState<any[]>([]);

  // Function to generate particles with consistent properties
  const generateParticles = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2,
      size: i < 25 ? 1 : 2,
    }));
  };

  // Only generate particles on client to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
    setParticles(generateParticles(50)); // Generate 50 particles with consistent seed
  }, []);

  const [isVisible, setIsVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [splashTimer, setSplashTimer] = useState(10)
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    // Splash timer countdown
    if (splashTimer > 0) {
      const timer = setTimeout(() => {
        setSplashTimer((prev) => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      // Hide splash and show main content
      setTimeout(() => {
        setShowSplash(false)
        setIsVisible(true)
      }, 500)
    }
  }, [splashTimer])

  useEffect(() => {
    if (!showSplash) {
      const timer = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % 5)
      }, 2000)
      return () => clearInterval(timer)
    }
  }, [showSplash])

  const steps = [
    { icon: Users, title: "Register", description: "Join as Mentor or Ideator" },
    { icon: Lightbulb, title: "Ideate", description: "Share ideas for creating ODR systems" },
    { icon: MessageSquare, title: "Collaborate", description: "Connect with ideators and mentors" },
    { icon: Scale, title: "Develop", description: "Build ODR Systems together" },
    { icon: BarChart3, title: "Impact", description: "Transform Dispute Resolution System" },
  ]

  // Splash Screen
  if (showSplash) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#486581] to-[#b7a7a9] flex items-center justify-center overflow-hidden">
        {/* Animated Background Particles */}
        <div className="absolute inset-0">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className={`absolute bg-[#f6ece3] rounded-full animate-shimmer opacity-60 ${
                particle.size === 1 ? 'w-1 h-1' : 'w-2 h-2'
              }`}
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            />
          ))}
        </div>

        {/* Splash Content */}
        <div className="text-center z-10">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse p-2">
              <Image
                src="/Logobg.svg"
                alt="ODR Lab Logo"
                width={80}
                height={80}
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">ODR LAB</h1>
            <p className="text-[#f6ece3] text-lg mb-2">A Digital Hub for Building Smarter ODR Systems—supported by both, Professional Expertise & Artificial Intelligence</p>
            <p className="text-[#f6ece3] text-lg mb-8">Launching Innovation</p>
          </div>

          {/* Countdown Timer */}
          <div className="relative flex flex-col items-center">
            <div className="w-20 h-20 mb-4 relative">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="36" stroke="#f6ece3" strokeWidth="4" fill="none" opacity="0.3" />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#f6ece3"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (splashTimer / 10)}`}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white w-10 text-center tabular-nums">{splashTimer}</span>
              </div>
            </div>
            <p className="text-[#f6ece3] text-sm">Preparing your experience...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background particles - client-only */}
      <AnimatedParticles />

      {/* Rest of your existing JSX */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 pt-4 mb-4">
        {/* Launch Announcement */}
        <div
          className={`text-center mb-8 transition-all duration-1000 delay-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <div className="inline-block bg-[#f6ece3] text-[#486581] px-6 py-2 rounded-full text-sm font-medium mb-4 animate-bounce">
            🎉 Now Launching
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#486581] mb-4">Welcome to</h1>
          <div className="relative">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-black via-[#486581] to-[#b7a7a9] bg-clip-text text-transparent">
              ODR LAB
            </h2>
          </div>
        </div>

        {/* Subtitle
        <p
          className={`text-xl md:text-2xl text-[#917e6e] text-center max-w-3xl mb-4 transition-all duration-1000 delay-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          A Digital Hub for Building Smarter ODR Systems—supported by both, Professional Expertise & Artificial Intelligence
        </p> */}
        <p
          className={`text-lg md:text-xl text-[#917e6e] text-center max-w-3xl mb-10 transition-all duration-1000 delay-800 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          A global platform for co-creating innovative Online Dispute Resolution systems through collaboration.
        </p>

        {/* Animated Central Icon */}
        <div
          className={`relative mb-12 transition-all duration-1000 delay-900 ${isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
        >
          <div className="relative w-32 h-32 md:w-40 md:h-40">
            <div className="absolute inset-0 bg-gradient-to-r from-[#486581] to-[#b7a7a9] rounded-full animate-spin-slow" />
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center p-4">
              <Image
                src="/Logobg.svg"
                alt="ODR Lab Logo"
                width={120}
                height={120}
                className="w-full h-full object-contain animate-pulse"
              />
            </div>
            {/* Orbiting elements */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 bg-[#f6ece3] rounded-full border-2 border-[#486581]"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-80px)`,
                  animation: `orbit 4s linear infinite ${i * 0.5}s`,
                }}
              />
            ))}
          </div>
        </div>

        
        {/* Animated Steps Preview */}
        <div
          className={`w-full mb-10 max-w-4xl transition-all duration-1000 delay-1300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-[#486581] text-center mb-8">How ODR LAB Works</h3>
          <div className="flex flex-wrap  justify-center gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = index === currentStep
              return (
                <div
                  key={index}
                  className={`flex flex-col items-center p-6 rounded-xl transition-all duration-500 ${
                    isActive ? "bg-[#f6ece3] scale-110 shadow-lg" : "bg-[#f0f4f8] hover:bg-[#f6ece3]"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                      isActive ? "bg-[#486581] text-white" : "bg-[#ddd9db] text-[#486581]"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-[#486581] mb-1">{step.title}</h4>
                  <p className="text-sm text-[#917e6e] text-center">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 mb-16 transition-all duration-1000 delay-1100 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <Link href={"/signup"} className="w-full sm:w-auto">
            <Button className="bg-[#486581] hover:bg-[#486581]/90 text-white px-8 py-3 text-lg rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg group">
              Register as a Mentor or Ideator
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

      </main>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes orbit {
        @keyframes shimmer {m: translate(-50%, -50%) rotate(0deg) translateY(-80px);
          0%, 100% {
            opacity: 0.3;
            transform: scale(1); transform: translate(-50%, -50%) rotate(360deg) translateY(-80px);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);yframes spin-slow {
          } from {
        }    transform: rotate(0deg);
        
        @keyframes shimmer-glow {
          0%, 100% {tate(360deg);
            opacity: 0.2;
            transform: scale(1);
            box-shadow: 0 0 0 rgba(246, 236, 227, 0);
          }mes shimmer {
          50% {
            opacity: 0.8;
            transform: scale(1.5);
            box-shadow: 0 0 20px rgba(246, 236, 227, 0.6);
          } 50% {
        }    opacity: 1;
        (1.2);
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        -glow {
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;   opacity: 0.2;
        }    transform: scale(1);
        gba(246, 236, 227, 0);
        .animate-shimmer-glow {
          animation: shimmer-glow 3s ease-in-out infinite; 50% {
        }ity: 0.8;
      `}</style> 
    </div>
  )
}
