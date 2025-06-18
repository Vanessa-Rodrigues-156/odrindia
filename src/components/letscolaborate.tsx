import React from "react";    
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Globe, Scale, Award, BarChart, BookOpen, PieChart} from "lucide-react";  

export function LetsCollaborate() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-6">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-[#0a1e42] md:text-5xl">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-blue-900">
          LET&apos;S COLLABORATE FOR
        </span>
        </h2>
        <p className="mx-auto max-w-[700px] text-lg text-gray-600">
        Innovative solutions advancing the future of dispute resolution
        </p>
        <div className="mt-6 mx-auto w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
      </div>

      <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {[
        {
          icon: <MessageSquare className="h-7 w-7" />,
          title: "Designing Dispute Resolution Systems",
          subtitle: "Custom solutions for complex dispute scenarios",
          description: "Design comprehensive dispute resolution systems tailored to specific industries, integrating advanced technology with human expertise"
        },
        {
          icon: <Globe className="h-7 w-7" />,
          title: "Predictive Justice Technologies",
          subtitle: "AI-powered solutions for better outcomes",
          description: "Develop predictive outcome platforms and analyze case patterns using advanced algorithms, enabling parties to make informed decisions"
        },
        {
          icon: <Scale className="h-7 w-7" />,
          title: "Legal Tech Solutions for Court Integration",
          subtitle: "Bridging traditional and digital justice",
          description: "Develop seamless interfaces between conventional court systems and modern ODR platforms to enhance judicial efficiency"
        },
        {
          icon: <BarChart className="h-7 w-7" />,
          title: "Automated Mediation Platforms",
          subtitle: "AI-assisted conflict resolution",
          description: "Design an automated mediation platform enabling efficient dispute resolution through smart suggestions and seamless dialogue"
        },
        {
          icon: <Scale className="h-7 w-7" />,
          title: "Online Arbitration Processes",
          subtitle: "Customized digital arbitration solutions",
          description: "Develop specialized arbitration workflows tailored to specific dispute types, industries, and regulatory requirements"
        },
        {
          icon: <Award className="h-7 w-7" />,
          title: "Personalized Resolution Pathways",
          subtitle: "Tailored experiences for unique needs",
          description: "Customized resolution journeys based on the unique characteristics of disputes and the preferences of the parties involved"
        },
        {
          icon: <Globe className="h-7 w-7" />,
          title: "Multilingual Dispute Resolution",
          subtitle: "Breaking language barriers in ODR",
          description: "Design inclusive platforms that support multiple languages to facilitate cross-border and cross-cultural dispute resolution"
        },
        {
          icon: <BookOpen className="h-7 w-7" />,
          title: "ODR Research",
          subtitle: "Expanding knowledge frontiers",
          description: "Conduct ODR research from a multidisciplinary perspective, providing a strong foundation for the development of ODR systems"
        },
        {
          icon: <PieChart className="h-7 w-7" />,
          title: "Impact Assessment Studies",
          subtitle: "Measuring ODR effectiveness",
          description: "Conduct empirical research involving stakeholders to improve current platforms and provide valuable insights for future systems"
        }
        ].map((item, index) => (
          <>
          <Card key={index} className="border-none transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white/80 backdrop-blur-sm overflow-hidden group">
            <CardHeader className="pb-2 pt-6 relative">
            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-indigo-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <div className="mb-4 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 p-3 w-fit group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-300">
              <div className="text-blue-600 group-hover:text-indigo-700 transition-colors duration-300">
              {item.icon}
              </div>
            </div>
            <CardTitle className="text-xl text-[#0a1e42] font-bold group-hover:text-blue-700 transition-colors duration-300">{item.title}</CardTitle>
            <CardDescription className="text-indigo-600 font-medium">{item.subtitle}</CardDescription>
            </CardHeader>
            <CardContent className="pt-2 pb-6">
            <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
              {item.description}
            </p>
            </CardContent>
          </Card>
         </>
        ))}
      </div>
      </div>
    </section>
  );
}