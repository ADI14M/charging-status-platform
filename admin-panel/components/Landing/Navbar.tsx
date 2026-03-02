import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100'
                : 'bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="text-2xl font-bold flex items-center gap-2">
                            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span className={`transition-colors ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                                Charge<span className="text-emerald-500">Connect</span>
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="/map" className={`font-medium transition-colors ${scrolled ? 'text-gray-600 hover:text-emerald-600' : 'text-white/80 hover:text-white'}`}>
                                Find Station
                            </Link>
                            <Link href="/#features" className={`font-medium transition-colors ${scrolled ? 'text-gray-600 hover:text-emerald-600' : 'text-white/80 hover:text-white'}`}>
                                Features
                            </Link>
                            <Link href="/#how-it-works" className={`font-medium transition-colors ${scrolled ? 'text-gray-600 hover:text-emerald-600' : 'text-white/80 hover:text-white'}`}>
                                How it Works
                            </Link>
                            <Link href="/login" className="bg-white/10 backdrop-blur text-white px-5 py-2.5 rounded-full font-medium hover:bg-white/20 transition-all border border-white/20">
                                Station Owner Login
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-gray-700' : 'text-white'}`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileOpen
                                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                }
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-[60]">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-72 bg-gray-900 shadow-2xl p-6 flex flex-col">
                        <button onClick={() => setMobileOpen(false)} className="self-end text-white/60 hover:text-white mb-8">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="flex flex-col space-y-4">
                            <Link href="/map" onClick={() => setMobileOpen(false)} className="text-white/80 hover:text-white font-medium py-3 border-b border-white/10">
                                🗺️ Find Station
                            </Link>
                            <Link href="/#features" onClick={() => setMobileOpen(false)} className="text-white/80 hover:text-white font-medium py-3 border-b border-white/10">
                                ✨ Features
                            </Link>
                            <Link href="/#how-it-works" onClick={() => setMobileOpen(false)} className="text-white/80 hover:text-white font-medium py-3 border-b border-white/10">
                                📋 How it Works
                            </Link>
                            <Link href="/login" onClick={() => setMobileOpen(false)} className="mt-4 bg-emerald-600 text-white px-5 py-3 rounded-xl font-medium text-center hover:bg-emerald-700 transition-colors">
                                Station Owner Login
                            </Link>
                            <Link href="/signup" onClick={() => setMobileOpen(false)} className="bg-white/10 text-white px-5 py-3 rounded-xl font-medium text-center hover:bg-white/20 transition-colors border border-white/20">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
