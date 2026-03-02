import Layout from '../../components/Layout';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../lib/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeft, Zap, Star, MapPin, Plus, Trash2, Save, MessageCircle, CheckCircle, XCircle } from 'lucide-react';

export default function StationDetail() {
    const { profile } = useAuth(true);
    const router = useRouter();
    const { id } = router.query;

    const [station, setStation] = useState<any>(null);
    const [chargers, setChargers] = useState<any[]>([]);
    const [statuses, setStatuses] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editAddress, setEditAddress] = useState('');
    const [editDesc, setEditDesc] = useState('');

    useEffect(() => {
        if (id && profile) fetchAll();
    }, [id, profile]);

    const fetchAll = async () => {
        setLoading(true);
        const { data: stationData } = await supabase
            .from('charging_stations')
            .select('*')
            .eq('id', id)
            .single();

        if (stationData) {
            setStation(stationData);
            setEditName(stationData.name);
            setEditAddress(stationData.address);
            setEditDesc(stationData.description || '');

            const { data: chargerData } = await supabase
                .from('chargers')
                .select('*, charger_status(*)')
                .eq('station_id', id);

            setChargers(chargerData || []);

            const { data: reviewData } = await supabase
                .from('reviews')
                .select('*')
                .eq('station_id', id)
                .order('created_at', { ascending: false })
                .limit(10);

            setReviews(reviewData || []);
        }
        setLoading(false);
    };

    const saveEdit = async () => {
        await supabase.from('charging_stations').update({
            name: editName,
            address: editAddress,
            description: editDesc,
        }).eq('id', id);
        setStation({ ...station, name: editName, address: editAddress, description: editDesc });
        setEditing(false);
    };

    const deleteCharger = async (chargerId: string) => {
        if (!confirm('Delete this charger?')) return;
        await supabase.from('chargers').delete().eq('id', chargerId);
        setChargers(chargers.filter(c => c.id !== chargerId));
    };

    const statusColors: Record<string, string> = {
        available: 'bg-emerald-100 text-emerald-700',
        charging: 'bg-amber-100 text-amber-700',
        preparation: 'bg-blue-100 text-blue-700',
        offline: 'bg-gray-100 text-gray-600',
        error: 'bg-red-100 text-red-700',
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center py-32">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500 border-t-transparent" />
                </div>
            </Layout>
        );
    }

    if (!station) {
        return (
            <Layout>
                <div className="text-center py-32">
                    <p className="text-gray-500">Station not found</p>
                    <Link href="/stations" className="text-emerald-600 hover:text-emerald-700 mt-2 inline-block">
                        ← Back to stations
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                <Link href="/stations" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    Back to stations
                </Link>

                {/* Station Header */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                    {editing ? (
                        <div className="space-y-4">
                            <input value={editName} onChange={e => setEditName(e.target.value)}
                                className="w-full text-2xl font-bold px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none" />
                            <input value={editAddress} onChange={e => setEditAddress(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-sm" />
                            <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={2}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 outline-none text-sm resize-none" />
                            <div className="flex gap-2">
                                <button onClick={saveEdit}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 flex items-center gap-1.5"
                                >
                                    <Save className="w-4 h-4" /> Save
                                </button>
                                <button onClick={() => setEditing(false)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{station.name}</h1>
                                <p className="text-gray-500 mt-1 flex items-center gap-1"><MapPin className="w-4 h-4" /> {station.address}</p>
                                {station.description && <p className="text-gray-600 text-sm mt-2">{station.description}</p>}
                                <div className="flex items-center gap-3 mt-3">
                                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${station.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                        {station.status?.replace('_', ' ')}
                                    </span>
                                    {station.avg_rating > 0 && (
                                        <span className="flex items-center gap-1 text-sm text-gray-600">
                                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {station.avg_rating} ({station.total_reviews} reviews)
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button onClick={() => setEditing(true)}
                                className="px-4 py-2 bg-gray-50 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-100 border border-gray-200"
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </div>

                {/* Chargers */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-cyan-600" /> Chargers ({chargers.length})
                        </h2>
                    </div>
                    {chargers.length === 0 ? (
                        <p className="text-gray-500 text-sm">No chargers added yet.</p>
                    ) : (
                        <div className="grid gap-3">
                            {chargers.map(charger => {
                                const status = charger.charger_status?.[0]?.current_status || 'offline';
                                return (
                                    <div key={charger.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-3 h-3 rounded-full ${status === 'available' ? 'bg-emerald-500' : status === 'charging' ? 'bg-amber-500' : 'bg-gray-400'}`} />
                                            <div>
                                                <p className="font-medium text-gray-900">{charger.connector_type?.toUpperCase()}</p>
                                                <p className="text-xs text-gray-500">{charger.max_power_kw} kW · ₹{charger.price_per_kwh}/kWh</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-600'}`}>
                                                {status}
                                            </span>
                                            <button onClick={() => deleteCharger(charger.id)} className="text-red-400 hover:text-red-600 p-1">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Reviews */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                        <MessageCircle className="w-5 h-5 text-violet-600" /> Reviews ({reviews.length})
                    </h2>
                    {reviews.length === 0 ? (
                        <p className="text-gray-500 text-sm">No reviews yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map(review => (
                                <div key={review.id} className="p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <Star key={s} className={`w-4 h-4 ${s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                                    </div>
                                    {review.comment && <p className="text-sm text-gray-700">{review.comment}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
