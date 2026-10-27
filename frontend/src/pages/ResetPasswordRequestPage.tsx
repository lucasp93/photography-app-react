import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { getUserByEmail } from '../services/utils';

export const ResetPasswordRequestPage = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrorMessage(null);

        // validate email
        if (!email.includes('@')) {
            setErrorMessage('Please enter a valid email address.');
            setIsSubmitting(false);
            return;
        }

        // check if email exists
        const userData = await getUserByEmail(email);
        if (!userData || userData.length === 0) {
            setErrorMessage('No user found with that email address.');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('/api/password/reset/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Unable to submit the password reset request.');
            }

            setSubmitted(true);
        } catch {
            setErrorMessage('Unable to submit your request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-100 text-neutral-100 px-4 py-16 flex items-center justify-center">
            <section className="w-full max-w-md border border-neutral-800 rounded-2xl bg-neutral-200/50 p-8">
                <Mail className="w-8 h-8 text-neutral-500 mb-6" />
                <h1 className="text-2xl font-normal mb-2">Reset your password</h1>
                {submitted ? (
                    <p className="text-sm text-neutral-500" role="status">
                        If an account exists for that email, a reset link will be sent.
                    </p>
                ) : (
                    <>
                        <p className="text-sm text-neutral-500 mb-6">
                            Enter the email address associated with your account.
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
                            <label htmlFor="reset-email" className="block mt-4 text-xs uppercase tracking-widest text-neutral-600 mb-2">
                                Email
                            </label>
                            <input
                                id="reset-email"
                                type="email"
                                autoComplete="email"
                                placeholder="e.g. john@example.com"
                                required
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                className="w-full bg-neutral-100 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-neutral-700 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition"
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full max-w-3xs mt-3 border-solid rounded-md bg-white text-black font-medium py-3.5 px-6 hover:bg-neutral-200 transition duration-200 space-x-2 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Sending...' : 'Send reset link'}
                            </button>
                            {errorMessage && <p className="text-sm mt-3 text-red-400" role="alert">{errorMessage}</p>}
                        </form>
                    </>
                )}
                <Link to="/login" className="mt-6 inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white">
                    <ArrowLeft className="w-4 h-4" />
                    Back to login
                </Link>
            </section>
        </main>
    );
};