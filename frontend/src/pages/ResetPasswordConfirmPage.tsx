import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User, CheckCircle2, LogIn } from 'lucide-react';
import { getUserById } from '../services/utils';
import api from '../services/api';
import { ApiUrls } from '../utils/ApiUrls';

export interface ResetPasswordFormData {
    password: string;
    confirmPassword: string;
}


export const ResetPasswordConfirmPage: React.FC = () => {
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const { uid, token } = useParams<{ uid: string; token: string }>();

    //const userId = useParams<{ id: string }>();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const navigate = useNavigate();

    const [formData, setFormData] = useState<ResetPasswordFormData>({
        password: '',
        confirmPassword: '',
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage('');
        setIsSubmitting(true);
        // TODO: Implement logic to send forgot password email
        //const password = formData.password;
        //const confirmPassword = formData.confirmPassword;

        //let userData = await getUserById(uid.toString());
        // if (!userData) {
        //     throw new Error('User was not found.');
        // }

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            setIsSubmitting(false);
            return;
        }
        try {
            // const url = ApiUrls.updateUser.replace(':id', userId.toString());
            // userData[0].password = password;
            // //const response = await api.apiPut(url, userData);
            const response = await fetch('/api/password/reset/confirm/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid: uid,
                    token: token,
                    new_password: password,
                }),
            });
            const data = await response.json();
            // Handle validation errors from backend
            if (!response.ok) {
                const error_data = 
                    data.detail ||
                    (Array.isArray(data.new_password) ? data.new_password[0] : data.new_password) ||
                    'Failed to reset password.';
                throw new Error(
                    error_data  || 'Failed to update password.');
            }
            // Handle success
            setStatus('success');
            setIsSubmitted(true);
            setIsSubmitting(false);
            navigate('/login');
        } catch (err: any) {
            console.error('Failed to update user password:', err);
            setErrorMessage(err.message || 'Failed to update password, an unexpected error ocurred.');
            setStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    }

    // const handleChange = (
    //     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    // ) => {
    //     const { name, value } = e.target;
    //     setFormData((prev) => ({
    //         ...prev,
    //         [name]: value,
    //     }));
    // };

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
                                        {/* Password */}
                                        <div>
                                            <label htmlFor="password" className="block text-xs uppercase tracking-widest text-neutral-600 mb-2">
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                id="password"
                                                name="password"
                                                required
                                                value={password} //{formData.password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                //onChange={handleChange}
                                                placeholder="Password"
                                                className="w-full bg-neutral-100 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-neutral-500 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition"
                                            />
                                        </div>
                                        {/* Confirm Password */}
                                        <div>
                                            <label htmlFor="confirmPassword" className="block text-xs uppercase tracking-widest text-neutral-600 mb-2">
                                                Confirm Password
                                            </label>
                                            <input
                                                type="password"
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                required
                                                value={confirmPassword}//{formData.confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)} //{handleChange}
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
                                            <span>Changing password...</span>
                                        ) : (
                                            <div className="flex items-center justify-center space-x-2 w-full">
                                                <span>Submit</span>
                                                <LogIn className="w-4 h-4" />
                                            </div>
                                        )}
                                    </button>
                                    {errorMessage && <p className="text-sm text-red-500 mt-2">{status}: {errorMessage}</p>}
                                </form>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}