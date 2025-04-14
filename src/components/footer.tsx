import Link from "next/link"
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Footer() {
  return (
    <footer className="bg-[#0a1e42] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">ODR</h3>
            <p className="text-gray-300">
              Online Dispute Resolution for ADR practices and Justice. Making dispute resolution accessible, efficient,
              and effective.
            </p>
            <div className="flex space-x-4">
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Button>
              </Link>
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Facebook className="h-4 w-4" />
                  <span className="sr-only">Facebook</span>
                </Button>
              </Link>
              <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Instagram className="h-4 w-4" />
                  <span className="sr-only">Instagram</span>
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white">
                  ODR Services
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-300 hover:text-white">
                  News & Events
                </Link>
              </li>
              <li>
                <Link href="/lab" className="text-gray-300 hover:text-white">
                  ODR Lab
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold">Contact Information</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 shrink-0 text-sky-400" />
                <span className="text-gray-300">123 borivali Mumbai Maharashtra India </span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 shrink-0 text-sky-400" />
                <span className="text-gray-300">+30 123 456 7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 shrink-0 text-sky-400" />
                <span className="text-gray-300">info@odrindia.com</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold">Newsletter</h3>
            <p className="text-gray-300">Subscribe to our newsletter for the latest updates on ODR.</p>
            <form className="flex flex-col space-y-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="border-gray-700 bg-[#263e69] text-white placeholder:text-gray-400"
              />
              <Button className="bg-sky-500 hover:bg-sky-600">Subscribe</Button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-gray-300 md:text-left">
              © {new Date().getFullYear()} ODR. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy-policy" className="text-sm text-gray-300 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-sm text-gray-300 hover:text-white">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-sm text-gray-300 hover:text-white">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
