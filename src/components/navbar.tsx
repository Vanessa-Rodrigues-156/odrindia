"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "About",
    href: "/about",
  },
  {
    title: "ODR Resources",
    href: "/resources",
    children: [
      {
        title: "Online Negotiations",
        href: "/services/negotiations",
        description: "We help deals made & issues settled online",
      },
      {
        title: "Online Mediation",
        href: "/services/mediation",
        description: "We make cross-border disputes easy to solve",
      },
      {
        title: "Online Arbitration",
        href: "/services/arbitration",
        description: "We introduce web solutions to arbitration cases",
      },
      {
        title: "Consumer Disputes",
        href: "/services/consumer-disputes",
        description: "We provide e-resolving to e-shopping disputes",
      },
    ],
  },
  {
    title: "Idea Board",
    href: "/submit-idea",
  },
  {
    title: "ODR Lab",
    href: "/odrlabs",
  },
  {
    title: "Contact",
    href: "/contact",
  },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const [languageDropdown, setLanguageDropdown] = useState(false)
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && 
          dropdownRefs.current[activeDropdown] && 
          !dropdownRefs.current[activeDropdown]?.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
      
      // Close language dropdown when clicking outside
      const langButton = document.getElementById('language-button')
      const langDropdown = document.getElementById('language-dropdown')
      if (languageDropdown && 
          event.target !== langButton && 
          !langDropdown?.contains(event.target as Node)) {
        setLanguageDropdown(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [activeDropdown, languageDropdown])

  const toggleDropdown = (title: string) => {
    setActiveDropdown(activeDropdown === title ? null : title)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-10 w-40">
              <Image
                src="/logo.jpg"
                alt="ODR India Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <ul className="flex items-center space-x-8">
            {navItems.map((item) => (
              <li key={item.title} className="relative">
                {item.children ? (
                  <div 
                    ref={(el) => {
                      dropdownRefs.current[item.title] = el;
                    }}
                    className="relative"
                  >
                    <button
                      onClick={() => toggleDropdown(item.title)}
                      className={`flex items-center text-[#0a1e42] hover:text-[#29487e] px-1 py-2 font-medium text-sm transition-colors ${
                        activeDropdown === item.title ? "text-[#29487e]" : ""
                      }`}
                    >
                      {item.title}
                      <svg 
                        className={`ml-1 h-4 w-4 transition-transform ${activeDropdown === item.title ? "rotate-180" : ""}`}
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {activeDropdown === item.title && (
                      <div className="absolute left-0 top-full z-10 mt-1 w-[400px] rounded-md border bg-white p-4 shadow-lg">
                        <ul className="grid md:grid-cols-2 gap-3">
                          {item.children.map((child) => (
                            <li key={child.title}>
                              <Link
                                href={child.href}
                                className="block rounded-md p-3 hover:bg-[#f0f4fa] transition-colors"
                                onClick={() => setActiveDropdown(null)}
                              >
                                <div className="font-medium text-[#0a1e42]">{child.title}</div>
                                <p className="text-sm text-gray-500 line-clamp-2">{child.description}</p>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="text-[#0a1e42] hover:text-[#29487e] px-1 py-2 font-medium text-sm transition-colors"
                  >
                    {item.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="hidden lg:block relative">
            <button
              id="language-button"
              onClick={() => setLanguageDropdown(!languageDropdown)}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-xs font-medium"
            >
              EN
            </button>
            
            {languageDropdown && (
              <div 
                id="language-dropdown"
                className="absolute right-0 top-full z-10 mt-1 min-w-[120px] rounded-md border bg-white py-1 shadow-lg"
              >
                <button 
                  onClick={() => setLanguageDropdown(false)}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  English
                </button>
                <button 
                  onClick={() => setLanguageDropdown(false)}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  Ελληνικά
                </button>
              </div>
            )}
          </div>
            {/* login Button */}
            <Link href="/signin" className="hidden lg:block">
            <button className="flex h-8 items-center justify-center rounded-md bg-[#0a1e42] px-4 text-sm font-medium text-white hover:bg-[#29487e]">
              Sign in
            </button>
            </Link>
            {/* Signup Button */}
            <Link href="/signin" className="hidden lg:block">
            <button className="flex h-8 items-center justify-center rounded-md bg-[#0a1e42] px-4 text-sm font-medium text-white hover:bg-[#29487e]">
              Sign Up
            </button>
            </Link>

          {/* Mobile Menu Toggle */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 py-4">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                    <div className="relative h-8 w-32">
                      <Image
                        src="/placeholder.svg?height=32&width=128"
                        alt="ODR India Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </Link>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>
                <nav className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <div key={item.title}>
                      <Link
                        href={item.href}
                        className="text-lg font-medium text-[#0a1e42] hover:text-[#29487e]"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.title}
                      </Link>
                      {item.children && (
                        <div className="mt-2 ml-4 flex flex-col gap-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.title}
                              href={child.href}
                              className="text-sm text-gray-600 hover:text-[#0a1e42]"
                              onClick={() => setIsOpen(false)}
                            >
                              {child.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
                <div className="flex items-center gap-4">
                  <button className="flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-xs font-medium">
                    EN
                  </button>
                  <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <button className="flex h-8 w-8 items-center justify-center rounded-md text-[#0a1e42] hover:bg-gray-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                      </svg>
                      <span className="sr-only">LinkedIn</span>
                    </button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
