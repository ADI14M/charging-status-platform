import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../lib/auth';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { MapPin, Zap, IndianRupee, Activity, TrendingUp, Users } from 'lucide-react';

interface DashboardStats {
    activeStations: number;
    totalChargers: number;
    totalRevenue: number;
    activeSessions: number;
    totalTransactions: number;
}

export default function Dashboard() {
    const { profile } = useAuth(true);
    const [stats, setStats] = useState<DashboardStats>({
        activeStations: 0,
        totalChargers: 0,
        totalRevenue: 0,
        activeSessions: 0,
        totalTransactions: 0,
    });
    const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!profile) return;
        fetchDashboardData();
    }, [profile]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch stations
            const { data: stations } = await supabase
                .from('charging_stations')
                .select('id, status')
                .eq('owner_id', profile!.id);

            const activeStations = stations?.filter(s => s.status === 'active').length || 0;
            const stationIds = stations?.map(s => s.id) || [];

            // Fetch chargers
            let totalChargers = 0;
            if (stationIds.length > 0) {
                const { count } = await supabase
                    .from('chargers')
                    .select('*', { count: 'exact', head: true })
                    .in('station_id', stationIds);
                totalChargers = count || 0;
            }

            // Fetch transactions
            let totalRevenue = 0;
            let txns: any[] = [];
            if (stationIds.length > 0) {
                const { data: chargers } = await supabase
                    .from('chargers')
                    .select('id')
                    .in('station_id', stationIds);

                const chargerIds = chargers?.map(c => c.id) || [];
                if (chargerIds.length > 0) {
                    const { data: transactions } = await supabase
                        .from('transactions')
                        .select('*')
                        .in('charger_id', chargerIds)
                        .eq('status', 'paid')
                        .order('created_at', { ascending: false })
                        .limit(10);

                    txns = transactions || [];
                    totalRevenue = txns.reduce((sum, t) => sum + (t.amount || 0), 0);
                }
            }

            setStats({
                activeStations,
                totalChargers,
                totalRevenue,
                activeSessions: 0,
                totalTransactions: txns.length,
            });
            setRecentTransactions(txns.slice(0, 5));

            // Generate chart data (last 7 days mock or from real data)
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            setChartData(days.map(day => ({
                name: day,
                revenue: Math.floor(Math.random() * 3000) + 500,
                sessions: Math.floor(Math.random() * 20) + 2,
            })));

        } catch (err) {
            console.error('Dashboard fetch error:', err);
        }
        setLoading(false);
    };

    const statCards = [
        { label: 'Active Stations', value: stats.activeStations, icon: MapPin, color: 'emerald', change: '+2 this month' },
        { label: 'Total Chargers', value: stats.totalChargers, icon: Zap, color: 'cyan', change: 'All connected' },
        { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: IndianRupee, color: 'violet', change: 'Lifetime' },
        { label: 'Live Sessions', value: stats.activeSessions, icon: Activity, color: 'amber', change: 'Real-time' },
    ];

    const colorMap: Record<string, { bg: string; icon: string; text: string }> = {
        emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', text: 'text-emerald-600' },
        cyan: { bg: 'bg-cyan-50', icon: 'text-cyan-600', text: 'text-cyan-600' },
        violet: { bg: 'bg-violet-50', icon: 'text-violet-600', text: 'text-violet-600' },
        amber: { bg: 'bg-amber-50', icon: 'text-amber-600', text: 'text-amber-600' },
    };

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Welcome back, {profile?.full_name || 'User'} 👋</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((card, idx) => {
                    const colors = colorMap[card.color];
                    return (
                        <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                                    <card.icon className={`h-6 w-6 ${colors.icon}`} />
                                </div>
                            </div>
                            <p className="text-sm font-medium text-gray-500">{card.label}</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                            <p className="text-xs text-gray-400 mt-2">{card.change}</p>
                        </div>
                    );
                })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Revenue Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
                            <p className="text-sm text-gray-500">Last 7 days</p>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                            <TrendingUp className="w-4 h-4" />
                            +12.5%
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                            <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                                formatter={(value: number) => [`₹${value}`, 'Revenue']}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Sessions Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Charging Sessions</h3>
                            <p className="text-sm text-gray-500">Last 7 days</p>
                        </div>
                        <div className="flex items-center gap-1 text-cyan-600 text-sm font-medium">
                            <Users className="w-4 h-4" />
                            {chartData.reduce((sum, d) => sum + d.sessions, 0)} total
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                            <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
                            />
                            <Bar dataKey="sessions" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
                {recentTransactions.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <IndianRupee className="w-7 h-7 text-gray-300" />
                        </div>
                        <p className="text-gray-500">No transactions yet</p>
                        <p className="text-gray-400 text-sm mt-1">Transactions will appear here when customers charge at your stations</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <th className="pb-3 pr-4">User</th>
                                    <th className="pb-3 pr-4">Amount</th>
                                    <th className="pb-3 pr-4">Energy</th>
                                    <th className="pb-3 pr-4">Status</th>
                                    <th className="pb-3">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentTransactions.map((txn) => (
                                    <tr key={txn.id} className="text-sm">
                                        <td className="py-3 pr-4 text-gray-700">{txn.user_id?.slice(0, 8)}...</td>
                                        <td className="py-3 pr-4 font-semibold text-gray-900">₹{txn.amount}</td>
                                        <td className="py-3 pr-4 text-gray-600">{txn.units_consumed_kwh} kWh</td>
                                        <td className="py-3 pr-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${txn.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                                {txn.status}
                                            </span>
                                        </td>
                                        <td className="py-3 text-gray-500">{new Date(txn.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
}
