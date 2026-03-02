import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState<'user' | 'charger_owner'>('user');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data, error: signupError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        phone_number: phone,
                        role: role,
                    }
                }
            });

            if (signupError) {
                setError(signupError.message);
                setLoading(false);
                return;
            }

            if (data.user) {
                // Update profile with role and phone
                await supabase.from('profiles').update({
                    full_name: fullName,
                    phone_number: phone,
                    role: role,
                }).eq('id', data.user.id);

                // Redirect based on role
                if (role === 'charger_owner') {
                    router.push('/dashboard');
                } else {
                    router.push('/map');
                }
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-dark-950 flex items-center justify-center relative overflow-hidden">
            <Head>
                <title>Sign Up | ChargeConnect</title>
            </Head>

            {/* Background */}
            <div className="absolute inset-0 grid-bg opacity-20" />
            <div className="absolute top-1/4 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px]" />
            <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md mx-4"
            >
                <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white/5 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </Link>
                        <h2 className="text-2xl font-bold text-white">Create your account</h2>
                        <p className="text-gray-500 mt-2 text-sm">Join India&apos;s smartest EV charging network</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-4">
                        {/* Role Toggle */}
                        <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
                            <button
                                type="button"
                                onClick={() => setRole('user')}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${role === 'user'
                                    ? 'bg-emerald-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                🚗 EV Driver
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('charger_owner')}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${role === 'charger_owner'
                                    ? 'bg-emerald-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                ⚡ Station Owner
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1.5">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-sm"
                                placeholder="Enter your name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-sm"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1.5">Phone Number</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-sm"
                                placeholder="+91 98765 43210"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-sm"
                                placeholder="Min 6 characters"
                                minLength={6}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-semibold hover:from-emerald-500 hover:to-emerald-400 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-500 text-sm">
                            Already have an account?{' '}
                            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
