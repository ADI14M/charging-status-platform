import { motion } from 'framer-motion';

export interface ChargingStop {
    id: string;
    name: string;
    address: string;
    distanceFromStart: number;
    connectorType: string;
    maxPowerKw: number;
    pricePerKwh: number;
    estimatedChargeTimeMin: number;
    estimatedCost: number;
    amenities: string[];
    lat: number;
    lng: number;
    rating: number;
}

const amenityEmojis: Record<string, string> = {
    wifi: '📶', cafe: '☕', restroom: '🚻', parking: '🅿️',
    food: '🍔', shopping: '🛒', ac_waiting: '❄️', lounge: '🛋️',
};

export default function TripStopCard({ stop, index }: { stop: ChargingStop; index: number }) {
    const handleNavigate = () => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lng}`, '_blank');
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all group"
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0 mr-3">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                            {index + 1}
                        </span>
                        <h4 className="font-bold text-gray-900 truncate text-sm">{stop.name}</h4>
                    </div>
                    <p className="text-gray-500 text-xs ml-9 truncate">{stop.address}</p>
                </div>
                {stop.rating > 0 && (
                    <span className="flex-shrink-0 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                        ⭐ {stop.rating}
                    </span>
                )}
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-3 mb-3 ml-9 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 rounded-lg text-xs font-semibold text-emerald-700">
                    ⚡ {stop.maxPowerKw} kW
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 rounded-lg text-xs font-semibold text-blue-700">
                    🔌 {stop.connectorType}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-50 rounded-lg text-xs font-semibold text-violet-700">
                    ⏱️ {stop.estimatedChargeTimeMin} min
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 rounded-lg text-xs font-semibold text-gray-600">
                    ₹{stop.estimatedCost}
                </span>
            </div>

            {/* Amenities */}
            {stop.amenities.length > 0 && (
                <div className="flex gap-1.5 mb-3 ml-9 flex-wrap">
                    {stop.amenities.map((am) => (
                        <span key={am} className="px-2 py-0.5 bg-gray-50 rounded text-[10px] font-medium text-gray-500 border border-gray-100">
                            {amenityEmojis[am] || '✓'} {am.replace('_', ' ')}
                        </span>
                    ))}
                </div>
            )}

            {/* Distance + Navigate */}
            <div className="flex items-center justify-between ml-9">
                <span className="text-xs text-gray-400 font-medium">
                    📍 {stop.distanceFromStart} km from start
                </span>
                <button
                    onClick={handleNavigate}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-emerald-50 rounded-lg text-xs font-semibold text-gray-700 hover:text-emerald-700 transition-colors flex items-center gap-1"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Navigate
                </button>
            </div>
        </motion.div>
    );
}
