import { useState } from 'react';
import { motion } from 'framer-motion';
import { searchCities, City } from '../../lib/tripData';

const CONNECTOR_TYPES = ['CCS2', 'Type2', 'CHAdeMO'];

interface TripFormProps {
    onPlanTrip: (start: string, end: string, range: number, connectors: string[]) => void;
    isLoading: boolean;
}

export default function TripForm({ onPlanTrip, isLoading }: TripFormProps) {
    const [startCity, setStartCity] = useState('');
    const [endCity, setEndCity] = useState('');
    const [vehicleRange, setVehicleRange] = useState(300);
    const [selectedConnectors, setSelectedConnectors] = useState<string[]>(['CCS2']);
    const [startSuggestions, setStartSuggestions] = useState<City[]>([]);
    const [endSuggestions, setEndSuggestions] = useState<City[]>([]);
    const [showStartDropdown, setShowStartDropdown] = useState(false);
    const [showEndDropdown, setShowEndDropdown] = useState(false);

    const handleStartChange = (val: string) => {
        setStartCity(val);
        setStartSuggestions(searchCities(val));
        setShowStartDropdown(true);
    };

    const handleEndChange = (val: string) => {
        setEndCity(val);
        setEndSuggestions(searchCities(val));
        setShowEndDropdown(true);
    };

    const toggleConnector = (c: string) => {
        setSelectedConnectors(prev =>
            prev.includes(c) ? (prev.length > 1 ? prev.filter(x => x !== c) : prev) : [...prev, c]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (startCity && endCity && startCity !== endCity) {
            onPlanTrip(startCity, endCity, vehicleRange, selectedConnectors);
        }
    };

    const swapCities = () => {
        const temp = startCity;
        setStartCity(endCity);
        setEndCity(temp);
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl mx-auto"
        >
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/60 border border-gray-100 p-6 sm:p-8">
                {/* City Inputs */}
                <div className="space-y-3 mb-6">
                    {/* Start City */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                        </div>
                        <input
                            type="text"
                            value={startCity}
                            onChange={(e) => handleStartChange(e.target.value)}
                            onFocus={() => { setShowStartDropdown(true); setStartSuggestions(searchCities(startCity)); }}
                            onBlur={() => setTimeout(() => setShowStartDropdown(false), 200)}
                            placeholder="Starting city (e.g. Bangalore)"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl text-sm font-medium text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all border border-gray-100"
                        />
                        {showStartDropdown && startSuggestions.length > 0 && (
                            <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-30 overflow-hidden max-h-64 overflow-y-auto">
                                {startSuggestions.map(city => (
                                    <button
                                        key={city.name + city.state}
                                        type="button"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => { setStartCity(city.name); setShowStartDropdown(false); }}
                                        className="w-full text-left px-4 py-3 text-sm hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center justify-between"
                                    >
                                        <span className="font-medium text-gray-700">📍 {city.name}</span>
                                        <span className="text-xs text-gray-400">{city.state}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Swap Button */}
                    <div className="flex justify-center -my-1">
                        <button
                            type="button"
                            onClick={swapCities}
                            className="w-10 h-10 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 hover:shadow transition-all flex items-center justify-center text-gray-400 hover:text-emerald-600"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                            </svg>
                        </button>
                    </div>

                    {/* End City */}
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                            <div className="w-3 h-3 rounded-full bg-cyan-500 ring-4 ring-cyan-100" />
                        </div>
                        <input
                            type="text"
                            value={endCity}
                            onChange={(e) => handleEndChange(e.target.value)}
                            onFocus={() => { setShowEndDropdown(true); setEndSuggestions(searchCities(endCity)); }}
                            onBlur={() => setTimeout(() => setShowEndDropdown(false), 200)}
                            placeholder="Destination city (e.g. Mysuru)"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl text-sm font-medium text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all border border-gray-100"
                        />
                        {showEndDropdown && endSuggestions.length > 0 && (
                            <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-30 overflow-hidden max-h-64 overflow-y-auto">
                                {endSuggestions.map(city => (
                                    <button
                                        key={city.name + city.state}
                                        type="button"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => { setEndCity(city.name); setShowEndDropdown(false); }}
                                        className="w-full text-left px-4 py-3 text-sm hover:bg-cyan-50 hover:text-cyan-700 transition-colors flex items-center justify-between"
                                    >
                                        <span className="font-medium text-gray-700">📍 {city.name}</span>
                                        <span className="text-xs text-gray-400">{city.state}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Vehicle Range Slider */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-semibold text-gray-700">Vehicle Range</label>
                        <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">{vehicleRange} km</span>
                    </div>
                    <input
                        type="range"
                        min={100}
                        max={500}
                        step={10}
                        value={vehicleRange}
                        onChange={(e) => setVehicleRange(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-medium mt-1">
                        <span>100 km</span>
                        <span>300 km</span>
                        <span>500 km</span>
                    </div>
                </div>

                {/* Connector Type Chips */}
                <div className="mb-6">
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Connector Type</label>
                    <div className="flex gap-2 flex-wrap">
                        {CONNECTOR_TYPES.map(c => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => toggleConnector(c)}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedConnectors.includes(c)
                                        ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500/30'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                            >
                                🔌 {c}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={!startCity || !endCity || startCity === endCity || isLoading}
                    className="w-full py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-2xl font-bold text-base hover:from-emerald-500 hover:to-cyan-500 disabled:from-gray-300 disabled:to-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.99] flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Planning your route...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            Plan My Trip
                        </>
                    )}
                </button>
            </div>
        </motion.form>
    );
}
