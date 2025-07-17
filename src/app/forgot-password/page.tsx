"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

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

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiFetch("/auth/forgot-password", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset link');
      }
      setSuccess("A password reset link has been sent to your email address.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[70vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <motion.div
        className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}>
        
        <motion.h1
          className="text-2xl lg:text-3xl font-bold mb-6 text-center text-[#0a1e42]"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}>
          Forgot Password
        </motion.h1>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}>
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}>
            <Alert variant="default" className="mb-6 bg-green-100 border-green-400 text-green-700">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
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
              className="h-12 text-base border-gray-300 focus:border-[#0a1e42] focus:ring-[#0a1e42]"
              required
            />
          </motion.div>
          <motion.div variants={fadeInUp} className="mt-2">
            <Button
              type="submit"
              className="w-full h-12 bg-[#0a1e42] hover:bg-[#162d5a] text-base font-medium transition-all duration-200"
              disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </motion.div>
        </motion.form>
        <motion.div
            className="mt-6 text-center text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}>
            <span>Remember your password? </span>
            <Link
              href="/signin"
              className="text-[#0a1e42] hover:underline font-medium transition-colors">
              Sign In
            </Link>
          </motion.div>
      </motion.div>
    </div>
  );
}