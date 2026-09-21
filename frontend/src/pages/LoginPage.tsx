import React, { useState } from 'react';
import { User, CheckCircle2, LogIn } from 'lucide-react';

export interface LoginFormData {
    email: string;
    password: string;
}

export const LoginPage: React.FC = () => {
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
    });

    // Handle typed input changes
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        // TODO: add login logic, change isSubmitted state
    }

    return (
        <div>
            <div className="min-h-screen bg-gray-100 text-neutral-100 py-16 px-4 sm:px-6 lg:px-8 font-sans">
                <div className="max-w-6xl mx-auto flex flex-col items-center justify-center">

                    {/* Header Section */}
                    <div className="text-center mb-16">
                        <div className="flex justify-center mb-4">
                            <User className="w-10 h-10 text-neutral-400" />
                        </div>
                        {/* <h1 className="text-4xl md:text-5xl font-light tracking-wide uppercase">
                            Login
                        </h1> */}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 w-full max-w-2xl">
                        {/* Form Section */}
                        <div className="lg:col-span-2 flex flex-col items-center justify-center bg-neutral-200/50 p-8 rounded-2xl border border-neutral-800">
                            {isSubmitted ? (
                                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4 animate-bounce" />
                                    <h3 className="text-2xl font-light text-neutral-500 mb-2">Login Successful!</h3>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Full Name */}
                                        <div>
                                            <label htmlFor="email" className="block text-xs uppercase tracking-widest text-neutral-600 mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="text"
                                                id="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Email"
                                                className="w-full bg-neutral-100 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-neutral-500 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label htmlFor="password" className="block text-xs uppercase tracking-widest text-neutral-600 mb-2">
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                id="password"
                                                name="password"
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Password"
                                                className="w-full bg-neutral-100 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-neutral-500 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition"
                                            />
                                        </div>
                                    </div>
                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full max-w-3xs border-solid rounded-md bg-white text-black font-medium py-3.5 px-6 hover:bg-neutral-200 transition duration-200 space-x-2 disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <span>Logging in...</span>
                                        ) : (
                                            <div className="flex items-center justify-center space-x-2 w-full">
                                                <span>Login</span>
                                                <LogIn className="w-4 h-4"/>
                                            </div>
                                        )}
                                    </button>
                                    <div>
                                        <p className="text-xs text-neutral-500 mt-2">Don't have an account? <a href="/signup" className="text-neutral-600 hover:text-neutral-700 transition">Sign up</a></p>
                                    </div>
                                </form>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}