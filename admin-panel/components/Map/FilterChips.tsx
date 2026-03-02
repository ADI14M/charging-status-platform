import { useState } from 'react';

interface FilterChipsProps {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
}

export default function FilterChips({ activeFilter, onFilterChange }: FilterChipsProps) {
    const filters = ['All', 'Available', 'Fast Charge', 'Nearest'];

    return (
        <div className="absolute top-20 left-4 right-4 z-10 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map((filter) => (
                <button
                    key={filter}
                    onClick={() => onFilterChange(filter)}
                    className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm whitespace-nowrap transition-all ${activeFilter === filter
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-100'
                        : 'bg-white/95 backdrop-blur text-gray-700 border border-gray-200 hover:bg-gray-50'
                        }`}
                >
                    {filter === 'Available' && '🟢 '}
                    {filter === 'Fast Charge' && '⚡ '}
                    {filter === 'Nearest' && '📍 '}
                    {filter}
                </button>
            ))}
        </div>
    );
}
