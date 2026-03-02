import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth';
import { LayoutDashboard, CheckCircle, Wallet, LogOut, MapPin, Plus, User, ChevronRight } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
    const { profile, signOut, loading } = useAuth(true);
    const router = useRouter();

    if (loading || !profile) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-500 border-t-transparent mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    const navItems = [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/stations', icon: MapPin, label: 'My Stations' },
        { href: '/earnings', icon: Wallet, label: 'Earnings' },
    ];

    if (profile.role === 'admin') {
        navItems.push({ href: '/admin/approvals', icon: CheckCircle, label: 'Approvals' });
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
                {/* Brand */}
                <div className="p-6 border-b border-gray-100">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                            Charge<span className="text-emerald-600">Connect</span>
                        </span>
                    </Link>
                </div>

                {/* User Info */}
                <div className="p-4 mx-4 mt-4 rounded-xl bg-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                            {profile.full_name?.charAt(0)?.toUpperCase() || profile.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{profile.full_name || 'User'}</p>
                            <p className="text-xs text-gray-500 truncate">{profile.email}</p>
                        </div>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="mt-6 flex flex-col space-y-1 px-4 flex-1">
                    {navItems.map(item => {
                        const isActive = router.pathname === item.href || router.pathname.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all ${isActive
                                    ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-emerald-600' : ''}`} />
                                {item.label}
                                {isActive && <ChevronRight className="ml-auto h-4 w-4 text-emerald-400" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={signOut}
                        className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 page-transition">
                    {children}
                </div>
            </main>
        </div>
    );
}
