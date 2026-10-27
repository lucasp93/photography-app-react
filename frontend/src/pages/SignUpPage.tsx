import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, CheckCircle2 } from 'lucide-react';
// Import your icons or MUI equivalents here:
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { createUser } from '../services/utils';
import type { User } from '../interfaces/interfaces';

export interface SignUpFormData {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    role: string;
}

export const SignUpPage: React.FC = () => {
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // 1. Separate states to toggle visibility for each field
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    // Track whether user interacted with confirmPassword field
    const [confirmPasswordTouched, setConfirmPasswordTouched] = useState<boolean>(false);

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState<SignUpFormData>({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        role: '',
    });

    // Check if passwords mismatch after input is blurred or form is submitted
    const isPasswordMismatch =
        confirmPasswordTouched &&
        formData.confirmPassword.length > 0 &&
        formData.password !== formData.confirmPassword;

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
        setConfirmPasswordTouched(true);

        if (formData.password !== formData.confirmPassword) {
            setStatus('error');
            setIsSubmitting(false);
            setErrorMessage('Passwords do not match');
            return;
        }

        setIsSubmitting(true);
        setStatus('loading');

        const userData: User = {
            email: formData.email,
            username: formData.username,
            password: formData.password,
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: formData.role ? formData.role : 'user',
        };

        const isSuccess = await createUser(userData);
        if (isSuccess) {
            setStatus('success');
            setIsSubmitted(true);
            setIsSubmitting(false);
            navigate('/login');
        } else {
            setStatus('error');
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="min-h-screen bg-gray-100 text-neutral-100 py-16 px-4 sm:px-6 lg:px-8 font-sans">
                <div className="max-w-6xl mx-auto flex flex-col items-center justify-center">

                    {/* Header Section */}
                    <div className="text-center mb-16">
                        <div className="flex justify-center mb-4">
                            <UserPlus className="w-10 h-10 text-neutral-400" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-light tracking-wide uppercase">
                            Create Account
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 w-full max-w-2xl">
                        {/* Form Section */}
                        <div className="lg:col-span-2 flex flex-col items-center justify-center bg-neutral-200/50 p-8 rounded-2xl border border-neutral-800">
                            {isSubmitted ? (
                                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4 animate-bounce" />
                                    <h3 className="text-2xl font-light text-neutral-500 mb-2">SignUp Successful!</h3>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Username */}
                                        <div>
                                            <label htmlFor="username" className="block text-xs uppercase tracking-widest text-neutral-600 mb-2">
                                                Username
                                            </label>
                                            <input
                                                type="text"
                                                id="username"
                                                name="username"
                                                required
                                                value={formData.username}
                                                onChange={handleChange}
                                                placeholder="Username"
                                                className="w-full bg-neutral-100 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-neutral-500 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label htmlFor="email" className="block text-xs uppercase tracking-widest text-neutral-600 mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Email"
                                                className="w-full bg-neutral-100 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-neutral-500 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition"
                                            />
                                        </div>

                                        {/* Password Input with Eye Icon */}
                                        <div>
                                            <label htmlFor="password" className="block text-xs uppercase tracking-widest text-neutral-600 mb-2">
                                                Password
                                            </label>
                                            <div className="relative flex items-center">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    id="password"
                                                    name="password"
                                                    required
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    placeholder="Password"
                                                    className="w-full bg-neutral-100 border border-neutral-800 rounded-lg pl-4 pr-10 py-3 text-sm text-neutral-500 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword((prev) => !prev)}
                                                    className="absolute right-3 focus:outline-none p-1 hover:opacity-80 transition"
                                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                                >
                                                    {showPassword ? (
                                                        <RemoveRedEyeIcon className="w-4 h-4 text-neutral-400 block" />
                                                    ) : (
                                                        <VisibilityOffIcon className="w-4 h-4 text-neutral-400 block" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Confirm Password Input with Eye Icon */}
                                        <div>
                                            <label
                                                htmlFor="confirmPassword"
                                                className={`block text-xs uppercase tracking-widest mb-2 transition ${isPasswordMismatch ? 'text-red-500' : 'text-neutral-600'
                                                    }`}
                                            >
                                                Confirm Password
                                            </label>
                                            <div className="relative flex items-center">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    required
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    onBlur={() => setConfirmPasswordTouched(true)}
                                                    placeholder="Confirm Password"
                                                    className={`w-full bg-neutral-100 rounded-lg pl-4 pr-10 py-3 text-sm placeholder-neutral-600 focus:outline-none transition ${isPasswordMismatch
                                                            ? 'border-2 border-red-500 text-red-500 focus:border-red-500'
                                                            : 'border border-neutral-800 text-neutral-500 focus:border-neutral-500'
                                                        }`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                                    className="absolute right-3 focus:outline-none p-1 hover:opacity-80 transition"
                                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                                >
                                                    {showConfirmPassword ? (
                                                        <RemoveRedEyeIcon className="w-4 h-4 text-neutral-400 block" />
                                                    ) : (
                                                        <VisibilityOffIcon className="w-4 h-4 text-neutral-400 block" />
                                                    )}
                                                </button>
                                            </div>
                                            {isPasswordMismatch && (
                                                <p className="text-xs text-red-500 mt-1">
                                                    Passwords do not match.
                                                </p>
                                            )}
                                        </div>

                                        {/* First Name */}
                                        <div>
                                            <label htmlFor="firstName" className="block text-xs uppercase tracking-widest text-neutral-600 mb-2">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                name="firstName"
                                                required
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                placeholder="First Name"
                                                className="w-full bg-neutral-100 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-neutral-500 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition"
                                            />
                                        </div>

                                        {/* Last Name */}
                                        <div>
                                            <label htmlFor="lastName" className="block text-xs uppercase tracking-widest text-neutral-600 mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                name="lastName"
                                                required
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                placeholder="Last Name"
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
                                            <span>Creating account...</span>
                                        ) : (
                                            <div className="flex items-center justify-center space-x-2 w-full">
                                                <span>Create Account</span>
                                            </div>
                                        )}
                                    </button>
                                    {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};