import { useState, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import TripForm from '../../components/TripPlanner/TripForm';
import TripRoute from '../../components/TripPlanner/TripRoute';
import { ChargingStop } from '../../components/TripPlanner/TripStopCard';
import { TripSegment } from '../../components/TripPlanner/TripRoute';

// Demo route database — simulated routes between Indian cities
interface RouteData {
    totalDistanceKm: number;
    totalDurationMin: number;
    stops: ChargingStop[];
    segments: TripSegment[];
}

const DEMO_ROUTES: Record<string, RouteData> = {
    'New Delhi→Jaipur': {
        totalDistanceKm: 281,
        totalDurationMin: 310,
        stops: [
            {
                id: 's1', name: 'Highway Charge Hub - Dharuhera', address: 'NH-48, Dharuhera, Haryana',
                distanceFromStart: 72, connectorType: 'CCS2', maxPowerKw: 60, pricePerKwh: 16,
                estimatedChargeTimeMin: 25, estimatedCost: 180, amenities: ['parking', 'cafe', 'restroom'],
                lat: 28.2065, lng: 76.7976, rating: 4.3,
            },
            {
                id: 's2', name: 'Neemrana Fort EV Station', address: 'NH-48, Neemrana, Rajasthan',
                distanceFromStart: 151, connectorType: 'CCS2', maxPowerKw: 120, pricePerKwh: 20,
                estimatedChargeTimeMin: 18, estimatedCost: 220, amenities: ['parking', 'food', 'wifi', 'restroom'],
                lat: 27.9828, lng: 76.3874, rating: 4.6,
            },
        ],
        segments: [
            { distanceKm: 72, durationMin: 55 },
            { distanceKm: 79, durationMin: 60 },
            { distanceKm: 130, durationMin: 95 },
        ],
    },
    'Mumbai→Pune': {
        totalDistanceKm: 149,
        totalDurationMin: 195,
        stops: [
            {
                id: 's3', name: 'Lonavala EV SuperCharger', address: 'Mumbai-Pune Expressway, Lonavala',
                distanceFromStart: 83, connectorType: 'CCS2', maxPowerKw: 150, pricePerKwh: 22,
                estimatedChargeTimeMin: 15, estimatedCost: 195, amenities: ['cafe', 'wifi', 'restroom', 'food'],
                lat: 18.7546, lng: 73.4062, rating: 4.7,
            },
        ],
        segments: [
            { distanceKm: 83, durationMin: 65 },
            { distanceKm: 66, durationMin: 50 },
        ],
    },
    'Bangalore→Chennai': {
        totalDistanceKm: 346,
        totalDurationMin: 385,
        stops: [
            {
                id: 's4', name: 'Hosur Green Charge Point', address: 'NH-44, Hosur, Tamil Nadu',
                distanceFromStart: 42, connectorType: 'Type2', maxPowerKw: 22, pricePerKwh: 12,
                estimatedChargeTimeMin: 35, estimatedCost: 140, amenities: ['parking', 'restroom'],
                lat: 12.7409, lng: 77.8253, rating: 4.0,
            },
            {
                id: 's5', name: 'Krishnagiri Highway Hub', address: 'NH-44, Krishnagiri, Tamil Nadu',
                distanceFromStart: 95, connectorType: 'CCS2', maxPowerKw: 60, pricePerKwh: 16,
                estimatedChargeTimeMin: 22, estimatedCost: 165, amenities: ['parking', 'cafe', 'food', 'wifi'],
                lat: 12.5186, lng: 78.2138, rating: 4.4,
            },
            {
                id: 's6', name: 'Vellore EV Power Station', address: 'NH-44, Vellore, Tamil Nadu',
                distanceFromStart: 212, connectorType: 'CCS2', maxPowerKw: 120, pricePerKwh: 20,
                estimatedChargeTimeMin: 18, estimatedCost: 210, amenities: ['parking', 'food', 'restroom', 'wifi', 'lounge'],
                lat: 12.9165, lng: 79.1325, rating: 4.5,
            },
        ],
        segments: [
            { distanceKm: 42, durationMin: 35 },
            { distanceKm: 53, durationMin: 42 },
            { distanceKm: 117, durationMin: 90 },
            { distanceKm: 134, durationMin: 100 },
        ],
    },
    'New Delhi→Agra': {
        totalDistanceKm: 233,
        totalDurationMin: 260,
        stops: [
            {
                id: 's7', name: 'Mathura EV Station', address: 'NH-44, Mathura, Uttar Pradesh',
                distanceFromStart: 162, connectorType: 'CCS2', maxPowerKw: 60, pricePerKwh: 15,
                estimatedChargeTimeMin: 20, estimatedCost: 150, amenities: ['parking', 'food', 'restroom'],
                lat: 27.4924, lng: 77.6737, rating: 4.2,
            },
        ],
        segments: [
            { distanceKm: 162, durationMin: 120 },
            { distanceKm: 71, durationMin: 55 },
        ],
    },
    'New Delhi→Chandigarh': {
        totalDistanceKm: 243,
        totalDurationMin: 275,
        stops: [
            {
                id: 's8', name: 'Karnal Highway Charger', address: 'NH-44, Karnal, Haryana',
                distanceFromStart: 131, connectorType: 'CCS2', maxPowerKw: 120, pricePerKwh: 18,
                estimatedChargeTimeMin: 15, estimatedCost: 170, amenities: ['parking', 'cafe', 'restroom', 'wifi'],
                lat: 29.6857, lng: 76.9905, rating: 4.5,
            },
        ],
        segments: [
            { distanceKm: 131, durationMin: 100 },
            { distanceKm: 112, durationMin: 85 },
        ],
    },
    'Ahmedabad→Mumbai': {
        totalDistanceKm: 524,
        totalDurationMin: 530,
        stops: [
            {
                id: 's9', name: 'Vadodara EV Hub', address: 'NH-48, Vadodara, Gujarat',
                distanceFromStart: 112, connectorType: 'CCS2', maxPowerKw: 60, pricePerKwh: 16,
                estimatedChargeTimeMin: 25, estimatedCost: 190, amenities: ['parking', 'food', 'cafe', 'restroom'],
                lat: 22.3072, lng: 73.1812, rating: 4.3,
            },
            {
                id: 's10', name: 'Surat Green Station', address: 'NH-48, Surat, Gujarat',
                distanceFromStart: 265, connectorType: 'CCS2', maxPowerKw: 150, pricePerKwh: 20,
                estimatedChargeTimeMin: 18, estimatedCost: 220, amenities: ['parking', 'wifi', 'food', 'restroom', 'lounge'],
                lat: 21.1702, lng: 72.8311, rating: 4.6,
            },
            {
                id: 's11', name: 'Nashik Highway Power', address: 'NH-48, Nashik, Maharashtra',
                distanceFromStart: 395, connectorType: 'CCS2', maxPowerKw: 120, pricePerKwh: 18,
                estimatedChargeTimeMin: 20, estimatedCost: 200, amenities: ['parking', 'cafe', 'restroom'],
                lat: 20.0063, lng: 73.7905, rating: 4.1,
            },
        ],
        segments: [
            { distanceKm: 112, durationMin: 85 },
            { distanceKm: 153, durationMin: 115 },
            { distanceKm: 130, durationMin: 100 },
            { distanceKm: 129, durationMin: 95 },
        ],
    },
};

// Generates a plausible route for any city pair
function generateFallbackRoute(startCity: string, endCity: string, vehicleRange: number): RouteData {
    // Estimate a distance between 150–600 km for unknown pairs
    const hash = (startCity + endCity).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const totalDistanceKm = 150 + (hash % 450);
    const avgSpeed = 65; // km/h
    const numStops = Math.max(1, Math.floor(totalDistanceKm / (vehicleRange * 0.7)));
    const segmentDistance = Math.round(totalDistanceKm / (numStops + 1));

    const stops: ChargingStop[] = [];
    for (let i = 0; i < numStops; i++) {
        const dist = segmentDistance * (i + 1);
        stops.push({
            id: `gen-${i}`,
            name: `Highway Charge Point ${i + 1}`,
            address: `NH Highway, en route to ${endCity}`,
            distanceFromStart: dist,
            connectorType: ['CCS2', 'Type2', 'CHAdeMO'][i % 3],
            maxPowerKw: [60, 120, 150][i % 3],
            pricePerKwh: 14 + (i % 3) * 4,
            estimatedChargeTimeMin: 15 + (i % 3) * 5,
            estimatedCost: 140 + (i % 3) * 40,
            amenities: ['parking', 'restroom', ...(i % 2 === 0 ? ['cafe', 'wifi'] : ['food'])],
            lat: 20 + (hash + i * 37) % 10,
            lng: 72 + (hash + i * 53) % 8,
            rating: 3.8 + ((hash + i) % 10) / 10,
        });
    }

    const segments: TripSegment[] = [];
    for (let i = 0; i <= numStops; i++) {
        const dKm = i < numStops ? segmentDistance : totalDistanceKm - segmentDistance * numStops;
        segments.push({ distanceKm: dKm, durationMin: Math.round(dKm / avgSpeed * 60) });
    }

    const totalChargingMin = stops.reduce((a, s) => a + s.estimatedChargeTimeMin, 0);
    const totalDrivingMin = Math.round(totalDistanceKm / avgSpeed * 60);

    return {
        totalDistanceKm,
        totalDurationMin: totalDrivingMin + totalChargingMin,
        stops,
        segments,
    };
}

export default function TripPlannerPage() {
    const [routeData, setRouteData] = useState<RouteData | null>(null);
    const [tripCities, setTripCities] = useState<{ start: string; end: string }>({ start: '', end: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handlePlanTrip = useCallback((start: string, end: string, range: number, _connectors: string[]) => {
        setIsLoading(true);
        setRouteData(null);

        // Simulate a network request
        setTimeout(() => {
            const key = `${start}→${end}`;
            const reverseKey = `${end}→${start}`;
            let route = DEMO_ROUTES[key] || DEMO_ROUTES[reverseKey];

            if (!route) {
                route = generateFallbackRoute(start, end, range);
            }

            setRouteData(route);
            setTripCities({ start, end });
            setIsLoading(false);
        }, 1200);
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
                            EV Trip Planner
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4 leading-[1.1]">
                            Plan your EV trip{' '}
                            <span className="gradient-text">with confidence</span>
                        </h1>
                        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
                            Enter your start and destination — we&apos;ll map out the optimal charging stops along Indian highways so you can drive worry-free.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Form + Results */}
            <section className="relative z-10 pb-24 px-4">
                <TripForm onPlanTrip={handlePlanTrip} isLoading={isLoading} />

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
                        <p className="text-gray-400 text-sm font-medium mt-4">Finding the best charging stops...</p>
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
                {!routeData && !isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="max-w-2xl mx-auto mt-12"
                    >
                        <h3 className="text-center text-white font-bold text-lg mb-6">🔥 Popular Routes</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {Object.keys(DEMO_ROUTES).map((key) => {
                                const [start, end] = key.split('→');
                                const route = DEMO_ROUTES[key];
                                return (
                                    <button
                                        key={key}
                                        onClick={() => handlePlanTrip(start, end, 300, ['CCS2'])}
                                        className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/30 rounded-2xl p-4 text-left transition-all"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                            <span className="text-sm font-semibold text-white">{start}</span>
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                            <span className="w-2 h-2 rounded-full bg-cyan-500" />
                                            <span className="text-sm font-semibold text-white">{end}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-gray-400">
                                            <span>📏 {route.totalDistanceKm} km</span>
                                            <span>⚡ {route.stops.length} stop{route.stops.length !== 1 ? 's' : ''}</span>
                                            <span className="group-hover:text-emerald-400 transition-colors ml-auto">Plan →</span>
                                        </div>
                                    </button>
                                );
                            })}
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
