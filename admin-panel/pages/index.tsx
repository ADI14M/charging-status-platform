import Head from 'next/head';
import Navbar from '../components/Landing/Navbar';
import Hero from '../components/Landing/Hero';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="bg-dark-950 min-h-screen font-sans text-white">
            <Head>
                <title>ChargeConnect - India&apos;s Smart EV Charging Network</title>
                <meta name="description" content="Find and book EV charging stations near you. Real-time availability, navigation, and seamless payments." />
            </Head>

            <Navbar />

            <main>
                <Hero />

                {/* Features Section */}
                <section id="features" className="py-24 bg-dark-950 relative">
                    <div className="absolute inset-0 grid-bg opacity-20" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="text-center mb-16"
                        >
                            <span className="text-emerald-400 font-semibold text-sm tracking-wider uppercase">Features</span>
                            <h2 className="mt-3 text-3xl sm:text-5xl font-black text-white">
                                Everything you need to{' '}
                                <span className="gradient-text">charge smarter</span>
                            </h2>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <FeatureCard
                                title="Real-time Availability"
                                desc="See live status of every charger — available, engaged, or offline — before you drive there."
                                icon={
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                }
                                color="emerald"
                                delay={0}
                            />
                            <FeatureCard
                                title="Smart Navigation"
                                desc="Get turn-by-turn directions to the nearest available station. No more range anxiety."
                                icon={
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                }
                                color="cyan"
                                delay={0.1}
                            />
                            <FeatureCard
                                title="Trip Planner"
                                desc="Plan your EV road trip with optimized charging stops along highways. Drive worry-free."
                                icon={
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                }
                                color="amber"
                                delay={0.2}
                            />
                            <FeatureCard
                                title="Secure Payments"
                                desc="Pay with UPI, Credit Card, or Wallet. Transparent pricing with no hidden fees."
                                icon={
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                }
                                color="violet"
                                delay={0.3}
                            />
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section id="how-it-works" className="py-24 bg-gray-950 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-600/5 rounded-full blur-[120px]" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <span className="text-cyan-400 font-semibold text-sm tracking-wider uppercase">How it Works</span>
                            <h2 className="mt-3 text-3xl sm:text-5xl font-black text-white">
                                Three simple steps
                            </h2>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <StepCard
                                step="01"
                                title="Search Nearby"
                                desc="Open the map and find the nearest available charging station to your location."
                                delay={0}
                            />
                            <StepCard
                                step="02"
                                title="Navigate & Plug In"
                                desc="Get directions, drive to the station, and plug in your EV. Simple."
                                delay={0.15}
                            />
                            <StepCard
                                step="03"
                                title="Charge & Pay"
                                desc="Monitor your session in real-time and pay seamlessly when done."
                                delay={0.3}
                            />
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-dark-950 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-cyan-600/10" />
                    <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">
                                Ready to power your journey?
                            </h2>
                            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
                                Join thousands of EV drivers who charge smarter with ChargeConnect.
                                Find stations, check availability, and charge — all in one place.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link href="/map"
                                    className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-2xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20"
                                >
                                    Find Stations Now
                                </Link>
                                <Link href="/login"
                                    className="px-8 py-4 bg-white/5 text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all border border-white/10"
                                >
                                    I&apos;m a Station Owner
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-950 border-t border-white/5 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <span className="text-white font-bold text-xl">ChargeConnect</span>
                            </div>
                            <p className="text-gray-500 text-sm max-w-sm">
                                India&apos;s smartest EV charging network. Find, navigate, and charge at verified stations across the country.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Product</h4>
                            <div className="space-y-2">
                                <Link href="/map" className="block text-gray-500 hover:text-gray-300 text-sm">Find Stations</Link>
                                <Link href="/trip-planner" className="block text-gray-500 hover:text-gray-300 text-sm">Trip Planner</Link>
                                <Link href="/signup" className="block text-gray-500 hover:text-gray-300 text-sm">Sign Up</Link>
                                <Link href="/login" className="block text-gray-500 hover:text-gray-300 text-sm">Station Owner Login</Link>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Company</h4>
                            <div className="space-y-2">
                                <span className="block text-gray-500 text-sm">About Us</span>
                                <span className="block text-gray-500 text-sm">Careers</span>
                                <span className="block text-gray-500 text-sm">Contact</span>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-white/5 pt-8 text-center">
                        <p className="text-gray-600 text-sm">© 2026 ChargeConnect. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ title, desc, icon, color, delay }: { title: string; desc: string; icon: any; color: string; delay: number }) {
    const colorMap: Record<string, string> = {
        emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/10 text-emerald-400',
        cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/10 text-cyan-400',
        amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/10 text-amber-400',
        violet: 'from-violet-500/20 to-violet-500/5 border-violet-500/10 text-violet-400',
    };

    const iconBgMap: Record<string, string> = {
        emerald: 'bg-emerald-500/10 text-emerald-400',
        cyan: 'bg-cyan-500/10 text-cyan-400',
        amber: 'bg-amber-500/10 text-amber-400',
        violet: 'bg-violet-500/10 text-violet-400',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className={`p-8 rounded-2xl bg-gradient-to-b ${colorMap[color]} border hover:scale-[1.02] transition-transform cursor-default`}
        >
            <div className={`w-14 h-14 rounded-xl ${iconBgMap[color]} flex items-center justify-center mb-5`}>
                {icon}
            </div>
            <h4 className="text-xl font-bold mb-3 text-white">{title}</h4>
            <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
        </motion.div>
    );
}

function StepCard({ step, title, desc, delay }: { step: string; title: string; desc: string; delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="text-center p-8"
        >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-6">
                <span className="text-2xl font-black gradient-text">{step}</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
        </motion.div>
    );
}
