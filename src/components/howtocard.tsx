import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";

const HowToCard: React.FC = () => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;

            const scrollTop = window.scrollY ;
            const elementRect = sectionRef.current.getBoundingClientRect();
            const elementBottom = scrollTop + (elementRect.bottom/4);
            
            // Simple calculation: 0% at top of page, 100% when element bottom exits viewport
            const progress = Math.min(100, Math.max(0, (scrollTop / elementBottom) * 100));
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Call once to set initial state

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section ref={sectionRef} className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 howto-timeline-section">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="text-4xl font-bold text-[#0a1e42] mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0a1e42] to-[#3a86ff]">
                            How to use ODR LAB
                        </span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">Follow these simple steps to get started with our collaborative platform</p>
                    <div className="mt-6 mx-auto w-24 h-1 bg-gradient-to-r from-[#3a86ff] to-indigo-600 rounded-full"></div>
                </div>

                {/* Timeline Container */}
                <div className="relative max-w-7xl mx-auto">
                    {/* Main Timeline Line - Base line */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent transform -translate-y-1/2 z-0 rounded-full"></div>
                    
                    {/* Scroll Progress Line - Simple fill animation */}
                    <div 
                        className="absolute top-1/2 left-0 h-1 transform -translate-y-1/2 z-10 rounded-full transition-all duration-100 ease-out"
                        style={{
                            width: `${scrollProgress}%`,
                            background: 'linear-gradient(90deg, #3a86ff 0%, #6366f1 50%, #8b5cf6 100%)'
                        }}
                    >
                    </div>
                    
                    {/* Timeline Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-20">
                        {/* Step 1 */}
                        <div className={`relative transition-all duration-700 ${scrollProgress >= 5 ? 'opacity-100 transform translate-y-0' : 'opacity-70 transform translate-y-4'}`}>
                            {/* Card */}
                            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 relative group mt-16">
                                <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-[#3a86ff] to-indigo-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-xl"></div>
                                
                                {/* Step Number */}
                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#0a1e42] to-[#3a86ff] text-white font-bold shadow-xl text-lg">
                                    1
                                </div>
                                
                                <div className="flex flex-col items-center text-center pt-8">
                                    <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3a86ff] group-hover:text-[#0a1e42] transition-colors duration-300">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                    </div>
                                    <h3 className="text-[#0a1e42] font-bold mb-3 text-xl">Sign Up</h3>
                                    <p className="text-gray-600 text-base leading-relaxed">Register as an Innovator</p>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className={`relative transition-all duration-700 delay-150 ${scrollProgress >= 20 ? 'opacity-100 transform translate-y-0' : 'opacity-70 transform translate-y-4'}`}>
                            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 relative group mt-16">
                                <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-[#3a86ff] to-indigo-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-xl"></div>
                                
                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#0a1e42] to-[#3a86ff] text-white font-bold shadow-xl text-lg">
                                    2
                                </div>
                                
                                <div className="flex flex-col items-center text-center pt-8">
                                    <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3a86ff] group-hover:text-[#0a1e42] transition-colors duration-300">
                                            <circle cx="12" cy="12" r="3"/>
                                            <path d="M12 1v6m0 6v6"/>
                                            <path d="m15.5 3.5-3 3 3 3"/>
                                            <path d="m20.5 8.5-3 3 3 3"/>
                                            <path d="m8.5 3.5 3 3-3 3"/>
                                            <path d="m3.5 8.5 3 3-3 3"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-[#0a1e42] font-bold mb-3 text-xl">Join</h3>
                                    <p className="text-gray-600 text-base leading-relaxed">Start with an Idea Board to design ODR</p>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className={`relative transition-all duration-700 delay-300 ${scrollProgress >= 40 ? 'opacity-100 transform translate-y-0' : 'opacity-70 transform translate-y-4'}`}>
                            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 relative group mt-16">
                                <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-[#3a86ff] to-indigo-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-xl"></div>
                                
                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#0a1e42] to-[#3a86ff] text-white font-bold shadow-xl text-lg">
                                    3
                                </div>
                                
                                <div className="flex flex-col items-center text-center pt-8">
                                    <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3a86ff] group-hover:text-[#0a1e42] transition-colors duration-300">
                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                            <path d="M13 8H7"/>
                                            <path d="M17 12H7"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-[#0a1e42] font-bold mb-3 text-xl">Discuss</h3>
                                    <p className="text-gray-600 text-base leading-relaxed">Deliberate and exchange ideas in the ODR lab</p>
                                </div>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className={`relative transition-all duration-700 delay-500 ${scrollProgress >= 60 ? 'opacity-100 transform translate-y-0' : 'opacity-70 transform translate-y-4'}`}>
                            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 relative group mt-16">
                                <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-[#3a86ff] to-indigo-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-xl"></div>
                                
                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#0a1e42] to-[#3a86ff] text-white font-bold shadow-xl text-lg">
                                    4
                                </div>
                                
                                <div className="flex flex-col items-center text-center pt-8">
                                    <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3a86ff] group-hover:text-[#0a1e42] transition-colors duration-300">
                                            <circle cx="12" cy="12" r="10"/>
                                            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                                            <path d="M2 12h20"/>
                                            <path d="M12 2a14.5 14.5 0 0 1 0 20"/>
                                            <circle cx="8" cy="8" r="1"/>
                                            <circle cx="16" cy="8" r="1"/>
                                            <circle cx="8" cy="16" r="1"/>
                                            <circle cx="16" cy="16" r="1"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-[#0a1e42] font-bold mb-3 text-xl">Connect</h3>
                                    <p className="text-gray-600 text-base leading-relaxed">Engage with mentors and the AI chatbot</p>
                                </div>
                            </div>
                        </div>

                        {/* Step 5 */}
                        <div className={`relative transition-all duration-700 delay-700 ${scrollProgress >= 80 ? 'opacity-100 transform translate-y-0' : 'opacity-70 transform translate-y-4'}`}>
                            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 relative group mt-16">
                                <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-[#3a86ff] to-indigo-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-xl"></div>
                                
                                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#0a1e42] to-[#3a86ff] text-white font-bold shadow-xl text-lg">
                                    5
                                </div>
                                
                                <div className="flex flex-col items-center text-center pt-8">
                                    <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3a86ff] group-hover:text-[#0a1e42] transition-colors duration-300">
                                            <path d="M9 12l2 2 4-4"/>
                                            <path d="M21 12c.552 0 1-.448 1-1V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6c0 .552.448 1 1 1"/>
                                            <path d="M3 12v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                            <circle cx="12" cy="8" r="2"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-[#0a1e42] font-bold mb-3 text-xl">Reflect</h3>
                                    <p className="text-gray-600 text-base leading-relaxed">Collaboratively develop Impactful ODR Systems</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-16">
                    <Button className="bg-[#0a1e42] hover:bg-[#152a4e] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-8 py-3 text-lg">
                        Get Started Now
                    </Button>
                </div>

                {/* Enhanced CSS for dramatic timeline animations */}
                <style jsx>{`
                    @keyframes shimmer {
                        0% {
                            transform: translateX(-100%) skewX(-12deg);
                        }
                        100% {
                            transform: translateX(200%) skewX(-12deg);
                        }
                    }
                    
                    .animate-shimmer {
                        animation: shimmer 3s ease-in-out infinite;
                    }
                    
                    @keyframes ping {
                        0% {
                            transform: scale(1);
                            opacity: 1;
                        }
                        75%, 100% {
                            transform: scale(2);
                            opacity: 0;
                        }
                    }
                `}</style>
            </div>
        </section>
    );
};

export default HowToCard;