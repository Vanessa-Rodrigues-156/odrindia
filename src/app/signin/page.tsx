
'use client';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SignInPage = () => {
    const handleSignIn = (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        // Simple sign-in logic (for demonstration purposes)
        if (email === 'test@example.com' && password === 'password123') {
            alert('Sign-in successful!');
        } else {
            alert('Invalid email or password.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900 p-6">
            <h1 className="text-2xl font-bold mb-6">Sign In</h1>
            <form
                onSubmit={handleSignIn}
                className="flex flex-col gap-4 w-full max-w-sm"
            >
                <div className="flex flex-col gap-1">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter your email" required />
                </div>
                <div className="flex flex-col gap-1">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Enter your password" required />
                </div>
                <Button type="submit" className="w-full">
                    Sign In
                </Button>
            </form>
        </div>
    );
};

export default SignInPage;
