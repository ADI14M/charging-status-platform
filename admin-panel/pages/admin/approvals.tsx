import Layout from '../../components/Layout';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../lib/auth';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, MapPin, Eye, ChevronDown, RefreshCw, User } from 'lucide-react';

export default function StationApprovals() {
    const { profile } = useAuth(true, ['admin']);
    const [pendingStations, setPendingStations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [rejectingId, setRejectingId] = useState<string | null>(null);

    const fetchPending = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('charging_stations')
            .select('*, profiles!charging_stations_owner_id_fkey(email, full_name, phone_number)')
            .eq('status', 'pending_approval')
            .order('created_at', { ascending: false });
        setPendingStations(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const approveStation = async (id: string) => {
        // Direct update (admin can bypass RLS via service role, or adjust policy)
        await supabase
            .from('charging_stations')
            .update({ status: 'active' })
            .eq('id', id);
        setPendingStations(pendingStations.filter(s => s.id !== id));
    };

    const rejectStation = async (id: string) => {
        await supabase
            .from('charging_stations')
            .update({ status: 'suspended' })
            .eq('id', id);
        setPendingStations(pendingStations.filter(s => s.id !== id));
        setRejectingId(null);
        setRejectReason('');
    };

    return (
        <Layout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Pending Approvals</h1>
                    <p className="text-gray-500 mt-1">{pendingStations.length} station{pendingStations.length !== 1 ? 's' : ''} awaiting review</p>
                </div>
                <button
                    onClick={fetchPending}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 text-sm font-medium"
                >
                    <RefreshCw className="w-4 h-4" /> Refresh
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500 border-t-transparent mx-auto mb-4" />
                </div>
            ) : pendingStations.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">All caught up!</h3>
                    <p className="text-gray-500">No stations are pending approval right now.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {pendingStations.map((station) => (
                        <div key={station.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-6 h-6 text-amber-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{station.name}</h3>
                                            <p className="text-gray-500 text-sm">{station.address}</p>
                                            {station.profiles && (
                                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                                                    <User className="w-3 h-3" />
                                                    {station.profiles.full_name || station.profiles.email}
                                                    {station.profiles.phone_number && ` · ${station.profiles.phone_number}`}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setExpandedId(expandedId === station.id ? null : station.id)}
                                            className="p-2 rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100"
                                        >
                                            <ChevronDown className={`w-5 h-5 transition-transform ${expandedId === station.id ? 'rotate-180' : ''}`} />
                                        </button>
                                        <button
                                            onClick={() => approveStation(station.id)}
                                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-medium"
                                        >
                                            <CheckCircle className="w-4 h-4" /> Approve
                                        </button>
                                        <button
                                            onClick={() => setRejectingId(rejectingId === station.id ? null : station.id)}
                                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium"
                                        >
                                            <XCircle className="w-4 h-4" /> Reject
                                        </button>
                                    </div>
                                </div>

                                {/* Reject with reason */}
                                {rejectingId === station.id && (
                                    <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-100">
                                        <label className="block text-sm font-medium text-red-700 mb-2">Reason for rejection (optional)</label>
                                        <textarea
                                            value={rejectReason}
                                            onChange={e => setRejectReason(e.target.value)}
                                            rows={2}
                                            className="w-full px-3 py-2 rounded-lg border border-red-200 text-sm resize-none focus:outline-none focus:border-red-400"
                                            placeholder="Enter reason..."
                                        />
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => rejectStation(station.id)}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                                            >
                                                Confirm Reject
                                            </button>
                                            <button
                                                onClick={() => { setRejectingId(null); setRejectReason(''); }}
                                                className="px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 border border-gray-200"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Expanded Details */}
                            {expandedId === station.id && (
                                <div className="border-t border-gray-100 p-6 bg-gray-50">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Description</p>
                                            <p className="text-sm text-gray-700">{station.description || 'No description provided'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Amenities</p>
                                            <div className="flex flex-wrap gap-1">
                                                {(station.amenities || []).map((am: string) => (
                                                    <span key={am} className="px-2 py-1 bg-white rounded text-xs text-gray-600 border border-gray-200">
                                                        {am}
                                                    </span>
                                                ))}
                                                {(!station.amenities || station.amenities.length === 0) && (
                                                    <span className="text-sm text-gray-400">None listed</span>
                                                )}
                                            </div>
                                        </div>
                                        {station.images && station.images.length > 0 && (
                                            <div className="sm:col-span-2">
                                                <p className="text-xs font-medium text-gray-500 uppercase mb-2">Photos</p>
                                                <div className="flex gap-2">
                                                    {station.images.map((img: string) => (
                                                        <img key={img} src={img} alt="Station" className="h-24 w-24 rounded-xl object-cover border border-gray-200" />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    );
}
