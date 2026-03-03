import { useState, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import TripForm from '../../components/TripPlanner/TripForm';
import TripRoute from '../../components/TripPlanner/TripRoute';
import { findCity, generateRoute, POPULAR_ROUTES, GeneratedRoute } from '../../lib/tripData';

export default function TripPlannerPage() {
    const [routeData, setRouteData] = useState<GeneratedRoute | null>(null);
    const [tripCities, setTripCities] = useState<{ start: string; end: string }>({ start: '', end: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePlanTrip = useCallback((start: string, end: string, range: number, connectors: string[]) => {
        setIsLoading(true);
        setRouteData(null);
        setError('');

        // Simulate brief processing delay for UX
        setTimeout(() => {
            const startCity = findCity(start);
            const endCity = findCity(end);

            if (!startCity || !endCity) {
                setError(`Could not find ${!startCity ? `"${start}"` : `"${end}"`}. Please select a city from the suggestions.`);
                setIsLoading(false);
                return;
            }

            const route = generateRoute(startCity, endCity, range, connectors);
            setRouteData(route);
            setTripCities({ start: startCity.name, end: endCity.name });
            setIsLoading(false);
        }, 800);
    }, []);

    const totalChargingCost = routeData?.stops.reduce((a, s) => a + s.estimatedCost, 0) || 0;
    const totalChargingTime = routeData?.stops.reduce((a, s) => a + s.estimatedChargeTimeMin, 0) || 0;

    return (
        <div className="min-h-screen bg-dark-950 font-sans">
            <Head>
                <title>Trip Planner | ChargeConnect</title>
                <meta name="description" content="Plan your EV road trip with optimized charging stops along Indian highways. Find the best route with ChargeConnect." />
            </Head>

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="text-2xl font-bold flex items-center gap-2">
                            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span className="text-white">
                                Charge<span className="text-emerald-500">Connect</span>
                            </span>
                        </Link>
                        <div className="hidden md:flex items-center space-x-6">
                            <Link href="/map" className="text-white/70 hover:text-white font-medium transition-colors text-sm">Find Station</Link>
                            <Link href="/trip-planner" className="text-emerald-400 font-semibold text-sm">Trip Planner</Link>
                            <Link href="/" className="text-white/70 hover:text-white font-medium transition-colors text-sm">Home</Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Header */}
            <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-16 overflow-hidden">
                <div className="absolute inset-0 grid-bg opacity-20" />
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-[128px] animate-float" />
                <div className="absolute bottom-0 -right-32 w-80 h-80 bg-cyan-500/15 rounded-full blur-[128px] animate-float-delayed" />

                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            EV Trip Planner — 150+ Cities
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4 leading-[1.1]">
                            Plan your EV trip{' '}
                            <span className="gradient-text">with confidence</span>
                        </h1>
                        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
                            Enter your start and destination — we&apos;ll calculate the real distance and map out optimal charging stops along Indian highways so you can drive worry-free.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Form + Results */}
            <section className="relative z-10 pb-24 px-4">
                <TripForm onPlanTrip={handlePlanTrip} isLoading={isLoading} />

                {/* Error State */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-2xl mx-auto mt-6"
                    >
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                            <p className="text-red-400 text-sm font-medium">⚠️ {error}</p>
                        </div>
                    </motion.div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm font-medium mt-4">Calculating optimal route & charging stops...</p>
                    </div>
                )}

                {/* Route Result */}
                {routeData && !isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mt-10"
                    >
                        <TripRoute
                            startCity={tripCities.start}
                            endCity={tripCities.end}
                            stops={routeData.stops}
                            segments={routeData.segments}
                            totalDistanceKm={routeData.totalDistanceKm}
                            totalDurationMin={routeData.totalDurationMin}
                            totalChargingCost={totalChargingCost}
                            totalChargingTimeMin={totalChargingTime}
                        />

                        {/* Bottom CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                            className="max-w-2xl mx-auto mt-8 text-center"
                        >
                            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
                                <p className="text-gray-400 text-sm mb-4">
                                    Ready to hit the road? Find live station availability on our map.
                                </p>
                                <Link
                                    href="/map"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Open Live Map
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Popular Routes — shown when no route is selected */}
                {!routeData && !isLoading && !error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="max-w-2xl mx-auto mt-12"
                    >
                        {/* Karnataka Routes */}
                        <h3 className="text-center text-white font-bold text-lg mb-4">🏔️ Popular Karnataka Routes</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                            {POPULAR_ROUTES.filter(r => r.tag === 'Karnataka').map((route) => (
                                <button
                                    key={`${route.start}-${route.end}`}
                                    onClick={() => handlePlanTrip(route.start, route.end, 300, ['CCS2'])}
                                    className="group bg-white/5 hover:bg-white/10 border border-emerald-500/10 hover:border-emerald-500/30 rounded-2xl p-4 text-left transition-all"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="text-sm font-semibold text-white">{route.start}</span>
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                        <span className="w-2 h-2 rounded-full bg-cyan-500" />
                                        <span className="text-sm font-semibold text-white">{route.end}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-400">
                                        <span>📏 ~{route.distanceKm} km</span>
                                        <span className="group-hover:text-emerald-400 transition-colors ml-auto">Plan →</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* National Routes */}
                        <h3 className="text-center text-white font-bold text-lg mb-4">🔥 Popular National Routes</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {POPULAR_ROUTES.filter(r => !r.tag).map((route) => (
                                <button
                                    key={`${route.start}-${route.end}`}
                                    onClick={() => handlePlanTrip(route.start, route.end, 300, ['CCS2'])}
                                    className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/30 rounded-2xl p-4 text-left transition-all"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span className="text-sm font-semibold text-white">{route.start}</span>
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                        <span className="w-2 h-2 rounded-full bg-cyan-500" />
                                        <span className="text-sm font-semibold text-white">{route.end}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-400">
                                        <span>📏 ~{route.distanceKm} km</span>
                                        <span className="group-hover:text-emerald-400 transition-colors ml-auto">Plan →</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </section>

            {/* Footer */}
            <footer className="bg-gray-950 border-t border-white/5 py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-gray-600 text-sm">© 2026 ChargeConnect. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
