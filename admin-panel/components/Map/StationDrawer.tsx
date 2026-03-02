import { motion, AnimatePresence } from 'framer-motion';

interface Station {
    id: string;
    name: string;
    address: string;
    status: string;
    description?: string;
    avg_rating?: number;
    total_reviews?: number;
    lat: number;
    lng: number;
    chargers?: any[];
    amenities?: string[];
}

interface StationDrawerProps {
    station: Station | null;
    onClose: () => void;
    onStartCharging: (stationId: string) => void;
    onNavigate: (station: Station) => void;
    userLocation: { lat: number; lng: number };
    chargerStatuses: Record<string, any>;
    getDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
}

export default function StationDrawer({
    station,
    onClose,
    onStartCharging,
    onNavigate,
    userLocation,
    chargerStatuses,
    getDistance,
}: StationDrawerProps) {
    if (!station) return null;

    const distance = getDistance(userLocation.lat, userLocation.lng, station.lat, station.lng);
    const chargers = station.chargers || [];

    const getChargerStatus = (charger: any) => {
        return chargerStatuses[charger.id]?.current_status || charger.charger_status?.[0]?.current_status || 'offline';
    };

    const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
        available: { label: 'Available', color: 'text-emerald-700', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
        charging: { label: 'Engaged', color: 'text-amber-700', bg: 'bg-amber-50', dot: 'bg-amber-500' },
        preparation: { label: 'Preparing', color: 'text-blue-700', bg: 'bg-blue-50', dot: 'bg-blue-500' },
        offline: { label: 'Offline', color: 'text-gray-600', bg: 'bg-gray-100', dot: 'bg-gray-400' },
        error: { label: 'Error', color: 'text-red-700', bg: 'bg-red-50', dot: 'bg-red-500' },
    };

    const amenityEmojis: Record<string, string> = {
        wifi: '📶', cafe: '☕', restroom: '🚻', parking: '🅿️',
        food: '🍔', shopping: '🛒', ac_waiting: '❄️',
    };

    const availableChargers = chargers.filter(c => getChargerStatus(c) === 'available');
    const lowestPrice = chargers.length > 0
        ? Math.min(...chargers.map((c: any) => c.price_per_kwh || 15))
        : 15;

    return (
        <AnimatePresence>
            {station && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 z-30"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 500 }}
                        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-40 max-h-[85vh] overflow-y-auto"
                    >
                        {/* Drag Handle */}
                        <div className="w-full flex justify-center pt-3 pb-1 sticky top-0 bg-white rounded-t-3xl" onClick={onClose}>
                            <div className="w-12 h-1.5 bg-gray-300 rounded-full cursor-pointer" />
                        </div>

                        <div className="p-6 pt-3">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-gray-900">{station.name}</h2>
                                    <p className="text-gray-500 mt-1 text-sm">{station.address}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        {/* Distance */}
                                        <span className="text-sm text-emerald-600 font-medium">
                                            📍 {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)} km`}
                                        </span>
                                        {/* Rating */}
                                        {station.avg_rating && station.avg_rating > 0 && (
                                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                                ⭐ {station.avg_rating} ({station.total_reviews})
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1.5 rounded-xl text-sm font-semibold ${availableChargers.length > 0
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {availableChargers.length > 0 ? `${availableChargers.length} Available` : 'No Availability'}
                                    </span>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-3 mb-5">
                                <div className="bg-gray-50 p-3 rounded-xl text-center">
                                    <p className="text-xs text-gray-500 mb-1">From</p>
                                    <p className="font-bold text-gray-900">₹{lowestPrice}<span className="text-xs font-normal">/kWh</span></p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-xl text-center">
                                    <p className="text-xs text-gray-500 mb-1">Chargers</p>
                                    <p className="font-bold text-gray-900">{chargers.length}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-xl text-center">
                                    <p className="text-xs text-gray-500 mb-1">Max Power</p>
                                    <p className="font-bold text-gray-900">
                                        {chargers.length > 0 ? Math.max(...chargers.map((c: any) => c.max_power_kw || 0)) : 0} kW
                                    </p>
                                </div>
                            </div>

                            {/* Charger List with Status */}
                            <div className="mb-5">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Charger Status</h3>
                                <div className="space-y-2">
                                    {chargers.map((charger: any, idx: number) => {
                                        const cStatus = getChargerStatus(charger);
                                        const config = statusConfig[cStatus] || statusConfig.offline;
                                        return (
                                            <div key={charger.id || idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-3 h-3 rounded-full ${config.dot} ${cStatus === 'available' ? 'animate-pulse' : ''}`} />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {charger.connector_type?.toUpperCase() || 'CCS2'}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {charger.max_power_kw || 50} kW · ₹{charger.price_per_kwh || 15}/kWh
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${config.bg} ${config.color}`}>
                                                    {config.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Amenities */}
                            {station.amenities && station.amenities.length > 0 && (
                                <div className="mb-5">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Amenities</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {station.amenities.map((am: string) => (
                                            <span key={am} className="px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-medium text-gray-600 border border-gray-100">
                                                {amenityEmojis[am] || '✓'} {am.replace('_', ' ')}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            {station.description && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-2">About</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{station.description}</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => onNavigate(station)}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                    Navigate
                                </button>
                                <button
                                    onClick={() => onStartCharging(station.id)}
                                    disabled={availableChargers.length === 0}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Start Charging
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
