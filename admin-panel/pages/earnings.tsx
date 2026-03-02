import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../lib/auth';
import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IndianRupee, TrendingUp, Calendar, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Earnings() {
    const { profile } = useAuth(true);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [monthlyRevenue, setMonthlyRevenue] = useState(0);
    const [avgPerSession, setAvgPerSession] = useState(0);
    const pageSize = 10;

    useEffect(() => {
        if (profile) fetchEarnings();
    }, [profile, page]);

    const fetchEarnings = async () => {
        setLoading(true);
        try {
            // Get owner's station IDs
            const { data: stations } = await supabase
                .from('charging_stations')
                .select('id')
                .eq('owner_id', profile!.id);

            const stationIds = stations?.map(s => s.id) || [];
            if (stationIds.length === 0) {
                setLoading(false);
                return;
            }

            // Get charger IDs
            const { data: chargers } = await supabase
                .from('chargers')
                .select('id')
                .in('station_id', stationIds);

            const chargerIds = chargers?.map(c => c.id) || [];
            if (chargerIds.length === 0) {
                setLoading(false);
                return;
            }

            // All paid transactions
            const { data: allTxns } = await supabase
                .from('transactions')
                .select('*')
                .in('charger_id', chargerIds)
                .eq('status', 'paid')
                .order('created_at', { ascending: false });

            const txns = allTxns || [];
            const total = txns.reduce((s, t) => s + (t.amount || 0), 0);
            setTotalRevenue(total);

            // This month
            const now = new Date();
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const monthly = txns.filter(t => new Date(t.created_at) >= monthStart).reduce((s, t) => s + (t.amount || 0), 0);
            setMonthlyRevenue(monthly);
            setAvgPerSession(txns.length > 0 ? Math.round(total / txns.length) : 0);

            // Paginated
            setTransactions(txns.slice(page * pageSize, (page + 1) * pageSize));

            // Chart data - last 30 days
            const days: Record<string, number> = {};
            for (let i = 29; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                days[d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })] = 0;
            }
            txns.forEach(t => {
                const key = new Date(t.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
                if (key in days) days[key] += t.amount || 0;
            });
            setChartData(Object.entries(days).map(([name, revenue]) => ({ name, revenue })));

        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
                <p className="text-gray-500 mt-1">Track your revenue and transaction history</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <IndianRupee className="w-5 h-5 text-emerald-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Total Revenue</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-cyan-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">This Month</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">₹{monthlyRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-violet-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Avg per Session</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">₹{avgPerSession}</p>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
                        <p className="text-sm text-gray-500">Last 30 days</p>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                        <TrendingUp className="w-4 h-4" />
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#9ca3af" interval={4} />
                        <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
                            formatter={(value: number) => [`₹${value}`, 'Revenue']}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#earningsGradient)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction History</h3>
                {transactions.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <IndianRupee className="w-7 h-7 text-gray-300" />
                        </div>
                        <p className="text-gray-500">No transactions yet</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <th className="pb-3 pr-4">Date</th>
                                        <th className="pb-3 pr-4">Amount</th>
                                        <th className="pb-3 pr-4">Energy</th>
                                        <th className="pb-3 pr-4">Status</th>
                                        <th className="pb-3">Duration</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {transactions.map((txn) => (
                                        <tr key={txn.id} className="text-sm">
                                            <td className="py-3 pr-4 text-gray-700">{new Date(txn.created_at).toLocaleDateString()}</td>
                                            <td className="py-3 pr-4 font-semibold text-gray-900">₹{txn.amount}</td>
                                            <td className="py-3 pr-4 text-gray-600">{txn.units_consumed_kwh || 0} kWh</td>
                                            <td className="py-3 pr-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${txn.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                                    {txn.status}
                                                </span>
                                            </td>
                                            <td className="py-3 text-gray-500">
                                                {txn.started_at && txn.completed_at
                                                    ? `${Math.round((new Date(txn.completed_at).getTime() - new Date(txn.started_at).getTime()) / 60000)} min`
                                                    : '-'
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                            <button
                                onClick={() => setPage(Math.max(0, page - 1))}
                                disabled={page === 0}
                                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-30"
                            >
                                <ChevronLeft className="w-4 h-4" /> Previous
                            </button>
                            <span className="text-sm text-gray-500">Page {page + 1}</span>
                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={transactions.length < pageSize}
                                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-30"
                            >
                                Next <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
}
