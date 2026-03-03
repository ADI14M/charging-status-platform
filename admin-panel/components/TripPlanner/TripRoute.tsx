import { motion } from 'framer-motion';
import TripStopCard, { ChargingStop } from './TripStopCard';

export interface TripSegment {
    distanceKm: number;
    durationMin: number;
}

interface TripRouteProps {
    startCity: string;
    endCity: string;
    stops: ChargingStop[];
    segments: TripSegment[];
    totalDistanceKm: number;
    totalDurationMin: number;
    totalChargingCost: number;
    totalChargingTimeMin: number;
}

export default function TripRoute({
    startCity,
    endCity,
    stops,
    segments,
    totalDistanceKm,
    totalDurationMin,
    totalChargingCost,
    totalChargingTimeMin,
}: TripRouteProps) {
    const totalHours = Math.floor(totalDurationMin / 60);
    const totalMins = totalDurationMin % 60;
    const chargeHours = Math.floor(totalChargingTimeMin / 60);
    const chargeMins = totalChargingTimeMin % 60;

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Trip Summary Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-cyan-500 rounded-2xl p-5 mb-6 text-white shadow-xl shadow-emerald-500/20"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">{startCity} → {endCity}</h3>
                        <p className="text-emerald-100 text-sm">Your optimized charging route</p>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                    <div className="bg-white/15 backdrop-blur rounded-xl p-3 text-center">
                        <p className="text-xs text-emerald-100 mb-0.5">Distance</p>
                        <p className="text-lg font-bold">{totalDistanceKm} km</p>
                    </div>
                    <div className="bg-white/15 backdrop-blur rounded-xl p-3 text-center">
                        <p className="text-xs text-emerald-100 mb-0.5">Drive Time</p>
                        <p className="text-lg font-bold">{totalHours}h {totalMins}m</p>
                    </div>
                    <div className="bg-white/15 backdrop-blur rounded-xl p-3 text-center">
                        <p className="text-xs text-emerald-100 mb-0.5">Charge Time</p>
                        <p className="text-lg font-bold">{chargeHours > 0 ? `${chargeHours}h ` : ''}{chargeMins}m</p>
                    </div>
                    <div className="bg-white/15 backdrop-blur rounded-xl p-3 text-center">
                        <p className="text-xs text-emerald-100 mb-0.5">Est. Cost</p>
                        <p className="text-lg font-bold">₹{totalChargingCost}</p>
                    </div>
                </div>
            </motion.div>

            {/* Route Timeline */}
            <div className="relative">
                {/* Start Node */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-3 mb-1"
                >
                    <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-300/30 flex-shrink-0 z-10">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3l14 9-14 9V3z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm">{startCity}</h4>
                        <p className="text-xs text-gray-500">Starting point</p>
                    </div>
                </motion.div>

                {/* Segments & Stops */}
                {stops.map((stop, idx) => (
                    <div key={stop.id}>
                        {/* Driving segment line */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: idx * 0.15 }}
                            className="flex items-stretch ml-5 gap-3"
                        >
                            <div className="w-[2px] bg-gradient-to-b from-emerald-400 to-emerald-300 min-h-[44px] relative">
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                </div>
                            </div>
                            <div className="flex items-center py-3">
                                <span className="text-xs text-gray-400 font-medium bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                    🚗 {segments[idx]?.distanceKm || '—'} km · ~{segments[idx]?.durationMin || '—'} min drive
                                </span>
                            </div>
                        </motion.div>

                        {/* Charging stop */}
                        <div className="flex items-start ml-0 gap-0">
                            <div className="flex flex-col items-center flex-shrink-0 mt-5">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-300/30 z-10">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex-1 ml-3">
                                <TripStopCard stop={stop} index={idx} />
                            </div>
                        </div>
                    </div>
                ))}

                {/* Final segment line */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: stops.length * 0.15 }}
                    className="flex items-stretch ml-5 gap-3"
                >
                    <div className="w-[2px] bg-gradient-to-b from-emerald-300 to-cyan-400 min-h-[44px] relative">
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                        </div>
                    </div>
                    <div className="flex items-center py-3">
                        <span className="text-xs text-gray-400 font-medium bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                            🚗 {segments[segments.length - 1]?.distanceKm || '—'} km · ~{segments[segments.length - 1]?.durationMin || '—'} min drive
                        </span>
                    </div>
                </motion.div>

                {/* End Node */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: stops.length * 0.15 + 0.2 }}
                    className="flex items-center gap-3 mt-1"
                >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-300/30 flex-shrink-0 z-10">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm">{endCity}</h4>
                        <p className="text-xs text-gray-500">Destination</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
