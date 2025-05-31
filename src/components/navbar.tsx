"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu } from "lucide-react"
import { useAuth } from "@/lib/auth"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
				title: "ICODR standards",
				href: "https://icodr.org/standards/",
				description:
					"ICODR is an international nonprofit, incorporated in the United States, that drives the development, convergence, and adoption of open standards for the global effort to resolve disputes and conflicts using information and communications technology.",
			},
			{
				title: "Mediate",
				href: "https://odrindia.org/",
				description:
					"ODR India is a community of ODR professionals, practitioners, and enthusiasts in India. It aims to promote the use of ODR in India and provide resources and support for ODR practitioners.",
			},
			{
				title: "ODR Resources",
				href: "https://odr.info/",
				description:
					"Explore a curated list of resources, articles, and tools related to Online Dispute Resolution (ODR).",
			},
			{
				title: "ODR Labs",
				href: "/odrlabs",
				description:
					"ODR Labs is a platform for experimentation and innovation in the field of Online Dispute Resolution (ODR).",
			},
		],
	},
	{
		title: "Mentors",
		href: "/mentors",
	},
	{
		title: "Chatbot",
		href: "/chatbot",
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
		title: "Reflect Results",
		href: "/results",
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
	const [profileDropdown, setProfileDropdown] = useState(false)
	const { user: currentUser, loading, logout, refreshUser } = useAuth()

	// Force refresh user data when component mounts - use useCallback to prevent race conditions
	useEffect(() => {
		refreshUser();
	}, [refreshUser]); // Add refreshUser as dependency since it's from context and should be stable
	
	// Handle user logout
	const handleLogout = () => {
		logout()
		setProfileDropdown(false)
	}

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				activeDropdown &&
				dropdownRefs.current[activeDropdown] &&
				!dropdownRefs.current[activeDropdown]?.contains(event.target as Node)
			) {
				setActiveDropdown(null)
			}

			// Close language dropdown when clicking outside
			const langButton = document.getElementById("language-button")
			const langDropdown = document.getElementById("language-dropdown")
			if (
				languageDropdown &&
				event.target !== langButton &&
				!langDropdown?.contains(event.target as Node)
			) {
				setLanguageDropdown(false)
			}

			// Close profile dropdown when clicking outside
			const profileButton = document.getElementById("profile-button")
			const profileDropdownElement = document.getElementById("profile-dropdown")
			if (
				profileDropdown &&
				event.target !== profileButton &&
				!profileDropdownElement?.contains(event.target as Node)
			) {
				setProfileDropdown(false)
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [activeDropdown, languageDropdown, profileDropdown])

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
								src="/Logobg.svg"
								alt="ODR Logo"
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
											dropdownRefs.current[item.title] = el
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
												className={`ml-1 h-4 w-4 transition-transform ${
													activeDropdown === item.title ? "rotate-180" : ""
												}`}
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
													clipRule="evenodd"
												/>
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
																<div className="font-medium text-[#0a1e42]">
																	{child.title}
																</div>
																<p className="text-sm text-gray-500 line-clamp-2">
																	{child.description}
																</p>
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

					{/* Show either login/signup buttons or user avatar based on auth status */}
					{loading ? (
						<div className="hidden lg:block relative w-9 h-9">
							<div className="animate-pulse h-9 w-9 rounded-full bg-gray-200"></div>
						</div>
					) : currentUser ? (
						<div className="hidden lg:block relative">
							<button
								id="profile-button"
								onClick={() => setProfileDropdown(!profileDropdown)}
								className="flex items-center gap-2 rounded-full focus:outline-none transition-transform hover:scale-105"
								aria-label="User menu"
								aria-expanded={profileDropdown}
							>
								<Avatar
									className={`h-9 w-9 border-2 ${
										profileDropdown ? "border-[#29487e]" : "border-white"
									} transition-colors`}
								>
									<AvatarImage
										src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
											currentUser.name
										)}`}
										alt={currentUser.name}
									/>
									<AvatarFallback className="bg-[#0a1e42] text-white">
										{currentUser.name?.charAt(0).toUpperCase() || "U"}
									</AvatarFallback>
								</Avatar>
								<svg
									className={`h-4 w-4 text-gray-500 transition-transform ${
										profileDropdown ? "rotate-180" : ""
									}`}
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
										clipRule="evenodd"
									/>
								</svg>
							</button>

							{profileDropdown && (
								<div
									id="profile-dropdown"
									className="absolute right-0 top-full z-10 mt-2 min-w-[200px] origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
								>
									<div className="border-b border-gray-100 px-4 py-3">
										<p className="text-sm font-medium text-gray-900">
											{currentUser.name}
										</p>
										<p className="truncate text-xs text-gray-500">
											{currentUser.email}
										</p>
									</div>

									<Link
										href="/profile"
										onClick={() => setProfileDropdown(false)}
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
									>
										Your Profile
									</Link>

									{currentUser.userRole === "ADMIN" && (
										<Link
											href="/admin/idea-approval"
											onClick={() => setProfileDropdown(false)}
											className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										>
											Admin Dashboard
										</Link>
									)}

									<Link
										href="/submit-idea"
										onClick={() => setProfileDropdown(false)}
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
									>
										Submit an Idea
									</Link>

									<button
										onClick={handleLogout}
										className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
									>
										Sign out
									</button>
								</div>
							)}
						</div>
					) : (
						<>
							{/* Login Button */}
							<Link href="/signin" className="hidden lg:block">
								<button className="flex h-8 items-center justify-center rounded-md bg-[#0a1e42] px-4 text-sm font-medium text-white hover:bg-[#29487e]">
									Sign in
								</button>
							</Link>
							{/* Signup Button */}
							<Link href="/signup" className="hidden lg:block">
								<button className="flex h-8 items-center justify-center rounded-md bg-[#0a1e42] px-4 text-sm font-medium text-white hover:bg-[#29487e]">
									Sign Up
								</button>
							</Link>
						</>
					)}

					{/* Mobile Menu Toggle */}
					<Sheet open={isOpen} onOpenChange={setIsOpen}>
						<SheetTrigger asChild>
							<Button variant="ghost" size="sm" className="h-8 w-8 p-0 lg:hidden">
								<Menu className="h-5 w-5" />
								<span className="sr-only">Toggle menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-[300px] sm:w-[400px]">
							<div className="flex flex-col gap-6 py-4 ml-2">
								<div className="flex items-center justify-between">
									<Link
										href="/"
										className="flex items-center space-x-2"
										onClick={() => setIsOpen(false)}
									>
										<div className="relative h-8 w-32">
											<Image
												src="/Logobg.svg"
												alt="ODR Logo"
												fill
												className="object-contain"
											/>
										</div>
									</Link>
									{/*  Button to close the menu not required though. */}
									{/* <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close menu</span>
                  </Button> */}
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
									{loading ? (
										<div className="flex items-center gap-3">
											<div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
											<div className="space-y-2">
												<div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
												<div className="h-3 w-32 bg-gray-200 animate-pulse rounded"></div>
											</div>
										</div>
									) : currentUser ? (
										<div className="space-y-3">
											<div className="flex items-center gap-3">
												<Avatar className="h-10 w-10 border-2 border-[#0a1e42]">
													<AvatarImage
														src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
															currentUser.name
														)}`}
														alt={currentUser.name}
													/>
													<AvatarFallback className="bg-[#0a1e42] text-white">
														{currentUser.name?.charAt(0).toUpperCase() || "U"}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className="font-medium text-gray-900">
														{currentUser.name}
													</p>
													<p className="text-xs text-gray-500">
														{currentUser.email}
													</p>
												</div>
											</div>

											<div className="space-y-1 mt-2 border-t pt-2">
												<Link href="/profile" onClick={() => setIsOpen(false)}>
													<button className="flex w-full items-center rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100">
														Your Profile
													</button>
												</Link>

												{currentUser.userRole === "ADMIN" && (
													<Link
														href="/admin/idea-approval"
														onClick={() => setIsOpen(false)}
													>
														<button className="flex w-full items-center rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100">
															Admin Dashboard
														</button>
													</Link>
												)}

												<Link href="/submit-idea" onClick={() => setIsOpen(false)}>
													<button className="flex w-full items-center rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100">
														Submit an Idea
													</button>
												</Link>

												<button
													onClick={() => {
														handleLogout()
														setIsOpen(false)
													}}
													className="flex w-full items-center rounded-md px-2 py-1.5 text-sm text-red-600 hover:bg-gray-100"
												>
													Sign out
												</button>
											</div>
										</div>
									) : (
										<>
											<Link href="/signin" onClick={() => setIsOpen(false)}>
												<button className="flex h-8 items-center justify-center rounded-md bg-[#0a1e42] px-4 text-sm font-medium text-white hover:bg-[#29487e]">
													Sign In
												</button>
											</Link>
											<Link href="/signup" onClick={() => setIsOpen(false)}>
												<button className="flex h-8 items-center justify-center rounded-md bg-[#0a1e42] px-4 text-sm font-medium text-white hover:bg-[#29487e]">
													Sign Up
												</button>
											</Link>
										</>
									)}
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	)
}
