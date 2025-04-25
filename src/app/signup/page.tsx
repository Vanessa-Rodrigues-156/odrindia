'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import userData from '../signin/data.json';

const SignUpPage = () => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();

    const handleSignUp = (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);
        
        const formData = new FormData(event.target as HTMLFormElement);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        // Basic validation
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        // Check if email already exists
        const emailExists = userData.users.some((user) => user.email === email);
        if (emailExists) {
            setError('An account with this email already exists');
            return;
        }
        else {
            
        }
        // In a real app, you would send this data to your backend API
        // For this demo, we'll just show a success message
        setSuccess('Account created successfully! Redirecting to sign in...');
        
        // Simulate account creation and redirect
        setTimeout(() => {
            router.push('/signin');
        }, 2000);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900 p-6">
            <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-[#0a1e42]">Create an Account</h1>
                
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                
                {success && (
                    <Alert className="mb-4 bg-green-50 border-green-500 text-green-700">
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )}
                
                <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" type="text" placeholder="Enter your full name" required />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="Enter your email" required />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                            id="password" 
                            name="password" 
                            type="password" 
                            placeholder="Create a password" 
                            required 
                            minLength={8}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input 
                            id="confirmPassword" 
                            name="confirmPassword" 
                            type="password" 
                            placeholder="Confirm your password" 
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full bg-[#0a1e42] hover:bg-[#162d5a]">
                        Sign Up
                    </Button>
                </form>
                
                <div className="mt-4 text-center text-sm text-gray-500">
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
