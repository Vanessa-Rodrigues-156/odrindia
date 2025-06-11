"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion"; 
import { useAuth } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const pageTransition = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.3 },
  },
};

// Main user types for initial categorization
const mainUserTypes = [
  { value: "innovator", label: "Student Innovator" },
  { value: "mentor", label: "Mentor" },
  { value: "faculty", label: "Faculty" },
  { value: "other", label: "Other" },
];

// Subtypes for mentors
const mentorTypes = [
  { value: "tech", label: "Technical Enthusiast" },
  { value: "law", label: "Law Enthusiast" },
];

// Legacy userTypes kept for compatibility with backend
const userTypes = [
  { value: "student", label: "Ideator" },
  { value: "faculty", label: "Faculty" },
  { value: "tech", label: "Tech Enthusiast" },
  { value: "law", label: "Law Enthusiast" },
  { value: "other", label: "Other" },
];

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  mobile: "",
  city: "",
  country: "",
  userType: "",
  // Student
  highestEducation: "",
  studentInstitute: "",
  courseStatus: "",
  courseName: "",
  odrLabPurpose: "",
  // Faculty
  facultyInstitute: "",
  facultyRole: "",
  facultyExpertise: "",
  facultyCourse: "",
  facultyMentor: "",
  // Tech Enthusiast
  techOrg: "",
  techRole: "",
  // Law Enthusiast
  lawFirm: "",
  // Other
  mainUserType: "", // For initial selection
  mentorType: "", // For mentor subtype selection
  // Other user types
  otherRole: "",
  otherWorkplace: "",
};

const steps = ["Basic Info", "User Type", "Details", "Review"];

const SignUpPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);
  const router = useRouter();
  const { login, signInWithGoogle } = useAuth();

  useEffect(() => {
    const loadGoogleScript = () => {
      if (typeof window !== 'undefined' && window.google && !googleScriptLoaded) {
        setGoogleScriptLoaded(true);
        
        // Initialize Google Identity Services
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
          callback: handleGoogleCallback,
          auto_select: false,
          cancel_on_tap_outside: true
        });

        // Render the button
        const buttonContainer = document.getElementById("google-signin-container");
        if (buttonContainer) {
          window.google.accounts.id.renderButton(buttonContainer, {
            theme: "outline",
            size: "large",
            width: buttonContainer.offsetWidth,
            text: "signup_with"
          });
        }

        // Optional: Display the One Tap UI
        window.google.accounts.id.prompt();
      }
    };

    // Check if the script is already loaded
    if (typeof window !== 'undefined') {
      if (window.google) {
        loadGoogleScript();
      } else {
        // Script load callback from script element
        window.handleGoogleScriptLoad = loadGoogleScript;
      }
    }
  }, [googleScriptLoaded]);

  // Google Sign-In callback handler
  const handleGoogleCallback = async (response: any) => {
    try {
      setLoading(true);
      setError(null);

      if (!response.credential) {
        throw new Error("No credential returned from Google");
      }

      // Decode the JWT token to get user info
      const payload = parseJwt(response.credential);

      if (!payload || !payload.email) {
        throw new Error("Invalid Google user data");
      }

      const googleUser = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      };

      const result = await signInWithGoogle(googleUser);
      
      if (result.needsProfileCompletion) {
        // Redirect to profile completion page
        const params = new URLSearchParams({
          email: googleUser.email,
          name: googleUser.name,
          image: googleUser.picture || "",
          fromGoogle: "true"
        });
        router.push(`/complete-profile?${params.toString()}`);
      } else {
        // User has complete profile, redirect to home
        router.push("/home");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError(error instanceof Error ? error.message : "Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Parse JWT token
  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Error parsing JWT:", e);
      return null;
    }
  };

  // Handle Google Sign Up - simplified to work with the auto-initialized button
  const handleGoogleSignUp = () => {
    if (typeof window === 'undefined' || !window.google) {
      setError("Google Sign-In is not available. Please try again later or use email signup.");
    }
    // The actual sign-in is handled by the callback configured in initialization
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target;
    const name = target.name;
    let value: string | boolean = target.value;
    if (
      target instanceof HTMLInputElement &&
      (target.type === "checkbox" || target.type === "radio")
    ) {
      value = target.checked ? target.value : "";
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
      if (
        !form.name ||
        !form.email ||
        !form.mobile ||
        !form.city ||
        !form.country ||
        !form.password ||
        !form.confirmPassword
      ) {
        setError("Please fill all required fields.");
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError("Passwords don't match");
        return;
      }
    }
    if (step === 1) {
      if (!form.mainUserType) {
        setError("Please select whether you're a Student Innovator or Mentor.");
        return;
      }
      
      // Set the userType based on mainUserType and mentorType for backend compatibility
      if (form.mainUserType === "innovator") {
        // For student innovators, keep as student
        setForm(prev => ({ ...prev, userType: "student" }));
      } else if (form.mainUserType === "mentor") {
        // For mentors, validate that a mentor type is selected
        if (!form.mentorType) {
          setError("Please select your mentor type.");
          return;
        }
        // Set userType based on mentorType
        setForm(prev => ({ ...prev, userType: prev.mentorType }));
      } else {
        // For faculty and others, use the mainUserType directly
        setForm(prev => ({ ...prev, userType: prev.mainUserType }));
      }
    }
    if (step === 2) {
      // Per userType validation
      if (form.userType === "student") {
        if (
          !form.highestEducation ||
          !form.studentInstitute ||
          !form.courseStatus ||
          !form.courseName
        ) {
          setError("Please fill all required student fields.");
          return;
        }
      }
      if (form.userType === "faculty") {
        if (
          !form.facultyInstitute ||
          !form.facultyRole ||
          !form.facultyExpertise ||
          !form.facultyCourse ||
          !form.facultyMentor
        ) {
          setError("Please fill all required faculty fields.");
          return;
        }
      }
      if (form.userType === "tech") {
        if (!form.techOrg || !form.techRole) {
          setError("Please fill all required tech enthusiast fields.");
          return;
        }
      }
      if (form.userType === "law") {
        if (!form.lawFirm) {
          setError("Please fill all required law enthusiast fields.");
          return;
        }
      }
      if (form.userType === "other") {
        if (!form.otherRole || !form.otherWorkplace) {
          setError("Please fill all required fields for Other.");
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

    // Construct ODR Lab usage string based on user type
    let odrLabUsageDescription = "";

    switch (form.userType) {
      case "student":
        odrLabUsageDescription = `As a student of ${form.courseName} (${
          form.courseStatus
        }) at ${form.studentInstitute}. ${form.odrLabPurpose || ""}`;
        break;
      case "faculty":
        odrLabUsageDescription = `As a ${form.facultyRole} at ${
          form.facultyInstitute
        }, specializing in ${form.facultyExpertise}, teaching ${
          form.facultyCourse
        }. ${form.odrLabPurpose || ""}`;
        break;
      case "tech":
        odrLabUsageDescription = `As a ${form.techRole} at ${form.techOrg}. ${
          form.odrLabPurpose || ""
        }`;
        break;
      case "law":
        odrLabUsageDescription = `As a legal professional at ${form.lawFirm}. ${
          form.odrLabPurpose || ""
        }`;
        break;
      case "other":
        odrLabUsageDescription = `As a ${form.otherRole} at ${
          form.otherWorkplace
        }. ${form.odrLabPurpose || ""}`;
        break;
      default:
        odrLabUsageDescription = form.odrLabPurpose || "";
    }

    try {
      const res = await apiFetch("/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          contactNumber: form.mobile,
          city: form.city,
          country: form.country,
          userRole:
            form.userType === "student"
              ? "INNOVATOR"
              : form.userType === "faculty"
              ? "OTHER"
              : form.userType === "law"
              ? "MENTOR"
              : form.userType === "tech"
              ? "MENTOR"
              : "OTHER",
          institution:
            form.studentInstitute ||
            form.facultyInstitute ||
            form.techOrg ||
            form.lawFirm ||
            form.otherWorkplace ||
            undefined,
          highestEducation: form.highestEducation || undefined,
          odrLabUsage: odrLabUsageDescription,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Registration successful!");
        // Always set token in localStorage for immediate session
        if (data.token) {
          if (typeof window !== "undefined") {
            localStorage.setItem("token", data.token);
          }
        }
        // Always trigger login to update auth context and user state
        if (login && data.token) {
          login(data.user, data.token);
        }
        setTimeout(() => {
          router.push("/home");
        }, 3000);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <motion.div
            key="step0"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={pageTransition}
            className="space-y-6">
            <motion.div variants={fadeInUp}>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Your email address"
                required
              />
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={fadeInUp}>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                name="mobile"
                type="tel"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Your mobile number"
                required
              />
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              variants={fadeInUp}>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Your city"
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Your country"
                  required
                />
              </div>
            </motion.div>
          </motion.div>
        );
      case 1:
        return (
          <motion.div
            key="step1"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={pageTransition}
            className="space-y-6">
            <motion.div variants={fadeInUp}>
              <h3 className="text-xl font-medium text-center text-[#0a1e42] mb-6">How would you like to join ODR Lab?</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Student Innovator Option */}
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  className={`border p-5 rounded-lg cursor-pointer transition-all shadow-sm hover:shadow-md ${
                    form.mainUserType === "innovator"
                      ? "bg-blue-50 border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-300 hover:border-blue-300"
                  }`}
                  onClick={() =>
                    setForm((prev) => ({ 
                      ...prev, 
                      mainUserType: "innovator",
                      mentorType: "" // Reset mentor type when switching
                    }))
                  }>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="font-bold text-lg text-blue-800">Student Innovator</div>
                    <p className="text-sm text-gray-600 mt-2">
                      Join as a student to innovate and learn with ODR Lab
                    </p>
                  </div>
                </motion.div>
                
                {/* Mentor Option */}
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  className={`border p-5 rounded-lg cursor-pointer transition-all shadow-sm hover:shadow-md ${
                    form.mainUserType === "mentor"
                      ? "bg-indigo-50 border-indigo-500 ring-2 ring-indigo-200"
                      : "border-gray-300 hover:border-indigo-300"
                  }`}
                  onClick={() =>
                    setForm((prev) => ({ ...prev, mainUserType: "mentor" }))
                  }>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div className="font-bold text-lg text-indigo-800">Mentor</div>
                    <p className="text-sm text-gray-600 mt-2">
                      Join as a mentor to guide and support student innovations
                    </p>
                  </div>
                </motion.div>
                
                {/* Faculty Option */}
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  className={`border p-5 rounded-lg cursor-pointer transition-all shadow-sm hover:shadow-md ${
                    form.mainUserType === "faculty"
                      ? "bg-teal-50 border-teal-500 ring-2 ring-teal-200"
                      : "border-gray-300 hover:border-teal-300"
                  }`}
                  onClick={() =>
                    setForm((prev) => ({ 
                      ...prev, 
                      mainUserType: "faculty",
                      mentorType: "" // Reset mentor type when switching
                    }))
                  }>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                      </svg>
                    </div>
                    <div className="font-bold text-lg text-teal-800">Faculty</div>
                    <p className="text-sm text-gray-600 mt-2">
                      Join as faculty to integrate ODR Lab into your teaching
                    </p>
                  </div>
                </motion.div>
                
                {/* Other Option */}
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  className={`border p-5 rounded-lg cursor-pointer transition-all shadow-sm hover:shadow-md ${
                    form.mainUserType === "other"
                      ? "bg-amber-50 border-amber-500 ring-2 ring-amber-200"
                      : "border-gray-300 hover:border-amber-300"
                  }`}
                  onClick={() =>
                    setForm((prev) => ({ 
                      ...prev, 
                      mainUserType: "other",
                      mentorType: "" // Reset mentor type when switching
                    }))
                  }>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="font-bold text-lg text-amber-800">Other</div>
                    <p className="text-sm text-gray-600 mt-2">
                      Join in another capacity
                    </p>
                  </div>
                </motion.div>
              </div>
              
              {/* Show mentor type selection only if mentor is selected */}
              {form.mainUserType === "mentor" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-indigo-800 mb-4">Please select your mentor type:</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mentorTypes.map((type) => (
                      <motion.div
                        key={type.value}
                        variants={fadeInUp}
                        whileHover={{ scale: 1.02 }}
                        className={`border p-4 rounded cursor-pointer transition-all ${
                          form.mentorType === type.value
                            ? "bg-indigo-100 border-indigo-400"
                            : "border-gray-300 hover:border-indigo-300"
                        }`}
                        onClick={() =>
                          setForm((prev) => ({ ...prev, mentorType: type.value }))
                        }>
                        <div className="font-medium">
                          {type.label}
                          {type.value === "tech" && (
                            <p className="text-xs text-gray-600 mt-1">For technical professionals who can guide innovative tech projects</p>
                          )}
                          {type.value === "law" && (
                            <p className="text-xs text-gray-600 mt-1">For legal professionals who can provide expertise on regulatory aspects</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step2"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={pageTransition}
            className="space-y-6">
            {/* Render fields based on user type */}
            {form.userType === "student" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}>
                <motion.div variants={fadeInUp} className="mb-6">
                  <h3 className="text-lg font-medium text-blue-800 mb-4">Student Innovator Information</h3>
                  <p className="text-sm text-gray-600 mb-6">Please provide your academic details to help us customize your experience</p>
                  
                  <Tabs defaultValue="education" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="education" className="text-sm">Academic Details</TabsTrigger>
                      <TabsTrigger value="purpose" className="text-sm">Purpose & Goals</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="education" className="space-y-4 pt-2">
                      <div>
                        <Label htmlFor="highestEducation" className="text-blue-700">Highest Education</Label>
                        <Input
                          id="highestEducation"
                          name="highestEducation"
                          value={form.highestEducation}
                          onChange={handleChange}
                          placeholder="Your highest education qualification"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="studentInstitute" className="text-blue-700">Institute</Label>
                        <Input
                          id="studentInstitute"
                          name="studentInstitute"
                          value={form.studentInstitute}
                          onChange={handleChange}
                          placeholder="Your institute or university name"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="courseName" className="text-blue-700">Course/Program Name</Label>
                        <Input
                          id="courseName"
                          name="courseName"
                          value={form.courseName}
                          onChange={handleChange}
                          placeholder="Your course or program name"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="courseStatus" className="text-blue-700">Course Status</Label>
                        <select
                          id="courseStatus"
                          name="courseStatus"
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                          value={form.courseStatus}
                          onChange={handleChange}
                          required>
                          <option value="">Select status</option>
                          <option value="ongoing">Ongoing</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="purpose" className="space-y-4 pt-2">
                      <div>
                        <Label htmlFor="odrLabPurpose" className="text-blue-700">
                          Purpose for joining ODR Lab
                        </Label>
                        <Textarea
                          id="odrLabPurpose"
                          name="odrLabPurpose"
                          value={form.odrLabPurpose}
                          onChange={handleChange}
                          placeholder="Why do you want to join the ODR Lab? What are your innovation goals? How will this platform help your academic or personal growth?"
                          rows={6}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Your response helps us understand your goals and how we can better support your innovation journey.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </motion.div>
              </motion.div>
            )}

            {form.userType === "faculty" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}>
                <motion.div
                  className="space-y-4"
                  variants={fadeInUp}>
                  <div>
                    <Label htmlFor="facultyInstitute">Institution</Label>
                    <Input
                      id="facultyInstitute"
                      name="facultyInstitute"
                      value={form.facultyInstitute}
                      onChange={handleChange}
                      placeholder="Your institution name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="facultyRole">Role</Label>
                    <Input
                      id="facultyRole"
                      name="facultyRole"
                      value={form.facultyRole}
                      onChange={handleChange}
                      placeholder="Your role (e.g., Professor, Associate Professor)"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="facultyExpertise">Area of Expertise</Label>
                    <Input
                      id="facultyExpertise"
                      name="facultyExpertise"
                      value={form.facultyExpertise}
                      onChange={handleChange}
                      placeholder="Your area of expertise"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="facultyCourse">Course you teach</Label>
                    <Input
                      id="facultyCourse"
                      name="facultyCourse"
                      value={form.facultyCourse}
                      onChange={handleChange}
                      placeholder="Course you teach"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="facultyMentor">
                      Are you willing to mentor students?
                    </Label>
                    <select
                      id="facultyMentor"
                      name="facultyMentor"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0a1e42]"
                      value={form.facultyMentor}
                      onChange={handleChange}
                      required>
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="odrLabPurpose">
                      How do you plan to use ODR Lab?
                    </Label>
                    <Textarea
                      id="odrLabPurpose"
                      name="odrLabPurpose"
                      value={form.odrLabPurpose}
                      onChange={handleChange}
                      placeholder="How will you use ODR Lab in your teaching or research?"
                      rows={4}
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Tech Enthusiast Mentor */}
            {form.userType === "tech" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}>
                <motion.div variants={fadeInUp} className="mb-6">
                  <h3 className="text-lg font-medium text-indigo-800 mb-4">Technical Enthusiast Mentor</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    As a technical mentor, you&apos;ll guide students in developing innovative technology solutions.
                  </p>
                  
                  <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="profile" className="text-sm">Professional Profile</TabsTrigger>
                      <TabsTrigger value="mentoring" className="text-sm">Mentoring Approach</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="profile" className="space-y-4 pt-2">
                      <div>
                        <Label htmlFor="techOrg" className="text-indigo-700">Organization/Company</Label>
                        <Input
                          id="techOrg"
                          name="techOrg"
                          value={form.techOrg}
                          onChange={handleChange}
                          placeholder="Your organization or company name"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="techRole" className="text-indigo-700">Professional Role</Label>
                        <Input
                          id="techRole"
                          name="techRole"
                          value={form.techRole}
                          onChange={handleChange}
                          placeholder="Your role (e.g., Software Engineer, Tech Lead)"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="highestEducation" className="text-indigo-700">Highest Education</Label>
                        <Input
                          id="highestEducation"
                          name="highestEducation"
                          value={form.highestEducation}
                          onChange={handleChange}
                          placeholder="Your highest education qualification"
                          className="mt-1"
                          required
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="mentoring" className="space-y-4 pt-2">
                      <div>
                        <Label htmlFor="odrLabPurpose" className="text-indigo-700">
                          Mentoring Philosophy & Expertise
                        </Label>
                        <Textarea
                          id="odrLabPurpose"
                          name="odrLabPurpose"
                          value={form.odrLabPurpose}
                          onChange={handleChange}
                          placeholder="Please describe your technical expertise, mentoring experience, and how you plan to guide student innovators through the ODR Lab."
                          rows={6}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Your mentorship will be invaluable in helping students develop effective technological solutions.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </motion.div>
              </motion.div>
            )}

            {/* Law Enthusiast Mentor */}
            {form.userType === "law" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}>
                <motion.div variants={fadeInUp} className="mb-6">
                  <h3 className="text-lg font-medium text-indigo-800 mb-4">Law Enthusiast Mentor</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    As a legal mentor, you&apos;ll provide guidance on legal and regulatory aspects of student innovations.
                  </p>
                  
                  <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="profile" className="text-sm">Professional Profile</TabsTrigger>
                      <TabsTrigger value="mentoring" className="text-sm">Mentoring Approach</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="profile" className="space-y-4 pt-2">
                      <div>
                        <Label htmlFor="lawFirm" className="text-indigo-700">Law Firm/Organization</Label>
                        <Input
                          id="lawFirm"
                          name="lawFirm"
                          value={form.lawFirm}
                          onChange={handleChange}
                          placeholder="Your law firm or organization name"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="highestEducation" className="text-indigo-700">Legal Education</Label>
                        <Input
                          id="highestEducation"
                          name="highestEducation"
                          value={form.highestEducation}
                          onChange={handleChange}
                          placeholder="Your legal education (e.g., LLB, JD)"
                          className="mt-1"
                          required
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="mentoring" className="space-y-4 pt-2">
                      <div>
                        <Label htmlFor="odrLabPurpose" className="text-indigo-700">
                          Legal Expertise & Mentoring Approach
                        </Label>
                        <Textarea
                          id="odrLabPurpose"
                          name="odrLabPurpose"
                          value={form.odrLabPurpose}
                          onChange={handleChange}
                          placeholder="Please describe your legal expertise, experience in ODR or innovation-related legal matters, and how you plan to mentor students through legal challenges."
                          rows={6}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Your legal guidance will help students navigate regulatory challenges in their innovation journey.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </motion.div>
              </motion.div>
            )}

            {form.userType === "other" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}>
                <motion.div
                  className="space-y-4"
                  variants={fadeInUp}>
                  <div>
                    <Label htmlFor="otherRole">Your Role</Label>
                    <Input
                      id="otherRole"
                      name="otherRole"
                      value={form.otherRole}
                      onChange={handleChange}
                      placeholder="Your current role"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="otherWorkplace">
                      Workplace/Institution
                    </Label>
                    <Input
                      id="otherWorkplace"
                      name="otherWorkplace"
                      value={form.otherWorkplace}
                      onChange={handleChange}
                      placeholder="Your workplace or institution"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="highestEducation">Highest Education</Label>
                    <Input
                      id="highestEducation"
                      name="highestEducation"
                      value={form.highestEducation}
                      onChange={handleChange}
                      placeholder="Your highest education"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="odrLabPurpose">
                      How do you plan to use ODR Lab?
                    </Label>
                    <Textarea
                      id="odrLabPurpose"
                      name="odrLabPurpose"
                      value={form.odrLabPurpose}
                      onChange={handleChange}
                      placeholder="How will you use ODR Lab?"
                      rows={4}
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step3"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={pageTransition}
            className="space-y-6">
            <motion.div
              className="space-y-4"
              variants={fadeInUp}>
              <h3 className="text-lg font-medium">Review Your Information</h3>
              <div className="bg-gray-50 p-4 rounded border space-y-3">
                <div className="grid gap-3">
                  <h4 className="font-medium text-[#0a1e42] border-b pb-1">
                    Personal Information
                  </h4>
                  <div>
                    <span className="font-medium">Name:</span> {form.name}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {form.email}
                  </div>
                  <div>
                    <span className="font-medium">Mobile:</span> {form.mobile}
                  </div>
                  <div>
                    <span className="font-medium">Location:</span> {form.city},{" "}
                    {form.country}
                  </div>
                  <div>
                    <span className="font-medium">User Type:</span>{" "}
                    {form.mainUserType === "innovator" 
                      ? "Student Innovator"
                      : form.mainUserType === "mentor"
                      ? `${form.mentorType === "tech" ? "Technical Enthusiast" : "Law Enthusiast"} Mentor`
                      : form.mainUserType === "faculty"
                      ? "Faculty"
                      : "Other"
                    }
                  </div>

                  <h4 className="font-medium text-[#0a1e42] border-b pb-1 mt-3">
                    Professional Information
                  </h4>
                  {form.userType === "student" && (
                    <>
                      <div>
                        <span className="font-medium">Highest Education:</span>{" "}
                        {form.highestEducation}
                      </div>
                      <div>
                        <span className="font-medium">Institution:</span>{" "}
                        {form.studentInstitute}
                      </div>
                      <div>
                        <span className="font-medium">Course Status:</span>{" "}
                        {form.courseStatus}
                      </div>
                      <div>
                        <span className="font-medium">Course Name:</span>{" "}
                        {form.courseName}
                      </div>
                    </>
                  )}
                  {form.userType === "faculty" && (
                    <>
                      <div>
                        <span className="font-medium">Institution:</span>{" "}
                        {form.facultyInstitute}
                      </div>
                      <div>
                        <span className="font-medium">Role:</span>{" "}
                        {form.facultyRole}
                      </div>
                      <div>
                        <span className="font-medium">Area of Expertise:</span>{" "}
                        {form.facultyExpertise}
                      </div>
                      <div>
                        <span className="font-medium">Course:</span>{" "}
                        {form.facultyCourse}
                      </div>
                      <div>
                        <span className="font-medium">Willing to Mentor:</span>{" "}
                        {form.facultyMentor}
                      </div>
                    </>
                  )}
                  {form.userType === "tech" && (
                    <>
                      <div>
                        <span className="font-medium">Organization:</span>{" "}
                        {form.techOrg}
                      </div>
                      <div>
                        <span className="font-medium">Role:</span>{" "}
                        {form.techRole}
                      </div>
                    </>
                  )}
                  {form.userType === "law" && (
                    <>
                      <div>
                        <span className="font-medium">
                          Law Firm/Organization:
                        </span>{" "}
                        {form.lawFirm}
                      </div>
                      <div>
                        <span className="font-medium">Legal Education:</span>{" "}
                        {form.highestEducation}
                      </div>
                    </>
                  )}
                  {form.userType === "other" && (
                    <>
                      <div>
                        <span className="font-medium">Role:</span>{" "}
                        {form.otherRole}
                      </div>
                      <div>
                        <span className="font-medium">
                          Workplace/Institution:
                        </span>{" "}
                        {form.otherWorkplace}
                      </div>
                      <div>
                        <span className="font-medium">Highest Education:</span>{" "}
                        {form.highestEducation}
                      </div>
                    </>
                  )}

                  <h4 className="font-medium text-[#0a1e42] border-b pb-1 mt-3">
                    ODR Lab Usage
                  </h4>
                  <div>
                    <span className="font-medium">
                      Purpose for joining ODR Lab:
                    </span>
                    <p className="mt-1 text-sm text-gray-700">
                      {form.odrLabPurpose || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Please review your information above before submitting. Click
                &quot;Submit&quot; to complete your registration.
              </p>
            </motion.div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full bg-gray-100 text-gray-900 p-6 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}>
      {/* Background animation elements */}
      <motion.div
        className="absolute top-20 left-10 w-40 h-40 rounded-full bg-blue-500/10"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-sky-400/10"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <motion.div
        className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md relative z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}>
        {success ? (
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}>
            <motion.div
              className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}>
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"></path>
              </svg>
            </motion.div>
            <h2 className="text-2xl font-bold text-[#0a1e42] mb-4">
              Registration Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for registering. You will be redirected to the homepage shortly...
            </p>
          </motion.div>
        ) : (
          <>
            <motion.h1
              className="text-2xl font-bold mb-2 text-center text-[#0a1e42]"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}>
              Create Your Account
            </motion.h1>

            {step === 0 && (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}>
                {/* Google Sign In Button Container */}
                <div 
                  id="google-signin-container" 
                  className="w-full h-12 mb-4"
                  onClick={handleGoogleSignUp}
                >
                  {/* Google button will be rendered here by the Google API */}
                  {!googleScriptLoaded && (
                    <Button
                      type="button"
                      onClick={() => {}} // No-op as it will be replaced
                      disabled={loading}
                      className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-medium transition-all duration-200 flex items-center justify-center space-x-3 mb-4">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span>Sign up with Google</span>
                    </Button>
                  )}
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or create account with email</span>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              className="mb-6 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}>
              <div className="flex items-center w-full max-w-md">
                {steps.map((stepName, i) => (
                  <React.Fragment key={i}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          i <= step
                            ? "bg-[#0a1e42] text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}>
                        {i + 1}
                      </div>
                      <span className="text-xs mt-1">{stepName}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        className={`h-1 flex-1 mx-1 ${
                          i < step ? "bg-[#0a1e42]" : "bg-gray-200"
                        }`}></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mb-6">
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

            <motion.div
              className="flex justify-between mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}>
              {step > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="px-4">
                  Back
                </Button>
              ) : (
                <div></div>
              )}

              {step < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="bg-[#0a1e42] hover:bg-[#162d5a] px-4">
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSignUp}
                  className="bg-[#0a1e42] hover:bg-[#162d5a] px-4"
                  disabled={loading}>
                  {loading ? (
                    <motion.span
                      className="inline-flex items-center"
                      initial={{ opacity: 0.8 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.3,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}>
                      Registering...
                    </motion.span>
                  ) : (
                    "Submit"
                  )}
                </Button>
              )}
            </motion.div>

            {step === 0 && (
              <motion.div
                className="mt-6 text-center text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}>
                <span>Already have an account? </span>
                <Link
                  href="/signin"
                  className="text-[#0a1e42] hover:underline font-medium">
                  Sign in
                </Link>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SignUpPage;
