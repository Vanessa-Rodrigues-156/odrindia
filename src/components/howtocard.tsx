import React from "react";
import { Button } from "@/components/ui/button";
const HowToCard: React.FC = () => {
    return (
<section className="py-12 bg-gradient-to-r from-gray-50 to-gray-100">
  <div className="container mx-auto px-4">
    <div className="mb-8 text-center">
      <h2 className="text-3xl font-bold text-[#0a1e42] mb-2">How to use ODR LAB</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">Follow these simple steps to get started with our collaborative platform</p>
    </div>
    
    <div className="grid md:grid-cols-5 gap-4 max-w-4xl mx-auto">
      {/* Step 1 */}
      <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative">
        <div className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#0a1e42] text-white font-bold">
          1
        </div>
        <div className="flex flex-col items-center text-center pt-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3a86ff] mb-3">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <h3 className="text-[#0a1e42] font-semibold mb-2">Sign Up</h3>
          <p className="text-gray-600 text-sm">Register as an Ideator</p>
        </div>
      </div>

      {/* Step 2 */}
      <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative">
        <div className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#0a1e42] text-white font-bold">
          2
        </div>
        <div className="flex flex-col items-center text-center pt-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3a86ff] mb-3">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          <h3 className="text-[#0a1e42] font-semibold mb-2">Join</h3>
          <p className="text-gray-600 text-sm">Start with an Idea Board to design ODR</p>
        </div>
      </div>

      {/* Step 3 */}
      <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative">
        <div className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#0a1e42] text-white font-bold">
          3
        </div>
        <div className="flex flex-col items-center text-center pt-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3a86ff] mb-3">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <h3 className="text-[#0a1e42] font-semibold mb-2">Discuss</h3>
          <p className="text-gray-600 text-sm">Deliberate and exchange ideas in the ODR lab</p>
        </div>
      </div>

      {/* Step 4 */}
      <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative">
        <div className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#0a1e42] text-white font-bold">
          4
        </div>
        <div className="flex flex-col items-center text-center pt-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3a86ff] mb-3">
            <path d="M12 21a9 9 0 0 1-9-9 9 9 0 0 1 9-9 9 9 0 0 1 9 9 9 9 0 0 1-9 9z"></path>
            <path d="M8 10.05V10a4 4 0 0 1 8 0v.05"></path>
            <path d="M9.4 15.4h0a1 1 0 0 0 1.41 0l.8-.81a1 1 0 0 1 1.4 0l2.29 2.3"></path>
            <path d="M3 8h1"></path>
            <path d="M3 12h1"></path>
            <path d="M3 16h1"></path>
            <path d="M20 8h1"></path>
            <path d="M20 12h1"></path>
            <path d="M20 16h1"></path>
            <path d="M8 3v1"></path>
            <path d="M12 3v1"></path>
            <path d="M16 3v1"></path>
            <path d="M8 20v1"></path>
            <path d="M12 20v1"></path>
            <path d="M16 20v1"></path>
          </svg>
          <h3 className="text-[#0a1e42] font-semibold mb-2">Connect</h3>
          <p className="text-gray-600 text-sm">Engage with mentors and the AI chatbot</p>
        </div>
      </div>

      {/* Step 5 */}
      <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative">
        <div className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#0a1e42] text-white font-bold">
          5
        </div>
        <div className="flex flex-col items-center text-center pt-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3a86ff] mb-3">
            <line x1="12" y1="20" x2="12" y2="10"></line>
            <line x1="18" y1="20" x2="18" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="16"></line>
          </svg>
          <h3 className="text-[#0a1e42] font-semibold mb-2">Reflect</h3>
          <p className="text-gray-600 text-sm">Collaboratively develop Impactful  ODR Systems</p>
        </div>
      </div>
    </div>
    
    <div className="text-center mt-8">
      <Button className="bg-[#0a1e42] hover:bg-[#152a4e]">
        Get Started Now
      </Button>
    </div>
  </div>
</section>
    );
};

export default HowToCard;