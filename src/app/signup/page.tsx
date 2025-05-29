"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion"; // Added AnimatePresence
import { useAuth } from "@/lib/auth";
import { apiFetch } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";

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

const userTypes = [
  { value: "student", label: "Student" },
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
  const router = useRouter();
  const { login } = useAuth();

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
      if (!form.userType) {
        setError("Please select your type.");
        return;
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
              ? "MENTOR"
              : form.userType === "law"
              ? "MENTOR"
              : form.userType === "tech"
              ? "INNOVATOR"
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
        // Auto login the user after successful registration
        login(data.user, data.token);
        setTimeout(() => {
          router.push("/");
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
              <Label className="block mb-3">Select User Type</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userTypes.map((type) => (
                  <motion.div
                    key={type.value}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.02 }}
                    className={`border p-4 rounded cursor-pointer ${
                      form.userType === type.value
                        ? "bg-[#0a1e42] text-white border-[#0a1e42]"
                        : "border-gray-300 hover:border-[#0a1e42]"
                    }`}
                    onClick={() =>
                      setForm((prev) => ({ ...prev, userType: type.value }))
                    }>
                    <div className="font-medium">{type.label}</div>
                  </motion.div>
                ))}
              </div>
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
                <motion.div
                  className="space-y-4"
                  variants={fadeInUp}>
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
                    <Label htmlFor="studentInstitute">Institute</Label>
                    <Input
                      id="studentInstitute"
                      name="studentInstitute"
                      value={form.studentInstitute}
                      onChange={handleChange}
                      placeholder="Your institute name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="courseStatus">Course Status</Label>
                    <select
                      id="courseStatus"
                      name="courseStatus"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0a1e42]"
                      value={form.courseStatus}
                      onChange={handleChange}
                      required>
                      <option value="">Select status</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="courseName">Course Name</Label>
                    <Input
                      id="courseName"
                      name="courseName"
                      value={form.courseName}
                      onChange={handleChange}
                      placeholder="Your course name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="odrLabPurpose">
                      Purpose for joining ODR Lab
                    </Label>
                    <Textarea
                      id="odrLabPurpose"
                      name="odrLabPurpose"
                      value={form.odrLabPurpose}
                      onChange={handleChange}
                      placeholder="Why do you want to join the ODR Lab? How will you use it?"
                      rows={4}
                    />
                  </div>
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

            {form.userType === "tech" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}>
                <motion.div
                  className="space-y-4"
                  variants={fadeInUp}>
                  <div>
                    <Label htmlFor="techOrg">Organization</Label>
                    <Input
                      id="techOrg"
                      name="techOrg"
                      value={form.techOrg}
                      onChange={handleChange}
                      placeholder="Your organization"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="techRole">Role</Label>
                    <Input
                      id="techRole"
                      name="techRole"
                      value={form.techRole}
                      onChange={handleChange}
                      placeholder="Your role in the organization"
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
                      placeholder="How will you use ODR Lab in your technical work?"
                      rows={4}
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}

            {form.userType === "law" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}>
                <motion.div
                  className="space-y-4"
                  variants={fadeInUp}>
                  <div>
                    <Label htmlFor="lawFirm">Law Firm/Organization</Label>
                    <Input
                      id="lawFirm"
                      name="lawFirm"
                      value={form.lawFirm}
                      onChange={handleChange}
                      placeholder="Your law firm or organization"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="highestEducation">Legal Education</Label>
                    <Input
                      id="highestEducation"
                      name="highestEducation"
                      value={form.highestEducation}
                      onChange={handleChange}
                      placeholder="Your legal education (e.g., LLB, JD)"
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
                      placeholder="How will you use ODR Lab in your legal practice?"
                      rows={4}
                    />
                  </div>
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
                    {form.userType}
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
      className="flex flex-col items-center justify-center min-h-fit bg-gray-100 text-gray-900 p-6 relative"
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
              Thank you for registering. You will be redirected to the login
              page shortly...
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
