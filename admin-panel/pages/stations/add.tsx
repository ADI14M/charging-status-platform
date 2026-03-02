import Layout from '../../components/Layout';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../lib/auth';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Plus, Trash2, MapPin, Zap, Save } from 'lucide-react';
import Link from 'next/link';

type ConnectorType = 'type2' | 'ccs2' | 'chademo' | 'gbt' | 'wall_socket';

interface ChargerInput {
    connector_type: ConnectorType;
    max_power_kw: number;
    price_per_kwh: number;
}

export default function AddStation() {
    const { profile } = useAuth(true);
    const router = useRouter();

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [amenities, setAmenities] = useState<string[]>([]);
    const [imageUrl, setImageUrl] = useState('');
    const [chargers, setChargers] = useState<ChargerInput[]>([
        { connector_type: 'ccs2', max_power_kw: 50, price_per_kwh: 18 }
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const amenityOptions = ['wifi', 'cafe', 'restroom', 'parking', 'food', 'shopping', 'ac_waiting'];

    const addCharger = () => {
        setChargers([...chargers, { connector_type: 'type2', max_power_kw: 7.2, price_per_kwh: 12 }]);
    };

    const removeCharger = (index: number) => {
        if (chargers.length <= 1) return;
        setChargers(chargers.filter((_, i) => i !== index));
    };

    const updateCharger = (index: number, field: keyof ChargerInput, value: any) => {
        const updated = [...chargers];
        updated[index] = { ...updated[index], [field]: value };
        setChargers(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;
        setError('');
        setLoading(true);

        try {
            const latitude = parseFloat(lat) || 28.6139;
            const longitude = parseFloat(lng) || 77.2090;

            // Insert station
            const { data: station, error: stationErr } = await supabase
                .from('charging_stations')
                .insert({
                    owner_id: profile.id,
                    name,
                    description,
                    address,
                    location: `POINT(${longitude} ${latitude})`,
                    images: imageUrl ? [imageUrl] : [],
                    amenities,
                    status: 'pending_approval',
                })
                .select()
                .single();

            if (stationErr) throw stationErr;

            // Insert chargers
            if (station) {
                const chargerInserts = chargers.map(c => ({
                    station_id: station.id,
                    connector_type: c.connector_type,
                    max_power_kw: c.max_power_kw,
                    price_per_kwh: c.price_per_kwh,
                }));

                const { error: chargerErr } = await supabase
                    .from('chargers')
                    .insert(chargerInserts);

                if (chargerErr) throw chargerErr;

                // Insert initial charger status
                const { data: insertedChargers } = await supabase
                    .from('chargers')
                    .select('id')
                    .eq('station_id', station.id);

                if (insertedChargers) {
                    await supabase.from('charger_status').insert(
                        insertedChargers.map(c => ({
                            charger_id: c.id,
                            current_status: 'offline' as const,
                        }))
                    );
                }
            }

            router.push('/stations');
        } catch (err: any) {
            setError(err.message || 'Failed to create station');
        }
        setLoading(false);
    };

    return (
        <Layout>
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <Link href="/stations" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Back to stations
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Add New Station</h1>
                    <p className="text-gray-500 mt-1">Fill in the details below. Your station will be reviewed before going live.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-emerald-600" />
                            Station Details
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Station Name *</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} required
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm"
                                    placeholder="e.g. GreenHub Charging Station" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                                <input type="text" value={address} onChange={e => setAddress(e.target.value)} required
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm"
                                    placeholder="Full street address" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm resize-none"
                                    placeholder="Any additional info for EV drivers..." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                                    <input type="number" step="any" value={lat} onChange={e => setLat(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm"
                                        placeholder="28.6139" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                                    <input type="number" step="any" value={lng} onChange={e => setLng(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm"
                                        placeholder="77.2090" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm"
                                    placeholder="https://example.com/station-photo.jpg" />
                            </div>
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h2>
                        <div className="flex flex-wrap gap-2">
                            {amenityOptions.map(am => (
                                <button key={am} type="button"
                                    onClick={() => setAmenities(prev => prev.includes(am) ? prev.filter(a => a !== am) : [...prev, am])}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${amenities.includes(am)
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                                        }`}
                                >
                                    {am.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chargers */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-cyan-600" />
                                Chargers
                            </h2>
                            <button type="button" onClick={addCharger}
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                            >
                                <Plus className="w-4 h-4" /> Add Charger
                            </button>
                        </div>
                        <div className="space-y-4">
                            {chargers.map((charger, idx) => (
                                <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-gray-700">Charger #{idx + 1}</span>
                                        {chargers.length > 1 && (
                                            <button type="button" onClick={() => removeCharger(idx)} className="text-red-400 hover:text-red-600">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Connector</label>
                                            <select
                                                value={charger.connector_type}
                                                onChange={e => updateCharger(idx, 'connector_type', e.target.value)}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                                            >
                                                <option value="ccs2">CCS2</option>
                                                <option value="type2">Type 2</option>
                                                <option value="chademo">CHAdeMO</option>
                                                <option value="gbt">GB/T</option>
                                                <option value="wall_socket">Wall Socket</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Power (kW)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={charger.max_power_kw}
                                                onChange={e => updateCharger(idx, 'max_power_kw', parseFloat(e.target.value))}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">₹/kWh</label>
                                            <input
                                                type="number"
                                                step="0.5"
                                                value={charger.price_per_kwh}
                                                onChange={e => updateCharger(idx, 'price_per_kwh', parseFloat(e.target.value))}
                                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-semibold hover:from-emerald-500 hover:to-emerald-400 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        {loading ? 'Creating Station...' : 'Submit for Review'}
                    </button>
                </form>
            </div>
        </Layout>
    );
}
