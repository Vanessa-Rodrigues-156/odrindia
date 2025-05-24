'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';

const userTypes = [
	{ value: 'student', label: 'Student' },
	{ value: 'faculty', label: 'Faculty' },
	{ value: 'tech', label: 'Tech Enthusiast' },
	{ value: 'law', label: 'Law Enthusiast' },
	{ value: 'other', label: 'Other' },
];

const facultyRoles = [
	'Full time Faculty',
	'Practice Professor',
	'Adhoc Faculty',
	'Guest Faculty',
];

const initialForm = {
	name: '',
	email: '',
	password: '',
	confirmPassword: '',
	mobile: '',
	city: '',
	country: '',
	userType: '',
	// Student
	highestEducation: '',
	studentInstitute: '',
	courseStatus: '',
	courseName: '',
	odrLabPurpose: '',
	// Faculty
	facultyInstitute: '',
	facultyRole: '',
	facultyExpertise: '',
	facultyCourse: '',
	facultyMentor: '',
	// Tech Enthusiast
	techOrg: '',
	techRole: '',
	// Law Enthusiast
	lawFirm: '',
	// Other
	otherRole: '',
	otherWorkplace: '',
};

const steps = [
	'Basic Info',
	'User Type',
	'Details',
	'Review',
];

const SignUpPage = () => {
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [step, setStep] = useState(0);
	const [form, setForm] = useState(initialForm);
	const router = useRouter();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		const target = e.target;
		const name = target.name;
		let value: string | boolean = target.value;
		if (target instanceof HTMLInputElement && (target.type === 'checkbox' || target.type === 'radio')) {
			value = target.checked ? target.value : '';
		}
		setForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleNext = () => {
		setError(null);
		// Basic validation for each step
		if (step === 0) {
			if (!form.name || !form.email || !form.mobile || !form.city || !form.country || !form.password || !form.confirmPassword) {
				setError('Please fill all required fields.');
				return;
			}
			if (form.password !== form.confirmPassword) {
				setError("Passwords don't match");
				return;
			}
		}
		if (step === 1) {
			if (!form.userType) {
				setError('Please select your type.');
				return;
			}
		}
		if (step === 2) {
			// Per userType validation
			if (form.userType === 'student') {
				if (!form.highestEducation || !form.studentInstitute || !form.courseStatus || !form.courseName) {
					setError('Please fill all required student fields.');
					return;
				}
			}
			if (form.userType === 'faculty') {
				if (!form.facultyInstitute || !form.facultyRole || !form.facultyExpertise || !form.facultyCourse || !form.facultyMentor) {
					setError('Please fill all required faculty fields.');
					return;
				}
			}
			if (form.userType === 'tech') {
				if (!form.techOrg || !form.techRole) {
					setError('Please fill all required tech enthusiast fields.');
					return;
				}
			}
			if (form.userType === 'law') {
				if (!form.lawFirm) {
					setError('Please fill all required law enthusiast fields.');
					return;
				}
			}
			if (form.userType === 'other') {
				if (!form.otherRole || !form.otherWorkplace) {
					setError('Please fill all required fields for Other.');
					return;
				}
			}
		}
		setStep((s) => s + 1);
	};

	const handleBack = () => {
		setError(null);
		setStep((s) => s - 1);
	};

	const handleSignUp = async (event: React.FormEvent) => {
		event.preventDefault();
		setError(null);
		setSuccess(null);
		setLoading(true);
		// No backend changes yet, just UI
		setTimeout(() => {
			setSuccess('Account created successfully! (UI only)');
			setLoading(false);
		}, 1200);
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
			<div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-sm transition-all">
				<h1 className="text-xl md:text-2xl font-bold mb-6 text-center text-[#0a1e42]">Create an Account</h1>
				
				{/* Step indicators */}
				<div className="mb-8">
					<div className="flex justify-between relative">
						{steps.map((s, i) => (
							<div key={s} className="flex flex-col items-center">
								<div 
									className={`h-8 w-8 rounded-full flex items-center justify-center text-sm mb-1 
									${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-[#0a1e42] text-white' : 'bg-gray-200 text-gray-600'}`}
								>
									{i < step ? '✓' : i + 1}
								</div>
								<span className={`text-xs hidden sm:block ${i === step ? 'text-[#0a1e42] font-medium' : 'text-gray-500'}`}>{s}</span>
							</div>
						))}
						
						{/* Progress line */}
						<div className="absolute h-[2px] bg-gray-200 top-[29px] left-0 right-0 -z-10 mx-12 sm:mx-16 md:mx-20">
							<div 
								className="h-full bg-[#0a1e42] transition-all duration-300" 
								style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
							></div>
						</div>
					</div>
				</div>
				
				{error && (
					<Alert variant="destructive" className="mb-4 animate-in fade-in-50 duration-300">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}
				{success && (
					<Alert className="mb-4 bg-green-50 border-green-500 text-green-700 animate-in fade-in-50 duration-300">
						<AlertDescription>{success}</AlertDescription>
					</Alert>
				)}
				
				<form onSubmit={handleSignUp} className="flex flex-col gap-4">
					{step === 0 && (
						<motion.div 
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
							className="space-y-4"
						>
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
								<Input id="name" name="name" value={form.name} onChange={handleChange} type="text" placeholder="Enter your full name" required className="h-10" />
							</div>
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="email" className="text-sm font-medium">Email</Label>
								<Input id="email" name="email" value={form.email} onChange={handleChange} type="email" placeholder="Enter your email" required className="h-10" />
							</div>
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="mobile" className="text-sm font-medium">Mobile</Label>
								<Input id="mobile" name="mobile" value={form.mobile} onChange={handleChange} type="tel" placeholder="Enter your mobile number" required className="h-10" />
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="flex flex-col gap-1.5">
									<Label htmlFor="city" className="text-sm font-medium">City</Label>
									<Input id="city" name="city" value={form.city} onChange={handleChange} type="text" placeholder="City" required className="h-10" />
								</div>
								<div className="flex flex-col gap-1.5">
									<Label htmlFor="country" className="text-sm font-medium">Country</Label>
									<Input id="country" name="country" value={form.country} onChange={handleChange} type="text" placeholder="Country" required className="h-10" />
								</div>
							</div>
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="password" className="text-sm font-medium">Password</Label>
								<Input id="password" name="password" value={form.password} onChange={handleChange} type="password" placeholder="Create a password" required minLength={8} className="h-10" />
							</div>
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
								<Input id="confirmPassword" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} type="password" placeholder="Confirm your password" required className="h-10" />
							</div>
						</motion.div>
					)}
					{step === 1 && (
						<motion.div 
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
							className="space-y-4"
						>
							<div className="flex flex-col gap-2">
								<Label htmlFor="userType" className="text-sm font-medium">Are you a</Label>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
									{userTypes.map((type) => (
										<label key={type.value} className={`flex items-center border rounded-lg p-3 cursor-pointer transition-colors
											${form.userType === type.value ? 'border-[#0a1e42] bg-[#0a1e42]/5' : 'border-gray-200 hover:border-gray-300'}`}>
											<input 
												type="radio" 
												name="userType" 
												value={type.value} 
												checked={form.userType === type.value} 
												onChange={handleChange} 
												className="sr-only"
											/>
											<div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center
												${form.userType === type.value ? 'border-[#0a1e42]' : 'border-gray-400'}`}>
												{form.userType === type.value && (
													<div className="w-2 h-2 rounded-full bg-[#0a1e42]"></div>
												)}
											</div>
											<span className="text-sm">{type.label}</span>
										</label>
									))}
								</div>
							</div>
						</motion.div>
					)}
					{step === 2 && (
						<motion.div 
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
							className="space-y-4"
						>
							{form.userType === 'student' && (
								<>
									<div className="flex flex-col gap-1.5">
										<Label htmlFor="highestEducation" className="text-sm font-medium">Highest Education</Label>
										<Input id="highestEducation" name="highestEducation" value={form.highestEducation} onChange={handleChange} type="text" required className="h-10" />
									</div>
									<div className="flex flex-col gap-1.5">
										<Label htmlFor="studentInstitute" className="text-sm font-medium">Institute Name</Label>
										<Input id="studentInstitute" name="studentInstitute" value={form.studentInstitute} onChange={handleChange} type="text" required className="h-10" />
									</div>
									<div className="flex flex-col gap-1.5">
										<Label htmlFor="courseName" className="text-sm font-medium">Course Name</Label>
										<Input id="courseName" name="courseName" value={form.courseName} onChange={handleChange} type="text" required className="h-10" />
									</div>
									<div className="flex flex-col gap-1.5">
										<Label className="text-sm font-medium">Course Status</Label>
										<div className="flex gap-6">
											<label className="flex items-center gap-1.5">
												<input type="radio" name="courseStatus" value="Pursued" checked={form.courseStatus === 'Pursued'} onChange={handleChange} required className="w-4 h-4 accent-[#0a1e42]" /> 
												<span className="text-sm">Pursued</span>
											</label>
											<label className="flex items-center gap-1.5">
												<input type="radio" name="courseStatus" value="Pursuing" checked={form.courseStatus === 'Pursuing'} onChange={handleChange} required className="w-4 h-4 accent-[#0a1e42]" /> 
												<span className="text-sm">Pursuing</span>
											</label>
										</div>
									</div>
									<div className="flex flex-col gap-1.5">
										<Label htmlFor="odrLabPurpose" className="text-sm font-medium">What will you be using ODR Lab for?</Label>
										<Textarea id="odrLabPurpose" name="odrLabPurpose" value={form.odrLabPurpose} onChange={handleChange} placeholder="Optional" className="resize-none h-24" />
									</div>
								</>
							)}
							{form.userType === 'faculty' && (
								<>
									<div className="flex flex-col gap-1.5">
										<Label htmlFor="facultyInstitute" className="text-sm font-medium">Name of the Institution Associated With</Label>
										<Input id="facultyInstitute" name="facultyInstitute" value={form.facultyInstitute} onChange={handleChange} type="text" required className="h-10" />
									</div>
									<div className="flex flex-col gap-1.5">
										<Label htmlFor="facultyRole" className="text-sm font-medium">What's your role?</Label>
										<select id="facultyRole" name="facultyRole" value={form.facultyRole} onChange={handleChange} required className="h-10 w-full border rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-[#0a1e42]/20 focus:border-[#0a1e42]">
											<option value="">Select...</option>
											{facultyRoles.map((r) => (
												<option key={r} value={r}>{r}</option>
											))}
										</select>
									</div>
									<div className="flex flex-col gap-1.5">
										<Label htmlFor="facultyExpertise" className="text-sm font-medium">Area of Expertise</Label>
										<Input id="facultyExpertise" name="facultyExpertise" value={form.facultyExpertise} onChange={handleChange} type="text" required className="h-10" />
									</div>
									<div className="flex flex-col gap-1.5">
										<Label htmlFor="facultyCourse" className="text-sm font-medium">For which course would you like to use ODR Lab?</Label>
										<Input id="facultyCourse" name="facultyCourse" value={form.facultyCourse} onChange={handleChange} type="text" required className="h-10" />
									</div>
									<div className="flex flex-col gap-1.5">
										<Label htmlFor="facultyMentor" className="text-sm font-medium">Do you want to join as the mentor?</Label>
										<div className="flex gap-6">
											<label className="flex items-center gap-1.5">
												<input type="radio" name="facultyMentor" value="Yes" checked={form.facultyMentor === 'Yes'} onChange={handleChange} required className="w-4 h-4 accent-[#0a1e42]" /> 
												<span className="text-sm">Yes</span>
											</label>
											<label className="flex items-center gap-1.5">
												<input type="radio" name="facultyMentor" value="No" checked={form.facultyMentor === 'No'} onChange={handleChange} required className="w-4 h-4 accent-[#0a1e42]" /> 
												<span className="text-sm">No</span>
											</label>
										</div>
									</div>
								</>
							)}
							{form.userType === 'tech' && (
								<>
									<div className="flex flex-col gap-1.5">
										<Label htmlFor="techOrg" className="text-sm font-medium">Organisation</Label>
										<Input id="techOrg" name="techOrg" value={form.techOrg} onChange={handleChange} type="text" required className="h-10" />
									</div>
									<div className="flex flex-col gap-1.5">
										<Label htmlFor="techRole" className="text-sm font-medium">Role</Label>
										<Input id="techRole" name="techRole" value={form.techRole} onChange={handleChange} type="text" required className="h-10" />
									</div>
								</>
							)}
							{form.userType === 'law' && (
								<>
									<div className="flex flex-col gap-1.5">
										<Label htmlFor="lawFirm" className="text-sm font-medium">Firm Name</Label>
										<Input id="lawFirm" name="lawFirm" value={form.lawFirm} onChange={handleChange} type="text" required className="h-10" />
									</div>
								</>
							)}
							{form.userType === 'other' && (
								<>
									<div className="flex flex-col gap-1.5">
										<Label htmlFor="otherRole" className="text-sm font-medium">Role</Label>
										<Input id="otherRole" name="otherRole" value={form.otherRole} onChange={handleChange} type="text" required className="h-10" />
									</div>
									<div className="flex flex-col gap-1.5">
										<Label htmlFor="otherWorkplace" className="text-sm font-medium">Workplace</Label>
										<Input id="otherWorkplace" name="otherWorkplace" value={form.otherWorkplace} onChange={handleChange} type="text" required className="h-10" />
									</div>
								</>
							)}
						</motion.div>
					)}
					{step === 3 && (
						<motion.div 
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
							className="space-y-4"
						>
							<div className="font-medium text-[#0a1e42]">Review your details</div>
							<div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
									<div><span className="font-medium">Name:</span> {form.name}</div>
									<div><span className="font-medium">Email:</span> {form.email}</div>
									<div><span className="font-medium">Mobile:</span> {form.mobile}</div>
									<div><span className="font-medium">Location:</span> {form.city}, {form.country}</div>
									<div><span className="font-medium">User Type:</span> {userTypes.find(t => t.value === form.userType)?.label}</div>
								</div>
								
								<div className="pt-2 border-t border-gray-200">
									{form.userType === 'student' && (
										<div className="space-y-1">
											<div><span className="font-medium">Education:</span> {form.highestEducation}</div>
											<div><span className="font-medium">Institute:</span> {form.studentInstitute}</div>
											<div><span className="font-medium">Course:</span> {form.courseName} ({form.courseStatus})</div>
											{form.odrLabPurpose && (
												<div><span className="font-medium">ODR Lab Purpose:</span> {form.odrLabPurpose}</div>
											)}
										</div>
									)}
									{form.userType === 'faculty' && (
										<div className="space-y-1">
											<div><span className="font-medium">Institution:</span> {form.facultyInstitute}</div>
											<div><span className="font-medium">Role:</span> {form.facultyRole}</div>
											<div><span className="font-medium">Expertise:</span> {form.facultyExpertise}</div>
											<div><span className="font-medium">Course for ODR Lab:</span> {form.facultyCourse}</div>
											<div><span className="font-medium">Mentor:</span> {form.facultyMentor}</div>
										</div>
									)}
									{form.userType === 'tech' && (
										<div className="space-y-1">
											<div><span className="font-medium">Organisation:</span> {form.techOrg}</div>
											<div><span className="font-medium">Role:</span> {form.techRole}</div>
										</div>
									)}
									{form.userType === 'law' && (
										<div className="space-y-1">
											<div><span className="font-medium">Firm Name:</span> {form.lawFirm}</div>
										</div>
									)}
									{form.userType === 'other' && (
										<div className="space-y-1">
											<div><span className="font-medium">Role:</span> {form.otherRole}</div>
											<div><span className="font-medium">Workplace:</span> {form.otherWorkplace}</div>
										</div>
									)}
								</div>
							</div>
						</motion.div>
					)}
					<div className="flex gap-3 mt-6 justify-between">
						{step > 0 ? (
							<Button 
								type="button" 
								variant="outline" 
								onClick={handleBack}
								className="min-w-[100px]"
							>
								Back
							</Button>
						) : (
							<div>
							{/* Empty div for spacing */}
							</div>
						)}
						
						{step < steps.length - 1 ? (
							<Button 
								type="button" 
								onClick={handleNext} 
								className="min-w-[100px] bg-[#0a1e42] hover:bg-[#162d5a]"
							>
								Next
							</Button>
						) : (
							<Button 
								type="submit" 
								className="min-w-[100px] bg-[#0a1e42] hover:bg-[#162d5a]" 
								disabled={loading}
							>
								{loading ? 'Signing Up...' : 'Sign Up'}
							</Button>
						)}
					</div>
				</form>
				
				<div className="mt-6 text-center text-sm text-gray-500">
					<span>Already have an account? </span>
					<Link href="/signin" className="text-[#0a1e42] hover:underline font-medium">
						Sign in
					</Link>
				</div>
			</div>
		</div>
	);
};

export default SignUpPage;
