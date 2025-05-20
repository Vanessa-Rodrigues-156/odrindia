import React from "react";    
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Globe, Scale, Award, BarChart} from "lucide-react";  

export function LetsCollaborate() {
  return (
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
                   Design comprehensive dispute resolution systems tailored to specific industries, integrating advanced technology with human expertise 
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
                   Develop predictive outcome platforms and analyze case patterns using advanced algorithms, enabling parties to make informed decisions about their future course of action
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
                   Develop seamless interfaces between conventional court systems and modern ODR platforms to enhance judicial efficiency.
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
                    Design an automated mediation platform enabling efficient dispute resolution through smart suggestions and seamless dialogue.
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
                   Develop specialized arbitration workflows tailored to specific dispute types, industries, and regulatory requirements
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
                    Customized resolution journeys based on the unique characteristics of disputes and the preferences of the parties involved."
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
               <Card className="border-2 border-transparent transition-all hover:border-[#0a1e42]/10 hover:shadow-lg">
                <CardHeader className="pb-2">
                  <div className="mb-2 rounded-full bg-[#0a1e42]/10 p-2 w-fit">
                    <Globe className="h-6 w-6 text-[#0a1e42]" />
                  </div>
                  <CardTitle className="text-[#0a1e42]">ODR Research </CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Conduct ODR research from a multidisciplinary perspective, providing a strong foundation for the development of ODR systems
                  </p>
                </CardContent>
              </Card>

        
               <Card className="border-2 border-transparent transition-all hover:border-[#0a1e42]/10 hover:shadow-lg">
                <CardHeader className="pb-2">
                  <div className="mb-2 rounded-full bg-[#0a1e42]/10 p-2 w-fit">
                    <Globe className="h-6 w-6 text-[#0a1e42]" />
                  </div>
                  <CardTitle className="text-[#0a1e42]">Impact Assessment Studies  </CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Conduct impact assessment studies on existing ODR systems through empirical research involving stakeholders to both improve current platforms and provide valuable insights for the development of future systems
                  </p>
                </CardContent>
              </Card>

              
            </div>
          </div>
        </section>
  );
}