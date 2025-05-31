"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion"; // Added framer-motion import
import { useAuth } from "@/lib/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

const SignInPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get("email");
    const password = formData.get("password");

    console.log("Processing login form submission");
    
    // Validate form data
    if (typeof email !== "string" || typeof password !== "string") {
      setError("Email and password must be valid strings.");
      setLoading(false);
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError("Email and password cannot be empty.");
      setLoading(false);
      return;
    }

    try {
      console.log(`Attempting login for email: ${email}`);
      
      // Use the auth context login function (which handles token storage)
      const success = await login(email, password);

      if (!success) {
        console.error("Login returned failure");
        setError("Invalid email or password. Please try again.");
        setLoading(false);
        return;
      }

      console.log("Login successful, preparing redirect");
      
      // Login successful - determine where to redirect
      const urlParams = new URLSearchParams(window.location.search);
      const redirectPath = urlParams.get("redirect");
      
      // Add a slightly longer delay to ensure auth context is fully updated
      // and the token is properly stored
      setTimeout(() => {
        if (redirectPath && redirectPath !== '/signin') {
          console.log(`Redirecting to: ${redirectPath}`);
          router.push(redirectPath); // Go to the originally requested page
        } else {
          console.log("Redirecting to home page");
          router.push("/"); // Redirect to home page for regular users
        }
      }, 300);
    } catch (err) {
      console.error("Sign in error:", err);
      setError("Unable to connect to the server. Please check your network connection and try again.");
      setLoading(false);
    }
  };

  return (
    <div className="h-[70vh] flex flex-col lg:flex-row">
      {/* Mobile header for branding (shown on small screens) */}
      <motion.div
        className="lg:hidden bg-gradient-to-r from-[#0a1e42] to-[#162d5a] px-4 py-6 text-center relative overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}>
        
        <motion.div
          className="absolute top-2 right-4 w-16 h-16 rounded-full bg-white/10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        
        <div className="relative z-10">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Welcome Back to ODR
          </h1>
          <p className="text-sm text-blue-100">
            Online Dispute Resolution Platform
          </p>
        </div>
      </motion.div>

      {/* Left side - Branding/Welcome section (desktop only) */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0a1e42] to-[#162d5a] px-8 py-12 xl:px-16 flex-col justify-center relative overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}>
        
        {/* Background decorative elements */}
        <motion.div
          className="absolute top-20 right-20 w-32 h-32 rounded-full bg-white/10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-32 left-16 w-24 h-24 rounded-full bg-sky-400/20"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        <div className="relative z-10 max-w-lg m-auto">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}>
            <h1 className="text-3xl xl:text-4xl font-bold text-white mb-4">
              Welcome Back to ODR
            </h1>
            <p className="text-lg xl:text-xl text-blue-100 leading-relaxed">
              Online Dispute Resolution for ADR practices and Justice. 
              Sign in to continue your journey towards accessible and efficient dispute resolution.
            </p>
          </motion.div>
          
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-sky-400 rounded-full flex-shrink-0"></div>
              <span className="text-blue-100 text-sm xl:text-base">Secure authentication system</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-sky-400 rounded-full flex-shrink-0"></div>
              <span className="text-blue-100 text-sm xl:text-base">Access to collaborative tools</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-sky-400 rounded-full flex-shrink-0"></div>
              <span className="text-blue-100 text-sm xl:text-base">Connect with mentors and peers</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - Sign in form */}
      <motion.div
        className="flex-1 lg:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-6 sm:py-8 lg:px-12 xl:px-16 relative"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}>
        
        {/* Background animation elements */}
        <motion.div
          className="absolute top-8 left-4 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full bg-blue-500/5"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-8 right-4 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full bg-sky-400/5"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <motion.div
          className="w-full max-w-sm sm:max-w-md mx-auto bg-white p-6 sm:p-8 lg:p-10 rounded-2xl shadow-xl relative z-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}>
          
          <motion.h1
            className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 lg:mb-8 text-center text-[#0a1e42]"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}>
            Sign In
          </motion.h1>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}>
              <Alert
                variant="destructive"
                className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <motion.form
            onSubmit={handleSignIn}
            className="flex flex-col gap-4 sm:gap-5 lg:gap-6"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}>
            <motion.div
              className="flex flex-col gap-2"
              variants={fadeInUp}>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="h-10 sm:h-11 lg:h-12 text-sm sm:text-base border-gray-300 focus:border-[#0a1e42] focus:ring-[#0a1e42]"
                required
              />
            </motion.div>
            <motion.div
              className="flex flex-col gap-2"
              variants={fadeInUp}>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className="h-10 sm:h-11 lg:h-12 text-sm sm:text-base border-gray-300 focus:border-[#0a1e42] focus:ring-[#0a1e42]"
                required
              />
            </motion.div>
            <motion.div variants={fadeInUp} className="mt-1 sm:mt-2">
              <Button
                type="submit"
                className="w-full h-10 sm:h-11 lg:h-12 bg-[#0a1e42] hover:bg-[#162d5a] text-sm sm:text-base font-medium transition-all duration-200"
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
                    Signing In...
                  </motion.span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </motion.div>
          </motion.form>

          <motion.div
            className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}>
            <span>Don&apos;t have an account? </span>
            <Link
              href="/signup"
              className="text-[#0a1e42] hover:underline font-medium transition-colors">
              Sign up
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignInPage;
