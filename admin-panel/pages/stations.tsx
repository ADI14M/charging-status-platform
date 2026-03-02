import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../lib/auth';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, Zap, Star, Trash2, Plus, Search, Eye } from 'lucide-react';

export default function MyStations() {
    const { profile } = useAuth(true);
    const [stations, setStations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (profile) fetchStations();
    }, [profile]);

    const fetchStations = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('charging_stations')
            .select('*, chargers(id, connector_type, max_power_kw, price_per_kwh)')
            .eq('owner_id', profile!.id)
            .order('created_at', { ascending: false });

        setStations(data || []);
        setLoading(false);
    };

    const deleteStation = async (id: string) => {
        if (!confirm('Are you sure you want to delete this station? This cannot be undone.')) return;
        await supabase.from('charging_stations').delete().eq('id', id);
        setStations(stations.filter(s => s.id !== id));
    };

    const filteredStations = stations.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.address.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || s.status === filter;
        return matchesSearch && matchesFilter;
    });

    const statusColors: Record<string, string> = {
        active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        pending_approval: 'bg-amber-50 text-amber-700 border-amber-200',
        suspended: 'bg-red-50 text-red-700 border-red-200',
        maintenance: 'bg-blue-50 text-blue-700 border-blue-200',
    };

    return (
        <Layout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Stations</h1>
                    <p className="text-gray-500 mt-1">{stations.length} station{stations.length !== 1 ? 's' : ''} registered</p>
                </div>
                <Link
                    href="/stations/add"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-5 py-2.5 rounded-xl font-medium hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    Add New Station
                </Link>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search stations..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm"
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'active', 'pending_approval', 'maintenance'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {f === 'all' ? 'All' : f.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500 border-t-transparent mx-auto mb-4" />
                    <p className="text-gray-500">Loading stations...</p>
                </div>
            ) : filteredStations.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {search || filter !== 'all' ? 'No stations match' : 'No stations yet'}
                    </h3>
                    <p className="text-gray-500 mb-6">
                        {search || filter !== 'all' ? 'Try a different search or filter' : 'Add your first charging station to get started'}
                    </p>
                    {!search && filter === 'all' && (
                        <Link href="/stations/add" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium">
                            <Plus className="w-5 h-5" />
                            Add your first station
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredStations.map((station) => (
                        <div key={station.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                            <Zap className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{station.name}</h3>
                                            <p className="text-gray-500 text-sm mt-0.5">{station.address}</p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${statusColors[station.status] || 'bg-gray-50 text-gray-600'}`}>
                                                    {station.status?.replace('_', ' ')}
                                                </span>
                                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                                    <Zap className="w-3 h-3" />
                                                    {station.chargers?.length || 0} charger{(station.chargers?.length || 0) !== 1 ? 's' : ''}
                                                </span>
                                                {station.avg_rating > 0 && (
                                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                                        {station.avg_rating}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/stations/${station.id}`}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View
                                    </Link>
                                    <button
                                        onClick={() => deleteStation(station.id)}
                                        className="p-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                        title="Delete station"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    );
}
