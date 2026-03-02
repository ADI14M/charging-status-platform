import { useState, useEffect, useCallback, useMemo } from 'react';
import ConsumerLayout from '../../components/ConsumerLayout';
import { supabase } from '../../lib/supabaseClient';
import StationDrawer from '../../components/Map/StationDrawer';
import FilterChips from '../../components/Map/FilterChips';
import ChargingModal from '../../components/Map/ChargingModal';
import Head from 'next/head';

const defaultCenter = { lat: 28.6139, lng: 77.2090 };

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Define fallback demo stations
const DEMO_STATIONS = [
    { id: '1', name: 'Cyber Hub Charging Station', address: 'DLF Cyber City, Gurugram, Haryana', lat: 28.4950, lng: 77.0895, status: 'active', description: 'Fast DC charging available in Basement B2.', amenities: ['parking', 'cafe', 'wifi', 'restroom'], avg_rating: 4.5, total_reviews: 48, chargers: [{ id: 'c1', connector_type: 'ccs2', max_power_kw: 60, price_per_kwh: 18, charger_status: [{ current_status: 'available' }] }, { id: 'c1b', connector_type: 'type2', max_power_kw: 22, price_per_kwh: 14, charger_status: [{ current_status: 'available' }] }] },
    { id: '2', name: 'Select City Walk EV Hub', address: 'Saket District Centre, New Delhi', lat: 28.5285, lng: 77.2192, status: 'active', description: 'Located near main entrance. Open 24/7.', amenities: ['parking', 'food', 'shopping', 'restroom'], avg_rating: 4.2, total_reviews: 35, chargers: [{ id: 'c2', connector_type: 'type2', max_power_kw: 22, price_per_kwh: 12, charger_status: [{ current_status: 'charging' }] }, { id: 'c2b', connector_type: 'ccs2', max_power_kw: 50, price_per_kwh: 16, charger_status: [{ current_status: 'available' }] }] },
    { id: '3', name: 'Connaught Place Power Station', address: 'Inner Circle, Connaught Place, New Delhi', lat: 28.6304, lng: 77.2177, status: 'active', description: 'Premium high-speed charging in CP inner circle.', amenities: ['cafe', 'wifi', 'ac_waiting'], avg_rating: 3.8, total_reviews: 22, chargers: [{ id: 'c3', connector_type: 'ccs2', max_power_kw: 120, price_per_kwh: 22, charger_status: [{ current_status: 'offline' }] }] },
    { id: '4', name: 'Noida Sector 18 Green Hub', address: 'Near Atta Market, Sector 18, Noida', lat: 28.5707, lng: 77.3260, status: 'active', description: 'Easy access from Sector 18 metro station.', amenities: ['parking', 'restroom', 'food'], avg_rating: 4.6, total_reviews: 67, chargers: [{ id: 'c4', connector_type: 'type2', max_power_kw: 7.2, price_per_kwh: 10, charger_status: [{ current_status: 'available' }] }, { id: 'c4b', connector_type: 'chademo', max_power_kw: 50, price_per_kwh: 15, charger_status: [{ current_status: 'available' }] }] },
    { id: '5', name: 'Dwarka Sector 21 Hub', address: 'Near Dwarka Sector 21 Metro, New Delhi', lat: 28.5535, lng: 77.0588, status: 'active', description: '24/7 available. Great for overnight charging.', amenities: ['parking', 'wifi'], avg_rating: 4.1, total_reviews: 19, chargers: [{ id: 'c5', connector_type: 'chademo', max_power_kw: 50, price_per_kwh: 16, charger_status: [{ current_status: 'available' }] }] },
    { id: '6', name: 'Aerocity Express Charge', address: 'Worldmark 1, Aerocity, New Delhi', lat: 28.5570, lng: 77.1153, status: 'active', description: 'Airport area fast charging. Ideal for cab drivers.', amenities: ['parking', 'cafe', 'restroom', 'wifi', 'food'], avg_rating: 4.7, total_reviews: 89, chargers: [{ id: 'c6', connector_type: 'ccs2', max_power_kw: 150, price_per_kwh: 24, charger_status: [{ current_status: 'charging' }] }, { id: 'c6b', connector_type: 'ccs2', max_power_kw: 150, price_per_kwh: 24, charger_status: [{ current_status: 'available' }] }] },
];

export default function ConsumerMapPage() {
    const [stations, setStations] = useState<any[]>([]);
    const [selectedStation, setSelectedStation] = useState<any | null>(null);
    const [userLocation, setUserLocation] = useState(defaultCenter);
    const [isCharging, setIsCharging] = useState(false);
    const [chargingStation, setChargingStation] = useState<any>(null);
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [chargerStatuses, setChargerStatuses] = useState<Record<string, any>>({});
    const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
                () => { }
            );
        }
        fetchStations();
        const unsub = subscribeToStatuses();
        return unsub;
    }, []);

    const fetchStations = async () => {
        try {
            const { data } = await supabase
                .from('charging_stations')
                .select('*, chargers(id, connector_type, max_power_kw, price_per_kwh, charger_status(current_status, last_seen_at))')
                .eq('status', 'active');

            if (data && data.length > 0) {
                const parsed = data.map(s => {
                    let lat = s.lat, lng = s.lng;
                    if (s.location && typeof s.location === 'string') {
                        const match = s.location.match(/POINT\(([-\d.]+)\s+([-\d.]+)\)/);
                        if (match) { lng = parseFloat(match[1]); lat = parseFloat(match[2]); }
                    }
                    if (s.location && typeof s.location === 'object') {
                        const coords = s.location.coordinates;
                        if (coords) { lng = coords[0]; lat = coords[1]; }
                    }
                    return { ...s, lat: lat || 28.6139, lng: lng || 77.2090 };
                });
                setStations(parsed);

                const statusMap: Record<string, any> = {};
                parsed.forEach(s => {
                    s.chargers?.forEach((c: any) => {
                        if (c.charger_status?.[0]) statusMap[c.id] = c.charger_status[0];
                    });
                });
                setChargerStatuses(statusMap);
            } else {
                setStations(DEMO_STATIONS);
            }
        } catch {
            setStations(DEMO_STATIONS);
        }
    };

    const subscribeToStatuses = () => {
        const channel = supabase
            .channel('charger-status-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'charger_status' }, (payload) => {
                const updated = payload.new as any;
                if (updated) setChargerStatuses(prev => ({ ...prev, [updated.charger_id]: updated }));
            })
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    };

    const getStationOverallStatus = (station: any): 'available' | 'engaged' | 'offline' => {
        const stationChargers = station.chargers || [];
        if (stationChargers.length === 0) return 'offline';
        const hasAvailable = stationChargers.some((c: any) => {
            const status = chargerStatuses[c.id]?.current_status || c.charger_status?.[0]?.current_status;
            return status === 'available';
        });
        if (hasAvailable) return 'available';
        const hasCharging = stationChargers.some((c: any) => {
            const status = chargerStatuses[c.id]?.current_status || c.charger_status?.[0]?.current_status;
            return status === 'charging' || status === 'preparation';
        });
        if (hasCharging) return 'engaged';
        return 'offline';
    };

    const processedStations = useMemo(() => {
        let filtered = stations.filter(s => {
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                if (!s.name.toLowerCase().includes(q) && !s.address.toLowerCase().includes(q)) return false;
            }
            if (activeFilter === 'Available') return getStationOverallStatus(s) === 'available';
            if (activeFilter === 'Fast Charge') return s.chargers?.some((c: any) => c.max_power_kw >= 50);
            return true;
        });
        filtered.sort((a, b) => {
            const distA = getDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
            const distB = getDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
            return distA - distB;
        });
        return filtered;
    }, [stations, activeFilter, searchQuery, userLocation, chargerStatuses]);

    const getMarkerColor = (station: any) => {
        const status = getStationOverallStatus(station);
        if (status === 'available') return '#10b981';
        if (status === 'engaged') return '#f59e0b';
        return '#ef4444';
    };

    const handleStartCharging = (stationId: string) => {
        const station = stations.find(s => s.id === stationId);
        setChargingStation(station);
        setSelectedStation(null);
        setIsCharging(true);
    };

    const handleNavigate = (station: any) => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`, '_blank');
    };

    const statusConfig: Record<string, { label: string; dot: string; bg: string; text: string }> = {
        available: { label: 'Available', dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
        engaged: { label: 'Engaged', dot: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700' },
        offline: { label: 'Offline', dot: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-600' },
    };

    return (
        <ConsumerLayout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
            <Head>
                <title>Find Charging Station | ChargeConnect</title>
            </Head>

            <div className="h-full w-full relative flex flex-col">
                {/* Filter row */}
                <FilterChips activeFilter={activeFilter} onFilterChange={setActiveFilter} />

                {/* View toggle */}
                <div className="absolute top-20 right-4 z-10 flex bg-white/95 backdrop-blur rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <button
                        onClick={() => setViewMode('map')}
                        className={`px-3 py-2 text-xs font-medium transition-all ${viewMode === 'map' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        🗺️ Map
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-2 text-xs font-medium transition-all ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        📋 List
                    </button>
                </div>

                {viewMode === 'list' ? (
                    /* LIST VIEW - Scrollable station cards */
                    <div className="flex-1 overflow-y-auto pt-28 pb-20 px-4">
                        <div className="max-w-lg mx-auto">
                            <p className="text-sm text-gray-500 mb-4 font-medium">
                                {processedStations.length} station{processedStations.length !== 1 ? 's' : ''} found nearby
                            </p>
                            <div className="space-y-3">
                                {processedStations.map(station => {
                                    const overallStatus = getStationOverallStatus(station);
                                    const config = statusConfig[overallStatus];
                                    const dist = getDistance(userLocation.lat, userLocation.lng, station.lat, station.lng);
                                    const lowestPrice = station.chargers?.length > 0
                                        ? Math.min(...station.chargers.map((c: any) => c.price_per_kwh || 99))
                                        : 0;
                                    const maxPower = station.chargers?.length > 0
                                        ? Math.max(...station.chargers.map((c: any) => c.max_power_kw || 0))
                                        : 0;
                                    const availCount = (station.chargers || []).filter((c: any) => {
                                        const s = chargerStatuses[c.id]?.current_status || c.charger_status?.[0]?.current_status;
                                        return s === 'available';
                                    }).length;

                                    return (
                                        <div
                                            key={station.id}
                                            onClick={() => setSelectedStation(station)}
                                            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md cursor-pointer transition-all active:scale-[0.99]"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1 min-w-0 mr-3">
                                                    <h3 className="font-bold text-gray-900 truncate">{station.name}</h3>
                                                    <p className="text-gray-500 text-xs mt-0.5 truncate">{station.address}</p>
                                                </div>
                                                <span className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold ${config.bg} ${config.text} flex items-center gap-1.5`}>
                                                    <span className={`w-2 h-2 rounded-full ${config.dot} ${overallStatus === 'available' ? 'animate-pulse' : ''}`} />
                                                    {config.label}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-4 text-xs">
                                                <span className="text-emerald-600 font-semibold">
                                                    📍 {dist < 1 ? `${Math.round(dist * 1000)}m` : `${dist.toFixed(1)} km`}
                                                </span>
                                                <span className="text-gray-500">⚡ {maxPower} kW</span>
                                                <span className="text-gray-500">₹{lowestPrice}/kWh</span>
                                                {station.avg_rating > 0 && (
                                                    <span className="text-gray-500">⭐ {station.avg_rating}</span>
                                                )}
                                                <span className="text-gray-400 ml-auto">{availCount}/{station.chargers?.length || 0} free</span>
                                            </div>

                                            {/* Charger types */}
                                            <div className="flex gap-1.5 mt-3">
                                                {(station.chargers || []).map((c: any, i: number) => {
                                                    const cStatus = chargerStatuses[c.id]?.current_status || c.charger_status?.[0]?.current_status || 'offline';
                                                    const dotColor = cStatus === 'available' ? 'bg-emerald-500' : cStatus === 'charging' ? 'bg-amber-500' : 'bg-gray-400';
                                                    return (
                                                        <span key={c.id || i} className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg text-[10px] font-medium text-gray-600 border border-gray-100">
                                                            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                                                            {c.connector_type?.toUpperCase()}
                                                        </span>
                                                    );
                                                })}
                                            </div>

                                            {/* Quick actions */}
                                            <div className="flex gap-2 mt-3">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleNavigate(station); }}
                                                    className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition-colors"
                                                >
                                                    🧭 Navigate
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleStartCharging(station.id); }}
                                                    disabled={availCount === 0}
                                                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:text-gray-500 rounded-xl text-xs font-semibold text-white transition-colors"
                                                >
                                                    ⚡ Start Charging
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                                {processedStations.length === 0 && (
                                    <div className="text-center py-16">
                                        <div className="text-4xl mb-3">🔌</div>
                                        <p className="font-semibold text-gray-900">No stations found</p>
                                        <p className="text-gray-500 text-sm mt-1">Try a different search or filter</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* MAP VIEW - Interactive visual map */
                    <div className="flex-1 relative bg-gradient-to-br from-emerald-50 via-gray-50 to-cyan-50 overflow-hidden">
                        {/* Decorative grid */}
                        <div className="absolute inset-0 opacity-[0.08]"
                            style={{ backgroundImage: 'radial-gradient(#64748b 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />

                        {/* "Map" roads/highways visual */}
                        <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
                            <line x1="0" y1="40%" x2="100%" y2="60%" stroke="#334155" strokeWidth="4" />
                            <line x1="20%" y1="0" x2="70%" y2="100%" stroke="#334155" strokeWidth="3" />
                            <line x1="60%" y1="0" x2="30%" y2="100%" stroke="#334155" strokeWidth="2" />
                            <circle cx="45%" cy="50%" r="80" stroke="#334155" strokeWidth="2" fill="none" />
                        </svg>

                        {/* Station markers */}
                        {processedStations.map((station, idx) => {
                            const color = getMarkerColor(station);
                            const dist = getDistance(userLocation.lat, userLocation.lng, station.lat, station.lng);
                            // Distribute stations in a grid-like pattern across the view
                            const cols = Math.ceil(Math.sqrt(processedStations.length));
                            const row = Math.floor(idx / cols);
                            const col = idx % cols;
                            const top = 22 + (row / Math.ceil(processedStations.length / cols)) * 55;
                            const left = 8 + (col / cols) * 80;

                            return (
                                <div key={station.id}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110 hover:z-20 z-10 group"
                                    style={{ top: `${top}%`, left: `${left}%` }}
                                    onClick={() => setSelectedStation(station)}
                                >
                                    <div className="flex flex-col items-center">
                                        {/* Pin */}
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-full border-[3px] border-white shadow-xl flex items-center justify-center text-white transition-shadow group-hover:shadow-2xl"
                                                style={{ backgroundColor: color }}>
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            {/* Pulse ring for available */}
                                            {getStationOverallStatus(station) === 'available' && (
                                                <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: color }} />
                                            )}
                                        </div>
                                        {/* Label */}
                                        <div className="mt-1.5 px-2.5 py-1 bg-white/95 backdrop-blur rounded-lg shadow-md border border-gray-100 text-center opacity-90 group-hover:opacity-100 transition-opacity">
                                            <p className="text-[11px] font-bold text-gray-800 whitespace-nowrap leading-tight">
                                                {station.name.length > 18 ? station.name.slice(0, 18) + '…' : station.name}
                                            </p>
                                            <p className="text-[9px] text-gray-500 font-medium">{dist.toFixed(1)} km · ₹{station.chargers?.[0]?.price_per_kwh || 15}/kWh</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* User location pulse */}
                        <div className="absolute top-[55%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-[5]">
                            <div className="relative">
                                <div className="w-5 h-5 bg-blue-500 border-[3px] border-white rounded-full shadow-lg" />
                                <div className="absolute inset-0 w-5 h-5 bg-blue-400 rounded-full animate-ping opacity-30" />
                            </div>
                            <div className="mt-1 px-2 py-0.5 bg-white/90 backdrop-blur rounded text-[9px] font-bold text-blue-600 shadow-sm whitespace-nowrap text-center -ml-2">
                                You
                            </div>
                        </div>

                        {/* Bottom station count */}
                        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 bg-white/95 backdrop-blur rounded-full shadow-lg px-5 py-2.5 border border-gray-100 md:bottom-4">
                            <p className="text-xs font-semibold text-gray-700">
                                {processedStations.length} station{processedStations.length !== 1 ? 's' : ''} nearby
                            </p>
                        </div>
                    </div>
                )}

                {/* Legend - always visible */}
                <div className="absolute bottom-20 right-4 z-10 bg-white/95 backdrop-blur rounded-xl shadow-lg p-3 border border-gray-100 md:bottom-4">
                    <div className="flex items-center gap-4 text-xs font-medium">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span className="text-gray-600">Available</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-amber-500" />
                            <span className="text-gray-600">Engaged</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <span className="text-gray-600">Offline</span>
                        </div>
                    </div>
                </div>

                {/* Station Details Drawer */}
                <StationDrawer
                    station={selectedStation}
                    onClose={() => setSelectedStation(null)}
                    onStartCharging={handleStartCharging}
                    onNavigate={handleNavigate}
                    userLocation={userLocation}
                    chargerStatuses={chargerStatuses}
                    getDistance={getDistance}
                />

                {/* Charging Modal */}
                <ChargingModal
                    isOpen={isCharging}
                    onClose={() => setIsCharging(false)}
                    station={chargingStation}
                />
            </div>
        </ConsumerLayout>
    );
}
