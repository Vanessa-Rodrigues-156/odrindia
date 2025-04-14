'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import userData from './data.json';

const SignInPage = () => {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSignIn = (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        
        const formData = new FormData(event.target as HTMLFormElement);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        // Validate against data.json
        const user = userData.users.find(
            (user) => user.email === email && user.password === password
        );

        if (user) {
            // Store user info in localStorage (in a real app, use proper session management)
            localStorage.setItem('currentUser', JSON.stringify({ email: user.email }));
            router.push('/dashboard'); // Redirect to dashboard or home page
        } else {
            // Check if email exists to provide better error message
            const emailExists = userData.users.some((user) => user.email === email);
            if (emailExists) {
                setError('Invalid password. Please try again.');
            } else {
                setError('Account not found. Please sign up first.');
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900 p-6">
            <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-[#0a1e42]">Sign In</h1>
                
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                
                <form onSubmit={handleSignIn} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="Enter your email" required />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" placeholder="Enter your password" required />
                    </div>
                    <Button type="submit" className="w-full bg-[#0a1e42] hover:bg-[#162d5a]">
                        Sign In
                    </Button>
                </form>
                
                <div className="mt-4 text-center text-sm text-gray-500">
                    <span>Don't have an account? </span>
                    <Link href="/signup" className="text-[#0a1e42] hover:underline font-medium">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
