import Head from 'next/head';
import { ReactNode } from 'react';
import Link from 'next/link';

interface ConsumerLayoutProps {
    children: ReactNode;
    title?: string;
    showSearch?: boolean;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
}

export default function ConsumerLayout({
    children,
    title = 'Find Charging Station',
    showSearch = true,
    searchQuery = '',
    onSearchChange,
}: ConsumerLayoutProps) {
    return (
        <div className="relative h-screen w-full overflow-hidden bg-gray-50 text-gray-900 font-sans">
            <Head>
                <title>{title} | ChargeConnect</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
            </Head>

            {/* Top Floating Bar */}
            {showSearch && (
                <div className="absolute top-4 left-4 right-4 z-20 flex gap-2">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            placeholder="Search stations by name or location..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/95 backdrop-blur-lg shadow-lg border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-emerald-500 text-sm font-medium outline-none"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => onSearchChange?.('')}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    <Link href="/" className="p-3 bg-white/95 backdrop-blur-lg rounded-xl shadow-lg ring-1 ring-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </Link>
                </div>
            )}

            {/* Main Content (Map) */}
            <main className="h-full w-full">
                {children}
            </main>

            {/* Bottom Navigation */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 z-10 flex justify-around py-3 md:hidden safe-bottom">
                <Link href="/map" className="flex flex-col items-center text-emerald-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <span className="text-xs font-medium mt-1">Map</span>
                </Link>
                <Link href="/trip-planner" className="flex flex-col items-center text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <span className="text-xs font-medium mt-1">Trip</span>
                </Link>
                <Link href="/" className="flex flex-col items-center text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-xs font-medium mt-1">Home</span>
                </Link>
                <Link href="/login" className="flex flex-col items-center text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs font-medium mt-1">Account</span>
                </Link>
            </div>
        </div>
    );
}
