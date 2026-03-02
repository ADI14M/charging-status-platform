import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-950">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 grid-bg opacity-40" />

            {/* Gradient Orbs */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-[128px] animate-float" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px] animate-float-delayed" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[100px]" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
                <div className="text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            India&apos;s Smart EV Charging Network
                        </div>

                        <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight mb-6 leading-[1.1]">
                            Charge your EV,{' '}
                            <br className="hidden sm:block" />
                            <span className="gradient-text">Anywhere, Anytime.</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Find thousands of charging stations near you, check real-time availability,
                            navigate instantly and pay seamlessly. The smartest way to power your journey.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                            <Link href="/map"
                                className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl font-bold text-lg hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-3"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Find Nearby Stations
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                            <Link href="/signup"
                                className="px-8 py-4 bg-white/5 text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center gap-2"
                            >
                                Get Started Free
                            </Link>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="grid grid-cols-3 gap-6 max-w-lg mx-auto"
                    >
                        <StatBox number="500+" label="Stations" />
                        <StatBox number="10K+" label="Users" />
                        <StatBox number="1M+" label="kWh Delivered" />
                    </motion.div>
                </div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-950 to-transparent z-10" />
        </div>
    );
}

function StatBox({ number, label }: { number: string; label: string }) {
    return (
        <div className="text-center">
            <div className="text-2xl sm:text-3xl font-black text-white">{number}</div>
            <div className="text-sm text-gray-500 font-medium">{label}</div>
        </div>
    );
}
