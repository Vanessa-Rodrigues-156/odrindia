'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion'; // Added framer-motion import

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const SignInPage = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignIn = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(event.target as HTMLFormElement);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                // Store user info in localStorage (for demo; use proper session in production)
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                
                // Redirect based on user role
                if (data.user.role === 'ADMIN') {
                    router.push('/admin/idea-approval');
                } else {
                    router.push('/'); // Redirect to home page for regular users
                }
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            console.log(err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            className="flex flex-col items-center justify-center min-h-fit bg-gray-100 text-gray-900 p-6 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Background animation elements */}
            <motion.div 
                className="absolute top-20 left-10 w-40 h-40 rounded-full bg-blue-500/10"
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div 
                className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-sky-400/10"
                animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.1, 0.3, 0.1]
                }}
                transition={{ duration: 6, repeat: Infinity }}
            />
            
            <motion.div 
                className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md relative z-10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <motion.h1 
                    className="text-2xl font-bold mb-6 text-center text-[#0a1e42]"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Sign In
                </motion.h1>
                
                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    </motion.div>
                )}
                
                <motion.form 
                    onSubmit={handleSignIn} 
                    className="flex flex-col gap-4"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <motion.div className="flex flex-col gap-1" variants={fadeInUp}>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="Enter your email" required />
                    </motion.div>
                    <motion.div className="flex flex-col gap-1" variants={fadeInUp}>
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" placeholder="Enter your password" required />
                    </motion.div>
                    <motion.div variants={fadeInUp}>
                        <Button type="submit" className="w-full bg-[#0a1e42] hover:bg-[#162d5a]" disabled={loading}>
                            {loading ? (
                                <motion.span
                                    className="inline-flex items-center"
                                    initial={{ opacity: 0.8 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, repeat: Infinity, repeatType: "reverse" }}
                                >
                                    Signing In...
                                </motion.span>
                            ) : 'Sign In'}
                        </Button>
                    </motion.div>
                </motion.form>
                
                <motion.div 
                    className="mt-4 text-center text-sm text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <span>Don&apos;t have an account? </span>
                    <Link href="/signup" className="text-[#0a1e42] hover:underline font-medium">
                        Sign up
                    </Link>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default SignInPage;
