import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface ChargingModalProps {
    isOpen: boolean;
    onClose: () => void;
    station: any;
}

export default function ChargingModal({ isOpen, onClose, station }: ChargingModalProps) {
    const [progress, setProgress] = useState(0);
    const [kwh, setKwh] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [completed, setCompleted] = useState(false);

    const pricePerKwh = station?.chargers?.[0]?.price_per_kwh || 15;
    const stationName = station?.name || 'Unknown Station';
    const cost = (kwh * pricePerKwh);

    useEffect(() => {
        if (isOpen) {
            setProgress(0);
            setKwh(0);
            setSeconds(0);
            setCompleted(false);

            const interval = setInterval(() => {
                setProgress(p => {
                    if (p >= 100) {
                        clearInterval(interval);
                        setCompleted(true);
                        return 100;
                    }
                    return p + 0.5;
                });
                setKwh(k => +(k + 0.08).toFixed(2));
                setSeconds(s => s + 1);
            }, 100);

            return () => clearInterval(interval);
        }
    }, [isOpen]);

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-3xl w-full max-w-sm p-6 text-center relative overflow-hidden"
                >
                    {/* Top progress bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {completed ? (
                        /* Completion View */
                        <div className="py-4">
                            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">Charging Complete! ⚡</h3>
                            <p className="text-gray-500 text-sm mb-6">{stationName}</p>

                            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Session Summary</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{kwh.toFixed(1)}</p>
                                        <p className="text-xs text-gray-500">kWh</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{formatTime(seconds)}</p>
                                        <p className="text-xs text-gray-500">Duration</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-emerald-600">₹{cost.toFixed(0)}</p>
                                        <p className="text-xs text-gray-500">Total Cost</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        /* Charging View */
                        <>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 mt-2">Charging Session</h3>
                            <p className="text-gray-500 text-sm mb-6">{stationName}</p>

                            <div className="mb-8 relative flex items-center justify-center">
                                <div className="w-44 h-44 rounded-full border-4 border-gray-100 flex items-center justify-center relative">
                                    <svg className="absolute inset-0 w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                                        <circle cx="88" cy="88" r="82" stroke="#f3f4f6" strokeWidth="8" fill="transparent" />
                                        <circle
                                            cx="88" cy="88" r="82"
                                            stroke="url(#chargingGradient)"
                                            strokeWidth="8"
                                            fill="transparent"
                                            strokeLinecap="round"
                                            strokeDasharray={515}
                                            strokeDashoffset={515 - (515 * progress) / 100}
                                            className="transition-all duration-300"
                                        />
                                        <defs>
                                            <linearGradient id="chargingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#10b981" />
                                                <stop offset="100%" stopColor="#06b6d4" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="flex flex-col items-center">
                                        <span className="text-4xl font-black text-gray-900">{Math.floor(progress)}%</span>
                                        <span className="text-emerald-600 font-medium text-sm flex items-center gap-1">
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                            Charging
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-6">
                                <div className="bg-gray-50 p-3 rounded-xl">
                                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Energy</p>
                                    <p className="text-lg font-bold text-gray-800">{kwh.toFixed(1)} <span className="text-xs font-normal">kWh</span></p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-xl">
                                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Time</p>
                                    <p className="text-lg font-bold text-gray-800">{formatTime(seconds)}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-xl">
                                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Cost</p>
                                    <p className="text-lg font-bold text-emerald-600">₹{cost.toFixed(0)}</p>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full bg-red-50 text-red-600 font-bold py-3.5 rounded-xl hover:bg-red-100 transition-colors"
                            >
                                Stop Charging
                            </button>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
