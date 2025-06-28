import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, User, Lightbulb, Users, Shield } from "lucide-react";

const faqCategories = {
	"getting-started": {
		title: "Getting Started",
		icon: <User className="h-5 w-5" />,
		questions: [
			{
				question: "What is ODRLab.com?",
				answer: "ODRLab.com is a digital platform where legal-tech enthusiasts can collaborate to design and build Online Dispute Resolution (ODR) systems. It brings together legal professionals, technologists, students, educators, and institutions to co-create accessible, tech-driven solutions.",
			},
			{
				question: "Who can join ODRLab?",
				answer: "Anyone interested in legal tech innovation and dispute resolution, including: Law and tech students, Faculty and researchers, Legal professionals and mediators, Developers and designers, ODR and conflict resolution experts.",
			},
			{
				question: "What can I do on ODRLab.com?",
				answer: "You can share and collaborate on ideas via the Idea Board, join workshops, discussions, and mentorship sessions, access ODR tools, research, and resources, co-design and test prototypes, and compare existing ODR systems.",
			},
			{
				question: "Is there a participation fee?",
				answer: "No, ODRLab is free for all users.",
			}
		]
	},
	"idea-board": {
		title: "Idea Board & Projects",
		icon: <Lightbulb className="h-5 w-5" />,
		questions: [
			{
				question: "What is the Idea Board on the ODRLab?",
				answer: "A digital space where registered users can propose, post, and collaborate on designing and developing ODR-related ideas and innovations. The Idea Board allows users to share their ideas, which others can join and contribute to.",
			},
			{
				question: "What happens after an idea is submitted on the Idea Board?",
				answer: "Ideas are reviewed by ODRLab Ambassadors and published with credit to the innovator on the ODRLab.",
			},
			{
				question: "What happens once my idea is published?",
				answer: "Other users interested in your idea can join the discussion. You can collaborate, create a discussion thread, and get guidance from mentors or the Curio chatbot.",
			},
			{
				question: "How can I get guidance for developing my idea submitted on the Idea Board?",
				answer: "You can connect to any of the mentors or, for instant assistance, ask our AI Agent Curio—our chatbot.",
			},
			{
				question: "Is there a time limit to complete an idea?",
				answer: "Yes, all projects must be completed within 6 months of initiation.",
			}
		]
	},
	"collaboration": {
		title: "Collaboration & Mentorship",
		icon: <Users className="h-5 w-5" />,
		questions: [
			{
				question: "Who can be a mentor?",
				answer: "Experienced professionals in law, tech, mediation, education, or policy who are willing to mentor on a pro bono basis. Register on the platform and choose 'Mentor' as your role. Your application will be reviewed and accepted by the ODRLab Team.",
			},
			{
				question: "What is a mentor's role?",
				answer: "Mentors support innovators by guiding idea development, providing feedback, sharing resources and networks, and promoting ethical, practical solutions.",
			},
			{
				question: "What do innovators and collaborators gain by using ODRLab?",
				answer: "Practical experience in legal-tech innovation, global collaboration opportunities, mentorship from industry leaders, and skills in law, technology, and design thinking.",
			},
			{
				question: "Can teachers/faculty use ODRLab for teaching?",
				answer: "Yes. Faculty can integrate ODRLab for experiential learning and register themselves and their students for collaborative projects.",
			},
			{
				question: "How can I become a student ambassador?",
				answer: "If you'd like to represent ODRLab at your institution or country, email us at contact@odrlab.com.",
			}
		]
	},
	"policies": {
		title: "Policies & Rights",
		icon: <Shield className="h-5 w-5" />,
		questions: [
			{
				question: "Who owns the idea submitted on the Idea Board and developed into an ODR system?",
				answer: "Innovators and collaborators retain full Intellectual Property (IP) rights. Co-development agreements may apply for collaborative projects.",
			}
		]
	}
};

export function FAQ() {
	const [activeTab, setActiveTab] = useState("getting-started");
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const toggleFAQ = (index: number) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	const currentCategory = faqCategories[activeTab as keyof typeof faqCategories];

	return (
		<section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
			<div className="container mx-auto px-6">
				<div className="mb-16 text-center">
					<div className="mb-6 flex justify-center">
						<div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
							<HelpCircle className="h-12 w-12 text-[#3a86ff]" />
						</div>
					</div>
					<h2 className="mb-4 text-4xl font-extrabold tracking-tight text-[#0a1e42] md:text-5xl">
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0a1e42] to-[#3a86ff]">
							Frequently Asked Questions
						</span>
					</h2>
					<p className="mx-auto max-w-[700px] text-lg text-gray-600">
						Find answers to common questions about ODRLab and how to get started
					</p>
					<div className="mt-6 mx-auto w-24 h-1 bg-gradient-to-r from-[#3a86ff] to-indigo-600 rounded-full"></div>
				</div>

				{/* Category Tabs */}
				<div className="max-w-4xl mx-auto mb-8">
					<div className="flex flex-wrap justify-center gap-2 bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-lg">
						{Object.entries(faqCategories).map(([key, category]) => (
							<button
								key={key}
								onClick={() => {
									setActiveTab(key);
									setOpenIndex(null);
								}}
								className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
									activeTab === key
										? 'bg-gradient-to-r from-[#3a86ff] to-indigo-600 text-white shadow-lg'
										: 'text-gray-600 hover:text-[#3a86ff] hover:bg-blue-50'
								}`}
							>
								<span className={`${activeTab === key ? 'text-white' : 'text-[#3a86ff]'}`}>
									{category.icon}
								</span>
								<span className="text-sm">{category.title}</span>
							</button>
						))}
					</div>
				</div>

				{/* FAQ Items for Active Category */}
				<div className="max-w-4xl mx-auto space-y-4">
					{currentCategory.questions.map((faq, index) => (
						<div
							key={index}
							className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
						>
							<button
								onClick={() => toggleFAQ(index)}
								className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group"
							>
								<div className="flex items-center space-x-4">
									<div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#3a86ff] to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
										{index + 1}
									</div>
									<h3 className="text-lg font-semibold text-[#0a1e42] group-hover:text-[#3a86ff] transition-colors duration-300">
										{faq.question}
									</h3>
								</div>
								<div className="flex-shrink-0 ml-4">
									{openIndex === index ? (
										<ChevronUp className="h-6 w-6 text-[#3a86ff] transition-transform duration-300" />
									) : (
										<ChevronDown className="h-6 w-6 text-gray-400 group-hover:text-[#3a86ff] transition-colors duration-300" />
									)}
								</div>
							</button>

							<div
								className={`overflow-hidden transition-all duration-300 ease-in-out ${
									openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
								}`}
							>
								<div className="px-8 pb-6">
									<div className="pl-12 pr-10">
										<div className="h-px bg-gradient-to-r from-[#3a86ff]/20 to-indigo-600/20 mb-4"></div>
										<p className="text-gray-600 leading-relaxed">
											{faq.answer}
										</p>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				<div className="mt-16 text-center">
					<div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg max-w-2xl mx-auto">
						<h3 className="text-xl font-bold text-[#0a1e42] mb-4">
							Still have questions?
						</h3>
						<p className="text-gray-600 mb-6">
							Can&apos;t find the answer you&apos;re looking for? Feel free to reach out to our support team.
						</p>
						<a
							href="mailto:contact@odrlab.com"
							className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#0a1e42] to-[#3a86ff] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
						>
							Contact Support
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}