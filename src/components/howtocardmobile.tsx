import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";

const HowToCardMobile: React.FC = () => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;

            const scrollTop = window.scrollY;
            const elementRect = sectionRef.current.getBoundingClientRect();
            const elementBottom = scrollTop + (elementRect.bottom / 4);
            
            const progress = Math.min(100, Math.max(0, (scrollTop / elementBottom) * 100));
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const steps = [
        {
            number: 1,
            title: "Sign Up",
            description: "Register as an Innovator",
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            )
        },
        {
            number: 2,
            title: "Join",
            description: "Start with an Idea Board to design ODR",
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1v6m0 6v6"/>
                    <path d="m15.5 3.5-3 3 3 3"/>
                    <path d="m20.5 8.5-3 3 3 3"/>
                    <path d="m8.5 3.5 3 3-3 3"/>
                    <path d="m3.5 8.5 3 3-3 3"/>
                </svg>
            )
        },
        {
            number: 3,
            title: "Discuss",
            description: "Deliberate and exchange ideas in the ODR Lab",
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    <path d="M13 8H7"/>
                    <path d="M17 12H7"/>
                </svg>
            )
        },
        {
            number: 4,
            title: "Connect",
            description: "Engage with mentors and the AI chatbot",
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                    <path d="M2 12h20"/>
                    <path d="M12 2a14.5 14.5 0 0 1 0 20"/>
                    <circle cx="8" cy="8" r="1"/>
                    <circle cx="16" cy="8" r="1"/>
                    <circle cx="8" cy="16" r="1"/>
                    <circle cx="16" cy="16" r="1"/>
                </svg>
            )
        },
        {
            number: 5,
            title: "Reflect",
            description: "Collaboratively develop Impactful ODR Systems",
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12l2 2 4-4"/>
                    <path d="M21 12c.552 0 1-.448 1-1V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6c0 .552.448 1 1 1"/>
                    <path d="M3 12v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <circle cx="12" cy="8" r="2"/>
                </svg>
            )
        }
    ];

    return (
        <section ref={sectionRef} className="py-12 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-[#0a1e42] mb-3 sm:text-4xl">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0a1e42] to-[#3a86ff]">
                            How to use ODR LAB
                        </span>
                    </h2>
                    <p className="text-gray-600 max-w-xl mx-auto text-base sm:text-lg">
                        Follow these simple steps to get started with our collaborative platform
                    </p>
                    <div className="mt-4 mx-auto w-20 h-1 bg-gradient-to-r from-[#3a86ff] to-indigo-600 rounded-full"></div>
                </div>

                {/* Mobile Timeline - Vertical Layout */}
                <div className="relative max-w-md mx-auto">
                    {/* Vertical Timeline Line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 rounded-full"></div>
                    
                    {/* Progress Line */}
                    <div 
                        className="absolute left-8 top-0 w-0.5 rounded-full transition-all duration-300 ease-out z-10"
                        style={{
                            height: `${Math.min(scrollProgress * 2, 100)}%`,
                            background: 'linear-gradient(180deg, #3a86ff 0%, #6366f1 50%, #8b5cf6 100%)'
                        }}
                    />

                    {/* Steps */}
                    <div className="space-y-6 ">
                        {steps.map((step, index) => (
                            <div 
                                key={step.number}
                                className={`relative flex items-start transition-all duration-700 ${
                                    scrollProgress >= (index + 1) * 15 
                                        ? 'opacity-100 transform translate-x-0' 
                                        : 'opacity-70 transform translate-x-4'
                                }`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                {/* Step Number Circle */}
                                <div className="relative z-20 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#0a1e42] to-[#3a86ff] text-white font-bold shadow-lg text-lg border-4 border-white">
                                    {step.number}
                                    {/* Pulse animation for active step */}
                                    {scrollProgress >= (index + 1) * 15 && (
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#0a1e42] to-[#3a86ff] animate-ping opacity-20"></div>
                                    )}
                                </div>

                                {/* Step Content Card */}
                                <div className="ml-4 flex-1 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border border-gray-100">
                                    <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#3a86ff] to-indigo-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-xl"></div>
                                    
                                    <div className="flex items-start space-x-3">
                                        {/* Icon */}
                                        <div className="flex-shrink-0 p-2.5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
                                            <div className="text-[#3a86ff] group-hover:text-[#0a1e42] transition-colors duration-300">
                                                {step.icon}
                                            </div>
                                        </div>
                                        
                                        {/* Content */}
                                        <div className="flex-1">
                                            <h3 className="text-[#0a1e42] font-bold text-lg mb-1 sm:text-xl">
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm leading-relaxed sm:text-base">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Button */}
                <div className="text-center mt-12">
                    <Button className="bg-[#0a1e42] hover:bg-[#152a4e] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-8 py-3 text-base w-full sm:w-auto sm:text-lg"
                    onClick={() => window.location.href = '/submit-idea'}
                    >
                        Get Started Now
                    </Button>
                </div>

                {/* Mobile-specific CSS animations */}
                <style jsx>{`
                    @keyframes pulse {
                        0%, 100% {
                            opacity: 1;
                        }
                        50% {
                            opacity: 0.5;
                        }
                    }
                    
                    @keyframes slideIn {
                        from {
                            transform: translateX(20px);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                    
                    .animate-pulse {
                        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                    }
                    
                    .animate-slide-in {
                        animation: slideIn 0.5s ease-out forwards;
                    }
                `}</style>
            </div>
        </section>
    );
};

export default HowToCardMobile;
